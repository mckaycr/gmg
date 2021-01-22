'use strict';
var expect = require('chai').expect;
var Grill = require('../index.js');

describe('grill', function(){
  describe('data()', function(){
    it('it should return an object containing grill data', function(done){
      var myGrill = new Grill('127.0.0.1', 8080);
      myGrill.data(function(res){
        expect(res).to.have.a.property('state');
        expect(res).to.have.a.property('temperature');
        expect(res).to.have.a.property('probe');
        expect(res).to.have.a.property('desiredTemperature');
        done();
      });
    });
  });
});
