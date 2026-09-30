/* Content model v2 (docs/v2/copy.md). One shape for every language; tests keep pl and en in sync. */
export type Lang = 'pl' | 'en';

export type ObjectId = 'splot' | 'siatka' | 'kostka' | 'skaner' | 'przeplyw' | 'proces' | 'gniazdo';

export type Content = {
  lang: Lang;
  meta: { title: string; description: string; ogTitle: string };
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
  };
  nav: { links: { label: string; href: string }[]; cta: string };
  hero: { eyebrow: string; title: string[]; lead: string; ctaPrimary: string; ctaSecondary: string; micro: string };
  stats: { eyebrow: string; items: { value: string; label: string; placeholder: boolean }[]; note: string };
  who: { eyebrow: string; title: string[]; body: string[]; pillars: { n: string; title: string; body: string }[] };
  work: {
    eyebrow: string;
    title: string[];
    lead: string;
    projects: {
      id: string;
      name: string;
      sentence: string;
      tags: string[];
      year: string;
      status: string;
      image: string;
      alt: string;
      href: string;
      linkLabel: string;
    }[];
    all: string;
  };
  services: {
    eyebrow: string;
    title: string[];
    lead: string;
    items: { id: string; name: string; title: string; body: string; scope: string[]; object: ObjectId | '' }[];
  };
  about: { eyebrow: string; title: string[]; body: string[]; principles: { title: string; body: string }[]; link: string };
  testimonials: { eyebrow: string; items: { quote: string; name: string; role: string; placeholder: boolean }[] };
  team: { eyebrow: string; title: string[]; lead: string; people: { name: string; role: string; bio: string; placeholder: boolean }[] };
  process: { eyebrow: string; title: string[]; intro: string; outcomeLabel: string; steps: { title: string; body: string; outcome: string }[] };
  pricing: {
    eyebrow: string;
    title: string[];
    lead: string;
    tiers: { name: string; price: string; body: string; scope: string[] }[];
    note: string;
    faqTitle: string;
    faq: { q: string; a: string }[];
  };
  partners: { eyebrow: string; title: string; names: string[]; note: string };
  cta: { title: string[]; body: string; button: string; mailPrefix: string };
  contact: {
    eyebrow: string;
    title: string[];
    lead: string;
    required: string;
    fields: {
      name: { label: string; hint: string };
      email: { label: string; hint: string };
      message: { label: string; hint: string };
      company: { label: string; hint: string };
      scope: { label: string; options: string[] };
      budget: { label: string; options: string[] };
      timing: { label: string; hint: string };
    };
    optional: string;
    submit: string;
    privacy: string;
    nextTitle: string;
    next: string[];
    sentTitle: string;
    sentBody: string;
    mailSubject: string;
  };
  footer: {
    tagline: string[];
    cols: { title: string; links: { label: string; href: string }[] }[];
    contactTitle: string;
    socialTitle: string;
    legal: string;
    privacy: string;
    top: string;
  };
};
