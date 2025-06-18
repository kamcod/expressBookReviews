const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
 return users.find(e => e.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const { username, password } = req.body;

    if (!isValid(username)) return res.status(401).json({ message: "User doesn't exists" });

    const user = users.find(e => e.username === username && e.password === password);
    if (!user) return res.status(401).json({ message: "Username or password is incorrect" });

    // Create JWT token
    const token = jwt.sign({ username: user.username }, "My_JWT_SECRET", { expiresIn: '1h' });

    req.session.authorization = {
        accessToken: token
    };

    res.status(200).json({ token, message: 'Login successful' });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
