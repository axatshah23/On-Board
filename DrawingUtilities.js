/*This file is created by 19IT126-Axat Shah*/
/*This file contains all drawing related activites*/ 
/*Created On: 17/03/2021*/

//Defined constants
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

//So that no items or text of the toolbox can be selected.
var x= document.getElementById("toolbox");
x.style.WebkitUserSelect = "none"; // Safari
x.style.msUserSelect = "none"; // IE 10 and IE11
x.style.userSelect = "none"; // Standard syntax

function initi() {
  resize();
  //Setting up for normal drawing
  drawing_setup();
  //window.addEventListener("resize", resize_info);
  document.getElementById("boardcolor").addEventListener("input", board_color,{passive: true});
  document.getElementById("strokecolor").addEventListener("input", stroke_properties,{passive: true});
  document.getElementById("strokewidth").addEventListener("input", stroke_properties,{passive: true});
  document.getElementById("pagecontainer").style.cursor= "url('board icons/Pen_cursor.png'),auto";
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
  //start_pencil();
  toggle_sidepanel();
  update_page_image();
  //sidein.addEventListener("mouseover",toggle_sidepanel);
  //toolbox.addEventListener("mouseout", toggle_sidepanel);
  //startup_instructions();
}

async function board_color() {
  //changing background color of canvas
  canv.style.backgroundColor = document.getElementById("boardcolor").value;
  notifier_control('please wait',"25%","80%","visible");
  //sleep(1000);
  //filling the canvas with a color
  cntx.fillStyle=document.getElementById("boardcolor").value;
  cntx.fillRect(0, 0, canv.width, canv.height);
  notifier_control('',"0%","0%","hidden");
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


//drawing pre-requisites
var loc ={x:0 , y:0};
var controlPoint = {x:0 , y:0};   //for quadratic curve

async function locator(event) {
  if(event.touches){
    loc.x = event.touches[0].clientX - canv.offsetLeft;
    loc.y = event.touches[0].clientY - canv.offsetTop;
  }
  else{
   loc.x = event.clientX - canv.offsetLeft;
   loc.y = event.clientY - canv.offsetTop;
  }
}

//drawing functions
var strok = false;

async function stroke_properties(cntx_name) {
  cntx_name.lineCap = 'round';
  cntx_name.lineWidth = document.getElementById('strokewidth').value;
  cntx_name.strokeStyle = document.getElementById('strokecolor').value;
  cntx_name.lineJoin = 'round';
}

async function start_draw(event) {
  event.preventDefault();
  locator(event);
  stroke_properties(cntx);
  strok =true;
}

async function auxillary_stop_draw() {
  strok=false;
  update_page_image();
}

async function stop_draw(event) {
  strok=false;
}

// This function is not yet being used
function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}


async function draw(event) {
  if (!strok){return;}
  cntx.beginPath();
  cntx.moveTo(loc.x,loc.y);
  //locator(event);
  controlPoint.x=loc.x;
  controlPoint.y=loc.y;
  //new piece
  locator(event);
  controlPoint.x = (controlPoint.x + loc.x)/2 ;
  controlPoint.y = (controlPoint.y + loc.y)/2 ;
  //end piece
  //document.getElementById('toolscontainer').innerHTML = "X:" + controlPoint.x +"   Y:" + controlPoint.y ; //for testing
  locator(event);
  cntx.quadraticCurveTo(controlPoint.x, controlPoint.y, loc.x, loc.y);
  //cntx.lineTo(loc.x,loc.y);
  cntx.stroke();
  cntx.closePath();
}

function clear_page(cntx_name) {
  cntx_name.clearRect(0,0,canv.width,canv.height);
  cntx_name.fillStyle=document.getElementById("boardcolor").value;
  cntx_name.fillRect(0, 0, canv.width, canv.height);
}

//Toggle to eraser
var pstrokewidth = 5;
var pstrokecolor ;
var estrokewidth = 30;  //setting strokewidth to 30
var estrokecolor = document.getElementById("boardcolor").value;
var lstrokewidth = document.getElementById("strokewidth").value;
var lstrokecolor = document.getElementById('strokecolor').value;

function start_eraser() {
  document.getElementById("strokecolor").disabled = true;
  document.getElementById("pagecontainer").style.cursor= "url('board icons/Eraser_cursor.png'),auto";
  tool_toggler();
  isEraserOn=true;
  document.getElementById("strokewidth").value = estrokewidth;
  document.getElementById('strokecolor').value = document.getElementById("boardcolor").value;
  //changing button properties
  document.getElementById('eraser').style.backgroundColor = "#9392FF";
}

function stop_eraser() {
  document.getElementById('eraser').style.backgroundColor = "white";
  isEraserOn=false;
  //estrokewidth = document.getElementById('strokewidth').value;  //this is causing problems while shifting b/w different tools
  document.getElementById("strokecolor").disabled = false;
}

//Toggle to pencil
function start_pencil() {
  document.getElementById("pagecontainer").style.cursor= "url('board icons/Pen_cursor.png'),auto";
  tool_toggler();
  isPencilOn=true;
  document.getElementById("strokewidth").value = pstrokewidth;
  document.getElementById('strokecolor').value = pstrokecolor;
  //changing button properties
  document.getElementById('pencil').style.backgroundColor = "#9392FF";
}

function stop_pencil() {
  isPencilOn=false;
  document.getElementById('pencil').style.backgroundColor = "white";
  pstrokewidth = document.getElementById('strokewidth').value;
  pstrokecolor = document.getElementById('strokecolor').value;
}

//loadscript function !!!!important for better page rendering!!!!
async function loadscript(url, location, notifier_id){
    //url is URL of external file, implementationCode is the code
    //to be called from the file, location is the location to
    //insert the <script> element
    document.getElementById(notifier_id).style.height='20px';
    document.getElementById(notifier_id).innerHTML="Loading Script.....";

    var scriptTag = document.createElement('script');
    scriptTag.src = url;

    //scriptTag.onload = implementationCode;
    //scriptTag.onreadystatechange = implementationCode;

    location.appendChild(scriptTag);

    document.getElementById(notifier_id).innerHTML="";
    document.getElementById(notifier_id).style.height='0px';
}

async function startup_instructions() {
  write_on_canvas("Welcome to On-Board", toolbox.style.width + 2, canv.height/2);
  write_on_canvas("Start Drawing!", 200, (canv.height/2) + 40);
  write_on_canvas("Use the reset Button in the 'Actions panel'(the first one) to clear this message.", 200, (canv.height/2) + 80);
}

async function write_on_canvas(string, corx, cory) {
  cntx.font = "30px Arial";
  cntx.fillStyle="white";
  cntx.fillText(string, corx, cory);
}

//Undo Redo functionality:
var undo_arr_index;
async function update_page_image() {
  var board_image = cntx.getImageData(0,0,canv.width,canv.height);
  if(undo_arr_index<(undo_arr.length)){
    undo_arr.splice( (undo_arr_index + 1), (undo_arr.length - undo_arr_index - 1));
  }
  undo_arr.push(board_image);
  undo_arr_index = undo_arr.length - 1; //array indexing issue
  button_state_checker();
  //console.log(undo_arr.length)//for testing
}

async function undo() {
  if(undo_arr_index>0){
    undo_arr_index -= 1;
    cntx.putImageData(undo_arr[undo_arr_index],0,0);
  }
  button_state_checker();
}

async function redo() {
  if(undo_arr_index<undo_arr.length){
    undo_arr_index ++;
    cntx.putImageData(undo_arr[undo_arr_index],0,0);
  }
  button_state_checker();
}

async function button_state_checker() {
  //enabling and disabling of buttons
  if (undo_arr_index==0) {
    document.getElementById('action8').disabled = true;
  }
  if(undo_arr_index==(undo_arr.length - 1)){
    document.getElementById('action9').disabled = true;
  }
  if(undo_arr_index>0){
    document.getElementById('action8').disabled = false;
  }
  if(undo_arr_index<(undo_arr.length - 1)){
    document.getElementById('action9').disabled = false;
  }
  //number of undo's that can be done
  if(undo_arr.length>25){
    undo_arr.splice(0,(undo_arr.length - 25));
  }
}
//Undo Redo Achieved

//tool toggler
var isPencilOn=true, isEraserOn=false, isLineOn=false, isCircleOn=false, isRectOn=false, isSelectOn=false, isTextOn=false;
async function tool_toggler() {
  if(isPencilOn){
    stop_pencil();
  }
  if(isEraserOn){
    stop_eraser();
  }
  if(isLineOn){
    stop_line_drawing();
  }
	if(isCircleOn){
		stop_circle_drawing();
	}
	if(isRectOn){
		stop_rect_drawing();
	}
	if(isSelectOn){
		stop_select_function();
	}
	if(isTextOn){
		stop_text_movement();
	}
}

//Trying line drawing
async function start_line_drawing() {
  document.getElementById("pagecontainer").style.cursor= 'crosshair';
  tool_toggler();
  canv3.addEventListener("touchstart", start_line);
  canv3.addEventListener("touchmove", draw_line);
  canv3.addEventListener("touchend", stop_line);
  canv3.addEventListener("mousedown", start_line);
  canv3.addEventListener("mousemove", draw_line);
  canv3.addEventListener("mouseup", stop_line);
  canv3.addEventListener("pointerdown", start_line);
  canv3.addEventListener("pointermove", draw_line);
  canv3.addEventListener("pointerup", stop_line);
  canv3.width = window.innerWidth-20;
  canv3.height = window.innerHeight-20;
  canv3.style.opacity=1;
  canv3.style.visibility='visible';
  document.getElementById('lines').style.backgroundColor = "#9392FF";
  document.getElementById('strokecolor').value = pstrokecolor;
  document.getElementById('strokewidth').value = pstrokewidth;
  isLineOn=true;
  toggle_sidepanel();
}

async function stop_line_drawing() {
  canv3.width = 0;
  canv3.height = 0;
  canv3.style.opacity=0;
  canv3.style.backgroundColor="";
  canv3.style.visibility='hidden';
  canv3.removeEventListener("touchstart", start_line);
  canv3.removeEventListener("touchmove", draw_line);
  canv3.removeEventListener("touchend", stop_line);
  canv3.removeEventListener("mousedown", start_line);
  canv3.removeEventListener("mousemove", draw_line);
  canv3.removeEventListener("mouseup", stop_line);
  canv3.removeEventListener("pointerdown", start_line);
  canv3.removeEventListener("pointermove", draw_line);
  canv3.removeEventListener("pointerup", stop_line);
  document.getElementById('lines').style.backgroundColor = "white";
  pstrokewidth = document.getElementById('strokewidth').value;
  pstrokecolor = document.getElementById('strokecolor').value;
  isLineOn=false;
}

async function start_line(event) {
  event.preventDefault();
  locator(event);
  controlPoint.x=loc.x; //used to store the initial point
  controlPoint.y=loc.y;
  stroke_properties(cntx3);
  strok =true;
}

async function draw_line(event) {
  if (!strok){return;}
  cntx3.clearRect(0,0,canv3.width,canv3.height);
  cntx3.beginPath();
  cntx3.moveTo(controlPoint.x,controlPoint.y);
  locator(event);
  //document.getElementById('toolscontainer').innerHTML = "X:" + loc.x +"   Y:" + loc.y ; //for testing
  cntx3.lineTo(loc.x, loc.y);
  cntx3.stroke();
  cntx3.closePath();
}

async function stop_line() {
  strok = false;  //turn off drawing, and immediately draw the current line to canvas1
  stroke_properties(cntx);
  cntx.beginPath();
  cntx.moveTo(controlPoint.x,controlPoint.y);
  cntx.lineTo(loc.x, loc.y);
  cntx.stroke();
  cntx.closePath();
  cntx3.clearRect(0,0,canv3.width,canv3.height);
  update_page_image();
}
//line drawing complete

//Trying circle drawing
async function start_circle_drawing() {
  document.getElementById("pagecontainer").style.cursor= 'crosshair';
  tool_toggler();
  canv3.addEventListener("touchstart", start_circle);
  canv3.addEventListener("touchmove", draw_circle);
  canv3.addEventListener("touchend", stop_circle);
  canv3.addEventListener("mousedown", start_circle);
  canv3.addEventListener("mousemove", draw_circle);
  canv3.addEventListener("mouseup", stop_circle);
  canv3.addEventListener("pointerdown", start_circle);
  canv3.addEventListener("pointermove", draw_circle);
  canv3.addEventListener("pointerup", stop_circle);
  canv3.width = window.innerWidth-20;
  canv3.height = window.innerHeight-20;
  canv3.style.opacity=1;
  canv3.style.visibility='visible';
  document.getElementById('circle').style.backgroundColor = "#9392FF";
  document.getElementById('strokecolor').value = pstrokecolor;
  document.getElementById('strokewidth').value = pstrokewidth;
  isCircleOn=true;
  toggle_sidepanel();
}

async function stop_circle_drawing() {
  canv3.width = 0;
  canv3.height = 0;
  canv3.style.opacity=0;
  canv3.style.backgroundColor="";
  canv3.style.visibility='hidden';
  canv3.removeEventListener("touchstart", start_circle);
  canv3.removeEventListener("touchmove", draw_circle);
  canv3.removeEventListener("touchend", stop_circle);
  canv3.removeEventListener("mousedown", start_circle);
  canv3.removeEventListener("mousemove", draw_circle);
  canv3.removeEventListener("mouseup", stop_circle);
  canv3.removeEventListener("pointerdown", start_circle);
  canv3.removeEventListener("pointermove", draw_circle);
  canv3.removeEventListener("pointerup", stop_circle);
  document.getElementById('circle').style.backgroundColor = "white";
  pstrokewidth = document.getElementById('strokewidth').value;
  pstrokecolor = document.getElementById('strokecolor').value;
  isCircleOn=false;
}

async function start_circle(event) {
  event.preventDefault();
  locator(event);
  controlPoint.x=loc.x; //used to store the initial point
  controlPoint.y=loc.y;
  stroke_properties(cntx3);
  strok =true;
}

async function draw_circle(event) {
  if (!strok){return;}
  cntx3.clearRect(0,0,canv3.width,canv3.height);
  cntx3.beginPath();
 // cntx3.moveTo(controlPoint.x,controlPoint.y);
  locator(event);
  //document.getElementById('toolscontainer').innerHTML = "X:" + loc.x +"   Y:" + loc.y ; //for testing
	var radius;
	if((loc.x-controlPoint.x)<0){
		radius = controlPoint.x - loc.x;
	}else{
		radius = loc.x-controlPoint.x;
	}
  cntx3.arc(controlPoint.x,controlPoint.y,radius,0*Math.PI,2*Math.PI);
  cntx3.stroke();
}

async function stop_circle() {
  strok = false;  //turn off drawing, and immediately draw the current line to canvas1
  stroke_properties(cntx);
	var radius;
	if((loc.x-controlPoint.x)<0){
		radius = controlPoint.x - loc.x;
	}else{
		radius = loc.x-controlPoint.x;
	}
  cntx.beginPath();
 // cntx.moveTo(controlPoint.x,controlPoint.y);
 // cntx.lineTo(loc.x, loc.y);
	cntx.arc(controlPoint.x,controlPoint.y,radius,0*Math.PI,2*Math.PI);
  cntx.stroke();
  cntx.closePath();
  cntx3.clearRect(0,0,canv3.width,canv3.height);
  update_page_image();
}
//circle drawing complete

//Trying line drawing
async function start_rect_drawing() {
  document.getElementById("pagecontainer").style.cursor= 'crosshair';
  tool_toggler();
  canv3.addEventListener("touchstart", start_rect);
  canv3.addEventListener("touchmove", draw_rect);
  canv3.addEventListener("touchend", stop_rect);
  canv3.addEventListener("mousedown", start_rect);
  canv3.addEventListener("mousemove", draw_rect);
  canv3.addEventListener("mouseup", stop_rect);
  canv3.addEventListener("pointerdown", start_rect);
  canv3.addEventListener("pointermove", draw_rect);
  canv3.addEventListener("pointerup", stop_rect);
  canv3.width = window.innerWidth-20;
  canv3.height = window.innerHeight-20;
  canv3.style.opacity=1;
  canv3.style.visibility='visible';
  document.getElementById('rectangle').style.backgroundColor = "#9392FF";
  document.getElementById('strokecolor').value = pstrokecolor;
  document.getElementById('strokewidth').value = pstrokewidth;
  isRectOn=true;
  toggle_sidepanel();
}

async function stop_rect_drawing() {
  canv3.width = 0;
  canv3.height = 0;
  canv3.style.opacity=0;
  canv3.style.backgroundColor="";
  canv3.style.visibility='hidden';
  canv3.removeEventListener("touchstart", start_rect);
  canv3.removeEventListener("touchmove", draw_rect);
  canv3.removeEventListener("touchend", stop_rect);
  canv3.removeEventListener("mousedown", start_rect);
  canv3.removeEventListener("mousemove", draw_rect);
  canv3.removeEventListener("mouseup", stop_rect);
  canv3.removeEventListener("pointerdown", start_rect);
  canv3.removeEventListener("pointermove", draw_rect);
  canv3.removeEventListener("pointerup", stop_rect);
  document.getElementById('rectangle').style.backgroundColor = "white";
  pstrokewidth = document.getElementById('strokewidth').value;
  pstrokecolor = document.getElementById('strokecolor').value;
  isRectOn=false;
}

async function start_rect(event) {
  event.preventDefault();
  locator(event);
  controlPoint.x=loc.x; //used to store the initial point
  controlPoint.y=loc.y;
  stroke_properties(cntx3);
  strok =true;
}

async function draw_rect(event) {
  if (!strok){return;}
  cntx3.clearRect(0,0,canv3.width,canv3.height);
  cntx3.beginPath();
  cntx3.moveTo(controlPoint.x,controlPoint.y);
  locator(event);
  //document.getElementById('toolscontainer').innerHTML = "X:" + loc.x +"   Y:" + loc.y ; //for testing
	cntx3.lineTo(loc.x, controlPoint.y);
	cntx3.lineTo(loc.x, loc.y);
	cntx3.lineTo(controlPoint.x, loc.y);
	cntx3.lineTo(controlPoint.x,controlPoint.y);
	cntx3.moveTo(loc.x,loc.y);
  cntx3.stroke();
  cntx3.closePath();
}

async function stop_rect() {
  strok = false;  //turn off drawing, and immediately draw the current line to canvas1
  stroke_properties(cntx);
  cntx.beginPath();
	cntx.moveTo(controlPoint.x,controlPoint.y);
	cntx.lineTo(loc.x, controlPoint.y);
	cntx.lineTo(loc.x, loc.y);
	cntx.lineTo(controlPoint.x, loc.y);
	cntx.lineTo(controlPoint.x,controlPoint.y);
	cntx.moveTo(loc.x,loc.y);
  cntx.stroke();
  cntx.closePath();
  cntx3.clearRect(0,0,canv3.width,canv3.height);
  update_page_image();
}
//rectangle drawing complete

//notification functions
async function notifier_control(message, notifier_margin_left, notifier_margin_top, notifier_visibility) {
  document.getElementById('notifier1').style.margin = "0px 0px 0px" + notifier_margin_left;
  //document.getElementById('image_placement_box').style.height = "0%";
  //document.getElementById('image_placement_box').style.width = "0%";
  document.getElementById('notifier1').style.visibility = notifier_visibility;
  document.getElementById('notifier1').innerHTML = message;
}
