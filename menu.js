//code for generating the menus
var maxpupils = 35;
var maxexercises = 15;
function drawMainMenu()
{
	var d = d3.select("[id=menu1]");
	d.selectAll("*").remove();
	d.append("label").html("Klasse: ");
	d.append("select").attr("id", "selectClass").attr("onchange", "showClassInfo()").selectAll("option").data(getClasses(), function(p) {
		return p;
	}).enter().append("option").attr("value", function(d) {
		return d;
	}).html(function(d) {
		return d;
	});
	d.append("button").attr("onclick", "showClassInfo()").html("Klassenübersicht");
	d.append("button").attr("onclick", "saveData()").html("Speichern");
	d.append("button").attr("onclick", "maintenance()").html("Wartung");
	console.log(getClasses());
	showClassInfo();
}
function getSelectedClassName()
{
	var sel = d3.select("#selectClass")[0][0];
	if(sel.selectedIndex < 0)
		return null;
	return sel[sel.selectedIndex].value;
}
function showClassInfo()
{
	var m2 = emptyMenu2();
	var className = getSelectedClassName();
	var pupils = getPupils(className);
	var d = emptyForm1();
	m2.append("p").append("button").attr("onclick", "editOral()").html("Mündliche Noten");
	var selp = m2.append("p");
	var sel = selp.append("select").attr("id", "selectExercise");
	sel.append("option").attr("value", "new_small").html("Neuer kleiner Leistungsnachweis");
	sel.append("option").attr("value", "new_big").html("Neuer großer Leistungsnachweis");
	var small = getSmall(className);
	for(var i = 0; i < small.length; i++)
		sel.append("option").attr("value", small[i].name + "_small").html(small[i].name);
	var big = getBig(className);
	for(var i = 0; i < big.length; i++)
		sel.append("option").attr("value", big[i].name + "_big").html(big[i].name);
	selp.append("button").attr("onclick", "editExercise()").html("Bearbeiten");
	d.selectAll("p").data(getPupils(className)).enter().append("p").html(function(d) {
		return d.name + " (" + (d.male ? "m" : "w") + ")";
	});
}


function editExercise()
{
	var exercise = d3.select("#selectExercise")[0][0].value;
	if(exercise == "new_small")
	{
		addExerciseMenu(false);
		return;
	}
	else if(exercise == "new_big")
	{
		addExerciseMenu(true);
		return;
	}
	showExistingTest(getSelectedClassName(), exercise.split('_')[0], d3.select("#selectExercise")[0][0].value.split('_')[1] == "big");
	emptyMenu2();
}
function showExistingTest(className, exerciseName, bigExercise)
{
	var exercise = getExerciseData(className, exerciseName, bigExercise);
	var d = emptyForm1();
	console.log(exercise);
	var nrOfGroups = exercise.groups.length;
	var pupils = [];
	pupils.push(exercise.groups[0].pupils);
	if(nrOfGroups == 2)
		pupils.push(exercise.groups[1].pupils);
	console.log(pupils);
	for(var i = 0; i < nrOfGroups; i++)
	{
		d.append("p").html("Gruppe " + (i == 0 ? "A" : "B"));
		for(var j = 0; j < pupils[i].length; j++)
		{
			var p = d.append("p");
			p.append("label").html(pupils[i][j].name);
			for(var k = 0; k < pupils[i][j].points.length; k++)
			{

			}
		}
	}
}
function getNrOfGroups()
{
	var j = 0;
	while(d3.select("#exercisePupilGroup_" + j)[0][0] != null)
	{
		if (d3.select("#exercisePupilGroup_" + j).select("#exerciseGroupSelect")[0][0].selectedIndex == 2)
			return 2;
		j++
	}
	return 1;
}

function generateGradingKey()
{
	var maxpoints = 0;
	for(var i = 0; i < maxexercises; i++)
		maxpoints += parseFloat("0" + d3.select("#exercisePoints_" + i + "_A")[0][0].value); //0+string to prevent NaN parsing error
	var points = "";
	points += Math.round(maxpoints * 8.5 * 2, 0) / 20 + ",";
	points += Math.round(maxpoints * 7 * 2, 0) / 20 + ",";
	points += Math.round(maxpoints * 5.5 * 2, 0) / 20 + ",";
	points += Math.round(maxpoints * 4 * 2, 0) / 20 + ",";
	points += Math.round(maxpoints * 2 * 2, 0) / 20 + "";
	d3.select("#exerciseGradingKey")[0][0].value = points;
}

function getCurrentDate()
{
	var d = new Date()
	return d.toISOString().slice(0, 10);
}

function addExerciseMenu(bigExercise)
{
	var d = emptyForm1();
	var p = d.append("p");
	p.append("input").attr("id", "exerciseName").attr("placeHolder", "Name");
	p.append("input").attr("id", "exerciseDate").attr("placeHolder", "Datum").attr("value", getCurrentDate());
	p.append("input").attr("id", "exerciseFactor").attr("placeHolder", "Faktor");
	p.append("label").attr("id", "exerciseNrOfGroupsLabel");
	p.append("input").attr("id", "exerciseGradingKey").attr("placeHolder", "Bewertungsschlüssel");
	p.append("button").attr("id", "exerciseGenerateGradingKey").attr("onclick", "generateGradingKey()").html("Bewertungsschlüssel erstellen");
	for(var i = 0; i < maxexercises; i++)
	{
		p = d.append("p");
		p.append("input").attr("placeHolder", "Name A").attr("id", "exerciseName_" + i + "_A").attr("onchange", "copyExerciseMenuData('exerciseName'," + i + ")");
		p.append("input").attr("placeHolder", "Punkte A").attr("id", "exercisePoints_" + i + "_A").attr("onchange", "copyExerciseMenuData('exercisePoints'," + i + ")");
		p.append("input").attr("placeHolder", "Name B").attr("id", "exerciseName_" + i + "_B");
		p.append("input").attr("placeHolder", "Punkte B").attr("id", "exercisePoints_" + i + "_B");
	}
	var pupils = getPupils(getSelectedClassName());
	for(var i = 0; i < pupils.length; i++)
	{
		p = d.append("p").attr("id", "exercisePupilGroup_" + i);
		p.append("label").html(pupils[i].name).attr("id", "exercisePupilName");
		var s = p.append("select").attr("id", "exerciseGroupSelect").attr("onchange", "updateNrOfGroups()");
		s.append("option").attr("value", "-").html("-");
		s.append("option").attr("value", "A").html("A").attr("selected", "selected");
		s.append("option").attr("value", "B").html("B");
	}
	var m = emptyMenu2();
	m.append("button").attr("onclick", "saveNewExercise(" + bigExercise + ")").html("Neuen " + (bigExercise ? "großen " : "kleinen") + " Leistungsnachweis anlegen");
	updateNrOfGroups();
}

function updateNrOfGroups()
{
	d3.select("#exerciseNrOfGroupsLabel")[0][0].innerHTML = "Anzahl an Gruppen: " + getNrOfGroups();
}

function getEmptyPointArray(length)
{
	var arr = [];
	for(var i = 0; i < length; i++)
		arr.push("-");
	return arr;
}
function getNrOfExercises()
{
	var nr = 0;
	for(var i = 0; i < maxexercises; i++)
		if(d3.select("#exerciseName_" + i + "_A")[0][0].value != "")
			nr++;
	return nr;
}
function saveNewExercise(bigExercise)
{
	var exerciseName = d3.select("#exerciseName")[0][0].value;
	if(exerciseName == "")
	{
		alert("Bitte geben Sie einen Namen ein");
		return;
	}
	if(checkIfExerciseAlreadyExists(getSelectedClassName(), exerciseName, bigExercise))
	{
		alert("Es gibt bereits einen " + (bigExercise ? "großen" : "kleinen") + " Leistungsnachweis namens " + exerciseName);
		return;
	}
	var d = new Date(d3.select("#exerciseDate")[0][0].value);
	var groups = [];
	var pupilsA = [];
	var pupilsB = [];
	var j = 0;
	while(d3.select("#exercisePupilGroup_" + j)[0][0] != null)
	{
		var pup = {name: d3.select("#exercisePupilGroup_" + j).select("#exercisePupilName")[0][0].innerHTML, points: getEmptyPointArray(getNrOfExercises()), sum: 0, grade: ""};
		if(d3.select("#exercisePupilGroup_" + j).select("#exerciseGroupSelect")[0][0].selectedIndex == 1)
			pupilsA.push(pup);
		else if (d3.select("#exercisePupilGroup_" + j).select("#exerciseGroupSelect")[0][0].selectedIndex == 2)
			pupilsB.push(pup);
		j++;
	}

	for(var i = 0; i < getNrOfGroups(); i++)
	{
		var j = 0;
		var theExercises = [];
		for(var j = 0; j < maxexercises; j++)
		{
			var exerciseName = d3.select("#exerciseName_" + j + "_" + (i == 0 ? "A" : "B"))[0][0].value;
			if(exerciseName == "")
				continue;
			theExercises.push({name: exerciseName, points: d3.select("#exercisePoints_" + j + "_" + (i == 0 ? "A" : "B"))[0][0].value});
		}
		groups.push({name: i == 0 ? "A" : "B", exercises : theExercises, pupils : (i == 0 ? pupilsA : pupilsB)});
	}
	addExercise(getSelectedClassName(), bigExercise ? "big" : "small", exerciseName, d.toISOString(), d3.select("#exerciseFactor")[0][0].value, d3.select("#exerciseGradingKey")[0][0].value.split(','), groups);
	showClassInfo();
}
function copyExerciseMenuData(fieldName, index)
{
	d3.select("#" + fieldName + "_" + index + "_B")[0][0].value = d3.select("#" + fieldName + "_" + index + "_A")[0][0].value;
}
function editOral()
{
	var m2 = emptyMenu2();
	var d = emptyForm1();
	var className = getSelectedClassName();
	m2.append("select").attr("id", "selectPupilForOralGrades").attr("onchange", "showOralGrades()").selectAll("option").data(getPupils(className)).enter().append("option").attr("value", function(d) {
		return d.name;
	}).html(function(d) {
		return d.name
	});
	m2.append("button").html("Daten übernehmen").attr("onclick", "saveOralGrades()");
	showOralGrades();
}
function saveOralGrades()
{
	console.log("saveOralGrades");
	console.log(theData[getSelectedClassName()].oral);
	var i = 0;
	var grades = [];
	var pupil = d3.select("#selectPupilForOralGrades")[0][0].value;
	while(d3.select("#p_oral_" + i)[0][0] != null)
	{
		var p = d3.select("#p_oral_" + i);
		if(p.select("#grade")[0][0].value == "")
		{
			console.log("if");
			i++;
			continue;
		}
		var d = new Date(p.select("#date")[0][0].value);
		grades.push({name: pupil, grade: p.select("#grade")[0][0].value, factor: p.select("#factor")[0][0].value, kind: p.select("#kind")[0][0].value, date: d.toISOString()});
		console.log(grades[i]);
		i++;
	}
	updateOralGrades(getSelectedClassName(), pupil, grades);
}
function showOralGrades()
{
	var d = emptyForm1();
	var className = getSelectedClassName();
	var pupil = d3.select("#selectPupilForOralGrades")[0][0].value;
	var grades = getOralGrades(className, pupil);
	var p_demo = d.append("p").attr("id", "p_oral_demo");
	p_demo.append("input").attr("placeHolder", "Datum").attr("value", "Datum").attr("disabled", true);
	p_demo.append("input").attr("placeHolder", "Art").attr("value", "Art").attr("disabled", true);
	p_demo.append("input").attr("placeHolder", "Faktor").attr("value", "Faktor").attr("disabled", true);
	p_demo.append("input").attr("placeHolder", "Note").attr("value", "Note").attr("disabled", true).attr("style", "color:#FF0000;text-align:center;");

	for(var i = 0; i < grades.length; i++) //yeah, this could be done better with d3
	{
		var p = d.append("p").attr("id", "p_oral_" + i);
		p.append("input").attr("placeHolder", "Datum").attr("id", "date").attr("value", grades[i].date.slice(0, 10));
		p.append("input").attr("placeHolder", "Art").attr("id", "kind").attr("value", grades[i].kind);
		p.append("input").attr("placeHolder", "Faktor").attr("id", "factor").attr("value", grades[i].factor);
		p.append("input").attr("placeHolder", "Note").attr("id", "grade").attr("value", grades[i].grade).attr("style", "color:#FF0000;text-align:center;");
	}
	var index = grades.length;
	var p = d.append("p").attr("id", "p_oral_" + index);
	p.append("input").attr("placeHolder", "Datum").attr("id", "date");
	p.append("input").attr("placeHolder", "Art").attr("id", "kind");
	p.append("input").attr("placeHolder", "Faktor").attr("id", "factor");
	p.append("input").attr("placeHolder", "Note").attr("id", "grade").attr("style", "color:#FF0000;text-align:center;");
}
function maintenance()
{
	var d = emptyMenu2();
	d.append("button").html("Klasse hinzufügen").attr("onclick", "addClassMenu()");
	d.append("button").html("Schüler bearbeiten").attr("onclick", "addPupilMenu()");
	emptyForm1();
}

function addClassMenu()
{
	var d = emptyForm1();
	d.append("input").attr("placeholder", "name").attr("id", "className");
	d.append("button").attr("onclick", "addClass()").html("Klasse anlegen");
	d.append("button").attr("onclick", "abortForm()").html("Abbrechen");
}
function addPupilMenu()
{
	var sel = d3.select("#selectClass")[0][0];
	if(sel.selectedIndex < 0)
		return;
	var className = sel[sel.selectedIndex].value;
	var d = emptyForm1();
	var pup = getPupils(className);
	for(var i = 0; i < maxpupils; i++)
	{
		var line = d.append("p");
		if(i < pup.length)
		{
			line.append("input").attr("placeholder", "name").attr("id", "pupilName_" + i).attr("value", pup[i].name)
			line.append("input").attr("type", "checkbox").attr("id", "pupilMale_" + i).property('checked', pup[i].male);
		}
		else
		{
			line.append("input").attr("placeholder", "name").attr("id", "pupilName_" + i);
			line.append("input").attr("type", "checkbox").attr("id", "pupilMale_" + i).property('checked', false)
		}
		line.append("label").html("männlich")
	}
	var m = emptyMenu2();
	m.append("button").attr("onclick", "updatePupilsFromForm('" + className + "')").html("Änderungen übernehmen");
}
function updatePupilsFromForm(className)
{
	var newPupils = [];
	for(var i = 0; i < maxpupils; i++)
	{
		var pupilName = d3.select("#pupilName_" + i)[0][0].value;
		var pupilMale = d3.select("#pupilMale_" + i)[0][0].checked;
		if(pupilName == "")
			continue;
		console.log(pupilName);
		newPupils.push({name: capitaliseFirstLetter(pupilName), male: pupilMale});
	}
	updatePupils(className, newPupils);
	drawMainMenu();
}

function abortForm()
{
	emptyForm1();
}
function addClass()
{
	var name = d3.select("[id=className]")[0][0].value;
	if(name == "")
		return;
	emptyForm1();
	addNewClass(name);
	drawMainMenu();
}
function emptyForm1()
{
	var d = d3.select("[id=form1]");
	d.selectAll("*").remove()
	return d;
}
function emptyMenu2()
{
	var d = d3.select("[id=menu2]");
	d.selectAll("*").remove();
	return d;
}

