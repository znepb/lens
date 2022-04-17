import "../styles/globals.scss";
import "mapbox-gl/dist/mapbox-gl.css";
import "bootstrap-grid-only-css/dist/css/bootstrap-grid.min.css";

import { AlertCircle } from "react-feather";

function MyApp({ Component, pageProps }: any) {
  return (
    <>
      <noscript className="noscript">
        <div>
          <header>
            <AlertCircle height={44} width={44} /> Notice
          </header>
          <hr />
          <div>
            Thank you for visiting Lens! Unforntunately, JavaScript is required
            to make this website work correctly. Please make sure that you have
            JavaScript enabled, and you are using a web browser that supports
            JavaScript.
          </div>
          <div>
            <a
              href="https://www.enable-javascript.com/"
              target="_blank"
              rel="noreferrer"
            >
              How do I enable JavaScript on my browser?
            </a>
          </div>
          <hr />
          <footer>
            <img src="/logo.svg" height={28} />
            <span>Copyright © znepb 2022</span>
          </footer>
        </div>
      </noscript>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
