/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

var expect = require("chai").expect;
var MongoClient = require("mongodb").MongoClient;
var ObjectId = require("mongodb").ObjectId;
const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

const https = require("https");

module.exports = function(app) {
  app.route("/api/stock-prices").get(async function(req, res) {
    let { stock, like } = req.query;
    let ip = req.ip;
    if (typeof stock !== "string") {
      let stockData1 = await getStockData(stock[0], ip, like);
      let stockData2 = await getStockData(stock[1], ip, like);
      let diff = stockData1.likes - stockData2.likes;
      return res.json({
        stockData: [
          { stock: stockData1.stock, price: stockData1.price, rel_likes: diff },
          { stock: stockData2.stock, price: stockData2.price, rel_likes: -diff }
        ]
      });
    }
    let stockData = await getStockData(stock, ip, like);
    res.json({ stockData: stockData });
  });
};
async function getStockData(stock, ip, like) {
  const stockPrice = await getStockPriceByName(stock);
  return new Promise((resolve, reject) => {
    MongoClient.connect(
      CONNECTION_STRING,
      async function(err, db) {
        const stockTable = db.collection("stock");
        const doc = await stockTable.findOne({ stock });
        if (!doc) {
          let likes = 0;
          let ips = [];
          if (like) {
            likes = 1;
            ips.push(ip);
          }
          const insertResult = await stockTable.insertOne({
            stock,
            likes,
            ips
          });
          resolve({ stock, price: stockPrice, likes });
        } else {
          let isRepeat = doc.ips.includes(ip);
          if (isRepeat || !like) {
            resolve({ stock, price: stockPrice, likes: doc.likes });
          } else {
            const updateResult = await stockTable.updateOne(
              { _id: ObjectId(doc._id) },
              { $set: { likes: doc.likes + 1 }, $push: { ips: ip } }
            );
            console.log(updateResult);
            resolve({ stock, price: stockPrice, likes: doc.likes + 1 });
          }
        }
      }
    );
  });
}
function getStockPriceByName(name) {
  const url = `https://api.iextrading.com/1.0/stock/${name}/price`;
  return new Promise(function(resolve, reject) {
    let stockPrice = "";
    https
      .get(url, res => {
        res.on("data", chunk => {
          stockPrice += chunk;
        });
        res.on("end", () => {
          resolve(stockPrice);
        });
      })
      .on("error", err => {
        reject(err);
      });
  });
}
/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

("use strict");

var expect = require("chai").expect;
var MongoClient = require("mongodb").MongoClient;
var ObjectId = require("mongodb").ObjectId;
const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

const https = require("https");

module.exports = function(app) {
  app.route("/api/stock-prices").get(async function(req, res) {
    let { stock, like } = req.query;
    let ip = req.ip;
    if (typeof stock !== "string") {
      let stockData1 = await getStockData(stock[0], ip, like);
      let stockData2 = await getStockData(stock[1], ip, like);
      let diff = stockData1.likes - stockData2.likes;
      return res.json({
        stockData: [
          { stock: stockData1.stock, price: stockData1.price, rel_likes: diff },
          { stock: stockData2.stock, price: stockData2.price, rel_likes: -diff }
        ]
      });
    }
    let stockData = await getStockData(stock, ip, like);
    res.json({ stockData: stockData });
  });
};
async function getStockData(stock, ip, like) {
  const stockPrice = await getStockPriceByName(stock);
  return new Promise((resolve, reject) => {
    MongoClient.connect(
      CONNECTION_STRING,
      async function(err, db) {
        const stockTable = db.collection("stock");
        const doc = await stockTable.findOne({ stock });
        if (!doc) {
          let likes = 0;
          let ips = [];
          if (like) {
            likes = 1;
            ips.push(ip);
          }
          const insertResult = await stockTable.insertOne({
            stock,
            likes,
            ips
          });
          resolve({ stock, price: stockPrice, likes });
        } else {
          let isRepeat = doc.ips.includes(ip);
          if (isRepeat || !like) {
            resolve({ stock, price: stockPrice, likes: doc.likes });
          } else {
            const updateResult = await stockTable.updateOne(
              { _id: ObjectId(doc._id) },
              { $set: { likes: doc.likes + 1 }, $push: { ips: ip } }
            );
            console.log(updateResult);
            resolve({ stock, price: stockPrice, likes: doc.likes + 1 });
          }
        }
      }
    );
  });
}
function getStockPriceByName(name) {
  const url = `https://api.iextrading.com/1.0/stock/${name}/price`;
  return new Promise(function(resolve, reject) {
    let stockPrice = "";
    https
      .get(url, res => {
        res.on("data", chunk => {
          stockPrice += chunk;
        });
        res.on("end", () => {
          resolve(stockPrice);
        });
      })
      .on("error", err => {
        reject(err);
      });
  });
}
