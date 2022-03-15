let pingId = 1

function create(responseTime) {
  return {
    pingId: pingId++,
    deliveryAttempt: 1,
    date: Date.now(),
    responseTime
  }
}

module.exports = {
  create
}
