// pages/_app.js

import '../styles/globals.css';
import Layout from "@/components/Layout";

function MyApp({ Component, pageProps }) {
  // Custom logic or global setup can go here

  return (<Layout> <Component {...pageProps} /></Layout>);
}

export default MyApp;
