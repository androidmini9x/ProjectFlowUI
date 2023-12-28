import { useState, useEffect, useMemo } from 'react';

import ThemeProvider from './common/theme/index';
import UserContext from './context/store';
import Router from './route/routes';

function App() {
  const [authed, setAuth] = useState({
    token: null,
    auth: false,
    state: 'none',
    user: null,
  });

  const handleAuth = (val, user) => {
    localStorage.setItem('token', val);
    setAuth({ auth: true, token: val, user });
  };

  const store = useMemo(() => ({ authed, handleAuth }), [authed]);

  useEffect(() => {
    const checkValidToken = async () => {
      try {
        const api = `${import.meta.env.VITE_API}/info`;
        const tk = localStorage.getItem('token');
        const req = await fetch(api, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Token': tk,
          },
        });
        const data = await req.json();
        if (req.status === 200) {
          handleAuth(tk, data);
        }
      } catch (err) {
        console.log(`Error: ${err}`);
      } finally {
        setAuth((prev) => ({ ...prev, state: 'fetched' }));
      }
    };

    checkValidToken();
  }, []);

  return (
    <ThemeProvider>
      <UserContext.Provider value={store}>
        <Router />
      </UserContext.Provider>
    </ThemeProvider>
  );
}

export default App;
