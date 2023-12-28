import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';

import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <HelmetProvider>
    <BrowserRouter>
      <React.StrictMode>
        <Suspense>
          <App />
        </Suspense>
      </React.StrictMode>
    </BrowserRouter>
  </HelmetProvider>,
);
