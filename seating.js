var canvas;
var ctx;
var canvasWidth=1000;
var canvasHeight=600;
var mStatus=0;//0: m up, 1: m down
var dragIndex=-1;
var cNameIndex=-1;
var cNameLabel;
var cNameIn;
var editPlanCB;
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
    if(textHitTest(sp[i],mx,my)) 
    {
      dragIndex=i;
      cNameIndex=i;
      mStatus=1;
      updateCNameLabel();
      return;
    }
  }
  cNameIndex=-1;
  updateCNameLabel(); 
}

function updateCNameLabel()
{
  if(cNameIndex==-1)
  {
    cNameLabel.innerHTML="";
    cNameIn.value="";
  }
  var t=theData[getSelectedClassName()].sp[cNameIndex].name; 
  cNameLabel.innerHTML=t;
  cNameLabel.onclick=function(){showPupilInfo(t)};
  cNameIn.value=theData[getSelectedClassName()].sp[cNameIndex].dname;
  
}
function updateDName()
{
  if(cNameIndex==.1)
    return;
  if(cNameIn.value.trim()=="")
    return;
  theData[getSelectedClassName()].sp[cNameIndex].dname=cNameIn.value;
  updateCanvas();
}

function textHitTest(sp,x,y)
{
  var text=sp.dname;
  var width=getTextWidth(text);
  var height=32;
  return(x>=sp.x && 
        x<=sp.x+width &&
        y>=sp.y-height && 
        y<=sp.y);

}

function getTextWidth(t)
{
  return ctx.measureText(t).width;
}

function cMouseUp(e)
{
  if(mStatus==0 || dragIndex==-1)
  {
    dragIndex=-1;
    mStatus=0;
    return;
  }
  if(!editPlanCB.checked)
    return;
  //button was just released and text was moved
  theData[getSelectedClassName()].sp[dragIndex].x=e.offsetX-getTextWidth(theData[getSelectedClassName()].sp[dragIndex].dname)/2;
  theData[getSelectedClassName()].sp[dragIndex].y=e.offsetY+16;
  dragIndex=-1;
  mStatus=0;
  updateCanvas(); 
}

function cMouseMove(e)
{
  if(!editPlanCB.checked)
    return;
  if(mStatus==0 || dragIndex==-1)
    return;
  theData[getSelectedClassName()].sp[dragIndex].x=e.offsetX-getTextWidth(theData[getSelectedClassName()].sp[dragIndex].dname)/2;
  theData[getSelectedClassName()].sp[dragIndex].y=e.offsetY+16;
  updateCanvas(); 
}
