const https = require('https')
const http = require('http')
const payload = require('./payload')

let nTotal = 0
let nSuccess = 0
let n500 = 0
let nTimeout = 0

async function sendData(data) {
  return new Promise((resolve, reject) => {
    nTotal++

    const payload = JSON.stringify(data)

    const postOptions = {
      hostname: 'localhost',
      port: 8080,
      path: '/data',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': payload.length,
      },
      timeout: 10000,
    }

    const req = http.request(postOptions, res => {
      data = ''

      res.on('data', d => {
        data += d
      })

      res.on('end', () => {
        if (res.statusCode == 200) {
          nSuccess++
          resolve(data)
        } else {
          n500++
          reject('Bad status code')
        }
      })
    })

    req.on('timeout', () => {
      nTimeout++
      req.destroy()
      reject('timeout')
    })

    req.on('error', error => {
      reject(error)
    })

    req.write(payload)
    req.end()
  })
}

async function ping(hostname, port) {
  return new Promise((resolve, reject) => {
    const start = performance.now()

    getOptions = {
      hostname,
      port,
      path: '/',
      method: 'GET',
    }

    const req = https.request(getOptions, res => {
      if (res.statusCode == 200) {
        const end = performance.now()
        resolve(end - start)
      } else {
        reject('Bad status code')
      }
    })

    req.end()
  })
}

class PingLogger {
  constructor(id) {
    this.id = id
  }
  log(msg) {
    console.log(`[Ping ${this.id}] ${msg}`)
  }
}

async function report(info, timeout = 1) {
  const logger = new PingLogger(info.pingId)
  logger.log(`Sending(${info.deliveryAttempt})... `)

  try {
    const res = await sendData(info)
    logger.log(`Response: ${res}`)
    return
  } catch (e) {
    logger.log(`Error: ${e}`)
  }
  info.deliveryAttempt++
  timeout *= 2

  logger.log(`Waiting for ${timeout} ms before retry`)
  setTimeout(() => report(info, timeout), timeout)
}

async function main() {
  setInterval(async () => {
    const time = await ping('fundraiseup.com', 443)
    report(payload.create(time), 100)
  }, 1000)
}

process.on('SIGINT', function () {
  console.log('--------------------------')
  console.log(`Total: ${nTotal}`)
  console.log(`200: ${nSuccess}`)
  console.log(`500: ${n500}`)
  console.log(`Timeout: ${nTimeout}`)

  process.exit()
})

main()
