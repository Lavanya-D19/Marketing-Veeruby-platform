
import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import ProgressDashboard from '@site/src/components/ProgressDashboard';
import CertificateForm from '@site/src/components/CertificateForm';
import AdminReviewDashboard from '@site/src/components/AdminReviewDashboard';
import AnalyticsTracker from '@site/src/components/AnalyticsTracker';
import Heading from '@theme/Heading';
import styles from './index.module.css';
import { useAuth0 } from '@auth0/auth0-react';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro">
            Docusaurus Tutorial - 5min ⏱️
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();
  return (
    <Layout
      title={siteConfig.title}
      description={siteConfig.tagline}>
      <AnalyticsTracker />
      <div className={styles.heroBanner} style={{padding: '3rem 0', textAlign: 'center', background: '#f5f7fa'}}>
        <Heading as="h1" className="hero__title" style={{fontSize: '2.5rem', marginBottom: '0.5rem'}}>
          🚀 {siteConfig.title}
        </Heading>
        <p className="hero__subtitle" style={{fontSize: '1.25rem', color: '#555'}}>{siteConfig.tagline}</p>
        <div style={{marginTop: '1.5rem'}}>
          {!isAuthenticated ? (
            <button onClick={() => loginWithRedirect()} className="button button--primary button--lg">Login to your LMS</button>
          ) : (
            <>
              <div style={{fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.5rem'}}>Welcome, {user?.name || user?.email}!</div>
              <button onClick={() => logout()} className="button button--secondary" style={{ marginBottom: '1.5rem' }}>Logout</button>
            </>
          )}
        </div>
      </div>
      <main style={{maxWidth: 1200, margin: '2rem auto'}}>
        <section style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: '2rem', marginBottom: '2rem'}}>
          <div style={{background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #e5e7eb', padding: '2rem'}}>
            <h2 style={{marginBottom: '1rem'}}>📚 Tracks</h2>
            <ul style={{listStyle: 'none', padding: 0}}>
              <li style={{marginBottom: '1.25rem'}}>
                <Link to="/docs/tracks/beginner-overview" className="button button--outline button--block">Beginner Track</Link>
              </li>
              <li style={{marginBottom: '1.25rem'}}>
                <Link to="/docs/tracks/intermediate-overview" className="button button--outline button--block">Intermediate Track</Link>
              </li>
              <li>
                <Link to="/docs/tracks/advanced-overview" className="button button--outline button--block">Advanced Track</Link>
              </li>
            </ul>
          </div>
          <div style={{background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #e5e7eb', padding: '2rem'}}>
            <h2 style={{marginBottom: '1rem'}}>⚡ Quick Actions</h2>
            <ul style={{listStyle: 'none', padding: 0}}>
              <li><Link to="/docs/how-to-use" className="button button--outline button--block">How to Use</Link></li>
              <li><Link to="/docs/resources/reading-list" className="button button--outline button--block" style={{ marginTop: 8 }}>Reading List</Link></li>
              <li><Link to="/docs/resources/templates/completion-certificate" className="button button--outline button--block" style={{ marginTop: 8 }}>Certificate Template</Link></li>
            </ul>
          </div>
        </section>
        {isAuthenticated && (
          <section style={{marginBottom: '2rem'}}>
            <ProgressDashboard />
          </section>
        )}
        {isAuthenticated && (
          <section style={{marginBottom: '2rem'}}>
            <CertificateForm />
          </section>
        )}
        {isAuthenticated && (
          <section style={{marginBottom: '2rem'}}>
            <AdminReviewDashboard />
          </section>
        )}
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
