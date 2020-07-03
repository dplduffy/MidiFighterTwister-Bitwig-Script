
perform4Page = new page();

perform4Page.title = "Perform 4";
perform4Page.bank = BANK[1];
perform4Page.bankEncOffset = BANK_ENC_OFFSET[1];
perform4Page.bankSBOffset = BANK_SB_OFFSET[1];

var rgbDeviceDone = false;
var tempRainbow = 80;

perform4Page.updateOutputState = function(){
    clear();
    this.updateRGBLEDs();
    this.update11segLEDs();
    this.updateIndicators();
}

perform4Page.onEncoderPress = function(isActive){

    var i = Math.floor((enc/16)*4);
    
    if((enc%4) == 2){
        (ENC_SHIFT[enc+1]) ? (ROW_SHIFT[i] ^= true) : (ENC_SHIFT[enc] = true);
    }else if((enc%4) == 3){
        (ENC_SHIFT[enc-1]) ? (ROW_SHIFT[i] ^= true) : (ENC_SHIFT[enc] = true);
    }
}

perform4Page.onEncoderRelease = function(isActive){

        var i = Math.floor((enc/16)*4);

        if((enc%4) == 0){
            if (ROW_SHIFT[i]){
                pDeviceBank[i].scrollUp();
                pTrack[i].selectInMixer();
                pDevice[i].selectInEditor();
                pDevice[i].isRemoteControlsSectionVisible().set(1);
            }else{
                PMODE[i] = PMODE[i] ^= true;
                setActivePage(perform4Page);
            }
        }else if((enc%4) == 1){
            if (ROW_SHIFT[i]){
                pDeviceBank[i].scrollDown();
                pTrack[i].selectInMixer();
                pDevice[i].selectInEditor();
                pDevice[i].isRemoteControlsSectionVisible().set(1);
            }else{
                pTrack[i].mute().toggle();
                pTrack[i].selectInMixer();
                pDevice[i].selectInEditor();
                pDevice[i].isRemoteControlsSectionVisible().set(1);
            }
        }else if((enc%4) == 2){
            ENC_SHIFT[enc] = false;
            if (ROW_SHIFT[i]){
                pTrackBank[i].scrollChannelsUp();
                pTrack[i].selectInMixer();
            }else{ 
            }
        }else if((enc%4) == 3){
            ENC_SHIFT[enc] = false;
            if (ROW_SHIFT[i]){
                pTrackBank[i].scrollChannelsDown();
                pTrack[i].selectInMixer();
            }else{
            }
        }
}

perform4Page.onEncoderTurn = function(isActive){

    var i = Math.floor((enc/16)*4);

    if (PMODE[i] == pMode.DEVICE){
        pDRCP[i].getParameter(enc%4).set(val,127);
    }else if(PMODE[i] == pMode.TRACK){
        if ((enc%4) == 0){
            pTrack[i].volume().set(val,127);
        }else if((enc%4) == 1){
            pTrack[i].pan().set(val,127);
        }else if((enc%4) == 2){
            pTrack[i].getSend(0).set(val,127);
        }else if((enc%4) == 3){
            pTrack[i].getSend(1).set(val,127);
        }
    }
}

perform4Page.onRightTopPressed = function(isActive){
}

perform4Page.onRightTopReleased = function(isActive){
    setActivePage(overviewPage);
    OVMODE = ovMode.OVERVIEW;
}

perform4Page.onRightMiddlePressed = function(isActive){
}

perform4Page.onRightMiddleReleased = function(isActive){
    setActivePage(mixerPage)
}

perform4Page.onRightBottomPressed = function(isActive){
}

perform4Page.onRightBottomReleased = function(isActive){
    setActivePage(userPage);
}

perform4Page.onLeftTopPressed = function(isActive){
}

perform4Page.onLeftTopReleased = function(isActive){
}

perform4Page.onLeftMiddlePressed = function(isActive){
}

perform4Page.onLeftMiddleReleased = function(isActive){
}

perform4Page.onLeftBottomPressed = function(isActive){
}

perform4Page.onLeftBottomReleased = function(isActive){
}

perform4Page.updateRGBLEDs = function(){
    for(var i=0; i<16; i++){

        var j = Math.floor((i/16)*4);
        var tempTrackColor;

        if (j == 0){
            tempTrackColor = pTrackColor1;
        }else if(j == 1){
            tempTrackColor = pTrackColor2;
        }else if(j == 2){
            tempTrackColor = pTrackColor3;
        }else if(j == 3){
            tempTrackColor = pTrackColor4;
        }
        
        if (PMODE[j] == pMode.DEVICE){
            setRGBLED(i, INDICATOR_COLOR[i%4], ROW_SHIFT[j] ? STROBE.PULSE3 : STROBE.OFF);
        }else if(PMODE[j] == pMode.TRACK){
            if ((i%4) == 0){
                pTrackIsSelected[j] ?
                    setRGBLED(i, COLOR.GREEN, ROW_SHIFT[j] ? STROBE.PULSE3 : STROBE.PULSE1) :
                        setRGBLED(i, tempTrackColor, ROW_SHIFT[j] ? STROBE.PULSE3 : STROBE.OFF);
            }else if((i%4) == 1){
                pTrack[j].arm().get() ? 
                    setRGBLED(i, COLOR.RED, ROW_SHIFT[j] ? STROBE.PULSE3 : STROBE.PULSE1) :
                        setRGBLED(i, tempTrackColor, ROW_SHIFT[j] ? STROBE.PULSE3 : STROBE.OFF);
            }else if((i%4) == 2){
                pTrack[j].mute().get() ? 
                    setRGBLED(i, COLOR.BROWN, ROW_SHIFT[j] ? STROBE.PULSE3 : STROBE.PULSE1) :
                        setRGBLED(i, tempTrackColor, ROW_SHIFT[j] ? STROBE.PULSE3 : STROBE.OFF);
            }else if((i%4) == 3){
                pTrack[j].solo().get() ? 
                    setRGBLED(i, COLOR.DARK_BLUE, ROW_SHIFT[j] ? STROBE.PULSE3 : STROBE.PULSE1) :
                        setRGBLED(i, tempTrackColor, ROW_SHIFT[j] ? STROBE.PULSE3 : STROBE.OFF);
            }
        }
    }
}

perform4Page.update11segLEDs = function(){
    for(var i=0; i<16; i++){
        var j = Math.floor((i/16)*4);
        if (PMODE[j] == pMode.DEVICE){
            set11segLED(i, pDeviceParam[j][i%4]);
        }else if(PMODE[j] == pMode.TRACK){
            if ((i%4) == 0){
                set11segLED(i, scaleValue(pTrack[j].volume().get(), 1, 0, 127));
            }else if((i%4) == 1){
                set11segLED(i, scaleValue(pTrack[j].pan().get(), 1, 0, 127));
            }else if((i%4) == 2){
                set11segLED(i, scaleValue(pTrack[j].getSend(0).get(), 1, 0, 127));
            }else if((i%4) == 3){
                set11segLED(i, scaleValue(pTrack[j].getSend(1).get(), 1, 0, 127));
            }
        }
    }
}

perform4Page.updateIndicators = function(){
    //host.showPopupNotification(pTrack[0]Name + ' : ' + pDevice[0]Name + ' :: ' + pTrack[2]Name + ' : ' + pDevice[2]Name);
    
    if(PMODE[0] == pMode.DEVICE){
        for (var i=0; i<8; i++){
            pDRCP[0].getParameter(i).setIndication(true)
        }
    }else if(PMODE[0] == pMode.TRACK){
        pTrack[0].getVolume().setIndication(true);
        pTrack[0].getPan().setIndication(true);
        pTrack[0].getSend(0).setIndication(true);
        pTrack[0].getSend(1).setIndication(true);
        pTrack[0].getSend(2).setIndication(true);
        pTrack[0].getSend(3).setIndication(true);
        pTrack[0].getSend(4).setIndication(true);
        pTrack[0].getSend(5).setIndication(true);
    }

    if(PMODE[2] == pMode.DEVICE){
        for (var i=0; i<8; i++){
            pDRCP[2].getParameter(i).setIndication(true)
        }
    }else if(PMODE[2] == pMode.TRACK){
        pTrack[2].getVolume().setIndication(true);
        pTrack[2].getPan().setIndication(true);
        pTrack[2].getSend(0).setIndication(true);
        pTrack[2].getSend(1).setIndication(true);
        pTrack[2].getSend(2).setIndication(true);
        pTrack[2].getSend(3).setIndication(true);
        pTrack[2].getSend(4).setIndication(true);
        pTrack[2].getSend(5).setIndication(true);
    }
}

perform4Page.deviceChangePopup = function(){
}

perform4Page.clearIndication = function(){
}