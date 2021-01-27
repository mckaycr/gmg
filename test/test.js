'use strict';
const expect = require('chai').expect;
const Grill = require('../index.js');
const PORT = process.env.PORT || 8080;
const IP = process.env.IP;
const myGrill = new Grill(IP, PORT);

describe('grill', function(){
  it('should only test if a grill is accessible',function(done){
    if(!expect(() => myGrill.status(function(res){}).to.throw('connection to grill timed out'))){
      describe('Verify Bad Connection',function(){
        it('should throw an error because it can not connect to grill',function(done){
          const fakeGrill = new Grill('0.0.0.0', 8080);
          expect(() => fakeGrill.status(function(res){}).to.throw('connection to grill timed out'));
          done();
        })
      });
      describe('status()', function(){
        it('should return an object containing grill data', function(done){
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
       it('should turn the grill on',function(done){
        myGrill.power('on',function(res){
         expect(res).to.have.a.property('temp');
         expect(res).to.have.a.property('tempSet');
         expect(res).to.have.a.property('probe');
         expect(res).to.have.a.property('state');
         done();
        });
       });
       it('should turn the grill off',function(done){
        myGrill.power('off',function(res){
         expect(res).to.have.a.property('temp');
         expect(res).to.have.a.property('tempSet');
         expect(res).to.have.a.property('probe');
         expect(res).to.have.a.property('state');
         done();
        });
       })
       it('should only accept On or Off as an argument',function(done){
        expect(() => myGrill.power('test',function(res){}).to.throw('illegal argument'));
        done();
       });
      });
      describe('temp()',function(){
       it('should throw an error for not providing a valid device',function(done){
        expect(() => myGrill.temp('probe','340',function(res){}).to.throw('invalid device'));
        done();
       })
       it('should throw an error for temps below 150',function(done){
        expect(() => myGrill.temp('probe1','120',function(res){}).to.throw('invalid temperature'));
        done();
       })
       it('should throw an error for temps above 550',function(done){
        expect(() => myGrill.temp('probe2','575',function(res){}).to.throw('invalid temperature'));
        done();
       })
       it('should throw an error for non integer temps',function(done){
        expect(() => myGrill.temp('probe1','test',function(res){}).to.throw('invalid temperature'));
        expect(() => myGrill.temp('probe2',test,function(res){}).to.throw('invalid temperature'));
        done();
       })
       it('should set the probe 1 temperature',function(done){
        myGrill.temp('probe1',165,function(res){
        done();
        })
       })
      })  
      done();
    }else{
      this.skip();
      done();
    }
  })
});