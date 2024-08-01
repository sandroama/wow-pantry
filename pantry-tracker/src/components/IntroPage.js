'use client'

import React from 'react';
import { Box, Typography, Button, Container, Grid } from '@mui/material';
import CustomImage from './CustomImage'
import { useRouter } from 'next/navigation';

const IntroPage = () => {
  const router = useRouter();

  return (
    <Box sx={{ bgcolor: '#1A1A1A', minHeight: '100vh', color: 'white', py: 4 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
          <CustomImage
  src="https://png.pngtree.com/png-vector/20230728/ourmid/pngtree-food-pantry-vector-png-image_6993223.png"
  alt="WowPantry Logo"
  width={500}
  height={500}
  layout="responsive"
/>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h2" component="h1" gutterBottom>
              WowPantry
            </Typography>
            <Typography variant="h5" gutterBottom>
              Manage pantry items and track nutrition
            </Typography>
            <Box sx={{ mt: 4 }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={() => router.push('/dashboard')}
                sx={{ mr: 2, mb: 2 }}
              >
                Go to Dashboard
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                size="large"
                onClick={() => router.push('/waitlist')}
                sx={{ mb: 2 }}
              >
                Join Feature Waitlist
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default IntroPage;