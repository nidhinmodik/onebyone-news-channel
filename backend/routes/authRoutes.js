const express = require('express');
const router = require('express').Router();
const authController = require('../controllers/authControllers');
const middleware = require('../middlewares/middleware');

// Login Route
router.post('/api/login', authController.login);

// Writer Routes
router.post('/api/news/writer/add', middleware.auth, middleware.role, authController.add_writer);
router.get('/api/news/writers', middleware.auth, middleware.role, authController.get_writers);
router.delete('/api/news/writer/:id', middleware.auth, middleware.role, authController.delete_writer);


// Advertiser Routes
router.post('/api/news/advertiser/add', middleware.auth, middleware.role, authController.add_advertiser);
router.get('/api/news/advertisers', middleware.auth, middleware.role, authController.get_advertisers);
router.delete('/api/news/advertisers/:id', middleware.auth, middleware.role, authController.delete_advertiser);


// Admin Routes
router.post('/api/admin/add', middleware.auth, middleware.role, authController.add_admin);
router.get('/api/admins', middleware.auth, middleware.role, authController.get_admins); // Get all admins
router.delete('/api/admin/delete/:id', middleware.auth, middleware.role, authController.delete_admin);


module.exports = router;
