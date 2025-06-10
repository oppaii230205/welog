const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, 'A comment must have content'],
      trim: true,
      maxLength: [500, 'A comment must have less or equal than 500 characters']
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: [true, 'A comment must belong to a post']
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'A comment must belong to a user']
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Query middleware
commentSchema.pre(/^find/, function(next) {
  // Do not need to populate the post field here, otherwise it will cause chaining populate issues when querying comments on each post
  // as it will try to populate the post field again, which is already populated in the Post model.
  this.populate({
    path: 'user',
    select: '_id name photo'
  });
  // this.populate({
  //   path: 'post',
  //   select: 'title'
  // });

  next();
});

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
