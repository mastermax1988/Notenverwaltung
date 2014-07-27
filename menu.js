//code for generating the menus
function drawMainMenu()
{
  var d=d3.select("[id=menu1]");
  d.selectAll("*").remove();
  d.append("button").attr("onclick","saveData()").html("Speichern");
  d.append("button").attr("onclick","maintenance()").html("Wartung");
  var d2=emptyForm1();
  d2.append("select").attr("id","selectClass").selectAll("option").data(getClasses(),function(p){return p;}).enter().append("option").attr("value",function(d){return d;}).html(function(d){return d;});
  console.log(getClasses());
}
function maintenance()
{
  var d=emptyMenu2();
  d.append("button").html("Klasse hinzufügen").attr("onclick","addClassMenu()");
  d.append("button").html("Schüler hinzufügen").attr("onclick","addPupilMenu()");
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
  d.append("button").attr("onclick","abordForm()").html("Abbrechen");
}
function addPupilMenu()
{
  var sel=d3.select("#selectClass")[0][0];
  var className=sel[sel.selectedIndex].value;
  var d=emptyForm1();
  var pup=getPupils(className);
  for(i=0;i<35;i++)
  {
    var line=d.append("p");
    if(i<pup.length)
    {
      line.append("input").attr("placeholder","name").attr("id",i).attr("value",pup[i].name)
      line.append("input").attr("type", "checkbox").attr("id",i).property('checked', pup[i].male);
    }
    else
    {
      line.append("input").attr("placeholder","name").attr("id",i)
      line.append("input").attr("type", "checkbox").attr("id",i).property('checked', false);
    }
    line.append("label").html("männlich")
  }

}
function abordForm()
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
