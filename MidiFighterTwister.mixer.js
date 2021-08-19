
mixerPage = new page();

mixerPage.title = "Mixer";
mixerPage.bank = BANK[1];
mixerPage.bankEncOffset = BANK_ENC_OFFSET[1];
mixerPage.bankSBOffset = BANK_SB_OFFSET[1];

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
            track[enc].selectInMixer();
        }else if(enc<8){
            track[enc-4].arm().toggle();
        }else if(enc<12){
            track[enc-8].solo().toggle();
        }else if(enc>=12){
            track[enc-12].mute().toggle();
        }
    }else if (MIXERMODE == mixerMode.EFFECT){
        if(enc<4){
            effectTrackBank.getChannel(enc).selectInMixer();
        }else if(enc>=4 && enc<8){
            effectTrackBank.getChannel(enc-4).getArm().toggle();
        }else if(enc>=8 && enc<12){
            effectTrackBank.getChannel(enc-8).getSolo().toggle();
        }else if(enc>=12){
            effectTrackBank.getChannel(enc-12).getMute().toggle();
        }
    }else if (MIXERMODE == mixerMode.MASTER){
        if(enc<4){
            masterTrack.selectInMixer();
        }else if(enc>=4 && enc<8){
            masterTrack.getArm().toggle();
        }else if(enc>=8 && enc<12){
            masterTrack.getSolo().toggle();
        }else if(enc>=12){
            masterTrack.getMute().toggle();
        }
    }else if (MIXERMODE == mixerMode.EIGHT){
        if(enc<4){
            if (mainIsSelected[enc]){
                track[enc].arm().toggle();
            }else{
                track[enc].selectInMixer();
            }
        }else if(enc<8){
            track[enc-4].mute().toggle();
        }else if(enc<12){
            if (mainIsSelected[enc-4]){
                track[enc-4].arm().toggle();
            }else{
                track[enc-4].selectInMixer();
            }
        }else{
            track[enc-8].mute().toggle();
        }
    }

}

mixerPage.onEncoderTurn = function(isActive){   
    if (MIXERMODE == mixerMode.MAIN){
        if(enc<4){
            track[enc].volume().set(val,127);
        }else if(enc<8){
            track[enc-4].pan().set(val,127);
        }else if(enc<12){
            track[enc-8].getSend(currentSend).set(val,127);
        }else{
            setSendNumber(val);
        }
    }else if (MIXERMODE == mixerMode.EFFECT){
        if(enc<4){
            effectTrackBank.getChannel(enc).getVolume().set(val,127);
        }else if(enc>=4 && enc<8){
            effectTrackBank.getChannel(enc-4).getPan().set(val,127);
        }
    }else if (MIXERMODE == mixerMode.MASTER){
        if(enc<4){
            masterTrack.getVolume().set(val,127);
        }else if(enc>=4 && enc<8){
            masterTrack.getPan().set(val,127);
        }
    }else if (MIXERMODE == mixerMode.EIGHT){
        if(enc<4){
            track[enc].pan().set(val,127);
        }else if(enc<8){
            track[enc-4].volume().set(val,127);
        }else if(enc<12){
            track[enc-4].pan().set(val,127);
        }else{
            track[enc-8].volume().set(val,127);
        }
    }
}

mixerPage.onRightTopPressed = function(isActive){
}

mixerPage.onRightTopReleased = function(isActive){
    if (OVMODE == ovMode.OVERVIEW){
        setActivePage(overviewPage)
    }else if(OVMODE == ovMode.PERFORM2){
        setActivePage(perform2Page)
    }else if(OVMODE == ovMode.PERFORM4){
        setActivePage(perform4Page);
    }    
}

mixerPage.onRightMiddlePressed = function(isActive){
}

mixerPage.onRightMiddleReleased = function(isActive){
    (MIXERMODE < 1) ? (MIXERMODE++) : (MIXERMODE = 0); //TODO: Add other modes back
    clearIndicators();
    host.showPopupNotification("Mixer Mode: "+mixerModeArray[MIXERMODE]);
}

mixerPage.onRightBottomPressed = function(isActive){
}

mixerPage.onRightBottomReleased = function(isActive){
    setActivePage(userPage);
}

mixerPage.onLeftTopPressed = function(isActive){
}

mixerPage.onLeftTopReleased = function(isActive){
    if(MIXERMODE == mixerMode.MAIN || MIXERMODE == mixerMode.EIGHT){
        mainTrackBank.scrollChannelsUp();
    }else if(MIXERMODE == mixerMode.EFFECT){
        effectTrackBank.scrollChannelsUp();
    }
}

mixerPage.onLeftMiddlePressed = function(isActive){
}

mixerPage.onLeftMiddleReleased = function(isActive){
    var index = channelStepSizeArray.indexOf(channelStepSize);
    index == (channelStepSizeArray.length - 1) ? index = 0 : index++;
    channelStepSize = channelStepSizeArray[index];
    host.showPopupNotification("Channel Step Size: "+channelStepSize);
    mainTrackBank.setChannelScrollStepSize(channelStepSize);
    effectTrackBank.setChannelScrollStepSize(channelStepSize);
}

mixerPage.onLeftBottomPressed = function(isActive){
}

mixerPage.onLeftBottomReleased = function(isActive){
    if(MIXERMODE == mixerMode.MAIN || MIXERMODE == mixerMode.EIGHT){
        mainTrackBank.scrollChannelsDown();
    }else if(MIXERMODE == mixerMode.EFFECT){
        effectTrackBank.scrollChannelsDown();
    }
}

mixerPage.updateRGBLEDs = function(){
    for(var i=0; i<16; i++){
        if (MIXERMODE == mixerMode.MAIN){
                if(i<4){
                    mainIsSelected[i] ?
                        setRGBLED(i, COLOR.GREEN, STROBE.PULSE1) :
                            setRGBLED(i, getTrackColor(track[i]), STROBE.OFF);
                }else if(i>=4 && i <8){
                    (track[i-4].arm().get()) ?
                        setRGBLED(i, COLOR.RED, STROBE.PULSE1) :
                            setRGBLED(i, getTrackColor(track[i-4]), STROBE.OFF);
                }else if(i>=8 && i<12){
                    (track[i-8].color().get()) ?
                        setRGBLED(i, COLOR.DARK_BLUE, STROBE.PULSE1) :
                            setRGBLED(i, getTrackColor(track[i-8]), STROBE.OFF);
                }else if(i>=12){
                    (track[i-12].mute().get()) ?
                        setRGBLED(i, COLOR.BROWN, STROBE.PULSE1) :
                            setRGBLED(i, getTrackColor(track[i-12]), STROBE.OFF);
                }
        }else if (MIXERMODE == mixerMode.EFFECT){
                if(i<4){
                    effectIsSelected[i] ?
                        setRGBLED(i, COLOR.GREEN, STROBE.PULSE1) :
                            setRGBLED(i, getTrackColor(effectTrack[i]), STROBE.OFF);
                }else if(i>=4 && i <8){
                    effectArm[i-4] ?
                        setRGBLED(i, COLOR.RED, STROBE.PULSE1) :
                            setRGBLED(i, getTrackColor(effectTrack[i-4]), STROBE.OFF);
                }else if(i>=8 && i<12){
                    effectSolo[i-8] ?
                        setRGBLED(i, COLOR.DARK_BLUE, STROBE.PULSE1) :
                            setRGBLED(i, getTrackColor(effectTrack[i-8]), STROBE.OFF);
                }else if(i>=12){
                    effectMute[i-12] ?
                        setRGBLED(i, COLOR.BROWN, STROBE.PULSE1) :
                            setRGBLED(i, getTrackColor(effectTrack[i-12]), STROBE.OFF);
                }
        }else if (MIXERMODE == mixerMode.MASTER){
                if(i==0){
                    masterIsSelected[i] ?
                        setRGBLED(i, COLOR.GREEN, STROBE.PULSE1) :
                            setRGBLED(i, getTrackColor(masterTrack), STROBE.OFF);
                }else if(i==4){
                    masterArm[i-4] ?
                        setRGBLED(i, COLOR.RED, STROBE.PULSE1) :
                            setRGBLED(i, getTrackColor(masterTrack), STROBE.OFF);
                }else if(i==8){
                    masterSolo[i-8] ?
                        setRGBLED(i, COLOR.DARK_BLUE, STROBE.PULSE1) :
                            setRGBLED(i, getTrackColor(masterTrack), STROBE.OFF);
                }else if(i==12){
                    masterMute[i-12] ?
                        setRGBLED(i, COLOR.BROWN, STROBE.PULSE1) :
                            setRGBLED(i, getTrackColor(masterTrack), STROBE.OFF);
                }else{
                    setRGBLED(i, COLOR.BLACK, STROBE.OFF);
                }
        }else if (MIXERMODE == mixerMode.EIGHT){
            println(mainIsSelected[0])
            if(i<4){
                if (mainIsSelected[i]){
                    if (track[i].arm().get()){
                        setRGBLED(i, COLOR.RED, STROBE.PULSE1);
                    }else{
                        setRGBLED(i, COLOR.GREEN, STROBE.PULSE1);
                    }
                }else{
                    setRGBLED(i, getTrackColor(track[i]), STROBE.OFF);
                }
            }else if(i<8){
                (track[i-4].mute().get()) ?
                        setRGBLED(i, COLOR.BROWN, STROBE.PULSE1) :
                            setRGBLED(i, getTrackColor(track[i-4]), STROBE.OFF);
            }else if(i<12){
                if (mainIsSelected[i-4]){
                    if (track[i-4].arm().get()){
                        setRGBLED(i, COLOR.RED, STROBE.PULSE1);
                    }else{
                        setRGBLED(i, COLOR.GREEN, STROBE.PULSE1);
                    }
                }else{
                    setRGBLED(i, getTrackColor(track[i-4]), STROBE.OFF);
                }
            }else{
                (track[i-8].mute().get()) ?
                    setRGBLED(i, COLOR.BROWN, STROBE.PULSE1) :
                        setRGBLED(i, getTrackColor(track[i-8]), STROBE.OFF);
            }
        }
    }
}

mixerPage.update11segLEDs = function(){
    for(var i=0; i<16; i++){
        if (MIXERMODE == mixerMode.MAIN){
                if(i<4){
                    set11segLED(i, scaleValue(track[i].volume().get(), 1, 0, 127));
                }else if(i <8){
                    set11segLED(i, scaleValue(track[i-4].pan().get(), 1, 0, 127));
                }else if(i<12){
                    set11segLED(i, sendArray[i-8][currentSend]);
                }else{
                    set11segLED(i, currentSend11Seg);
                }
        }else if (MIXERMODE == mixerMode.EFFECT){
                if(i<4){
                    set11segLED(i, effectTrack[i].volume().get());
                }else if(i>=4 && i <8){
                    set11segLED(i, effectTrack[i-4].pan().get());
                }else if(i>=8 && i<12){
                    set11segLED(i, 0);
                }else if(i>=12){
                    set11segLED(i, 0);
                }
        }else if (MIXERMODE == mixerMode.MASTER){
                if(i==0){
                    set11segLED(i, masterTrack.volume().get());
                }else if(i==4){
                    set11segLED(i, masterTrack.pan().get());
                }else{
                    set11segLED(i, 0);
                }
        }else if (MIXERMODE == mixerMode.EIGHT){
            if(i<4){
                set11segLED(i, scaleValue(track[i].pan().get(), 1, 0, 127));
            }else if(i<8){
                set11segLED(i, scaleValue(track[i-4].volume().get(), 1, 0, 127));
            }else if(i<12){
                set11segLED(i, scaleValue(track[i-4].pan().get(), 1, 0, 127));
            }else{
                set11segLED(i, scaleValue(track[i-8].volume().get(), 1, 0, 127));
            }
        }
    }
}

mixerPage.updateIndicators = function(){   
    if (MIXERMODE == mixerMode.MAIN){
        for(var i=0; i<4; i++){
            track[i].getVolume().setIndication(true);
            track[i].getPan().setIndication(true);
            for (var s=0; s<11; s++){
                track[i].getSend(s).setIndication(currentSend == s);
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
    }else if (MIXERMODE == mixerMode.EIGHT){
        for(var i=0; i<8; i++){
            track[i].volume().setIndication(true);
            track[i].pan().setIndication(true);
        }
    }
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
