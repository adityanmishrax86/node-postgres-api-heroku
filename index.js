const express = require("express")
const bodyParser = require("body-parser");
const cors = require("cors")
const { pool } = require("./config");

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

function getBooks(req, res) {
    pool.query("SELECT * FROM books", function (error, result) {
        if (error) {
            throw Error
        }
        res.status(200).send(result.rows);
    })
}

function addBook(req, res) {
    const { author, title } = req.body;
    pool.query("INSERT INTO books (author, title) VALUES ($1,$2)", [author, title], function (err, result) {
        if (err) {
            throw Error
        }
        res.status(201).json({ "status": "success" });
    })
}


app.route("/books")
    .get(getBooks)
    .post(addBook)

app.listen(process.env.PORT, function () {
    console.log("Running Successfully " + process.env.PORT);
})