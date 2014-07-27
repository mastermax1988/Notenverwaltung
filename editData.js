//the json object is manupiladed here
function addNewClass(name)
{
  theData[name]={oral:[],small:[],big:[],pupils:[]};
}
function getClasses()
{
  return Object.keys(theData);
}

function getPupils(className)
{
  return theData[className]["pupils"];
}
