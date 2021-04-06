const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config(); // dotenv

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello ema watson!!");
});

const port = 4000;
app.listen(process.env.PORT || port);

// mongoDB
const MongoClient = require("mongodb").MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7ajpn.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const collection = client.db("emaJohnStore").collection("products");
  const ordersCollection = client.db("emaJohnStore").collection("orders");

  // Create with insertMany() ---------------------------------
  app.post("/addProduct", (req, res) => {
    const product = req.body;
    collection.insertOne(product).then((result) => {
      res.send(result.insertedCount);
    });
  });

  // Read All item
  app.get("/product", (req, res) => {
    collection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  // Read single item
  app.get("/product/:key", (req, res) => {
    collection.find({ key: req.params.key }).toArray((err, documents) => {
      res.send(documents[0]);
    });
  });

  // Read a specific(2/10/6) number of item
  app.post("/productByKeys", (req, res) => {
    const productKeys = req.body;
    collection.find({ key: { $in: productKeys } }).toArray((err, documents) => {
      res.send(documents);
    });
  });

  // Create Order Database when user ordered ---------------------------------
  app.post("/addOrder", (req, res) => {
    const order = req.body;
    ordersCollection.insertOne(order).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });
});
