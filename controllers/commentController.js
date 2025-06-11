const Comment = require('../models/Comment');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.setPostUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.post) req.body.post = req.params.postId;
  if (!req.body.user) req.body.user = req.user._id;

  next();
};

exports.getAllComments = catchAsync(async (req, res, next) => {
  let filter = {};

  if (req.params.postId) filter = { post: req.params.postId };

  // Find all comments, optionally filtered by postId
  const comments = await Comment.find(filter);

  res.status(200).json({
    status: 'success',
    results: comments.length,
    data: {
      comments
    }
  });
});

exports.getComment = catchAsync(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    return next(new AppError('No comment found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      comment
    }
  });
});

exports.createComment = catchAsync(async (req, res, next) => {
  const newComment = await Comment.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      comment: newComment
    }
  });
});

exports.updateComment = catchAsync(async (req, res, next) => {
  const comment = await Comment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!comment) {
    return next(new AppError('No comment found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      comment
    }
  });
});

exports.deleteComment = catchAsync(async (req, res, next) => {
  const comment = await Comment.findByIdAndDelete(req.params.id);

  if (!comment) {
    return next(new AppError('No comment found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});
