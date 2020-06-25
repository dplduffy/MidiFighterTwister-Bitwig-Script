
performPage = new page();

performPage.title = "Perform";
performPage.bank = BANK[1];
performPage.bankEncOffset = BANK_ENC_OFFSET[1];
performPage.bankSBOffset = BANK_SB_OFFSET[1];

var rgbDeviceDone = false;
var tempRainbow = 80;

performPage.updateOutputState = function(){
    clear();
    this.updateRGBLEDs();
    this.update11segLEDs();
    this.updateIndicators();
}

performPage.onEncoderPress = function(isActive){
    if(enc == 0){
        P1MODE = P1MODE ^= true;
        setActivePage(performPage);
    }else if(enc == 2){
        performTrackBank1.scrollChannelsUp();
    }else if(enc == 3){
        performTrackBank1.scrollChannelsDown();
    }else if(enc == 6){
        performDeviceBank1.scrollUp();
    }else if(enc == 7){
        performDeviceBank1.scrollDown();
    }else if(enc == 8){
        P2MODE = P2MODE ^= true;
        setActivePage(performPage);
    }else if(enc == 10){
        performTrackBank2.scrollChannelsUp();
    }else if(enc == 11){
        performTrackBank2.scrollChannelsDown();
    }else if(enc == 14){
        performDeviceBank2.scrollUp();
    }else if(enc == 15){
        performDeviceBank2.scrollDown();
    }
}

performPage.onEncoderRelease = function(isActive){
}

performPage.onEncoderTurn = function(isActive){
    if(enc < 8){
        if (P1MODE == pMode.DEVICE){
            performDRCP1.getParameter(enc).set(val,127);
        }else if(P1MODE == pMode.TRACK){
            if (enc == 0){
                performTrack1.volume().set(val,127);
            }
        }
    }else if(enc < 16){
        if (P2MODE == pMode.DEVICE){
            performDRCP2.getParameter(enc-8).set(val,127);
        }else if(P2MODE == pMode.TRACK){
            if (enc == 8){
                performTrack2.volume().set(val,127);
            }
        }
    }
}

performPage.onRightTopPressed = function(isActive){
}

performPage.onRightTopReleased = function(isActive){
    setActivePage(overviewPage);
    OVMODE = ovMode.OVERVIEW;
}

performPage.onRightMiddlePressed = function(isActive){
}

performPage.onRightMiddleReleased = function(isActive){
    setActivePage(mixerPage)
}

performPage.onRightBottomPressed = function(isActive){
}

performPage.onRightBottomReleased = function(isActive){
    setActivePage(userPage);
}

performPage.onLeftTopPressed = function(isActive){
}

performPage.onLeftTopReleased = function(isActive){
}

performPage.onLeftMiddlePressed = function(isActive){
}

performPage.onLeftMiddleReleased = function(isActive){
}

performPage.onLeftBottomPressed = function(isActive){
}

performPage.onLeftBottomReleased = function(isActive){
}

performPage.updateRGBLEDs = function(){
    for(var i=0; i<16; i++){
        if (i<8){
            if (P1MODE == pMode.DEVICE){
                setRGBLED(i, INDICATOR_COLOR[i], STROBE.OFF);
            }else if(P1MODE == pMode.TRACK){
                setRGBLED(0, performTrack1Color[0], STROBE.OFF);
            } 
        }else if (i<16){
            if (P2MODE == pMode.DEVICE){
                setRGBLED(i, INDICATOR_COLOR[i-8], STROBE.OFF);
            }else if(P2MODE == pMode.TRACK){
                setRGBLED(8, performTrack2Color[0], STROBE.OFF);
            } 
        }
        
    }
}

performPage.update11segLEDs = function(){
    for(var i=0; i<16; i++){
        if (i<8){
            if (P1MODE == pMode.DEVICE){
                set11segLED(i, performDevice1Param[i]);
            }else if(P1MODE == pMode.TRACK){
                set11segLED(0, scaleValue(performTrack1.volume().get(), 1, 0, 127));
            }
        }else if(i<16){
            if (P2MODE == pMode.DEVICE){
                set11segLED(i, performDevice2Param[i-8]);
            }else if(P2MODE == pMode.TRACK){
                set11segLED(8, scaleValue(performTrack2.volume().get(), 1, 0, 127));
            }
        }
    }
}

performPage.updateIndicators = function(){
    host.showPopupNotification(performTrack1Name + ' : ' + performDevice1Name + ' :: ' + performTrack2Name + ' : ' + performDevice2Name);
    
    if(P1MODE == pMode.DEVICE){
        for (var i=0; i<8; i++){
            performDRCP1.getParameter(i).setIndication(true)
        }
    }else if(P1MODE == pMode.TRACK){
        performTrack1.getVolume().setIndication(true);
    }

    if(P2MODE == pMode.DEVICE){
        for (var i=0; i<8; i++){
            performDRCP2.getParameter(i).setIndication(true)
        }
    }else if(P2MODE == pMode.TRACK){
        performTrack2.getVolume().setIndication(true);
    }
}

performPage.deviceChangePopup = function(){
}

performPage.clearIndication = function(){
}