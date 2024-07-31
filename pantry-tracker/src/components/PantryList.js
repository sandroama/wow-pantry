import React from 'react';
import { List, Paper, Typography } from '@mui/material';
import PantryItem from './PantryItem';

const PantryList = ({ items, onDeleteItem, onUpdateItem }) => {
  return (
    <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        Your Pantry Items
      </Typography>
      <List>
        {items.map((item) => (
          <PantryItem
            key={item.id}
            item={item}
            onDeleteItem={onDeleteItem}
            onUpdateItem={onUpdateItem}
          />
        ))}
      </List>
    </Paper>
  );
};

export default PantryList;