'use strict';

const grillTemp = 2,
  grillTempHigh = 3,
  probeTemp = 4,
  probeTempHigh = 5,
  grillSetTemp = 6,
  grillSetTempHigh = 7,
  curveRemainTime = 20,
  warnCode = 24,
  probeSetTemp = 28,
  probeSetTempHigh = 29,
  grillState = 30,
  grillMode = 31,
  fireState = 32,
  fileStatePercent = 33,
  profileEnd = 34,
  grillType = 35,
  grillStates = {
    0: 'OFF',
    1: 'ON',
    2: 'FAN',
    3: 'REMAIN',
  },
  fireStates = {
    0: 'DEFAULT',
    1: 'OFF',
    2: 'STARTUP',
    3: 'RUNNING',
    4: 'COOLDOWN',
    5: 'FAIL',
  },
  warnStates = {
    0: 'FAN_OVERLOADED',
    1: 'AUGER_OVERLOADED',
    2: 'IGNITOR_OVERLOADED',
    3: 'BATTERY_LOW',
    4: 'FAN_DISCONNECTED',
    5: 'AUGER_DISCONNECTED',
    6: 'IGNITOR_DISCONNECTED',
   7: 'LOW_PELLET',
  };
//* ******* Socket Managment*********************
const sendCommand = (address, port, command, callback) => {
  const dgram = require('dgram');
  const socket = dgram.createSocket('udp4');
  const data = Buffer.from(command, 'ascii');
  socket.on('error', (err) => {
    console.error('error', err);
  });
  socket.on('message', async(msg, info) => {
    socket.close();
    callback(msg);
  });
  socket.send(data, 0, data.byteLength, port, address, (error, bytes) => {
    if (error){ console.log(error); }
  });
};


class greenMountainGrill{
  constructor(address, port){
    this.address = address;
    this.port = port;
  }
  status(callback){
    sendCommand(this.address, this.port, 'UR001!', function(data){
      // callback(new grillData(data))
    });
  }
  data(callback){
    /* eslint-disable-next-line max-len */
    let hex = '5552e3008500e100050b14321919191931000000ffffffff000000009100010003640003';
    let buffer = Buffer.from(hex, 'hex');
    let temp = {
      state: grillStates[buffer.readUInt8(grillState)],
      temperature: buffer.readUInt8(grillTemp),
      desiredTemperature: buffer.readUInt8(grillSetTemp),
      probe: buffer.readUInt8(probeTemp),
      desiredProbeTemp:buffer.readUInt8(probeSetTemp),
      fireState:fireStates[buffer.readUInt8(fireState)],
      warning:warnStates[buffer.readUInt8(warnCode)],
    };
    callback(temp);
  }
}

module.exports = greenMountainGrill;
