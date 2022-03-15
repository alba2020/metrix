const http = require('http')
const stats = require('./stats')

const host = 'localhost'
const port = 8080

let pings = []

async function getJSONPayload(req) {
  return new Promise((resolve, reject) => {
    let data = ''

    req.on('data', chunk => {
      data += chunk
    })

    req.on('end', () => {
      try {
        let payload = JSON.parse(data)
        resolve(payload)
      } catch (e) {
        console.log(`Bad JSON: ${e.message}`)
        reject(e.message)
      }
    })
  })
}

async function dataHandler(req, res) {
  const x = Math.random()

  if (x < 0.6) {
    // 60%
    const payload = await getJSONPayload(req)
    console.log(JSON.stringify(payload))

    pings.push(payload.responseTime)

    res.writeHead(200)
    return res.end('OK')
  } else if (x < 0.8) {
    // 20%
    res.writeHead(500)
    return res.end()
  } else {
    // 20%
    return // do nothing
  }
}

const server = http.createServer(async (req, res) => {
  if ((req.url = '/data' && req.method == 'POST')) {
    return dataHandler(req, res)
  } else {
    res.writeHead(404)
    res.end('Not found')
  }
})

server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`)
})

process.on('SIGINT', function () {
  console.log('--------------------------')
  console.log('Average: ', stats.avg(pings))
  console.log('Median: ', stats.median(pings))
  process.exit()
})
