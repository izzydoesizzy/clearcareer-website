import { useEffect, useRef, useState } from 'react';
import { RECORDING, FILE_KINDS, MAX_FILE_BYTES, type FileKind } from '../../lib/onboarding';

type State = {
  firstName: string;
  name: string;
  program: string;
  isPrivate: boolean;
  agreement: { html: string; version: string } | null;
  signed: { at: string; name: string } | null;
  intakeDone: boolean;
  files: string[];
  uploadsReady: boolean;
  prefill: Record<string, string>;
  next: { communityName: string; communityUrl: string; callTime: string; callUrl: string; privateBookingUrl: string };
};

const TIMEZONES = ['Eastern (Toronto, New York)', 'Atlantic (Halifax)', 'Newfoundland (St. John\'s)', 'Central (Winnipeg, Chicago)', 'Mountain (Calgary, Denver)', 'Pacific (Vancouver, Los Angeles)', 'Somewhere else'];

function Field({ label, error, hint, children, id }: { label: string; error?: string; hint?: any; children: any; id: string }) {
  return (
    <div className="llu-field" data-invalid={error ? 'true' : undefined}>
      <label className="llu-field__label" htmlFor={id}>{label}</label>
      {hint && <p className="llu-cap">{hint}</p>}
      {children}
      {error && <p className="llu-field__error" role="alert">{error}</p>}
    </div>
  );
}

function Choices({ name, options, value, onChange }: { name: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="llu-choices" role="radiogroup">
      {options.map((o) => (
        <label key={o} className="llu-choice" data-checked={value === o ? 'true' : undefined}>
          <input type="radio" name={name} value={o} checked={value === o} onChange={() => onChange(o)} />
          <span>{o}</span>
        </label>
      ))}
    </div>
  );
}

export default function OnboardingForm() {
  const [token, setToken] = useState('');
  const [s, setS] = useState<State | null>(null);
  const [fail, setFail] = useState('');
  const [busy, setBusy] = useState(false);
  const [legalName, setLegalName] = useState('');
  const [agree, setAgree] = useState(false);
  const [v, setV] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<string[]>([]);
  const [uploading, setUploading] = useState('');
  const [uploadError, setUploadError] = useState('');
  const top = useRef<HTMLDivElement>(null);

  const draftKey = token ? `llu-intake-${token.slice(-12)}` : '';

  async function load(t: string) {
    try {
      const r = await fetch(`/api/onboarding/state?t=${encodeURIComponent(t)}`);
      const j = await r.json();
      if (!r.ok) return setFail(j.error || 'This link did not work.');
      setS(j);
      setFiles(j.files || []);
      const saved = (() => { try { return JSON.parse(localStorage.getItem(`llu-intake-${t.slice(-12)}`) || '{}'); } catch { return {}; } })();
      setV({ ...j.prefill, ...saved });
    } catch {
      setFail('We could not reach the server. Please check your connection and refresh.');
    }
  }

  useEffect(() => {
    const t = new URLSearchParams(location.search).get('t') || '';
    if (!t) { setFail('This page needs the private link from your welcome email.'); return; }
    setToken(t);
    load(t);
  }, []);

  useEffect(() => { if (draftKey) localStorage.setItem(draftKey, JSON.stringify(v)); }, [v, draftKey]);

  const set = (k: string, x: string) => { setV((p) => ({ ...p, [k]: x })); setErrors((e) => ({ ...e, [k]: '' })); };
  const text = (k: string, extra: Record<string, any> = {}) => ({ id: k, value: v[k] ?? '', onChange: (e: any) => set(k, e.target.value), className: 'llu-input', ...extra });
  const scrollTop = () => top.current?.scrollIntoView({ behavior: 'auto', block: 'start' });

  async function sign() {
    setFail('');
    if (legalName.trim().split(/\s+/).length < 2) return setErrors({ legalName: 'Please type your full legal name (first and last).' });
    if (!agree) return setErrors({ agree: 'Please tick the box to agree.' });
    setBusy(true);
    try {
      const r = await fetch('/api/onboarding/sign', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ t: token, legalName, agree, version: s?.agreement?.version }) });
      const j = await r.json();
      if (!r.ok) { if (j.field) setErrors({ [j.field]: j.error }); else setFail(j.error); }
      else { await load(token); scrollTop(); }
    } catch { setFail('We could not reach the server. Please try again.'); }
    setBusy(false);
  }

  async function upload(kind: FileKind, list: FileList | null) {
    setUploadError('');
    if (!list) return;
    for (const f of Array.from(list)) {
      if (f.size > MAX_FILE_BYTES) { setUploadError(`${f.name} is over 4 MB. Try saving it as a PDF, or email it to izzy@joinclearcareer.com.`); continue; }
      setUploading(f.name);
      const fd = new FormData();
      fd.append('t', token); fd.append('kind', kind); fd.append('file', f);
      try {
        const r = await fetch('/api/onboarding/upload', { method: 'POST', body: fd });
        const j = await r.json();
        if (!r.ok) setUploadError(j.error || `${f.name} did not upload.`);
        else setFiles(j.files || []);
      } catch { setUploadError(`${f.name} did not upload. Please try again.`); }
    }
    setUploading('');
  }

  async function submit() {
    setFail('');
    const e: Record<string, string> = {};
    if (!/linkedin\.com\/in\//i.test(v.linkedinUrl || '')) e.linkedinUrl = 'Paste your LinkedIn profile link, like https://www.linkedin.com/in/your-name';
    if ((v.targetRoles || '').trim().length < 3) e.targetRoles = 'Tell me the roles you want.';
    if ((v.wins || '').trim().length < 20) e.wins = 'A few lines is plenty. Rough is fine.';
    if (!v.timezone) e.timezone = 'Please choose your time zone.';
    if (!v.recording) e.recording = 'Please choose one.';
    if (Object.keys(e).length) { setErrors(e); setFail('A few answers need another look.'); return; }
    if (!files.some((f) => f.startsWith('Resume')) && !confirm("You haven't uploaded a resume yet. Submit anyway? You can email it to me later.")) return;
    setBusy(true);
    try {
      const r = await fetch('/api/onboarding/submit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ t: token, ...v }) });
      const j = await r.json();
      if (!r.ok) { if (j.errors) setErrors(j.errors); setFail(j.error || 'Something went wrong.'); }
      else { localStorage.removeItem(draftKey); await load(token); scrollTop(); }
    } catch { setFail('We could not reach the server. Please try again.'); }
    setBusy(false);
  }

  if (!s) {
    return <div className="llu-card" aria-live="polite">{fail ? <p className="llu-field__error" role="alert">{fail}</p> : <p>Loading your onboarding...</p>}</div>;
  }

  const stepNum = !s.signed ? 1 : !s.intakeDone ? 2 : 3;
  const n = s.next;

  return (
    <div ref={top} className="llu-stack">
      <ol className="llu-steps" aria-label="Progress">
        {['Agreement', 'Intake', "You're set"].map((label, i) => (
          <li key={label} aria-current={stepNum === i + 1 ? 'step' : undefined} data-done={stepNum > i + 1 ? 'true' : undefined}>{i + 1}. {label}</li>
        ))}
      </ol>

      {stepNum === 1 && s.agreement && (
        <div className="llu-card llu-stack">
          <p className="llu-eyebrow">Step 1 of 2</p>
          <h2 className="llu-h2">Welcome, {s.firstName}. First, the agreement.</h2>
          <p className="llu-lead">Plain English, about two minutes. It covers the guarantee, the group rules, and how I look after your files.</p>
          <div className="llu-agreement" tabIndex={0} aria-label="Client agreement" dangerouslySetInnerHTML={{ __html: s.agreement.html }} />
          <Field id="legalName" label="Type your full legal name to sign" error={errors.legalName}>
            <input id="legalName" className="llu-input" value={legalName} autoComplete="name" onChange={(e) => { setLegalName(e.target.value); setErrors({}); }} />
          </Field>
          <label className="llu-consent">
            <input type="checkbox" checked={agree} onChange={(e) => { setAgree(e.target.checked); setErrors({}); }} />
            <span>I've read the agreement and I agree to it. Typing my name above is my electronic signature.</span>
          </label>
          {errors.agree && <p className="llu-field__error" role="alert">{errors.agree}</p>}
          {fail && <p className="llu-field__error" role="alert">{fail}</p>}
          <p><button type="button" className="llu-btn" onClick={sign} disabled={busy}>{busy ? 'Signing...' : 'Sign and continue'}</button></p>
          <p className="llu-cap">You'll get a signed copy by email.</p>
        </div>
      )}

      {stepNum === 2 && (
        <div className="llu-card llu-stack">
          <p className="llu-eyebrow">Step 2 of 2</p>
          <h2 className="llu-h2">Your intake</h2>
          <p className="llu-lead">This is how I prep for you before week 1. Rough is perfect. Everything saves on this device as you type, so you can come back.</p>
          <p className="llu-cap">Signed by {s.signed?.name}. Thank you.</p>

          <h3 className="llu-title">Your files</h3>
          {!s.uploadsReady && <p className="llu-cap">Uploads aren't switched on yet. Please email your files to izzy@joinclearcareer.com.</p>}
          {s.uploadsReady && (
            <>
              <Field id="resume" label="Every version of your resume" hint="Yes, all of them, even the old and messy ones. They show me what you've tried. PDF or Word, up to 4 MB each.">
                <input id="resume" type="file" multiple accept=".pdf,.doc,.docx,.odt,.rtf,.txt" className="llu-input" onChange={(e) => upload('resume', e.target.files)} />
              </Field>
              <Field id="linkedin" label="Your LinkedIn profile as a PDF" hint="On a computer: open your LinkedIn profile, click Resources (or More), then Save to PDF.">
                <input id="linkedin" type="file" accept=".pdf" className="llu-input" onChange={(e) => upload('linkedin', e.target.files)} />
              </Field>
              <Field id="cover" label="Cover letters (optional)">
                <input id="cover" type="file" multiple accept=".pdf,.doc,.docx,.odt,.rtf,.txt" className="llu-input" onChange={(e) => upload('cover', e.target.files)} />
              </Field>
              <Field id="other" label="Anything else you want me to see (optional)" hint="Performance reviews, a portfolio, a job offer you're weighing.">
                <input id="other" type="file" multiple accept=".pdf,.doc,.docx,.odt,.rtf,.txt" className="llu-input" onChange={(e) => upload('other', e.target.files)} />
              </Field>
              <div aria-live="polite">
                {uploading && <p className="llu-cap">Uploading {uploading}...</p>}
                {uploadError && <p className="llu-field__error" role="alert">{uploadError}</p>}
                {files.length > 0 && <ul className="llu-list">{files.map((f) => <li key={f}>{f}</li>)}</ul>}
              </div>
            </>
          )}

          <h3 className="llu-title">About you</h3>
          <Field id="preferredName" label="What should I call you?"><input {...text('preferredName', { autoComplete: 'given-name' })} /></Field>
          <Field id="linkedinUrl" label="Your LinkedIn profile link" error={errors.linkedinUrl}><input {...text('linkedinUrl', { type: 'url', placeholder: 'https://www.linkedin.com/in/your-name', inputMode: 'url' })} /></Field>
          <Field id="timezone" label="Your time zone" error={errors.timezone}><Choices name="timezone" options={TIMEZONES} value={v.timezone || ''} onChange={(x) => set('timezone', x)} /></Field>
          <Field id="phone" label="Best phone number (optional)"><input {...text('phone', { type: 'tel', autoComplete: 'tel' })} /></Field>

          <h3 className="llu-title">Your search</h3>
          <Field id="targetRoles" label="The roles you want" error={errors.targetRoles}><textarea {...text('targetRoles', { rows: 2 })} /></Field>
          <Field id="targetCompanies" label="Companies you'd love to work for (optional)"><textarea {...text('targetCompanies', { rows: 2 })} /></Field>
          <Field id="jobPosts" label="Links to 3 to 5 job posts you'd love to land (optional)" hint="One per line. These tell me more than any job title."><textarea {...text('jobPosts', { rows: 4 })} /></Field>
          <Field id="wins" label="5 wins from your career, in your own words" error={errors.wins} hint="Things you're proud of. Numbers if you have them, but don't worry if you don't. That's what we'll dig out together.">
            <textarea {...text('wins', { rows: 7 })} />
          </Field>
          <Field id="week1" label="The one thing you most want help with in week 1"><textarea {...text('week1', { rows: 2 })} /></Field>
          <Field id="anythingElse" label="Anything else I should know? (optional)" hint="Anything that affects your search: caregiving, a visa timeline, a deadline."><textarea {...text('anythingElse', { rows: 3 })} /></Field>
          <Field id="recording" label="The group calls may be recorded so members can rewatch them. Are you comfortable with that?" error={errors.recording}>
            <Choices name="recording" options={RECORDING} value={v.recording || ''} onChange={(x) => set('recording', x)} />
          </Field>
          {fail && <p className="llu-field__error" role="alert">{fail}</p>}
          <p><button type="button" className="llu-btn" onClick={submit} disabled={busy || !!uploading}>{busy ? 'Sending...' : 'Send my intake'}</button></p>
        </div>
      )}

      {stepNum === 3 && (
        <div className="llu-card llu-stack" aria-live="polite">
          <p className="llu-eyebrow">All done</p>
          <h2 className="llu-h2">You're all set, {s.firstName}.</h2>
          <p className="llu-lead">Got everything. I'll go through it before we start, so we hit the ground running. Your next steps are in your inbox too.</p>
          <ol className="llu-list">
            <li>{n.communityUrl ? <>Join the community: <a className="llu-link llu-link--inline" href={n.communityUrl}>join us on {n.communityName}</a>, then post a quick hello.</> : <>Your {n.communityName} invite is coming from me before we start.</>}</li>
            <li>{n.callTime && n.callUrl ? <>Every Wednesday at {n.callTime}: <a className="llu-link llu-link--inline" href={n.callUrl}>join link</a>. <a className="llu-link llu-link--inline" href="/llu-calls.ics">Add all 6 calls to your calendar</a>.</> : <>The Wednesday call time and link are coming from me before the first call.</>}</li>
            {s.isPrivate && <li>{n.privateBookingUrl ? <>Book your 1:1 rebuild: <a className="llu-link llu-link--inline" href={n.privateBookingUrl}>pick your times</a>.</> : <>I'll email you to book your 1:1 rebuild sessions.</>}</li>}
          </ol>
          <p className="llu-cap">Questions? Email izzy@joinclearcareer.com. It comes straight to me.</p>
        </div>
      )}
    </div>
  );
}
