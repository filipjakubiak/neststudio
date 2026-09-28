import { pl } from './pl';
import { en } from './en';
import type { Content, Lang } from './types';

export const content: Record<Lang, Content> = { pl, en };
export type { Content, Lang };
