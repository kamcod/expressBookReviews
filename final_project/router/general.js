const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const { username, password } = req.body;
  if(!username || !password){
    return res.status(400).json({message:"Username and password are required"});
  }
  if(isValid(username)){
    return res.status(401).json({message:"Username already exists"});
  }
  users.push({username, password})
  return res.status(300).json({
    users,
    message: "user successfully created"
  });
});

const getAllBooks = new Promise((resolve,reject) => {
  setTimeout(() => {
    resolve(books)
  },5000)})

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  const allBooks = await getAllBooks();
  return res.status(200).json({books: JSON.stringify(allBooks)});

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const {isbn} = req.params;
  const book = books[isbn]
  if(book){
    return res.status(200).json({book: books[isbn]});

  } else return res.status(500).json({message: "book not found"});

});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const {author} = req.params;
  const keys = Object.keys(books);
  const desiredBooks = keys.filter(e => books[e].author === author);
  let result = {};
  desiredBooks.forEach(e => {
    result[e] = books[e]
  })
  if(result){
    return res.status(200).json({books: JSON.stringify(result)});

  } else return res.status(500).json({message: "No book was found"});

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const {title} = req.params;
  const keys = Object.keys(books);
  const desiredBooks = keys.filter(e => books[e].title === title);
  let result = {};
  desiredBooks.forEach(e => {
    result[e] = books[e]
  })
  if(result){
    return res.status(200).json({books: result});

  } else return res.status(500).json({message: "No book was found"});

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {

  const {isbn} = req.params;
  const book = books[isbn]
  if(book){
    return res.status(200).json({review: books[isbn].reviews});

  } else return res.status(500).json({message: "book not found"});

});

module.exports.general = public_users;
