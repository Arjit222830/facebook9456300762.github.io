var mongoose = require("mongoose");
var express= require("express");
var app = express();
var bodyParser = require("body-parser");
const config= require('config');
const fetch= require('node-fetch');
const {User}= require('./user');

mongoose.connect(config.get('db'),{useNewUrlParser: true,useUnifiedTopology: true})
.then(()=> console.log(`Connected to ${config.get('db')}...`))
.catch(err => console.log(`Could not connect to ${config.get('db')}...`,err));

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

app.use(express.json());

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));

require('./prod.js')(app);

app.set("view engine", "pug");

app.get('/',async function(req,res){
    res.sendFile('./public/index.html',{root:__dirname});
  });

app.post('/login-with-facebook',async(req, res)=>{

    const result= await fetch(`https://graph.facebook.com/v6.0/me?access_token=${req.body.accessToken}&method=get&pretty=0&sdk=joey&suppress_http_code=1`)
    const json= await result.json();

    if(json.id!=req.body.userID)
        return res.status(400).send({responseText:"Don't try to f with us"});

    const user=await User.findOne({facebookID: req.body.userID});

    if(user)
        return res.status(200).send({link:"/",message: 'You are logged in'});

    const person= new User({
        name: req.body.name,
        facebookID: req.body.userID,
        accessToken: req.body.accessToken
    })

    await person.save();

    return res.status(200).send({link:"/", message:'You are registered and logged in'});

});

const port=process.env.PORT || 3000;
console.log(port);
const server=app.listen(port, ()=> console.log(`Listening on port ${port}...`));
var env = process.env.NODE_ENV || 'development';
console.log(env);
module.exports= server;