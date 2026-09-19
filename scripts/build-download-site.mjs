#!/usr/bin/env node

import { cp, lstat, mkdir, mkdtemp, readFile, realpath, rename, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { parseCliArgs } from './desktop-release-utils.mjs';

export const PROJECT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUTPUT_MARKER = '.cineharbor-download-site-build';

function isWithin(parent, child) {
  const relative = path.relative(parent, child);
  return relative === '' || (!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative));
}

async function canonicalPath(candidate) {
  try {
    return await realpath(candidate);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    const parent = path.dirname(candidate);
    if (parent === candidate) throw error;
    return path.join(await canonicalPath(parent), path.basename(candidate));
  }
}

async function assertSafeOutput(projectRoot, outputRoot) {
  const canonicalProject = await realpath(projectRoot);
  const canonicalOutput = await canonicalPath(outputRoot);
  const reserved = ['assets', 'scripts', 'src', 'tests', '.git', '.github', '.agnir'];
  if (isWithin(canonicalOutput, canonicalProject) || reserved.some((name) => isWithin(path.join(canonicalProject, name), canonicalOutput))) {
    throw new Error('Unsafe output directory: source directories and their ancestors cannot be replaced.');
  }
  try {
    const stat = await lstat(outputRoot);
    if (stat.isSymbolicLink() || !stat.isDirectory()) throw new Error('Output must be a directory, not a symlink or file.');
    const marker = await readFile(path.join(outputRoot, OUTPUT_MARKER), 'utf8');
    if (marker.trim() !== canonicalProject) throw new Error('Output is owned by a different source repository.');
  } catch (error) {
    if (error.code === 'ENOENT') {
      // A missing directory is safe; an existing directory without our marker is not.
      try {
        await lstat(outputRoot);
      } catch (statError) {
        if (statError.code === 'ENOENT') return;
        throw statError;
      }
      throw new Error('Refusing to replace an existing directory without a build ownership marker.');
    }
    throw error;
  }
}

export function validateReleaseData(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data) || !Array.isArray(data.releases)) {
    throw new Error('Invalid release data: expected an object with a releases array.');
  }
  if (typeof data.repository !== 'string' || !/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(data.repository) || data.repository.split('/').some((part) => part === '.' || part === '..')) {
    throw new Error('Invalid release repository.');
  }
  return data;
}

export async function buildDownloadSite({ projectRoot = PROJECT_ROOT, output, data } = {}) {
  projectRoot = path.resolve(projectRoot);
  const outputRoot = path.resolve(output || path.join(projectRoot, 'download-site-dist'));
  const dataPath = path.resolve(data || path.join(projectRoot, 'assets', 'releases.template.json'));
  await assertSafeOutput(projectRoot, outputRoot);
  // Validate every input before changing the old output.
  const parsed = validateReleaseData(JSON.parse(await readFile(dataPath, 'utf8')));
  await readFile(path.join(projectRoot, 'index.html'), 'utf8');
  const assets = await lstat(path.join(projectRoot, 'assets'));
  if (!assets.isDirectory() || assets.isSymbolicLink()) throw new Error('Invalid site assets directory.');

  await mkdir(path.dirname(outputRoot), { recursive: true });
  const staging = await mkdtemp(path.join(path.dirname(outputRoot), '.cineharbor-site-'));
  try {
    // The split repository already IS the site. Never copy .git, tests, or the output back into itself.
    await cp(path.join(projectRoot, 'index.html'), path.join(staging, 'index.html'));
    await cp(path.join(projectRoot, 'assets'), path.join(staging, 'assets'), { recursive: true, dereference: false });
    await mkdir(path.join(staging, 'data'));
    await writeFile(path.join(staging, 'data', 'releases.json'), `${JSON.stringify(parsed, null, 2)}\n`, 'utf8');
    await writeFile(path.join(staging, '.nojekyll'), '\n', 'utf8');
    await writeFile(path.join(staging, OUTPUT_MARKER), `${await realpath(projectRoot)}\n`, 'utf8');
    await assertSafeOutput(projectRoot, outputRoot);
    await rm(outputRoot, { force: true, recursive: true });
    await rename(staging, outputRoot);
  } finally {
    await rm(staging, { force: true, recursive: true });
  }
  return { outputRoot, releaseCount: parsed.releases.length };
}

async function main() {
  const args = parseCliArgs(process.argv.slice(2));
  if (args.has('help')) {
    console.log('Usage: node scripts/build-download-site.mjs [--data <releases.json>] [--output <new-or-owned-dir>]');
    return;
  }
  for (const name of ['data', 'output']) {
    if (args.get(name) === 'true') throw new Error(`--${name} requires a path`);
  }
  const result = await buildDownloadSite({ output: args.get('output'), data: args.get('data') });
  console.log(JSON.stringify(result, null, 2));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
