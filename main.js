/*This file is created by 19IT126-Axat Shah*/
/*This file contains all drawing related activites*/ 
/*Created On: 17/03/2021*/

//Constants
const canv = document.getElementById('canvas1') ;
const cntx = canv.getContext('2d');
const canv3 = document.getElementById('canvas3') ;
const cntx3 = canv3.getContext('2d');
const video = document.querySelector('#testv');
const toolbox = document.getElementById('toolbox');
const sidein = document.getElementById('sidepanelin');
const sideout = document.getElementById('sidepanelout');
var undo_arr = [];

document.onload=initi();

function initi() {
  resize();
  //Setting up for normal drawing
  drawing_setup();
  document.getElementById("boardcolor").addEventListener("input", board_color,{passive: true});
  document.getElementById("strokecolor").addEventListener("input", stroke_properties,{passive: true});
  document.getElementById("strokewidth").addEventListener("input", stroke_properties,{passive: true});
  setup();
}

function drawing_setup() {
  canv.addEventListener("touchstart", start_draw);
  canv.addEventListener("touchmove", draw);
  canv.addEventListener("touchend", stop_draw);
  canv.addEventListener("mousedown", start_draw);
  canv.addEventListener("mousemove", draw);
  canv.addEventListener("mouseup", stop_draw);
  canv.addEventListener("mouseup", auxillary_stop_draw);
  canv.addEventListener("mouseout", stop_draw);
  canv.addEventListener("pointerdown", start_draw);
  canv.addEventListener("pointermove", draw);
  canv.addEventListener("pointerup", stop_draw);
  canv.addEventListener("pointerup", auxillary_stop_draw);
  canv.addEventListener("pointerout", stop_draw);
}

function setup() {
  toolbox.style.height=(window.innerHeight-44)+'px';
  board_color();
  toggle_sidepanel();
  toggle_sidepanel();
}

async function board_color() {
  //changing background color of canvas
  canv.style.backgroundColor = document.getElementById("boardcolor").value;
  //filling the canvas with a color
  cntx.fillStyle=document.getElementById("boardcolor").value;
  cntx.fillRect(0, 0, canv.width, canv.height);
}

var full_screen=false;
function resize() {
    //saving original image
    var original=cntx.getImageData(0,0,canv.width,canv.height);
    //resizing the canvas
    canv.width = window.innerWidth-20;
    canv.height = window.innerHeight-20;
    //filling the canvas with a background color
    board_color();
    //placing the image back on to this canvas
    cntx.putImageData(original,0,0,0,0,canv.width,canv.height);
    if(full_screen){document.body.requestFullscreen();}
}

function resize_info() {
  if(confirm("Resizing can lead to loss of data and quality of your image.Do you want to resize?")) {
    resize();
  }
}

async function toggle_sidepanel() {
  if (toolbox.style.visibility=='hidden') {
    toolbox.style.visibility='visible';
    sidein.style.visibility='hidden';
    for(var opac=0;opac<=1;opac+=0.1){
      toolbox.style.opacity=opac;
    }
  }
  else  {
    toolbox.style.visibility='hidden';
    sidein.style.visibility='visible';
    for(var opac=1;opac>=0;opac-=0.1){
      toolbox.style.opacity=opac;
    }
  }
}

async function start_draw(event) {
  event.preventDefault();

  strok =true;
}

async function auxillary_stop_draw() {
  strok=false;
}

async function stop_draw(event) {
  strok=false;
}

async function draw(event) {
  if (!strok){return;}
  cntx.beginPath();
  cntx.moveTo(loc.x,loc.y);
  controlPoint.x=loc.x;
  controlPoint.y=loc.y;
  //new piece
  controlPoint.x = (controlPoint.x + loc.x)/2 ;
  controlPoint.y = (controlPoint.y + loc.y)/2 ;
  //end piece
  //document.getElementById('toolscontainer').innerHTML = "X:" + controlPoint.x +"   Y:" + controlPoint.y ; //for testing
  cntx.quadraticCurveTo(controlPoint.x, controlPoint.y, loc.x, loc.y);
  cntx.stroke();
  cntx.closePath();
}
