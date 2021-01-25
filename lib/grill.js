'use strict';

const grillTemp = 2,
  grillTempHigh = 3,
  probeTemp = 4,
  probeTempHigh = 5,
  grillSetTemp = 6,
  grillSetTempHigh = 7,
  probeTemp2 = 16,
  probeSetTemp2 = 18,
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
  },
  commands ={
    powerOn:'UK001!',
    powerOff:'UK004!',
    status:'UR001!',
    id:'UL!',
}
/**
  * @desc private function for socket maintenance and sending commands to the grill
  * @param string $address - the IP address of your grill.  
  * @param integer $port - the port for your grill, most likely 8080
  * @param string $command - the command that needs send to the grill
  * @return buffer - returns the buffer response from the grill
*/
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
/**
  * @desc sends and receives data from your green mountain grill
  * @param string $address - the IP address of your grill.  integer $port - the port for your grill, most likely 8080
  * @return object - returns an gmg object with several methods used to interact with the grill
*/
class greenMountainGrill{
  constructor(address, port){
    this.address = address;
    this.port = port;
  }
  status(callback){
    sendCommand(this.address, this.port, commands.status, function(bytes){
    /* eslint-disable-next-line max-len */
    //let hex = '5552e3008500e100050b14321919191931000000ffffffff000000009100010003640003';
    let buffer = bytes//Buffer.from(hex, 'hex');
    let data = {
      temp: buffer.readUInt8(grillTemp),
      tempSet: buffer.readUInt8(grillSetTemp),
      probe: [ 
        {
          temp: buffer.readUInt8(probeTemp), 
          tempSet:buffer.readUInt8(probeSetTemp)
        },
        {
          temp: buffer.readUInt8(probeTemp2), 
          tempSet:buffer.readUInt8(probeSetTemp2)
        },
      ],
      state:{
        power: grillStates[buffer.readUInt8(grillState)],
        fire:fireStates[buffer.readUInt8(fireState)],
        warning:warnStates[buffer.readUInt8(warnCode)],
      },
    };
    callback(data);
  });
  }
}

module.exports = greenMountainGrill;
