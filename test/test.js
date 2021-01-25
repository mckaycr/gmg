'use strict';
var expect = require('chai').expect;
var Grill = require('../index.js');

describe('grill', function(){
  describe('status()', function(){
    it('it should return an object containing grill data', function(done){
      var myGrill = new Grill('192.168.0.42', 8080);
        myGrill.status(function(res){
        expect(res).to.have.a.property('temp');
        expect(res).to.have.a.property('tempSet');
        expect(res).to.have.a.property('probe');
        expect(res).to.have.a.property('state');
        done();
      });
    });
  });
  describe('power()',function(){
   it('it should turn the grill on and off',function(done){
    // need some test cases
    done();
   });
  });
  describe('temp()',function(){
   it('it should set the temperature for the grill and the probes',function(done){
    // need some test cases
    done();
   })
  })
});