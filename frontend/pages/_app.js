import "../styles/globals.css";
import '../components/NotificationPopup.css'; // to import the global CSS file cause of the error module not found

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
