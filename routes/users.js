var express = require('express');
var router = express.Router();
// let UsersModel = require('../models/users.model');



/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/test', function(req, res, next) {
  let test = {
    name : "pippo",
    email: "pippo@a.it",
    key: "keyyyyyy",
    secret : "secretttt"
  }
  let model = new UsersModel(test);
  (async () => {
    console.log("addMessage to db")
    model.save()
      .then(doc => {
        console.log("doc:" +doc);
        if (!doc || doc.length === 0) {
          console.log(`errore ${doc}`)
          res.send((`errore ${doc}`));
        }
        console.log(`Inserito con successo ${doc}`);
        res.send(doc)

      }).catch(err => {
      console.log(` errore 500 ${err}`);
      res.send(` errore 500 ${err}`);
    });
  })()


  res.send('respond with a resource');
});

module.exports = router;
