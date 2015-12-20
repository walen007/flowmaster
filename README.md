A simple module that helps you to manage asyncronous operations and 
avoid callback hell, code smell or spaghetti code.

To run a test, please install the dependencies as follows:
------------------------------------------------------------
<strong>sudo npm install</strong> <br />
<strong>sudo npm install -g mocha</strong>

Run the "mocha" command to test the module.
---------------------------------------------
<strong>mocha</strong>


NB: You must have MongoDB running locally. The test wasn't configured to
use MongoDB connection authentication. You can add authentication on
line 115 of FlowMasterSpec.js, the test file can be found inside the 
"test" folder.


Although this module's test uses MongoDB database asyncronous operations,
the module does not have to be used to manage only async db ops. You 
can use it to manage any type of asyncronous operations in Node.js.

If any functions supplied to the FlowMaster.series() returns an error,
the entire operation is aborted.

Ensure that your functions return acceptable callback formats when using
FlowMaster.series().


Callback format for failed operations:
----------------------------------------
callback(err, {status: 'failed', message: 'YOUR_ERROR_MESSAGE'});


Callback format for successful operations:
--------------------------------------------
callback(null, {status: 'success', message: 'YOUR_SUCCESS_MESSAGE', 
  data: yourResponseData});

More examples can be found in the test file:
/test/FlowMasterSpec.js
