const fs = require('fs')
const express = require('express')

fs.readFile('test/server/11_10part1.csv',
    {encoding: "utf-8"},
    (err, data) => {
        const app = express()

        app.use( (req, res, next) => {
            res.header("Access-Control-Allow-Origin", "*")
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
            next()
        })
        app.get('/', (req, res) => {
            res.send(data)
        })

        app.listen(8080)
})