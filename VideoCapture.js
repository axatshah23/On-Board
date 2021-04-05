//All video capture related functions

var videostream;
var audiostream;
var streamholder = [];//=[videostream,audiostream];

//setting up recorder variable
var recorder;


async function start_recording() {
  //requesting audio and video stream
  //for audio
  try{
    audiostream = await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true}});
  } catch(error){
    console.log(error);
  }
  //getting stream of canvas only
  try{
    videostream = document.querySelector('canvas').captureStream(20);
  } catch(error){
    console.log(error);
  }
  //videostream = await navigator.mediaDevices.getDisplayMedia(); //alternate
  //for testing
  //video.srcObject = videostream;
  //video.play();
  //audiorecorder = new RecordRTC(audiostream,{type:'audio'});
  streamholder.push(videostream);
  streamholder.push(audiostream);
  recorder = new RecordRTC(streamholder, {
      type: 'canvas',
      mimeType:'video/webm',
      video:{width:canv.width, height:canv.height},
      frameInterval: 60,
  });

  //starting recorder
  recorder.startRecording();
  document.getElementById('action10').disabled=false;
  //putting up logo
  cntx.font = "15px Arial";
  cntx.fillStyle="white";
  cntx.fillText("C",5, canv.height-10);
  cntx.font = "10px Arial";
  cntx.fillText("C",17, canv.height-15.5);

  console.log("recording started");

  document.getElementById('action2').style.backgroundColor='red';
  document.getElementById('action2').style.color='white';
  document.body.style.backgroundColor='red';
}


async function stop_recording() {
  //stop testing
  //video.pause()

  //stopping recorders
  recorder.stopRecording(function() {
    var vidblob = recorder.getBlob();
    //document.getElementById('testv').src = URL.createObjectURL(blob);
    //document.getElementById('testv').parentNode.style.display = 'block';
    invokeSaveAsDialog(vidblob,"screencast.webm");
  });

  //to stop the tracks, ensuring that the user is asked permissions each time recording is started
  track_stopper(audiostream);
  track_stopper(videostream);

  streamholder=[];

  notifier_control('',"0%","0%","hidden");
  document.body.style.backgroundColor='white';
  document.getElementById('action10').disabled="true";
  document.getElementById('action2').style.backgroundColor='white';
  document.getElementById('action2').style.color='black';
  alert("Refresh the page if you want to make another recording. Do not forget to dowload the recorded videos when prompted. They will otherwise be lost.");
}

async function track_stopper(mystream) {
  var mytracks = mystream.getTracks();
  mytracks.forEach(function(track) {
    track.stop();
    console.log('stopped')
  });
}

async function toggle_recording() {
  if(!audiostream){
    document.getElementById('action10').disabled="true";
  }
  else if (recorder.getState()=="recording") {
    recorder.pauseRecording();
    notifier_control('Recording Paused',"25%","80%","visible");
    document.body.style.backgroundColor='green';
  }
  else if (recorder.getState()=="paused") {
    recorder.resumeRecording();
    document.body.style.backgroundColor='red';
    notifier_control('',"0%","0%","hidden");
  }
  else {//do nothing
  }

  /*try{
    recorder.pauseRecording();
  } catch(e){

  }*/
}

//Not yet working !!
var cam_stream;
async function show_camera() {
  try{
    cam_stream = await navigator.mediaDevices.getUserMedia({video:true});
  } catch(error){
    console.log(error);
  }
  window.setInterval(function() {cntx.drawImage(cam_stream,controlPoint.x,controlPoint.y,260,125)},50);
}

//not yet working!!
async function share_screen() {
  toggle_recording();
  screenstream = await navigator.mediaDevices.getDisplayMedia();
  streamholder.push(screenstream);
  toggle_recording();
}
