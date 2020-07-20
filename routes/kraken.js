var express = require('express');
var router = express.Router();

const KrakenClient = require('kraken-api');
const {key,secret} = require ( '../gloabal');

const kraken = new KrakenClient(key, secret);

// pairs XXBTZUSD - ETHXBT


/* GET users listing. */
router.post('/addOrder', function (req, res, next) {


  (async () => {
    var body = req.body;

    if (body && body.pair && body.type && body.volume) {
      const params = {
        pair: body.pair,
        type: body.type,
        ordertype: body.ordertype,
        price: body.price,
        leverage: body.leverage,
        volume: body.volume,
        close: body.close  //
      };

      var response = (await kraken.api('AddOrder', params));
      // var response =(await kraken.api('AddOrder',{pair : 'ETHXBT', type: "sell", ordertype : "limit", price : "999", volume : 0.1  }));
      console.dir(response);
      res.send(response)
    } else {
      res.send("errore nel corpo della post")
    }

  })();

});


/* GET users listing. */
router.post('/cancelOrder', function (req, res, next) {

  (async () => {
    var body = req.body;

    if (body && body.txid) {
      var response = (await kraken.api('CancelOrder', {'txid': body.txid}));
      console.dir(response);
      res.send(response)
    } else {
      res.send("errore nel corpo della post")
    }

  })();

});


router.get('/openPositions', function (req, res, next) {

  (async () => {
    // Display user's balance
    var response = (await kraken.api('OpenPositions'));
    console.dir(response);
    res.send(response)

  })();

});

router.get('/tradesHistory', function (req, res, next) {

  (async () => {
    // Display user's balance
    var response = (await kraken.api('TradesHistory'));
    console.dir(response);
    res.send(response)

  })();

});

router.get('/test', function (req, res, next) {

  (async () => {
    // Display user's balance

    res.json("test");

  })();

});

router.get('/balance', function (req, res, next) {

  (async () => {
      // Display user's balance
      var response = (await kraken.api('Balance'));
      console.dir(response);
      res.send(response)

        console.log(error)

  })();

});

router.get('/ticker', function (req, res, next) {
  if (req.query.pair) {
    (async () => {
      // Get Ticker Info
      var response = (await kraken.api('Ticker', {pair: req.query.pair}));

      // let trades = (await kraken.api('TradesHistory'));
      // console.dir (trades.result.trades);
      console.dir(response);
      res.send(response)

    })();
  } else {
    res.send("manca la pair")
  }


});




module.exports = router;


