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
    on:'UK001!',
    off:'UK004!',
    status:'UR001!',
    id:'UL!',
    tempSet:{
      grill:'UT',
      probe1:'UF',
      probe2:'Uf',
    }

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
  socket.on('message', (msg, info) => {
    socket.close();
    callback(msg);
  });
  socket.send(data, 0, data.byteLength, port, address, (error, bytes) => {
    if (error){ console.log(error); }
  });
};
/**
  * @desc reads the buffer data into an object to send back
  * @param buffer $bytes - this is the buffer that comes back from the grill
  * @return object - returns an gmg object with the grill stats
*/
const readBuf = (bytes) => {
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
    return(data);
}
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
      let data = readBuf(bytes);
      callback(data);
    });
  }
  power(option, callback){
    let address = this.address
    let port = this.port
    if(option=='on' || option=='off'){
      sendCommand(address, port, commands[option],function(bytes){
        let res = Buffer.from(bytes).toString('ascii');
        if(res=='OK'){
          /** Instead of returning an OK, lets return the new status of the grill.
            * This will let users verify the new settings took without the need for them to call status again.
            * This of course is overkill if they are already calling status on a set interval, but oh well.
         */
          sendCommand(address, port, commands.status, function(bytes){
            let data = readBuf(bytes);
            callback(data);
          });
        }else{
          /** I'm not sure if the grill will ever not repsond with OK, but better safe than sorry */
          throw new Error('unexpected response from grill');
        }
      });
    }else{
     throw new Error('illegal argument');
    } 
  }
  temp(device, temperature, callback){
    let address = this.address;
    let port = this.port;
    /** Validate parameters */
    var hasDeviceProperty = Object.prototype.hasOwnProperty.call(commands.tempSet, device);
    if(hasDeviceProperty){
      if(temperature>=150 && temperature<=550){
        let command = commands.tempSet[device]+temperature+'!';
        //** Lets first see if the grill is on.  The temp can be set anyway, but I don't think its supposed to */
        sendCommand(address, port, commands.status,function(bytes){
          let res = readBuf(bytes)
          if(res.state.power=='ON'){
            sendCommand(address, port, command, function(bytes){
              let res = readBuf(bytes)
              callback(res);
            })
          }else{
            //** I think I'd like to add an error message property to the status results rather than throw errors */
            res.msg = 'grill power state must be ON first'
            callback(res);
          }
        })
      }else{
        throw new Error('invalid temperature')
      }
    }else{
      throw new Error('invalid device')
    }
  }
}

module.exports = greenMountainGrill;
