import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

export default function ProgressDashboard() {
  const { user, isAuthenticated } = useAuth0();
  const [progress, setProgress] = useState({});

  useEffect(() => {
    if (isAuthenticated && user) {
      fetch(`http://localhost:4000/api/progress/${user.email}`)
        .then(res => res.json())
        .then(setProgress);
    }
  }, [isAuthenticated, user]);

  if (!isAuthenticated) return <div>Please log in to view your progress.</div>;

  return (
    <div style={{ margin: '2rem auto', maxWidth: 600 }}>
      <h2>Your Progress</h2>
      <ul>
        {Object.entries(progress).map(([module, status]) => (
          <li key={module}>{module}: {String(status)}</li>
        ))}
      </ul>
    </div>
  );
}
