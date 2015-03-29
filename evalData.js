//grades and statistics are generated here

function getAllGrades(className, pupilName)
{
	var data = {oral: [], small: [], big: []};
	data.gradeRatio = theData[className].gradeRatio;
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
					var obj = {};
					obj.points = small[i].groups[j].pupils[k].points;
					obj.sum = small[i].groups[j].pupils[k].sum;
					obj.grade = small[i].groups[j].pupils[k].grade;
					obj.factor = small[i].factor;
					obj.date = small[i].date;
					obj.exerciseName = small[i].name;
					data.small.push(obj);
				}
	var big = theData[className].big;
	for(var i = 0; i < big.length; i++)
		for(var j = 0; j < big[i].groups.length; j++)
			for(var k = 0; k < big[i].groups[j].pupils.length; k++)
				if(big[i].groups[j].pupils[k].name == pupilName)
				{
					var obj = {};
					obj.points = big[i].groups[j].pupils[k].points;
					obj.sum = big[i].groups[j].pupils[k].sum;
					obj.grade = big[i].groups[j].pupils[k].grade;
					obj.factor = big[i].factor;
					obj.date = big[i].date;
					obj.exerciseName = big[i].name;
					data.big.push(obj);
				}
	return data;
}

function getFinalScores(className, pupilName)
{
	var data = {small: null, big: null, end: null};
	var grades = getAllGrades(className, pupilName);
	var factor = 0;
	var small = 0;
	for(var i = 0; i < grades.oral.length; i++)
	{
		factor += grades.oral[i].factor;
		small += grades.oral[i].grade * grades.oral[i].factor;
	}
	for(var i = 0; i < grades.small.length; i++)
	{
		if(grades.small[i].grade == "-")
			continue;
		factor += grades.small[i].factor;
		small += grades.small[i].grade * grades.small[i].factor;
	}
	small /= factor;
	var big = 0;
	factor = 0;
	for(var i = 0; i < grades.big.length; i++)
	{
		if(grades.big[i].grade == "-")
			continue;
		factor += grades.big[i].factor;
		big += grades.big[i].grade * grades.big[i].factor;
	}
	big /= factor;
	data.small = Math.round(small * 1000) / 1000;
	if(isNaN(big))
	{
		data.end = small;
		data.big = big;
	}
	else
	{
		data.big = Math.round(big * 1000) / 1000;
		var gradeRatio = grades.gradeRatio.split("_");
		var ratioSmall = parseFloat("0" + gradeRatio[1]);
		var ratioBig = parseFloat("0" + gradeRatio[0]);
		var end = (big * ratioBig + small * ratioSmall) / (ratioBig + ratioSmall);
		data.end = Math.round(end * 1000) / 1000;
	}
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
	var maxpoints = 0;
	for(var i = 0; i < data.groups[0].exercises.length; i++)
		maxpoints += data.groups[0].exercises[i].points;
	dataSorted.maxpoints = maxpoints;
	dataSorted.pupils = [];
	var averagepoints = [[], [], []]; //grp A, B, total
	for(var i = 0; i < pupils.length; i++)
	{
		var pupilData = getPupilData(data, pupils[i].name);
		if(pupilData == null)
			continue;
		dataSorted.pupils.push(pupilData);
		var grpIndex = pupilData.group == "A" ? 0 : 1;
		for(var j = 0; j < pupilData.points.length; j++)
			if(averagepoints[grpIndex][j] == null)
				averagepoints[grpIndex][j] = pupilData.points[j] / data.groups[grpIndex].pupils.length;
			else
				averagepoints[grpIndex][j] += pupilData.points[j] / data.groups[grpIndex].pupils.length;
		if(averagepoints[1].length > 0)
			for(var j = 0; j < averagepoints[0].length; j++)
				averagepoints[2][j] = (averagepoints[0][j] * data.groups[0].pupils.length + averagepoints[1][j] * data.groups[1].pupils.length) / (data.groups[0].pupils.length + data.groups[1].pupils.length);
	}
	for(var i = 0; i < (averagepoints[1].length == 0 ? 1 : 3); i++)
		for(var j = 0; j < averagepoints[0].length; j++)
			if(i < 2)
				averagepoints[i][j] = averagepoints[i][j] / data.groups[i].exercises[j].points * 100;
			else
				averagepoints[2][j] = (averagepoints[0][j] + averagepoints[1][j]) * 0.5;
	dataSorted.averagepoints = averagepoints;
	var gradeDistribution = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	var total = 0;
	currentGradingType = getCurrentGradingType(className);
	for(var i = 0; i < dataSorted.pupils.length; i++)
	{
		if(currentGradingType == "Note")
			gradeDistribution[dataSorted.pupils[i].grade - 1]++;
		else if (currentGradingType == "Punkte")
			gradeDistribution[dataSorted.pupils[i].grade]++;
		total += dataSorted.pupils[i].grade;
	}
	dataSorted.gradeDistribution = gradeDistribution;
	dataSorted.average = Math.round(total / dataSorted.pupils.length * 1000) / 1000;
	return dataSorted;
}
function getAverageGradeFromPunkte(gradeDistribution)
{
	var av = 0;
	var total = 0;
	for(var i = 0; i < 16; i++)
		total += gradeDistribution[i];
	for(var i = 0; i < 5; i++)
		for(var j = 0; j < 3; j++)
			av += gradeDistribution[15 - i * 3 - j] * (i + 1);
			av += gradeDistribution[0] * 6;
	return Math.round(1000 * av / total) / 1000;

}
function getPupilData(exerciseData, pupilName)
{
	var indexGroup = 0;
	var indexPupil = exerciseData.groups[0].pupils.map(function (d) {
		return d.name;
	}).indexOf(pupilName);
	if(indexPupil == -1 &&  exerciseData.groups.length > 1)
	{
		indexGroup = 1;
		indexPupil = exerciseData.groups[1].pupils.map(function (d) {
			return d.name;
		}).indexOf(pupilName);
	}
	if(indexPupil == -1)
		return null;
	return {name: exerciseData.groups[indexGroup].pupils[indexPupil].name, points: exerciseData.groups[indexGroup].pupils[indexPupil].points, sum: exerciseData.groups[indexGroup].pupils[indexPupil].sum, grade: exerciseData.groups[indexGroup].pupils[indexPupil].grade, group: (indexGroup == 0 ? "A" : "B")};
}
