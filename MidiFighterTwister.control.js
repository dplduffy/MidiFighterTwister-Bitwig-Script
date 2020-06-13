
loadAPI(11);
host.defineController("DJ Tech Tools", "Midi Fighter Twister", "1.0", "d6b9adc4-81d0-11e5-8bcf-feff819cdc9f");
host.defineMidiPorts(1, 1);
host.addDeviceNameBasedDiscoveryPair(["Midi Fighter Twister"], ["Midi Fighter Twister"]);

load("MidiFighterTwister.constants.js")
load("MidiFighterTwister.mixer.js")
load("MidiFighterTwister.device.js")
load("MidiFighterTwister.MelodicSequencer.js")
load("MidiFighterTwister.SequencerFunctions.js")
load("MidiFighterTwister.DrumSequencer.js")


function init() {
	host.getMidiInPort(0).setMidiCallback(onMidi);
    noteInput = host.getMidiInPort(0).createNoteInput("Midi Fighter Twister", "80????", "90????");
    noteInput.setShouldConsumeEvents(false);
	
	mainTrackBank = host.createMainTrackBank(4, 12, 8);

    for(var t=0; t<4; t++) {
		var track = mainTrackBank.getChannel(t);
		track.getVolume().addValueObserver(126, getTrackObserverFunc(t, mainVolume));
		track.getPan().addValueObserver(126, getTrackObserverFunc(t, mainPan));
		
		for(var s=0; s<12; s++) {
			track.getSend(s).addValueObserver(126, getSendObserverFunc(t, s));
		}
			
		track.getMute().addValueObserver(getTrackObserverFunc(t, mainMute));
		track.getSolo().addValueObserver(getTrackObserverFunc(t, mainSolo));
		track.addIsSelectedInMixerObserver(getTrackObserverFunc(t, mainIsSelected));
		track.color().addValueObserver(getTrackObserverFunc(t, mainColor));
		track.getArm().addValueObserver(getTrackObserverFunc(t, mainArm));
    }
	
	mainTrackBank.canScrollChannelsUp().addValueObserver(function(canScroll){
		mixerPage.canScrollMainChannelsUp = canScroll;});
	mainTrackBank.canScrollChannelsDown().addValueObserver(function(canScroll){
		mixerPage.canScrollMainChannelsDown = canScroll;});
	
	effectTrackBank = host.createEffectTrackBank(4, 8)
	for(var t=0; t<4; t++) {
		var effectTrack = effectTrackBank.getChannel(t);
		effectTrack.getVolume().addValueObserver(126, getTrackObserverFunc(t, effectVolume));
		effectTrack.getPan().addValueObserver(126, getTrackObserverFunc(t, effectPan));
		effectTrack.getMute().addValueObserver(getTrackObserverFunc(t, effectMute));
		effectTrack.getSolo().addValueObserver(getTrackObserverFunc(t, effectSolo));
		effectTrack.addIsSelectedInMixerObserver(getTrackObserverFunc(t, effectIsSelected));
		effectTrack.color().addValueObserver(getTrackObserverFunc(t, effectColor));
		effectTrack.getArm().addValueObserver(getTrackObserverFunc(t, effectArm));
    }
	
	effectTrackBank.canScrollChannelsUp().addValueObserver(function(canScroll){
		mixerPage.canScrollEffectChannelsUp = canScroll;});
	effectTrackBank.canScrollChannelsDown().addValueObserver(function(canScroll){
		mixerPage.canScrollEffectChannelsDown = canScroll;});
	
	masterTrack = host.createMasterTrack(8);
	masterTrack.getVolume().addValueObserver(126, getTrackObserverFunc(0, masterVolume));
	masterTrack.getPan().addValueObserver(126, getTrackObserverFunc(0, masterPan));
	masterTrack.getMute().addValueObserver(getTrackObserverFunc(0, masterMute));
	masterTrack.getSolo().addValueObserver(getTrackObserverFunc(0, masterSolo));
	masterTrack.addIsSelectedInMixerObserver(getTrackObserverFunc(0, masterIsSelected));
	masterTrack.color().addValueObserver(getTrackObserverFunc(0, masterColor));
	masterTrack.getArm().addValueObserver(getTrackObserverFunc(0, masterArm));
	
	for (var i=0; i<SEQ_STEPS; i++){
		prevStepData[i] = initArray(false, SEQ_KEYS);
		stepData[i] = initArray(false, SEQ_KEYS);
	}
   
   	setActivePage(mixerPage);
	
    cursorClip = host.createCursorClip(SEQ_STEPS, SEQ_KEYS);
    cursorClip.addStepDataObserver(onStepExists);
    cursorClip.addPlayingStepObserver(onStepPlaying);
	cursorClip.getPlayStart().addRawValueObserver(getClipStart);
	cursorClip.getPlayStop().addRawValueObserver(getClipStop);
	cursorClip.getLoopStart().addRawValueObserver(getClipLoopStart);
	cursorClip.getLoopLength().addRawValueObserver(getClipLoopLength);

	cursorTrack = host.createCursorTrack("ct", "ct", 2, 0, true)
	cursorTrack.color().addValueObserver(getTrackObserverFunc(0, cursorTrackColor));
	cursorDevice =  cursorTrack.createCursorDevice("cd","cd",2,CursorDeviceFollowMode.FOLLOW_SELECTION);
	cursorDevice.name().addValueObserver(getCursorDeviceName);
	cursorDevice.position().addValueObserver(getDevicePositionObserver);
	deviceBank1 = cursorTrack.createDeviceBank(32);
	deviceBank1.canScrollBackwards().addValueObserver(getDeviceBank1CanScrollBackwards);
	deviceBank1.canScrollForwards().addValueObserver(getDeviceBank1CanScrollForwards);
	deviceBank1.addDeviceCountObserver(getDeviceBank1Count);

	cursorDRCP = cursorDevice.createCursorRemoteControlsPage(8);
	cursorDRCP.getName().addValueObserver(getCursorDRCPName);
	cursorDRCP.pageCount().addValueObserver(getCursorDRCPCount);
	cursorDRCP.selectedPageIndex().addValueObserver(getCursorDRCPIndex);
	
	for (var i=0; i<8; i++){
		cursorDRCP.getParameter(i).addValueObserver(127, getDeviceParamValue(i, cursorDeviceParam));
	}
	
	changeEncoderBank(ENCODERBANK);
    mainTrackBank.setChannelScrollStepSize(channelStepSize);
	effectTrackBank.setChannelScrollStepSize(channelStepSize);
}

function setActivePage(page){
	var isInit = activePage == null;
	isInit ? null : activePage.clearIndication();
	if (page != activePage){
	   activePage = page;
	   if (!isInit){
		    host.showPopupNotification(page.title);
	   }
	}
}

function getSendObserverFunc(t, s){
	return function(value){
		sendArray[t][s] = value;
	}
}

function getTrackObserverFunc(track, varToStore) {
	if (varToStore == mainColor 
		|| varToStore == effectColor 
		|| varToStore == masterColor
		|| varToStore == cursorTrackColor) {
			return function(r, g, b) {
				varToStore[track] = handleColor(r,g,b);
			}
	} else {
		return function(value) {
			varToStore[track] = value;
		}
	}
}

function getClipStart (value) {
	clipStart = value;
}

function getClipStop (value) {
	clipStop = value;
}

function getClipLoopStart (value) {
	clipLoopStart = value;
}

function getClipLoopLength (value) {
	clipLoopLength = value;
}

function getCursorDRCPName (value) {
	cursorDRCPName = value;
}

function getCursorDRCPCount (value) {
	cursorDRCPCount = value;
}

function getCursorDRCPIndex (value) {
	cursorDRCPIndex = value;
}

function getDeviceParamValue (i, varToStore) {
	return function(value) {
		varToStore[i] = value;
	}
}

function getDeviceBank1CanScrollBackwards (value){
	deviceBank1CanScrollBackwards = value;
}

function getDeviceBank1CanScrollForwards(value){
	deviceBank1CanScrollForwards = value;
}

function getDevicePositionObserver(value){
	devicePositionObserver = value;
}

function getCursorDeviceName(value){
	cursorDeviceName = value;
}

function getDeviceBank1Count(value){
	deviceBank1Count = value;
}

function onMidi(status, data1, data2){
	printMidi(status, data1, data2);
    var isActive = (data2 > 0);
	var isPressed = (data2 > 0);
	
	if (status == statusType.ENCODER_TURN){
		encoderNum = data1;
		encoderValue = data2;
		activePage.onEncoderTurn(isActive);
	}else if (status == statusType.ENCODER_PRESS && data2 == 127){ //data2 == 127 for encoder press
		encoderNum = data1;
		encoderValue = data2;
		activePage.onEncoderPress(isActive);
	}else if (status == statusType.ENCODER_PRESS && data2 == 0){ //data2 == 0 for encoder release
		encoderNum = data1;
		encoderValue = data2;
		activePage.onEncoderRelease(isActive);
	}
	
	if (status == statusType.SIDEBUTTON_PRESS){
		switch(data1){
			case SIDE_BUTTON.LH_BOTTOM: activePage.onLeftBottomPressed(isActive);
				break;
			case SIDE_BUTTON.LH_MIDDLE: activePage.onLeftMiddlePressed(isActive);
				break
			case SIDE_BUTTON.LH_TOP: activePage.onLeftTopPressed(isActive);
				break;
			case SIDE_BUTTON.RH_BOTTOM: activePage.onRightBottomPressed(isActive);
				break;
			case SIDE_BUTTON.RH_MIDDLE: activePage.onRightMiddlePressed(isActive);
				break
			case SIDE_BUTTON.RH_TOP: activePage.onRightTopPressed(isActive);
				break;
		}
	}
	
	if (status == statusType.SIDEBUTTON_RELEASE){
		switch(data1){
			case SIDE_BUTTON.LH_BOTTOM: activePage.onLeftBottomReleased(isActive);
				break;
			case SIDE_BUTTON.LH_MIDDLE: activePage.onLeftMiddleReleased(isActive);
				break
			case SIDE_BUTTON.LH_TOP: activePage.onLeftTopReleased(isActive);
				break;
			case SIDE_BUTTON.RH_BOTTOM: activePage.onRightBottomReleased(isActive);
				break;
			case SIDE_BUTTON.RH_MIDDLE: activePage.onRightMiddleReleased(isActive);
				break
			case SIDE_BUTTON.RH_TOP: activePage.onRightTopReleased(isActive);
				break;
		}
	}
}

function page(){
}

function clear(){
   for(var i=0; i<64; i++){
      pendingRGBLEDs[i] = 0;
	  pendingRGBSTROBEs[i] = 0
	  pending11segLEDs[i] = 0;
   }
}

function flush(){
	activePage.updateOutputState();
	flushLEDs();
}

function setRGBLED(loc, color, strobe){
	pendingRGBLEDs[loc] = color;
	pendingRGBSTROBEs[loc] = strobe;
}

function set11segLED(loc, value){
	pending11segLEDs[loc] = value;
}

function flushLEDs(){
	var changedRGBCount = 0;
	var changedRGBStrobeCount = 0;
	var changed11segCount = 0;
   
	for(var i=0; i<64; i++){
    	if (pendingRGBLEDs[i] != activeRGBLEDs[i]) changedRGBCount++;
		if (pending11segLEDs[i] != active11segLEDs[i]) changed11segCount++;
		if (pendingRGBSTROBEs[i] != activeRGBSTROBEs[i]) changedRGBStrobeCount++;
   	}

	if (changedRGBCount == 0 && changed11segCount == 0 && changedRGBStrobeCount == 0) return;
   
	for(var i = 0; i<64; i++){
		if (pendingRGBLEDs[i] != activeRGBLEDs[i]){
			activeRGBLEDs[i] = pendingRGBLEDs[i];
			var color = activeRGBLEDs[i];
			sendMidi(177, i, color);
		}
		if (pendingRGBSTROBEs[i] != activeRGBSTROBEs[i]){
			activeRGBSTROBEs[i] = pendingRGBSTROBEs[i];
			var strobe = activeRGBSTROBEs[i];
			sendMidi(178, i, strobe);
		}
		if (pending11segLEDs[i] != active11segLEDs[i]){
			active11segLEDs[i] = pending11segLEDs[i];
			var value = active11segLEDs[i];
			sendMidi(176, i, value);
		}
	}
}

function handleColor(red, green, blue){
    for (var i = 0; i < trackColors.length; i++){
        var currentColor = trackColors[i];
		if (Math.abs (currentColor[0] - red ) < 0.0001 && Math.abs (currentColor[1] - green) 
			< 0.0001 && Math.abs (currentColor[2] - blue) < 0.0001){
        		return currentColor[3];
		}
    }    
};

function changeEncoderBank(bank){
	sendMidi(147, bank, 127);
}