
perform2Page = new page();

perform2Page.title = "Perform 2";
perform2Page.bank = BANK[1];
perform2Page.bankEncOffset = BANK_ENC_OFFSET[1];
perform2Page.bankSBOffset = BANK_SB_OFFSET[1];

var rgbDeviceDone = false;
var tempRainbow = 80;

perform2Page.updateOutputState = function(){
    clear();
    this.updateRGBLEDs();
    this.update11segLEDs();
    this.updateIndicators();
}

perform2Page.onEncoderPress = function(isActive){
}

perform2Page.onEncoderRelease = function(isActive){

    var j = Math.floor((enc/16)*2);
    
    println("j = "+ j)
    println("color1 = " + getTrackColor(pTrack[0]))

    if((enc%8) == 0){
        
        PMODE[j] = PMODE[j] ^= true;
        setActivePage(perform2Page);
    }else if((enc%8) == 1){
        if (PMODE[j] == pMode.DEVICE){
            pDRCP[j].selectPrevious();
            pTrack[j].selectInMixer();
            pTrack[j].makeVisibleInMixer();
            pDevice[j].selectInEditor();
            pDevice[j].isRemoteControlsSectionVisible().set(true);
        }else if(PMODE[j] == pMode.TRACK){
            pTrack[j].arm().toggle();
        }
    }else if((enc%8) == 2){
        pTrackBank[j].scrollChannelsUp();
        pTrack[j].selectInMixer();
        pTrack[j].makeVisibleInMixer();
    }else if((enc%8) == 3){
        pTrackBank[j].scrollChannelsDown();
        pTrack[j].selectInMixer();
        pTrack[j].makeVisibleInMixer();
    }else if((enc%8) == 4){
        pTrack[j].mute().toggle();
    }else if((enc%8) == 5){
        if (PMODE[j] == pMode.DEVICE){
            pDRCP[j].selectNext();
            pTrack[j].selectInMixer();
            pTrack[j].makeVisibleInMixer();
            pDevice[j].selectInEditor();
            pDevice[j].isRemoteControlsSectionVisible().set(true);
        }else{
            pTrack[j].solo().toggle();
        }
    }else if((enc%8) == 6){
        pDeviceBank[j].scrollUp();
        pTrack[j].selectInMixer();
        pTrack[j].makeVisibleInMixer();
        pDevice[j].selectInEditor();
        pDevice[j].isRemoteControlsSectionVisible().set(true);
    }else if((enc%8) == 7){
        pDeviceBank[j].scrollDown();
        pTrack[j].selectInMixer();
        pTrack[j].makeVisibleInMixer();
        pDevice[j].selectInEditor();
        pDevice[j].isRemoteControlsSectionVisible().set(true);
    }
}

perform2Page.onEncoderTurn = function(isActive){

    var j = Math.floor((enc/16)*2);

    if (PMODE[j] == pMode.DEVICE){
        pDRCP[j].getParameter(enc%8).set(val,127);
    }else if(PMODE[j] == pMode.TRACK){
        if ((enc%8) == 0){
            pTrack[j].volume().set(val,127);
        }else if((enc%8) == 1){
            pTrack[j].getSend(0).set(val,127);
        }else if((enc%8) == 2){
            pTrack[j].getSend(1).set(val,127);
        }else if((enc%8) == 3){
            pTrack[j].getSend(2).set(val,127);
        }else if((enc%8) == 4){
            pTrack[j].pan().set(val,127);
        }else if((enc%8) == 5){
            pTrack[j].getSend(3).set(val,127);
        }else if((enc%8) == 6){
            pTrack[j].getSend(4).set(val,127);
        }else if((enc%8) == 7){
            pTrack[j].getSend(5).set(val,127);
        }
    }
}

perform2Page.onRightTopPressed = function(isActive){
}

perform2Page.onRightTopReleased = function(isActive){
    setActivePage(perform4Page);
    OVMODE = ovMode.PERFORM4;
}

perform2Page.onRightMiddlePressed = function(isActive){
}

perform2Page.onRightMiddleReleased = function(isActive){
    setActivePage(mixerPage)
}

perform2Page.onRightBottomPressed = function(isActive){
}

perform2Page.onRightBottomReleased = function(isActive){
    setActivePage(userPage);
}

perform2Page.onLeftTopPressed = function(isActive){
}

perform2Page.onLeftTopReleased = function(isActive){
}

perform2Page.onLeftMiddlePressed = function(isActive){
}

perform2Page.onLeftMiddleReleased = function(isActive){
}

perform2Page.onLeftBottomPressed = function(isActive){
}

perform2Page.onLeftBottomReleased = function(isActive){
}

perform2Page.updateRGBLEDs = function(){

    for(var i=0; i<16; i++){

        var j = Math.floor((i/16)*2);
        var tempTrackColor;

        if (j == 0){
            tempTrackColor = getTrackColor(pTrack[0]);
        }else if(j == 1){
            tempTrackColor = getTrackColor(pTrack[1]);
        }
        
        if (PMODE[j] == pMode.DEVICE){
            setRGBLED(i, INDICATOR_COLOR[i%8], STROBE.OFF);
        }else if(PMODE[j] == pMode.TRACK){
            if ((i%8) == 0){
                pTrackIsSelected[j] ?
                    setRGBLED(i, COLOR.GREEN, STROBE.PULSE1) :
                        setRGBLED(i, tempTrackColor, STROBE.OFF);
            }else if((i%8) == 1){
                pTrack[j].arm().get() ? 
                    setRGBLED(i, COLOR.RED, STROBE.PULSE1) :
                        setRGBLED(i, tempTrackColor, STROBE.OFF);
            }else if((i%8) == 4){
                pTrack[j].mute().get() ? 
                    setRGBLED(i, COLOR.BROWN, STROBE.PULSE1) :
                        setRGBLED(i, tempTrackColor, STROBE.OFF);
            }else if((i%8) == 5){
                pTrack[j].solo().get() ? 
                    setRGBLED(i, COLOR.DARK_BLUE, STROBE.PULSE1) :
                        setRGBLED(i, tempTrackColor, STROBE.OFF);
            }else{
                setRGBLED(i, tempTrackColor, STROBE.OFF);
            }
        } 
    }
}

perform2Page.update11segLEDs = function(){
    for(var i=0; i<16; i++){

        var j = Math.floor((i/16)*2);

        //println("i= " + i + "j= " + j)
        //println(pDeviceParam[j][i%8])

        if(PMODE[j] == pMode.DEVICE){
            set11segLED(i, pDeviceParam[j][i%8]);
        }else if(PMODE[j] == pMode.TRACK){
            if((i%8) == 0){
                set11segLED(i, scaleValue(pTrack[j].volume().get(), 1, 0, 127));
            }else if((i%8) == 1){
                set11segLED(i, scaleValue(pTrack[j].getSend(0).get(), 1, 0, 127));
            }else if((i%8) == 2){
                set11segLED(i, scaleValue(pTrack[j].getSend(1).get(), 1, 0, 127));
            }else if((i%8) == 3){
                set11segLED(i, scaleValue(pTrack[j].getSend(2).get(), 1, 0, 127));
            }else if((i%8) == 4){
                set11segLED(i, scaleValue(pTrack[j].pan().get(), 1, 0, 127));
            }else if((i%8) == 5){
                set11segLED(i, scaleValue(pTrack[j].getSend(3).get(), 1, 0, 127));
            }else if((i%8) == 6){
                set11segLED(i, scaleValue(pTrack[j].getSend(4).get(), 1, 0, 127));
            }else if((i%8) == 7){
                set11segLED(i, scaleValue(pTrack[j].getSend(5).get(), 1, 0, 127));
            }
        }
    }
}

perform2Page.updateIndicators = function(){
    //host.showPopupNotification(pTrack[0]Name + ' : ' + pDevice[0]Name + ' :: ' + pTrack[2]Name + ' : ' + pDevice[2]Name);
    for(var j=0; j<2; j++){
        if(PMODE[j] == pMode.DEVICE){
            for (var i=0; i<8; i++){
                pDRCP[j].getParameter(i).setIndication(true)
            }
        }else if(PMODE[j] == pMode.TRACK){
            pTrack[j].getVolume().setIndication(true);
            pTrack[j].getPan().setIndication(true);
            pTrack[j].getSend(0).setIndication(true);
            pTrack[j].getSend(1).setIndication(true);
            pTrack[j].getSend(2).setIndication(true);
            pTrack[j].getSend(3).setIndication(true);
            pTrack[j].getSend(4).setIndication(true);
            pTrack[j].getSend(5).setIndication(true);
        }
    }
}

perform2Page.deviceChangePopup = function(){
}

perform2Page.clearIndication = function(){
}