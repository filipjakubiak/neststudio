/*
 * v2 light palette, measured on the reference render (docs/v2/source/referencja-render.mp4, 30.09):
 *   background #000000 · card hairline #150205 · band hot #EB2E2A · band mid #49181B
 *   comet core #F8CCB8 / #E7C180 · orange #B45123 · red #C22428 · tail #5F200A · ember #3A0007
 * Ramps are linear RGB (three.js Color from sRGB hex converts automatically).
 */
import { Color } from 'three';

export const HEX = {
  background: '#000000',
  hairline: '#150205',
  hot: '#EB2E2A',
  mid: '#49181B',
  core: '#F8CCB8',
  gold: '#E7C180',
  orange: '#B45123',
  red: '#C22428',
  tail: '#5F200A',
  ember: '#3A0007',
} as const;

export type Ramp = { core: Color; gold: Color; body: Color; tail: Color; light: Color };

export const RAMPS: Record<'red' | 'nest', Ramp> = {
  // default since 30.09: the reference, 1:1
  red: {
    core: new Color(HEX.core),
    gold: new Color(HEX.gold),
    body: new Color(HEX.hot),
    tail: new Color(HEX.ember),
    light: new Color(HEX.red),
  },
  // kept for comparison (first look-dev, Bone -> Rim Warm -> amber)
  nest: {
    core: new Color(1.0, 0.96, 0.9),
    gold: new Color(1.0, 0.72, 0.4),
    body: new Color(1.0, 0.48, 0.16),
    tail: new Color(0.45, 0.09, 0.01),
    light: new Color(1.0, 0.7, 0.45),
  },
};
