
overviewPage = new page();

overviewPage.title = "Track Overveiw";
overviewPage.bank = BANK[0];
overviewPage.bankEncOffset = BANK_ENC_OFFSET[0];
overviewPage.bankSBOffset = BANK_SB_OFFSET[0];

var rgbDeviceDone = false;
var tempRainbow = 80;

overviewPage.updateOutputState = function(){
    clear();
    this.updateRGBLEDs();
    this.update11segLEDs();
    this.updateIndicators();
    this.deviceChangePopup();
}

overviewPage.onEncoderPress = function(isActive){
}

overviewPage.onEncoderRelease = function(isActive){
    if (enc == ENC.OVERVIEW.TRACK_SEL){
        cursorTrack.arm().toggle();
    }else if (enc == ENC.OVERVIEW.PAN){
        cursorTrack.solo().toggle();
    }else if (enc == ENC.OVERVIEW.VOLUME){
            cursorTrack.mute().toggle();
    }else if(enc == ENC.OVERVIEW.CLIP){
        if(cursorClipIsPlaying){
            cursorClip.getTrack().stop();
        }else if(cursorClipIsRecording || cursorClipHasContent){
            cursorClip.launch();
        }
    }
}

overviewPage.onEncoderTurn = function(isActive){
    if(enc < 8){
        cursorDRCP.getParameter(enc).set(val,127);
    }else if(enc == ENC.OVERVIEW.DEVICE) {
        (val > 64) ? (tempCursorDI ++) : (tempCursorDI --);
        if (tempCursorDI > 5){
            tempCursorDI = 0;
            cursorDevice.selectNext();
            cursorDevice.selectInEditor();
        }else if(tempCursorDI < -5){
            tempCursorDI = 0;
            cursorDevice.selectPrevious();
            cursorDevice.selectInEditor();
        }
        /*var tempIndex = scaleValue(val, 127, 0, (cursorDeviceBankCount-1));
        var tempDevice = cursorDeviceBank.getDevice(tempIndex);
        cursorDeviceBank.scrollIntoView(tempIndex);
        cursorDevice.selectDevice(tempDevice);*/
        host.showPopupNotification(cursorDeviceName)
    }else if(enc == ENC.OVERVIEW.PAGE){
        (val > 64) ? (tempCursorDRCPI ++) : (tempCursorDRCPI --);
        if (tempCursorDRCPI > 5){
            tempCursorDRCPI = 0;
            cursorDRCP.selectNext();
        }else if(tempCursorDRCPI < -5){
            tempCursorDRCPI = 0;
            cursorDRCP.selectPrevious();
        }
        //cursorDRCP.selectedPageIndex().set(scaleValue(val, 127, 0, (cursorDRCPCount-1)));
        host.showPopupNotification(cursorDRCPName)
    }else if(enc == ENC.OVERVIEW.PAN){
        cursorTrack.pan().set(val,127);
    }else if(enc == ENC.OVERVIEW.TRACK_SEL){
        (val > 64) ? (cursorTrackPosition ++) : (cursorTrackPosition --);
        if (cursorTrackPosition > 5){
            cursorTrackPosition = 0;
            cursorTrack.selectNext();
            cursorTrack.makeVisibleInMixer();
        }else if(cursorTrackPosition < -5){
            cursorTrackPosition = 0;
            cursorTrack.selectPrevious();
            cursorTrack.makeVisibleInMixer();
        }
    }else if(enc == ENC.OVERVIEW.CLIP){
        /*(val > 64) ? (cursorClipPosition ++) : (cursorClipPosition --);
        if (cursorClipPosition > 5){
            cursorClipPosition = 0;
            cursorClip.selectNext();
        }else if(cursorClipPosition < -5){
            cursorClipPosition = 0;
            cursorClip.selectPrevious();
        }*/
    }else if(enc == ENC.OVERVIEW.VOLUME){
        cursorTrack.volume().set(val,127);
        /*var tempIndex = scaleValue(val, 127, 0, 10);
        var tempChannel = deviceTrackBank.getChannel(tempIndex);
        deviceTrackBank.scrollToChannel(scaleValue(val, 127, 0, 10));
        cursorTrack.selectChannel(tempChannel);
        println('scroll = ' + scaleValue(val, 127, 0, 10));
        println('channelCount = ' + deviceTrackBank.channelCount().get())
        println('scrollPos = ' + deviceTrackBank.channelScrollPosition().get())*/
    }
}

overviewPage.onRightTopPressed = function(isActive){
}

overviewPage.onRightTopReleased = function(isActive){
    setActivePage(perform2Page);
    OVMODE = ovMode.PERFORM2;
}

overviewPage.onRightMiddlePressed = function(isActive){
}

overviewPage.onRightMiddleReleased = function(isActive){
    setActivePage(mixerPage);
}

overviewPage.onRightBottomPressed = function(isActive){
}

overviewPage.onRightBottomReleased = function(isActive){
    setActivePage(userPage);
}

overviewPage.onLeftTopPressed = function(isActive){
}

overviewPage.onLeftTopReleased = function(isActive){
}

overviewPage.onLeftMiddlePressed = function(isActive){
}

overviewPage.onLeftMiddleReleased = function(isActive){    
}

overviewPage.onLeftBottomPressed = function(isActive){
}

overviewPage.onLeftBottomReleased = function(isActive){
}

overviewPage.updateRGBLEDs = function(){
    for(var i=0; i<8; i++){
        setRGBLED(i, INDICATOR_COLOR[i], STROBE.OFF);
    }

    if (cursorTrack.arm().get()){
        setRGBLED(ENC.OVERVIEW.TRACK_SEL, COLOR.RED, STROBE.PULSE1);
    }else{
        setRGBLED(ENC.OVERVIEW.TRACK_SEL, cursorTrackColor[0], STROBE.OFF);
    }

    setRGBLED(ENC.OVERVIEW.DEVICE, RAINBOW_ARRAY[(devicePositionObserver%cursorDeviceBankCount)%(RAINBOW_ARRAY.length-1)], STROBE.OFF);
    setRGBLED(ENC.OVERVIEW.PAGE, RAINBOW_ARRAY[(cursorDRCPIndex%cursorDRCPCount)%(RAINBOW_ARRAY.length-1)], STROBE.OFF);
    
    if (cursorTrack.solo().get()){
        setRGBLED(ENC.OVERVIEW.PAN, COLOR.DARK_BLUE, STROBE.PULSE1);
    }else{
        setRGBLED(ENC.OVERVIEW.PAN, cursorTrackColor[0], STROBE.OFF);
    }
    
    if (cursorTrack.mute().get()){
        setRGBLED(ENC.OVERVIEW.VOLUME, COLOR.BROWN, STROBE.PULSE1);
    }else{
        setRGBLED(ENC.OVERVIEW.VOLUME, cursorTrackColor[0], STROBE.OFF);
    }

    if (cursorClipIsPlaying){
        setRGBLED(ENC.OVERVIEW.CLIP, cursorClipColor[0], STROBE.PULSE1);
    }else if (cursorClipIsRecording){
        setRGBLED(ENC.OVERVIEW.CLIP, COLOR.RED, STROBE.PULSE1);
    }else if(cursorClipHasContent){
        setRGBLED(ENC.OVERVIEW.CLIP, cursorClipColor[0], STROBE.OFF);
    }else{
        setRGBLED(ENC.OVERVIEW.CLIP, COLOR.BLACK, STROBE.OFF);
    }
    
}

overviewPage.update11segLEDs = function(){
    for(var i=0; i<8; i++){
        set11segLED(i, cursorDeviceParam[i]);
    }
    set11segLED(ENC.OVERVIEW.DEVICE, scaleValue(devicePositionObserver, (cursorDeviceBankCount-1), 0, 127));
    set11segLED(ENC.OVERVIEW.PAGE, scaleValue(cursorDRCPIndex, (cursorDRCPCount-1), 1, 127));
    set11segLED(ENC.OVERVIEW.TRACK_SEL, 0);
    set11segLED(ENC.OVERVIEW.PAN, scaleValue(cursorTrack.pan().get(), 1, 0, 127));
    set11segLED(ENC.OVERVIEW.VOLUME, scaleValue(cursorTrack.volume().get(), 1, 0, 127));
}

overviewPage.updateIndicators = function(){
    for (var i=0; i<8; i++){
        cursorDRCP.getParameter(i).setIndication(true);
    }
    cursorTrack.getVolume().setIndication(true);
    cursorTrack.getPan().setIndication(true);
}

overviewPage.deviceChangePopup = function(){
    //host.showPopupNotification('Device: ' + cursorDeviceName + ', ' + cursorDRCPName);
}

function scaleValue(value, scaleIn, outMin, outMax){
    var temp = Math.round((value/scaleIn) * (outMax-outMin));
    if (temp < 0){
        temp = 0
    }else if (temp > 127){
        temp = 127
    }
    return temp;
}