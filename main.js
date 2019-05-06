
const utilities = require('./util/utilities');


const WEEK_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const CSV_DELIMITER = '\t';
const CSV_PATH = './renameList.csv';

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
    // Looping by CSV input lines
    for (let i = 0; i < csvInput.length; i++)
    {
      if (csvInput[i] === '')
      {
        console.debug('Index: ' + i + ', CSV input line is empty, skipping: ' + csvInput[i]);
        continue;
      }
      
      // Need to remove '\r' char which gets added when CSV file is modified by spreadsheet
      let csvInputSplit = csvInput[i].replace(/\r/g, '').split(CSV_DELIMITER);
      let oldPath = csvInputSplit[0];
      let newPath = csvInputSplit[1];
      utilities.renamePath(oldPath, newPath);
      console.log('Index: ' + i + ', oldPath: ' + oldPath + ', newPath: ' + newPath);
      ++successfulRenameCount;
    }
    console.log('Renaming done. ' + successfulRenameCount + ' files renamed.');
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
    let creationDate = new Date(utilities.getPathCreationDate(filePaths[i].directoryPath + filePaths[i].fileName));
    // Note: File extensions with multiple periods are not supported. For example: ".tar.gz".
    let fileExtension = filePaths[i].fileName.split('.').pop();
    
    let oldPath = filePaths[i].directoryPath + filePaths[i].fileName;
    // Sample format of new file name: C:/Users/t/Desktop/TestRenameFolder/2019-05-05_(Sun)_1557052760157_0001.txt
    let newFileName = '';
    newFileName += creationDate.getFullYear();
    newFileName += '-';
    newFileName += ((creationDate.getMonth() + 1) < 10) ? ('0' + (creationDate.getMonth() + 1)) : (creationDate.getMonth() + 1);
    newFileName += '-';
    newFileName += (creationDate.getDate() < 10) ? ('0' + creationDate.getDate()) : creationDate.getDate();
    newFileName += '_(' + WEEK_NAMES[creationDate.getDay()] + ')_' + creationDate.getTime();
    newFileName += '_';
    newFileName += (i < 1000) ? '0' : '';
    newFileName += (i < 100) ? '0' : '';
    newFileName += (i < 10) ? '0' : '';
    newFileName += (i + 1);
    let newPath = filePaths[i].directoryPath + newFileName + '.' + fileExtension;
    
    csvOutput += oldPath + CSV_DELIMITER + newPath + '\n';
  }
  utilities.writeToFile(CSV_PATH, csvOutput);
}
else
{
  console.error('Error: Input directory path is invalid.');
  console.error('For usage, for example:');
  console.error('node main.js "C:/Users/USERNAME/Desktop/TestRenameFolder');
  console.error('node main.js "%USERPROFILE%/Desktop/TestRenameFolder/"');
  console.error('node main.js continue');
}
