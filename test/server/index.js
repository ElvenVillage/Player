const fs = require('fs')
const express = require('express')
const Papa = require('papaparse')

const app = express()

const storedData1 = []
const storedData2 = []

const load = () => {
    Papa.parse(
        fs.createReadStream(process.argv[2]),
        {
            skipEmptyLines: true,
            header: true,
            download: true,
            dynamicTyping: true,
            fastMode: true,
            chunk: (data) =>
                storedData1.push(data),
            beforeFirstChunk: (chunk) => {
                return chunk.split('\r\n').slice(10).join('\r\n')
            },
            worker: false
        }
    )
    Papa.parse(
        fs.createReadStream(process.argv[3]),
        {
            skipEmptyLines: true,
            header: true,
            download: true,
            dynamicTyping: true,
            fastMode: true,
            chunk: (data) =>
                storedData2.push(data),
            beforeFirstChunk: (chunk) => {
                return chunk.split('\r\n').slice(10).join('\r\n')
            },
            worker: false
        }
    )
}

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()
})

load()

app.get('/index', (req, res) => {
    if (req.query.id == '1')
        res.send(storedData1[req.query.last].data)
    if (req.query.id == '2')
        res.send(storedData2[req.query.last].data)
})

app.get('/listOfBoats', (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(`[
    {"name":"Berlin", "color":"#191919", "id":"1"},
    {"name":"Amsterdam", "color":"#f059ab","id":"2"}
    ]`)
})


app.listen(8080)

