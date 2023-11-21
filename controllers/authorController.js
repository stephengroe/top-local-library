const Author = require('../models/author');
const Book = require('../models/book');
const asyncHandler = require('express-async-handler');

// Display list of all authors
exports.author_list = asyncHandler(async (req, res, next) => {
  const allAuthors = await Author.find({}).sort({family_name: 1}).exec();

  res.render("author_list", {
    title: "Author List",
    author_list: allAuthors,
  })
});

// Display detail page for single author
exports.author_detail = asyncHandler(async (req, res, next) => {
  const [author, bookList] = await Promise.all([
    Author.findById(req.params.id).exec(),
    Book.find({author: req.params.id}, "title summary").sort({title: 1}).exec(),
  ]);

  if (author === null) {
    const err = new Error("Author not found");
    err.status = 404;
    return next(err);
  }

  res.render("author_detail", {
    title: `Author: ${author.name}`,
    author: author,
    book_list: bookList,
  });
});

// Display author create form on GET
exports.author_create_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Author create GET");
});

// Display author create form on POST
exports.author_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Author create POST");
});

// Display author delete form on GET
exports.author_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Author delete GET");
});

// Display author delete form on POST
exports.author_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Author delete POST");
});

// Display author update form on GET
exports.author_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Author update GET");
});

// Display author update form on GET
exports.author_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Author update POST");
});