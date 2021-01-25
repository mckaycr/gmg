# Green Mountain Grill Middleware
Middleware for talking to your Green Mountain Grill

The intent of this project is to create a plug and play module that can be used in any NodeJS application.  This will create a standard way for sending and receiving data to and from your grill.  

## Setup
This package will be published in NPM so to include this into your project just do the following:
```
npm install gmg --save
```
It's not published yet, so this won't work until I feel like its ready
## Example
```
const grill = require('gmg');
const myGrill = new grill(IPADDRESS, PORT);

myGrill.status(function(data){
 console.log(data);
});
```
## Results
```
{
  temp: 151,
  tempSet: 150,
  probe: [ { temp: 122, tempSet: 145 }, { temp: 35, tempSet: 0 } ],
  state: { power: 'ON', fire: 'RUNNING', warning: 'FAN_OVERLOADED' }
}
```
## Prerequisites
- NodeJS is required
- A Green Mountain Grill is required

## Methods
This is a work in progress so not all methods are available yet.

When initiating your grill, you will need the IP address of your grill, and the port which is most likely 8080.

### status(callback);
This method will return the data from the grill and make it available within the callback function.

### power(on/off,callback);
Hopefully this will be the power control for the grill, accepting one parameter indicating either on or off, and a callback to handle what happens next.

### temp(device, temp, callback);
Available devices should be:
- ```'grill'``` - This would set the temp for the grill
- ```'probe1'``` - This would set the desired food temp for probe 1
- ```'probe2'``` - This would set the desired food temp for probe 2

## Credit
Most of my work is because of the decoding work found by these developers.
- @Aenima4six2 : [Aenima4six2/gmg](https://github.com/Aenima4six2/gmg)
- @FeatherKind : [FeatherKing/grillsrv](https://github.com/FeatherKing/grillsrv)