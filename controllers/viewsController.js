const Post = require('../models/Post');
const User = require('../models/User');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Find all posts
  const posts = await Post.find();

  // 2) Build the template

  // 3) Render the template
  res.status(200).render('overview', {
    title: 'All Posts',
    posts
  });
});

exports.getPost = catchAsync(async (req, res, next) => {
  const post = await Post.findOne({ slug: req.params.slug });

  if (!post) {
    return next(new AppError('There is no post with that name', 404));
  }

  res.status(200).render('post', {
    title: post.title,
    post
  });
});
