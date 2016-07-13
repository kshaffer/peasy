var dataToWrite = 'a bunch of data';

var fs = require('fs');
fs.writeFile('test_data_write.txt', dataToWrite, function(err) {
  if (err)
    console.log("Failed to write file:", err);
  else
    console.log("File written.");
});
