const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const axios = require("axios");

const doesExist = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
};

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username) {
    return res.status(400).json({ message: "Username not entered" });
  }

  if (!password) {
    return res.status(400).json({ message: "Password not entered" });
  }

  if (username && password) {
    if (!doesExist(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get("/", async (req, res) => {
  try {
    // Simulating an asynchronous operation with a delay

    const response = await axios.get("http://localhost:5000/");

    const fetchedBooks = response.data;

    // Merge the fetched books into the existing 'books' data structure
    Object.assign(books, fetchedBooks);

    res.json(books);
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ message: "Error fetching books" });
  }
});

// Get book details based on ISBN

public_users.get("/isbn/:isbn", async (req, res) => {
  try {
    const isbn = req.params.isbn;

    // Simulating an asynchronous operation with a delay
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);

    const bookDetails = response.data;

    res.json(bookDetails);
  } catch (error) {
    console.error("Error fetching book details:", error);
    res.status(500).json({ message: "Error fetching book details" });
  }
});

// Get book details based on author
public_users.get("/author/:author", async (req, res) => {
  try {
    const authorToFind = req.params.author.toLowerCase();

    // Simulating an asynchronous operation with a delay
    const response = await axios.get(
      `http://localhost:5000/author/=${authorToFind}`
    );

    const matchingBooks = response.data;

    res.json(matchingBooks);
  } catch (error) {
    console.error("Error fetching books by author:", error);
    res.status(500).json({ message: "Error fetching books by author" });
  }
  res.json({ matchingBooks });
});

// Get all books based on title
const axios = require("axios");

public_users.get("/title/:title", async (req, res) => {
  try {
    const titleToFind = req.params.title.toLowerCase();

    // Simulating an asynchronous operation with a delay
    const response = await axios.get(
      `http://localhost:5000/title/=${titleToFind}`
    );

    const matchingBooks = response.data;

    res.json(matchingBooks);
  } catch (error) {
    console.error("Error fetching books by title:", error);
    res.status(500).json({ message: "Error fetching books by title" });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbnToFind = parseInt(req.params.isbn); // Convert to number
  const matchingBook = findBookById(isbnToFind);

  if (matchingBook) {
    res.json({ matchingBook });
  } else {
    res.json({ message: "Book not found" });
  }
});

function findBookById(bookId) {
  // Check if the bookId exists in the 'books' object
  const matchingBook = books[bookId];

  return matchingBook;
}

module.exports.general = public_users;
