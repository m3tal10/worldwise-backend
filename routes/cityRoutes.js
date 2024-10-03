const express = require('express');
const {
  getCities,
  createCity,
  deleteCity,
  getCitiesUser,
} = require('../controllers/cityController');
const { authenticate, authorize } = require('../controllers/authController');

const router = express.Router();
router
  .route('/')
  .get(authenticate, authorize('admin'), getCities)
  .post(authenticate, createCity);

router.route('/:cityId').delete(deleteCity);
module.exports = router;

//Routes for single user
router.route('/user/:userId').get(authenticate, getCitiesUser);
