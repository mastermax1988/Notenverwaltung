//the json object is manupiladed here
function addNewClass(name)
{
	theData[name] = {oral: [], small: [], big: [], pupils: []};
}
function updatePupils(className, newPupils)
{
	theData[className].pupils = newPupils;
}
function getClasses()
{
	return Object.keys(theData);
}

function getPupils(className)
{
	return theData[className]["pupils"].sort(function(a, b) {
		return removeSpecialSignsForSortung(a.name) > removeSpecialSignsForSortung(b.name);
	});
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
	for(var i = theData[className].oral.length - 1; i > 0; i--)
		if(theData[className].oral[i].Name == pupilName)
		{
			console.log("slice");
			theData.slice(i, 1);
		}
	console.log(theData[className].oral);
	return;
	theData[className].oral.push(grades);
	console.log(theData[className].oral);

}

