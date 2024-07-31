import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3498db',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#2ecc71',
    },
    background: {
      default: '#ecf0f1',
      paper: '#ffffff',
    },
    text: {
      primary: '#2c3e50',
      secondary: '#7f8c8d',
    },
    error: {
      main: '#e74c3c',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#3498db',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 'bold',
          borderRadius: '8px',
        },
        containedPrimary: {
          backgroundColor: '#2ecc71',
          '&:hover': {
            backgroundColor: '#27ae60',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
          },
        },
      },
    },
    MuiList: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          overflow: 'hidden',
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#f5f5f5',
          },
        },
      },
    },
  },
});

export default theme;