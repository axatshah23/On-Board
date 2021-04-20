document.onload = initi2();
function initi2() {
}

//for pages functionality start (additional array to enable pdf functionality added)
var pages = [], pages_pdf = [],page_number=0;

function new_page() {
  start_pencil();
  if (pages.length==page_number||pages.length-1==page_number) {
    pages[page_number] = cntx.getImageData(0,0,canv.width,canv.height);
    pages_pdf[page_number] = canv.toDataURL('image/jpeg',1.0);  //since pdf needs jpeg images
    page_number++;
    clear_page(cntx);
    //document.getElementById('action5').innerHTML="New Page";
  }
  else if(pages.length>page_number) {
    pages[page_number] = cntx.getImageData(0,0,canv.width,canv.height);
    pages_pdf[page_number] = canv.toDataURL('image/jpeg',1.0);  //since pdf needs jpeg images
    page_number++;
    cntx.putImageData(pages[page_number],0,0);
    if ((pages.length-1)==page_number) {
      document.getElementById('action5').innerHTML="New Page";
    }
  }
  else{}

  if(page_number>0){
    document.getElementById('action6').disabled=false;
  }
}

function previous_page() {
  //automatically saving current page
  pages[page_number]=cntx.getImageData(0,0,canv.width,canv.height);
  pages_pdf[page_number] = canv.toDataURL('image/jpeg',1.0);
  //settng up condition for first page error
  if(page_number>=1){
    page_number--;
  }
  //else{
    //alert("This is the first page.");
    //return;
  //}
  if (page_number==0) {
    document.getElementById('action6').disabled=true;
  }
  cntx.putImageData(pages[page_number],0,0);
  //document.getElementById('action5').innerHTML="";
  document.getElementById('action5').innerHTML="Next Page";
}
//for page functionality end

//image download
function download_img() {
  saveAs(canv.toDataURL('image/jpeg',1.0),'On-Board.jpeg');
}

//to pdf function
async function to_pdf() {
  var pdf_page_width, pdf_page_height;
  if(canv.width>canv.height){
    var doc = new jsPDF("landscape","pt" , "a4");
    pdf_page_width = 842;
    pdf_page_height = 595;
  }
  else{
    var doc = new jsPDF("portrait","pt" , "a4");
    pdf_page_width = 595;
    pdf_page_height = 842;
  }
  for (var i = 0; i < pages_pdf.length; i++) {
    doc.addImage(pages_pdf[i],'JPEG',0,0,pdf_page_width,pdf_page_height);
    doc.addPage();
  }
  //since the last page is not yet added to the array
  doc.addImage(canv.toDataURL('image/jpeg',1.0),'JPEG',0,0,pdf_page_width,pdf_page_height);
  doc.save("On-Board.pdf");
}

// Adding DrawImage.js here

// JavaScript Document


		var canvas2 = document.getElementById("canvas2");
		var context = canvas2.getContext("2d");
		var imag = document.getElementById("preview");
		var filechooser  = document.getElementById("furl");


	async	function previewImage(input){
			// this function is to show preview of image
      document.getElementById("pagecontainer").style.cursor= 'all-scroll';
			tool_toggler();
			var files = event.target.files;
			var file = files[0];
			toggle_sidepanel();

		if(file.type !== '' && !file.type.match('image.*'))
        {
			alert("Select valid image file!");
			filechooser.value = "";
            return;
        }
			else{

			document.getElementById('image_input_menu').style.margin = "7.5% 0% 0% 15%";
			document.getElementById('image_input_menu').style.height = "70%";
			document.getElementById('image_input_menu').style.width = "70%";
			document.getElementById('image_input_menu').style.visibility = "visible";

			var reader = new FileReader();
			reader.onload = function (e){
				document.getElementById("preview").setAttribute("src", e.target.result);
			};
			reader.readAsDataURL(input.files[0]);
		 document.getElementById("input_image_width").addEventListener("input", resize_input_image ,{passive: true});
		 document.getElementById("input_image_height").addEventListener("input", resize_input_image ,{passive: true});
		}
	}

async function resize_input_image() {
	document.getElementById("preview").style.height = document.getElementById("input_image_height").value + "px";
	document.getElementById("preview").style.width = document.getElementById("input_image_width").value + "px";
}

async	function imgavailable(){
	document.getElementById('image_input_menu').style.margin = "0px 0px 0px 0px";
	document.getElementById('image_input_menu').style.height = "0%";
	document.getElementById('image_input_menu').style.width = "0%";
	document.getElementById('image_input_menu').style.visibility = "hidden";
	notifier_control('<button class="action" id="image_input_denial" onclick="hideCanvas()"><img id="icon" src="board icons/Cross.svg"></button><button class="action" id="image_input_confirm" onclick="saveimgdata()"><img id="icon" src="board icons/Check.svg"></button>',"25%","70%","visible");
	if(filechooser.value != ""){
		initi3();
	}
	else{
		alert("First select Image to upload!");
		}
	}

async function setImage(x, y){
	if(!imag.complete){
		setTimeout(function(){
			setImage(x, y);
				},50);
		return;
		}
	if(canv.width>canv.height){
		context.font = "18px Arial";
		context.fillStyle = "Black";
		context.fillText("                                                                                                          Tip: Drag the selected area to your desired location", 10, canv.height-100);
		}
		context.drawImage(imag, (x - (document.getElementById("input_image_width").value/2)), (y - (document.getElementById("input_image_height").value/2)), document.getElementById("input_image_width").value, document.getElementById("input_image_height").value);
		}

async function initi3() {
  //Setting up for normal moving
	showCanvas();
	setImage(document.getElementById("input_image_width").value/2, document.getElementById("input_image_height").value/2);
	canvas2.addEventListener("touchstart", start_move);
	canvas2.addEventListener("touchend", stop_move);
	canvas2.addEventListener("touchmove", move);
 	canvas2.addEventListener("mousedown", start_move);
	canvas2.addEventListener("mouseup", stop_move);
	canvas2.addEventListener("mousemove", move);
	canvas2.addEventListener("pointerdown", start_move);
	canvas2.addEventListener("pointerup", stop_move);
	canvas2.addEventListener("pointermove", move);
}
var movement = false;

async function showCanvas() {
	if(audiostream){
		recorder.pauseRecording();
		}
	canvas2.style.visibility = 'visible';
	canvas2.width = window.innerWidth-20;
	canvas2.height = window.innerHeight-20;
	clearpage();
    }

async function hideCanvas() {
	clearpage();
	canvas2.style.visibility = 'hidden';
	canvas2.width = '0';
	canvas2.height = '0';
	if(audiostream){
		recorder.resumeRecording();
	}
	notifier_control('',"0%","0%","hidden");
}

async function start_move(event) {
	clearpage();
  event.preventDefault();
  locator(event);
  movement = true;
}

async function stop_move(event) {
  movement = false;
}

async function move(event){
	if (!movement){return;}
	context.beginPath();
	context.moveTo(loc.x,loc.y);
	locator(event);
	var x = loc.x;
	var y = loc.y;
	clearpage();
	setImage(x, y);
}

async function clearpage() {
  context.clearRect(0,0,canvas2.width,canvas2.height);
}

async function saveimgdata(){
	if(filechooser.value != ""){
		copy();
	}
	else{
		alert("First select Image to upload!");
		}
	notifier_control('',"0%","0%","hidden");
  document.getElementById("pagecontainer").style.cursor= "url('board icons/Pen_cursor.png'),auto";
}

async function copy(){
	var imgdata = context.getImageData((loc.x-(document.getElementById("input_image_width").value/2)), (loc.y-(document.getElementById("input_image_height").value/2)), document.getElementById("input_image_width").value, document.getElementById("input_image_height").value);
	cntx.putImageData(imgdata, (loc.x-(document.getElementById("input_image_width").value/2)), (loc.y-(document.getElementById("input_image_height").value/2)));
	clearpage();
	hideCanvas();
	filechooser.value = "";
}

//Trying select function
async function start_select_function() {
  document.getElementById("strokewidth").disabled = true;
  document.getElementById("pagecontainer").style.cursor= 'crosshair';
  tool_toggler();
  canv3.addEventListener("touchstart", start_rect_select);
  canv3.addEventListener("touchmove", draw_rect_select);
  canv3.addEventListener("touchend", stop_rect_select);
  canv3.addEventListener("mousedown", start_rect_select);
  canv3.addEventListener("mousemove", draw_rect_select);
  canv3.addEventListener("mouseup", stop_rect_select);
  canv3.addEventListener("pointerdown", start_rect_select);
  canv3.addEventListener("pointermove", draw_rect_select);
  canv3.addEventListener("pointerup", stop_rect_select);
  canv3.width = window.innerWidth - 20;
  canv3.height = window.innerHeight - 20;
  canv3.style.opacity=1;
  canv3.style.visibility='visible';
  document.getElementById('select').style.backgroundColor = "#9392FF";
  document.getElementById('strokecolor').value = pstrokecolor;
  document.getElementById('strokewidth').value = 5;
  isSelectOn=true;
  toggle_sidepanel();
}

async function stop_select_function() {
  document.getElementById("strokewidth").disabled = false;
  document.getElementById("pagecontainer").style.cursor= 'all-scroll';
  canv3.width = 0;
  canv3.height = 0;
  canv3.style.opacity=0;
  canv3.style.backgroundColor="";
  canv3.style.visibility='hidden';
  canv3.removeEventListener("touchstart", start_rect_select);
  canv3.removeEventListener("touchmove", draw_rect_select);
  canv3.removeEventListener("touchend", stop_rect_select);
  canv3.removeEventListener("mousedown", start_rect_select);
  canv3.removeEventListener("mousemove", draw_rect_select);
  canv3.removeEventListener("mouseup", stop_rect_select);
  canv3.removeEventListener("pointerdown", start_rect_select);
  canv3.removeEventListener("pointermove", draw_rect_select);
  canv3.removeEventListener("pointerup", stop_rect_select);
  document.getElementById('select').style.backgroundColor = "white";
  pstrokewidth = document.getElementById('strokewidth').value;
  pstrokecolor = document.getElementById('strokecolor').value;
  isSelectOn=false;
}

async function start_rect_select(event) {
  event.preventDefault();
  locator(event);
  controlPoint.x=loc.x; //used to store the initial point
  controlPoint.y=loc.y;
  stroke_properties(cntx3);
  strok =true;
}

async function draw_rect_select(event) {
  if (!strok){return;}
  cntx3.clearRect(0,0,canv3.width,canv3.height);
  cntx3.setLineDash([5, 15]);
  cntx3.beginPath();
  cntx3.moveTo(controlPoint.x,controlPoint.y);
  locator(event);
	cntx3.lineTo(loc.x, controlPoint.y);
	cntx3.lineTo(loc.x, loc.y);
	cntx3.lineTo(controlPoint.x, loc.y);
	cntx3.lineTo(controlPoint.x,controlPoint.y);
	cntx3.moveTo(loc.x,loc.y);
  cntx3.stroke();
  cntx3.closePath();
}

var wth, hht, imgData;
async function stop_rect_select() {
  strok = false;  //turn off drawing, and immediately draw the current line to canvas1
	wth = loc.x-controlPoint.x;
	hht = loc.y-controlPoint.y;
	imgDataa = cntx.getImageData(controlPoint.x, controlPoint.y, wth, hht);
	showcutcopybox();
}


async function showcutcopybox(){
	notifier_control('<button class="action" id="copy" onclick="ifcopy()">Copy </button><button class="action" id="cut" onclick="ifcut()"> Cut </button>',"0px","0px","visible");
}

async function showselectionbox(){
  notifier_control('<button class="action" id="select_input_denial" onclick="hideCanvass()"><img id="icon" src="board icons/Cross.svg"></button><button class="action" id="select_input_confirm" onclick="saveselectdata()"><img id="icon" src="board icons/Check.svg"></button>',"0px","0px","visible");
	stop_select_function();
	initi4();
}

async function ifcopy(){
	showselectionbox();
}

async function ifcut(){
  cntx.fillStyle = document.getElementById("boardcolor").value;
	cntx.fillRect(controlPoint.x,controlPoint.y,wth,hht);
	showselectionbox();
}

async function initi4(){
	showCanvas();
	setSelImage(controlPoint.x, controlPoint.y);
	canvas2.addEventListener("touchstart", start_move);
	canvas2.addEventListener("touchend", stop_move);
	canvas2.addEventListener("touchmove", mov(event, imgData));
 	canvas2.addEventListener("mousedown", start_move);
	canvas2.addEventListener("mouseup", stop_move);
	canvas2.addEventListener("mousemove", mov);
	canvas2.addEventListener("pointerdown", start_move);
	canvas2.addEventListener("pointerup", stop_move);
	canvas2.addEventListener("pointermove", mov);
}

async function setSelImage(x, y){
	if(canv.width>canv.height){
		context.font = "18px Arial";
		context.fillStyle = "Black";
		context.fillText("                                                                                                   Tip: Drag the selected area to your desired location", 75, canv.height-50);
	}
	context.putImageData(imgDataa, x, y);
}

async function mov(event){
  if (!movement){return;}
  context.beginPath();
  context.moveTo(loc.x,loc.y);
  locator(event);
  var x = loc.x;
  var y = loc.y;
  clearpage();
  setSelImage(x, y);
}

async function saveselectdata(){
	var imgdaa = context.getImageData(loc.x, loc.y, wth, hht);
	cntx.putImageData(imgdaa, loc.x, loc.y);
	clearpage();
	hideCanvass();
	update_page_image();
  notifier_control('',"0%","0%","hidden");
  document.getElementById("pagecontainer").style.cursor= "url('board icons/Pen_cursor.png'),auto";
}

async function hideCanvass() {
	canvas2.style.visibility = 'hidden';
	canvas2.width = '0';
	canvas2.height = '0';
  notifier_control('',"0%","0%","hidden");
}

//notification opening and closing

//Insert text function

async function start_text_movement() {
  tool_toggler();
  canv3.addEventListener("touchstart", start_movement);
  canv3.addEventListener("touchmove", movment);
  canv3.addEventListener("touchend", stop_movement);
  canv3.addEventListener("mousedown", start_movement);
  canv3.addEventListener("mousemove", movment);
  canv3.addEventListener("mouseup", stop_movement);
  canv3.addEventListener("pointerdown", start_movement);
  canv3.addEventListener("pointermove", movment);
  canv3.addEventListener("pointerup", stop_movement);
  canv3.width = window.innerWidth-20;
  canv3.height = window.innerHeight-20;
  canv3.style.opacity=1;
  canv3.style.visibility='visible';
//  document.getElementById('lines').style.backgroundColor = "#9392FF";
//  document.getElementById('strokecolor').value = pstrokecolor;
//  document.getElementById('strokewidth').value = pstrokewidth;
  isTextOn=true;
  //toggle_sidepanel();
	txxt = document.getElementById('txt');
	notifier_control('',"0%","0%","hidden");
	notifier_control('<h5>Font Size:</h5><br><input id="fontsize"  value="30" type="range" min="1" max="120" placeholder="Example: 1"> <br> <button class="action" id="select_input_denial" onclick="textcancel()"><img id="icon" src="board icons/Cross.svg"></button><button class="action" id="select_input_confirm" onclick="textsave()"><img id="icon" src="board icons/Check.svg"></button>',"0px","0px","visible");
	txxtsize = document.getElementById("fontsize").value;
	txtsize = txxtsize+"px Verdana";
	cntx3.fillStyle = document.getElementById('strokecolor').value;
	cntx3.font = txtsize;
	cntx3.fillText(txxt.value, canv3.width/2, canv3.height/2);

}
var txxt, txxtsize, txtsize;
async function stop_text_movement() {
	cntx3.clearRect(0,0,canv3.width,canv3.height);
  canv3.width = 0;
  canv3.height = 0;
  canv3.style.opacity=0;
  canv3.style.backgroundColor="";
  canv3.style.visibility='hidden';
  canv3.removeEventListener("touchstart", start_movement);
  canv3.removeEventListener("touchmove", movment);
  canv3.removeEventListener("touchend", stop_movement);
  canv3.removeEventListener("mousedown", start_movement);
  canv3.removeEventListener("mousemove", movment);
  canv3.removeEventListener("mouseup", stop_movement);
  canv3.removeEventListener("pointerdown", start_movement);
  canv3.removeEventListener("pointermove", movment);
  canv3.removeEventListener("pointerup", stop_movement);
//  pstrokewidth = document.getElementById('strokewidth').value;
//  pstrokecolor = document.getElementById('strokecolor').value;
  isTextOn=false;
	notifier_control('',"0%","0%","hidden");
  document.getElementById("pagecontainer").style.cursor= "url('board icons/Pen_cursor.png'),auto";
}

async function start_movement(event) {
  event.preventDefault();
  locator(event);
  controlPoint.x=loc.x; //used to store the initial point
  controlPoint.y=loc.y;
//  stroke_properties(cntx3);
  strok =true;

}

async function movment(event) {
  if (!strok){return;}
/*  cntx3.clearRect(0,0,canv3.width,canv3.height);
  cntx3.beginPath();
  cntx3.moveTo(controlPoint.x,controlPoint.y); */
	cntx3.clearRect(0,0,canv3.width,canv3.height);
  locator(event);
  //document.getElementById('toolscontainer').innerHTML = "X:" + loc.x +"   Y:" + loc.y ; //for testing
	cntx3.fillStyle = document.getElementById('strokecolor').value;
	txxtsize = document.getElementById("fontsize").value;
	txtsize = txxtsize+"px Verdana";
  cntx3.font = txtsize;
  cntx3.fillText(txxt.value, loc.x, loc.y);
}

async function stop_movement() {
  strok = false;  //turn off drawing, and immediately draw the current line to canvas1
 // stroke_properties(cntx);
 // update_page_image();
}
async function textsave() {
	stop_text_movement();
	cntx.fillStyle = document.getElementById('strokecolor').value;
//	txxtsize = document.getElementById("fontsize").value;
//	txtsize = txxtsize+"px Verdana";
	cntx.font = txtsize;
	cntx.fillText(txxt.value, loc.x, loc.y);
	update_page_image();
}

async function textcancel() {
	stop_text_movement();
}

async function start_text_input() {
  document.getElementById("pagecontainer").style.cursor= 'text';
	notifier_control('<input type="text" id="txt"><br><br><button class="action" id="select_input_denial" onclick="stop_text_input()"><img id="icon" src="board icons/Cross.svg"></button><button class="action" id="select_input_confirm" onclick="start_text_movement()"><img id="icon" src="board icons/Check.svg"></button>',"0px","0px","visible");
	document.getElementById("txt").focus();
	tool_toggler();
//	isTextOn = true;
}

async function stop_text_input() {
	isTextOn=false
	notifier_control('',"0%","0%","hidden");
}