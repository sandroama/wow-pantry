import React, { useState } from 'react';
import { 
  ListItem, 
  ListItemText, 
  IconButton, 
  TextField, 
  Box, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';

const PantryItem = ({ item, onDeleteItem, onUpdateItem }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedItem, setEditedItem] = useState(item);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editedItem.quantity <= 0) {
      alert("Amount must be greater than 0");
      return;
    }
    onUpdateItem(editedItem);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedItem(prev => ({
      ...prev,
      [name]: name === 'quantity' ? Number(value) : value
    }));
  };

  const units = ['piece', 'lb', 'oz', 'g', 'kg', 'ml', 'L', 'cup'];

  return (
    <ListItem sx={{ bgcolor: 'background.paper', mb: 1, borderRadius: 1 }}>
      {isEditing ? (
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <TextField
            name="name"
            value={editedItem.name}
            onChange={handleChange}
            sx={{ mr: 1, flexGrow: 1 }}
          />
          <TextField
            name="quantity"
            type="number"
            value={editedItem.quantity}
            onChange={handleChange}
            sx={{ mr: 1, width: '80px' }}
            inputProps={{ min: 0.1, step: 0.1 }}
          />
          <FormControl sx={{ minWidth: 80, mr: 1 }}>
            <Select
              name="unit"
              value={editedItem.unit}
              onChange={handleChange}
            >
              {units.map(unit => (
                <MenuItem key={unit} value={unit}>{unit}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <IconButton onClick={handleSave}>
            <SaveIcon />
          </IconButton>
        </Box>
      ) : (
        <>
          <ListItemText 
            primary={item.name} 
            secondary={`${item.quantity || ''} ${item.unit || ''}`} 
          />
          <Typography variant="caption" sx={{ mr: 2 }}>
            Added: {item.addedAt && typeof item.addedAt.toDate === 'function'
              ? item.addedAt.toDate().toLocaleDateString()
              : 'Date not available'}
          </Typography>
          <IconButton edge="end" aria-label="edit" onClick={handleEdit}>
            <EditIcon />
          </IconButton>
          <IconButton edge="end" aria-label="delete" onClick={() => onDeleteItem(item.id)}>
            <DeleteIcon />
          </IconButton>
        </>
      )}
    </ListItem>
  );
};

export default PantryItem;