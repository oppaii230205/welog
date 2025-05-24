const mongoose = require('mongoose');
const slugify = require('slugify');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A post muse have a title'],
      unique: true,
      trim: true,
      maxlength: [
        100,
        'A post title must have less or equal than 40 characters'
      ]
    },
    slug: {
      type: String,
      unique: true
    },
    content: {
      type: String,
      required: [true, 'A post must have a content']
    },
    excerpt: {
      type: String
      // required: [true, 'A post must have a excerpt']
    },
    coverImage: {
      type: String,
      required: [true, 'A post must have a cover image'],
      default: 'default-post.jpg'
    },
    // Child reference to User model
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
      // required: [true, 'A post must have an author'] //TODO
    },
    tags: [String],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
      }
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    views: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true, // Adds `createdAt` and `updatedAt` fields,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

//  1. Create a slug from the title before saving the post

postSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true });
  }
  next();
});

//2. Auto-generate exceprt from content (first 100 characters)

postSchema.pre('save', function(next) {
  if (this.isModified('content')) {
    this.excerpt = `${this.content.substring(0, 100)} + ...`;
  }
  next();
});

// 3. Virtual propertiy for comment count
postSchema.virtual('commentCount').get(function() {
  return this.comments.length || 0;
});

// 4. Query middleware to populate author
postSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'author',
    select: 'name email photo'
  });

  next();
});

// 5. Static method to get posts by author
postSchema.statics.getPostsByAuthor = async function(authorId) {
  return await this.find({ author: authorId });
};

//6. Indexes for performance optimization
postSchema.index({ title: 'text', content: 'text' });

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
