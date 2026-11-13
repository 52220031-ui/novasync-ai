import { useState } from 'react';
import {
  Mail,
  MapPin,
  Phone,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
} from 'lucide-react';

const initialValues = { name: '', email: '', subject: '', message: '' };

const subjects = ['General question', 'Feature request', 'Report a bug', 'Academic collaboration'];

const details = [
  { icon: Mail, label: 'Email', value: 'hello@novasync.ai' },
  { icon: Phone, label: 'Phone', value: '+1 (555) 426-0426' },
  { icon: MapPin, label: 'Location', value: 'University Campus, CS Lab 4' },
  { icon: Clock, label: 'Support hours', value: 'Mon – Fri, 9:00 – 17:00' },
];

/** Pure validation function: returns an object of error messages (empty = valid). */
function validate(values) {
  const errors = {};

  if (!values.name.trim()) errors.name = 'Please enter your full name.';
  else if (values.name.trim().length < 2) errors.name = 'Name must be at least 2 characters.';

  if (!values.email.trim()) errors.email = 'Please enter your email address.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim()))
    errors.email = 'Please enter a valid email address.';

  if (!values.subject) errors.subject = 'Please choose a subject.';

  if (!values.message.trim()) errors.message = 'Please write a message.';
  else if (values.message.trim().length < 20)
    errors.message = `Message must be at least 20 characters (${values.message.trim().length}/20).`;

  return errors;
}

/** Field wrapper: label + input slot + error/success feedback. */
function Field({ label, htmlFor, error, valid, children }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2 block text-sm font-medium text-slate-300">
        {label}
      </label>
      {children}
      <div className="mt-1.5 min-h-[1.25rem] text-xs">
        {error ? (
          <span className="flex items-center gap-1 text-rose-400" role="alert">
            <AlertCircle className="h-3.5 w-3.5" /> {error}
          </span>
        ) : valid ? (
          <span className="flex items-center gap-1 text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" /> Looks good
          </span>
        ) : null}
      </div>
    </div>
  );
}

export default function Contact() {
  const [values, setValues] = useState(initialValues);
  const [touched, setTouched] = useState({}); // which fields the user has interacted with
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Re-validate on every render; cheap and always in sync with the inputs.
  const errors = validate(values);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    if (success) setSuccess(false);
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mark every field as touched so all errors become visible.
    setTouched({ name: true, email: true, subject: true, message: true });
    if (Object.keys(errors).length > 0) return;

    // Simulate a network request (no real backend in this project).
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
      setValues(initialValues);
      setTouched({});
    }, 1600);
  };

  // Helpers so JSX stays readable.
  const showError = (field) => touched[field] && errors[field];
  const isValid = (field) => touched[field] && !errors[field];
  const inputClass = (field) =>
    `input-base ${showError(field) ? '!border-rose-400/70 focus:!ring-rose-500/30' : ''} ${
      isValid(field) ? '!border-emerald-400/50' : ''
    }`;

  return (
    <>
      {/* ===== Header ===== */}
      <section className="section pb-10 pt-32 text-center lg:pt-40">
        <div className="mx-auto max-w-3xl animate-fade-up">
          <span className="pill">Contact</span>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Let's <span className="text-gradient">connect</span>
          </h1>
          <p className="mt-6 text-lg text-slate-400">
            Questions, feedback or ideas? Send us a message and we'll get back to you within one business day.
          </p>
        </div>
      </section>

      <section className="section grid gap-8 py-6 lg:grid-cols-5">
        {/* ===== Contact details ===== */}
        <aside className="space-y-4 lg:col-span-2">
          {details.map(({ icon: Icon, label, value }) => (
            <div key={label} className="glass glass-hover flex items-center gap-4 rounded-2xl p-5">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <div className="text-xs uppercase tracking-wider text-slate-500">{label}</div>
                <div className="font-medium text-white">{value}</div>
              </div>
            </div>
          ))}

          <div className="glass rounded-2xl p-5 text-sm leading-relaxed text-slate-400">
            This is a university demo project, so the form is simulated and no data is sent anywhere.
          </div>
        </aside>

        {/* ===== Form ===== */}
        <div className="glass rounded-3xl p-6 sm:p-8 lg:col-span-3">
          {/* Success alert */}
          {success && (
            <div
              className="mb-6 flex items-start gap-3 rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-4 text-emerald-200"
              role="status"
            >
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
              <div className="flex-1 text-sm">
                <p className="font-semibold">Message sent successfully!</p>
                <p className="text-emerald-200/80">Thanks for reaching out. We'll reply to you shortly.</p>
              </div>
              <button onClick={() => setSuccess(false)} aria-label="Dismiss" className="text-emerald-200/70 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="grid gap-x-5 sm:grid-cols-2">
              <Field label="Full name" htmlFor="name" error={showError('name')} valid={isValid('name')}>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Jane Doe"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={inputClass('name')}
                />
              </Field>

              <Field label="Email address" htmlFor="email" error={showError('email')} valid={isValid('email')}>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="jane@university.edu"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={inputClass('email')}
                />
              </Field>
            </div>

            <Field label="Subject" htmlFor="subject" error={showError('subject')} valid={isValid('subject')}>
              <select
                id="subject"
                name="subject"
                value={values.subject}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`${inputClass('subject')} appearance-none`}
              >
                <option value="" className="bg-ink-900">
                  Select a subject…
                </option>
                {subjects.map((s) => (
                  <option key={s} value={s} className="bg-ink-900">
                    {s}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Message" htmlFor="message" error={showError('message')} valid={isValid('message')}>
              <textarea
                id="message"
                name="message"
                rows={5}
                placeholder="Tell us how we can help…"
                value={values.message}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`${inputClass('message')} resize-none`}
              />
            </Field>

            <button type="submit" disabled={submitting} className="btn-primary mt-2 w-full sm:w-auto">
              {submitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" /> Sending…
                </>
              ) : (
                <>
                  Send message <Send className="h-5 w-5" />
                </>
              )}
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
