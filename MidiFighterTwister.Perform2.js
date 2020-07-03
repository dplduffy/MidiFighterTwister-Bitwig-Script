
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
    if(enc == 0){
        PMODE[0] = PMODE[0] ^= true;
        setActivePage(perform2Page);
    }else if(enc == 1){
        if (PMODE[0] == pMode.DEVICE){
            pDRCP[0].selectPrevious();
            pTrack[0].selectInMixer();
            pDevice[0].selectInEditor();
            pDevice[0].isRemoteControlsSectionVisible().set(1);
        }else if(PMODE[0] == pMode.TRACK){
            pTrack[0].arm().toggle();
        }
    }else if(enc == 2){
        pTrackBank[0].scrollChannelsUp();
        pTrack[0].selectInMixer();
    }else if(enc == 3){
        pTrackBank[0].scrollChannelsDown();
        pTrack[0].selectInMixer();
    }else if(enc == 4){
        pTrack[0].mute().toggle();
    }else if(enc == 5){
        if (PMODE[0] == pMode.DEVICE){
            pDRCP[0].selectNext();
            pTrack[0].selectInMixer();
            pDevice[0].selectInEditor();
            pDevice[0].isRemoteControlsSectionVisible().set(1);
        }else{
            pTrack[0].arm().toggle();
        }
    }else if(enc == 6){
        pDeviceBank[0].scrollUp();
        pTrack[0].selectInMixer();
        pDevice[0].selectInEditor();
        pDevice[0].isRemoteControlsSectionVisible().set(1);
    }else if(enc == 7){
        pDeviceBank[0].scrollDown();
        pTrack[0].selectInMixer();
        pDevice[0].selectInEditor();
        pDevice[0].isRemoteControlsSectionVisible().set(1);
    }else if(enc == 8){
        PMODE[2] = PMODE[2] ^= true;
        setActivePage(perform2Page);
    }else if(enc == 9){
        if (PMODE[2] == pMode.DEVICE){
            pDRCP[2].selectPrevious();
            pTrack[2].selectInMixer();
            pDevice[2].selectInEditor();
            pDevice[2].isRemoteControlsSectionVisible().set(1);
        }else{
            pTrack[2].arm().toggle();
        }
    }else if(enc == 10){
        pTrackBank[2].scrollChannelsUp();
        pTrack[2].selectInMixer();
    }else if(enc == 11){
        pTrackBank[2].scrollChannelsDown();
        pTrack[2].selectInMixer();
    }else if(enc == 12){
        pTrack[2].mute().toggle();
    }else if(enc == 13){
        if (PMODE[2] == pMode.DEVICE){
            pDRCP[2].selectNext();
            pTrack[2].selectInMixer();
            pDevice[2].selectInEditor();
            pDevice[2].isRemoteControlsSectionVisible().set(1);
        }else{
            pTrack[2].solo().toggle();
        }
    }else if(enc == 14){
        pDeviceBank[2].scrollUp();
        pTrack[2].selectInMixer();
        pDevice[2].selectInEditor();
        pDevice[2].isRemoteControlsSectionVisible().set(1);
    }else if(enc == 15){
        pDeviceBank[2].scrollDown();
        pTrack[2].selectInMixer();
        pDevice[2].selectInEditor();
        pDevice[2].isRemoteControlsSectionVisible().set(1);
    }
}

perform2Page.onEncoderTurn = function(isActive){
    if(enc < 8){
        if (PMODE[0] == pMode.DEVICE){
            pDRCP[0].getParameter(enc).set(val,127);
        }else if(PMODE[0] == pMode.TRACK){
            if (enc == 0){
                pTrack[0].volume().set(val,127);
            }else if(enc == 1){
                pTrack[0].getSend(0).set(val,127);
            }else if(enc == 2){
                pTrack[0].getSend(1).set(val,127);
            }else if(enc == 3){
                pTrack[0].getSend(2).set(val,127);
            }else if(enc == 4){
                pTrack[0].pan().set(val,127);
            }else if(enc == 5){
                pTrack[0].getSend(3).set(val,127);
            }else if(enc == 6){
                pTrack[0].getSend(4).set(val,127);
            }else if(enc == 7){
                pTrack[0].getSend(5).set(val,127);
            }
        }
    }else if(enc < 16){
        if (PMODE[2] == pMode.DEVICE){
            pDRCP[2].getParameter(enc-8).set(val,127);
        }else if(PMODE[2] == pMode.TRACK){
            if (enc == 8){
                pTrack[2].volume().set(val,127);
            }else if(enc == 9){
                pTrack[2].getSend(currentPT2Send).set(val,127);
            }else if(enc == 10){
                pTrack[2].getSend(currentPT2Send+1).set(val,127);
            }else if(enc == 11){
                pTrack[2].getSend(currentPT2Send+2).set(val,127);
            }else if(enc == 12){
                pTrack[2].pan().set(val,127);
            }else if(enc == 13){
                pTrack[2].getSend(currentPT2Send+3).set(val,127);
            }else if(enc == 14){
                pTrack[2].getSend(currentPT2Send+4).set(val,127);
            }else if(enc == 15){
                pTrack[2].getSend(currentPT2Send+5).set(val,127);
            }
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
        if (i<8){
            if (PMODE[0] == pMode.DEVICE){
                setRGBLED(i, INDICATOR_COLOR[i], STROBE.OFF);
            }else if(PMODE[0] == pMode.TRACK){
                if (i == 0){
                    pTrackIsSelected[0] ?
                        setRGBLED(i, COLOR.GREEN, STROBE.PULSE1) :
                            setRGBLED(i, pTrackColor[0], STROBE.OFF);
                }else if(i == 1){
                    pTrack[0].arm().get() ? 
                        setRGBLED(i, COLOR.RED, STROBE.PULSE1) :
                            setRGBLED(i, pTrackColor[0], STROBE.OFF);
                }else if(i == 4){
                    pTrack[0].mute().get() ? 
                        setRGBLED(i, COLOR.BROWN, STROBE.PULSE1) :
                            setRGBLED(i, pTrackColor[0], STROBE.OFF);
                }else if(i == 5){
                    pTrack[0].solo().get() ? 
                        setRGBLED(i, COLOR.DARK_BLUE, STROBE.PULSE1) :
                            setRGBLED(i, pTrackColor[0], STROBE.OFF);
                }else{
                    setRGBLED(i, pTrackColor[0], STROBE.OFF);
                }
            } 
        }else if (i<16){
            if (PMODE[2] == pMode.DEVICE){
                setRGBLED(i, INDICATOR_COLOR[i-8], STROBE.OFF);
            }else if(PMODE[2] == pMode.TRACK){
                if (i == 8){
                    pTrackIsSelected[2] ?
                        setRGBLED(i, COLOR.GREEN, STROBE.PULSE1) :
                            setRGBLED(i, pTrackColor[2], STROBE.OFF);
                }else if(i == 9){
                    pTrack[2].arm().get() ? 
                        setRGBLED(i, COLOR.RED, STROBE.PULSE1) :
                            setRGBLED(i, pTrackColor[2], STROBE.OFF);
                }else if(i == 12){
                    pTrack[2].mute().get() ? 
                        setRGBLED(i, COLOR.BROWN, STROBE.PULSE1) :
                            setRGBLED(i, pTrackColor[2], STROBE.OFF);
                }else if(i == 13){
                    pTrack[2].solo().get() ? 
                        setRGBLED(i, COLOR.DARK_BLUE, STROBE.PULSE1) :
                            setRGBLED(i, pTrackColor[2], STROBE.OFF);
                }else{
                    setRGBLED(i, pTrackColor[2], STROBE.OFF);
                }
            } 
        }
        
    }
}

perform2Page.update11segLEDs = function(){
    for(var i=0; i<16; i++){
        if (i<8){
            if (PMODE[0] == pMode.DEVICE){
                set11segLED(i, pDeviceParam[0][i]);
            }else if(PMODE[0] == pMode.TRACK){
                set11segLED(0, scaleValue(pTrack[0].volume().get(), 1, 0, 127));
                set11segLED(1, scaleValue(pTrack[0].getSend(0).get(), 1, 0, 127));
                set11segLED(2, scaleValue(pTrack[0].getSend(1).get(), 1, 0, 127));
                set11segLED(3, scaleValue(pTrack[0].getSend(2).get(), 1, 0, 127));
                set11segLED(4, scaleValue(pTrack[0].pan().get(), 1, 0, 127));
                set11segLED(5, scaleValue(pTrack[0].getSend(3).get(), 1, 0, 127));
                set11segLED(6, scaleValue(pTrack[0].getSend(4).get(), 1, 0, 127));
                set11segLED(7, scaleValue(pTrack[0].getSend(5).get(), 1, 0, 127));
            }
        }else if(i<16){
            if (PMODE[2] == pMode.DEVICE){
                set11segLED(i, pDeviceParam[2][i-8]);
            }else if(PMODE[2] == pMode.TRACK){
                set11segLED(8, scaleValue(pTrack[2].volume().get(), 1, 0, 127));
                set11segLED(9, scaleValue(pTrack[2].getSend(0).get(), 1, 0, 127));
                set11segLED(10, scaleValue(pTrack[2].getSend(1).get(), 1, 0, 127));
                set11segLED(11, scaleValue(pTrack[2].getSend(2).get(), 1, 0, 127));
                set11segLED(12, scaleValue(pTrack[2].pan().get(), 1, 0, 127));
                set11segLED(13, scaleValue(pTrack[2].getSend(3).get(), 1, 0, 127));
                set11segLED(14, scaleValue(pTrack[2].getSend(4).get(), 1, 0, 127));
                set11segLED(15, scaleValue(pTrack[2].getSend(5).get(), 1, 0, 127));
            }
        }
    }
}

perform2Page.updateIndicators = function(){
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

perform2Page.deviceChangePopup = function(){
}

perform2Page.clearIndication = function(){
}