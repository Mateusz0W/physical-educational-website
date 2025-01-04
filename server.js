const express = require('express');
const bodyParser= require('body-parser')
const mongodb = require('mongodb')
const cors = require('cors');
var db
const dbname = '2wardawa';
const url = 'mongodb://2wardawa:pass2wardawa@172.20.44.25/2wardawa';
  
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))

mongodb.MongoClient.connect(url, function(err, client) {
  if (err) return console.log(err)
  db = client.db(dbname);
  console.log('Connect OK');
})

app.post('/register',async(req,res)=>{
    try{
        const {username ,password} =req.body;
        if (!username || !password) {
            return res.status(400).json({ error: "Nazwa użytkownika i hasło są wymagane." });
        }
        const result = await db.collection("Projekt").insertOne({username,password});
        return res.status(201).json({ message: 'Użytkownik zarejestrowany!' }); 
    }
    catch(error){
        return res.status(400).json({ error: 'Błąd podczas rejestracji użytkownika!' });
    }
})

app.listen(9013,function() {
   console.log('listening on 9013');
})
  
  