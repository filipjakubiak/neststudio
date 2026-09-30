'use client';

import { useRef, useState } from 'react';
import type { Content } from '@/content/types';
import { EMAIL, PHONE } from '@/content/site';
import { useReveal } from '@/components/motion/useReveal';
import { Button } from '@/components/ui/Button';
import { SectionHead } from './SectionHead';

/*
 * Get in touch (5.3). Three required fields, the rest optional (NN/g). Until a Worker endpoint exists
 * (docs/placeholders.md) the form composes an email in the visitor's mail app and says so honestly:
 * no "message received" before anything was received.
 */
export function Contact({ c }: { c: Content }) {
  const root = useRef<HTMLElement>(null);
  const [sent, setSent] = useState(false);
  useReveal(root);
  const f = c.contact.fields;

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.reportValidity()) return;
    const d = new FormData(form);
    const scope = d.getAll('scope').join(', ');
    const lines = [
      `${f.name.label}: ${d.get('name')}`,
      `${f.email.label}: ${d.get('email')}`,
      d.get('company') ? `${f.company.label}: ${d.get('company')}` : '',
      scope ? `${f.scope.label}: ${scope}` : '',
      d.get('budget') ? `${f.budget.label}: ${d.get('budget')}` : '',
      d.get('timing') ? `${f.timing.label}: ${d.get('timing')}` : '',
      '',
      String(d.get('message') ?? ''),
    ].filter((l, i, a) => l !== '' || (i > 0 && a[i - 1] !== ''));
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(c.contact.mailSubject)}&body=${encodeURIComponent(lines.join('\n'))}`;
    setSent(true);
  };

  const opt = <span className="field-opt"> ({c.contact.optional})</span>;

  return (
    <section id="kontakt" ref={root} className="contact">
      <div className="wrap contact-grid">
        <div className="contact-intro">
          <SectionHead eyebrow={c.contact.eyebrow} title={c.contact.title} lead={c.contact.lead} />
          <div className="contact-next">
            <p className="t-label text-ink-soft">{c.contact.nextTitle}</p>
            <ol>{c.contact.next.map((s, i) => <li key={i}><span className="t-mono">{String(i + 1).padStart(2, '0')}</span>{s}</li>)}</ol>
          </div>
          <p className="contact-direct t-small">
            <a className="link" href={`mailto:${EMAIL}`}>{EMAIL}</a>
            <a className="link" href={`tel:${PHONE.replace(/\s/g, '')}`}>{PHONE}</a>
          </p>
        </div>

        {sent ? (
          <div className="form-sent" role="status">
            <h3 className="t-h2">{c.contact.sentTitle}</h3>
            <p className="text-ink-soft">{c.contact.sentBody}</p>
          </div>
        ) : (
          <form className="form" onSubmit={submit} noValidate>
            <p className="t-caption t-mono text-ink-soft">{c.contact.required}</p>
            <div className="field-row">
              <label className="field">
                <span>{f.name.label} *</span>
                <input name="name" required autoComplete="name" aria-describedby="h-name" />
                <small id="h-name">{f.name.hint}</small>
              </label>
              <label className="field">
                <span>{f.email.label} *</span>
                <input name="email" type="email" required autoComplete="email" aria-describedby="h-email" />
                <small id="h-email">{f.email.hint}</small>
              </label>
            </div>
            <label className="field">
              <span>{f.message.label} *</span>
              <textarea name="message" required rows={5} aria-describedby="h-msg" />
              <small id="h-msg">{f.message.hint}</small>
            </label>
            <label className="field">
              <span>{f.company.label}{opt}</span>
              <input name="company" autoComplete="organization" />
            </label>
            <fieldset className="field chips-field">
              <legend>{f.scope.label}{opt}</legend>
              <div className="chips">
                {f.scope.options.map((o) => (
                  <label key={o} className="chip-check"><input type="checkbox" name="scope" value={o} /><span>{o}</span></label>
                ))}
              </div>
            </fieldset>
            <div className="field-row">
              <label className="field">
                <span>{f.budget.label}{opt}</span>
                <select name="budget" defaultValue="">
                  <option value="" disabled>—</option>
                  {f.budget.options.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </label>
              <label className="field">
                <span>{f.timing.label}{opt}</span>
                <input name="timing" />
              </label>
            </div>
            <div className="form-foot">
              <Button type="submit">{c.contact.submit}</Button>
              <p className="t-caption text-ink-soft">{c.contact.privacy}</p>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
