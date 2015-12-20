I developed this module to manage the asyncronous control flow in Node.js
to prevent myself from writing spaghetti code. It was implemented using
Javascript closure.

You can call it my own async.js module that I used to write testable
Node.js code.

Install dependencies first with the following commands:
-------------------------------------------------------
sudo npm install
sudo npm install -g mocha

Then run the "mocha" command to test the module.
------------------------------------------------------
mocha


NB: You must have MongoDB running locally. The test wasn't configured to use
MongoDB connection authentication. You can add authentication on line 69 of
FlowMasterSpec.js, the test file is inside the "test" folder.

The module doesn't have to be used to manage async db ops alone. You can use
it on file read/write, streams or any other async operation in Node.js.
