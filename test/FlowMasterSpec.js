// Tests the FlowMaster Module.
var should = require('should');
var MongoClient = require('mongodb').MongoClient;

var FlowMaster = require('../FlowMaster.js');
var fm = new FlowMaster();
var curTime = new Date().getTime();

function saveTime(args, callback) {
  var db = args[0];
  db.collection('fmTest').insert({timeNow: curTime}, function(err, result){
    callback(err, curTime);
  });
}

function getID(args, previousResult, callback) {
  var db = args[0];
  db.collection('fmTest').findOne({timeNow: previousResult},
    {_id: 1}, function(err, result){
    callback(err, result._id);
  });

}

function addFName(args, previousResult, callback) {
  var db = args[0];

  db.collection('fmTest').update({_id: previousResult},
                            {$set: {fname: args[1]}}, function(err, result){
    callback(err, previousResult);
  });

}

function addLName(args, previousResult, callback) {
  var db = args[0];
  db.collection('fmTest').update({_id: previousResult},
                            {$set: {lname: args[2]}}, function(err, result){
    callback(err, previousResult);
  });
}

function addGender(args, previousResult, callback) {
  var db = args[0];
  db.collection('fmTest').update({_id: previousResult},
                            {$set: {gender: args[3]}}, function(err, result){
    callback(err, previousResult);
  });
}

function getRec(args, previousResult, callback) {
  var db = args[0];
  db.collection('fmTest').findOne({_id: previousResult},
    function(err, result){
    callback(err, result);
    db.close();
  });

}

function parallelFunction(item, callback) {
  console.log('Running async op, callback in 1000ms.');
  setTimeout(function() { callback(null, item * 2); }, 1000);
}

describe('FlowMaster Module', function(){

  it('should run/pass series test', function(done){
    MongoClient.connect('mongodb://localhost:27017/test',
      function(err, db) {
      'use strict';
      var arrayOfFunctions = [saveTime, getID, addFName, addLName,
                                addGender, getRec];
      fm.series(db, 'Wale', 'Nureni', 'Male', arrayOfFunctions,
        function(err, result){
        result.lname.should.equal('Nureni');
        db.collection('fmTest').drop();
        done();
      });
    });
  });

  it('should run/pass parallel test', function(done){
    var parallelItems = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ];

    fm.parallel(parallelItems, parallelFunction, function(err, result){
      result[3].should.equal(8);
      done();
    });
  });

});

