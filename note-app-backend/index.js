const express = require("express");
const app=express();
const cors = require("cors");
require("dotenv").config();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// const corsOptions = {
//   origin: 'http://localhost:3000', 
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//   credentials: true,
//   optionsSuccessStatus: 204,
// };

// app.use(cors(corsOptions));
// app.use(cors());
app.use(cors(
  {
    origin: ["https://note-app-frontend-nine.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
))

app.use(express.json());


var port = process.env.PORT || 6000;

const DbConnection = require("./database");
DbConnection();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

var v1 = require("./api/routes");

app.use("/api", v1.router);

app.use(function (req, res) {
  res.status(404).send({ url: req.originalUrl + " not found" });
});

app.listen(port, () => {
  console.log(`Note App server started on: ${port}`);
});

const allowCors = fn => async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }
  return await fn(req, res)
}

const handler = (req, res) => {
  const d = new Date()
  res.end(d.toString())
}

module.exports = allowCors(handler)
