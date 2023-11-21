const BookInstance = require('../models/bookinstance');
const asyncHandler = require('express-async-handler');

// Display list of all BookInstances
exports.book_instance_list = asyncHandler(async (req, res, next) => {
  const allBookInstances = await BookInstance.find({}).populate("book").sort({status: 1}).exec();

  res.render("bookinstance_list", {
    title: "Book Instance List",
    bookinstance_list: allBookInstances,
  });
});

// Display detail page for single BookInstance
exports.book_instance_detail = asyncHandler(async (req, res, next) => {
  const copy = await BookInstance.findById(req.params.id).populate("book").exec();

  if (copy === null) {
    const err = new Error("Copy not found");
    err.status = 404;
    return next(err);
  }

  res.render("bookinstance_detail", {
    title: `Copy: ${copy.id}`,
    copy: copy,
  });
});

// Display BookInstance create form on GET
exports.book_instance_create_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: BookInstance create GET");
});

// Display BookInstance create form on POST
exports.book_instance_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: BookInstance create POST");
});

// Display BookInstance delete form on GET
exports.book_instance_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: BookInstance delete GET");
});

// Display BookInstance delete form on POST
exports.book_instance_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: BookInstance delete POST");
});

// Display BookInstance update form on GET
exports.book_instance_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: BookInstance update GET");
});

// Display BookInstance update form on GET
exports.book_instance_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: BookInstance update POST");
});