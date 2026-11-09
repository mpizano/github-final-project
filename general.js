const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 6: Register User
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Unable to register user. Username and password required." });
  }

  if (isValid(username)) {
    users.push({ "username": username, "password": password });
    return res.status(200).json({ message: "Customer successfully registered. Now you can login" });
  } else {
    return res.status(404).json({ message: "User already exists!" });
  }
});

// Task 1: Get the list of books available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).json(books);
});

// Task 10: Get book list using Promises / Async-Await with Axios
public_users.get('/async/books', async function (req, res) {
  try {
    const getBooks = () => new Promise((resolve) => resolve(books));
    const bookList = await getBooks();
    return res.status(200).json(bookList);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching book list", error: error.message });
  }
});

// Task 2: Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Task 11: Get book details based on ISBN using Promises
public_users.get('/async/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("Book not found");
    }
  })
  .then((book) => res.status(200).json(book))
  .catch((err) => res.status(404).json({ message: err }));
});

// Task 3: Get book details based on Author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const matchingBooks = [];
  
  Object.keys(books).forEach((key) => {
    if (books[key].author.toLowerCase() === author.toLowerCase()) {
      matchingBooks.push({ isbn: key, ...books[key] });
    }
  });

  if (matchingBooks.length > 0) {
    return res.status(200).json(matchingBooks);
  } else {
    return res.status(404).json({ message: "Author not found" });
  }
});

// Task 12: Get book details based on Author using Promises / Async-Await
public_users.get('/async/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const findByAuthor = new Promise((resolve, reject) => {
      const results = [];
      Object.keys(books).forEach((key) => {
        if (books[key].author.toLowerCase() === author.toLowerCase()) {
          results.push({ isbn: key, ...books[key] });
        }
      });
      if (results.length > 0) resolve(results);
      else reject("Author not found");
    });

    const booksByAuthor = await findByAuthor;
    return res.status(200).json(booksByAuthor);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});

// Task 4: Get book details based on Title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const matchingBooks = [];

  Object.keys(books).forEach((key) => {
    if (books[key].title.toLowerCase() === title.toLowerCase()) {
      matchingBooks.push({ isbn: key, ...books[key] });
    }
  });

  if (matchingBooks.length > 0) {
    return res.status(200).json(matchingBooks);
  } else {
    return res.status(404).json({ message: "Title not found" });
  }
});

// Task 13: Get book details based on Title using Promises / Async-Await
public_users.get('/async/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    const findByTitle = new Promise((resolve, reject) => {
      const results = [];
      Object.keys(books).forEach((key) => {
        if (books[key].title.toLowerCase() === title.toLowerCase()) {
          results.push({ isbn: key, ...books[key] });
        }
      });
      if (results.length > 0) resolve(results);
      else reject("Title not found");
    });

    const booksByTitle = await findByTitle;
    return res.status(200).json(booksByTitle);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});

// Task 5: Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
