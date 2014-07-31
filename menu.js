//code for generating the menus
var maxpupils=35;
function drawMainMenu()
{
  var d=d3.select("[id=menu1]");
  d.selectAll("*").remove();
  d.append("label").html("Klasse: ");
  d.append("select").attr("id","selectClass").selectAll("option").data(getClasses(),function(p){return p;}).enter().append("option").attr("value",function(d){return d;}).html(function(d){return d;});
  d.append("button").attr("onclick","saveData()").html("Speichern");
  d.append("button").attr("onclick","maintenance()").html("Wartung");
  console.log(getClasses());
  showClassInfo();
}
function showClassInfo()
{
  var sel=d3.select("#selectClass")[0][0];
  if(sel.selectedIndex<0)
    return;
  var className=sel[sel.selectedIndex].value;
  var pupils=getPupils(className);
  var d=emptyForm1();
  d.append("button").attr("onclick","editOral('"+sel+"')").html("Mündliche Noten");
  var selSmall=d.append("select").attr("id","selectSmall").attr("size",1);
  selSmall.append("option").attr("value","new").html("Neuer kleiner Leistungsnachweis");
  selSmall.selectAll("option").data(getSmall(className),function(d){return d;}).enter().append("option").attr("value",function(d){return d.date;}).html(function(d){return d.date;});
  d.append("select").attr("id","selectBig").append("option").attr("value","new").html("Neuer großer Leistungsnachweis");
  d.select("#selectBig").selectAll("option").data(getBig(className)).enter().append("option").attr("value",function(d){return d.date;}).html(function(d){return d.date;});
  d.selectAll("p").data(pupils).enter().append("p").html(function(d){return d.name + " (" + (d.male?"m":"w")+")";});

}
function maintenance()
{ 
  var d=emptyMenu2();
  d.append("button").html("Klasse hinzufügen").attr("onclick","addClassMenu()");
  d.append("button").html("Schüler bearbeiten").attr("onclick","addPupilMenu()");
}
function menuEnabled(b)
{
  if(!b)
    d3.selectAll("[kind=menu]").selectAll("button").attr("disabled","disabled");
  else
    d3.selectAll("[kind=menu]").selectAll("button").attr("disabled",null);
}
function addClassMenu()
{
  menuEnabled(false);
  var d=emptyForm1();
  d.append("input").attr("placeholder","name").attr("id","className");
  d.append("button").attr("onclick","addClass()").html("Klasse anlegen");
  d.append("button").attr("onclick","abortForm()").html("Abbrechen");
}
function addPupilMenu()
{
  var sel=d3.select("#selectClass")[0][0];
  if(sel.selectedIndex<0)
    return;
  var className=sel[sel.selectedIndex].value;
  var d=emptyForm1();
  var pup=getPupils(className);
  for(i=0;i<maxpupils;i++)
  {
    var line=d.append("p");
    if(i<pup.length)
    {
      line.append("input").attr("placeholder","name").attr("id","pupilName_"+i).attr("value",pup[i].name)
        line.append("input").attr("type", "checkbox").attr("id","pupilMale_"+i).property('checked', pup[i].male);
    }
    else
    {
      line.append("input").attr("placeholder","name").attr("id","pupilName_"+i);
      line.append("input").attr("type", "checkbox").attr("id","pupilMale_"+i).property('checked', false)
    }
    line.append("label").html("männlich")
  }
  var m=emptyMenu2();
  m.append("button").attr("onclick","updatePupilsFromForm('"+className+"')").html("Änderungen übernehmen");
}
function updatePupilsFromForm(className)
{
  var newPupils=[];
  for(i=0;i<maxpupils;i++)
  {
    var pupilName=d3.select("#pupilName_"+i)[0][0].value;
    var pupilMale=d3.select("#pupilMale_"+i)[0][0].checked;
    if(pupilName=="")
      continue;
    console.log(pupilName);
    newPupils.push({name:capitaliseFirstLetter(pupilName), male:pupilMale});
  }
  updatePupils(className,newPupils);
  drawMainMenu();
}

function abortForm()
{
  emptyForm1();
  menuEnabled(true);
}
function addClass()
{
  var name=d3.select("[id=className]")[0][0].value;
  if(name=="")
    return;
  menuEnabled(true);
  emptyForm1();
  addNewClass(name);
  drawMainMenu();
}
function emptyForm1()
{
  var d=d3.select("[id=form1]");
  d.selectAll("*").remove()
    return d;
}
function emptyMenu2()
{
  var d= d3.select("[id=menu2]");
  d.selectAll("*").remove();
  return d;
}
