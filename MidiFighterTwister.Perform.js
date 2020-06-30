
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
    }else if(enc == 1){
        if (P1MODE == pMode.DEVICE){
            performDRCP1.selectPrevious();
            performTrack1.selectInMixer();
            performDevice1.selectInEditor();
            performDevice1.isRemoteControlsSectionVisible().set(1);
        }else{
            performTrack1.arm().toggle();
        }
    }else if(enc == 2){
        performTrackBank1.scrollChannelsUp();
        performTrack1.selectInMixer();
    }else if(enc == 3){
        performTrackBank1.scrollChannelsDown();
        performTrack1.selectInMixer();
    }else if(enc == 4){
        performTrack1.mute().toggle();
    }else if(enc == 5){
        if (P1MODE == pMode.DEVICE){
            performDRCP1.selectNext();
            performTrack1.selectInMixer();
            performDevice1.selectInEditor();
            performDevice1.isRemoteControlsSectionVisible().set(1);
        }else{
            performTrack1.arm().toggle();
        }
    }else if(enc == 6){
        performDeviceBank1.scrollUp();
        performTrack1.selectInMixer();
        performDevice1.selectInEditor();
        performDevice1.isRemoteControlsSectionVisible().set(1);
    }else if(enc == 7){
        performDeviceBank1.scrollDown();
        performTrack1.selectInMixer();
        performDevice1.selectInEditor();
        performDevice1.isRemoteControlsSectionVisible().set(1);
    }else if(enc == 8){
        P2MODE = P2MODE ^= true;
        setActivePage(performPage);
    }else if(enc == 9){
        if (P2MODE == pMode.DEVICE){
            performDRCP2.selectPrevious();
            performTrack2.selectInMixer();
            performDevice2.selectInEditor();
            performDevice2.isRemoteControlsSectionVisible().set(1);
        }else{
            performTrack2.arm().toggle();
        }
    }else if(enc == 10){
        performTrackBank2.scrollChannelsUp();
        performTrack2.selectInMixer();
    }else if(enc == 11){
        performTrackBank2.scrollChannelsDown();
        performTrack2.selectInMixer();
    }else if(enc == 12){
        performTrack2.mute().toggle();
    }else if(enc == 13){
        if (P2MODE == pMode.DEVICE){
            performDRCP2.selectNext();
            performTrack2.selectInMixer();
            performDevice2.selectInEditor();
            performDevice2.isRemoteControlsSectionVisible().set(1);
        }else{
            performTrack2.solo().toggle();
        }
    }else if(enc == 14){
        performDeviceBank2.scrollUp();
        performTrack2.selectInMixer();
        performDevice2.selectInEditor();
        performDevice2.isRemoteControlsSectionVisible().set(1);
    }else if(enc == 15){
        performDeviceBank2.scrollDown();
        performTrack2.selectInMixer();
        performDevice2.selectInEditor();
        performDevice2.isRemoteControlsSectionVisible().set(1);
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
            }else if(enc == 1){
                performTrack1.getSend(0).set(val,127);
            }else if(enc == 2){
                performTrack1.getSend(1).set(val,127);
            }else if(enc == 3){
                performTrack1.getSend(2).set(val,127);
            }else if(enc == 4){
                performTrack1.pan().set(val,127);
            }else if(enc == 5){
                performTrack1.getSend(3).set(val,127);
            }else if(enc == 6){
                performTrack1.getSend(4).set(val,127);
            }else if(enc == 7){
                performTrack1.getSend(5).set(val,127);
            }
        }
    }else if(enc < 16){
        if (P2MODE == pMode.DEVICE){
            performDRCP2.getParameter(enc-8).set(val,127);
        }else if(P2MODE == pMode.TRACK){
            if (enc == 8){
                performTrack2.volume().set(val,127);
            }else if(enc == 9){
                performTrack2.getSend(currentPT2Send).set(val,127);
            }else if(enc == 10){
                performTrack2.getSend(currentPT2Send+1).set(val,127);
            }else if(enc == 11){
                performTrack2.getSend(currentPT2Send+2).set(val,127);
            }else if(enc == 12){
                performTrack2.pan().set(val,127);
            }else if(enc == 13){
                performTrack2.getSend(currentPT2Send+3).set(val,127);
            }else if(enc == 14){
                performTrack2.getSend(currentPT2Send+4).set(val,127);
            }else if(enc == 15){
                performTrack2.getSend(currentPT2Send+5).set(val,127);
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
                if (i == 0){
                    performTrack1IsSelected[0] ?
                        setRGBLED(i, COLOR.GREEN, STROBE.PULSE1) :
                            setRGBLED(i, performTrack1Color[0], STROBE.OFF);
                }else if(i == 1){
                    performTrack1.arm().get() ? 
                        setRGBLED(i, COLOR.RED, STROBE.PULSE1) :
                            setRGBLED(i, performTrack1Color[0], STROBE.OFF);
                }else if(i == 4){
                    performTrack1.mute().get() ? 
                        setRGBLED(i, COLOR.BROWN, STROBE.PULSE1) :
                            setRGBLED(i, performTrack1Color[0], STROBE.OFF);
                }else if(i == 5){
                    performTrack1.solo().get() ? 
                        setRGBLED(i, COLOR.DARK_BLUE, STROBE.PULSE1) :
                            setRGBLED(i, performTrack1Color[0], STROBE.OFF);
                }else{
                    setRGBLED(i, performTrack1Color[0], STROBE.OFF);
                }
            } 
        }else if (i<16){
            if (P2MODE == pMode.DEVICE){
                setRGBLED(i, INDICATOR_COLOR[i-8], STROBE.OFF);
            }else if(P2MODE == pMode.TRACK){
                if (i == 8){
                    performTrack2IsSelected[0] ?
                        setRGBLED(i, COLOR.GREEN, STROBE.PULSE1) :
                            setRGBLED(i, performTrack2Color[0], STROBE.OFF);
                }else if(i == 9){
                    performTrack2.arm().get() ? 
                        setRGBLED(i, COLOR.RED, STROBE.PULSE1) :
                            setRGBLED(i, performTrack2Color[0], STROBE.OFF);
                }else if(i == 12){
                    performTrack2.mute().get() ? 
                        setRGBLED(i, COLOR.BROWN, STROBE.PULSE1) :
                            setRGBLED(i, performTrack2Color[0], STROBE.OFF);
                }else if(i == 13){
                    performTrack2.solo().get() ? 
                        setRGBLED(i, COLOR.DARK_BLUE, STROBE.PULSE1) :
                            setRGBLED(i, performTrack2Color[0], STROBE.OFF);
                }else{
                    setRGBLED(i, performTrack2Color[0], STROBE.OFF);
                }
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
                set11segLED(1, scaleValue(performTrack1.getSend(0).get(), 1, 0, 127));
                set11segLED(2, scaleValue(performTrack1.getSend(1).get(), 1, 0, 127));
                set11segLED(3, scaleValue(performTrack1.getSend(2).get(), 1, 0, 127));
                set11segLED(4, scaleValue(performTrack1.pan().get(), 1, 0, 127));
                set11segLED(5, scaleValue(performTrack1.getSend(3).get(), 1, 0, 127));
                set11segLED(6, scaleValue(performTrack1.getSend(4).get(), 1, 0, 127));
                set11segLED(7, scaleValue(performTrack1.getSend(5).get(), 1, 0, 127));
            }
        }else if(i<16){
            if (P2MODE == pMode.DEVICE){
                set11segLED(i, performDevice2Param[i-8]);
            }else if(P2MODE == pMode.TRACK){
                set11segLED(8, scaleValue(performTrack2.volume().get(), 1, 0, 127));
                set11segLED(9, scaleValue(performTrack2.getSend(0).get(), 1, 0, 127));
                set11segLED(10, scaleValue(performTrack2.getSend(1).get(), 1, 0, 127));
                set11segLED(11, scaleValue(performTrack2.getSend(2).get(), 1, 0, 127));
                set11segLED(12, scaleValue(performTrack2.pan().get(), 1, 0, 127));
                set11segLED(13, scaleValue(performTrack2.getSend(3).get(), 1, 0, 127));
                set11segLED(14, scaleValue(performTrack2.getSend(4).get(), 1, 0, 127));
                set11segLED(15, scaleValue(performTrack2.getSend(5).get(), 1, 0, 127));
            }
        }
    }
}

performPage.updateIndicators = function(){
    //host.showPopupNotification(performTrack1Name + ' : ' + performDevice1Name + ' :: ' + performTrack2Name + ' : ' + performDevice2Name);
    
    if(P1MODE == pMode.DEVICE){
        for (var i=0; i<8; i++){
            performDRCP1.getParameter(i).setIndication(true)
        }
    }else if(P1MODE == pMode.TRACK){
        performTrack1.getVolume().setIndication(true);
        performTrack1.getPan().setIndication(true);
        performTrack1.getSend(0).setIndication(true);
        performTrack1.getSend(1).setIndication(true);
        performTrack1.getSend(2).setIndication(true);
        performTrack1.getSend(3).setIndication(true);
        performTrack1.getSend(4).setIndication(true);
        performTrack1.getSend(5).setIndication(true);
    }

    if(P2MODE == pMode.DEVICE){
        for (var i=0; i<8; i++){
            performDRCP2.getParameter(i).setIndication(true)
        }
    }else if(P2MODE == pMode.TRACK){
        performTrack2.getVolume().setIndication(true);
        performTrack2.getPan().setIndication(true);
        performTrack2.getSend(0).setIndication(true);
        performTrack2.getSend(1).setIndication(true);
        performTrack2.getSend(2).setIndication(true);
        performTrack2.getSend(3).setIndication(true);
        performTrack2.getSend(4).setIndication(true);
        performTrack2.getSend(5).setIndication(true);
    }
}

performPage.deviceChangePopup = function(){
}

performPage.clearIndication = function(){
}