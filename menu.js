//code for generating the menus
var maxpupils = 35;
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
	sel.selectAll("option").data(getSmall(className), function(d) {
		return d;
	}).enter().append("option").attr("value", function(d) {
		return d.name;
	}).html(function(d) {
		return d.name;
	});
	selp.append("button").attr("onclick", "editExercise()").html("Bearbeiten");
	d.selectAll("p").data(getPupils(className)).enter().append("p").html(function(d) {
		return d.name + " (" + (d.male ? "m" : "w") + ")";
	});
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
		if(p.select("#grade") == "")
		{
			console.log("if");
			i++;
			continue;
		}
		grades.push({name: pupil, grade: p.select("#grade")[0][0].value, factor: p.select("#factor")[0][0].value, kind: p.select("#kind")[0][0].value, date: p.select("#date")[0][0].value});
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
		p.append("input").attr("placeHolder", "Datum").attr("id", "date").attr("value", grades[i].date);
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
function menuEnabled(b)
{
	if(!b)
		d3.selectAll("[kind=menu]").selectAll("button").attr("disabled", "disabled");
	else
		d3.selectAll("[kind=menu]").selectAll("button").attr("disabled", null);
}
function addClassMenu()
{
	menuEnabled(false);
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
	menuEnabled(true);
}
function addClass()
{
	var name = d3.select("[id=className]")[0][0].value;
	if(name == "")
		return;
	menuEnabled(true);
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


