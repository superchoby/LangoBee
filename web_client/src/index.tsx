import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.scss'
import App from './App'
import { store } from './app/store'
import { Provider } from 'react-redux'
import * as serviceWorker from './serviceWorker'
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { Auth0Provider } from "@auth0/auth0-react";

const persistor = persistStore(store)

const root = ReactDOM.createRoot(document.getElementById('root')!)

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Auth0Provider
          domain="dev-qjlrgux8wf1cl3jf.us.auth0.com"
          clientId="hozLiNJUVuoMgmu46V21mq6xQRXOS1Tp"
          authorizationParams={{
            redirect_uri: window.location.origin,
            audience: "http:127.0.0.1",
          }}
        >
          <App />
        </Auth0Provider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
