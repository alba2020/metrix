module.exports = {
  getLogger: function (id) {
    return function (msg) {
      console.log(`[Ping ${id}] ${msg}`)
    }
  },
}
