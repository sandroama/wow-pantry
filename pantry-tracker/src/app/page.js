'use client'

import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, TextField, Grid, Paper, Select, MenuItem, FormControl, InputLabel, Alert } from '@mui/material';
import { signInWithGoogle, signOut } from '../utils/auth';
import { auth, db } from '../utils/firebase';
import { collection, addDoc, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import PantryList from '../components/PantryList';
import RecipeSuggestions from '../components/RecipeSuggestions';
import FavoriteRecipes from '../components/FavoriteRecipes';
import NutritionalInfo from '../components/NutritionalInfo';

export default function Home() {
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', amount: 1, unit: 'piece' });
  const [error, setError] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
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
      await addDoc(collection(db, 'users', user.uid, 'items'), newItem);
      setNewItem({ name: '', amount: 1, unit: 'piece' });
    }
  };

  const deleteItem = async (itemId) => {
    if (user) {
      await deleteDoc(doc(db, 'users', user.uid, 'items', itemId));
    }
  };

  const updateItem = async (updatedItem) => {
    if (user) {
      await updateDoc(doc(db, 'users', user.uid, 'items', updatedItem.id), updatedItem);
    }
  };

  const saveRecipe = async (recipe) => {
    if (user) {
      await addDoc(collection(db, 'users', user.uid, 'favoriteRecipes'), { recipe });
    }
  };

  const deleteRecipe = async (recipeId) => {
    if (user) {
      await deleteDoc(doc(db, 'users', user.uid, 'favoriteRecipes', recipeId));
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
              <Typography>Welcome, {user.displayName}!</Typography>
              <Button onClick={signOut}>Sign Out</Button>
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
        <Button onClick={signInWithGoogle}>Sign In with Google</Button>
      )}
    </Box>
  );
}