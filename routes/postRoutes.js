const express = require('express');
const postController = require('../controllers/postController');
const authController = require('../controllers/authController');
const commentRouter = require('./commentRoutes');

const router = express.Router();

router.use('/:postId/comments', commentRouter);

router
  .route('/')
  .get(authController.protect, postController.getAllPosts)
  .post(
    authController.protect,
    postController.uploadCoverImage,
    postController.resizeCoverImage,
    postController.setAuthorId, // must after multer because it needs multer to have processed the request and create req.body
    postController.createPost
  );

router
  .route('/:id')
  .get(postController.getPost)
  .patch(postController.updatePost)
  .delete(
    authController.protect,
    authController.restrictTo('admin'), // This is a function call, not a middleware, which means it will execute the function and return the middleware
    postController.deletePost
  );

module.exports = router;
