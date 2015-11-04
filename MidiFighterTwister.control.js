
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
var activePage = null;
var pendingRGBLEDs = new Array(16);
var activeRGBLEDs = new Array(16);
var pending11segLEDs = new Array(16);
var active11segLEDs = new Array(16);
var MIXERMODE = 0;

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
	
	setActivePage(mixerPage);
	setRGBLED
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
    
    if (status==177)
    {
        if (data2==127)
        {
            //create function for encoder press
        }
        if(data2==0)
        {
            //create function for encoder release
        }
    }
    
    if (status==176)
    {
        //create function for encoder turn cases
    }
    
    if(status==147)
    {
        //create function for side button press
    }
    
    if(status==131)
    {
        //create function for side button release
    } 
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