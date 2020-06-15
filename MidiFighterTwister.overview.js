
overviewPage = new page();

overviewPage.title = "Device";
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
}

overviewPage.onEncoderTurn = function(isActive){
    if(enc < 8){
        cursorDRCP.getParameter(enc).set(val,127);
    }else if(enc == ENC.OVERVIEW.DEVICE) {
        var tempIndex = scaleValue(val, 127, 0, (deviceBank1Count-1));
        var tempDevice = deviceBank1.getDevice(tempIndex);
        deviceBank1.scrollIntoView(tempIndex);
        cursorDevice.selectDevice(tempDevice);
        host.showPopupNotification(cursorDeviceName)
    }else if(enc == ENC.OVERVIEW.PAGE){
        cursorDRCP.selectedPageIndex().set(scaleValue(val, 127, 0, (cursorDRCPCount-1)));
        host.showPopupNotification(cursorDRCPName)
    }else if(enc == ENC.OVERVIEW.PAN){
        cursorTrack.getPan().set(val,127);
    }else if(enc == ENC.OVERVIEW.VOLUME){
        cursorTrack.getVolume().set(val,127);
    }else if(enc == ENC.OVERVIEW.TRACK_SEL){
        var tempIndex = scaleValue(val, 127, 0, 10);
        var tempChannel = deviceTrackBank.getChannel(tempIndex);
        deviceTrackBank.scrollToChannel(scaleValue(val, 127, 0, 10));
        cursorTrack.selectChannel(tempChannel);
        //println('scroll = ' + scaleValue(val, 127, 0, 10));
        //println('channelCount = ' + deviceTrackBank.channelCount().get())
        //println('scrollPos = ' + deviceTrackBank.channelScrollPosition().get())
    }
}

overviewPage.onRightTopPressed = function(isActive){
}

overviewPage.onRightTopReleased = function(isActive){
}

overviewPage.onRightMiddlePressed = function(isActive){
}

overviewPage.onRightMiddleReleased = function(isActive){
}

overviewPage.onRightBottomPressed = function(isActive){
}

overviewPage.onRightBottomReleased = function(isActive){
}

overviewPage.onLeftTopPressed = function(isActive){
}

overviewPage.onLeftTopReleased = function(isActive){
    cyclePage();
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
    setRGBLED(ENC.OVERVIEW.DEVICE, RAINBOW_ARRAY[(devicePositionObserver%deviceBank1Count)%(RAINBOW_ARRAY.length-1)], STROBE.OFF);
    setRGBLED(ENC.OVERVIEW.PAGE, RAINBOW_ARRAY[(cursorDRCPIndex%cursorDRCPCount)%(RAINBOW_ARRAY.length-1)], STROBE.OFF);
    setRGBLED(ENC.OVERVIEW.TRACK_SEL, cursorTrackColor[0], STROBE.OFF);
    setRGBLED(ENC.OVERVIEW.PAN, cursorTrackColor[0], STROBE.OFF);
    setRGBLED(ENC.OVERVIEW.VOLUME, cursorTrackColor[0], STROBE.OFF);
}

overviewPage.update11segLEDs = function(){
    for(var i=0; i<8; i++){
        set11segLED(i, cursorDeviceParam[i]);
    }
    set11segLED(ENC.OVERVIEW.DEVICE, scaleValue(devicePositionObserver, (deviceBank1Count-1), 0, 127));
    set11segLED(ENC.OVERVIEW.PAGE, scaleValue(cursorDRCPIndex, (cursorDRCPCount-1), 1, 127));
    //set11segLED(ENC.OVERVIEW.TRACK_SEL, scaleValue(cursorTrackPositionObserver, 11, 1, 127));
    //println('pos = ' + deviceTrackBankScrollPosition);
    set11segLED(ENC.OVERVIEW.PAN, cursorTrackPan[0]);
    set11segLED(ENC.OVERVIEW.VOLUME, cursorTrackVolume[0]);
}

overviewPage.updateIndicators = function(){
    for (var i=0; i<8; i++){
        cursorDRCP.getParameter(i).setIndication(true);
    }
    cursorTrack.getVolume().setIndication(true);
    cursorTrack.getPan().setIndication(true);
}

overviewPage.deviceChangePopup = function(){
    host.showPopupNotification('Device: ' + cursorDeviceName + ', ' + cursorDRCPName);
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