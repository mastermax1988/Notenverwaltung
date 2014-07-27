//code for generating the menus
function drawMainMenu()
{
  var d=d3.select("[id=menu1]");
  d.selectAll("*").remove();
  d.append("button").attr("onclick","saveData()").html("Speichern");
  d.append("button").attr("onclick","maintenance()").html("Wartung");
}
function maintenance()
{
  clearMenu();
  var d=d3.select("[id=menu2]");
  d.append("button").html("Klasse hinzufügen").attr("onlick","addClassMenu()");
  d.append("button").html("Schüler hinzufügen").attr("onclick","addPupilMenu()");
}

function clearMenu()
{
  d3.select("[id=menu2]").select("*").remove();
}
