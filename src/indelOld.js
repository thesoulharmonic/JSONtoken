const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const jwt = require('jsonwebtoken') // JWT library
const port = 8000

app.use(bodyParser.json()) // use bodyparser 

const users = [
  { username: "Mazvita", permissions: ["/a"], password: "password" },
  { username: "Meagan", permissions: ["/a", "/b"], password: "password" },
  { username: "Kabelo", permissions: ["/b", "/c"], password: "password" }
];

const checkToken = () => {
app.post('/login', (req, res) => { 
  const usr = req.body.username 
  const pwd = req.body.password 
  const perms = req.body.permissions
  const user = users.find(u => u.username === usr && u.password === pwd)
  if (user){
   payload = {
     'username': usr,
     'permissions': perms
   }
  const token = jwt.sign(JSON.stringify(payload), 'jwt-secret', 
     {algorithm: 'HS256'}) 
  res.send({'token': token}) 
 } 
   else {
   res.status(403).send({'err':'Incorrect login!'})
 }
})
}
/////////

const checkPermission = (permission) => {
  return (req, res) => {
    if (!req.user.permissions.includes(permission)) return res.status(401).send("Access Denied");
  };
};

//////////////

app.get('/resource', (req, res) => {
  const auth = req.headers['authorization']
  const token = auth.split(' ')[1]

  try {
      const decoded = jwt.verify(token, 'jwt-secret')
      res.send({'msg':
    `Hello, ${decoded.name}! Your JSON Web Token has been verified.`})
  }
  catch (err) {
      res.status(401).send({'err': 'Bad JWT!'})
} })


app.get('/admin_resource', (req, res) => {
  const token = req.headers['authorization'].split(' ')[1]
  try {
      const decoded = jwt.verify(token, 'jwt-secret')
      if (decoded.admin){
          res.send({'msg': 'Success!'})
      }else{
          res.status(403).send(
          {'msg': 'Your JWT was verified, but you are not an admin.'})
      }
  }catch (e) {
      res.sendStatus(401)
} })







/////////

app.get("/a", checkToken, checkPermission("/a"), (req, res) => {
  res.send("Access to pages A granted.");
});

app.get("/b", checkToken, checkPermission("/b"), (req, res) => {
  res.send("Access to pages B granted.");
});

app.get("/c", checkToken, checkPermission("/c"), (req, res) => {
  res.send("Access to pages C granted.");
});


///////


app.listen(port, () => console.log(
   `Now listening at http://localhost:${port}`))