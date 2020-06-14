
mixerPage = new page();

mixerPage.title = "Mixer";

mixerPage.canScrollMainChannelsUp = false;
mixerPage.canScrollMainChannelsDown = false;
mixerPage.canScrollEffectChannelsUp = false;
mixerPage.canScrollEffectChannelsDown = false;

mixerPage.updateOutputState = function(){
    clear();
    this.updateRGBLEDs();
    this.update11segLEDs();
    this.updateIndicators();
}

mixerPage.onEncoderPress = function(isActive){
}

mixerPage.onEncoderRelease = function(isActive){ 
    if (MIXERMODE == mixerMode.MAIN){
        if(enc<4){
            mainTrackBank.getChannel(enc).selectInMixer();
        }else if(enc>=4 && enc<8){
            mainTrackBank.getChannel(enc-4).getArm().toggle();
        }else if(enc>=8 && enc<12){
            mainTrackBank.getChannel(enc-8).getSolo().toggle();
        }else if(enc>=12){
            mainTrackBank.getChannel(enc-12).getMute().toggle();
        }
    }
    if (MIXERMODE == mixerMode.EFFECT){
        if(enc<4){
            effectTrackBank.getChannel(enc).selectInMixer();
        }else if(enc>=4 && enc<8){
            effectTrackBank.getChannel(enc-4).getArm().toggle();
        }else if(enc>=8 && enc<12){
            effectTrackBank.getChannel(enc-8).getSolo().toggle();
        }else if(enc>=12){
            effectTrackBank.getChannel(enc-12).getMute().toggle();
        }
    }
    if (MIXERMODE == mixerMode.MASTER){
        if(enc<4){
            masterTrack.selectInMixer();
        }else if(enc>=4 && enc<8){
            masterTrack.getArm().toggle();
        }else if(enc>=8 && enc<12){
            masterTrack.getSolo().toggle();
        }else if(enc>=12){
            masterTrack.getMute().toggle();
        }
    }
}

mixerPage.onEncoderTurn = function(isActive){   
    if (MIXERMODE == mixerMode.MAIN){
        println('enc = ' + enc);
        if(enc<4){
            mainTrackBank.getChannel(enc).getVolume().set(val,127);
        }else if(enc>=4 && enc<8){
            mainTrackBank.getChannel(enc-4).getPan().set(val,127);
        }else if(enc>=8 && enc<12){
            mainTrackBank.getChannel(enc-8).getSend(currentSend).set(val,127);
        }else if(enc>=12){
            setSendNumber(val);
        }
    }
    if (MIXERMODE == mixerMode.EFFECT){
        if(enc<4){
            effectTrackBank.getChannel(enc).getVolume().set(val,127);
        }else if(enc>=4 && enc<8){
            effectTrackBank.getChannel(enc-4).getPan().set(val,127);
        }
    }
    if (MIXERMODE == mixerMode.MASTER){
        if(enc<4){
            masterTrack.getVolume().set(val,127);
        }else if(enc>=4 && enc<8){
            masterTrack.getPan().set(val,127);
        }
    }
}

mixerPage.onRightTopPressed = function(isActive){
}

mixerPage.onRightTopReleased = function(isActive){
    if(MIXERMODE == mixerMode.MAIN){
        mainTrackBank.scrollChannelsUp();
    }else if(MIXERMODE == mixerMode.EFFECT){
        effectTrackBank.scrollChannelsUp();
    }     
}

mixerPage.onRightMiddlePressed = function(isActive){
}

mixerPage.onRightMiddleReleased = function(isActive){
    var index = channelStepSizeArray.indexOf(channelStepSize);
    index == (channelStepSizeArray.length - 1) ? index = 0 : index++;
    channelStepSize = channelStepSizeArray[index];
    host.showPopupNotification("Channel Step Size: "+channelStepSize);
    mainTrackBank.setChannelScrollStepSize(channelStepSize);
    effectTrackBank.setChannelScrollStepSize(channelStepSize);
}

mixerPage.onRightBottomPressed = function(isActive){
}

mixerPage.onRightBottomReleased = function(isActive){
    if(MIXERMODE == mixerMode.MAIN){
        mainTrackBank.scrollChannelsDown();
    }else if(MIXERMODE == mixerMode.EFFECT){
        effectTrackBank.scrollChannelsDown();
    }      
}

mixerPage.onLeftTopPressed = function(isActive){
}

mixerPage.onLeftTopReleased = function(isActive){
    cyclePage();
}

mixerPage.onLeftMiddlePressed = function(isActive){
}

mixerPage.onLeftMiddleReleased = function(isActive){
    MIXERMODE < 2 ? MIXERMODE++ : MIXERMODE = 0;
    this.clearIndication();
    host.showPopupNotification("Mixer Mode: "+mixerModeArray[MIXERMODE]);
}

mixerPage.onLeftBottomPressed = function(isActive){
}

mixerPage.onLeftBottomReleased = function(isActive){
}

mixerPage.updateRGBLEDs = function(){
    if (MIXERMODE == mixerMode.MAIN){
        for(var i=0; i<16; i++){
            if(i<4){
                mainIsSelected[i] ?
                    setRGBLED(i, COLOR.GREEN, STROBE.PULSE1) :
                        setRGBLED(i, mainColor[i], STROBE.OFF);
            }else if(i>=4 && i <8){
                mainArm[i-4] ?
                    setRGBLED(i, COLOR.RED, STROBE.PULSE1) :
                        setRGBLED(i, mainColor[i-4], STROBE.OFF);
            }else if(i>=8 && i<12){
                mainSolo[i-8] ?
                    setRGBLED(i, COLOR.DARK_BLUE, STROBE.PULSE1) :
                        setRGBLED(i, mainColor[i-8], STROBE.OFF);
            }else if(i>=12){
                mainMute[i-12] ?
                    setRGBLED(i, COLOR.BROWN, STROBE.PULSE1) :
                        setRGBLED(i, mainColor[i-12], STROBE.OFF);
            }
        }
    }
    if (MIXERMODE == mixerMode.EFFECT){
        for(var i=0; i<16; i++){
            if(i<4){
                effectIsSelected[i] ?
                    setRGBLED(i, COLOR.GREEN, STROBE.PULSE1) :
                        setRGBLED(i, effectColor[i], STROBE.OFF);
            }else if(i>=4 && i <8){
                effectArm[i-4] ?
                    setRGBLED(i, COLOR.RED, STROBE.PULSE1) :
                        setRGBLED(i, effectColor[i-4], STROBE.OFF);
            }else if(i>=8 && i<12){
                effectSolo[i-8] ?
                    setRGBLED(i, COLOR.DARK_BLUE, STROBE.PULSE1) :
                        setRGBLED(i, effectColor[i-8], STROBE.OFF);
            }else if(i>=12){
                effectMute[i-12] ?
                    setRGBLED(i, COLOR.BROWN, STROBE.PULSE1) :
                        setRGBLED(i, effectColor[i-12], STROBE.OFF);
            }
        }
    }
    if (MIXERMODE == mixerMode.MASTER){
        for(var i=0; i<16; i++){
            if(i==0){
                masterIsSelected[i] ?
                    setRGBLED(i, COLOR.GREEN, STROBE.PULSE1) :
                        setRGBLED(i, masterColor[0], STROBE.OFF);
            }else if(i==4){
                masterArm[i-4] ?
                    setRGBLED(i, COLOR.RED, STROBE.PULSE1) :
                        setRGBLED(i, masterColor[0], STROBE.OFF);
            }else if(i==8){
                masterSolo[i-8] ?
                    setRGBLED(i, COLOR.DARK_BLUE, STROBE.PULSE1) :
                        setRGBLED(i, effectColor[0], STROBE.OFF);
            }else if(i==12){
                masterMute[i-12] ?
                    setRGBLED(i, COLOR.BROWN, STROBE.PULSE1) :
                        setRGBLED(i, masterColor[0], STROBE.OFF);
            }else{
                setRGBLED(i, COLOR.BLACK, STROBE.OFF);
            }
        }
    }
}

mixerPage.update11segLEDs = function(){
    if (MIXERMODE == mixerMode.MAIN){
        for(var i=0; i<16; i++){
            if(i<4){
                set11segLED(i, mainVolume[i]);
            }else if(i <8){
                set11segLED(i, mainPan[i-4]);
            }else if(i<12){
                set11segLED(i, sendArray[i-8][currentSend]);
            }else{
                set11segLED(i, currentSend11Seg);
            }
        }
    }
    if (MIXERMODE == mixerMode.EFFECT){
        for(var i=0; i<16; i++){
            if(i<4){
                set11segLED(i, effectVolume[i]);
            }else if(i>=4 && i <8){
                set11segLED(i, effectPan[i-4]);
            }else if(i>=8 && i<12){
                set11segLED(i, 0);
            }else if(i>=12){
                set11segLED(i, 0);
            }
        }
    }
    if (MIXERMODE == mixerMode.MASTER){
        for(var i=0; i<16; i++){
            if(i==0){
                set11segLED(i, masterVolume[0]);
            }else if(i==4){
                set11segLED(i, masterPan[0]);
            }else{
                set11segLED(i, 0);
            }
        }
    }
}

mixerPage.updateIndicators = function(){   
    if (MIXERMODE == mixerMode.MAIN){
        for(var i=0; i<4; i++){
            mainTrackBank.getChannel(i).getVolume().setIndication(true);
            mainTrackBank.getChannel(i).getPan().setIndication(true);
            for (var s=0; s<11; s++){
                mainTrackBank.getChannel(i).getSend(s).setIndication(currentSend == s);
            }
        }
    }else if (MIXERMODE == mixerMode.EFFECT){
        for(var i=0; i<4; i++){
            effectTrackBank.getChannel(i).getVolume().setIndication(true);
            effectTrackBank.getChannel(i).getPan().setIndication(true);
        }
    }else if (MIXERMODE == mixerMode.MASTER){
        masterTrack.getVolume().setIndication(true);
        masterTrack.getPan().setIndication(true);
    }
}

mixerPage.clearIndication = function(){
    for(var i=0; i<4; i++){
        mainTrackBank.getChannel(i).getVolume().setIndication(false);
        mainTrackBank.getChannel(i).getPan().setIndication(false);
        for (var s=0; s<11; s++){
            mainTrackBank.getChannel(i).getSend(s).setIndication(false);
        }
        effectTrackBank.getChannel(i).getVolume().setIndication(false);
        effectTrackBank.getChannel(i).getPan().setIndication(false);
    }
    masterTrack.getVolume().setIndication(false);
    masterTrack.getPan().setIndication(false);
}

function setSendNumber(value){
    switch(true){
        case (value < 12):
            currentSend = 0;
            currentSend11Seg = 1;
            break;
        case (value > 11 && value < 24):
            currentSend = 1;
            currentSend11Seg = 12;
            break;
        case (value > 23 && value < 35):
            currentSend = 2;
            currentSend11Seg = 24;
            break;
        case (value > 34 && value <47):
            currentSend = 3;
            currentSend11Seg = 35;
            break;
        case (value > 46 && value < 59):
            currentSend = 4;
            currentSend11Seg = 47;
            break;
        case (value > 58 && value < 70):
            currentSend = 5;
            currentSend11Seg = 59;
            break;
        case (value > 69 && value < 82):
            currentSend = 6;
            currentSend11Seg = 70;
            break;
        case (value > 81 && value < 94):
            currentSend = 7;
            currentSend11Seg = 82;
            break;
        case (value > 93 && value < 105):
            currentSend = 8;
            currentSend11Seg = 94;
            break;
        case (value > 105 && value < 117):
            currentSend = 9;
            currentSend11Seg = 106;
            break;
        case (value > 117 ):
            currentSend = 10;
            currentSend11Seg = 118;
            break;
    }
    host.showPopupNotification("Send "+ (currentSend+1));
}
