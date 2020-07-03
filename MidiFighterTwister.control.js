
loadAPI(11);
host.defineController("DJ Tech Tools", "Midi Fighter Twister", "1.0", "d6b9adc4-81d0-11e5-8bcf-feff819cdc9f");
host.defineMidiPorts(1, 1);
host.addDeviceNameBasedDiscoveryPair(["Midi Fighter Twister"], ["Midi Fighter Twister"]);

load("MidiFighterTwister.constants.js")
load("MidiFighterTwister.mixer.js")
load("MidiFighterTwister.overview.js")
load("MidiFighterTwister.MelodicSequencer.js")
load("MidiFighterTwister.SequencerFunctions.js")
load("MidiFighterTwister.DrumSequencer.js")
load("MidiFighterTwister.User.js")
load("MidiFighterTwister.perform2.js")
load("MidiFighterTwister.perform4.js")


function init() {
	host.getMidiInPort(0).setMidiCallback(onMidi);
    noteInput = host.getMidiInPort(0).createNoteInput("Midi Fighter Twister", "80????", "90????");
    noteInput.setShouldConsumeEvents(false);
	
	mainTrackBank = host.createMainTrackBank(8, 12, 8);

    for(var t=0; t<8; t++) {
		track[t] = mainTrackBank.getChannel(t);
		track[t].volume().addValueObserver(126, getTrackObserverFunc(t, mainVolume));
		track[t].pan().addValueObserver(126, getTrackObserverFunc(t, mainPan));
		
		for(var s=0; s<12; s++) {
			track[t].getSend(s).addValueObserver(126, getSendObserverFunc(t, s));
		}
		
		track[t].mute().addValueObserver(getTrackObserverFunc(t, mainMute));
		track[t].getSolo().addValueObserver(getTrackObserverFunc(t, mainSolo));
		track[t].addIsSelectedInMixerObserver(getTrackObserverFunc(t, mainIsSelected));
		track[t].color().addValueObserver(getTrackObserverFunc(t, mainColor));
		track[t].getArm().addValueObserver(getTrackObserverFunc(t, mainArm));
    }
	
	mainTrackBank.canScrollChannelsUp().addValueObserver(function(canScroll){
		mixerPage.canScrollMainChannelsUp = canScroll;});
	mainTrackBank.canScrollChannelsDown().addValueObserver(function(canScroll){
		mixerPage.canScrollMainChannelsDown = canScroll;});
		
	for (var i=0; i<4; i++){
		pTrackBank[i] = host.createMainTrackBank(1, 12, 0);
		pTrack[i] = pTrackBank[i].getChannel(0);
		//pTrack[i].name().addValueObserver(getpTrackName);
		pTrack[i].volume().markInterested();
		pTrack[i].pan().markInterested();

		for (var j=0; j<6; j++){
			pTrack[i].getSend(j).markInterested();
		}

		pTrack[i].mute().markInterested();
		pTrack[i].solo().markInterested();
		pTrack[i].addIsSelectedInMixerObserver(getTrackObserverFunc(0, pTrackIsSelected[i]));
		pTrack[i].arm().markInterested();
		pDeviceBank[i] = pTrack[i].createDeviceBank(1);
		pDevice[i] = pDeviceBank[i].getDevice(0);
		//pDevice[i].name().addValueObserver(getpDeviceName);
		pDevice[i].isRemoteControlsSectionVisible().markInterested();
		pDRCP[i] = pDevice[i].createCursorRemoteControlsPage(8);
		for (var k=0; k<8; k++){
			pDRCP[i].getParameter(k).addValueObserver(127, getDeviceParamValue(k, pDeviceParam[i]));
		}
	}

	pTrack[0].color().addValueObserver(getTrackObserverFunc(0, pTrackColor1));
	pTrack[1].color().addValueObserver(getTrackObserverFunc(0, pTrackColor2));
	pTrack[2].color().addValueObserver(getTrackObserverFunc(0, pTrackColor3));
	pTrack[3].color().addValueObserver(getTrackObserverFunc(0, pTrackColor4));

	effectTrackBank = host.createEffectTrackBank(8, 8)
	for(var t=0; t<8; t++) {
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
	
    cursorClip = host.createCursorClip(SEQ_STEPS, SEQ_KEYS);
    cursorClip.addStepDataObserver(onStepExists);
    cursorClip.addPlayingStepObserver(onStepPlaying);
	cursorClip.getPlayStart().addRawValueObserver(getClipStart);
	cursorClip.getPlayStop().addRawValueObserver(getClipStop);
	cursorClip.getLoopStart().addRawValueObserver(getClipLoopStart);
	cursorClip.getLoopLength().addRawValueObserver(getClipLoopLength);
	cursorClip.clipLauncherSlot().isPlaying().addValueObserver(getCursorClipIsPlaying);
	cursorClip.clipLauncherSlot().isRecording().addValueObserver(getCursorClipIsRecording);
	cursorClip.clipLauncherSlot().hasContent().addValueObserver(getCusrorClipHasContent);
	cursorClip.clipLauncherSlot().color().addValueObserver(getCursorClipColor(0, cursorClipColor));
	//cursorTrack.clipLauncherSlot().isStopped().addValueObserver(getCursorClipIsStopped);

	deviceTrackBank = host.createTrackBank(11, 11, 8);
	deviceTrackBank.addTrackScrollPositionObserver(getDeviceTrackBankScrollPosition, 0);

	cursorTrack = host.createCursorTrack("ct", "ct", 2, 0, true)
	cursorTrack.color().addValueObserver(getTrackObserverFunc(0, cursorTrackColor));
	cursorTrack.color().markInterested();
	cursorTrack.volume().markInterested();
	cursorTrack.pan().markInterested();
	cursorTrack.arm().markInterested();
	cursorTrack.mute().markInterested();
	cursorTrack.solo().markInterested();

	//deviceTrackBank.followCursorTrack(cursorTrack);
	deviceTrackBank.channelCount().markInterested();
	deviceTrackBank.channelScrollPosition().markInterested();

	cursorDevice =  cursorTrack.createCursorDevice("cd", "cd", 2, CursorDeviceFollowMode.FOLLOW_SELECTION);
	cursorDevice.name().addValueObserver(getCursorDeviceName);
	cursorDevice.position().addValueObserver(getDevicePositionObserver);

	cursorDeviceBank = cursorTrack.createDeviceBank(32);
	cursorDeviceBank.canScrollBackwards().addValueObserver(getcursorDeviceBankCanScrollBackwards);
	cursorDeviceBank.canScrollForwards().addValueObserver(getcursorDeviceBankCanScrollForwards);
	cursorDeviceBank.addDeviceCountObserver(getcursorDeviceBankCount);

	cursorDRCP = cursorDevice.createCursorRemoteControlsPage(8);
	cursorDRCP.getName().addValueObserver(getCursorDRCPName);
	cursorDRCP.pageCount().addValueObserver(getCursorDRCPCount);
	cursorDRCP.selectedPageIndex().addValueObserver(getCursorDRCPIndex);
	
	for (var i=0; i<8; i++){
		cursorDRCP.getParameter(i).addValueObserver(127, getDeviceParamValue(i, cursorDeviceParam));
	}

    mainTrackBank.setChannelScrollStepSize(channelStepSize);
	effectTrackBank.setChannelScrollStepSize(channelStepSize);

	hardwareSurface = host.createHardwareSurface();

	//for (var i=0; i<16; i++){
	//knob = hardwareSurface.createAbsoluteHardwareKnob('temp');
	//knob.targetName().markInterested();
	//}

	MIXERMODE = mixerMode.EIGHT;
	OVMODE = ovMode.OVERVIEW;
	P1MODE = pMode.DEVICE;
	P2MODE = pMode.DEVICE;
	pageIndex = 0;
	activePage = overviewPage;
	setActivePage(overviewPage);
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
		|| varToStore == cursorTrackColor
		|| varToStore == pTrackColor[0]) {
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
function getDeviceTrackBankScrollPosition (value){
	deviceTrackBankScrollPosition = value;
}

function getcursorDeviceBankCanScrollBackwards (value){
	cursorDeviceBankCanScrollBackwards = value;
}

function getcursorDeviceBankCanScrollForwards(value){
	cursorDeviceBankCanScrollForwards = value;
}

function getDevicePositionObserver(value){
	devicePositionObserver = value;
}

//the api doesn't work properly for this function
//function getCursorTrackPositionObserver(value){
//	cursorTrackPositionObserver = value;
//}

/*
function getpDeviceName(value){
	pDeviceName[i] = value;
}

function getpTrackName(value){
	pTrackName[i] = value;
}
*/

function getCursorDeviceName(value){
	cursorDeviceName = value;
}

function getcursorDeviceBankCount(value){
	cursorDeviceBankCount = value;
}

function getCursorClipIsPlaying(value){
	cursorClipIsPlaying = value;
}

function getCursorClipIsRecording(value){
	cursorClipIsRecording = value;
}

function getCursorClipIsStopped(value){
	cursorClipIsStopped = value;
}

function getCusrorClipHasContent(value){
	cursorClipHasContent = value;
}

function getCursorClipColor(t, value){
	return function(r, g, b) {
		value[t] = handleColor(r,g,b);
	}
}

function onMidi(status, data1, data2){
	printMidi(status, data1, data2);
	var isActive = (data2 > 0);
	
	enc = data1 - activePage.bankEncOffset;
	val = data2;

	if (status == statusType.ENCODER_TURN){
		activePage.onEncoderTurn(isActive);
	}else if (status == statusType.ENCODER_PRESS && data2 == 127){
		activePage.onEncoderPress(isActive);
	}else if (status == statusType.ENCODER_PRESS && data2 == 0){
		activePage.onEncoderRelease(isActive);
	}else if(status == statusType.SIDEBUTTON){
		data1 = data1 - activePage.bankSBOffset;
		switch(data1){
			case (SIDE_BUTTON.LH_BOTTOM): 
				data2 == 127 ? activePage.onLeftBottomPressed(isActive) : activePage.onLeftBottomReleased(isActive);
				break;
			case SIDE_BUTTON.LH_MIDDLE: 
				data2 == 127 ? activePage.onLeftMiddlePressed(isActive) : activePage.onLeftMiddleReleased(isActive);
				break
			case SIDE_BUTTON.LH_TOP: 
				data2 == 127 ? activePage.onLeftTopPressed(isActive) : activePage.onLeftTopReleased(isActive);
				break;
			case SIDE_BUTTON.RH_BOTTOM: 
				data2 == 127 ? activePage.onRightBottomPressed(isActive) : activePage.onRightBottomReleased(isActive);
				break;
			case SIDE_BUTTON.RH_MIDDLE: 
				data2 == 127 ? activePage.onRightMiddlePressed(isActive) : activePage.onRightMiddleReleased(isActive);
				break
			case SIDE_BUTTON.RH_TOP: 
				data2 == 127 ? activePage.onRightTopPressed(isActive) : activePage.onRightTopReleased(isActive);
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
	//println('knob binding = ' + knob.targetName().get())
}

function setRGBLED(loc, color, strobe){
	loc = loc + activePage.bankEncOffset;
	sendMidi(177, loc, color);
	sendMidi(178, loc, strobe);
	//pendingRGBLEDs[loc] = color;
	//pendingRGBSTROBEs[loc] = strobe;
}

function set11segLED(loc, value){
	loc = loc + activePage.bankEncOffset;
	sendMidi(176, loc, value);
	//pending11segLEDs[loc] = value;
}

function flushLEDs(){
	/*var changedRGBCount = 0;
	var changedRGBStrobeCount = 0;
	var changed11segCount = 0;*/

	
	/*for(var i=0; i<64; i++){
    	if (pendingRGBLEDs[i] != activeRGBLEDs[i]) changedRGBCount++;
		if (pending11segLEDs[i] != active11segLEDs[i]) changed11segCount++;
		if (pendingRGBSTROBEs[i] != activeRGBSTROBEs[i]) changedRGBStrobeCount++;
   	}

	if (changedRGBCount == 0 && changed11segCount == 0 && changedRGBStrobeCount == 0) return;*/

	/*
	for(var i = 0; i<64; i++){
		println('pending: ' + pendingRGBLEDs[i]);
		println('active1: ' + activeRGBLEDs[i]);
		println('i= ' + i);
		if (pendingRGBLEDs[i] != activeRGBLEDs[i]){
			activeRGBLEDs[i] = pendingRGBLEDs[i];
			var color = activeRGBLEDs[i];
			sendMidi(177, i, color);
			println('i= ' + i + ': color= ' + color);
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
	}*/

	//println('active2: ' + activeRGBLEDs);
}

clearIndicators = function(){

	for (var k=0; k<4; k++){
		for (var i=0; i<8; i++){
			cursorDRCP.getParameter(i).setIndication(false);
			pDRCP[k].getParameter(i).setIndication(false);
			mainTrackBank.getChannel(i).getVolume().setIndication(false);
			mainTrackBank.getChannel(i).getPan().setIndication(false);
			effectTrackBank.getChannel(i).getVolume().setIndication(false);
			effectTrackBank.getChannel(i).getPan().setIndication(false);
			for (var s=0; s<11; s++){
				mainTrackBank.getChannel(i).getSend(s).setIndication(false);
			}
		}
		pTrack[k].getVolume().setIndication(false);
		pTrack[k].getPan().setIndication(false);
		for (var j=0; j<6; j++){
			pTrack[k].getSend(j).setIndication(false);
		}
	}
	
	cursorTrack.getVolume().setIndication(false);
	cursorTrack.getPan().setIndication(false);
    masterTrack.getVolume().setIndication(false);
	masterTrack.getPan().setIndication(false);
	
}

function cyclePage(){
	
    switch(pageIndex){
		case 0:
			setActivePage(overviewPage);
			pageIndex ++ 
            break;
		case 1: 
			setActivePage(mixerPage);
			pageIndex ++ 
            break;
        case 2:
			setActivePage(userPage);
			pageIndex ++ 
			break;
		case 3: 
			if (CURRENTSEQMODE == currentSeqMode.DRUM){
				setActivePage(drumSequencerPage);
			}else if (CURRENTSEQMODE == currentSeqMode.MELODIC){
				setActivePage(melodicSequencerPage);
			}
			pageIndex = 0;
			break;
	}
	
	
}

function setActivePage(page){
	for (var i=0; i<16; i++){
        set11segLED(i, 0);
		setRGBLED(i, COLOR.BLACK, STROBE.OFF);
	}
	clearIndicators();
	activePage = page;
	changeEncoderBank(activePage.bank);
	host.showPopupNotification(page.title);
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
	sendMidi(179, bank, 127);
}