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
  const post = await Post.findOne({ slug: req.params.slug }).populate({
    path: 'comments'
  });

  if (!post) {
    return next(new AppError('There is no post with that name', 404));
  }

  // Format the date for each comment before rendering (because Pug does not support complex JavaScript expressions)
  post.comments.forEach(comment => {
    comment.formattedDate = comment.createdAt.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  });

  res.status(200).render('post', {
    title: post.title,
    post
  });
});

exports.getLoginForm = (req, res, next) => {
  res.status(200).render('login', {
    title: 'Login to your account'
  });
};

exports.getSignupForm = (req, res, next) => {
  res.status(200).render('signup', {
    title: 'Create your account'
  });
};

exports.getAccount = (req, res, next) => {
  res.status(200).render('account', {
    title: 'Your Account'
    // user: req.user // authController already set res.locals.user
  });
};

exports.getNewPostForm = (req, res, next) => {
  res.status(200).render('new-post', {
    title: 'Create Your Post'
  });
};
