'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function Field({ label, name, type = 'text', placeholder = '', required = false, options, wide = false, full = false, min, step, disabled = false, helper, value, onChange, readOnly = false }) {
  return <div className={`field ${wide ? 'wide' : ''} ${full ? 'full' : ''}`}>
    <label htmlFor={name}>{label}{required && <span className="required"> *</span>}</label>
    {options ? <select id={name} name={name} value={value} onChange={onChange} required={required} disabled={disabled}><option value="">Select {label.toLowerCase()}</option>{options.map((o) => <option key={o} value={o}>{o}</option>)}</select> : type === 'textarea' ? <textarea id={name} name={name} placeholder={placeholder} required={required} disabled={disabled} value={value} onChange={onChange} readOnly={readOnly} /> : <input id={name} name={name} type={type} placeholder={placeholder} required={required} min={min} step={step} disabled={disabled} value={value} onChange={onChange} readOnly={readOnly} />}
    {helper && <span className="helper">{helper}</span>}
  </div>;
}

export function FormSection({ title, children }) {
  return <><p className="form-section-title">{title}</p><div className="fields">{children}</div></>;
}

export default function RegistrationForm({ children, saveLabel, apiEndpoint, fieldsToSend }) {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('status');
  const [isSaving, setIsSaving] = useState(false);

  async function submitForm(event) {
    event.preventDefault();
    const form = event.currentTarget;

    if (!apiEndpoint) {
      setMessage('Form validated. Database saving is not connected yet.');
      setMessageType('status');
      return;
    }

    setIsSaving(true);
    setMessage('');

    try {
      const formData = new FormData(form);
      const data = Object.fromEntries(
        fieldsToSend
          .filter((field) => formData.has(field))
          .map((field) => [field, formData.get(field)])
      );
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Could not save the record. Please try again.');
      }

      router.push('/');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not reach the server. Please try again.' , error);
      setMessageType('error');
    } finally {
      setIsSaving(false);
    }
  }

  return <form className="form-body" onSubmit={submitForm} onReset={() => { setMessage(''); setMessageType('status'); }}>
    {children}
    {message && <p className={`form-message ${messageType}`} role={messageType === 'error' ? 'alert' : 'status'}>{message}</p>}
    <div className="form-actions"><button className="btn" type="reset" disabled={isSaving}>Clear form</button><button className="btn primary" type="submit" disabled={isSaving}>{isSaving ? 'Saving…' : `${saveLabel} →`}</button></div>
  </form>;
}
