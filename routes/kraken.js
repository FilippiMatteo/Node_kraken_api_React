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


router.get('/buy', function (req, res, next) {


  (async () => {
    var body = req.body;



       var response =(await kraken.api('AddOrder',{pair : 'XBTUSD', type: "buy", ordertype : "market",  volume : 0.008  }));
      console.dir(response);
      res.send(response)

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



router.get('/balance', function (req, res, next) {

  (async () => {
      // Display user's balance
      var response = (await kraken.api('Balance'));
      console.dir(response);
      res.json(response)


  })();

});

// public methods

router.get('/ticker', function (req, res, next) {
  if (req.query.pair) {
    (async () => {
      // Get Ticker Info
      var response = (await kraken.api('Ticker', {pair: req.query.pair}));


      console.dir(response);
      res.send(response)

    })();
  } else {
    res.send("manca la pair")
  }


});



router.get('/assets', function (req, res, next) {

    (async () => {
      // Get Assest Info
      var response = (await kraken.api('Assets'));
      console.dir(response);
      res.send(response)

    })();



});

router.get('/assetPairs', function (req, res, next) {

    (async () => {
      // Get assetPairs Info
      var response = (await kraken.api('AssetPairs'));

      console.dir(response);
      res.send(response)

    })();



});

router.get('/time', function (req, res, next) {

    (async () => {
      // Get time server Info
      var response = (await kraken.api('Time'));
      console.dir(response);
      res.send(response)

    })();



});

router.get('/depth', function (req, res, next) {

  if (req.query.pair) {
    (async () => {
      // Get Depth Info
      var response = (await kraken.api('Depth', {pair: req.query.pair}));
      console.dir(response);
      res.send(response)

    })();
  } else {
    res.send("manca la pair")
  }



});

router.get('/trades', function (req, res, next) {

  if (req.query.pair) {
    (async () => {
      // Get Trades Info
      var response = (await kraken.api('Trades', {pair: req.query.pair}));
      console.dir(response);
      res.send(response)

    })();
  } else {
    res.send("manca la pair")
  }



});

router.get('/spread', function (req, res, next) {

  if (req.query.pair) {
    (async () => {
      // Get spread  Info
      var response = (await kraken.api('Spread', {pair: req.query.pair}));
      console.dir(response);
      res.send(response)

    })();
  } else {
    res.send("manca la pair")
  }



});

module.exports = router;


