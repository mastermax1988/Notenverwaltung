theData=null;
function loadData(file)
{
  var r=new FileReader();
  r.onload=(function(f) {return function(e){parseFile(e.target.result);}})(file[0]);
  r.readAsText(file[0]);//asynchron reading
}

function saveData()
{
  if(theData==null)
  {
    alert("No Data loaded");
    return;
  }
  var d=new Date();
  var filename="noten_"+d.toISOString()+".json";
  var data=JSON.stringify(theData, undefined, 2);
  var s = d3.select("body").append("a").html("download").attr("href",'data:application/octet-stream;charset=utf-8,' + encodeURIComponent(data)).attr("download",filename).attr("id","downloadlink");
  s[0][0].click();
  s.remove();
}

function parseFile(s)
{
  theData=JSON.parse(s);
}
