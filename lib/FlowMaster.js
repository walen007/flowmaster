(function () {
  'use strict';

  /**
   * Creates an instance of FlowMaster.
   * It manages asyncronous operations and helps you avoid callback hell, code
   * smell or spaghetti code.
   * @constructor
   * @this {FlowMaster}
   */
  function FlowMaster() {
    if (false === (this instanceof FlowMaster))
      throw new Error('FlowMaster constructor called without ' +
        '"new" operator');
  }

  /**
   * Runs asyncronous functions in series.
   * FlowMaster.series([cParam1 , ..., cParamN], arrayOfFunctions, callback)
   * @param {callback} last parameter must be a callback function.
   * @param {arrayOfFunctions} 2nd to the last parameter, array of functions.
   * @param {cParam} pass all custom parameters before arrayOfFunctions.
   * @return callback(err, oResp) callback with error and operation result
   */
  FlowMaster.prototype.series = function() {

    //Retrieve the passed-in arguments with the "global" arguments object.
    var args = Array.prototype.slice.call(arguments);

    // Last parameter must be the callback function.
    var callback = args[args.length - 1];

    // Second to the last parameter must be the array of functions.
    var fn = args[args.length - 2];

    // (oResp = Operations response) All operations are aborted if one
    // function returns an error or fail.
    var oResp = null;

    var index = 0;

    // Execute the next function in the array of functions "fn".
    function executeNextFn() {
      var nextFunction = fn.shift();
      if (nextFunction) {
        if (index === 0) {

          nextFunction(args, function(err, result) {
            if (err) {
              return callback(err, null);
            } else if (result && result.status === 'failed') {
              return callback(null, result);
            } else if (result && result.status === 'success') {
              oResp = result;
              executeNextFn();
            }
          });

          index++;

        } else {

          nextFunction(args, oResp, function(err, result){
             if (err) {
              return callback(err, null);
            } else if (result && result.status === 'failed') {
              return callback(null, result);
            } else if (result && result.status === 'success') {
              oResp = result;
              executeNextFn();
            }
          });

        }
      } else {
        callback(null, oResp);
      }
    }

    executeNextFn(); // Run executeNextFn() function

  };

  /**
   * Runs a function on an array of values in parallel.
   * FlowMaster.parallel(arrayOfValues, asyncFunction, callback)
   * @param {callback} last parameter must be a callback function.
   * @param {function} 2nd to the last parameter must a function to run.
   * @param {arrayOfValues} array of values to be processed.
   * @return callback(err, results) callback with error and result
   */
  FlowMaster.prototype.parallel = function() {

    //Retrieve the passed-in parameters with the "global" arguments object.
    var args = Array.prototype.slice.call(arguments);

    // 1st parameter must be the arrayOfValues.
    var arVals = args[0];

    // 2rd parameter must be the function to run on the arrayOfValues.
    var fn = args[1];

    // 3rd parameter must be the callback function.
    var callback = args[2];

    var results = [],
        callbackSent = false;

    function executeFn() {
      arVals.forEach(function(value, i) { // Loop thru each value.
        if (!callbackSent) {
          fn(value, function(err, result) {
            if (err) {
              callbackSent = true;
              callback(err, null);
            } else if (result) {
              results.push(result); // Add to results array
              if (results.length === arVals.length) {
                callbackSent = true;
                callback(null, results);
              }
            }
          });
        }
      });
    }

    executeFn();

  };

  module.exports = FlowMaster;

})();
