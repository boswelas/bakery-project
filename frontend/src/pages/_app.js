// pages/_app.js

import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  // Custom logic or global setup can go here

  return <Component {...pageProps} />;
}

export default MyApp;
