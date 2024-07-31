// import React, { useState } from 'react';
// import { Button, TextField, Typography, Paper, CircularProgress, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

// const RecipeSuggestions = ({ items, onSaveRecipe }) => {
//   const [recipe, setRecipe] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [model, setModel] = useState('llama');

//   const generateRecipe = async () => {
//     setLoading(true);
//     const ingredients = items.map(item => `${item.quantity} ${item.unit} of ${item.name}`).join(', ');
    
//     try {
//       const response = await fetch(model === 'llama' ? '/api/generateRecipe' : '/api/generateRecipeGemini', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ ingredients }),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to generate recipe');
//       }

//       const data = await response.json();
//       setRecipe(data.recipe);
//     } catch (error) {
//       console.error("Error generating recipe:", error);
//       setRecipe("Sorry, there was an error generating the recipe. Please try again later.");
//     }
//     setLoading(false);
//   };

//   return (
//     <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
//       <Typography variant="h6" gutterBottom>
//         Recipe Suggestions
//       </Typography>
//       <FormControl fullWidth sx={{ mb: 2 }}>
//         <InputLabel>Model</InputLabel>
//         <Select
//           value={model}
//           label="Model"
//           onChange={(e) => setModel(e.target.value)}
//         >
//           <MenuItem value="llama">Llama 3.1</MenuItem>
//           <MenuItem value="gemini">Gemini</MenuItem>
//         </Select>
//       </FormControl>
//       <Button 
//         variant="contained" 
//         color="primary" 
//         onClick={generateRecipe} 
//         disabled={loading || items.length === 0}
//       >
//         Generate Recipe
//       </Button>
//       {loading && <CircularProgress sx={{ ml: 2 }} />}
//       {recipe && (
//         <>
//           <TextField
//             fullWidth
//             multiline
//             rows={10}
//             value={recipe}
//             variant="outlined"
//             margin="normal"
//             InputProps={{
//               readOnly: true,
//             }}
//           />
//           <Button
//             variant="outlined"
//             color="secondary"
//             onClick={() => onSaveRecipe(recipe)}
//           >
//             Save Recipe
//           </Button>
//         </>
//       )}
//     </Paper>
//   );
// };

// export default RecipeSuggestions;

import React, { useState } from 'react';
import { Button, TextField, Typography, Paper, CircularProgress, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const RecipeSuggestions = ({ items, onSaveRecipe }) => {
  const [recipe, setRecipe] = useState('');
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState('llama');

  const generateRecipe = async () => {
    setLoading(true);
    const ingredients = items.map(item => `${item.amount} ${item.unit} of ${item.name}`).join(', ');
    
    const prompt = `Given these ingredients: ${ingredients}, suggest a recipe that uses as many of them as possible. Format the response as follows:
    Recipe Name: [Recipe Name]
    Ingredients Used:
    - [List of ingredients used]
    Ingredients Not Used:
    - [List of ingredients not used]
    Additional Ingredients:
    - [List of additional ingredients needed]
    Instructions:
    1. [Step 1]
    2. [Step 2]
    ...
    Nutritional Information:
    [Brief nutritional overview]`;

    try {
      const response = await fetch(model === 'llama' ? '/api/generateRecipe' : '/api/generateRecipeGemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ingredients, prompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate recipe');
      }

      const data = await response.json();
      setRecipe(data.recipe);
    } catch (error) {
      console.error("Error generating recipe:", error);
      setRecipe("Sorry, there was an error generating the recipe. Please try again later.");
    }
    setLoading(false);
  };

  const formatRecipe = (recipeText) => {
    const sections = recipeText.split('\n\n');
    return sections.map((section, index) => (
      <Typography key={index} variant="body1" paragraph>
        {section.split('\n').map((line, lineIndex) => (
          <React.Fragment key={lineIndex}>
            {line}
            <br />
          </React.Fragment>
        ))}
      </Typography>
    ));
  };

  return (
    <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        Recipe Suggestions
      </Typography>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Model</InputLabel>
        <Select
          value={model}
          label="Model"
          onChange={(e) => setModel(e.target.value)}
        >
          <MenuItem value="llama">Llama 3.1</MenuItem>
          <MenuItem value="gemini">Gemini</MenuItem>
        </Select>
      </FormControl>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={generateRecipe} 
        disabled={loading || items.length === 0}
      >
        Generate Recipe
      </Button>
      {loading && <CircularProgress sx={{ ml: 2 }} />}
      {recipe && (
        <>
          <Paper elevation={1} sx={{ p: 2, mt: 2, maxHeight: '400px', overflow: 'auto' }}>
            {formatRecipe(recipe)}
          </Paper>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => onSaveRecipe(recipe)}
            sx={{ mt: 2 }}
          >
            Save Recipe
          </Button>
        </>
      )}
    </Paper>
  );
};

export default RecipeSuggestions;