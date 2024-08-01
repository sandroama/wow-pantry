'use client'

import React, { useState, useEffect } from 'react';
import { auth } from '../utils/firebase';
import IntroPage from '../components/IntroPage';
import Home from '../components/Home'; // We'll create this in the next step

export default function Page() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  return user ? <Home user={user} /> : <IntroPage />;
}