//the json object is manupiladed here
function run_to_update_for_returned()
{
  var allClasses=getClasses();
  for(var i=0;i< allClasses.length;i++)
  {
    var big=getBig(allClasses[i]);
    for(var j=0;j<big.length;j++)//nr of big ex
      for(var k=0;k<big[j].groups.length;k++)//nr of groups
        for(var l=0;l<big[j].groups[k].pupils.length;l++)
          theData[allClasses[i]].big[j].groups[k].pupils[l].returned=true;
    var small=getSmall(allClasses[i]);
    for(var j=0;j<small.length;j++)//nr of big ex
      for(var k=0;k<small[j].groups.length;k++)//nr of groups
        for(var l=0;l<small[j].groups[k].pupils.length;l++)
          theData[allClasses[i]].small[j].groups[k].pupils[l].returned=true;
  }
}
function updateReturnedInfo(className, exercisename, bBig, pupilname, bReturned)
{
  if(bBig)
  {
    var big=getBig(className);
    for(var j=0;j<big.length;j++)//nr of big ex
      if(big[j].name==exercisename)
        for(var k=0;k<big[j].groups.length;k++)//nr of groups
          for(var l=0;l<big[j].groups[k].pupils.length;l++)
            if(theData[className].big[j].groups[k].pupils[l].name==pupilname)
            {
              theData[className].big[j].groups[k].pupils[l].returned=bReturned;
              return;
            }
  }
  else
  {
    var small=getSmall(className);
    for(var j=0;j<small.length;j++)//nr of big ex
      if(small[j].name==exercisename)
        for(var k=0;k<small[j].groups.length;k++)//nr of groups
          for(var l=0;l<small[j].groups[k].pupils.length;l++)
            if(theData[className].small[j].groups[k].pupils[l].name==pupilname)
            {
              theData[className].small[j].groups[k].pupils[l].returned=bReturned;
              return;
            }

  }
}

function setAllReturned(className, exercisename, bBig, bReturned)
{
  if(bBig)
  {
    var big=getBig(className);
    for(var j=0;j<big.length;j++)//nr of big ex
      if(big[j].name==exercisename)
        for(var k=0;k<big[j].groups.length;k++)//nr of groups
          for(var l=0;l<big[j].groups[k].pupils.length;l++)
              theData[className].big[j].groups[k].pupils[l].returned=bReturned;
  }
  else
  {
    var small=getSmall(className);
    for(var j=0;j<small.length;j++)//nr of big ex
      if(small[j].name==exercisename)
        for(var k=0;k<small[j].groups.length;k++)//nr of groups
          for(var l=0;l<small[j].groups[k].pupils.length;l++)
              theData[className].small[j].groups[k].pupils[l].returned=bReturned;

  }
}

function addNewClass(name, gradeRatio, gradeType)
{
  theData[name] = {gradeRatio: gradeRatio, gradeType: gradeType, oral: [], small: [], big: [], pupils: [], homework: [], missing: [], notes: [], cl:[], sp:[]}; //cl list, sp seating
}
function updatePupils(className, newPupils)
{
  var _y=20;
  theData[className].pupils = newPupils;
  for(var i=0; i<newPupils.length; i++)
  {
    var bIn=false;
    for(var j=0; j<theData[className].sp.length;j++)
    {
      if(theData[className].sp[j].name==newPupils[i].name)
      {
        bIn=true;
        break;
      }
    }
    if(bIn)
      continue;
    var _name=newPupils[i].name;
    var t=_name.split(' ').length;
    _name=_name.split(' ')[t-1];
    theData[className].sp.push({name:newPupils[i].name, dname: _name, x:20, y:_y});
    _y+=10;
  }
}
function getClasses()
{
  return Object.keys(theData);
}
function addExercise(className, exerciseCategory, exerciseName, exerciseDate, exerciseFactor, exerciseGradingKey, exerciseGroups)
{
  theData[className][exerciseCategory].push({name: exerciseName, date: exerciseDate, factor: exerciseFactor, gradingKey: exerciseGradingKey, groups: exerciseGroups});
}
function getPupils(className)
{
  return theData[className]["pupils"].sort(function(a, b) {
      return removeSpecialSignsForSortung(a.name) > removeSpecialSignsForSortung(b.name);
      });
}
function checkIfExerciseAlreadyExists(className, exerciseName, bigExercise)
{
  var exercises = theData[className][bigExercise ? "big" : "small"];
  for(var i = 0; i < exercises.length; i++)
    if(exercises[i].name == exerciseName)
      return true;
  return false;
}
function getExerciseData(className, exerciseName, bigExercise)
{
  var exercises = theData[className][bigExercise ? "big" : "small"];
  for(var i = 0; i < exercises.length; i++)
    if(exercises[i].name == exerciseName)
      return exercises[i];
}

function removeSpecialSignsForSortung(a)
{
  return a.replace("ä", "a").replace("ö", "o").replace("ü", "u").replace("ß", "s").replace("Ä", "A").replace("Ö", "O").replace("Ü", "U");
}
function capitaliseFirstLetter(string)
{
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function getSmall(className)
{
  return theData[className].small;
}
function getBig(className)
{
  return theData[className].big;
}
function getCl(className)
{
  return theData[className].cl;
}
function getOralGrades(className, pupilName)
{
  console.log(theData[className].oral);
  return theData[className]["oral"].filter(function (d) {
      return (d.name == pupilName);
      });
}

function updateOralGrades(className, pupilName, grades)
{
  console.log("editData enter");
  console.log(theData[className].oral);
  for(var i = theData[className].oral.length - 1; i >= 0; i--)
  {
    if(theData[className].oral[i].name == pupilName)
    {
      theData[className].oral.splice(i, 1);
    }
  }
  console.log(theData[className].oral);
  for(var i = 0; i < grades.length; i++)
    theData[className].oral.splice(theData[className].oral.length, 0, grades[i]);
  console.log(theData[className].oral);
}

function pupilAddNoHomework(className, pupilName, half)
{
  theData[className].homework.push({name: pupilName, date: getCurrentDate(), half: half});
}

function pupilAddMissing(className, pupilName)
{
  theData[className].missing.push({name: pupilName, date: getCurrentDate()});
}

function updateNote(className, pupilName, note)
{
  for(var i = 0; i < theData[className].notes.length; i++)
    if(theData[className].notes[i].name == pupilName)
    {
      theData[className].notes[i].note = note;
      return;
    }
  theData[className].notes.push({name: pupilName, note: note});
}
