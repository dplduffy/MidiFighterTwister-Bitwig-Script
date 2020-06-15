drumSequencerPage = new page();

drumSequencerPage.title = "Drum Sequencer";
drumSequencerPage.bank = BANK[0];
drumSequencerPage.bankEncOffset = BANK_ENC_OFFSET[0];
drumSequencerPage.bankSBOffset = BANK_SB_OFFSET[0];

drumSequencerPage.updateOutputState = function()
{
    clear();
    this.updateSequencer();
    this.updateRGBLEDs();
    this.update11segLEDs();
    this.updateIndicators();
}

drumSequencerPage.onEncoderPress = function(isActive){
    if (DRUMSEQMODE == drumSeqMode.NOTE){
        var tempStepPress = (enc);
        
        if (DRUMSEQNOTEPAGE == drumSeqModeNotePage.NOTE){
            if(tempStepStartPressed){
                tempStepPressEnd = tempStepPress;
                var tempStepPressLength = (Math.abs(tempStepPressEnd - tempStepPressStart)+1);
                if (stepData[tempStepPress][currentDrumKey]){
                    for(step=0; step<tempStepPressEnd; step++){
                        cursorClip.clearStep(step, currentDrumKey)
                    }
                }else{
                    cursorClip.setStep(tempStepPressStart, currentDrumKey, VELOCITY, (STEP_SIZE*tempStepPressLength));
                    host.showPopupNotification(rootNoteNames[currentDrumKey%12]+octaveNoteNumbers[Math.floor(currentDrumKey/12)]);
                }
                tempStepStartPressed = false;
            }else{
                tempStepPressStart = tempStepPress;
                tempStepStartPressed = true;
            }
        }else if (DRUMSEQNOTEPAGE == drumSeqModeNotePage.VELOCITY){
        }else if (DRUMSEQNOTEPAGE == drumSeqModeNotePage.PAD){
            if ((currentDrumKey-currentDrumOffset) == drumMatrix[tempStepPress]){
                cursorTrack.playNote(currentDrumKey,VELOCITY);
            }
        }
    }else if (DRUMSEQMODE == drumSeqMode.PATTERN){
        if(DRUMSEQPATTERNPAGE == drumSeqModePatternPage.PATTERN_SET){
            var tempPatternPress = enc;
            if (tempPatternStartPressed){
                tempPatternPressEnd = tempPatternPress;
                if(tempPatternPressEnd<tempPatternPressStart){
                    var tempFlip = tempPatternPressEnd;
                    tempPatternPressEnd = tempPatternPressStart;
                    tempPatternPressStart = tempFlip;
                }
                cursorClip.getLoopStart().setRaw(tempPatternPressStart*4);
                cursorClip.getPlayStart().setRaw(tempPatternPressStart*4);
                cursorClip.getLoopLength().setRaw(((tempPatternPressEnd*4)-(tempPatternPressStart*4))+4);
                cursorClip.getPlayStop().setRaw(((tempPatternPressEnd*4)-(tempPatternPressStart*4))+4);
                tempPatternPressStart = 0;
                tempPatternPressEnd = 0;
                tempPatternStartPressed = false;
            }else{
                tempPatternPressStart = tempPatternPress;
                tempPatternStartPressed = true;
            }
        }else if(DRUMSEQPATTERNPAGE == drumSeqModePatternPage.SECTION_SELECT){
        }
    }else if (DRUMSEQMODE == drumSeqMode.SETTINGS){
        if (DRUMSEQSETTINGSPAGE == drumSeqModeSettingsPage.PAGE1){
        }
    }
}

drumSequencerPage.onEncoderRelease = function(isActive){
    if (DRUMSEQMODE == drumSeqMode.NOTE){
        if (DRUMSEQNOTEPAGE == drumSeqModeNotePage.NOTE){
            if (tempStepStartPressed){
                if (stepData[tempStepPressStart][currentDrumKey]){
                    cursorClip.clearStep(tempStepPressStart, currentDrumKey)
                }else{
                    cursorClip.setStep(tempStepPressStart, currentDrumKey, VELOCITY, STEP_SIZE);
                    host.showPopupNotification(rootNoteNames[currentDrumKey%12]+octaveNoteNumbers[Math.floor(currentDrumKey/12)]);
                }
            tempStepStartPressed = false;
            }
        }else if (DRUMSEQNOTEPAGE == drumSeqModeNotePage.VELOCITY){
            var tempStepPress = (enc);
            if (stepData[tempStepPress][currentDrumKey]){
                cursorClip.setStep(tempStepPress, currentDrumKey,VELOCITY,STEP_SIZE)
                host.showPopupNotification('Velocity: '+VELOCITY);
            }else{
                cursorClip.setStep(tempStepPress, currentDrumKey, VELOCITY, STEP_SIZE);
                host.showPopupNotification(rootNoteNames[currentDrumKey%12]+octaveNoteNumbers[CURRENT_OCT]);
            }
        }else if(DRUMSEQNOTEPAGE == drumSeqModeNotePage.PAD){
            currentDrumKey = (drumMatrix[enc] + currentDrumOffset)
        }
    }else if (DRUMSEQMODE == drumSeqMode.PATTERN){
        if (DRUMSEQPATTERNPAGE == drumSeqModePatternPage.PATTERN_SET){
            if (tempPatternStartPressed){
                cursorClip.getLoopStart().setRaw(tempPatternPressStart*4);
                cursorClip.getPlayStart().setRaw(tempPatternPressStart*4);
                cursorClip.getLoopLength().setRaw(4);
                cursorClip.getPlayStop().setRaw(tempPatternPressStart*4+4);
                tempPatternStartPressed = false;
            }
        }else if (DRUMSEQPATTERNPAGE == drumSeqModePatternPage.SECTION_SELECT){
            var tempPrevScrollStepOffset =  currentScrollStepOffset;
            currentScrollStepOffset =  (enc);
            currentScrollStepStart = (currentScrollStepOffset*SEQ_STEPS);
            currentScrollStepEnd = (((currentScrollStepOffset*SEQ_STEPS)+SEQ_STEPS) - 1) ;
            
            while (tempPrevScrollStepOffset<currentScrollStepOffset){
                cursorClip.scrollStepsPageForward();
                tempPrevScrollStepOffset++;
            }
            while (tempPrevScrollStepOffset>currentScrollStepOffset){
                cursorClip.scrollStepsPageBackwards();
                tempPrevScrollStepOffset--;
            }
        }
    }else if (DRUMSEQMODE == drumSeqMode.SETTINGS){
        if (DRUMSEQSETTINGSPAGE == drumSeqModeSettingsPage.PAGE1){
            if((enc) == drumEncoderSetting.SEQ_FOLLOW){
                sequencerFollow = !sequencerFollow
                sequencerFollow ? seqFollowRGB = COLOR.GREEN : seqFollowRGB = COLOR.RED;
            }
        }
    }
}

drumSequencerPage.onEncoderTurn = function(isActive){
    if (DRUMSEQMODE == drumSeqMode.NOTE){
        if (DRUMSEQNOTEPAGE == drumSeqModeNotePage.NOTE){   
        }
        if (DRUMSEQNOTEPAGE == drumSeqModeNotePage.VELOCITY){
            cursorClip.setStep(enc, currentDrumKey, val, STEP_SIZE);
        }
    }else if (DRUMSEQMODE == drumSeqMode.SETTINGS){
        if(enc == drumEncoderSetting.STEP){
            var tempPrevStep = STEP_SIZE
            STEP_SIZE = stepSizeArray[scaleEncoderToSize(val)];
            if (tempPrevStep < STEP_SIZE){
                stepRGB = incrementRainbow(stepRGB);
            }else if (tempPrevStep > STEP_SIZE){
                stepRGB = decrementRainbow(stepRGB);
            }
            cursorClip.setStepSize(STEP_SIZE);
            host.showPopupNotification('Step Size: '+stepSizeNameArray[stepSizeArray.indexOf(STEP_SIZE)]);
        }else if(enc == drumEncoderSetting.DRUM_OFFSET){
            var tempPrevDrumOffset = currentDrumOffset
            currentDrumOffset = drumOffsets[scaleEncoderToDrumOffset(val)];
            currentDrumKey = currentDrumOffset;
            if (tempPrevDrumOffset < currentDrumOffset){
                drumOffsetRGB = incrementRainbow(drumOffsetRGB);
            }else if (tempPrevDrumOffset > currentDrumOffset){
                drumOffsetRGB = decrementRainbow(drumOffsetRGB);
            }
            host.showPopupNotification('Drum Map: '+ drumOffsetNames[drumOffsets.indexOf(currentDrumOffset)]);
        }
    }
}

drumSequencerPage.onRightTopPressed = function(isActive){
}

drumSequencerPage.onRightTopReleased = function(isActive){
    if (DRUMSEQMODE == drumSeqMode.NOTE){
        if (DRUMSEQNOTEPAGE + 1 < drumNotePageNameArray.length){
            DRUMSEQNOTEPAGE++;
        }else{
            DRUMSEQNOTEPAGE = 0;
        }
    }else{
        DRUMSEQMODE = drumSeqMode.NOTE;
    }
    host.showPopupNotification('Note Page: ' + drumNotePageNameArray[DRUMSEQNOTEPAGE]);
}

drumSequencerPage.onRightMiddlePressed = function(isActive){
}

drumSequencerPage.onRightMiddleReleased = function(isActive){
    if (DRUMSEQMODE == drumSeqMode.PATTERN){
        if (DRUMSEQPATTERNPAGE + 1 < patternPageNameArray.length){
            DRUMSEQPATTERNPAGE++;
        }else{
            DRUMSEQPATTERNPAGE = 0;
        }
    }else{
        DRUMSEQMODE = drumSeqMode.PATTERN;
    }
    host.showPopupNotification('Pattern Page: ' + patternPageNameArray[DRUMSEQPATTERNPAGE]);
}

drumSequencerPage.onRightBottomPressed = function(isActive){
}

drumSequencerPage.onRightBottomReleased = function(isActive){
    if (DRUMSEQMODE == drumSeqMode.SETTINGS){
    }else{
        DRUMSEQMODE = drumSeqMode.SETTINGS;
        host.showPopupNotification('Settings Page 1');
    }
}

drumSequencerPage.onLeftTopPressed = function(isActive){
}

drumSequencerPage.onLeftTopReleased = function(isActive){
    cyclePage();
}

drumSequencerPage.onLeftMiddlePressed = function(isActive){
}

drumSequencerPage.onLeftMiddleReleased = function(isActive){
    CURRENTSEQMODE = 1;
    setActivePage(melodicSequencerPage);
}

drumSequencerPage.onLeftBottomPressed = function(isActive){
}

drumSequencerPage.onLeftBottomReleased = function(isActive){
}

drumSequencerPage.updateRGBLEDs = function(){
    if(DRUMSEQMODE == drumSeqMode.NOTE){
        if(DRUMSEQNOTEPAGE == drumSeqModeNotePage.NOTE){
            for(var i=0; i<16; i++){
                playingStep == (i + (currentScrollStepOffset*SEQ_STEPS)) ?
                    setRGBLED(i, COLOR.GREEN, STROBE.OFF) :
                        stepData[i][currentDrumKey] ? setRGBLED(i, COLOR.AQUA, STROBE.OFF) :
                            setRGBLED(i, COLOR.BLACK, STROBE.OFF);
            }
        }else if(DRUMSEQNOTEPAGE == drumSeqModeNotePage.VELOCITY){
            for(var i=0; i<16; i++){
                playingStep == (i + (currentScrollStepOffset*SEQ_STEPS)) ?
                    setRGBLED(i, COLOR.GREEN, STROBE.OFF) :
                        stepData[i][currentDrumKey] ? setRGBLED(i, COLOR.LIGHT_PINK, STROBE.OFF) :
                            setRGBLED(i, COLOR.BLACK, STROBE.OFF);
            }
        }else if(DRUMSEQNOTEPAGE == drumSeqModeNotePage.PAD){
            for(var i=0; i<16; i++){
                currentDrumKey == (drumMatrix[i] + currentDrumOffset) ?
                    setRGBLED(i, COLOR.GREEN, STROBE.PULSE1) :
                        setRGBLED(i, COLOR.GOLD, STROBE.OFF);
            }
        }
    }else if(DRUMSEQMODE == drumSeqMode.PATTERN){
        if(DRUMSEQPATTERNPAGE == drumSeqModePatternPage.PATTERN_SET){
            var tempClipStart = Math.floor(clipStart / 4);
            var tempClipStop = Math.ceil((clipStop / 4)-1);
            var tempClipLoopStart = Math.floor(clipLoopStart / 4);
            var tempClipLoopLength = Math.ceil((clipLoopLength/4)-1);
            
            for(var i=0; i<16; i++){
                if ((i>=tempClipStart && i<=tempClipStop) || (i>=tempClipLoopStart && i<=tempClipLoopLength)){
                    currentBar == i ?
                        setRGBLED(i, COLOR.LIGHT_BLUE, STROBE.PULSE1)
                            : setRGBLED(i, COLOR.GREEN, STROBE.OFF) 
                }else{
                    setRGBLED(i, COLOR.BLACK, STROBE.OFF)
                }
            }
        }else if(DRUMSEQPATTERNPAGE == drumSeqModePatternPage.SECTION_SELECT){
            var tempSections = ((clipLoopLength/STEP_SIZE)/16)
            for(var i=0; i<16; i++){
                if (i < tempSections){
                    currentScrollStepOffset == i ?
                        setRGBLED(i, COLOR.GREEN, STROBE.PULSE1) :
                            setRGBLED(i, COLOR.LIGHT_YELLOW, STROBE.OFF)
                }
            }
        }
    }else if(DRUMSEQMODE == drumSeqMode.SETTINGS){
        setRGBLED((drumEncoderSetting.STEP), stepRGB, STROBE.OFF);
        setRGBLED((drumEncoderSetting.SEQ_FOLLOW), seqFollowRGB, sequencerFollow ? STROBE.OFF : STROBE.PULSE1);
        setRGBLED((drumEncoderSetting.DRUM_OFFSET), drumOffsetRGB, STROBE.OFF);
    }
}

drumSequencerPage.update11segLEDs = function(){
    if(DRUMSEQMODE == drumSeqMode.NOTE){
        if(DRUMSEQNOTEPAGE == drumSeqModeNotePage.NOTE){ 
            for(var i=0; i<16; i++){
                if(stepData[i][currentDrumKey]){
                    set11segLED(i, 127);
                }else{
                    set11segLED(i, 0);
                }
            }
        }else if(DRUMSEQNOTEPAGE == drumSeqModeNotePage.VELOCITY){
            for(var i=0; i<16; i++){
                if(stepData[i][currentDrumKey]){
                    set11segLED(i, 127);
                }else{
                    set11segLED(i, 0);
                }
            }
        }else if(DRUMSEQNOTEPAGE == drumSeqModeNotePage.PAD){
            for(var i=0; i<16; i++){
                if(currentDrumKey == drumMatrix[i]+currentDrumOffset){
                    set11segLED(i, 127);
                }else{
                    set11segLED(i, 0);
                }
            }
        }
    }else if(DRUMSEQMODE == drumSeqMode.PATTERN){
        if(DRUMSEQPATTERNPAGE == drumSeqModePatternPage.PATTERN_SET){
            for(var i=0; i<16; i++){
                set11segLED(i, 0);
            }
        }else if(DRUMSEQPATTERNPAGE == drumSeqModePatternPage.SECTION_SELECT){
            for(var i=0; i<16; i++){
                set11segLED(i, 0);
            }
        }
    }else if(DRUMSEQMODE == drumSeqMode.SETTINGS){
        set11segLED((drumEncoderSetting.STEP), scaleSizeToEncoder(stepSizeArray.indexOf(STEP_SIZE)));
        set11segLED((drumEncoderSetting.SEQ), scaleRootToEncoder(ROOT_NOTE));
        set11segLED((drumEncoderSetting.DRUM_OFFSET), scaleDrumOffsetToEncoder(drumOffsets.indexOf(currentDrumOffset)));
    }
}

drumSequencerPage.updateIndicators = function()
{
}

drumSequencerPage.clearIndication = function()
{
}

drumSequencerPage.updateSequencer = function()
{
    customScrollStep();
    currentBar = Math.floor(((playingStep*STEP_SIZE)/4));
}