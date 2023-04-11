const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')
const config = require('../utils/config')

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  const user = await User.findOne({ username }) // 1
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash) // 2

  if (!(user && passwordCorrect)) { // 3
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = { 
    username: user.username,
    id: user._id,
  }
  // token expires in 60*60 seconds, that is, in one hour
  const token = jwt.sign( // 4
    userForToken, 
    config.SECRET,
    { expiresIn: 60*60 }
  )

  response
    .status(200)
    .send({ token, username: user.username, name: user.name }) // 5
})

module.exports = loginRouter