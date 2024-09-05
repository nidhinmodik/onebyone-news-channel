const express = require('express')
const router = require('express').Router();
const middleware = require('../middlewares/middleware');
const adController = require('../controllers/AdControllers');
const authControllers = require('../controllers/authControllers');

// Advertisements

// Add a new advertisement
router.post('/api/ads/add', middleware.auth, middleware.role, adController.add_ad);

// Update an existing advertisement by ID
router.put('/api/ads/update/:ad_id', middleware.auth, middleware.role,  adController.update_ad);

// Get all advertisements (for dashboard)
router.get('/api/ads', middleware.auth, middleware.role,  adController.get_dashboard_ads);

// Get a single advertisement by ID (for dashboard)
router.get('/api/ads/:ad_id', middleware.auth, middleware.role,  adController.get_dashboard_single_ad);

//delete advertisement
router.delete('/api/ads/delete/:ad_id', middleware.auth, middleware.role,  adController.delete_ad);



// Website

// Get all advertisements for the public
router.get('/api/all/ads', adController.get_all_ads);

// Get a specific advertisement by slug
router.get('/api/ads/details/:slug', adController.get_ad);

// Advertiser Routes
router.post('/api/news/advertiser/add', middleware.auth, middleware.role, authControllers.add_advertiser);
router.get('/api/news/advertisers', middleware.auth, middleware.role, authControllers.get_advertisers);

module.exports = router;
