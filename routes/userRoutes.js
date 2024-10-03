const express = require('express');

const {
  getUsers,
  createUser,
  updateUser,
  getUser,
  deleteUser,
  updateMe,
  uploadUserImage,
  resizeUserImage,
} = require('../controllers/userController');
const {
  signup,
  login,
  authenticate,
  authorize,
  forgotPassword,
  resetPassword,
  changePassword,
  logout,
} = require('../controllers/authController');

const router = express.Router();

//for authentication
router.route('/signup').post(signup);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/forgotPassword').post(forgotPassword);
router.route('/resetPassword/:resetToken').patch(resetPassword);

//01. need a router.param middleware for user id check.
router.route('/changePassword').patch(authenticate, changePassword);

//For current user operation on their account informations
router
  .route('/me')
  .patch(authenticate, uploadUserImage, resizeUserImage, updateMe);

//For admin operations on user
router
  .route('/')
  .get(authenticate, authorize('admin'), getUsers)
  .post(authenticate, authorize('admin'), createUser);
router
  .route('/:userId')
  .get(getUser)
  .patch(authenticate, authorize('admin'), updateUser)
  .delete(authenticate, authorize('admin'), deleteUser);

module.exports = router;
