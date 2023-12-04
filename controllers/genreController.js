const Genre = require('../models/genre');
const Book = require('../models/book');
const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');

// Display list of all Genres
exports.genre_list = asyncHandler(async (req, res, next) => {
  const allGenres = await Genre.find({}).sort({name: 1}).exec();

  res.render("genre_list", {
    title: "Genre list",
    genre_list: allGenres,
  });
});

// Display detail page for single Genre
exports.genre_detail = asyncHandler(async (req, res, next) => {
  const [genre, booksInGenre] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    Book.find({ genre: req.params.id }, "title summary").sort({title: 1}).exec(),
  ]);
  
  if (genre === null) {
    const err = new Error("Genre not found");
    err.status = 404;
    return next(err);
  }

  res.render("genre_detail", {
    title: `Genre: ${genre.name}`,
    genre: genre,
    genre_books: booksInGenre,
  });
});

// Display Genre create form on GET
exports.genre_create_get = (req, res, next) => {
  res.render("genre_form", { title: 'Create Genre' });
};

// Display Genre create form on POST
exports.genre_create_post = [

  // Validate and sanitize request
  body("name", "Genre name must contain at least 3 characters.")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  // Process
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const genre = new Genre({ name: req.body.name });

    if (!errors.isEmpty()) {
      res.render('genre_form', {
        title: 'Create Genre',
        genre: genre,
        errors: errors.array(),
      });
      return;
    } else {
      const genreExists = await Genre.findOne({ name: req.body.name })
        .collation({ locale: 'en', strength: 2 })
        .exec();
      if (genreExists) {
        res.redirect(genreExists.url);
      } else {
        await genre.save();
        res.redirect(genre.url);
      }
    }
  }),
];

// Display Genre delete form on GET
exports.genre_delete_get = asyncHandler(async (req, res, next) => {
  const [genre, genreBooks] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    Book.find({ genre: req.params.id }).populate('author').exec(),
  ]);

  if (genre === null) {
    res.redirect('/catalog/genres');
  }

  res.render('genre_delete', {
    title: 'Delete Genre',
    genre: genre,
    genre_books: genreBooks,
  });
});

// Display Genre delete form on POST
exports.genre_delete_post = asyncHandler(async (req, res, next) => {
  const [genre, genreBooks] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    Book.find({ genre: req.params.id }).populate('author').exec(),
  ]);

  if (genreBooks.length > 0) {
    res.render('book_delete', {
      title: 'Delete Genre',
      genre: genre,
      genre_books: genreBooks,
    });
    return;
  } else {
    await Genre.findByIdAndDelete(req.params.id).exec();
    res.redirect('/catalog/genres');
  }
});

// Display Genre update form on GET
exports.genre_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre update GET");
});

// Display Genre update form on GET
exports.genre_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre update POST");
});