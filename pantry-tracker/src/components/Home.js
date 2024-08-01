'use client'

import React, { useState, useEffect } from 'react';
import { Box, CircularProgress } from '@mui/material';
import dynamic from 'next/dynamic';
import { auth } from '../utils/firebase';

const DynamicComponents = dynamic(() => import('./DynamicComponents'), { ssr: false });
const IntroPage = dynamic(() => import('./IntroPage'), { ssr: false });

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return user ? <DynamicComponents user={user} /> : <IntroPage />;
}