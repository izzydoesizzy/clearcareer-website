import { useState } from 'react';
import {
  READY, NOT_READY, ALTERNATIVE, SEARCH_LENGTH, APPS_PER_WEEK, STRUGGLES, SITUATION, COUNTRY, DECIDER, START, PAYMENT,
} from '../../lib/book-call';
import { CONSENT_TEXT } from '../../lib/consent';

type Values = Record<string, any>;
type Result = { qualified: boolean; reason: string; bookingUrl?: string } | null;

const STEPS = ['About you', 'Your search', 'Where you are', 'The call', 'Investment'];

function Field({ label, error, hint, children, id }: { label: string; error?: string; hint?: string; children: any; id: string }) {
  return (
    <div className="llu-field" data-invalid={error ? 'true' : undefined}>
      <label className="llu-field__label" htmlFor={id}>{label}</label>
      {hint && <p className="llu-cap">{hint}</p>}
      {children}
      {error && <p className="llu-field__error" role="alert">{error}</p>}
    </div>
  );
}

function Choices({ name, options, value, onChange, multi, max }: { name: string; options: string[]; value: any; onChange: (v: any) => void; multi?: boolean; max?: number }) {
  const picked: string[] = multi ? value || [] : [];
  return (
    <div className="llu-choices" role={multi ? 'group' : 'radiogroup'}>
      {options.map((o) => {
        const checked = multi ? picked.includes(o) : value === o;
        const blocked = multi && !checked && max !== undefined && picked.length >= max;
        return (
          <label key={o} className="llu-choice" data-checked={checked ? 'true' : undefined} data-blocked={blocked ? 'true' : undefined}>
            <input
              type={multi ? 'checkbox' : 'radio'}
              name={name}
              value={o}
              checked={checked}
              disabled={blocked}
              onChange={() => {
                if (!multi) return onChange(o);
                onChange(checked ? picked.filter((x) => x !== o) : [...picked, o]);
              }}
            />
            <span>{o}</span>
          </label>
        );
      })}
    </div>
  );
}

export default function BookCallForm() {
  const [step, setStep] = useState(0);
  const [v, setV] = useState<Values>({ struggles: [], consent: false, website: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [fail, setFail] = useState('');
  const [result, setResult] = useState<Result>(null);

  const set = (k: string, val: any) => setV((p) => ({ ...p, [k]: val }));
  const text = (k: string, extra: Record<string, any> = {}) => ({
    id: k, value: v[k] ?? '', onChange: (e: any) => set(k, e.target.value), className: 'llu-input', ...extra,
  });

  function check(i: number): Record<string, string> {
    const e: Record<string, string> = {};
    const req = (k: string, msg = 'Please fill this in.') => { if (!String(v[k] ?? '').trim()) e[k] = msg; };
    const numReq = (k: string) => { if (v[k] === '' || v[k] === undefined || Number.isNaN(Number(v[k])) || Number(v[k]) < 0) e[k] = 'Please enter a number.'; };
    if (i === 0) {
      req('firstName');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v.email || '').trim())) e.email = 'Please enter a valid email address.';
    }
    if (i === 1) {
      numReq('yearsExperience'); req('searchLength', 'Please choose one.'); req('appsPerWeek', 'Please choose one.');
      numReq('totalApplications'); numReq('interviews');
    }
    if (i === 2) {
      req('situation', 'Please choose one.'); req('country', 'Please choose one.');
      if (!v.struggles?.length) e.struggles = 'Please pick 1 to 3.';
      req('challenge'); req('milestones');
    }
    if (i === 3) { req('callGoal'); req('decider', 'Please choose one.'); req('start', 'Please choose one.'); req('payment', 'Please choose one.'); }
    if (i === 4) req('ready', 'Please choose one.');
    return e;
  }

  function next() {
    const e = check(step);
    setErrors(e);
    if (Object.keys(e).length) { document.querySelector('[data-invalid="true"]')?.scrollIntoView({ block: 'center' }); return; }
    setStep(step + 1);
    window.scrollTo({ top: 0 });
  }

  async function submit() {
    const e = check(4);
    setErrors(e);
    if (Object.keys(e).length) return;
    setBusy(true); setFail('');
    try {
      const res = await fetch('/api/book-call', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(v) });
      const data = await res.json().catch(() => ({}));
      if (res.ok) { setResult(data); window.scrollTo({ top: 0 }); }
      else if (data.errors) { setErrors(data.errors); setFail('Some answers need another look. Please go back and check them.'); }
      else setFail(data.error || 'Something went wrong. Please try again.');
    } catch { setFail('We could not reach the server. Please check your connection and try again.'); }
    setBusy(false);
  }

  if (result) {
    return result.qualified ? (
      <div className="llu-card llu-stack" aria-live="polite">
        <p className="llu-eyebrow">You're a fit</p>
        <h2 className="llu-h2">Thank you, {v.firstName}. Let's talk.</h2>
        <p className="llu-lead">I've got your answers. Pick a time that works for you. Your name and email are already filled in.</p>
        <p className="llu-cap">Have a credit card nearby on the call, in case we decide it's a fit. You can also pay with Klarna.</p>
        <p><a className="llu-btn" href={result.bookingUrl}>Pick a time</a></p>
      </div>
    ) : (
      <div className="llu-card llu-stack" aria-live="polite">
        <p className="llu-eyebrow">Thank you</p>
        <h2 className="llu-h2">Thanks, {v.firstName}. Not quite yet.</h2>
        <p className="llu-lead">
          {result.reason === 'experience'
            ? "Land and Level Up works best for people with several years of experience, so a call wouldn't be the best use of your time right now."
            : "That's okay. The right program at the wrong time isn't the right program."}
        </p>
        <p>I read every answer, and I'll email you with what I'd do in your spot.</p>
        <p>Try this instead while you decide:</p>
        <p><a className="llu-btn" href={ALTERNATIVE.url}>{ALTERNATIVE.label}</a></p>
        <p><a className="llu-link" href="/resources">Or browse the free resources</a></p>
      </div>
    );
  }

  return (
    <form className="llu-card llu-form" onSubmit={(e) => e.preventDefault()} noValidate>
      <p className="llu-eyebrow">Step {step + 1} of {STEPS.length}: {STEPS[step]}</p>
      <div className="llu-meter" aria-hidden="true"><span style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} /></div>

      {step === 0 && (
        <div className="llu-stack">
          <div className="llu-grid llu-grid--2">
            <Field id="firstName" label="First name" error={errors.firstName}><input {...text('firstName', { autoComplete: 'given-name' })} /></Field>
            <Field id="lastName" label="Last name (optional)"><input {...text('lastName', { autoComplete: 'family-name' })} /></Field>
          </div>
          <Field id="email" label="Email address" error={errors.email}><input {...text('email', { type: 'email', autoComplete: 'email', inputMode: 'email' })} /></Field>
          <Field id="phone" label="Best phone number for a short call or text (optional)"><input {...text('phone', { type: 'tel', autoComplete: 'tel' })} /></Field>
          <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="llu-hp" value={v.website} onChange={(e) => set('website', e.target.value)} />
          <label className="llu-consent">
            <input type="checkbox" checked={v.consent} onChange={(e) => set('consent', e.target.checked)} />
            <span className="llu-cap">{CONSENT_TEXT}</span>
          </label>
        </div>
      )}

      {step === 1 && (
        <div className="llu-stack">
          <Field id="jobTitles" label="Job titles you're interested in (optional)"><textarea {...text('jobTitles', { rows: 2 })} className="llu-input" /></Field>
          <div className="llu-grid llu-grid--2">
            <Field id="targetSalary" label="Target annual salary (optional)"><input {...text('targetSalary', { type: 'number', inputMode: 'numeric', min: 0 })} /></Field>
            <Field id="yearsExperience" label="Years of experience" error={errors.yearsExperience}><input {...text('yearsExperience', { type: 'number', inputMode: 'numeric', min: 0 })} /></Field>
          </div>
          <Field id="searchLength" label="How long have you been actively job searching?" error={errors.searchLength}><Choices name="searchLength" options={SEARCH_LENGTH} value={v.searchLength} onChange={(x) => set('searchLength', x)} /></Field>
          <Field id="appsPerWeek" label="How many applications do you submit per week?" error={errors.appsPerWeek}><Choices name="appsPerWeek" options={APPS_PER_WEEK} value={v.appsPerWeek} onChange={(x) => set('appsPerWeek', x)} /></Field>
          <div className="llu-grid llu-grid--2">
            <Field id="totalApplications" label="Total applications so far" error={errors.totalApplications}><input {...text('totalApplications', { type: 'number', inputMode: 'numeric', min: 0 })} /></Field>
            <Field id="interviews" label="Interview invitations so far" error={errors.interviews}><input {...text('interviews', { type: 'number', inputMode: 'numeric', min: 0 })} /></Field>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="llu-stack">
          <Field id="situation" label="Where are you right now?" error={errors.situation}><Choices name="situation" options={SITUATION} value={v.situation} onChange={(x) => set('situation', x)} /></Field>
          <Field id="country" label="Where are you based?" error={errors.country}><Choices name="country" options={COUNTRY} value={v.country} onChange={(x) => set('country', x)} /></Field>
          <Field id="struggles" label="What are your biggest struggles? Pick up to 3." error={errors.struggles}><Choices name="struggles" multi max={3} options={STRUGGLES} value={v.struggles} onChange={(x) => set('struggles', x)} /></Field>
          <Field id="challenge" label="What's your biggest challenge right now, and why?" error={errors.challenge}><textarea {...text('challenge', { rows: 4 })} className="llu-input" /></Field>
          <Field id="milestones" label="Besides landing a job, what else would make this a success?" error={errors.milestones}><textarea {...text('milestones', { rows: 3 })} className="llu-input" /></Field>
          <Field id="motivation" label="How motivated are you to make changes and put in the work to get the results you want? (optional)" hint="1 is very discouraged. 5 is extremely motivated.">
            <Choices name="motivation" options={['1', '2', '3', '4', '5']} value={v.motivation === undefined ? '' : String(v.motivation)} onChange={(x) => set('motivation', Number(x))} />
          </Field>
        </div>
      )}

      {step === 3 && (
        <div className="llu-stack">
          <Field id="callGoal" label="What do you most want from our call?" error={errors.callGoal}><textarea {...text('callGoal', { rows: 3 })} className="llu-input" /></Field>
          <Field id="decider" label="Who else is part of this decision?" error={errors.decider}><Choices name="decider" options={DECIDER} value={v.decider} onChange={(x) => set('decider', x)} /></Field>
          <Field id="start" label="If it's a fit, when could you start?" error={errors.start}><Choices name="start" options={START} value={v.start} onChange={(x) => set('start', x)} /></Field>
          <Field id="payment" label="How would you want to pay?" error={errors.payment}><Choices name="payment" options={PAYMENT} value={v.payment} onChange={(x) => set('payment', x)} /></Field>
        </div>
      )}

      {step === 4 && (
        <div className="llu-stack">
          <p className="llu-lead">Land and Level Up is a high-touch program with a low four-figure investment. There's a 7-day money-back guarantee, as long as your rebuild work hasn't started.</p>
          <Field id="ready" label="Are you in a place where you're ready to invest that amount to achieve the goals you shared?" error={errors.ready}>
            <Choices name="ready" options={[READY, NOT_READY]} value={v.ready} onChange={(x) => set('ready', x)} />
          </Field>
        </div>
      )}

      {fail && <p className="llu-field__error" role="alert">{fail}</p>}

      <div className="llu-form__nav">
        {step > 0 ? <button type="button" className="llu-link" onClick={() => { setStep(step - 1); setErrors({}); window.scrollTo({ top: 0 }); }}>Back</button> : <span />}
        {step < STEPS.length - 1
          ? <button type="button" className="llu-btn" onClick={next}>Continue</button>
          : <button type="button" className="llu-btn" onClick={submit} disabled={busy}>{busy ? 'Sending...' : 'Send my answers'}</button>}
      </div>
    </form>
  );
}
