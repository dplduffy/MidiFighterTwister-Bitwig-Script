
loadAPI(1);
host.defineController("DJ Tech Tools", "Midi Fighter Twister", "1.0", "d6b9adc4-81d0-11e5-8bcf-feff819cdc9f");
host.defineMidiPorts(1, 1);
host.addDeviceNameBasedDiscoveryPair(["Midi Fighter Twister"], ["Midi Fighter Twister"]);

load("MidiFighterTwister.constants.js")
load("MidiFighterTwister.mixer.js")

var volume = initArray(0, 8);
var pan = initArray(0, 8);
var mute = initArray(0, 8);
var solo = initArray(0, 8);
var isSelected = initArray(0, 8);
var send = initArray(0, 8);
var color = initArray(0, 8);
var activePage = null;
var pendingRGBLEDs = new Array(16);
var activeRGBLEDs = new Array(16);
var pending11segLEDs = new Array(16);
var active11segLEDs = new Array(16);
var MIXERMODE = 0;
var encoderNum = -1;
var encoderValue = 0;

function init()
{
	host.getMidiInPort(0).setMidiCallback(onMidi);
    noteInput = host.getMidiInPort(0).createNoteInput("Midi Fighter Twister", "80????", "90????");
    noteInput.setShouldConsumeEvents(false);
    
    trackBank4 = host.createMainTrackBank(4, 8, 4);
    for(var t=0; t<4; t++)
    {
       var track = trackBank4.getChannel(t);
	   
       track.getVolume().addValueObserver(126, getTrackObserverFunc(t, volume));
       track.getPan().addValueObserver(126, getTrackObserverFunc(t, pan));
       //track.getSend(0).addValueObserver(126, getTrackObserverFunc(t, sendA));
       //track.getSend(1).addValueObserver(8, getTrackObserverFunc(t, sendB));    
       track.getMute().addValueObserver(getTrackObserverFunc(t, mute));
       track.getSolo().addValueObserver(getTrackObserverFunc(t, solo));
       track.addIsSelectedObserver(getTrackObserverFunc(t, isSelected));
    }
	
	trackBank8 = host.createMainTrackBank(8, 8, 8);
    for(var t=0; t<8; t++)
    {
       var track = trackBank8.getChannel(t);
	   
       track.getVolume().addValueObserver(126, getTrackObserverFunc(t, volume));
       track.getPan().addValueObserver(126, getTrackObserverFunc(t, pan));
       //track.getSend(0).addValueObserver(126, getTrackObserverFunc(t, sendA));
       //track.getSend(1).addValueObserver(8, getTrackObserverFunc(t, sendB));    
       track.getMute().addValueObserver(getTrackObserverFunc(t, mute));
       track.getSolo().addValueObserver(getTrackObserverFunc(t, solo));
       track.addIsSelectedObserver(getTrackObserverFunc(t, isSelected));
	   track.addColorObserver(handleColor);
    }
	
	setActivePage(mixerPage);
}

function setActivePage(page)
{
   var isInit = activePage == null;

   if (page != activePage)
   {
      activePage = page;
      if (!isInit)
      {
         host.showPopupNotification(page.title);
      }
   }
}

function getTrackObserverFunc(track, varToStore)
{
	return function(value)
	{
	   varToStore[track] = value;
	}
}

function onMidi(status, data1, data2)
{
	printMidi(status, data1, data2);
    var isActive = data2 > 0;
	
	if (status == statusType.ENCODER_TURN)
	{
		encoderNum = data1;
		encoderValue = data2;
		activePage.onEncoderTurn(isActive);
	}
	
    //if (status==177)
    //{
    //    if (data2==127)
    //    {
    //        //create function for encoder press
    //    }
    //    if(data2==0)
    //    {
    //        //create function for encoder release
    //    }
    //}
    //
    //if (status==176)
    //{
    //    //create function for encoder turn cases
    //}
    //
    //if(status==147)
    //{
    //    //create function for side button press
    //}
    //
    //if(status==131)
    //{
    //    //create function for side button release
    //} 
}

function page()
{
	this.canScrollLeft = false;
	this.canScrollRight = false;
}

page.prototype.updateOutputState = function()
{
};

function clear()
{
   for(var i=0; i<16; i++)
   {
      pendingRGBLEDs[i] = 0;
	  pending11segLEDs[i] = 0;
   }
}

function flush()
{
	activePage.updateOutputState();
	flushLEDs();
}

function setRGBLED(loc, color)
{
	pendingRGBLEDs[loc] = color;
}

function set11segLED(loc, value)
{
	pending11segLEDs[loc] = value;
}

function flushLEDs()
{
   var changedRGBCount = 0;
   var changed11segCount = 0;
   
   for(var i=0; i<16; i++)
   {
      if (pendingRGBLEDs[i] != activeRGBLEDs[i]) changedRGBCount++;
	  if (pending11segLEDs[i] != active11segLEDs[i]) changed11segCount++;
   }

   if (changedRGBCount == 0 && changed11segCount == 0) return;
   
	for(var i = 0; i<16; i++)
		{
			if (pendingRGBLEDs[i] != activeRGBLEDs[i])
			{
	            activeRGBLEDs[i] = pendingRGBLEDs[i];
	            var color = activeRGBLEDs[i];
				sendMidi(177, i, color);
			}
			
			if (pending11segLEDs[i] != active11segLEDs[i])
			{
	            active11segLEDs[i] = pending11segLEDs[i];
	            var value = active11segLEDs[i];
				sendMidi(176, i, value);
			}
		}
}

function handleColor(r, g, b)
{
	for (var i = 0; i < trackColors.length; i++)
    {
        var color = trackColors[i];
        
		if ((Math.abs (color[0] - r ) < 0.0001) && (Math.abs (color[1] - g) < 0.0001) && (Math.abs (color[2] - b) < 0.0001))
		{
        return color[3];
		}
    }
}

var trackColors =
[
    [ 0.3294117748737335 , 0.3294117748737335 , 0.3294117748737335 , 0],    // Dark Gray
    [ 0.47843137383461   , 0.47843137383461   , 0.47843137383461   , 0],    // Gray
    [ 0.7882353067398071 , 0.7882353067398071 , 0.7882353067398071 , 0],    // Light Gray
    [ 0.5254902243614197 , 0.5372549295425415 , 0.6745098233222961 , 0],   // Silver
    [ 0.6392157077789307 , 0.4745098054409027 , 0.26274511218070984, 0],   // Dark Brown
    [ 0.7764706015586853 , 0.6235294342041016 , 0.43921568989753723, 0],   // Brown
    [ 0.34117648005485535, 0.3803921639919281 , 0.7764706015586853 , 1],   // Dark Blue
    [ 0.5176470875740051 , 0.5411764979362488 , 0.8784313797950745 , 19],   // Light Blue
    [ 0.5843137502670288 , 0.2862745225429535 , 0.7960784435272217 , 112],   // Purple
    [ 0.8509804010391235 , 0.21960784494876862, 0.4431372582912445 , 90],   // Pink
    [ 0.8509804010391235 , 0.18039216101169586, 0.1411764770746231 , 80],    // Red
    [ 1                  , 0.34117648005485535, 0.0235294122248888 , 75],   // Orange
    [ 0.8509804010391235 , 0.615686297416687  , 0.062745101749897  , 70],   // Light Orange
    [ 0.45098039507865906, 0.5960784554481506 , 0.0784313753247261 , 45],   // Green
    [ 0                  , 0.615686297416687  , 0.27843138575553894, 55],   // Cold Green
    [ 0                  , 0.6509804129600525 , 0.5803921818733215 , 35],   // Bluish Green
    [ 0                  , 0.6000000238418579 , 0.8509804010391235 , 19],   // Light Blue
    [ 0.7372549176216125 , 0.4627451002597809 , 0.9411764740943909 , 110],   // Light Purple
    [ 0.8823529481887817 , 0.4000000059604645 , 0.5686274766921997 , 100],   // Light Pink
    [ 0.9254902005195618 , 0.3803921639919281 , 0.34117648005485535, 62],    // Skin
    [ 1                  , 0.5137255191802979 , 0.24313725531101227, 62],   // Redish Brown
    [ 0.8941176533699036 , 0.7176470756530762 , 0.30588236451148987, 62],   // Light Brown
    [ 0.6274510025978088 , 0.7529411911964417 , 0.2980392277240753 , 55],   // Light Green
    [ 0.24313725531101227, 0.7333333492279053 , 0.3843137323856354 , 35],   // Bluish Green
    [ 0.26274511218070984, 0.8235294222831726 , 0.7254902124404907 , 19],   // Light Blue
    [ 0.2666666805744171 , 0.7843137383460999 , 1                  , 25]    // Blue
];