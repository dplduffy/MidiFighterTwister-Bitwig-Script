
loadAPI(1);
host.defineController("DJ Tech Tools", "Midi Fighter Twister", "1.0", "d6b9adc4-81d0-11e5-8bcf-feff819cdc9f");
host.defineMidiPorts(1, 1);
host.addDeviceNameBasedDiscoveryPair(["Midi Fighter Twister"], ["Midi Fighter Twister"]);

load("MidiFighterTwister.constants.js")

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
}

function getTrackObserverFunc(track, varToStore)
{
   return function(value)
   {
      varToStore[track] = value;
   }
}

var volume = initArray(0, 8);
var pan = initArray(0, 8);
var mute = initArray(0, 8);
var solo = initArray(0, 8);
var isSelected = initArray(0, 8);
var send = initArray(0, 8);

var test = false;

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