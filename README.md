A simple module that helps you to manage asyncronous operations and 
avoid callback hell, code smell or spaghetti code.

To run a test, please install the dependencies as follows:
------------------------------------------------------------
sudo npm install
sudo npm install -g mocha

Run the "mocha" command to test the module.
---------------------------------------------
mocha


NB: You must have MongoDB running locally. The test wasn't configured to
use MongoDB connection authentication. You can add authentication on
line 69 of FlowMasterSpec.js, the test file is inside the "test" folder.

The module doesn't have to be used to manage async db ops alone. You 
can use it on file read/write, streams or any other async operation
in Node.js.
