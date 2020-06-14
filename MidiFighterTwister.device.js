
devicePage = new page();

devicePage.title = "Device";

var rgbDeviceDone = false;
var tempRainbow = 80;

devicePage.updateOutputState = function(){
    clear();
    this.updateRGBLEDs();
    this.update11segLEDs();
    this.updateIndicators();
    this.deviceChangePopup();
}

devicePage.onEncoderPress = function(isActive){
}

devicePage.onEncoderRelease = function(isActive){
}

devicePage.onEncoderTurn = function(isActive){
    if(enc < 8){
        cursorDRCP.getParameter(enc).set(val,127);
    }else if(enc == ENC.DEVICE) {
        var tempIndex = scaleValue(val, 127, 0, (deviceBank1Count-1));
        var tempDevice = deviceBank1.getDevice(tempIndex);
        deviceBank1.scrollIntoView(tempIndex);
        cursorDevice.selectDevice(tempDevice);
        host.showPopupNotification(cursorDeviceName)
    }else if(enc == ENC.PAGE){
        cursorDRCP.selectedPageIndex().set(scaleValue(val, 127, 0, (cursorDRCPCount-1)));
        host.showPopupNotification(cursorDRCPName)
    }else if(enc == ENC.PAN){
        cursorTrack.getPan().set(val,127);
    }else if(enc == ENC.VOLUME){
        cursorTrack.getVolume().set(val,127);
    }else if(enc == ENC.TRACK_SEL){
        var tempIndex = scaleValue(val, 127, 0, 10);
        var tempChannel = deviceTrackBank.getChannel(tempIndex);
        deviceTrackBank.scrollToChannel(scaleValue(val, 127, 0, 10));
        cursorTrack.selectChannel(tempChannel);
        //println('scroll = ' + scaleValue(val, 127, 0, 10));
        //println('channelCount = ' + deviceTrackBank.channelCount().get())
        //println('scrollPos = ' + deviceTrackBank.channelScrollPosition().get())
    }
}

devicePage.onRightTopPressed = function(isActive){
}

devicePage.onRightTopReleased = function(isActive){
}

devicePage.onRightMiddlePressed = function(isActive){
}

devicePage.onRightMiddleReleased = function(isActive){
}

devicePage.onRightBottomPressed = function(isActive){
}

devicePage.onRightBottomReleased = function(isActive){
}

devicePage.onLeftTopPressed = function(isActive){
}

devicePage.onLeftTopReleased = function(isActive){
    cyclePage();
}

devicePage.onLeftMiddlePressed = function(isActive){
}

devicePage.onLeftMiddleReleased = function(isActive){    
}

devicePage.onLeftBottomPressed = function(isActive){
}

devicePage.onLeftBottomReleased = function(isActive){
}

devicePage.updateRGBLEDs = function(){
    for(var i=0; i<8; i++){
        setRGBLED(i, INDICATOR_COLOR[i], STROBE.OFF);
    }
    setRGBLED(ENC.DEVICE, rainbowArray[(devicePositionObserver%deviceBank1Count)%(rainbowArray.length-1)], STROBE.OFF);
    setRGBLED(ENC.PAGE, rainbowArray[(cursorDRCPIndex%cursorDRCPCount)%(rainbowArray.length-1)], STROBE.OFF);
    setRGBLED(ENC.TRACK_SEL, cursorTrackColor[0], STROBE.OFF);
    setRGBLED(ENC.PAN, cursorTrackColor[0], STROBE.OFF);
    setRGBLED(ENC.VOLUME, cursorTrackColor[0], STROBE.OFF);
}

devicePage.update11segLEDs = function(){
    for(var i=0; i<8; i++){
        set11segLED(i, cursorDeviceParam[i]);
    }
    set11segLED(ENC.DEVICE, scaleValue(devicePositionObserver, (deviceBank1Count-1), 0, 127));
    set11segLED(ENC.PAGE, scaleValue(cursorDRCPIndex, (cursorDRCPCount-1), 1, 127));
    //set11segLED(ENC.TRACK_SEL, scaleValue(cursorTrackPositionObserver, 11, 1, 127));
    //println('pos = ' + deviceTrackBankScrollPosition);
    set11segLED(ENC.PAN, cursorTrackPan[0]);
    set11segLED(ENC.VOLUME, cursorTrackVolume[0]);
}

devicePage.updateIndicators = function(){
    for (var i=0; i<8; i++){
        cursorDRCP.getParameter(i).setIndication(true);
    }
    cursorTrack.getVolume().setIndication(true);
    cursorTrack.getPan().setIndication(true);
}

devicePage.deviceChangePopup = function(){
    host.showPopupNotification('Device: ' + cursorDeviceName + ', ' + cursorDRCPName);
}

devicePage.clearIndication = function(){
    for (var i=0; i<8; i++){
        cursorDRCP.getParameter(i).setIndication(false);
    }
    cursorTrack.getVolume().setIndication(false);
    cursorTrack.getPan().setIndication(false);
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