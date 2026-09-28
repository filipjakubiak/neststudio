export type Lang = 'pl' | 'en';

export type NodeType =
  | 'trigger' | 'read' | 'classify' | 'draft' | 'review'
  | 'crm' | 'email' | 'document' | 'calendar' | 'notify';

export interface FlowStep { node: NodeType; text: string }
export interface FlowPreset { id: string; label: string; steps: FlowStep[] }

export interface Project {
  slug: string;
  name: string;
  scope: string[];
  metric: string;
  metricLabel: string;
  year: string;
  summary: string;
  seed: number;
  placeholder: boolean;
}

export interface Content {
  lang: Lang;
  meta: { title: string; description: string; ogTitle: string };
  nav: {
    links: { label: string; href: string }[];
    cta: string;
    langLabel: string;
    menu: string;
    closeMenu: string;
    remote: string;
  };
  preloader: { loading: string; skip: string };
  hero: {
    eyebrow: string;
    lines: string[];
    lead: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  tension: {
    title: string;
    leftLabel: string;
    leftWord: string;
    rightLabel: string;
    rightWord: string;
    you: string;
    body: string;
    closing: string[];
  };
  showreel: {
    eyebrow: string;
    title: string;
    lead: string;
    cuts: { label: string; line: string }[];
    play: string;
    pause: string;
    playAria: string;
    pauseAria: string;
  };
  projects: { title: string; lead: string; askLink: string; items: Project[] };
  services: {
    eyebrow: string;
    title: string;
    items: { id: 'strategy' | 'brand' | 'web' | 'ai'; title: string; body: string }[];
    note: string;
  };
  aiDemo: {
    title: string;
    lead: string;
    run: string;
    status: { ready: string; running: string; done: string };
    note: string;
    nodeLabels: Record<NodeType, string>;
    presets: FlowPreset[];
    logAria: string;
  };
  process: { title: string; steps: { title: string; body: string }[] };
  studio: { title: string; p1: string; p2: string; years: string; since: string; photoAlt: string; photoPlaceholder: string };
  faq: { title: string; items: { q: string; a: string }[] };
  contact: { eyebrow: string; title: string; lead: string; cta: string; calendar: string; or: string };
  footer: {
    contact: string;
    data: string;
    social: string;
    ask: string;
    askPrompt: string;
    legal: string;
    privacy: string;
    country: string;
  };
  system: {
    skip: string;
    rail: string;
    reduced: string;
    noWebgl: string;
    notFound: string;
    backHome: string;
    placeholder: string;
  };
}
