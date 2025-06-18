const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    return users.find(e => e.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
    return users.find(e => e.username === username && e.password === password)
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const { username, password } = req.body;

    if (!isValid(username)) return res.status(401).json({ message: "User doesn't exists" });

    const user = authenticatedUser(username, password);
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
    const { body, params, user } = req;
    const { review } = body;
    const { isbn } = params;

    const book = books[isbn];
    if(!book){
        return res.status(400).json({message: "Book not found"})
    }

    book.reviews[user.username] = review;

    return res.status(300).json({message: "Review successfully added!", books: JSON.stringify(books)});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
