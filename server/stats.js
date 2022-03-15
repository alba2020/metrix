function median (arr) {
  if (arr.length == 0) {
    return 0
  }
  const mid = Math.floor(arr.length / 2)
  const nums = [...arr].sort((a, b) => a - b)
  return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2
}

function avg(arr) {
  if (arr.length == 0) {
    return 0
  }
  let sum = arr.reduce((a, b) => a + b, 0)
  return sum / arr.length 
}

module.exports = {
  median,
  avg
}
