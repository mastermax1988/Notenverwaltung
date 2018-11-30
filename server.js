var ws;

connect();

bServer=false;
function connect()
{
  ws = new WebSocket("ws://127.0.0.1:5678/");
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

function loadFromServer()
{
  if(ws.readyState==1)
  {
    ws.send("load"); 
  }
  else
    alert("Verbindung zum Server fehlgeschlagen.\nreadyState:" +  ws.readyState);
}

function saveToServer()
{
  if(ws.readyState==1)
  {
    ws.send(JSON.stringify(theData, undefined, 2));
    console.log("saved to server");
    flashInfo("Gespeichert");
  }
  else
  {
    alert("Verbindung zum Server fehlgeschlagen. Versuche Verbindung wiederherzustellen.\nreadyState:" +  ws.readyState);
    reconnect();
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

