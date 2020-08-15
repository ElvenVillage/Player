const fs = require('fs')
const express = require('express')

let data = ""
const command = process.argv[2]
const app = express()

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()
})

const startServer = () => {
    app.get('/markers', (req, res) => {
        res.send({"lats":["59.941268722353065","59.9438610088778","59.89317366237529"],"lngs":["30.27555622053525","30.40917545857285","30.466510656516625"]})
    })
    app.get('/', (req, res) => {
        res.send(data)
    })
    srv = app.listen(8080)
}


if (command === 'logfile') {
    if (process.argv[3]) {
        fs.readFile(process.argv[3],
            {encoding: "utf-8"},
            (err, dataBuffer) => {
                data = dataBuffer
                startServer()
            })
    }
}

if (command === 'online') {
    if (process.argv[3]) {
        fs.readFile(process.argv[3], {encoding: "utf-8"}, (err, dataBuffer) => {
            const mData = dataBuffer.toString().split(',')
            let mnData = mData.slice(0, 16).join(',') + ','
            let counter = 1
            setInterval(() => {
                mnData += mData.slice(16*counter, 16*counter+16).join(',') + ','
                counter++
                data = mnData
            }, 5000)
            startServer()
        })
    }
}