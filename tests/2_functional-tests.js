/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *       (if additional are added, keep them at the very end!)
 */

var chaiHttp = require("chai-http");
var chai = require("chai");
var assert = chai.assert;
var server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function() {
  suite("GET /api/stock-prices => stockData object", function() {
    test("1 stock", function(done) {
      chai
        .request(server)
        .get("/api/stock-prices")
        .query({ stock: "goog" })
        .end(function(err, res) {
          const { stockData } = res.body;
          assert.equal(res.status, 200);
          assert.property(stockData, "stock", "stock should contain name");
          assert.property(stockData, "price", "stock should contain price");
          assert.property(stockData, "likes", "stock should contain likes");
          assert.equal(stockData.stock, "goog");
          done();
        });
    });

    test("1 stock with like", function(done) {
      chai
        .request(server)
        .get("/api/stock-prices")
        .query({ stock: "goog", like: true })
        .end(function(err, res) {
          const { stockData } = res.body;
          assert.equal(res.status, 200);
          assert.property(stockData, "stock", "stock should contain name");
          assert.property(stockData, "price", "stock should contain price");
          assert.property(stockData, "likes", "stock should contain likes");
          assert.equal(stockData.stock, "goog");
          assert.isAbove(stockData.likes, 0);
          done();
        });
    });

    test("1 stock with like again (ensure likes arent double counted)", function(done) {
      chai
        .request(server)
        .get("/api/stock-prices")
        .query({ stock: "goog", like: true })
        .end(function(err, res) {
          const { stockData } = res.body;
          assert.equal(res.status, 200);
          assert.property(stockData, "stock", "stock should contain name");
          assert.property(stockData, "price", "stock should contain price");
          assert.property(stockData, "likes", "stock should contain likes");
          assert.equal(stockData.stock, "goog");
          assert.equal(stockData.likes, 1);
          done();
        });
    });

    test("2 stocks", function(done) {
      chai
        .request(server)
        .get("/api/stock-prices")
        .query({ stock: ["goog", "baba"] })
        .end(function(err, res) {
          const { stockData } = res.body;
          assert.equal(res.status, 200);
          assert.isArray(stockData, "stockData should be array");
          assert.property(stockData[0], "stock", "stock should contain name");
          assert.property(stockData[0], "price", "stock should contain price");
          assert.property(
            stockData[0],
            "rel_likes",
            "stock should contain rel_likes"
          );
          done();
        });
    });

    test("2 stocks with like", function(done) {
      chai
        .request(server)
        .get("/api/stock-prices")
        .query({ stock: ["goog", "baba"], like: true })
        .end(function(err, res) {
          const { stockData } = res.body;
          assert.equal(res.status, 200);
          assert.isArray(stockData, "stockData should be array");
          assert.property(stockData[0], "stock", "stock should contain name");
          assert.property(stockData[0], "price", "stock should contain price");
          assert.property(
            stockData[0],
            "rel_likes",
            "stock should contain rel_likes"
          );
          done();
        });
    });
  });
});
