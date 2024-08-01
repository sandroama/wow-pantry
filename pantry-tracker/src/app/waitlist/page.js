'use client'

import React from 'react';
import { Box, Typography, Container } from '@mui/material';

export default function Waitlist() {
  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Join our Feature Waitlist
        </Typography>
        <Typography variant="body1">
  Thank you for your interest! We&apos;re currently working on exciting new features. 
  Please check back later for updates on how to join our waitlist.
</Typography>
      </Box>
    </Container>
  );
}