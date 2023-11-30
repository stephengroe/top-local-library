const BookInstance = require('../models/bookinstance');
const Book = require('../models/book')
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

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
  const allBooks = await Book.find({}, 'title').sort({ title: 1 }).exec();

  res.render('bookinstance_form', {
    title: 'Create BookInstace',
    book_list: allBooks,
  });
});

// Display BookInstance create form on POST
exports.book_instance_create_post = [
  // Validate and sanitize fields.
  body("book", "Book must be specified").trim().isLength({ min: 1 }).escape(),
  body("imprint", "Imprint must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("status").escape(),
  body("due_back", "Invalid date")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a BookInstance object with escaped and trimmed data.
    const bookInstance = new BookInstance({
      book: req.body.book,
      imprint: req.body.imprint,
      status: req.body.status,
      due_back: req.body.due_back,
    });

    if (!errors.isEmpty()) {
      // There are errors.
      // Render form again with sanitized values and error messages.
      const allBooks = await Book.find({}, "title").sort({ title: 1 }).exec();

      res.render("bookinstance_form", {
        title: "Create BookInstance",
        book_list: allBooks,
        selected_book: bookInstance.book._id,
        errors: errors.array(),
        bookinstance: bookInstance,
      });
      return;
    } else {
      // Data from form is valid
      await bookInstance.save();
      res.redirect(bookInstance.url);
    }
  }),
];


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