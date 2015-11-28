
melodicSequencerPage = new page();

melodicSequencerPage.title = "Melodic Sequencer";

melodicSequencerPage.updateOutputState = function()
{
    clear();
    this.updateSequencer();
    this.updateRGBLEDs();
    this.update11segLEDs();
    this.updateIndicators();
}

melodicSequencerPage.onEncoderPress = function(isActive)
{
    if (MELODICSEQMODE == melodicSeqMode.NOTE)
    {
        var tempStepPress = (encoderNum-encoderBankOffset.BANK4);
        
        if (MELODICSEQNOTEPAGE == melodicSeqModeNotePage.PITCH)
        {
            if(tempStepStartPressed)
            {
                tempStepPressEnd = tempStepPress;
                var tempStepPressLength = (Math.abs(tempStepPressEnd - tempStepPressStart)+1);
                if (isAnyStepTrue (tempStepPress, stepData))
                {
                    for(step=0; step<tempStepPressEnd; step++)
                    {
                        for(i=0; i<128; i++)
                            {
                            prevStepData[step][i] = false;
                            }
                        cursorClip.clearStep(tempStepPress, getFirstKey(tempStepPress, stepData))
                    }
                }
                else
                {
                cursorClip.setStep(tempStepPressStart, (ROOT_NOTE+(12*CURRENT_OCT)), VELOCITY, (STEP_SIZE*tempStepPressLength));
                //cursorTrack.playNote(ROOT_NOTE+(12*CURRENT_OCT),VELOCITY);
                host.showPopupNotification(rootNoteNames[ROOT_NOTE]+octaveNoteNumbers[CURRENT_OCT]);
                }
                tempStepStartPressed = false;
            }
            else
            {
                tempStepPressStart = tempStepPress;
                tempStepStartPressed = true;
            }
        }
        if (MELODICSEQNOTEPAGE == melodicSeqModeNotePage.VELOCITY)
        {
        }
    }
    if (MELODICSEQMODE == melodicSeqMode.PATTERN)
    {
        if(MELODICSEQPATTERNPAGE == melodicSeqModePatternPage.PATTERN_SET)
        {
            var tempPatternPress = encoderNum-encoderBankOffset.BANK4;
            if (tempPatternStartPressed)
            {
                tempPatternPressEnd = tempPatternPress;
                if(tempPatternPressEnd<tempPatternPressStart)
                {
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
            }
            else
            {
                tempPatternPressStart = tempPatternPress;
                tempPatternStartPressed = true;
            }
        }
        if(MELODICSEQPATTERNPAGE == melodicSeqModePatternPage.SECTION_SELECT)
        {
        }
    }
    
    if (MELODICSEQMODE == melodicSeqMode.SETTINGS)
    {
        if (MELODICSEQSETTINGSPAGE == melodicSeqModeSettingsPage.PAGE1)
        {
        }
    }
}

melodicSequencerPage.onEncoderRelease = function(isActive)
{
    if (MELODICSEQMODE == melodicSeqMode.NOTE)
    {
        if (MELODICSEQNOTEPAGE == melodicSeqModeNotePage.PITCH)
        {
            if (tempStepStartPressed)
            {
                if (isAnyStepTrue (tempStepPressStart, stepData))
                {
                    for(i=0; i<128; i++)
                        {
                        prevStepData[tempStepPressStart][i] = false;
                        }
                prevStepData[tempStepPressStart][getFirstKey(tempStepPressStart, stepData)] = true;
                cursorClip.clearStep(tempStepPressStart, getFirstKey(tempStepPressStart, stepData))
                }
                else
                {
                    if (isAnyStepTrue (tempStepPressStart, prevStepData))
                    {
                    cursorClip.setStep(tempStepPressStart, (getFirstKey(tempStepPressStart, prevStepData)), VELOCITY, STEP_SIZE);
                    //cursorTrack.playNote(getFirstKey(tempStepPressStart, prevStepData),VELOCITY);
                    host.showPopupNotification(rootNoteNames[((getFirstKey(tempStepPressStart, prevStepData))%12)]+((Math.floor((getFirstKey(tempStepPressStart,prevStepData))/12))-2));
                    for(i=0; i<128; i++)
                        {
                        prevStepData[tempStepPressStart][i] = false;
                        }
                    }
                    else
                    {
                    cursorClip.setStep(tempStepPressStart, (ROOT_NOTE+(12*CURRENT_OCT)), VELOCITY, STEP_SIZE);
                    //cursorTrack.playNote(ROOT_NOTE+(12*CURRENT_OCT),VELOCITY);
                    host.showPopupNotification(rootNoteNames[ROOT_NOTE]+octaveNoteNumbers[CURRENT_OCT]);
                    }
                }
            tempStepStartPressed = false;
            }
        }
        if (MELODICSEQNOTEPAGE == melodicSeqModeNotePage.VELOCITY)
        {
            var tempStepPress = (encoderNum-encoderBankOffset.BANK4);
            if (isAnyStepTrue (tempStepPress, stepData))
            {
            cursorClip.setStep(tempStepPress, getFirstKey(tempStepPress, stepData),VELOCITY,STEP_SIZE)
            host.showPopupNotification('Velocity: '+VELOCITY);
            }
            else
            {
            cursorClip.setStep(tempStepPress, (ROOT_NOTE+(12*CURRENT_OCT)), VELOCITY, STEP_SIZE);
            host.showPopupNotification(rootNoteNames[ROOT_NOTE]+octaveNoteNumbers[CURRENT_OCT]);
            }
        
        }
    }
    if (MELODICSEQMODE == melodicSeqMode.PATTERN)
    {
        if (MELODICSEQPATTERNPAGE == melodicSeqModePatternPage.PATTERN_SET)
        {
            if (tempPatternStartPressed)
            {
                cursorClip.getLoopStart().setRaw(tempPatternPressStart*4);
                cursorClip.getPlayStart().setRaw(tempPatternPressStart*4);
                cursorClip.getLoopLength().setRaw(4);
                cursorClip.getPlayStop().setRaw(tempPatternPressStart*4+4);
                tempPatternStartPressed = false;
            }
        }
        if (MELODICSEQPATTERNPAGE == melodicSeqModePatternPage.SECTION_SELECT)
        {
            var tempPrevScrollStepOffset =  currentScrollStepOffset;
            currentScrollStepOffset =  (encoderNum-encoderBankOffset.BANK4);
            currentScrollStepStart = (currentScrollStepOffset*SEQ_STEPS);
            currentScrollStepEnd = (((currentScrollStepOffset*SEQ_STEPS)+SEQ_STEPS) - 1) ;
            
            while (tempPrevScrollStepOffset<currentScrollStepOffset)
            {
                cursorClip.scrollStepsPageForward();
                tempPrevScrollStepOffset++;
            }
            while (tempPrevScrollStepOffset>currentScrollStepOffset)
            {
                cursorClip.scrollStepsPageBackwards();
                tempPrevScrollStepOffset--;
            }
        }
    }
    if (MELODICSEQMODE == melodicSeqMode.SETTINGS)
    {
        if (MELODICSEQSETTINGSPAGE == melodicSeqModeSettingsPage.PAGE1)
        {
            if((encoderNum-encoderBankOffset.BANK4) == melodicEncoderSetting.SEQ_FOLLOW)
            {
                sequencerFollow = !sequencerFollow
                sequencerFollow ? seqFollowRGB = COLOR.GREEN : seqFollowRGB = COLOR.RED;
            }
        }
    }
}

melodicSequencerPage.onEncoderTurn = function(isActive)
{
    var tempStepTurn = (encoderNum-encoderBankOffset.BANK4);
    
    if (MELODICSEQMODE == melodicSeqMode.NOTE)
    {
        if (MELODICSEQNOTEPAGE == melodicSeqModeNotePage.PITCH)
        {   
            if (isAnyStepTrue (tempStepTurn, stepData))
            {
                var tempKey = scaleEncoderToKey(encoderValue);
                tempKey > 127 ? tempKey = 127 : tempKey = tempKey;
                tempKey < 0 ? tempKey = 0 : tempKey = tempKey;
                if (modernModes[CURRENT_MODERN_MODE].indexOf((tempKey-ROOT_NOTE) % 12) > -1)
                {
                    for(i=0; i<128; i++)
                    {
                    cursorClip.clearStep(tempStepTurn, i);
                    }
                    cursorClip.setStep(tempStepTurn, tempKey, VELOCITY, STEP_SIZE);
                    //cursorTrack.playNote(tempKey, VELOCITY);
                    host.showPopupNotification(rootNoteNames[(tempKey%12)]+((Math.floor(tempKey/12))-2));
                }
            }
        }
        if (MELODICSEQNOTEPAGE == melodicSeqModeNotePage.VELOCITY)
        {
            cursorClip.setStep(tempStepTurn, getFirstKey(tempStepTurn, stepData), encoderValue, STEP_SIZE);
        }
    }
    if (MELODICSEQMODE == melodicSeqMode.SETTINGS)
    {
        if(tempStepTurn == melodicEncoderSetting.STEP)
        {
            STEP_SIZE = stepSizeArray[scaleEncoderToSize(encoderValue)];
            stepRGB = rainbowArray[stepSizeArray.indexOf(STEP_SIZE)%(rainbowArray.length-1)];
            cursorClip.setStepSize(STEP_SIZE);
            host.showPopupNotification('Step Size: '+stepSizeNameArray[stepSizeArray.indexOf(STEP_SIZE)]);
        }   
        if (tempStepTurn == melodicEncoderSetting.ROOT)
        {
            ROOT_NOTE = scaleEncoderToRoot(encoderValue);
            rootRGB = rainbowArray[ROOT_NOTE%(rainbowArray.length-1)];
            host.showPopupNotification('Root Note: '+rootNoteNames[ROOT_NOTE]);
        }
        if (tempStepTurn == melodicEncoderSetting.MODE)
        {
            var tempPrevMode = CURRENT_MODERN_MODE
            CURRENT_MODERN_MODE =  scaleEncoderToMode(encoderValue);
            modeRGB = rainbowArray[CURRENT_MODERN_MODE%(rainbowArray.length-1)];
            host.showPopupNotification('Scale: '+modernModesNames[CURRENT_MODERN_MODE]);
        }
        if(tempStepTurn == melodicEncoderSetting.OCT)
        {
            var tempPrevOct = CURRENT_OCT
            CURRENT_OCT = scaleEncoderToOct(encoderValue);
            octRGB = rainbowArray[CURRENT_OCT%(rainbowArray.length-1)];
            host.showPopupNotification('Octave: '+ octaveNoteNumbers[CURRENT_OCT]);
        }
        if(tempStepTurn == melodicEncoderSetting.OCT_RANGE)
        {
            var tempPrevOctRange = OCTAVE_RANGE
            OCTAVE_RANGE = (scaleEncoderToOctRange(encoderValue)+1);
            octRangeRGB = rainbowArray[OCTAVE_RANGE%(rainbowArray.length-1)];
            host.showPopupNotification('Octave Range: '+ octaveRangeNames[OCTAVE_RANGE-1]);
        }   
    }
}

melodicSequencerPage.onRightTopPressed = function(isActive) //TODO: popup
{
}

melodicSequencerPage.onRightTopReleased = function(isActive)
{
    if (MELODICSEQMODE == melodicSeqMode.NOTE)
    {
        if (MELODICSEQNOTEPAGE + 1 < melodicNotePageNameArray.length)
        {
            MELODICSEQNOTEPAGE++;
        }
        else
        {
            MELODICSEQNOTEPAGE = 0;
        }
    }
    else
    {
    MELODICSEQMODE = melodicSeqMode.NOTE;
    }
    host.showPopupNotification('Note Page: ' + melodicNotePageNameArray[MELODICSEQNOTEPAGE]);
}

melodicSequencerPage.onRightMiddlePressed = function(isActive)
{
}

melodicSequencerPage.onRightMiddleReleased = function(isActive)
{
    if (MELODICSEQMODE == melodicSeqMode.PATTERN)
    {
        if (MELODICSEQPATTERNPAGE + 1 < patternPageNameArray.length)
        {
            MELODICSEQPATTERNPAGE++;
        }
        else
        {
            MELODICSEQPATTERNPAGE = 0;
        }
    }
    else
    {
    MELODICSEQMODE = melodicSeqMode.PATTERN;
    }
    host.showPopupNotification('Pattern Page: ' + patternPageNameArray[MELODICSEQPATTERNPAGE]);
}

melodicSequencerPage.onRightBottomPressed = function(isActive)
{
}

melodicSequencerPage.onRightBottomReleased = function(isActive)
{
    if (MELODICSEQMODE == melodicSeqMode.SETTINGS)
    {
    }
    else
    {
    MELODICSEQMODE = melodicSeqMode.SETTINGS;
    host.showPopupNotification('Settings Page 1');
    }
}

melodicSequencerPage.onLeftTopPressed = function(isActive)
{
}

melodicSequencerPage.onLeftTopReleased = function(isActive)
{
    switch(MIXERMODE)
    {
        case mixerMode.VOLUME_PAN:
            ENCODERBANK = 0;
            break
        case mixerMode.SEND:
            ENCODERBANK = 1;
            break
        case mixerMode.Mix4:
            ENCODERBANK = 2;
            break
    }
    
    changeEncoderBank(ENCODERBANK);
	setActivePage(mixerPage);
}

melodicSequencerPage.onLeftMiddlePressed = function(isActive)
{   
}

melodicSequencerPage.onLeftMiddleReleased = function(isActive)
{
    CURRENTSEQMODE = 0;
    setActivePage(drumSequencerPage);
}

melodicSequencerPage.onLeftBottomPressed = function(isActive)
{
}

melodicSequencerPage.onLeftBottomReleased = function(isActive)
{
    ENCODERBANK = 3;
    changeEncoderBank(ENCODERBANK);
    setActivePage(devicePage);
}

melodicSequencerPage.updateRGBLEDs = function()
{
    if(MELODICSEQMODE == melodicSeqMode.NOTE)
    {
        if(MELODICSEQNOTEPAGE == melodicSeqModeNotePage.PITCH)
        {
            for(var i=0; i<16; i++)
                {
                    playingStep == (i + (currentScrollStepOffset*SEQ_STEPS)) ?
                        setRGBLED(i+encoderBankOffset.BANK4, COLOR.GREEN, STROBE.OFF) :
                            isAnyStepTrue(i, stepData) ? setRGBLED(i+encoderBankOffset.BANK4, COLOR.AQUA, STROBE.OFF) :
                                setRGBLED(i+encoderBankOffset.BANK4, COLOR.BLACK, STROBE.OFF);
                }
        }
        if(MELODICSEQNOTEPAGE == melodicSeqModeNotePage.VELOCITY)
        {
            for(var i=0; i<16; i++)
                {
                    playingStep == (i + (currentScrollStepOffset*SEQ_STEPS)) ?
                        setRGBLED(i+encoderBankOffset.BANK4, COLOR.GREEN, STROBE.OFF) :
                            isAnyStepTrue(i, stepData) ? setRGBLED(i+encoderBankOffset.BANK4, COLOR.LIGHT_PINK, STROBE.OFF) :
                                setRGBLED(i+encoderBankOffset.BANK4, COLOR.BLACK, STROBE.OFF);
                }
        }
    }
    if(MELODICSEQMODE == melodicSeqMode.PATTERN)
    {
        if(MELODICSEQPATTERNPAGE == melodicSeqModePatternPage.PATTERN_SET)
        {
            var tempClipStart = Math.floor(clipStart / 4);
            var tempClipStop = Math.ceil((clipStop / 4)-1);
            var tempClipLoopStart = Math.floor(clipLoopStart / 4);
            var tempClipLoopLength = Math.ceil((clipLoopLength/4)-1);
            
            for(var i=0; i<16; i++)
            {
                if ((i>=tempClipStart && i<=tempClipStop) || (i>=tempClipLoopStart && i<=tempClipLoopLength))
                {
                    currentBar == i ?
                        setRGBLED(i+encoderBankOffset.BANK4, COLOR.LIGHT_BLUE, STROBE.PULSE1)
                            : setRGBLED(i+encoderBankOffset.BANK4, COLOR.GREEN, STROBE.OFF) 
                }
                else
                {
                    setRGBLED(i+encoderBankOffset.BANK4, COLOR.BLACK, STROBE.OFF)
                }
            }
        }
        if(MELODICSEQPATTERNPAGE == melodicSeqModePatternPage.SECTION_SELECT)
        {
            var tempSections = ((clipLoopLength/STEP_SIZE)/16)
            for(var i=0; i<16; i++)
            {
                if (i < tempSections)
                {
                currentScrollStepOffset == i ?
                    setRGBLED(i+encoderBankOffset.BANK4, COLOR.GREEN, STROBE.PULSE1) :
                        setRGBLED(i+encoderBankOffset.BANK4, COLOR.GOLD, STROBE.OFF)
                }
            }
        }
    }
    if(MELODICSEQMODE == melodicSeqMode.SETTINGS)
    {
        setRGBLED((encoderBankOffset.BANK4+melodicEncoderSetting.STEP), stepRGB, STROBE.OFF);
        setRGBLED((encoderBankOffset.BANK4+melodicEncoderSetting.SEQ_FOLLOW), seqFollowRGB, sequencerFollow ? STROBE.OFF : STROBE.PULSE1);
        setRGBLED((encoderBankOffset.BANK4+melodicEncoderSetting.ROOT), rootRGB, STROBE.OFF);
        setRGBLED((encoderBankOffset.BANK4+melodicEncoderSetting.MODE), modeRGB, STROBE.OFF);
        setRGBLED((encoderBankOffset.BANK4+melodicEncoderSetting.OCT), octRGB, STROBE.OFF);
        setRGBLED((encoderBankOffset.BANK4+melodicEncoderSetting.OCT_RANGE), octRangeRGB, STROBE.OFF);
    }
}

melodicSequencerPage.update11segLEDs = function()
{
    if(MELODICSEQMODE == melodicSeqMode.NOTE)
    {
        if(MELODICSEQNOTEPAGE == melodicSeqModeNotePage.PITCH)
        { 
            for(var i=0; i<16; i++)
                {
                    if(isAnyStepTrue(i,stepData))
                    {
                    set11segLED(i+encoderBankOffset.BANK4, scaleKeyToEncoder(getFirstKey(i, stepData)));
                    }
                    else
                    {
                    set11segLED(i+encoderBankOffset.BANK4, 0);
                    }
                }
        }
        if(MELODICSEQNOTEPAGE == melodicSeqModeNotePage.VELOCITY)
        {
            for(var i=0; i<16; i++)
                {
                    if(isAnyStepTrue(i,stepData))
                    {
                    set11segLED(i+encoderBankOffset.BANK4, 127);
                    }
                    else
                    {
                    set11segLED(i+encoderBankOffset.BANK4, 0);
                    }
                }
        }
    }
    if(MELODICSEQMODE == melodicSeqMode.PATTERN)
    {
        if(MELODICSEQPATTERNPAGE == melodicSeqModePatternPage.PATTERN_SET)
        {
            for(var i=0; i<16; i++)
                {
                    set11segLED(i+encoderBankOffset.BANK4, 0);
                }
        }
        if(MELODICSEQPATTERNPAGE == melodicSeqModePatternPage.SECTION_SELECT)
        {
            for(var i=0; i<16; i++)
                {
                    set11segLED(i+encoderBankOffset.BANK4, 0);
                }
        }
    }
    if(MELODICSEQMODE == melodicSeqMode.SETTINGS)
    {
        set11segLED((melodicEncoderSetting.STEP+encoderBankOffset.BANK4), scaleSizeToEncoder(stepSizeArray.indexOf(STEP_SIZE)));
        set11segLED((melodicEncoderSetting.ROOT+encoderBankOffset.BANK4), scaleRootToEncoder(ROOT_NOTE));
        set11segLED((melodicEncoderSetting.MODE+encoderBankOffset.BANK4), scaleModeToEncoder(CURRENT_MODERN_MODE));
        set11segLED((melodicEncoderSetting.OCT+encoderBankOffset.BANK4), scaleOctToEncoder(CURRENT_OCT));
        set11segLED((melodicEncoderSetting.OCT_RANGE+encoderBankOffset.BANK4), scaleOctRangeToEncoder(OCTAVE_RANGE));
    }
}

melodicSequencerPage.updateIndicators = function()
{
}

melodicSequencerPage.clearIndication = function()
{
}

melodicSequencerPage.updateSequencer = function()
{
    customScrollStep();
    currentBar = Math.floor(((playingStep*STEP_SIZE)/4));
}