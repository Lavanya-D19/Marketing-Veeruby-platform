import React from 'react';
import Auth0ProviderWithHistory from '../components/Auth0ProviderWithHistory';

export default function Root({ children }) {
  return <Auth0ProviderWithHistory>{children}</Auth0ProviderWithHistory>;
}
