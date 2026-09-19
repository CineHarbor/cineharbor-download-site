import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { access, mkdir, mkdtemp, readFile, readdir, rm, symlink, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { buildDownloadSite, PROJECT_ROOT, validateReleaseData } from '../../scripts/build-download-site.mjs';

async function fixture(t) {
  const root = await mkdtemp(path.join(os.tmpdir(), 'cineharbor-site-test-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const source = path.join(root, 'repo');
  await mkdir(path.join(source, 'assets'), { recursive: true });
  await writeFile(path.join(source, 'index.html'), '<!doctype html><title>Site</title>');
  await writeFile(path.join(source, 'assets', 'app.js'), 'console.log("site");');
  await writeFile(path.join(source, 'assets', 'releases.template.json'), JSON.stringify({ repository: 'CineHarbor/cineharbor-desktop', releases: [] }));
  return { root, source, output: path.join(root, 'output') };
}

test('standalone repository builds only static site files and supports a safe rebuild', async (t) => {
  const { source, output } = await fixture(t);
  await mkdir(path.join(source, '.git'));
  await writeFile(path.join(source, '.git', 'config'), 'must not ship');
  const result = await buildDownloadSite({ projectRoot: source, output });
  assert.equal(result.releaseCount, 0);
  assert.deepEqual((await readdir(output)).sort(), ['.cineharbor-download-site-build', '.nojekyll', 'assets', 'data', 'index.html']);
  await writeFile(path.join(output, 'stale.js'), 'old');
  await buildDownloadSite({ projectRoot: source, output });
  await assert.rejects(access(path.join(output, 'stale.js')));
});

test('CLI defaults are anchored to its repository, not the caller working directory', async (t) => {
  const { root, output } = await fixture(t);
  const result = JSON.parse(execFileSync(process.execPath, [path.join(PROJECT_ROOT, 'scripts/build-download-site.mjs'), '--output', output], { cwd: root, encoding: 'utf8' }));
  assert.equal(result.outputRoot, output);
  assert.equal(result.releaseCount, 0);
  assert.match(await readFile(path.join(output, 'index.html'), 'utf8'), /CineHarbor/);
});

test('source root, ancestors and reserved source folders cannot be outputs', async (t) => {
  const { root, source } = await fixture(t);
  for (const output of [root, source, path.join(source, 'assets'), path.join(source, 'assets', 'nested'), path.join(source, '.git')]) {
    await assert.rejects(buildDownloadSite({ projectRoot: source, output }), /Unsafe output/);
  }
  assert.match(await readFile(path.join(source, 'index.html'), 'utf8'), /Site/);
});

test('existing unrelated output is never erased', async (t) => {
  const { source, output } = await fixture(t);
  await mkdir(output);
  await writeFile(path.join(output, 'keep.txt'), 'precious');
  await assert.rejects(buildDownloadSite({ projectRoot: source, output }), /ownership marker/);
  assert.equal(await readFile(path.join(output, 'keep.txt'), 'utf8'), 'precious');
});

test('malformed or missing release data preserves an existing successful output', async (t) => {
  const { root, source, output } = await fixture(t);
  await buildDownloadSite({ projectRoot: source, output });
  const original = await readFile(path.join(output, 'data', 'releases.json'), 'utf8');
  const invalid = path.join(root, 'invalid.json');
  for (const content of ['{broken', '{}', '{"repository":"x/y","releases":null}']) {
    await writeFile(invalid, content);
    await assert.rejects(buildDownloadSite({ projectRoot: source, output, data: invalid }));
    assert.equal(await readFile(path.join(output, 'data', 'releases.json'), 'utf8'), original);
  }
  await assert.rejects(buildDownloadSite({ projectRoot: source, output, data: path.join(root, 'missing.json') }));
  assert.equal(await readFile(path.join(output, 'data', 'releases.json'), 'utf8'), original);
});

test('symlink outputs and symlinked paths into source are rejected', async (t) => {
  const { root, source, output } = await fixture(t);
  await symlink(path.join(source, 'assets'), output, 'dir');
  await assert.rejects(buildDownloadSite({ projectRoot: source, output }), /Unsafe output/);
  const link = path.join(root, 'source-alias');
  await symlink(source, link, 'dir');
  await assert.rejects(buildDownloadSite({ projectRoot: source, output: path.join(link, 'assets', 'nested') }), /Unsafe output/);
});

test('release data shape is enforced, including an explicit repository', () => {
  for (const value of [null, [], {}, { releases: [] }, { repository: '../bad', releases: [] }]) {
    assert.throws(() => validateReleaseData(value));
  }
  assert.equal(validateReleaseData({ repository: 'CineHarbor/cineharbor-desktop', releases: [] }).releases.length, 0);
});
