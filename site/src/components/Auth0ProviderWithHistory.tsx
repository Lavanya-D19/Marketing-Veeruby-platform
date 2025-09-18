import React from 'react';
import { Auth0Provider } from '@auth0/auth0-react';


const Auth0ProviderWithHistory = ({ children }) => {

  const domain = "lav-any123.us.auth0.com"; // <-- Replace with your actual Auth0 domain
  const clientId = "lav12345678"; // <-- Replace with your actual Auth0 client ID
  const redirectUri = window.location.origin;

  const onRedirectCallback = (appState) => {
    window.location.assign(appState?.returnTo || window.location.pathname);
  };

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{ redirect_uri: redirectUri }}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
};

export default Auth0ProviderWithHistory;
