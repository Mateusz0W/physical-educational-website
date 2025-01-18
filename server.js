const express = require('express');
const bodyParser= require('body-parser')
const mongodb = require('mongodb')
const cors = require('cors');
const jwt = require('jsonwebtoken');
var db
const dbname = '2wardawa';
const url = 'mongodb://2wardawa:pass2wardawa@172.20.44.25/2wardawa';
  
const app = express();

const accessTokenSecret = 'onomatopeja';
const refreshTokenSecret = 'monochromatyczne'

app.use(cors({origin:{dotAll:true}}))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))

mongodb.MongoClient.connect(url, function(err, client) {
  if (err) return console.log(err)
  db = client.db(dbname);
  console.log('Connect OK');
})

let refreshTokens=[]

app.post('/register',async(req,res)=>{
    try{
        const {username ,password} =req.body;
        const user= await db.collection('Projekt').findOne({username});
        if(user)
            return res.status(400).json({error: "Użytkownik o tym nicku już istnieje"});
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
app.post('/login',async(req,res)=>{
    try{
        const {username,password} =req.body;
        if (!username || !password) {
            return res.status(400).json({ error: "Nazwa użytkownika i hasło są wymagane." });
        }
        const user = await db.collection('Projekt').findOne({username});
        if(!user || user.password != password)
            return res.status(401).json({ error: "Nieprawidłowe dane logowania." });
        
        const accessToken = jwt.sign({username},accessTokenSecret,{expiresIn: '1m'});
        const refreshToken = jwt.sign({username},refreshTokenSecret,{expiresIn: '3m'});
        refreshTokens.push(refreshToken);

        return res.status(200).json({ message: "Zalogowano pomyślnie!", accessToken,refreshToken });
    }
    catch (error) {
        return res.status(500).json({ error: "Błąd logowania użytkownika." });
    }
})
const authenticateJWT = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).send("Token nie dostarczony");
    jwt.verify(token,accessTokenSecret,(err,decoded)=>{
        if (err) return res.status(403).send("Nieprawidłowy token");
        req.user = decoded.username;
        next();
    });
}

app.post('/refresh',(req,res)=>{
    const {refreshToken}=req.body;
    if(!refreshToken)
        return res.status(401).json({error: "Token odświeżania jest wymagany"});
    if(!refreshTokens.includes(refreshToken))
        return res.status(403).json({error:"Nieprawidłowy token odświeżania"});

    try{
        const {username} =jwt.verify(refreshToken,refreshTokenSecret);
        const newAccessToken = jwt.sign({ username },accessTokenSecret , { expiresIn: '1m' });
        return res.status(200).json({
            accessToken: newAccessToken
        });
    }catch (error) {
        return res.status(403).json({ error: "Refresh token wygasł." });
    }
})

app.post('/save', authenticateJWT, async (req, res) => {
    try {
        const username = req.user; 
        const parameters = req.body;

        await db.collection('Projekt').updateOne(
            { username },
            { $set: { parameters } },
            { upsert: true }
        );

        return res.status(200).json({ message: "Parametry zapisane pomyślnie!" });
    } catch (error) {
        return res.status(500).json({ error: "Błąd podczas zapisywania parametrów." });
    }
});

app.get('/load', authenticateJWT, async (req, res) => {
    try {
        const username = req.user; 

        const record = await db.collection('Projekt').findOne({ username });
        if (!record || !record.parameters) {
            return res.status(404).json({ error: "Brak zapisanych parametrów." });
        }

        return res.status(200).json(record.parameters);
    } catch (error) {
        return res.status(500).json({ error: "Błąd podczas wczytywania parametrów." });
    }
});

app.listen(9013,function() {
   console.log('listening on 9013');
})
  
  