const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.get('/getAllBooks',async function (req, res) {
  return res.status(200).json({books});

});

const getAllBooks = () => new Promise(async (resolve,reject) => {
  const response = await axios.get('https://mkamran4786-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/getAllBooks');
  resolve(response.data.books);
})

const getBookByISBN = (isbn) => new Promise(async (resolve,reject) => {
  const response = await getAllBooks();
  resolve(response[isbn]);
})

const getBookByAuthor = (author) => new Promise(async (resolve,reject) => {
  const response = await getAllBooks();
  const keys = Object.keys(response);
  const desiredBooks = keys.filter(e => response[e].author === author);
  let result = {};
  desiredBooks.forEach(e => {
    result[e] = response[e]
  })
  if(Object.keys(result).length){
    resolve(result);
  } else {
    reject(null)
  }
})

const getBookByTitle = (title) => new Promise(async (resolve,reject) => {
  const response = await getAllBooks();
  const keys = Object.keys(response);
  const desiredBooks = keys.filter(e => response[e].title === title);
  let result = {};
  desiredBooks.forEach(e => {
    result[e] = response[e]
  })
  if(Object.keys(result).length){
    resolve(result);
  } else {
    reject(null)
  }
})

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

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  const response = await getAllBooks();
  return res.status(200).json({books: JSON.stringify(response)});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  const {isbn} = req.params;
  const book = await getBookByISBN(isbn);
  if(book){
    return res.status(200).json({book: books[isbn]});

  } else return res.status(500).json({message: "book not found"});

});

// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  const {author} = req.params;
  try {
    const result = await getBookByAuthor(author);
    return res.status(200).json({books: JSON.stringify(result)});

  } catch (err) {
    return res.status(500).json({message: "No book was found"});
  }

});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
  const {title} = req.params;
  try {
    const result = await getBookByTitle(title);
    return res.status(200).json({books: JSON.stringify(result)});

  } catch (err) {
    return res.status(500).json({message: "No book was found"});
  }
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
