import { styled } from '@mui/system';
import { Box, Button, TextField } from '@mui/material';

export const AuthContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
});

export const AuthCard = styled(Box)({
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  borderRadius: '20px',
  padding: '40px',
  width: '100%',
  maxWidth: '400px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
});

export const AuthTextField = styled(TextField)({
  marginBottom: '20px',
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'rgba(0, 0, 0, 0.23)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(0, 0, 0, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#FE6B8B',
    },
  },
});

export const AuthButton = styled(Button)({
  background: 'black',
  color: 'white',
  padding: '10px 0',
  fontSize: '1rem',
  fontWeight: 'bold',
  '&:hover': {
    background: '#333',
  },
});
