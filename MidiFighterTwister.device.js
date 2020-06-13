
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
    var tempEncoderTurn = encoderNum - encoderBankOffset.BANK4;
    
    if(tempEncoderTurn < 8){
    cursorDRCP.getParameter(tempEncoderTurn).set(encoderValue,127);
    } else if(tempEncoderTurn == ENC.DEVICE) {
        var tempIndex = scaleValue(encoderValue, 127, (deviceBank1Count-1));
        var tempDevice = deviceBank1.getDevice(tempIndex);

        deviceBank1.scrollIntoView(tempIndex);
        cursorDevice.selectDevice(tempDevice);

        host.showPopupNotification(cursorDeviceName)
    } else if(tempEncoderTurn == ENC.PAGE){
        cursorDRCP.selectedPageIndex().set(scaleValue(encoderValue, 127, (cursorDRCPCount-1)));
        host.showPopupNotification(cursorDRCPName)
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
    ENCODERBANK = 2;
    changeEncoderBank(ENCODERBANK);
	setActivePage(mixerPage);
}

devicePage.onLeftMiddlePressed = function(isActive){
}

devicePage.onLeftMiddleReleased = function(isActive){
    ENCODERBANK = 3;
    changeEncoderBank(ENCODERBANK);
	
    if (CURRENTSEQMODE == currentSeqMode.DRUM){
		setActivePage(drumSequencerPage);
	} else if (CURRENTSEQMODE == currentSeqMode.MELODIC){
        setActivePage(melodicSequencerPage);
    }
}

devicePage.onLeftBottomPressed = function(isActive){
}

devicePage.onLeftBottomReleased = function(isActive){
    host.showPopupNotification('Device: ' + cursorDeviceName + ', ' + cursorDRCPName);
    this.clearIndication();
}

devicePage.updateRGBLEDs = function(){
    for(var i=0; i<16; i++){
        if(i < 8) {
            setRGBLED(i+encoderBankOffset.BANK4, INDICATOR_COLOR[i], STROBE.OFF);
        } else if(i == ENC.DEVICE){
            setRGBLED(i+encoderBankOffset.BANK4, rainbowArray[(devicePositionObserver%deviceBank1Count)%(rainbowArray.length-1)], STROBE.OFF);
        } else if(i == ENC.PAGE){
            setRGBLED(i+encoderBankOffset.BANK4, rainbowArray[(cursorDRCPIndex%(cursorDRCPCount-1))%(rainbowArray.length-1)], STROBE.OFF);
        } else if(i == ENC.PAN){
            println("cursorTrackColor : " + cursorTrackColor[0])
            setRGBLED(i+encoderBankOffset.BANK4, cursorTrackColor[0], STROBE.OFF);
        }
    }
}

devicePage.update11segLEDs = function(){
    for(var i=0; i<16; i++){
        if (i<8){
            set11segLED(i+encoderBankOffset.BANK4, cursorDeviceParam[i]);
        } else if(i == ENC.DEVICE){
            set11segLED(i+encoderBankOffset.BANK4+8, scaleValue(devicePositionObserver, (deviceBank1Count-1), 127));
        } else if(i == ENC.PAGE){
            cursorDRCPCount > 1 ?
                set11segLED(i+encoderBankOffset.BANK4+8,scaleValue(cursorDRCPIndex, (cursorDRCPCount-1), 127)) :
                    set11segLED(i+encoderBankOffset.BANK4+8, 0);
        } else{
            set11segLED(i+encoderBankOffset.BANK4 +8, 0);
        }
    }
}

devicePage.updateIndicators = function(){
    for (var i=0; i<8; i++){
        cursorDRCP.getParameter(i).setIndication(true);
    }
}

devicePage.deviceChangePopup = function(){
    host.showPopupNotification('Device: ' + cursorDeviceName + ', ' + cursorDRCPName);
}

devicePage.clearIndication = function(){
    for (var i=0; i<8; i++){
        cursorDRCP.getParameter(i).setIndication(false);
    }
}

function scaleValue(value, scaleIn, scaleOut){
    return Math.round(((value/scaleIn) * scaleOut))
}