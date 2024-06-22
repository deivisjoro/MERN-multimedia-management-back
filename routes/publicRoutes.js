import express from 'express';
const router = express.Router();

router.get('/home', (req, res) => {
  res.json({ statusCode: 200, message: 'WELCOME_TO_HOME', data: 'Home Page Content' });
});

router.get('/help', (req, res) => {
  res.json({ statusCode: 200, message: 'HELP_PAGE', data: 'Help Page Content' });
});

router.get('/contact', (req, res) => {
  res.json({ statusCode: 200, message: 'CONTACT_US', data: 'Contact Us Page Content' });
});

export default router;
