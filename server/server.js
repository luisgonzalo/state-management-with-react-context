const express = require('express')
const app = express()
const port = 3001

app.get('/', (req, res) => {
  res.send('Hello World!!!')
})

app.post('/login', (req, res) => {
    res.send({
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@gmail.com",
          settings: {},
          termsAccepted: false,
          username: "johndoe",
        });
})

app.post('/logout', (req, res) => {
    res.send(true);
})

app.post('/accept', (req, res) => {
    res.send(true);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})