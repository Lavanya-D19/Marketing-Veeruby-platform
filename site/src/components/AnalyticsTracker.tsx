import { useEffect } from 'react';

export default function AnalyticsTracker() {
  useEffect(() => {
    if (window.gtag) {
      window.gtag('event', 'page_view', { page_path: window.location.pathname });
    }
  }, []);
  return null;
}
