// YOUR TASK NOTES SAID TO JUST SUBMIT THE INDEX.JS! 

const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const port = 8000

app.use(express.json());

const users = [ // user database 
  { username: "Mazvita", permissions: ["/a"], password: "password43" },
  { username: "Meagan", permissions: ["/a", "/b"], password: "password4" },
  { username: "Kabelo", permissions: ["/b", "/c"], password: "password55" }
];

const secret = "secret_key"; // secret key between server and client


app.post("/login", (req, res) => {
  const username = req.body.username; // require username & password
  const password = req.body.password;
  const user = users.find(u => u.username === username && u.password === password); // find user & password in const
  if (!user) {
    return res.status(401).send("Username or password is incorrect");} // if doesnt match send incorrect
  else{
  const token = jwt.sign({ username: user.username, permissions: user.permissions }, secret);// else is username matches send token
  res.send({ token });} // send token
});

///// COMPULSORY TASK 1 old code //////

// app.get('/resource', (req, res) => {
//   const auth = req.headers['authorization']
//   const token = auth.split(' ')[1]

//   try {
//       const decoded = jwt.verify(token, 'jwt-secret')
//       res.send({'msg':
//     `Hello, ${decoded.name}! Your JSON Web Token has been verified.`})
//   }
//   catch (err) {
//       res.status(401).send({'err': 'Bad JWT!'})
// } })

// app.get('/admin_resource', (req, res) => {
//   const token = req.headers['authorization'].split(' ')[1]
//   try {
//       const decoded = jwt.verify(token, 'jwt-secret')
//       if (decoded.admin){
//           res.send({'msg': 'Success!'})
//       }else{
//           res.status(403).send(
//           {'msg': 'Your JWT was verified, but you are not an admin.'})
//       }
//   }catch (e) {
//       res.sendStatus(401)
// } })

const checkToken = (req, res, next) => { // function requires the header and splits it by empty spaces
 
   const token = req.headers['authorization'].split(' ')[1]

  if (!token) return res.status(401).send("Access Denied"); // if token doesnt match access denied
  try { // otherwise decode the token along with the seceret key
    const decoded = jwt.verify(token, secret);
    req.user = decoded; // sets user to the decoded token
    next(); // next allows the next middleware to run - https://stackoverflow.com/questions/61062278/how-does-next-work-in-react-redux-middleware
  } catch (err) {
    res.status(400).send("Invalid Token");
  }
};

const checkPermission = (permission) => {
  return (req, res, next) => {
    if (!req.user.permissions.includes(permission)) return res.status(401).send("Access Denied");
    next(); // if user doesn't have the relevant permission return access denied other wise passes to next middleware
  };
};

app.get("/a", checkToken, checkPermission("/a"), (req, res) => { // accessto /a checks token and relevant permission 
  res.send("Access to the A section granted.");
});

app.get("/b", checkToken, checkPermission("/b"), (req, res) => {
  res.send("Access to the B section granted.");
});

app.get("/c", checkToken, checkPermission("/c"), (req, res) => {
  res.send("Access to the C section granted.");
});

app.listen(port, () => console.log(
  `Now listening at http://localhost:${port}`))