import React, { useState } from 'react';
import { 
  Modal, 
  Box, 
  Typography, 
  Rating, 
  Button 
} from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '1px solid #000',
  borderRadius: 5,
  boxShadow: 24,
  p: 4,
};

export default function RatingModal({ open, onSubmit, handleClose }) {
  const [rating, setRating] = useState(0);

  const handleRatingChange = (event, newValue) => {
    setRating(newValue);
  };

  const handleSubmit = () => {
    console.log('Submitted rating:', rating);
    onSubmit(); // dispatch TimerComplete event
    setRating(0); // reset before close
    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Rate your experience
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            my: 2,
          }}
        >
          <Rating
            name="simple-controlled"
            value={rating}
            onChange={handleRatingChange}
            size="large"
          />
          <Typography component="legend">
            {rating === 0 ? 'Select a rating' : `You rated: ${rating}`}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button onClick={handleSubmit} variant="contained" disabled={rating === 0}>
            Submit
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}