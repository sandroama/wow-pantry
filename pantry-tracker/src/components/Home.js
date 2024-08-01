'use client'

import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, TextField, Grid, Paper, Select, MenuItem, FormControl, InputLabel, Alert } from '@mui/material';
import { signInWithGoogle, signInWithGitHub, signUpWithEmail, signInWithEmail, signOut } from '../utils/auth';
import { auth, db } from '../utils/firebase';
import { collection, addDoc, deleteDoc, doc, onSnapshot, updateDoc, setDoc } from 'firebase/firestore';
import PantryList from './PantryList';
import RecipeSuggestions from './RecipeSuggestions';
import FavoriteRecipes from './FavoriteRecipes';
import NutritionalInfo from './NutritionalInfo';

export default function Home() {
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
        // Create or update user document in Firestore
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

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGitHubSignIn = async () => {
    try {
      await signInWithGitHub();
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
        await addDoc(collection(db, 'users', user.uid, 'items'), newItem);
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
        const docRef = await addDoc(collection(db, 'users', user.uid, 'favoriteRecipes'), { recipe });
        console.log("Recipe saved successfully with ID: ", docRef.id);
        // Optionally, you can update the state or show a success message here
      } catch (error) {
        console.error("Error saving recipe: ", error);
        setError('Failed to save recipe. Please try again.');
      }
    } else {
      setError('You must be logged in to save recipes.');
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
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Pantry Tracker
      </Typography>
      {user ? (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
              <Typography>Welcome, {user.email}!</Typography>
              <Button onClick={handleSignOut}>Sign Out</Button>
              <Box sx={{ mt: 2, display: 'flex', alignItems: 'flex-end' }}>
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
                <Button onClick={addItem} variant="contained">Add Item</Button>
              </Box>
              {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
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
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Button onClick={handleGoogleSignIn} variant="contained">Sign In with Google</Button>
          </Grid>
          <Grid item xs={12}>
            <Button onClick={handleGitHubSignIn} variant="contained">Sign In with GitHub</Button>
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
            <Button onClick={handleEmailSignUp} variant="contained">Sign Up</Button>
          </Grid>
          <Grid item xs={6}>
            <Button onClick={handleEmailSignIn} variant="contained">Sign In</Button>
          </Grid>
        </Grid>
      )}
      {error && <Alert severity="error">{error}</Alert>}
    </Box>
  );
}