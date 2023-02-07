const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const jwt = require('jsonwebtoken') // JWT library
const port = 8000

app.use(bodyParser.json()) // use bodyparser 





// app.post('/login', (req, res) => { // creates /login endpoint for post method
//    const usr = req.body.username // reguire username
//    const pwd = req.body.password // reguire password
//    const admin = req.body.admin // require admin status

//    // res.send(`Username: ${usr}\n Password: ${pwd}`) // sends back username & password
  
//    if (usr==='zama' && pwd==='secret'){ // if user name matches return username + pass
//     //res.send(`Username: ${usr}\n Password: ${pwd}`) 
//     payload = {
//       'name': usr,
//       'admin': admin // changed to require admin status
//     }

//    const token = jwt.sign(JSON.stringify(payload), 'jwt-secret', // uses JWT library to send back a token
//       {algorithm: 'HS256'}) // algorithm to use
//    res.send({'token': token}) // sends the token back

//   } 
//     else {
//     res.status(403).send({'err':'Incorrect login!'})
//   }
// })

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

/////////////

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

