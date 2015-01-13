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
  selp.append("button").attr("onclick", "showEvalExercise()").html("Auswertung anzeigen");
  selp.append("input").attr("type", "checkbox").attr("id", "cbShowGradeOnly").attr("onchange", "showEvalExercise()");
  selp.append("label").html("Zeige nur Noten");
  d.append("p").html(className);
  var table = d.append("table");
  table.append("th").html("Name");
  table.append("th").html("");
  table.append("th").html("kl.");
  table.append("th").html("gr.");
  table.append("th").html("Endnote");
  table.append("th").html("Anzahl mdl.");
  var bCol = false;
  for(var i = 0; i < pupils.length; i++)
  {
    var tr = table.append("tr").attr("style", bCol ? "background-color: lightgray" : "background-color: white");
    bCol = !bCol;
    //	tr.append("td").html(pupils[i].name);
    tr.append("td").append("a").html(pupils[i].name).attr("href", "#").attr("onclick", "showPupilInfo('" + pupils[i].name + "')");
    tr.append("td").html(pupils[i].male ? "m" : "w");
    var scores = getFinalScores(className, pupils[i].name);
    tr.append("td").attr("class", "alnright").html(scores.small);
    tr.append("td").attr("class", "alnright").html(scores.big);
    tr.append("td").attr("class", "alnright").html(scores.end);
    var grades = getAllGrades(className, pupils[i].name);
    tr.append("td").html(grades.small.length + grades.oral.length).attr("class", "alnright");
  }
}
function showEvalExercise()
{
  var d = emptyForm1();
  var className = getSelectedClassName();
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
  tr.append("th").html("Note");
  for(var i = 0; i < exercise.pupils.length; i++)
  {
    tr = table.append("tr").attr("style", bCol ? "background-color: lightgray" : "background-color: white");
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
  }
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
    d.append("p").html(exercise.pupils.length + " Arbeiten, Durchschnittsnote " + exercise.average);
  
  table =  d.append("table");
  tr = table.append("tr");
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
function formatGradeDistribution(gradingKey, maxBE, index)
{
  if(index == 0)
    return maxBE + " - " + helpFormatGradeDistribution(gradingKey[0]);
  else if(index < 5)
    return (helpFormatGradeDistribution(gradingKey[index - 1]) - 0.5) + " - " + helpFormatGradeDistribution(gradingKey[index]);
  else
    return (helpFormatGradeDistribution(gradingKey[index-1]) - 0.5) + " - 0";
}
function helpFormatGradeDistribution(grade)
{
  grade=parseFloat(grade);
  if(Math.floor(grade + 1) - grade > 0.5)
    return Math.floor(grade + 1) - 0.5;
  else
    return Math.floor(grade)+1;
}
function showPupilInfo(pupilName)
{
  var m = emptyMenu2();
  var sel = m.append("select").attr("id", "selectPupilForInfo").attr("onchange", "showPupilSelectChanged()");
  var className = getSelectedClassName();
  var pupils = getPupils(className);
  for(var i = 0; i < pupils.length; i++)
    sel.append("option").html(pupils[i].name).attr("value", pupils[i].name);
  d3.select("#selectPupilForInfo")[0][0].selectedIndex = pupils.map(function (d) {
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
  updateSumAndGrade();
}
function restoreDefaultLinearGradingKey()
{
  d3.select("#exerciseGradingKey")[0][0].value = getGeneratedLinearGradingKey(getCurrentExerciseMaxPoints());
  updateSumAndGrade();
}
function getCurrentExerciseMaxPoints()
{
  var maxpoints = 0;
  for(var k = 0; k < currentExercise.groups[0].exercises.length; k++)
    maxpoints += parseFloat("0" + currentExercise.groups[0].exercises[k].points);
  return maxpoints;
}
function applyNewGradingKey()
{
  currentExercise.gradingKey = d3.select("#exerciseGradingKey")[0][0].value.split(",");
  updateSumAndGrade();
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
  showClassInfoAndJumpToEval(currentExercise.name);
}

var currentExercise;
function showExistingTest(className, exerciseName, bigExercise)
{
  var m2 = emptyMenu2();
  currentExercise = getExerciseData(className, exerciseName, bigExercise);
  m2.append("button").attr("onclick", "saveExistingTest()").html("Punkte übernehmen für " + currentExercise.name + " vom " + currentExercise.date.slice(0, 10));
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
        p.append("input").attr("placeholder", currentExercise.groups[i].exercises[k].name).attr("value", pupils[i][j].points[k]).attr("size", 4).attr("id", "subtask_" + k).attr("onchange", "updateSumAndGrade()");
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

}
function getTrend(sum, gradingKey)
{
  var grade = getGrade(sum, gradingKey);
  if(grade > getGrade(sum + 1, gradingKey))
    return " +";
  if(grade < getGrade(sum - 1, gradingKey))
    return " —";
  return "";

}

function getGrade(sum, gradingKey)
{
  for(var i = 0; i < 5; i++)
    if(sum > gradingKey[i])
      return i + 1;
  return 6;
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

function generateNewGradingKey()
{
  var maxpoints = 0;
  for(var i = 0; i < maxexercises; i++)
    maxpoints += parseFloat("0" + d3.select("#exercisePoints_" + i + "_A")[0][0].value); //0+string to prevent NaN parsing error
  d3.select("#exerciseGradingKey")[0][0].value = getGeneratedGradingKey(maxpoints);
}
function getGeneratedGradingKey(maxpoints)
{
  var points = "";
  points += Math.round(maxpoints * 8.5 * 2, 0) / 20 + ",";
  points += Math.round(maxpoints * 7 * 2, 0) / 20 + ",";
  points += Math.round(maxpoints * 5.5 * 2, 0) / 20 + ",";
  points += Math.round(maxpoints * 4 * 2, 0) / 20 + ",";
  points += Math.round(maxpoints * 2 * 2, 0) / 20 + "";
  return points;
}
function getGeneratedLinearGradingKey(maxpoints)
{
  var points = "";
  points += Math.round(maxpoints * 50 / 6 * 2, 0) / 20 + ",";
  points += Math.round(maxpoints * 40 / 6 * 2, 0) / 20 + ",";
  points += Math.round(maxpoints * 30 / 6 * 2, 0) / 20 + ",";
  points += Math.round(maxpoints * 20 / 6 * 2, 0) / 20 + ",";
  points += Math.round(maxpoints * 10 / 6 * 2, 0) / 20 + "";
  return points;
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
  p.append("button").attr("id", "exerciseGenerateGradingKey").attr("onclick", "generateNewGradingKey()").html("Bewertungsschlüssel erstellen");
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
    var pup = {name: d3.select("#exercisePupilGroup_" + j).select("#exercisePupilName")[0][0].innerHTML, points: getEmptyPointArray(getNrOfExercises()), sum: 0, grade: "-"};
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
      i++;
      continue;
    }
    var d = new Date(p.select("#date")[0][0].value);
    grades.push({name: pupil, grade: parseFloat("0" + p.select("#grade")[0][0].value), factor: parseFloat("0" + p.select("#factor")[0][0].value.replace(',', '.')), kind: p.select("#kind")[0][0].value, date: d.toISOString()});
    i++;
  }
  updateOralGrades(getSelectedClassName(), pupil, grades);
  showClassInfo();
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
  d.append("input").attr("placeholder", "Schlüssel 2_1 oder 1_1").attr("id", "gradeRatio");
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
  var gradeRatio = d3.select("#gradeRatio")[0][0].value;
  if(name == "")
    return;
  emptyForm1();
  addNewClass(name, gradeRatio);
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

