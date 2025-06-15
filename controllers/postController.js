const multer = require('multer');
const sharp = require('sharp');

const Post = require('../models/Post');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadCoverImage = upload.single('coverImage');

exports.resizeCoverImage = catchAsync(async (req, res, next) => {
  // console.log(req.file);

  if (!req.file) return next();

  // Create a unique filename
  req.file.filename = `post-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/posts/${req.file.filename}`);

  next();
});

exports.getAllPosts = catchAsync(async (req, res, next) => {
  const posts = await Post.find();

  res.status(200).json({
    status: 'success',
    results: posts.length,
    data: {
      posts
    }
  });
});

exports.getPost = catchAsync(async (req, res, next) => {
  const postId = req.params.id;

  const post = await Post.findById(postId).populate({
    path: 'comments'
  });

  if (!post) {
    return next(new AppError('No post found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      post
    }
  });
});

exports.setAuthorId = (req, res, next) => {
  if (!req.body.author) req.body.author = req.user.id;

  next();
};

exports.createPost = catchAsync(async (req, res, next) => {
  if (req.file) {
    req.body.coverImage = req.file.filename;
  }

  const newPost = await Post.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      post: newPost
    }
  });
});

exports.updatePost = catchAsync(async (req, res, next) => {
  const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!post) {
    return next(new AppError('No post found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      post
    }
  });
});

exports.deletePost = catchAsync(async (req, res, next) => {
  const post = await Post.findByIdAndDelete(req.params.id);

  if (!post) {
    return next(new AppError('No post found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});
