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
            res.status(400).json({ "err": error })
        } else
            res.status(200).send(result.rows);
    })
}

function addBook(req, res) {
    const { author, title } = req.body;
    pool.query("INSERT INTO books (author, title) VALUES ($1,$2)", [author, title], function (err, result) {
        if (err) {
            res.status(400).json({ error: err })
        } else
            res.status(201).json({ "status": "success" });
    })
}

function deleteBook(req, res) {
    const { id } = req.params;
    if (!req.header('apiKey') || req.header('apiKey') !== process.env.API_KEY) {
        return res.status(401).json({ status: 'error', message: 'Unauthorized.' })
    }
    pool.query("DELETE FROM books WHERE id = $1", [id], function (err, result) {
        if (err) return res.status(400).send({ "status": err })

        res.status(400).send({ "status": "deleted" })

    })
}

app.route("/books")
    .get(getBooks)
    .post(addBook)
app.route("/books/:id").delete(deleteBook)

app.listen(process.env.PORT, function () {
    console.log("Running Successfully " + process.env.PORT);
})