/*
 * Content model v2.1: the site follows the strategy document 1:1 (docs/v2/source/copywriting-strategia.html):
 * home (ch. 3), service pages (ch. 4), work / studio / contact (ch. 5), SEO (ch. 9).
 * One shape per language; tests keep pl and en in sync.
 */
export type Lang = 'pl' | 'en';

export type ObjectId = 'splot' | 'siatka' | 'kostka' | 'skaner' | 'przeplyw' | 'proces' | 'gniazdo';
export type ServiceId = 'branding' | 'web' | 'graphic' | 'automation' | 'ai';
export type PageId = 'home' | 'work' | 'studio' | 'contact' | ServiceId;

export type Meta = { title: string; description: string };
export type Link = { label: string; href: string };
/** A text block from the document: optional label, a heading in lines, paragraphs, an optional list. */
export type Block = { label?: string; title?: string[]; body?: string[]; list?: { term?: string; text: string }[] };

export type Project = {
  id: string;
  name: string;
  sentence: string;
  tags: string[];
  year: string;
  status: string;
  image: string;
  alt: string;
  href: string;
  services: ServiceId[];
};

export type Service = {
  id: ServiceId;
  name: string;
  object: ObjectId;
  meta: Meta;
  /** the card on the home page (3.5) */
  card: { title: string; body: string; scope: string[]; link: string };
  /** the service page (4.x): hero, client situation, scope, example, process, related, CTA */
  page: {
    title: string[];
    lead: string;
    blocks: Block[];
    related?: { text: string; link: string; to: ServiceId };
  };
};

export type Content = {
  lang: Lang;
  /** URL of every page in this language (the language switch maps page id to page id) */
  paths: Record<PageId, string>;
  system: {
    skip: string;
    navLabel: string;
    langLabel: string;
    menu: string;
    close: string;
    motionPause: string;
    motionPlay: string;
    placeholder: string;
    notFound: string;
    backHome: string;
    exampleLabel: string;
    proofLabel: string;
  };
  nav: { links: { label: string; page: PageId; hash?: string }[]; cta: string };
  home: {
    meta: Meta;
    hero: { eyebrow: string; title: string[]; lead: string; ctaPrimary: string; ctaSecondary: string; micro: string };
    work: { eyebrow: string; title: string[]; lead: string; cardLink: string; all: string };
    /** 3.3 "Miejsce na dowód": client quotes; [brackets] until real quotes with consent exist */
    proof: { items: { quote: string; name: string; role: string }[] };
    direction: { eyebrow: string; title: string[]; body: string[]; items: { n: string; title: string; body: string }[] };
    services: { eyebrow: string; title: string[]; lead: string };
    process: { eyebrow: string; title: string[]; intro: string; outcomeLabel: string; steps: { title: string; body: string; outcome: string }[] };
    studio: { eyebrow: string; title: string[]; body: string[]; link: string; photoAlt: string };
    faq: { title: string; items: { q: string; a: string }[] };
    cta: { title: string[]; body: string; button: string; mailPrefix: string };
  };
  services: Service[];
  projects: Project[];
  workPage: { meta: Meta; title: string[]; lead: string };
  studioPage: {
    meta: Meta;
    title: string[];
    lead: string;
    approach: Block;
    principlesTitle: string;
    principles: { title: string; body: string }[];
    peopleTitle: string;
    people: { name: string; role: string; bio: string; placeholder: boolean }[];
  };
  contactPage: {
    meta: Meta;
    title: string[];
    lead: string;
    required: string;
    fields: {
      name: { label: string; hint: string };
      email: { label: string; hint: string };
      message: { label: string; hint: string };
      company: { label: string };
      scope: { label: string; options: string[] };
      budget: { label: string; options: string[] };
      timing: { label: string };
    };
    optional: string;
    submit: string;
    privacy: string;
    nextTitle: string;
    next: string[];
    sentTitle: string;
    sentBody: string;
    sentLink: string;
    errorBody: string;
    mailSubject: string;
  };
  footer: {
    tagline: string[];
    cols: { title: string; links: { label: string; page: PageId; hash?: string }[] }[];
    contactTitle: string;
    location: string;
    socialTitle: string;
    legal: string;
    privacy: string;
    cookies: string;
  };
};
