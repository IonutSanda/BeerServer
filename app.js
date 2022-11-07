const Joi = require('joi');
const express = require('express');
const cors = require('cors');
const beers = require('./beers.json');
const { v4: uuidv4, validate } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000

app.get('/', (req, res)=>{
    res.send('Please visit a valid link');
})

app.get('/api/beers', (req, res) => {
    res.send(beers);
})

app.get('/api/beers/byname', (req, res)=> {
    const result = beers.map(n => n.name);
    res.send(result);
})

app.get('/api/beers/:id', (req, res)=>{
    const beer = beers.find(b => b.id === +req.params.id);
    if(!beer) return res.status(404).send(`The beer with the id ${req.params.id} has not been found`);
    
    res.send(beer);
})

app.post('/api/beers', (req, res) => {
    // const result = validateSchema(req.body);

    //object destructuring
    const { error } = validateSchema(req.body);

    if(error) return res.status(400).send(error.message);

    validateSchema();

    const beer = {
        "id": Math.max(...beers.map(o => o.id)) + 1,
        "uid": uuidv4(),
        "brand": req.body.brand,
        "name": req.body.name,
        "style": req.body.style,
        "hop": req.body.hop,
        "yeast": req.body.yeast,
        "malts": req.body.malts,
        "ibu": req.body.ibu,
        "alcohol": req.body.alcohol,
        "blg": req.body.blg
    }

    beers.push(beer);
    res.send(beer);
})

app.put('/api/beers/:id', (req, res)=>{
    const beer = beers.find(b => b.id === +req.params.id);
    if(!beer) return res.status(404).send(`The beer with the id ${req.params.id} has not been found`);

    const { error } = validateSchema(req.body);

    if(error) return res.status(400).send(error.message);

    beer.id = req.body.id,
    beer.uid = req.body.uid,
    beer.brand= req.body.brand,
    beer.name= req.body.name,
    beer.style= req.body.style,
    beer.hop= req.body.hop,
    beer.yeast= req.body.yeast,
    beer.malts= req.body.malts,
    beer.ibu= req.body.ibu,
    beer.alcohol= req.body.alcohol,
    beer.blg= req.body.blg

    res.send(beer);
})

app.delete('/api/beers/:id', (req, res) => {
    const beer = beers.find(b => b.id === +req.params.id);
    if(!beer) return res.status(404).send(`The beer with the id ${req.params.id} has not been found`);

    const indexOfBeer = beers.indexOf(beer);
    beers.splice(indexOfBeer, 1);

    res.send(beer);
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})

function validateSchema(beer){

    const schema = Joi.object({
        brand: Joi.string().min(3).required(),
        name: Joi.string().min(3).required(),
        style: Joi.string().min(3).required(),
        hop: Joi.string().min(3).required(),
        yeast: Joi.string().min(3).required(),
        malts: Joi.string().min(3).required(),
        ibu: Joi.string().min(5).required(),
        alcohol: Joi.string().min(2).required(),
        blg: Joi.string().min(4).required(),
    })
    
    return result = schema.validate(beer);

}