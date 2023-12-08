const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
};

const authenticatedUser = (username, password) => {
  //returns boolean
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 * 60 }
    );

    req.session.authorization = {
      accessToken,
      username,
    };
    return res.status(200).send("User successfully logged in");
  } else {
    return res
      .status(208)
      .json({ message: "Invalid Login. Check username and password" });
  }
});

regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = parseInt(req.params.isbn);
  const review = req.body.review;

  // Check if the provided ISBN exists in the 'books' data structure
  if (books[isbn]) {
    // Add or modify the review for the specified book
    books[isbn].reviews = review;

    return res
      .status(200)
      .json({ message: "Review added/modified successfully" });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = parseInt(req.params.isbn); // Assuming ISBN is a number

  // Retrieve the current session user's username
  const sessionUser = req.session.user;

  // Check if the provided ISBN exists in the 'books' data structure
  if (books[isbn]) {
    const bookReviews = books[isbn].reviews;

    // Check if 'bookReviews' is defined and the review associated with the current session's username exists
    if (bookReviews && bookReviews[sessionUser]) {
      // Delete the review for the specified book and username
      delete bookReviews[sessionUser];

      return res.status(200).json({ message: "Review deleted successfully" });
    } else {
      return res.status(404).json({ message: "Review not found for the user" });
    }
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports = books;

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
