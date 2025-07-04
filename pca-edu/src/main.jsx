import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { MDXProvider } from '@mdx-js/react';

import App from './App.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import Callout from './components/Callout.jsx';
import './index.css';

const mdxComponents = { Callout };

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <MDXProvider components={mdxComponents}>
          <App />
        </MDXProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
