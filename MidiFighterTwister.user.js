
userPage = new page();

userPage.title = "User";
userPage.bank = BANK[1];
userPage.bankEncOffset = BANK_ENC_OFFSET[1];
userPage.bankSBOffset = BANK_SB_OFFSET[1];

var rgbDeviceDone = false;
var tempRainbow = 80;

userPage.updateOutputState = function(){
    clear();
    this.updateRGBLEDs();
    this.update11segLEDs();
    this.updateIndicators();
}

userPage.onEncoderPress = function(isActive){
}

userPage.onEncoderRelease = function(isActive){
}

userPage.onEncoderTurn = function(isActive){
}

userPage.onRightTopPressed = function(isActive){
}

userPage.onRightTopReleased = function(isActive){
}

userPage.onRightMiddlePressed = function(isActive){
}

userPage.onRightMiddleReleased = function(isActive){
}

userPage.onRightBottomPressed = function(isActive){
}

userPage.onRightBottomReleased = function(isActive){
}

userPage.onLeftTopPressed = function(isActive){
}

userPage.onLeftTopReleased = function(isActive){
    cyclePage();
}

userPage.onLeftMiddlePressed = function(isActive){
}

userPage.onLeftMiddleReleased = function(isActive){
}

userPage.onLeftBottomPressed = function(isActive){
}

userPage.onLeftBottomReleased = function(isActive){
}

userPage.updateRGBLEDs = function(){
    for(var i=0; i<16; i++){
        setRGBLED(i, INDICATOR_COLOR[i%8], STROBE.OFF);
    }
}

userPage.update11segLEDs = function(){
}

userPage.updateIndicators = function(){
}

userPage.deviceChangePopup = function(){
}

userPage.clearIndication = function(){
}