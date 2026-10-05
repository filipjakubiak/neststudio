'use client';

import { useState } from 'react';
import type { Content } from '@/content/types';
import { EMAIL, FORM_ENDPOINT } from '@/content/site';
import { href } from '@/lib/links';
import { Button, More } from '@/components/ui/Button';

type State = 'idle' | 'sending' | 'sent' | 'error';

/*
 * 5.3 Contact form: three required fields, the rest optional (NN/g), required fields marked.
 * Fields validate inline when you leave them, not only on submit (apple-design §16, the browser's own message).
 * With FORM_ENDPOINT it posts and shows the document's confirmation or error (the typed data stays in the form).
 * Without one it composes the email in the visitor's mail app and claims nothing: no "message arrived"
 * before anything arrived (the document's own rule).
 */
export function ContactForm({ c }: { c: Content }) {
  const [state, setState] = useState<State>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const k = c.contactPage;
  const f = k.fields;
  const mail = (s: string) => s.replace('[E-MAIL]', EMAIL);

  const check = (el: HTMLInputElement | HTMLTextAreaElement) => {
    setErrors((e) => ({ ...e, [el.name]: el.validity.valid ? '' : el.validationMessage }));
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const invalid = [...form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('[required]')].filter((el) => !el.validity.valid);
    if (invalid.length) {
      setErrors(Object.fromEntries(invalid.map((el) => [el.name, el.validationMessage])));
      invalid[0].focus();
      return;
    }
    const d = new FormData(form);
    const data = {
      name: String(d.get('name') ?? ''),
      email: String(d.get('email') ?? ''),
      message: String(d.get('message') ?? ''),
      company: String(d.get('company') ?? ''),
      scope: d.getAll('scope').map(String),
      budget: String(d.get('budget') ?? ''),
      timing: String(d.get('timing') ?? ''),
    };
    if (FORM_ENDPOINT) {
      setState('sending');
      try {
        const r = await fetch(FORM_ENDPOINT, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(data) });
        setState(r.ok ? 'sent' : 'error');
      } catch {
        setState('error');
      }
      return;
    }
    const lines = [
      `${f.name.label}: ${data.name}`,
      `${f.email.label}: ${data.email}`,
      data.company && `${f.company.label}: ${data.company}`,
      data.scope.length > 0 && `${f.scope.label}: ${data.scope.join(', ')}`,
      data.budget && `${f.budget.label}: ${data.budget}`,
      data.timing && `${f.timing.label}: ${data.timing}`,
      '',
      data.message,
    ].filter((l) => l !== false && l !== null) as string[];
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(k.mailSubject)}&body=${encodeURIComponent(lines.join('\n'))}`;
  };

  if (state === 'sent') {
    return (
      <div className="tile form-sent" role="status">
        <h2 className="t-h3">{k.sentTitle}</h2>
        <p className="soft">{mail(k.sentBody)}</p>
        <More href={href(c, 'work')}>{k.sentLink}</More>
      </div>
    );
  }

  const opt = <span className="field-opt"> ({k.optional})</span>;
  const field = (name: string, hint?: string) => ({
    'aria-describedby': [hint && `h-${name}`, errors[name] && `e-${name}`].filter(Boolean).join(' ') || undefined,
    'aria-invalid': errors[name] ? true : undefined,
  });
  const err = (name: string) => errors[name] ? <small id={`e-${name}`} className="field-err">{errors[name]}</small> : null;

  return (
    <form className="tile form" onSubmit={submit} noValidate>
      <p className="t-caption soft">{k.required}</p>
      <div className="field-row">
        <label className="field">
          <span>{f.name.label} *</span>
          <input name="name" required autoComplete="name" onBlur={(e) => check(e.currentTarget)} {...field('name', f.name.hint)} />
          <small id="h-name">{f.name.hint}</small>
          {err('name')}
        </label>
        <label className="field">
          <span>{f.email.label} *</span>
          <input name="email" type="email" required autoComplete="email" onBlur={(e) => check(e.currentTarget)} {...field('email', f.email.hint)} />
          <small id="h-email">{f.email.hint}</small>
          {err('email')}
        </label>
      </div>
      <label className="field">
        <span>{f.message.label} *</span>
        <textarea name="message" required rows={6} onBlur={(e) => check(e.currentTarget)} {...field('message', f.message.hint)} />
        <small id="h-message">{f.message.hint}</small>
        {err('message')}
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
      {state === 'error' && <p className="field-err form-error" role="alert">{mail(k.errorBody)}</p>}
      <div className="form-foot">
        <Button type="submit" disabled={state === 'sending'}>{k.submit}</Button>
        <p className="t-caption soft">{k.privacy}</p>
      </div>
    </form>
  );
}
