let PersonModel = require('../models/person.model');
let express = require ("express");
let router = express.Router();




router.get ('/error',(req,res)=>{
  throw new Error('errore lanciato');
});


router.post('/person', (req, res) => {
  if (!req.body) {
    return res.status(400).send('Request body is missing');
  } else {
    let model = new PersonModel(req.body);
    model.save()
      .then(doc => {
        console.log("doc:" +doc);
        if (!doc || doc.length === 0) {
          return res.status(500).send(`errore ${doc}`)
        }
        res.status(201).send(`Inserito con successo ${doc}`);

      }).catch(err => {
      res.status(500).json(` errore 500 ${err}`);
    });
  }
});

router.get('/person/find', (req, res) => {
  if (!req.query.email) {
    return res.status(400).send("missing query string parameter");
  }

  PersonModel.findOne({
    email: req.query.email
  }).then(doc => {

    if (!doc || doc.lenght===0){
      return res.status(500).send(`errore ${doc}`)

    }else{

      res.json(`trovato  ${doc}`);
    }

  }).catch(err => {
    res.status(500).json(`errore ${err}`)
  })
});

module.exports= router;