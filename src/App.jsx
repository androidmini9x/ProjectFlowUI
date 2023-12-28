import { useState, useEffect, useMemo } from 'react';

import UserContext from './context/store';

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
    <UserContext.Provider value={store}>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </UserContext.Provider>
  );
}

export default App;
