//grades and statistics are generated here

function getAllGrades(className, pupilName)
{
	var data = {oral: [], small: [], big: []};
	var oral = theData[className].oral;
	for(var i = 0; i < oral.length; i++)
		if(oral[i].name == pupilName)
			data.oral.push(oral[i]);
	var small = theData[className].small;
	for(var i = 0; i < small.length; i++)
		for(var j = 0; j < small[i].groups.length; j++)
			for(var k = 0; k < small[i].groups[j].pupils.length; k++)
				if(small[i].groups[j].pupils[k].name == pupilName)
				{
					data.small.push(small[i].groups[j].pupils[k]);
					data.small[data.small.length - 1].factor = small[i].factor;
				}
	var big = theData[className].big;
	for(var i = 0; i < big.length; i++)
		for(var j = 0; j < big[i].groups.length; j++)
			for(var k = 0; k < big[i].groups[j].pupils.length; k++)
				if(big[i].groups[j].pupils[k].name == pupilName)
				{
					data.big.push(big[i].groups[j].pupils[k]);
					data.big[data.big.length - 1].factor = big[i].factor;
				}
	return data;
}

function getFinalScores(className,pupilName)
{
  var data={small:null,big:null,end:null};
  var grades=getAllGrades(className,pupilName);
  var factor=0;
  var small=0;
  for(var i=0;i<grades.oral.length;i++)
  {
    factor+=grades.oral[i].factor;
    small+=grades.oral[i].grade*grades.oral[i].factor;
  }
  for(var i=0;i<grades.small.length;i++)
  {  
    factor+=grades.small[i].factor;
    small+=grades.small[i].grade*grades.small[i].factor;
  }
  small/=factor;
  var big=0;
  factor=0;
  for(var i=0;i<grades.big.length;i++)
  {  
    factor+=grades.big[i].factor;
    big+=grades.big[i].grade*grades.big[i].factor;
  }
  big/=factor;
  data.small=small;
  data.big=big;
  data.end=(2*big+small)/3;
  return data;
}

function evalExercise(className, exerciseName, bigExericse)
{
	var data = {};
	var dataSorted = {};
	for(var i = 0; i < theData[className][bigExericse ? "big" : "small"].length; i++)
		if(theData[className][bigExericse ? "big" : "small"][i].name == exerciseName)
			data = theData[className][bigExericse ? "big" : "small"][i];
	var pupils = getPupils(className);
	dataSorted.name = data.name;
	dataSorted.date = data.date;
	dataSorted.factor = data.factor;
	dataSorted.gradingKey = data.gradingKey;
	dataSorted.exercises = [data.groups[0].exercises];
	if(data.groups.length == 2)
		dataSorted.exercises.push(data.groups[1].exercises);
  dataSorted.pupils=[];
	for(var i = 0; i < pupils.length; i++)
	{
    var pupilData=getPupilData(data,pupils[i].name);
    if(pupilData==null)
      continue;
    dataSorted.pupils.push(pupilData);
	}
  return dataSorted;
}

function getPupilData(exerciseData, pupilName)
{
	var indexGroup = 0;
	var indexPupil = exerciseData.groups[0].pupils.map(function (d) {
		return d.name;
	}).indexOf(pupilName);
	if(indexPupil == -1)
	{
		indexGroup = 1;
		indexPupil = exerciseData.groups[1].pupils.map(function (d) {
			return d.name;
		}).indexOf(pupilName);
	}
	if(indexPupil == -1)
		return null;
	var pupil = exerciseData.groups[indexGroup].pupils[indexPupil];
	pupil.group = indexGroup == 0 ? "A" : "B";
	return exerciseData.groups[indexGroup].pupils[indexPupil];
}
