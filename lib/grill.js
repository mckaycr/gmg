'use strict';
/* eslint-disable no-unused-vars */
var grillTemp = 2;
var grillTempHigh = 3;
var probeTemp = 4;
var probeTempHigh = 5;
var grillSetTemp = 6;
var grillSetTempHigh = 7;
var curveRemainTime = 20;
var warnCode = 24;
var probeSetTemp = 28;
var probeSetTempHigh = 29;
var grillState = 30;
var grillMode = 31;
var fireState = 32;
var fileStatePercent = 33;
var profileEnd = 34;
var grillType = 35;
var grillStates = {
  0: 'OFF',
  1: 'ON',
  2: 'FAN',
  3: 'REMAIN',
};
var fireStates = {
  0: 'DEFAULT',
  1: 'OFF',
  2: 'STARTUP',
  3: 'RUNNING',
  4: 'COOLDOWN',
  5: 'FAIL',
};
var warnStates = {
  0: 'FAN_OVERLOADED',
  1: 'AUGER_OVERLOADED',
  2: 'IGNITOR_OVERLOADED',
  3: 'BATTERY_LOW',
  4: 'FAN_DISCONNECTED',
  5: 'AUGER_DISCONNECTED',
  6: 'IGNITOR_DISCONNECTED',
  7: 'LOW_PELLET',
};
/* eslint-enable no-unused-vars */
//* ******* Socket Managment*********************
var sendCommand = (address, port, command, callback) => {
  var dgram = require('dgram');
  var socket = dgram.createSocket('udp4');
  var data = Buffer.from(command, 'ascii');
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
  varructor(address, port){
    this.address = address;
    this.port = port;
  }
  status(callback){
    sendCommand(this.address, this.port, 'UR001!', function(data){
      // callback(new grillData(data))
    });
  }
  data(callback){
    /* eslint-disable max-len */
    let hex = '5552e3008500e100050b14321919191931000000ffffffff000000009100010003640003';
    /* eslint-enable max-len */
    let buffer = Buffer.from(hex, 'hex');
    let temp = {
      state: grillStates[buffer.readUInt8(grillState)],
      temperature: buffer.readUInt8(grillTemp),
      probe: buffer.readUInt8(probeTemp),
      desiredTemperature: buffer.readUInt8(grillSetTemp),
    };
    callback(temp);
  }
}

module.exports = greenMountainGrill;
