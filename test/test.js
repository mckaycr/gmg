'use strict';
var expect = require('chai').expect;
var Grill = require('../index.js');
var myGrill = new Grill('192.168.0.42', 8080);
describe('grill', function(){
  describe('status()', function(){
    it('it should return an object containing grill data', function(done){
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
   // it('it should turn the grill on',function(done){
   //  myGrill.power('on',function(data){
   //   expect(res).to.have.a.property('temp');
   //   expect(res).to.have.a.property('tempSet');
   //   expect(res).to.have.a.property('probe');
   //   expect(res).to.have.a.property('state');
   //   done();
   //  });
   // });
   it('it should turn the grill off',function(done){
    myGrill.power('off',function(res){
     expect(res).to.have.a.property('temp');
     expect(res).to.have.a.property('tempSet');
     expect(res).to.have.a.property('probe');
     expect(res).to.have.a.property('state');
     done();
    });
   })
   it('it should only accept On or Off as an argument',function(done){
    expect(() => myGrill.power('test',function(res){})).to.throw();
    done();
   });
  });
  describe('temp()',function(){
   it('it should throw an error for not providing a valid device',function(done){
    expect(() => myGrill.temp('probe','340',function(res){})).to.throw();
    done();
   })
   it('it should throw an error for temps below 150',function(done){
    expect(() => myGrill.temp('probe1','120',function(res){})).to.throw();
    done();
   })
   it('it should throw an error for temps above 550',function(done){
    expect(() => myGrill.temp('probe2','575',function(res){})).to.throw();
    done();
   })
   it('it should throw an error for non integer temps',function(done){
    expect(() => myGrill.temp('probe1','test',function(res){})).to.throw();
    expect(() => myGrill.temp('probe2',test,function(res){})).to.throw();
    done();
   })
   it('it should set the probe 1 temperature',function(done){
    myGrill.temp('probe1',165,function(res){
     done();
    })
   })
  })
});