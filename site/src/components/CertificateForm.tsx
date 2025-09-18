import React, { useState } from 'react';

export default function CertificateForm() {
  const [form, setForm] = useState({
    learner: '',
    track: '',
    date: '',
    mentor: '',
    url: ''
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleExport = () => {
    // For demo: just show filled certificate
    alert(`Certificate for ${form.learner} (${form.track}) on ${form.date}`);
  };

  return (
    <div style={{ margin: '2rem auto', maxWidth: 600 }}>
      <h2>Generate Certificate</h2>
      <input name="learner" placeholder="Learner Name" value={form.learner} onChange={handleChange} /><br/>
      <input name="track" placeholder="Track Name" value={form.track} onChange={handleChange} /><br/>
      <input name="date" placeholder="Date" value={form.date} onChange={handleChange} /><br/>
      <input name="mentor" placeholder="Evaluator/Mentor" value={form.mentor} onChange={handleChange} /><br/>
      <input name="url" placeholder="Verification URL" value={form.url} onChange={handleChange} /><br/>
      <button onClick={handleExport} style={{ marginTop: 12 }}>Export Certificate</button>
    </div>
  );
}
