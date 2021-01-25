'use strict';
var expect = require('chai').expect;
var Grill = require('../index.js');

describe('grill', function(){
  describe('status()', function(){
    it('it should return an object containing grill data', function(done){
      var myGrill = new Grill('127.0.0.1', 8080);
        myGrill.status(function(res){
        console.log(res);
        expect(res).to.have.a.property('temp');
        expect(res).to.have.a.property('tempSet');
        expect(res).to.have.a.property('probe');
        expect(res).to.have.a.property('state');
        done();
      });
    });
  });
});