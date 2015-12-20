'use strict';

// Tests the FlowMaster Module.
var should = require('should');
var MongoClient = require('mongodb').MongoClient;

var FlowMaster = require('../index.js');
var fm = new FlowMaster();
var curTime = new Date().getTime();


function saveTime(args, callback) {
  var db = args[0];
  db.collection('fmTest').insert({timeNow: curTime},
    function(err, result) {
      if (err) {
        callback(err, {status: 'failed', message: 'TIME_NOT_SAVED',
          data: curTime});
      } else {
        callback(null, {status: 'success', message: 'TIME_SAVED',
          data: curTime});        
      } 
  });

}

function getID(args, previousResult, callback) {
  var db = args[0];
  db.collection('fmTest').findOne({timeNow: previousResult.data},
    {_id: 1}, function(err, result) {

      if (err) {
        callback(err, {status: 'failed', message: 'UNABLE_TO_GET_ID'});
      } else {
        callback(null, {status: 'success', message: 'GOT_ID',
          data: result._id}); 
      }

  });

}

function addFName(args, previousResult, callback) {
  var db = args[0];
  db.collection('fmTest').update({_id: previousResult.data},
    {$set: {fname: args[1]}}, function(err, result){
      
      if (err) {
        callback(err, {status: 'failed', message: 'FNAME_NOT_ADDED'});
      } else {
        callback(null, {status: 'success', message: 'FNAME_ADDED',
          data: previousResult.data});   
      }
  
  });

}

function addLName(args, previousResult, callback) {
  var db = args[0];
  db.collection('fmTest').update({_id: previousResult.data},
    {$set: {lname: args[2]}}, function(err, result){
  
      if (err) {
        callback(err, {status: 'failed', message: 'LNAME_NOT_ADDED'});
      } else {
        callback(null, {status: 'success', message: 'LNAME_ADDED',
          data: previousResult.data}); 
      }

  });
}

function addGender(args, previousResult, callback) {
  var db = args[0];
  db.collection('fmTest').update({_id: previousResult.data},
    {$set: {gender: args[3]}}, function(err, result){

      if (err) {
        callback(err, {status: 'failed', message: 'GENDER_NOT_ADDED'});
      } else {
        callback(null, {status: 'success', message: 'GENDER_ADDED',
          data: previousResult.data}); 
      }
  
  });
}

function getRec(args, previousResult, callback) {
  var db = args[0];
  
  db.collection('fmTest').findOne({_id: previousResult.data},
    function(err, result){
    
    if (err) {
      callback(err, {status: 'failed', message: 'REC_NOT_GOT'});
    } else {
      callback(null, {status: 'success', message: 'GOT_REC',
        data: result}); 
    }
    
    db.close();
  });

}

function parallelFunction(item, callback) {
  setTimeout(function() { callback(null, item * 2); }, 20);
}

describe('FlowMaster Module', function(){
  
  it('should pass series test', function(done){
    
    MongoClient.connect('mongodb://localhost:27017/test',
      function(err, db) {
       
        var arrayOfFunctions = [saveTime, getID, addFName, addLName,
                                  addGender, getRec];
        
        fm.series(db, 'Adebowale', 'Akinola', 'Male', arrayOfFunctions,
          function(err, result) {
            result.data.lname.should.equal('Akinola');
            done();
        });
    
    });
  
  });

  it('should pass parallel test', function(done){
    var parallelItems = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ];

    fm.parallel(parallelItems, parallelFunction, function(err, result){
      result[3].should.equal(8);
      done();
    });
  });

});

