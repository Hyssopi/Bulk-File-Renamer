
const utilities = require('./util/utilities');


const WEEK_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const CSV_DELIMITER = '\t';
const CSV_PATH = './renameList.csv';
const LOG_PATH = './renameList.log';

// Read input arguments from user
let argument = process.argv[2];
console.info('argument: ' + argument);

if (argument && argument.toLowerCase() === 'continue')
{
  console.log('Start renaming...');
  if (utilities.isPathExist(CSV_PATH))
  {
    let csvInput = utilities.readTextFile(CSV_PATH).split('\n');
    let successfulRenameCount = 0;
    let outputLogEntries = [];
    // Looping by CSV input lines
    for (let i = 0; i < csvInput.length; i++)
    {
      if (csvInput[i] === '')
      {
        //console.debug('Index: ' + i + ', CSV input line is empty, skipping: ' + csvInput[i]);
        continue;
      }
      
      // Need to remove '\r' char which gets added when CSV file is modified by spreadsheet
      let csvInputSplit = csvInput[i].replace(/\r/g, '').split(CSV_DELIMITER);
      let oldPathDirectoryPath = csvInputSplit[0];
      let oldPathFileName = csvInputSplit[1];
      let newPathFileName = csvInputSplit[2];
      utilities.renamePath(oldPathDirectoryPath + oldPathFileName, oldPathDirectoryPath + newPathFileName);
      
      let logEntry =
      {
        "entry": (i + 1),
        "directoryPath": oldPathDirectoryPath,
        "oldFileName": oldPathFileName,
        "newFileName": newPathFileName
      };
      console.log(logEntry);
      outputLogEntries.push(logEntry);
      ++successfulRenameCount;
    }
    console.log('Renaming done. ' + successfulRenameCount + ' files renamed.');
    utilities.writeToFile(LOG_PATH, JSON.stringify(outputLogEntries, null, 2))
  }
  else
  {
    console.error('Error: CSV_PATH does not exist, ' + CSV_PATH);
  }
}
else if (utilities.isPathExist(argument))
{
  let csvOutput = '';
  
  let inputDirectoryPath = argument.replace(/\\/g, '/');
  let filePaths = utilities.getFilePathsFromDirectory(inputDirectoryPath, true);
  console.log('filePaths:');
  console.log(filePaths);
  
  for (let i = 0; i < filePaths.length; i++)
  {
    let modifiedDate = new Date(utilities.getPathModifiedTime(filePaths[i].directoryPath + filePaths[i].fileName));
    // Note: File extensions with multiple periods are not supported. For example: ".tar.gz".
    let fileExtension = filePaths[i].fileName.split('.').pop();
    
    let oldPath = filePaths[i].directoryPath + CSV_DELIMITER + filePaths[i].fileName;
    // Sample format of new file name: C:/Users/t/Desktop/TestRenameFolder/2019-05-05_(Sun)_1557052760157_0001.txt
    let newFileName = '';
    newFileName += modifiedDate.getFullYear();
    newFileName += '-';
    newFileName += ((modifiedDate.getMonth() + 1) < 10) ? ('0' + (modifiedDate.getMonth() + 1)) : (modifiedDate.getMonth() + 1);
    newFileName += '-';
    newFileName += (modifiedDate.getDate() < 10) ? ('0' + modifiedDate.getDate()) : modifiedDate.getDate();
    newFileName += '_(' + WEEK_NAMES[modifiedDate.getDay()] + ')_' + modifiedDate.getTime();
    newFileName += '_';
    newFileName += (i < 1000) ? '0' : '';
    newFileName += (i < 100) ? '0' : '';
    newFileName += (i < 10) ? '0' : '';
    newFileName += (i + 1);
    newFileName += '.' + fileExtension;
    
    csvOutput += oldPath + CSV_DELIMITER + newFileName + '\n';
  }
  utilities.writeToFile(CSV_PATH, csvOutput);
}
else
{
  console.error('Error: Input directory path is invalid.');
  console.error('For usage, for example:');
  console.error('node main.js "C:/Users/USERNAME/Desktop/TestRenameFolder"');
  console.error('node main.js "%USERPROFILE%/Desktop/TestRenameFolder/"');
  console.error('node main.js continue');
}
