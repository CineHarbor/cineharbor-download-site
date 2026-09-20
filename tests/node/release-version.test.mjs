import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import data from '../../scripts/download-site-data.js';
const json = (name) => JSON.parse(readFileSync(new URL(`../../${name}`, import.meta.url), 'utf8'));
test('release preparation metadata has one version and canonical ownership', () => {
  const metadata = json('src/config/desktop-release.json');
  assert.equal(metadata.desktopVersion, json('package.json').version);
  assert.equal(metadata.desktopVersion, '1.0.0');
  assert.equal(metadata.releaseRepository, 'CineHarbor/cineharbor-desktop');
  assert.equal(metadata.updaterBranch, 'desktop-updater');
});
test('the preview template cannot advertise an unobserved release', () => {
  assert.deepEqual(json('assets/releases.template.json').releases, []);
});
test('a draft 1.0.0 candidate never replaces the real public 0.1.0 release', () => {
  const release = (version, draft) => ({ tag_name: `desktop-v${version}`, draft, assets: [{
    name: `CineHarbor.Desktop_${version}_windows-x64-setup.exe`,
    browser_download_url: `https://github.com/CineHarbor/cineharbor-desktop/releases/download/desktop-v${version}/CineHarbor.Desktop_${version}_windows-x64-setup.exe`,
  }] });
  const payload = data.buildDownloadSitePayload({ repository: 'CineHarbor/cineharbor-desktop', releases: [release('1.0.0', true), release('0.1.0', false)] });
  assert.deepEqual(payload.releases.map((r) => r.version), ['0.1.0']);
  assert.ok(payload.releases[0].assets[0].downloadUrl.includes('/desktop-v0.1.0/'));
});
