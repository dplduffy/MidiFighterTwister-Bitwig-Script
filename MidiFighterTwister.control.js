
loadAPI(14);
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
	application = host.createApplication();
	
	mainTrackBank = host.createMainTrackBank(8, 12, 8);

    for(var t=0; t<8; t++) {
		track[t] = mainTrackBank.getItemAt(t);
		track[t].volume().markInterested();
		track[t].pan().markInterested();	
		track[t].mute().markInterested();
		track[t].solo().markInterested();
		track[t].color().markInterested();
		track[t].arm().markInterested();

		track[t].addIsSelectedInMixerObserver(getTrackObserverFunc(t, mainIsSelected));

		for(var s=0; s<12; s++) {
			track[t].getSend(s).addValueObserver(126, getSendObserverFunc(t, s));
		}
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
		pTrack[i].mute().markInterested();
		pTrack[i].solo().markInterested();
		pTrack[i].arm().markInterested();
		pTrack[i].color().markInterested();

		for (var j=0; j<6; j++){
			pTrack[i].getSend(j).markInterested();
		}

		pTrack[i].addIsSelectedInMixerObserver(getTrackObserverFunc(i, pTrackIsSelected));
		
		pDeviceBank[i] = pTrack[i].createDeviceBank(1);
		pDevice[i] = pDeviceBank[i].getDevice(0);
		//pDevice[i].name().addValueObserver(getpDeviceName);
		pDevice[i].isRemoteControlsSectionVisible().markInterested();
		pDRCP[i] = pDevice[i].createCursorRemoteControlsPage(8);
		for (var k=0; k<8; k++){
			pDRCP[i].getParameter(k).addValueObserver(127, getDeviceParamValue(k, pDeviceParam[i]));
		}
	}

	effectTrackBank = host.createEffectTrackBank(8, 8)

	for(var i=0; i<8; i++) {
		effectTrack[i] = effectTrackBank.getChannel(i);
		effectTrack[i].volume().markInterested();
		effectTrack[i].pan().markInterested();
		effectTrack[i].mute().markInterested();
		effectTrack[i].solo().markInterested();
		effectTrack[i].color().markInterested();
		effectTrack[i].arm().markInterested();
		effectTrack[i].addIsSelectedInMixerObserver(getTrackObserverFunc(t, effectIsSelected));
    }
	
	effectTrackBank.canScrollChannelsUp().addValueObserver(function(canScroll){
		mixerPage.canScrollEffectChannelsUp = canScroll;});
	effectTrackBank.canScrollChannelsDown().addValueObserver(function(canScroll){
		mixerPage.canScrollEffectChannelsDown = canScroll;});
	
	
	masterTrack = host.createMasterTrack(8);
	masterTrack.volume().markInterested;
	masterTrack.pan().markInterested;
	masterTrack.mute().markInterested;
	masterTrack.solo().markInterested;
	masterTrack.color().markInterested;
	masterTrack.arm().markInterested;
	masterTrack.addIsSelectedInMixerObserver(getTrackObserverFunc(0, masterIsSelected));
	
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
	//cursorTrack.color().addValueObserver(getTrackObserverFunc(0, cursorTrackColor));
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
	cursorDevice.isRemoteControlsSectionVisible().markInterested();

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

	MIXERMODE = mixerMode.MAIN;
	OVMODE = ovMode.OVERVIEW;
	P1MODE = pMode.DEVICE;
	P2MODE = pMode.DEVICE;
	pageIndex = 0;
	setActivePage(overviewPage);
}

function getSendObserverFunc(t, s){
	return function(value){
		sendArray[t][s] = value;
	}
}

function getTrackObserverFunc(track, varToStore) {
	return function(value) {
		varToStore[track] = value;
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
}

function setRGBLED(loc, color, strobe){
	loc = loc + activePage.bankEncOffset;
	color == null ? color = 0 : color = color;
	sendMidi(177, loc, color);
	sendMidi(178, loc, strobe);
}

function set11segLED(loc, value){
	//println("loc = " + loc)
	//println("value = " + value)
	value == null ? value = 0 : value = value;
	//println("value2 = " + value)
	loc = loc + activePage.bankEncOffset;
	sendMidi(176, loc, value);
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

// function cyclePage(){
//     switch(pageIndex){
// 		case 0:
// 			setActivePage(overviewPage);
// 			pageIndex ++ 
//             break;
// 		case 1: 
// 			setActivePage(mixerPage);
// 			pageIndex ++ 
//             break;
//         case 2:
// 			setActivePage(userPage);
// 			pageIndex ++ 
// 			break;
// 		case 3: 
// 			if (CURRENTSEQMODE == currentSeqMode.DRUM){
// 				setActivePage(drumSequencerPage);
// 			}else if (CURRENTSEQMODE == currentSeqMode.MELODIC){
// 				setActivePage(melodicSequencerPage);
// 			}
// 			pageIndex = 0;
// 			break;
// 	}	
// }

function setActivePage(page){
	activePage = page;
	for (var i=0; i<16; i++){
		set11segLED(i, 0);
	}
	clearIndicators();
	changeEncoderBank(activePage.bank);
	if (activePage == mixerPage) {
		host.showPopupNotification("Mixer Mode: "+mixerModeArray[MIXERMODE]);
	}else{
		host.showPopupNotification(page.title);
	}

}

function getTrackColor(track){
	return handleColor(track.color().red(), track.color().green(), track.color().blue())
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

function scaleValue(value, scaleIn, outMin, outMax){
    if (scaleIn != 0){
        var temp = Math.round((value/scaleIn) * (outMax-outMin));
    }else{
        temp = 0;
    }
    
    if (temp <= 0){
        temp = 0
    }else if (temp >= 127){
        temp = 127
    }
    return temp;
}

function changeEncoderBank(bank){
	sendMidi(179, bank, 127);
}