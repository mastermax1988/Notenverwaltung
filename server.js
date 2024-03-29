var ws;

connect();

bServer=false;
TOKEN="";
function connect()
{
  ws = new WebSocket("ws://127.0.0.1:51860/");
  ws.onopen = () => {
    ws.send(TOKEN);
  }
  ws.onmessage = (event) =>
      {
        theData = JSON.parse(event.data);
        bServer = true;
        drawMainMenu();
      };
}

function reconnect()
{
  ws.close()
  connect();
}

function changeToken(){
  var t = document.getElementById("token");
  if(t!=null && t.value != ""){
    TOKEN = t.value;
  }
}

function loadFromServer()
{
  if(ws.readyState==1)
  {
    ws.send("load"); 
  }
  else
  {
    reconnect();
  }
}

function saveToServer()
{
  if(ws.readyState==1)
  {
    ws.send(JSON.stringify(theData, undefined, 2));
    console.log("saved to server");
    flashInfo("Gespeichert");
    d3.select("#menu1")[0][0].style.background="lightgreen";
  }
  else
  {
    //alert("Verbindung zum Server fehlgeschlagen. Versuche Verbindung wiederherzustellen.\nreadyState:" +  ws.readyState);
    reconnect();
    d3.select("#menu1")[0][0].style.background="orangered";
    flashInfo("Verbindung fehlgeschlagen!");
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function flashInfo(s) {
  var infolabel = d3.select("#flashinfolabel")[0][0];
  infolabel.innerHTML=s; 
  await sleep(5000);
  infolabel.innerHTML="";
}

