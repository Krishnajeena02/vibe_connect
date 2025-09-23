import express from 'express';
import passport from 'passport';
import { handleGoogleCallback } from '../controllers/authController.js';

const router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  handleGoogleCallback
);

export default router;
