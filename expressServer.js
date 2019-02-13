var express = require("express");
var app = express();
var PORT = 8080; // default port 8080
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
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
});

app.post("/urls", (req, res) => {
 var newId = randomNum(0, 26);
  urlDatabase[newId] = req.body.longURL;
  const output = { shortURL : newId, longURL: urlDatabase[newId]}
  console.log(output); 
  console.log(output);  

  res.render("urls_show", output);         
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase}
  res.render('urls_index', templateVars);
});
  
app.get("/urls/:shortURL", (req, res) => {
    const shortURL = req.params.shortURL;
    const templateVars = { shortURL: shortURL, longURL: urlDatabase[shortURL] };
    res.render("urls_show", templateVars);
  });
  app.get("/u/:shortURL", (req, res) => {
    let shorten = req.params.shortURL;
    console.log('shortURL =', shorten)
    console.log('urldatbase =', urlDatabase)
    console.log('urldatbase (shorturl)=', urlDatabase[shorten])


    const direction = { shortURL: shorten, longURL: urlDatabase[shorten]}
    console.log('diriction =', direction)
    
    console.log(direction.shortURL, direction.longURL);

    res.redirect(direction.longURL);
  });
  
  app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}!`);
});

// function randomNum(min, max) {
//   let letterBank = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "k", "L", "M","n", "O", "P", "Q", "r", "S", "T", "u", "v", "W", "X", "y", "z"];
//   let num = Math.round(Math.random() * (max - min) + min);
//   let random = letterBank[num];
//   for (let i = 0; i < 7; i++){
    
//       random += letterBank[Math.round(Math.random() * (max - min) + min)];
  
//   } 
  
//   return random; 
//   }
  
   


    var greeting = 'ello'