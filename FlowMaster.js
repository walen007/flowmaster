(function () {

/**
 * Creates an instance of FlowMaster.
 * It manages asyncronous operations and helps you avoid callback hell, code
 * smell or spaghetti code.
 * @constructor
 * @this {FlowMaster}
 */
function FlowMaster() {
  'use strict';
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
 * @return callback(err, opsResult) callback with error and operation result
 */
FlowMaster.prototype.series = function() {
  'use strict';

  //Retrieve the passed-in parameters with the "global" arguments object.
  var args = Array.prototype.slice.call(arguments);

  // Last parameter must be the callback function.
  var callback = args[args.length - 1];

  // Second to the last parameter must be the array of functions.
  var functionsArray = args[args.length - 2];

  var opsResult = null;
  var index = 0;

  function doNext() {
    var nextFunction = functionsArray.shift();
    if (nextFunction) {
      if (index === 0) {

        nextFunction(args, function(err, result){
          if (!err) {
            opsResult = result;
            doNext();
          } else {
            return callback(err, null);
          }
        });

        index++;

      } else {

        nextFunction(args, opsResult, function(err, result){
          if (!err) {
            opsResult = result;
            doNext();
          } else {
            return callback(err, null);
          }
        });

      }
    } else {
      callback(null, opsResult);
    }
  }
  doNext();
}

/**
 * Runs a function on an array of values in parallel.
 * FlowMaster.parallel(arrayOfValues, asyncFunction, callback)
 * @param {callback} last parameter must be a callback function.
 * @param {function} 2nd to the last parameter must a function to run.
 * @param {arrayOfValues} array of values to be processed.
 * @return callback(err, results) callback with error and result
 */
FlowMaster.prototype.parallel = function() {
  'use strict';

  //Retrieve the passed-in parameters with the "global" arguments object.
  var args = Array.prototype.slice.call(arguments);

  // 1st parameter must be the arrayOfValues.
  var items = args[0];

  // 2rd parameter must be the function to run on the arrays.
  var opFunction = args[1];

  // 3rd parameter must be the callback function.
  var callback = args[2];
  var results = [];
  var callbackSent = false;

  function doNext() {
    items.forEach(function(item, i) {
      opFunction(item, function(err, result){

        results.push(result);

        if (err && callbackSent === false) {
          callback(err, null);
          callbackSent = true;
        }

        if (results.length === items.length && callbackSent === false) {
          callback(null, results);
        }

      });
    });
  }
  doNext();
}

module.exports = FlowMaster;

})();

