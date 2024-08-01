'use client'

import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, TextField, Grid, Paper, Select, MenuItem, FormControl, InputLabel, Alert, AppBar, Toolbar, IconButton, Container } from '@mui/material';
import { signInWithGoogle, signInWithGitHub, signUpWithEmail, signInWithEmail, signOut } from '../utils/auth';
import { auth, db } from '../utils/firebase';
import { collection, addDoc, deleteDoc, doc, onSnapshot, updateDoc, getDocs, setDoc } from 'firebase/firestore';
import PantryList from './PantryList';
import RecipeSuggestions from './RecipeSuggestions';
import FavoriteRecipes from './FavoriteRecipes';
import NutritionalInfo from './NutritionalInfo';
import { motion } from 'framer-motion';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

export default function DynamicComponents() {
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', amount: 1, unit: 'piece' });
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      if (user) {
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          lastLogin: new Date()
        }, { merge: true });

        const itemsRef = collection(db, 'users', user.uid, 'items');
        const unsubscribeItems = onSnapshot(itemsRef, (snapshot) => {
          const itemsList = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
          setItems(itemsList);
        });

        const favoritesRef = collection(db, 'users', user.uid, 'favoriteRecipes');
        const unsubscribeFavorites = onSnapshot(favoritesRef, (snapshot) => {
          const favoritesList = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
          setFavoriteRecipes(favoritesList);
        });

        return () => {
          unsubscribeItems();
          unsubscribeFavorites();
        };
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      migrateExistingData();
    }
  }, [user]);

  const migrateExistingData = async () => {
    if (user) {
      const itemsRef = collection(db, 'users', user.uid, 'items');
      const snapshot = await getDocs(itemsRef);
      
      snapshot.forEach(async (doc) => {
        const data = doc.data();
        if (!data.addedAt) {
          await updateDoc(doc.ref, {
            name: data.name || 'Unnamed Item',
            quantity: data.amount || 1,
            unit: data.unit || 'piece',
            addedAt: new Date()
          });
        }
      });
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const user = await signInWithGoogle();
      if (user) {
        // User signed in successfully
      } else {
        // User closed the popup or cancelled the sign-in
        setError('Sign-in was cancelled. Please try again.');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGitHubSignIn = async () => {
    try {
      const user = await signInWithGitHub();
      if (user) {
        // User signed in successfully
      } else {
        // User closed the popup or cancelled the sign-in
        setError('Sign-in was cancelled. Please try again.');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEmailSignUp = async () => {
    try {
      await signUpWithEmail(email, password);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEmailSignIn = async () => {
    try {
      await signInWithEmail(email, password);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setUser(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem(prev => ({
      ...prev,
      [name]: name === 'amount' ? Number(value) : value
    }));
  };

  const addItem = async () => {
    if (newItem.name.trim() === '') {
      setError('Item name cannot be empty');
      return;
    }
    if (newItem.amount <= 0) {
      setError('Amount must be greater than 0');
      return;
    }
    setError('');
    if (user) {
      try {
        await addDoc(collection(db, 'users', user.uid, 'items'), {
          name: newItem.name,
          quantity: newItem.amount,
          unit: newItem.unit,
          addedAt: new Date()
        });
        setNewItem({ name: '', amount: 1, unit: 'piece' });
      } catch (error) {
        console.error("Error adding document: ", error);
        setError('Failed to add item. Please try again.');
      }
    }
  };

  const deleteItem = async (itemId) => {
    if (user) {
      try {
        await deleteDoc(doc(db, 'users', user.uid, 'items', itemId));
      } catch (error) {
        console.error("Error removing document: ", error);
        setError('Failed to delete item. Please try again.');
      }
    }
  };

  const updateItem = async (updatedItem) => {
    if (user) {
      try {
        await updateDoc(doc(db, 'users', user.uid, 'items', updatedItem.id), updatedItem);
      } catch (error) {
        console.error("Error updating document: ", error);
        setError('Failed to update item. Please try again.');
      }
    }
  };

  const saveRecipe = async (recipe) => {
    if (user) {
      try {
        await addDoc(collection(db, 'users', user.uid, 'favoriteRecipes'), { recipe });
      } catch (error) {
        console.error("Error saving recipe: ", error);
        setError('Failed to save recipe. Please try again.');
      }
    }
  };

  const deleteRecipe = async (recipeId) => {
    if (user) {
      try {
        await deleteDoc(doc(db, 'users', user.uid, 'favoriteRecipes', recipeId));
      } catch (error) {
        console.error("Error deleting recipe: ", error);
        setError('Failed to delete recipe. Please try again.');
      }
    }
  };

  const units = ['piece', 'lb', 'oz', 'g', 'kg', 'ml', 'L', 'cup'];

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <AppBar position="static" color="primary" elevation={0}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            WowPantry
          </Typography>
          {user && (
            <IconButton color="inherit" onClick={handleSignOut}>
              <ExitToAppIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {user ? (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                  <Typography variant="h5" gutterBottom>Add New Item</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 2 }}>
                    <TextField 
                      name="name"
                      value={newItem.name}
                      onChange={handleInputChange}
                      label="New Item"
                      sx={{ mr: 1, flexGrow: 1 }}
                    />
                    <TextField 
                      name="amount"
                      type="number"
                      value={newItem.amount}
                      onChange={handleInputChange}
                      label="Amount"
                      sx={{ mr: 1, width: '80px' }}
                      inputProps={{ min: 0.1, step: 0.1 }}
                    />
                    <FormControl sx={{ minWidth: 80, mr: 1 }}>
                      <InputLabel>Unit</InputLabel>
                      <Select
                        name="unit"
                        value={newItem.unit}
                        onChange={handleInputChange}
                        label="Unit"
                      >
                        {units.map(unit => (
                          <MenuItem key={unit} value={unit}>{unit}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                  <Button onClick={addItem} variant="contained" fullWidth>Add Item</Button>
                </Paper>
                <PantryList items={items} onDeleteItem={deleteItem} onUpdateItem={updateItem} />
              </Grid>
              <Grid item xs={12} md={6}>
                <RecipeSuggestions items={items} onSaveRecipe={saveRecipe} />
                <FavoriteRecipes recipes={favoriteRecipes} onDeleteRecipe={deleteRecipe} />
                <NutritionalInfo items={items} />
              </Grid>
            </Grid>
          ) : (
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h4" gutterBottom sx={{ color: '#333' }}>
                Sign In or Sign Up
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Button onClick={handleGoogleSignIn} variant="contained" fullWidth>Sign In with Google</Button>
                </Grid>
                <Grid item xs={12}>
                  <Button onClick={handleGitHubSignIn} variant="contained" fullWidth>Sign In with GitHub</Button>
                </Grid>
                <Grid item xs={12}>
                  <TextField 
                    label="Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    fullWidth 
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField 
                    label="Password" 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    fullWidth 
                  />
                </Grid>
                <Grid item xs={6}>
                  <Button onClick={handleEmailSignUp} variant="contained" fullWidth>Sign Up</Button>
                </Grid>
                <Grid item xs={6}>
                  <Button onClick={handleEmailSignIn} variant="contained" fullWidth>Sign In</Button>
                </Grid>
              </Grid>
            </Paper>
          )}
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        </motion.div>
      </Container>
    </Box>
  );
}