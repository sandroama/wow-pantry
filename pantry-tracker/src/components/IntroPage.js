'use client'

import React, { useState } from 'react';
import { Box, Typography, Button, Container, Grid, Paper, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar } from '@mui/material';
import { motion } from 'framer-motion';
import { signInWithGoogle, signInWithGitHub, signInWithEmail, signUpWithEmail, addToWaitlist } from '../utils/auth';
import CustomImage from './CustomImage';

const IntroPage = () => {
  const [openEmailDialog, setOpenEmailDialog] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [openWaitlistDialog, setOpenWaitlistDialog] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleEmailSignIn = async () => {
    try {
      await signInWithEmail(email, password);
    } catch (error) {
      console.error("Error signing in with email", error);
      // Handle error (show message to user)
    }
  };

  const handleEmailSignUp = async () => {
    try {
      await signUpWithEmail(email, password);
    } catch (error) {
      console.error("Error signing up with email", error);
      // Handle error (show message to user)
    }
  };

  const handleWaitlistSignUp = async () => {
    try {
      await addToWaitlist(waitlistEmail);
      setOpenWaitlistDialog(false);
      setWaitlistEmail('');
      setSnackbarMessage('Successfully added to the waitlist! Soon we will notify you with the most interesting updates to the app!');
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error signing up for waitlist", error);
      setSnackbarMessage('Failed to sign up for waitlist. Please try again.');
      setSnackbarOpen(true);
    }
  };
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };


  return (
    <Box sx={{ 
      bgcolor: '#f5f5f5', 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center',
      py: 4 
    }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography variant="h2" component="h1" gutterBottom sx={{ color: '#333' }}>
                WowPantry
              </Typography>
              <Typography variant="h5" gutterBottom sx={{ color: '#666' }}>
                Manage pantry items and track nutrition with ease
              </Typography>
              <CustomImage
                src="https://png.pngtree.com/png-vector/20230728/ourmid/pngtree-food-pantry-vector-png-image_6993223.png"
                alt="WowPantry Logo"
                width={500}
                height={500}
                layout="responsive"
              />
            </motion.div>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Typography variant="h4" gutterBottom sx={{ color: '#333' }}>
                  Get Started
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  onClick={() => signInWithGoogle()}
                  sx={{ mb: 2 }}
                >
                  Sign In with Google
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  size="large"
                  onClick={() => signInWithGitHub()}
                  sx={{ mb: 2 }}
                >
                  Sign In with GitHub
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  size="large"
                  onClick={() => setOpenEmailDialog(true)}
                  sx={{ mb: 2 }}
                >
                  Sign In with Email
                </Button>
                <Button
                  variant="text"
                  color="primary"
                  fullWidth
                  size="large"
                  onClick={() => setOpenWaitlistDialog(true)}
                >
                  Sign Up for Feature Waitlist
                </Button>
              </motion.div>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Email Sign In/Up Dialog */}
      <Dialog open={openEmailDialog} onClose={() => setOpenEmailDialog(false)}>
        <DialogTitle>{isSignUp ? "Sign Up" : "Sign In"} with Email</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Email Address"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEmailDialog(false)}>Cancel</Button>
          <Button onClick={isSignUp ? handleEmailSignUp : handleEmailSignIn}>
            {isSignUp ? "Sign Up" : "Sign In"}
          </Button>
          <Button onClick={() => setIsSignUp(!isSignUp)}>
            {isSignUp ? "Switch to Sign In" : "Switch to Sign Up"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Waitlist Dialog */}
      <Dialog open={openWaitlistDialog} onClose={() => setOpenWaitlistDialog(false)}>
        <DialogTitle>Sign Up for Feature Waitlist</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Email Address"
            type="email"
            fullWidth
            value={waitlistEmail}
            onChange={(e) => setWaitlistEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenWaitlistDialog(false)}>Cancel</Button>
          <Button onClick={handleWaitlistSignUp}>Sign Up</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />


    </Box>
  );
};

export default IntroPage;