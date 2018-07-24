//code for generating the menus
var maxpupils = 35;
var maxexercises = 45;
var maxclcols = 10;
function drawMainMenu()
{
	var d = d3.select("[id=menu1]");
	d.selectAll("*").remove();
	d.append("label").html("Klasse: ");
	d.append("select").attr("id", "selectClass").attr("onchange", "showClassInfo()").selectAll("option").data(getClasses(), function(p)
	{
		return p;
	}).enter().append("option").attr("value", function(d)
	{
		return d;
	}).html(function(d)
	{
		return d;
	});
	d.append("button").attr("onclick", "showClassInfo()").html("Klassenübersicht");
	d.append("button").attr("onclick", "showDetailedClassInfo()").html("Notenbogen");
	d.append("button").attr("onclick", "showHomeworkInfo()").html("Hausaufgaben");
	d.append("button").attr("onclick", "showMissingInfo()").html("Fehltage");
	d.append("button").attr("onclick", "saveData()").html("Speichern");
	d.append("button").attr("onclick", "window.print()").html("Daten drucken");
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
function printTable()
{
	var divToPrint = document.getElementById('form1');
	var newWin = window.open("#");
	newWin.document.write(divToPrint.outerHTML);
	newWin.print();
	newWin.close();
}
function showClassInfoAndJumpToEval(s)
{
	showClassInfo();
	var sel = d3.select("#selectExercise")[0][0];
	for(var i = 0; i < sel.length; i++)
		if(sel[i].label == s)
		{
			sel.selectedIndex = i;
			break;
		}
	showEvalExercise();
}
function jumpToOral(s)
{
	editOral();
	showClassInfoAndJumpToOral(s);
}
function showClassInfoAndJumpToOral(s)
{
	showOralGrades();
	var sel = d3.select("#selectPupilForOralGrades")[0][0].options;
	for(var i = 0; i < sel.length; i++)
		if(sel[i].label == s)
		{
			sel.selectedIndex = i;
			break;
		}
	showOralGrades();
}
function rndPupil()
{
	var pupils = getPupils(getSelectedClassName());
	var rnd = Math.floor(Math.random() * pupils.length);
	d3.select("#rndpupil")[0][0].innerHTML = " Nr " + (rnd + 1) + ": " + pupils[rnd].name;
}

function clclick()
{
	var clval = d3.select("#clselect")[0][0].value;
	if(clval == "new_cl")
	{
		showNewCl();
		return;
	}
	showCl(clval);
}

function showCl(clname)
{
	var className = getSelectedClassName();
	var allCl = getCl(className);
	var cl;
	for(var i = 0; i < allCl.length; i++)
		if(allCl[i].name == clname)
		{
			cl = allCl[i];
			break;
		}
	var d = emptyForm1();
	d.append("label").html(cl.name);
	var table = d.append("p").append("table").attr("class", "layout_left");
	table.append("td").html("#").attr("class", "layout_left");
	table.append("th").html("Name");
	for(var i = 0; i < cl.cols.length; i++)
		table.append("th").html(cl.cols[i].name);
	var bCol = false;
	for(var i = 0; i < cl.pupils.length; i++)
	{
		var tr = table.append("tr").attr("class", bCol ? "highlight_lightgray" : "highlight_white");
		bCol = !bCol;
		tr.append("td").attr("class", "alnright").html((i + 1).toString());
		tr.append("td").append("a").html(cl.pupils[i].name).attr("href", "#").attr("onclick", "showPupilInfo('" + cl.pupils[i].name + "')");
		for(var j = 0; j < cl.pupils[i].c.length; j++)
			tr.append("td").append("input").attr("type", "checkbox").property('checked', cl.pupils[i].c[j]).attr("onclick", "saveCurrentCl('" + clname + "')").attr("id", "cl_" + cl.pupils[i].name.replace(" ", "_") + "_" + j);
	}
}

function saveCurrentCl(clname)
{
	var className = getSelectedClassName();
	var allCl = getCl(className);
	var cl;
	for(var i = 0; i < allCl.length; i++)
		if(allCl[i].name == clname)
		{
			cl = allCl[i];
			break;
		}
	var pups = cl.pupils;
	for(var i = 0; i < pups.length; i++)
		for(var j = 0; j < pups[i].c.length; j++)
			pups[i].c[j] = d3.select("#cl_" + pups[i].name.replace(" ", "_") + "_" + j)[0][0].checked;
	showCl(clname);
}


function showNewCl()
{
	var d = emptyForm1();
	var m2 = emptyMenu2();
	m2.append("button").attr("onclick", "savenewcl()").html("Neue Liste speichern");

	var selp = d.append("p");
	selp.append("label").html("Titel");
	selp.append("input").attr("id", "cltitle");
	for(var i = 0; i < maxclcols; i++)
	{
		d.append("p").append("input").attr("id", "clcol_" + i);
	}
}

function savenewcl()
{
	var className = getSelectedClassName();
	var cl = getCl(className);
	var newclname = d3.select("#cltitle")[0][0].value;
	if(newclname == "")
	{
		alert("Bitte geben Sie einen Namen ein!");
		return;
	}

	for(var i = 0; i < cl.length; i++)
		if(cl[i].name == newclname)
		{
			alert("Liste existiert bereits");
			return;
		}

	newcl = {};
	newcl.name = newclname;
	newcl.cols = [];
	for(var i = 0; i < maxclcols; i++)
	{
		var colname = d3.select("#clcol_" + i)[0][0].value;
		if(colname == "")
			break;
		newcl.cols.push({name: colname});
	}
	if(newcl.cols.length == 0)
	{
		alert("Bitte mindestens eine Spalte anlegen!");
		return;
	}
	newcl.pupils = [];
	var pups = getPupils(className);
	for(var i = 0; i < pups.length; i++)
	{
		var o = {};
		o.name = pups[i].name;
		o.c = new Array(newcl.cols.length).fill(false);
		newcl.pupils.push(o);
	}
	theData[className].cl.push(newcl);
	showClassInfo();
}
function showClassInfo()
{
	var m2 = emptyMenu2();
	var className = getSelectedClassName();
	var pupils = getPupils(className);
	var d = emptyForm1();

	var selp = m2.append("p");
	selp.append("button").attr("onclick", "editOral()").html("Mündliche Noten");
	var selcl = selp.append("select").attr("id", "clselect");
	selcl.append("option").attr("value", "new_cl").html("Neue Liste");
	var cl = getCl(getSelectedClassName())
					 for(var i = 0; i < cl.length; i++)
						 selcl.append("option").attr("value", cl[i].name).html(cl[i].name);
	selp.append("button").attr("onclick", "clclick()").html("Zeige Liste");
	selp.append("button").attr("onclick", "rndPupil()").html("Zufallsschüler");
	selp.append("button").attr("onclick", "showPlan()").html("Sitzplan");
	selp.append("label").attr("id", "rndpupil");
	selp = m2.append("p");
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
	selp.append("button").attr("onclick", "showEvalExercise()").html("Auswertung anzeigen");
	selp.append("input").attr("type", "checkbox").attr("id", "cbShowGradeOnly").attr("onchange", "showEvalExercise()");
	selp.append("label").html("Zeige nur Noten");
	d.append("p").html(className);
	var table = d.append("table").attr("class", "layout_left");
	table.append("td").html("#").attr("class", "alnright");
	table.append("th").html("Name");
	table.append("th").html("");
	table.append("th").html("kl.");
	table.append("th").html("gr.");
	table.append("th").html("Endnote");
	table.append("th").html("Anzahl mdl.");
	var bMissingTests = false;
	if(getAllMissingTests(className).length > 0)
	{
		bMissingTests = true;
		table.append("th").html("Fehlende Leistungsnachweise");
	}
	var bCol = false;
	for(var i = 0; i < pupils.length; i++)
	{
		var tr = table.append("tr").attr("class", bCol ? "highlight_lightgray" : "highlight_white");
		bCol = !bCol;
		//	tr.append("td").html(pupils[i].name);
		tr.append("td").attr("class", "alnright").html((i + 1).toString());
		tr.append("td").append("a").html(pupils[i].name).attr("href", "#").attr("onclick", "showPupilInfo('" + pupils[i].name + "')");
		tr.append("td").html(pupils[i].male ? "m" : "w");
		var scores = getFinalScores(className, pupils[i].name);
		tr.append("td").attr("class", "alnright").html(scores.small);
		tr.append("td").attr("class", "alnright").html(scores.big);
		var gt = getCurrentGradingType(className)
						 if((gt == "Note" && scores.end > 4.5) || (gt == "Punkte" && scores.end < 4.5))
							 tr.append("td").attr("class", "alnright_red").html(scores.end);
		else
			tr.append("td").attr("class", "alnright").html(scores.end);
		var grades = getAllGrades(className, pupils[i].name);
		tr.append("td").html(grades.small.length + grades.oral.length).attr("class", "alnright");
		if(bMissingTests)
		{
			var tdmiss = tr.append("td");
			var missingtest = "";
			var missingtestdata = getMissingTestsFromPupilName(className, pupils[i].name);
			for (var j = 0; j < missingtestdata.length; j++)
				tdmiss.append("a").html(missingtestdata[j].exercisename + " ").attr("href", "#").attr("onclick", "showClassInfoAndJumpToEval('" + missingtestdata[j].exercisename + "')");
		}
	}
	d.append("textarea").attr("rows", 40).attr("cols", 80).attr("id", "classnote").attr("class", "layout_left").attr("onkeyup", "updateNoteClassInfo('" + className + "','classinfo')").html(getPupilNote(className, "classinfo"));
	//d.append("button").attr("onclick", "updateNoteAndShowClassInfo('" + className + "','classinfo')").attr("class","layout_left").html("Notizen übernehmen");


}

function showPlan()
{
	var d = emptyForm1();
	var className = getSelectedClassName();
	d.append("canvas").attr("id","canvas").attr("width",canvasWidth).attr("height",canvasHeight).attr("style","border:1px solid #000000;");
  canvas=document.getElementById("canvas");
  ctx=canvas.getContext("2d");
  canvas.onmousedown=cMouseDown;
  canvas.onmouseup=cMouseUp;
  updateCanvas();
}

function showEvalExercise()
{
	var d = emptyForm1();
	var className = getSelectedClassName();
	currentGradingType = getCurrentGradingType(className);
	var exerciseSel = d3.select("#selectExercise")[0][0].value;
	if(exerciseSel == "new_small" || exerciseSel == "new_big")
	{
		showClassInfo();
		return;
	}
	var bShowGradOnly = d3.select("#cbShowGradeOnly")[0][0].checked;
	var exercise = evalExercise(className, exerciseSel.split('_')[0], exerciseSel.split('_')[1] == "big");
	console.log(exercise);
	d.append("p").html(className + " - " + exercise.name + " - " + exercise.date.slice(0, 10));
	var table = d.append("table");
	var tr = table.append("tr");
	var b2Groups = exercise.exercises.length == 2;
	tr.append("th").html("Name");
	if(b2Groups && !bShowGradOnly)
		tr.append("th").html("A<br>B");
	var bCol = false;
	if(!bShowGradOnly)
	{
		for(var i = 0; i < exercise.exercises[0].length; i++)
		{
			var s = exercise.exercises[0][i].name + " (" + exercise.exercises[0][i].points + ")";
			if(b2Groups)
			{
				s += "<br>" + exercise.exercises[1][i].name + " (" + exercise.exercises[1][i].points + ")";
			}
			tr.append("th").html(s);
		}
		tr.append("th").html("Σ" + " (" + exercise.maxpoints + ")");
	}
	tr.append("th").html(currentGradingType == "Note" ? "Note" : "Punkte");
	tr.append("th").html("Zurückgegeben");
	for(var i = 0; i < exercise.pupils.length; i++)
	{
		tr = table.append("tr").attr("class", bCol ? "highlight_lightgray" : "highlight_white");
		bCol = !bCol;
		tr.append("td").html(exercise.pupils[i].name);
		if(!bShowGradOnly)
		{
			if(b2Groups)
				tr.append("td").html(exercise.pupils[i].group);
			for(var j = 0; j < exercise.pupils[i].points.length; j++)
				tr.append("td").html(exercise.pupils[i].points[j]);
			tr.append("td").html(exercise.pupils[i].sum).attr("class", "alnleft_bold");
		}
		tr.append("td").html(exercise.pupils[i].grade + getTrend(exercise.pupils[i].sum, exercise.gradingKey)).attr("class", "alnleft_red");
		tr.append("td").append("button").html(exercise.pupils[i].returned ? "abgegeben" : "fehlt").attr("onclick", "updateReturnedInfo('" + className + "','" + exercise.name + "'," + (exercise.bBig ? "true" : "false") + ",'" + exercise.pupils[i].name + "'," + (exercise.pupils[i].returned ? "false" : "true") + "); showEvalExercise();");
	}
	tr = table.append("tr");
	tr.append("th").html("");
	if(b2Groups && !bShowGradOnly)
		tr.append("th").html("A<br>B");
	if(!bShowGradOnly)
	{
		for(var i = 0; i < exercise.exercises[0].length; i++)
		{
			var s = exercise.exercises[0][i].name + " (" + exercise.exercises[0][i].points + ")";
			if(b2Groups)
			{
				s += "<br>" + exercise.exercises[1][i].name + " (" + exercise.exercises[1][i].points + ")";
			}
			tr.append("th").html(s);
		}
		tr.append("th").html("Σ" + " (" + exercise.maxpoints + ")");
	}
	tr.append("th").html("");
	td = tr.append("td");
	td.append("button").html("A").attr("onclick", "setAllReturned('" + className + "','" + exercise.name + "'," + (exercise.bBig ? "true" : "false") + ",true); showEvalExercise();")
	td.append("button").html("F").attr("onclick", "setAllReturned('" + className + "','" + exercise.name + "'," + (exercise.bBig ? "true" : "false") + ",false); showEvalExercise();");;


	if(!bShowGradOnly)
	{
		for(var i = 0; i < (b2Groups ? 3 : 1); i++)
		{
			tr = table.append("tr").attr("style", "background-color: yellow");
			tr.append("td").html(b2Groups ? i == 0 ? "Durchschnitt A" : i == 1 ? "Durchschnitt B" : "Durchschnitt" : "Durchschnitt");
			if(b2Groups)
				tr.append("td").html("");
			for(var j = 0; j < exercise.pupils[i].points.length; j++)
				tr.append("td").html(Math.round(exercise.averagepoints[i][j]) + " %");
			tr.append("td").html("").attr("class", "alnleft_bold");
			tr.append("td").html("").attr("class", "alnleft_red");
		}
	}

	d.append("p").html(exercise.pupils.length + " Arbeiten, " + (currentGradingType == "Note" ? "Durchschnittsnote " : "Durchschnittspunkte ") + exercise.average + (currentGradingType == "Punkte" ? " (Note " + getAverageGradeFromPunkte(exercise.gradeDistribution) + ")" : ""));

	table =  d.append("table");
	tr = table.append("tr");
	if(currentGradingType == "Note")
	{
		for(var i = 0; i < 2; i++)
		{
			tr.append("th").html("Note");
			tr.append("th").html("Anzahl");
			tr.append("th").html("BE");
			if(i == 0)
				tr.append("th").html("");
		}
		for(var i = 0; i < 3; i++)
		{
			tr = table.append("tr");
			tr.append("td").html(i + 1);
			tr.append("td").html(exercise.gradeDistribution[i]);
			tr.append("td").html(formatGradeDistribution(exercise.gradingKey, exercise.maxpoints, i));
			tr.append("th").html("");
			tr.append("td").html(i + 4);
			tr.append("td").html(exercise.gradeDistribution[i + 3]);
			if(i < 2)
				tr.append("td").html(formatGradeDistribution(exercise.gradingKey, exercise.maxpoints, i + 3));
			else
				tr.append("td").html(formatGradeDistribution(exercise.gradingKey, exercise.maxpoints, 5));

		}
	}
	else if (currentGradingType == "Punkte")
	{
		for(var i = 0; i < 6; i++)
		{
			tr.append("th").html("Punkte");
			tr.append("th").html("Anzahl");
			tr.append("th").html("BE");
			if(i < 5)
				tr.append("th").html("");
		}

		for(var i = 0; i < 3; i++)
		{
			tr = table.append("tr");
			for(var j = 0; j < 6; j++)
			{
				if(j < 5)
				{
					tr.append("td").html(15 - i - 3 * j);
					tr.append("td").html(exercise.gradeDistribution[15 - i - 3 * j]);
					tr.append("td").html(formatGradeDistribution(exercise.gradingKey, exercise.maxpoints, 15 - i - 3 * j));
					tr.append("th").html("");
				}
				else if (i == 0)
				{
					tr.append("td").html("0");
					tr.append("td").html(exercise.gradeDistribution[0]);
					tr.append("td").html(formatGradeDistribution(exercise.gradingKey, exercise.maxpoints, 0));
				}
				else
				{
					tr.append("td").html("");
					tr.append("td").html("");
					tr.append("td").html("");
				}
			}
		}
		tr = table.append("tr")
				 for(var i = 0; i < 23; i++)
					 tr.append("td");
		tr = table.append("tr");
		for(var i = 0; i < 23; i++)
			if(i % 4 == 0)
				tr.append("td").html(i / 4 + 1);
			else if((i - 1) % 4 == 0)
				tr.append("td").html(getGradeDistributionFromPunkte(exercise.gradeDistribution)[(i - 1) / 4]);
			else
				tr.append("td").html("");

	}
}
function formatGradeDistribution(gradingKey, maxBE, index)
{
	if(currentGradingType == "Note")
	{
		if(index == 0)
			return maxBE + " - " + helpFormatGradeDistribution(gradingKey[0]);
		else if(index < 5)
			return (helpFormatGradeDistribution(gradingKey[index - 1]) - 0.5) + " - " + helpFormatGradeDistribution(gradingKey[index]);
		else
			return (helpFormatGradeDistribution(gradingKey[index - 1]) - 0.5) + " - 0";
	}
	else if (currentGradingType == "Punkte")
	{
		index = 15 - index;
		if(index == 0)
			return maxBE + " - " + helpFormatGradeDistribution(gradingKey[0]);
		else if(index < 15)
			return (helpFormatGradeDistribution(gradingKey[index - 1]) - 0.5) + " - " + helpFormatGradeDistribution(gradingKey[index]);
		else
			return (helpFormatGradeDistribution(gradingKey[index - 1]) - 0.5) + " - 0";

	}

}

function showHomeworkInfo()
{
	emptyMenu2();
	var d = emptyForm1();
	var className = getSelectedClassName();
	d.append("p").html(className);
	var data = getDetailedClassInfo(className);

	var table = d.append("table");
	var bCol = false;
	var tr = table.append("tr").attr("class", bCol ? "highlight_lightgray" : "highlight_white");
	bCol = !bCol;
	tr.append("td").html("Name");
	tr.append("td").html("heute keine HA");
	tr.append("td").html("Strichliste");

	for(var i = 0; i < data.pupils.length; i++)
	{
		tr = table.append("tr").attr("class", bCol ? "highlight_lightgray" : "highlight_white");
		bCol = !bCol;

		var hw = getHomeworkInfo(className, data.pupils[i].name);

		tr.append("td").append("a").html(data.pupils[i].name).attr("href", "#").attr("onclick", "showPupilInfo('" + data.pupils[i].name + "')");
		var td = tr.append("td");
		td.append("button").attr("onclick", "pupilAddNoHomeworkAndReload('" + className + "','" + data.pupils[i].name + "',false)").html("Strich");
		td.append("button").attr("onclick", "pupilAddNoHomeworkAndReload('" + className + "','" + data.pupils[i].name + "', true)").html("0.5 Strich");
		var s = hw.length + ": ";
		for(var j = 0; j < hw.length; j++)
			s += hw[j].date + (hw[j].half ? "'" : "|") + "   ";
		tr.append("td").html(s);
	}
}

function showMissingInfo()
{
	emptyMenu2();
	var d = emptyForm1();
	var className = getSelectedClassName();
	d.append("p").html(className);
	var data = getDetailedClassInfo(className);

	var table = d.append("table");
	var bCol = false;
	var tr = table.append("tr").attr("class", bCol ? "highlight_lightgray" : "highlight_white");
	bCol = !bCol;
	tr.append("td").html("Name");
	tr.append("td").html("fehlt heute");
	tr.append("td").html("Fehltage");

	for(var i = 0; i < data.pupils.length; i++)
	{
		tr = table.append("tr").attr("class", bCol ? "highlight_lightgray" : "highlight_white");
		bCol = !bCol;

		var miss = getMissingInfo(className, data.pupils[i].name);

		tr.append("td").append("a").html(data.pupils[i].name).attr("href", "#").attr("onclick", "showPupilInfo('" + data.pupils[i].name + "')");
		var td = tr.append("td");
		td.append("button").attr("onclick", "pupilAddMissingAndReload('" + className + "','" + data.pupils[i].name + "')").html("fehlt");
		var s = miss.length + ": ";
		for(var j = 0; j < miss.length; j++)
			s += miss[j].date  + "   ";
		tr.append("td").html(s);
	}

}

function pupilAddNoHomeworkAndReload(className, pupilName, half)
{
	pupilAddNoHomework(className, pupilName, half);
	showHomeworkInfo();
}

function pupilAddMissingAndReload(className, pupilName)
{
	pupilAddMissing(className, pupilName);
	showMissingInfo();
}
function showDetailedClassInfo()
{
	emptyMenu2();
	var d = emptyForm1();
	var className = getSelectedClassName();
	d.append("p").html(className);
	var data = getDetailedClassInfo(className);
	var oraltmp = {};
	for(var i = 0; i < data.oral.length; i++)
		if (oraltmp[data.oral[i].name] == null)
			oraltmp[data.oral[i].name] = 1;
		else
			oraltmp[data.oral[i].name]++;
	var maxoral = 0;
	for (var i in oraltmp)
		if(oraltmp[i] > maxoral)
			maxoral = oraltmp[i];
	var maxsmall = 0;
	var maxbig = 0;
	for(var i = 0; i < data.pupils.length; i++)
	{
		var pupdata = getAllGrades(className, data.pupils[i].name);
		if (pupdata.small.length > maxsmall)
			maxsmall = pupdata.small.length;
		if (pupdata.big.length > maxbig)
			maxbig = pupdata.big.length;
	}


	var table = d.append("table");
	var bCol = false;
	var tr = table.append("tr").attr("class", bCol ? "highlight_lightgray" : "highlight_white");
	bCol = !bCol;
	//var tr = table.append("tr");
	tr.append("td").html("Name");
	for(var i = 0; i < maxbig; i++)
		tr.append("td").html("SA");
	for(var i = 0; i < maxsmall; i++)
		tr.append("td").html("Ex");
	for(var i = 0; i < maxoral; i++)
		tr.append("td").html("Mdl");
	tr.append("td");
	tr.append("td").html("groß");
	tr.append("td").html("klein");
	tr.append("td").html("gesamt");
	for(var i = 0; i < data.pupils.length; i++)
	{
		tr = table.append("tr").attr("class", bCol ? "highlight_lightgray" : "highlight_white");
		bCol = !bCol;

		var pupdata = getAllGrades(className, data.pupils[i].name);

		tr.append("td").append("a").html(data.pupils[i].name).attr("href", "#").attr("onclick", "showPupilInfo('" + data.pupils[i].name + "')");
		for(var j = 0; j < maxbig; j++)
			if(j >= pupdata.big.length)
				tr.append("td");
			else
				tr.append("td").html(pupdata.big[j].grade);
		for(var j = 0; j < maxsmall; j++)
			if(j >= pupdata.small.length)
				tr.append("td");
			else
				tr.append("td").html(pupdata.small[j].grade);
		for(var j = 0; j < maxoral; j++)
			if(j >= pupdata.oral.length)
				tr.append("td");
			else
				tr.append("td").html(pupdata.oral[j].grade);
		var finalScore = getFinalScores(className, data.pupils[i].name);
		tr.append("td");
		tr.append("td").html(finalScore.big);
		tr.append("td").html(finalScore.small);
		tr.append("td").html(finalScore.end);
	}
}


function helpFormatGradeDistribution(grade)
{
	grade = parseFloat(grade);
	if(Math.floor(grade + 1) - grade > 0.5)
		return Math.floor(grade + 1) - 0.5;
	else
		return Math.floor(grade) + 1;
}
function showPupilInfo(pupilName)
{
	var m = emptyMenu2();
	var sel = m.append("select").attr("id", "selectPupilForInfo").attr("onchange", "showPupilSelectChanged()");
	var className = getSelectedClassName();
	var pupils = getPupils(className);
	for(var i = 0; i < pupils.length; i++)
		sel.append("option").html(pupils[i].name).attr("value", pupils[i].name);
	d3.select("#selectPupilForInfo")[0][0].selectedIndex = pupils.map(function (d)
	{
		return d.name;
	}).indexOf(pupilName);
	showPupilInfoPage(pupilName);
}
function showPupilSelectChanged()
{
	var sel = d3.select("#selectPupilForInfo")[0][0];
	if(sel.selectedIndex < 0)
		return;
	showPupilInfoPage(sel[sel.selectedIndex].value);
}
function showPupilInfoPage(pupilName)
{
	var className = getSelectedClassName();
	var d = emptyForm1();
	d.append("p").html(className + " - " + pupilName)
	d.append("button").attr("onclick", "jumpToOral('" + pupilName + "')").html("Mündliche Noten bearbeiten");
	var grades = getAllGrades(className, pupilName);
	var score = getFinalScores(className, pupilName);
	var table = d.append("table");
	var tr = table.append("tr");
	tr.append("th").html("Name (Faktor)");
	tr.append("th").html("Datum");
	tr.append("th").html("Note");
	for(var i = 0; i < grades.big.length; i++)
	{
		tr = table.append("tr");
		tr.append("td").html(grades.big[i].exerciseName + " (" + grades.big[i].factor + ")");
		tr.append("td").html(grades.big[i].date.slice(0, 10));
		tr.append("td").attr("class", "alnright_red").html(grades.big[i].grade);
	}
	table.append("tr").append("td").html("");
	for(var i = 0; i < grades.small.length; i++)
	{
		tr = table.append("tr");
		tr.append("td").html(grades.small[i].exerciseName + " (" + grades.small[i].factor + ")");
		tr.append("td").html(grades.small[i].date.slice(0, 10));
		tr.append("td").attr("class", "alnright_red").html(grades.small[i].grade);
	}
	table.append("tr").append("td").html("");
	for(var i = 0; i < grades.oral.length; i++)
	{
		tr = table.append("tr");
		tr.append("td").html(grades.oral[i].kind + " (" + grades.oral[i].factor + ")");
		tr.append("td").html(grades.oral[i].date.slice(0, 10));
		tr.append("td").attr("class", "alnright_red").html(grades.oral[i].grade);
	}
	table.append("tr").append("td").html("");
	tr = table.append("tr");
	tr.append("td").html("Schnitt klein");
	tr.append("td").html("");
	tr.append("td").html(score.small).attr("class", "alnright_red");
	tr = table.append("tr");
	tr.append("td").html("Schnitt groß");
	tr.append("td").html("");
	tr.append("td").html(score.big).attr("class", "alnright_red");
	tr = table.append("tr");
	tr.append("td").html("Endnote");
	tr.append("td").html("");
	tr.append("td").html(score.end).attr("class", "alnright_red");

	var data = getDetailedClassInfo(className);
	var hw = getHomeworkInfo(className, pupilName);

	var s = "vergessene Hausaufgaben: " + hw.length + " mal: ";
	for(var j = 0; j < hw.length; j++)
		s += hw[j].date + (hw[j].half ? "'" : "|") + "   ";
	d.append("div").html(s);
	var missing = getMissingInfo(className, pupilName);
	s = "Fehltage: " + missing.length + ": ";
	for(var j = 0; j < missing.length; j++)
		s += missing[j].date + ", ";
	d.append("div").html(s);

	s = "Fehlende Leistungsnachweise: ";
	var missingtests = getMissingTestsFromPupilName(className, pupilName);
	for(var j = 0; j < missingtests.length; j++)
		s += missingtests[j].exercisename + " ";
	d.append("div").html(s);

	d.append("textarea").attr("rows", 4).attr("cols", 50).attr("id", "pupilnote").attr("onkeyup", "updateNoteNoReload('" + className + "','" + pupilName + "')").html(getPupilNote(className, pupilName));

}

function updateNoteNoReload(className, pupilName)
{
	updateNote(className, pupilName, d3.select("#pupilnote")[0][0].value);
}

function updateNoteClassInfo(className, pupilName)
{
	updateNote(className, pupilName, d3.select("#classnote")[0][0].value);
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
}
function restoreDefaultGradingKey()
{
	d3.select("#exerciseGradingKey")[0][0].value = getGeneratedGradingKey(getCurrentExerciseMaxPoints());
	currentExercise.gradingKey = d3.select("#exerciseGradingKey")[0][0].value.split(",");
	updateSumAndGrade();
}
function restoreDefaultLinearGradingKey()
{
	d3.select("#exerciseGradingKey")[0][0].value = getGeneratedLinearGradingKey(getCurrentExerciseMaxPoints());
	currentExercise.gradingKey = d3.select("#exerciseGradingKey")[0][0].value.split(",");
	updateSumAndGrade();
}
function getCurrentExerciseMaxPoints()
{
	var maxpoints = 0;
	for(var k = 0; k < currentExercise.groups[0].exercises.length; k++)
		maxpoints += parseFloat("0" + currentExercise.groups[0].exercises[k].points);
	return maxpoints;
}
function getCurrentGradingType(className)
{
	return theData[className].gradeType;
}
function applyNewGradingKey()
{
	currentExercise.gradingKey = d3.select("#exerciseGradingKey")[0][0].value.split(",");
	updateSumAndGrade();
}
function saveExistingTestAndJumpToEval()
{
	saveExistingTest();
	showClassInfoAndJumpToEval(currentExercise.name);
}
function saveExistingTest()
{
	var nrOfGroups = currentExercise.groups.length;
	var pupils = [];
	pupils.push(currentExercise.groups[0].pupils);
	if(nrOfGroups == 2)
		pupils.push(currentExercise.groups[1].pupils);
	for(var i = 0; i < nrOfGroups; i++)
		for(var j = 0; j < pupils[i].length; j++)
		{
			var points = [];
			var bFinished = true;
			var sum = 0;
			for(var k = 0; k < pupils[i][j].points.length; k++)
			{
				var s = d3.select("#p_exercisePupil_" + i + "_" + j).select("#subtask_" + k)[0][0].value;
				if(s == "-" || s == "")
				{
					points.push("-");
					bFinished = false;
				}
				else
				{
					var point = parseFloat("0" + s.replace(',', '.'));
					sum += point;
					points.push(point);
				}
			}
			currentExercise.groups[i].pupils[j].points = points;
			currentExercise.groups[i].pupils[j].sum = sum;
			if(bFinished)
				currentExercise.groups[i].pupils[j].grade = getGrade(sum, currentExercise.gradingKey);
			else
				currentExercise.groups[i].pupils[j].grade = "-";
		}
	//showClassInfoAndJumpToEval(currentExercise.name);
}

var currentExercise, currentGradingType;
function showExistingTest(className, exerciseName, bigExercise)
{
	var m2 = emptyMenu2();
	currentGradingType = getCurrentGradingType(className);
	currentExercise = getExerciseData(className, exerciseName, bigExercise);
	m2.append("button").attr("onclick", "saveExistingTestAndJumpToEval()").html("Punkte übernehmen für " + currentExercise.name + " vom " + currentExercise.date.slice(0, 10));
	var d = emptyForm1();
	var nrOfGroups = currentExercise.groups.length;
	var pupils = [];
	pupils.push(currentExercise.groups[0].pupils);
	if(nrOfGroups == 2)
		pupils.push(currentExercise.groups[1].pupils);
	var sGradingKey = currentExercise.gradingKey.join(",");
	d.append("p");
	d.append("input").attr("id", "exerciseGradingKey").attr("value", sGradingKey);
	d.append("button").attr("onclick", "restoreDefaultGradingKey()").html("Bewertungsschlüssel generieren");
	d.append("button").attr("onclick", "restoreDefaultLinearGradingKey()").html("Linearen Bewertungsschlüssel generieren");
	d.append("button").attr("onclick", "applyNewGradingKey()").html("Bewertungsschlüssel übernehmen");
	for(var i = 0; i < nrOfGroups; i++)
	{
		d.append("p").html("Gruppe " + (i == 0 ? "A" : "B"));
		var p = d.append("p").attr("id", "p_exercisePupil_demo");
		p.append("input").attr("value", "Aufgabe (max. Punkte)").attr("disabled", "disabled");
		for(var k = 0; k < currentExercise.groups[i].exercises.length; k++)
			p.append("input").attr("value", currentExercise.groups[i].exercises[k].name + "(" + currentExercise.groups[i].exercises[k].points + ")").attr("size", 4).attr("id", "subtast_" + k).attr("disabled", "disabled");
		var maxpoints = getCurrentExerciseMaxPoints();
		p.append("input").attr("size", 5).attr("id", "sum").attr("disabled", "disabled").attr("value", "Σ " + maxpoints);
		p.append("input").attr("size", 4).attr("id", "grade").attr("disabled", "disabled").attr("value", "Note");
		for(var j = 0; j < pupils[i].length; j++)
		{
			p = d.append("p").attr("id", "p_exercisePupil_" + i + "_" + j);
			p.append("input").attr("value", pupils[i][j].name).attr("disabled", "disabled");
			for(var k = 0; k < pupils[i][j].points.length; k++)
				p.append("input").attr("placeholder", currentExercise.groups[i].exercises[k].name).attr("value", pupils[i][j].points[k]).attr("size", 4).attr("id", "subtask_" + k).attr("onkeyup", "updateSumAndGrade()");
			p.append("input").attr("placeholder", "Summe").attr("size", 5).attr("id", "sum").attr("disabled", "disabled");
			p.append("input").attr("placeholder", "Note").attr("size", 4).attr("id", "grade").attr("disabled", "disabled");
		}
	}
	updateSumAndGrade();
}

function updateSumAndGrade()
{
	var nrOfGroups = currentExercise.groups.length;
	var pupils = [];
	pupils.push(currentExercise.groups[0].pupils);
	if(nrOfGroups == 2)
		pupils.push(currentExercise.groups[1].pupils);
	for(var i = 0; i < nrOfGroups; i++)
		for(var j = 0; j < pupils[i].length; j++)
		{
			var sum = 0;
			var p = d3.select("#p_exersicePupil_" + i + "_" + j)[0][0];
			var bFinished = true;
			for(var k = 0; k < currentExercise.groups[i].exercises.length; k++)
			{
				var s = d3.select("#p_exercisePupil_" + i + "_" + j).select("#subtask_" + k)[0][0].value;
				sum += parseFloat("0" + s.replace(',', '.'));
				if(s == "" || s == "-")
					bFinished = false;
			}
			d3.select("#p_exercisePupil_" + i + "_" + j).select("#sum").attr("value", sum);
			if(bFinished)
				d3.select("#p_exercisePupil_" + i + "_" + j).select("#grade").attr("value", getGrade(sum, currentExercise.gradingKey));
			else
				d3.select("#p_exercisePupil_" + i + "_" + j).select("#grade").attr("value", "-");
		}
	saveExistingTest();
}
function getTrend(sum, gradingKey)
{
	var grade = getGrade(sum, gradingKey);
	if(grade > getGrade(sum + 0.5, gradingKey))
		return " +";
	if(grade < getGrade(sum - 0.5, gradingKey))
		return " —";
	return "";

}

function getGrade(sum, gradingKey)
{
	if(currentGradingType == "Note")
	{
		for(var i = 0; i < 5; i++)
			if(sum > gradingKey[i])
				return i + 1;
		return 6;
	}
	else if (currentGradingType == "Punkte")
	{
		for(var i = 14; i >= 0; i--)
			if(sum > gradingKey[14 - i])
				return i + 1;
		return 0;
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

function generateNewGradingKey(bAbi)
{
	var maxpoints = 0;
	for(var i = 0; i < maxexercises; i++)
		maxpoints += parseFloat("0" + d3.select("#exercisePoints_" + i + "_A")[0][0].value); //0+string to prevent NaN parsing error
	currentGradingType = getCurrentGradingType(getSelectedClassName());
	if(bAbi)
		d3.select("#exerciseGradingKey")[0][0].value = getGeneratedGradingKey(maxpoints);
	else
		d3.select("#exerciseGradingKey")[0][0].value = getGeneratedLinearGradingKey(maxpoints);
}
function getGeneratedGradingKey(maxpoints)
{
	if(currentGradingType == "Note")
	{
		var points = "";
		points += Math.round(maxpoints * 8.5 * 2, 0) / 20 + ",";
		points += Math.round(maxpoints * 7 * 2, 0) / 20 + ",";
		points += Math.round(maxpoints * 5.5 * 2, 0) / 20 + ",";
		points += Math.round(maxpoints * 4 * 2, 0) / 20 + ",";
		points += Math.round(maxpoints * 2 * 2, 0) / 20 + "";
		return points;
	}
	else if (currentGradingType == "Punkte")
	{
		var points = "";
		points += Math.round(maxpoints * 9.5 * 2, 0) / 20 + ",";
		points += Math.round(maxpoints * 9 * 2, 0) / 20 + ",";
		points += Math.round(maxpoints * 8.5 * 2, 0) / 20 + ",";
		points += Math.round(maxpoints * 8 * 2, 0) / 20 + ",";
		points += Math.round(maxpoints * 7.5 * 2, 0) / 20 + ",";
		points += Math.round(maxpoints * 7 * 2, 0) / 20 + ",";
		points += Math.round(maxpoints * 6.5 * 2, 0) / 20 + ",";
		points += Math.round(maxpoints * 6 * 2, 0) / 20 + ",";
		points += Math.round(maxpoints * 5.5 * 2, 0) / 20 + ",";
		points += Math.round(maxpoints * 5 * 2, 0) / 20 + ",";
		points += Math.round(maxpoints * 4.5 * 2, 0) / 20 + ",";
		points += Math.round(maxpoints * 4 * 2, 0) / 20 + ",";
		points += Math.round(maxpoints * 3.33 * 2, 0) / 20 + ",";
		points += Math.round(maxpoints * 2.66 * 2, 0) / 20 + ",";
		points += Math.round(maxpoints * 2 * 2, 0) / 20 + "";
		return points;
	}
}
function getGeneratedLinearGradingKey(maxpoints)
{
	if(currentGradingType == "Note")
	{
		var points = "";
		points += Math.round(maxpoints * 50 / 6 * 2, 0) / 20 + ",";
		points += Math.round(maxpoints * 40 / 6 * 2, 0) / 20 + ",";
		points += Math.round(maxpoints * 30 / 6 * 2, 0) / 20 + ",";
		points += Math.round(maxpoints * 20 / 6 * 2, 0) / 20 + ",";
		points += Math.round(maxpoints * 10 / 6 * 2, 0) / 20 + "";
		return points;
	}
	else if (currentGradingType == "Punkte")
	{
		var points = "";
		points += Math.round(maxpoints * 150 / 16 * 2, 0) / 20 + ",";
		points += Math.round(maxpoints * 140 / 16 * 2, 0) / 20 + ",";
		points += Math.round(maxpoints * 130 / 16 * 2, 0) / 20 + ",";
		points += Math.round(maxpoints * 120 / 16 * 2, 0) / 20 + ",";
		points += Math.round(maxpoints * 110 / 16 * 2, 0) / 20 + ",";
		points += Math.round(maxpoints * 100 / 16 * 2, 0) / 20 + ",";
		points += Math.round(maxpoints * 90 / 16 * 2, 0) / 20 + ",";
		points += Math.round(maxpoints * 80 / 16 * 2, 0) / 20 + ",";
		points += Math.round(maxpoints * 70 / 16 * 2, 0) / 20 + ",";
		points += Math.round(maxpoints * 60 / 16 * 2, 0) / 20 + ",";
		points += Math.round(maxpoints * 50 / 16 * 2, 0) / 20 + ",";
		points += Math.round(maxpoints * 40 / 16 * 2, 0) / 20 + ",";
		points += Math.round(maxpoints * 30 / 16 * 2, 0) / 20 + ",";
		points += Math.round(maxpoints * 20 / 16 * 2, 0) / 20 + ",";
		points += Math.round(maxpoints * 10 / 16 * 2, 0) / 20 + "";
		return points;
	}
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
	p.append("button").attr("id", "exerciseGenerateGradingKey").attr("onclick", "generateNewGradingKey(true)").html("Bewertungsschlüssel (abitur)  erstellen");
	p.append("button").attr("id", "exerciseGenerateGradingKey").attr("onclick", "generateNewGradingKey(false)").html("Bewertungsschlüssel (linear) erstellen");
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
		var pup = {name: d3.select("#exercisePupilGroup_" + j).select("#exercisePupilName")[0][0].innerHTML, points: getEmptyPointArray(getNrOfExercises()), sum: 0, grade: "-", returned: false};
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
			var subtaskName = d3.select("#exerciseName_" + j + "_" + (i == 0 ? "A" : "B"))[0][0].value;
			if(subtaskName == "")
				continue;
			theExercises.push({name: subtaskName, points: parseFloat("0" + d3.select("#exercisePoints_" + j + "_" + (i == 0 ? "A" : "B"))[0][0].value)});
		}
		groups.push({name: i == 0 ? "A" : "B", exercises : theExercises, pupils : (i == 0 ? pupilsA : pupilsB)});
	}
	addExercise(getSelectedClassName(), bigExercise ? "big" : "small", exerciseName, d.toISOString(), parseFloat("0" + d3.select("#exerciseFactor")[0][0].value.replace(',', '.')), d3.select("#exerciseGradingKey")[0][0].value.split(','), groups);
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
	m2.append("select").attr("id", "selectPupilForOralGrades").attr("onchange", "showOralGrades()").selectAll("option").data(getPupils(className)).enter().append("option").attr("value", function(d)
	{
		return d.name;
	}).html(function(d)
	{
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
			i++;
			continue;
		}
		var d = new Date(p.select("#date")[0][0].value);
		grades.push({name: pupil, grade: parseFloat("0" + p.select("#grade")[0][0].value), factor: parseFloat("0" + p.select("#factor")[0][0].value.replace(',', '.')), kind: p.select("#kind")[0][0].value, date: d.toISOString()});
		i++;
	}
	updateOralGrades(getSelectedClassName(), pupil, grades);
	showClassInfoAndJumpToOral(pupil);

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
	p.append("input").attr("placeHolder", "Datum").attr("id", "date").attr("value", getCurrentDate());
	p.append("input").attr("placeHolder", "Art").attr("id", "kind").attr("value", "Mdl");
	p.append("input").attr("placeHolder", "Faktor").attr("id", "factor").attr("value", "1");
	p.append("input").attr("placeHolder", "Note").attr("id", "grade").attr("style", "color:#FF0000;text-align:center;");
}
function maintenance()
{
	var d = emptyMenu2();
	d.append("button").html("Klasse hinzufügen").attr("onclick", "addClassMenu()");
	d.append("button").html("Schüler bearbeiten").attr("onclick", "addPupilMenu()");
	d.append("button").html("Klasse klonen").attr("onclick", "cloneClass()");
	emptyForm1();
}
var newclass;
var oldclass;
function cloneClass()
{
	oldclass = getSelectedClassName();
	addClassMenu();
	d3.select("#className").attr("value", oldclass + "_2");
	d3.select("#gradeRatio").attr("value", theData[oldclass].gradeRatio);
	d3.select("#gradeTypeCB").property('checked', theData[oldclass].gradeType == "Punkte");
	d3.select("#addclassbutton").attr("onclick", "addCloneClass()");
}
function addClassMenu()
{
	var d = emptyForm1();
	d.append("input").attr("placeholder", "name").attr("id", "className");
	d.append("input").attr("placeholder", "Schlüssel 2_1 oder 1_1").attr("id", "gradeRatio");
	d.append("label").html("Punke");
	d.append("input").attr("type", "checkbox").attr("id", "gradeTypeCB");
	d.append("button").attr("onclick", "addClass()").html("Klasse anlegen").attr("id", "addclassbutton"); //is changed when cloning a class
	d.append("button").attr("onclick", "abortForm()").html("Abbrechen");
}
function addPupilMenu()
{
	var sel = d3.select("#selectClass")[0][0];
	if(sel.selectedIndex < 0)
		return;
	var className = sel[sel.selectedIndex].value;
	var d = emptyForm1();
	d.append("p").html("Am Ende unbedingt doppelte Leerzeichen in json löschen (sonst kein Springen zu mündlichen Noten möglich) :%s/__/_g");
	var pup = getPupils(className);
	for(var i = 0; i < maxpupils; i++)
	{
		var line = d.append("p");
		if(i < pup.length)
		{
			line.append("input").attr("placeholder", "name").attr("id", "pupilName_" + i).attr("value", pup[i].name);
			line.append("input").attr("type", "checkbox").attr("id", "pupilMale_" + i).property('checked', pup[i].male);
		}
		else
		{
			line.append("input").attr("placeholder", "name").attr("id", "pupilName_" + i);
			line.append("input").attr("type", "checkbox").attr("id", "pupilMale_" + i).property('checked', false);
		}
		line.append("label").html("männlich");
	}
	var m = emptyMenu2();
	m.append("button").attr("onclick", "updatePupilsFromForm('" + className + "')").html("Änderungen übernehmen");
	m.append("textarea").attr("rows", 4).attr("cols", 50).attr("id", "pupilpaste");
	m.append("button").attr("onclick", "parsePupils()").html("Daten parsen");
}
function parsePupils()
{
	var pup_tmp = d3.select("#pupilpaste")[0][0].value.split("\n");
	for(var i = 0; i < pup_tmp.length; i++)
		d3.select("#pupilName_" + i).attr("value", pup_tmp[i].replace("\t", " "));
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
	newclass = name; // for cloning
	if(theData[name] != null)
	{
		alert("Klasse schon vorhanden");
		return;
	}
	var gradeRatio = d3.select("#gradeRatio")[0][0].value;
	addNewClass(name, gradeRatio, d3.select("#gradeTypeCB")[0][0].checked ? "Punkte" : "Note");
	if(name == "")
		return;
	emptyForm1();
	drawMainMenu();
}
function addCloneClass()
{
	addClass();
	var newPupils = [];
	for(var i = 0; i < theData[oldclass].pupils.length; i++)
	{
		var pupilName = theData[oldclass].pupils[i].name;
		var pupilMale = theData[oldclass].pupils[i].male;
		newPupils.push({name: pupilName, male: pupilMale});
	}
	updatePupils(newclass, newPupils);
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

