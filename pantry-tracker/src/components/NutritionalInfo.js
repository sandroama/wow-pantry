import React, { useState } from 'react';
import { Button, Typography, CircularProgress, List, ListItem, ListItemText, Paper, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const NutritionalInfo = ({ items }) => {
  const [info, setInfo] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNutritionalInfo = async () => {
    setLoading(true);
    const nutritionalInfo = [];
    for (const item of items) {
      try {
        const response = await fetch('/api/getNutritionalInfo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ item }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch nutritional information');
        }

        const data = await response.json();
        nutritionalInfo.push({ name: item.name, info: data.info });
      } catch (error) {
        console.error("Error fetching nutritional information:", error);
        nutritionalInfo.push({ name: item.name, info: "Error fetching information" });
      }
    }
    setInfo(nutritionalInfo);
    setLoading(false);
  };

  const formatNutritionalInfo = (infoText) => {
    const lines = infoText.split('\n');
    return lines.map((line, index) => {
      line = line.replace(/\*\*/g, ''); // Remove all asterisks
      if (line.startsWith('Calories:')) {
        return <Typography key={index} variant="subtitle1" fontWeight="bold">{line}</Typography>;
      } else if (line.startsWith('Macronutrients:')) {
        return <Typography key={index} variant="subtitle1" fontWeight="bold" sx={{ mt: 1 }}>{line}</Typography>;
      } else if (line.startsWith('Notable vitamins and minerals:')) {
        return <Typography key={index} variant="subtitle1" fontWeight="bold" sx={{ mt: 1 }}>{line}</Typography>;
      } else if (line.startsWith('Note:')) {
        return <Typography key={index} variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>{line}</Typography>;
      } else if (line.trim().startsWith('-')) {
        return <Typography key={index} variant="body1" component="li" sx={{ ml: 2 }}>{line.trim().substring(1)}</Typography>;
      } else {
        return <Typography key={index} variant="body1">{line}</Typography>;
      }
    });
  };

  return (
    <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        Nutritional Information
      </Typography>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={fetchNutritionalInfo} 
        disabled={loading || items.length === 0}
      >
        Get Nutritional Info
      </Button>
      {loading && <CircularProgress sx={{ ml: 2 }} />}
      {info.length > 0 && (
        <List>
          {info.map((item, index) => (
            <Accordion key={index}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>{item.name}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {formatNutritionalInfo(item.info)}
              </AccordionDetails>
            </Accordion>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default NutritionalInfo;