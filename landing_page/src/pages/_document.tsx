import axios from 'axios';
import Document, { Html, Head, Main, NextScript } from 'next/document';

import { AppConfig } from '../utils/AppConfig';

const axiosBasePath =
  process.env.NODE_ENV == null || process.env.NODE_ENV === 'development'
    ? 'http://127.0.0.1:8000'
    : 'https://langobee-server.herokuapp.com/';
const verifyTokenPath = `${axiosBasePath}api/token/verify/`;

// Need to create a custom _document because i18n support is not compatible with `next export`.
class MyDocument extends Document {
  constructor(props: any) {
    super(props);
    if (typeof window !== 'undefined') {
      const reduxPersistLocalStorage = localStorage.getItem('persist:root');
      if (reduxPersistLocalStorage != null) {
        const tokenInfo = JSON.parse(
          JSON.parse(reduxPersistLocalStorage).token
        );
        const { access, refresh } = tokenInfo as {
          access: string;
          refresh: string;
        };
        if (access != null) {
          axios
            .post(verifyTokenPath, { token: access })
            .then(() => {
              window.location.href = '/home';
            })
            .catch(() => {
              axios
                .post(verifyTokenPath, { token: refresh })
                .then((_res) => {
                  window.location.href = '/home';
                })
                .catch((_err) => {
                  localStorage.clear();
                });
            });
        } else {
          localStorage.clear();
        }
      }
    }
  }

  render() {
    return (
      <Html lang={AppConfig.locale}>
        <Head>
          <title>LangoBee the Best Way to Learn Japanese</title>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
