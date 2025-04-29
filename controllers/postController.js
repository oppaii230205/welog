const Post = require('../models/Post');
const appError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllPosts = (req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: {
      posts: [] // Placeholder for posts data
    }
  });
};

exports.getPost = (req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: {
      post: {} // Placeholder for a single post data
    }
  });
};

exports.createPost = catchAsync(async (req, res, next) => {
  const newPost = await Post.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      post: newPost
    }
  });
});

exports.updatePost = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: {
      post: {} // Placeholder for updated post data
    }
  });
});

exports.deletePost = catchAsync(async (req, res, next) => {
  res.status(204).json({
    status: 'success',
    data: null
  });
});
