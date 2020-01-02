
const fs = require('fs');


// From utilities.js
const utilities = {};

/**
 * Check if the path exists.
 *
 * @param path Path to check
 * @return True if the path exists in the given path, false if the path does not exist
 */
function isPathExist(path)
{
  return fs.existsSync(path);
}
utilities.isPathExist = isPathExist;

/**
 * Read text file from input path.
 *
 * @param path Path of text file to read
 * @return Text data read from path
 */
function readTextFile(path)
{
  return fs.readFileSync(path, 'utf8');
}
utilities.readTextFile = readTextFile;

/**
 * Read JSON file from input path.
 *
 * @param path Path of JSON file to read
 * @return JSON data read from path
 */
function readJsonFile(path)
{
  return JSON.parse(fs.readFileSync(path, 'utf8'));
}
utilities.readJsonFile = readJsonFile;

/**
 * Get list of file and folder names from the input directory path.
 *
 * @param directoryPath Path of the directory to read
 * @param isSplit If true, each entry consists of the directory path and the file name. If false, then directory path and file name are concatenated.
 * @return List of file and folder names from the input directory path
 */
function getPathsFromDirectory(directoryPath, isSplit = false)
{
  // Fix directory path so it has a '/' at the end
  let fixedDirectoryPath = directoryPath;
  if (directoryPath.substr(directoryPath.length - 1) !== '/')
  {
    fixedDirectoryPath += '/';
  }
  
  let pathNames = fs.readdirSync(directoryPath);
  let paths = [];
  for (let i = 0; i < pathNames.length; i++)
  {
    if (isSplit)
    {
      paths.push(
      {
        directoryPath: fixedDirectoryPath,
        fileName: pathNames[i]
      });
    }
    else
    {
      paths.push(fixedDirectoryPath + pathNames[i]);
    }
  }
  return paths;
}
utilities.getPathsFromDirectory = getPathsFromDirectory;

/**
 * Get list of file names from the input directory path.
 *
 * @param directoryPath Path of the directory to read
 * @param isSplit If true, each entry consists of the directory path and the file name. If false, then directory path and file name are concatenated.
 * @return List of file names from the input directory path
 */
function getFilePathsFromDirectory(directoryPath, isSplit = false)
{
  let allPaths = getPathsFromDirectory(directoryPath, isSplit);
  let filePaths = [];
  for (let i = 0; i < allPaths.length; i++)
  {
    let loopPath = allPaths[i];
    if (isSplit)
    {
      loopPath = allPaths[i].directoryPath + allPaths[i].fileName;
    }
    
    if (!isDirectory(loopPath))
    {
      filePaths.push(allPaths[i]);
    }
  }
  return filePaths;
}
utilities.getFilePathsFromDirectory = getFilePathsFromDirectory;

/**
 * Checks to see if the given path is a folder/directory.
 *
 * @param path Path of the directory to check
 * @return True if the path is a directory, false if it is not a directory
 */
function isDirectory(path)
{
  return fs.statSync(path).isDirectory();
}
utilities.isDirectory = isDirectory;

/**
 * Gets the creation time in milliseconds since epoch time of the file or directory.
 *
 * @param path Path of the file or directory
 * @return Creation time in milliseconds since epoch time of the file or directory
 */
function getPathCreationTime(path)
{
  return fs.statSync(path).birthtimeMs;
}
utilities.getPathCreationTime = getPathCreationTime;

/**
 * Gets the modified time in milliseconds since epoch time of the file or directory.
 *
 * @param path Path of the file or directory
 * @return Modified time in milliseconds since epoch time of the file or directory
 */
function getPathModifiedTime(path)
{
  return fs.statSync(path).mtimeMs;
}
utilities.getPathModifiedTime = getPathModifiedTime;

/**
 * Rename file or directory.
 *
 * @param oldPath Path to rename
 * @param newPath New path name
 */
function renamePath(oldPath, newPath)
{
  fs.renameSync(oldPath, newPath);
}
utilities.renamePath = renamePath;

/**
 * Write text to a file.
 *
 * @param filePath Path and filename of the file to save
 * @param contents Text to write to file
 */
function writeToFile(filePath, contents)
{
  fs.writeFile(filePath, contents, function(error)
  {
    if (error)
    {
      return console.error(error);
    }
  });
}
utilities.writeToFile = writeToFile;

// Export
module.exports = utilities;
