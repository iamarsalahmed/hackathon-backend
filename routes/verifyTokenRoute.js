import express from "express";
// import {isAuthenticated} from '../middleware/auth.js'

const router = express.Router();

// POST /token route to verify the token
router.post('/token',  async (req, res) => {
  try {
  

    
    // Send success message if token is valid
    res.status(200).json({ message: 'Token is valid' });
  } catch (error) {
    console.error('Error in /token route:', error.message);
    // Respond with a generic error message
    res.status(500).json({ message: 'An error occurred while verifying the token' });
  }
});

export default router;
