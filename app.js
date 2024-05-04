const express = require('express')
const app = express()
const path = require('path')
const sqlite3 = require('sqlite3')
const {open} = require('sqlite')
const dbpath = path.join(__dirname, 'covid19IndiaPortal.db')
let db = null
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
app.use(express.json())

const initializedb = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('server started in the server of 3000')
    })
  } catch (e) {
    console.log(`the error message is ${e.message}`)
    process.exit(1)
  }
}

initializedb()

app.post('/login/', async (request, response) => {
  const {username, password} = request.body
  const getuserquery = `
  SELECT * FROM user WHERE username = '${username}';
  `
  const getuser = await db.get(getuserquery)
  if (getuser === undefined) {
    response.status(400)
    response.send('Invalid user')
  } else {
    const checkPass = await bcrypt.compare(password, getuser.password)
    if (checkPass === false) {
      response.status(400)
      response.send('Invalid password')
    } else {
      const createjwt = jwt.sign(username, 'MY_SECRET_KEY')
      response.send({createjwt})
    }
  }
})
