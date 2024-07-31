import React, { useState } from 'react';
import { List, ListItem, ListItemText, IconButton, Paper, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const FavoriteRecipes = ({ recipes, onDeleteRecipe }) => {
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const handleOpenRecipe = (recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleCloseRecipe = () => {
    setSelectedRecipe(null);
  };

  const formatRecipe = (recipeText) => {
    const sections = recipeText.split('\n\n');
    return sections.map((section, index) => (
      <Typography key={index} variant="body1" paragraph>
        {section.split('\n').map((line, lineIndex) => (
          <React.Fragment key={lineIndex}>
            {formatLine(line)}
            <br />
          </React.Fragment>
        ))}
      </Typography>
    ));
  };

  const formatLine = (line) => {
    // Bold text wrapped in **
    line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Italic text wrapped in *
    line = line.replace(/\*(.*?)\*/g, '<em>$1</em>');
    // Convert markdown-style lists to HTML lists
    if (line.startsWith('* ')) {
      line = '<li>' + line.substring(2) + '</li>';
    }
    return <span dangerouslySetInnerHTML={{ __html: line }} />;
  };

  return (
    <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        Favorite Recipes
      </Typography>
      <List>
        {recipes.map((recipe) => (
          <ListItem key={recipe.id} sx={{ cursor: 'pointer' }} onClick={() => handleOpenRecipe(recipe)}>
            <ListItemText 
              primary={formatLine(recipe.recipe.split('\n')[0])}
              secondary={formatLine(recipe.recipe.split('\n').slice(1, 3).join(' '))}
            />
            <IconButton edge="end" aria-label="delete" onClick={(e) => {
              e.stopPropagation();
              onDeleteRecipe(recipe.id);
            }}>
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
      <Dialog open={!!selectedRecipe} onClose={handleCloseRecipe} maxWidth="md" fullWidth>
        <DialogTitle>{selectedRecipe && formatLine(selectedRecipe.recipe.split('\n')[0])}</DialogTitle>
        <DialogContent dividers>
          {selectedRecipe && formatRecipe(selectedRecipe.recipe)}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRecipe}>Close</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default FavoriteRecipes;