import React, { useEffect, useState } from 'react';

export default function AdminReviewDashboard() {
  const [evidence, setEvidence] = useState([]);
  const [feedback, setFeedback] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/api/evidence')
      .then(res => res.json())
      .then(setEvidence);
    fetch('http://localhost:4000/api/feedback')
      .then(res => res.json())
      .then(setFeedback);
  }, []);

  return (
    <div style={{ margin: '2rem auto', maxWidth: 800 }}>
      <h2>Admin Review Dashboard</h2>
      <h3>Evidence Submissions</h3>
      <ul>
        {evidence.map((ev, i) => (
          <li key={i}>{JSON.stringify(ev)}</li>
        ))}
      </ul>
      <h3>Feedback</h3>
      <ul>
        {feedback.map((fb, i) => (
          <li key={i}>{JSON.stringify(fb)}</li>
        ))}
      </ul>
    </div>
  );
}
