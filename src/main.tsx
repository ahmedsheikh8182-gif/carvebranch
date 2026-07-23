import { createRoot } from 'react-dom/client';
import { setAuthTokenGetter } from '@workspace/api-client-react';

import App from './App';
import './index.css';

// Wire up JWT auth — the token is stored in localStorage after login
setAuthTokenGetter(() => localStorage.getItem('carve_token'));

createRoot(document.getElementById('root')!).render(<App />);
