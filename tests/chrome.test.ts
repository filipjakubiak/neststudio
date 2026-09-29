import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { CHROME, frameFor, frameUrl, nearestLoaded, nextToLoad, sectionOrder, wantedFrames } from '@/lib/chrome/frames';

describe('chrome sequence (D15)', () => {
  it('manifest matches the files on disk and stays within budget', () => {
    const root = path.resolve(__dirname, '..', 'public');
    for (const id of ['d', 'm'] as const) {
      const dir = path.join(root, 'chrome', id);
      const files = fs.readdirSync(dir).filter((f) => f.endsWith('.webp'));
      expect(files.length).toBe(CHROME.frames);
      const bytes = files.reduce((a, f) => a + fs.statSync(path.join(dir, f)).size, 0);
      expect(bytes).toBeLessThanOrEqual(id === 'd' ? 3.5e6 : 1.5e6);
    }
    for (const p of Object.values(CHROME.posters)) expect(fs.statSync(path.join(root, p)).size).toBeLessThan(20_000);
  });

  it('sections cover the whole journey in page order', () => {
    const ids = sectionOrder();
    expect(ids[0]).toBe('hero');
    expect(ids[ids.length - 1]).toBe('contact');
    expect(CHROME.sections.hero[0]).toBe(0);
    expect(CHROME.sections.contact[1]).toBe(CHROME.frames - 1);
    for (let i = 1; i < ids.length; i++) expect(CHROME.sections[ids[i]][0]).toBe(CHROME.sections[ids[i - 1]][1]);
  });

  it('maps section progress to frames', () => {
    const [a, b] = CHROME.sections.showreel;
    expect(frameFor('showreel', 0)).toBe(a);
    expect(frameFor('showreel', 1)).toBe(b);
    expect(frameFor('showreel', 2)).toBe(b);
    expect(frameUrl('d', 7)).toMatch(/^\/chrome\/d\/007\.webp\?v=/);
  });

  it('loads frames nearest to the scroll position first, fewer on slow connections', () => {
    const all = wantedFrames(10, 1);
    expect(all).toHaveLength(10);
    const half = wantedFrames(10, 2);
    expect(half).toEqual([0, 2, 4, 6, 8, 9]);
    const done = new Set([5]);
    expect(nextToLoad(all, (i) => done.has(i), 5, 1)).toBe(6);
    expect(nextToLoad(all, (i) => done.has(i), 5, -1)).toBe(4);
    expect(nextToLoad(all, () => true, 5)).toBeNull();
  });

  it('falls back to the nearest loaded frame', () => {
    const loaded = new Set([0, 9]);
    expect(nearestLoaded(3, 10, (i) => loaded.has(i))).toBe(0);
    expect(nearestLoaded(7, 10, (i) => loaded.has(i))).toBe(9);
    expect(nearestLoaded(4, 10, () => false)).toBeNull();
  });
});
