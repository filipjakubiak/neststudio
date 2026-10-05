'use client';

import { useState } from 'react';
import type { Content } from '@/content/types';
import { EMAIL } from '@/content/site';
import { href } from '@/lib/links';
import { Button } from '@/components/ui/Button';

/*
 * 5.3 Contact form: three required fields, the rest optional (NN/g), required fields marked.
 * Until a Worker endpoint exists (docs/placeholders.md) it composes the email in the visitor's mail
 * app and says so: no "message received" before anything was received (the document's own rule).
 */
export function ContactForm({ c }: { c: Content }) {
  const [sent, setSent] = useState(false);
  const k = c.contactPage;
  const f = k.fields;

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.reportValidity()) return;
    const d = new FormData(form);
    const lines = [
      `${f.name.label}: ${d.get('name')}`,
      `${f.email.label}: ${d.get('email')}`,
      d.get('company') ? `${f.company.label}: ${d.get('company')}` : '',
      d.getAll('scope').length ? `${f.scope.label}: ${d.getAll('scope').join(', ')}` : '',
      d.get('budget') ? `${f.budget.label}: ${d.get('budget')}` : '',
      d.get('timing') ? `${f.timing.label}: ${d.get('timing')}` : '',
      '',
      String(d.get('message') ?? ''),
    ].filter((l, i, a) => l !== '' || (i > 0 && a[i - 1] !== ''));
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(k.mailSubject)}&body=${encodeURIComponent(lines.join('\n'))}`;
    setSent(true);
  };

  if (sent) {
    return (
      <div className="form-sent" role="status">
        <h2 className="t-h2">{k.sentTitle}</h2>
        <p className="text-ink-soft">{k.sentBody}</p>
        <a className="link" href={href(c, 'work')}>{k.sentLink} ↗</a>
      </div>
    );
  }

  const opt = <span className="field-opt"> ({k.optional})</span>;
  return (
    <form className="form" onSubmit={submit} noValidate>
      <p className="t-caption text-ink-soft">{k.required}</p>
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
        <textarea name="message" required rows={6} aria-describedby="h-msg" />
        <small id="h-msg">{f.message.hint}</small>
      </label>
      <label className="field">
        <span>{f.company.label}{opt}</span>
        <input name="company" autoComplete="organization" />
      </label>
      <fieldset className="field">
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
            <option value="" disabled> </option>
            {f.budget.options.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </label>
        <label className="field">
          <span>{f.timing.label}{opt}</span>
          <input name="timing" />
        </label>
      </div>
      <div className="form-foot">
        <Button type="submit">{k.submit}</Button>
        <p className="t-caption text-ink-soft">{k.privacy}</p>
      </div>
    </form>
  );
}
