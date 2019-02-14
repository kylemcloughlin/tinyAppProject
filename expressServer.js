var express = require("express");
var app = express();
var PORT = 8080; // default port 8080
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
  "we3Fkk": "http://www.yahoo.com",
  "brick" : "http://www.jjjjound.com"
};
function randomNum(min, max) {
  let letterBank = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "k", "L", "M","n", "O", "P", "Q", "r", "S", "T", "u", "v", "W", "X", "y", "z"];
  let num = Math.round(Math.random() * (max - min) + min);
  let random = letterBank[num];
  for (let i = 0; i < 6; i++){
    
      random += letterBank[Math.round(Math.random() * (max - min) + min)];
  
  } 
  
  return random; 
  } 


  

app.get("/urls/new", (req, res) => {
  
  var templateVars = urlDatabase;
  
  res.render('urls_new', templateVars);
});// 


app.post("/urls",(req, res) => {
 var newId = randomNum(0, 26);
  urlDatabase[newId] = req.body.longURL;
  const templateVars = { shortURL : newId, longURL: urlDatabase[newId]}
  
  res.render("urls_show", output);         
});//new ide


app.post("/urls/:shortURL/delete",(req, res) => {
  var shortURL = req.params.shortURL;
  
  delete urlDatabase[shortURL];
  
  res.redirect('/urls');
});
// app.post("/urls/:id",(req, res) => {
  
  app.post("/urls/update/:id",(req, res) => {
    urlDatabase[req.params.id] = req.body.longURL;
    console.log('here', req.body)

    res.redirect('/urls');
    
    })
   
    
  
  
  
  
  
  
  
  
  

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase}
  res.render('urls_index', templateVars);
  console.log('hit');
});
  
app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const templateVars = { shortURL: shortURL, longURL: urlDatabase[shortURL] };
//  console.log(templateVars);
  res.render("urls_show", templateVars);
});//dynamic shorturl page


app.get("/u/:shortURL", (req, res) => {
  let shorten = req.params.shortURL;
  
  const direction = { shortURL: shorten, longURL: urlDatabase[shorten]}
  
  res.redirect(direction.longURL);
});//redirectfunctioning

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}!`);
});//connection

