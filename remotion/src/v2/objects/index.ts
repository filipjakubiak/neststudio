/* Registry of v2 section objects. Add an object here and it gets compositions for every variant. */
import type { ObjectDef } from '../stage';
import { splot } from './splot';
import { siatka } from './siatka';
import { kostka } from './kostka';
import { skaner } from './skaner';
import { przeplyw, proces } from './przeplyw';
import { gniazdo } from './gniazdo';

export const OBJECTS: ObjectDef[] = [splot, siatka, kostka, skaner, przeplyw, proces, gniazdo];
