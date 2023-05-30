import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.scss'
import App from './App'
import { store } from './app/store'
import { Provider } from 'react-redux'
import * as serviceWorker from './serviceWorker'
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'
import { GoogleOAuthProvider } from '@react-oauth/google';

const persistor = persistStore(store)

const root = ReactDOM.createRoot(document.getElementById('root')!)
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GoogleOAuthProvider clientId={process.env.REACT_APP_SOCIAL_AUTH_GOOGLE_OAUTH2_CLIENT_ID!}>
          <App />
        </GoogleOAuthProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
