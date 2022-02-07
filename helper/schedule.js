async function getTimesArray(start, end, length) {
  // parsing string to int
  let startInt = parseInt(start) + parseInt(start.slice(-2)) / 60;
  let endInt = parseInt(end) + parseInt(end.slice(-2)) / 60;
  let startMin = startInt * 60;
  let endMin = endInt * 60;
  let times = [];

  while (startMin <= endMin) {
    let mins = startMin % 60;
    let hours = Math.floor(startMin / 60);
    let timeString = hours.toString() + ":" + mins.toString().padStart(2, "0");
    times.push(timeString);
    startMin += length;
  }
  return times;
}

module.exports = { getTimesArray };
