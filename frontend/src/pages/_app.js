// pages/_app.js
import { AuthContextProvider } from '../components/AuthContext';
import '../styles/globals.css';
import Layout from "@/components/Layout";

function MyApp({ Component, pageProps }) {
  return (
    <AuthContextProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthContextProvider>);
}

export default MyApp;
