const multer = require('multer');
const sharp = require('sharp');

const Post = require('../models/Post');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

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

  // Save the filename to the post object
  req.body.coverImage = req.file.filename; // will be used in the createPost method

  next();
});

exports.setAuthorId = (req, res, next) => {
  if (!req.body.author) req.body.author = req.user.id;

  next();
};

exports.getAllPosts = factory.getAll(Post);

exports.getPost = factory.getOne(Post, {
  path: 'comments'
});

exports.createPost = factory.createOne(Post);

exports.updatePost = factory.updateOne(Post);

exports.deletePost = factory.deleteOne(Post);
