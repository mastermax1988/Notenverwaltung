var canvas;
var ctx;
var canvasWidth=300;
var canvasHeight=300;
var mStatus=0;//0: m up, 1: m down
var dragIndex=-1;
function clearCanvas()
{
  ctx.clearRect(0,0,canvasWidth, canvasHeight);
}

function updateCanvas()
{
  clearCanvas();
  var sp=theData[getSelectedClassName()].sp;
  for(var i=0;i<sp.length;i++)
    ctx.fillText(sp[i].dname,sp[i].x,sp[i].y);
}

function cMouseDown(e)
{
  mStatus=0;
  //clearCanvas();
  //ctx.fillText(e.offsetX + " " + e.offsetY ,20,20);
  var mx=e.offsetX;
  var my=e.offsetY;
  var sp=theData[getSelectedClassName()].sp;

  for(var i=0;i<sp.length;i++)
  {
    if(textHitTest(sp[i].dname,mx,my)) 
    {
      dragIndex=i;
      mStatus=1;
      return;
    }
  }
  
}

function textHitTest(text,x,y)
{
  return(x>=text.x && 
        x<=text.x+text.width &&
        y>=text.y-text.height && 
        y<=text.y);

}

function cMouseUp(e)
{
  if(mStatus==0 || dragIndex==-1)
  {
    dragIndex=-1;
    mStatus=0;
    return;
  }
  //button was just released and text was moved
  theData[getSelectedClassName()].sp[dragIndex].x=e.offsetX;
  theData[getSelectedClassName()].sp[dragIndex].y=e.offsetY;
  dragIndex=-1;
  mStatus=0;
  updateCanvas(); 
}
