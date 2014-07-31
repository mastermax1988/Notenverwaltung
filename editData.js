//the json object is manupiladed here
function addNewClass(name)
{
  theData[name]={oral:[],small:[],big:[],pupils:[]};
}
function updatePupils(className,newPupils)
{
  theData[className].pupils=newPupils;
}
function getClasses()
{
  return Object.keys(theData);
}

function getPupils(className)
{
  return theData[className]["pupils"].sort(function(a,b){return removeSpecialSignsForSortung(a.name)>removeSpecialSignsForSortung(b.name);});
}

function removeSpecialSignsForSortung(a)
{
  return a.replace("ä","a").replace("ö","o").replace("ü","u").replace("ß","s").replace("Ä","A").replace("Ö","O").replace("Ü","U");
}
function capitaliseFirstLetter(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}
