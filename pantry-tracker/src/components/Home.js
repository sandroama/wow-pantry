'use client'

import React, { useState, useEffect } from 'react';
import { Box, CircularProgress } from '@mui/material';
import dynamic from 'next/dynamic';

const DynamicComponents = dynamic(() => import('./DynamicComponents'), { ssr: false });

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return <DynamicComponents />;
}