drumSequencerPage = new page();

drumSequencerPage.title = "Drum Sequencer";

var tempPatternPressStart = 0;
var tempPatternPressEnd = 0;
var tempPatternStartPressed = false;
var tempStepPressStart = 0;
var tempStepPressEnd = 0;
var tempStepStartPressed = false;
var currentBar = 0;
var barsOnPage = 0;
var currentSeqChunk = 0;
var currentScrollStepOffset = 0;
var currentScrollStepStart = 0;
var currentScrollStepEnd = 15;
var currentDrumKey = 36;
var currentDrumOffset = 36;
var a = 0;
var b = 0;
var min = 0;
var max = 127;
var stepRGB = 67;
var seqFollowRGB = COLOR.GREEN;
var drumOffsetRGB = 40;

drumSequencerPage.updateOutputState = function()
{
    clear();
    this.updateSequencer();
    this.updateRGBLEDs();
    this.update11segLEDs();
    this.updateIndicators();
}

drumSequencerPage.onEncoderPress = function(isActive)
{

    if (DRUMSEQMODE == drumSeqMode.NOTE)
    {
        var tempStepPress = (encoderNum-encoderBankOffset.BANK4);
        
        if (DRUMSEQNOTEPAGE == drumSeqModeNotePage.NOTE)
        {
            if(tempStepStartPressed)
            {
                tempStepPressEnd = tempStepPress;
                var tempStepPressLength = (Math.abs(tempStepPressEnd - tempStepPressStart)+1);
                if (stepData[tempStepPress][currentDrumKey])
                {
                    for(step=0; step<tempStepPressEnd; step++)
                    {
                        cursorClip.clearStep(step, currentDrumKey)
                    }
                }
                else
                {
                cursorClip.setStep(tempStepPressStart, currentDrumKey, VELOCITY, (STEP_SIZE*tempStepPressLength));
                host.showPopupNotification(rootNoteNames[currentDrumKey%12]+octaveNoteNumbers[Math.floor(currentDrumKey/12)]);
                }
                tempStepStartPressed = false;
            }
            else
            {
                tempStepPressStart = tempStepPress;
                tempStepStartPressed = true;
            }
        }
        if (DRUMSEQNOTEPAGE == drumSeqModeNotePage.VELOCITY)
        {
        }
        if (DRUMSEQNOTEPAGE == drumSeqModeNotePage.PAD)
        {
            if ((currentDrumKey-currentDrumOffset) == drumMatrix[tempStepPress])
            {
                cursorTrack.playNote(currentDrumKey,VELOCITY);
            }
        }
    }
    if (DRUMSEQMODE == drumSeqMode.PATTERN)
    {
        if(DRUMSEQPATTERNPAGE == drumSeqModePatternPage.PATTERN_SET)
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
        if(DRUMSEQPATTERNPAGE == drumSeqModePatternPage.SECTION_SELECT)
        {
        }
    }
    if (DRUMSEQMODE == drumSeqMode.SETTINGS)
    {
        if (DRUMSEQSETTINGSPAGE == drumSeqModeSettingsPage.PAGE1)
        {
        }
    }
}

drumSequencerPage.onEncoderRelease = function(isActive)
{
    if (DRUMSEQMODE == drumSeqMode.NOTE)
    {
        if (DRUMSEQNOTEPAGE == drumSeqModeNotePage.NOTE)
        {
            if (tempStepStartPressed)
            {
                if (stepData[tempStepPressStart][currentDrumKey])
                {
                cursorClip.clearStep(tempStepPressStart, currentDrumKey)
                }
                else
                {
                cursorClip.setStep(tempStepPressStart, currentDrumKey, VELOCITY, STEP_SIZE);
                host.showPopupNotification(rootNoteNames[currentDrumKey%12]+octaveNoteNumbers[Math.floor(currentDrumKey/12)]);
                }
            tempStepStartPressed = false;
            }
        }
        if (DRUMSEQNOTEPAGE == drumSeqModeNotePage.VELOCITY)
        {
            var tempStepPress = (encoderNum-encoderBankOffset.BANK4);
            if (stepData[tempStepPress][currentDrumKey])
            {
            cursorClip.setStep(tempStepPress, currentDrumKey,VELOCITY,STEP_SIZE)
            host.showPopupNotification('Velocity: '+VELOCITY);
            }
            else
            {
            cursorClip.setStep(tempStepPress, currentDrumKey, VELOCITY, STEP_SIZE);
            host.showPopupNotification(rootNoteNames[currentDrumKey%12]+octaveNoteNumbers[CURRENT_OCT]);
            }
        }
        if(DRUMSEQNOTEPAGE == drumSeqModeNotePage.PAD)
        {
            currentDrumKey = (drumMatrix[encoderNum-encoderBankOffset.BANK4] + currentDrumOffset)
        }
    }
    if (DRUMSEQMODE == drumSeqMode.PATTERN)
    {
        if (DRUMSEQPATTERNPAGE == drumSeqModePatternPage.PATTERN_SET)
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
        if (DRUMSEQPATTERNPAGE == drumSeqModePatternPage.SECTION_SELECT)
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
    if (DRUMSEQMODE == drumSeqMode.SETTINGS)
    {
        if (DRUMSEQSETTINGSPAGE == drumSeqModeSettingsPage.PAGE1)
        {
            if((encoderNum-encoderBankOffset.BANK4) == drumEncoderSetting.SEQ_FOLLOW)
            {
                sequencerFollow = !sequencerFollow
                sequencerFollow ? seqFollowRGB = COLOR.GREEN : seqFollowRGB = COLOR.RED;
            }
        }
    }
}

drumSequencerPage.onEncoderTurn = function(isActive)
{
    var tempStepTurn = (encoderNum-encoderBankOffset.BANK4);
    
    if (DRUMSEQMODE == drumSeqMode.NOTE)
    {
        if (DRUMSEQNOTEPAGE == drumSeqModeNotePage.NOTE)
        {   
        }
        if (DRUMSEQNOTEPAGE == drumSeqModeNotePage.VELOCITY)
        {
            cursorClip.setStep(tempStepTurn, currentDrumKey, encoderValue, STEP_SIZE);
        }
    }
    if (DRUMSEQMODE == drumSeqMode.SETTINGS)
    {
        if(tempStepTurn == drumEncoderSetting.STEP)
        {
            var tempPrevStep = STEP_SIZE
            STEP_SIZE = stepSizeArray[scaleEncoderToSize(encoderValue)];
            if (tempPrevStep < STEP_SIZE)
            {
                stepRGB = incrementRainbow(stepRGB);
            }
            if (tempPrevStep > STEP_SIZE)
            {
                stepRGB = decrementRainbow(stepRGB);
            }
            cursorClip.setStepSize(STEP_SIZE);
            host.showPopupNotification('Step Size: '+stepSizeNameArray[stepSizeArray.indexOf(STEP_SIZE)]);
        } 
        if(tempStepTurn == drumEncoderSetting.DRUM_OFFSET)
        {
            var tempPrevDrumOffset = currentDrumOffset
            currentDrumOffset = drumOffsets[scaleEncoderToDrumOffset(encoderValue)];
            currentDrumKey = currentDrumOffset;
            if (tempPrevDrumOffset < currentDrumOffset)
            {
                drumOffsetRGB = incrementRainbow(drumOffsetRGB);
            }
            if (tempPrevDrumOffset > currentDrumOffset)
            {
                drumOffsetRGB = decrementRainbow(drumOffsetRGB);
            }
            host.showPopupNotification('Drum Map: '+ drumOffsetNames[drumOffsets.indexOf(currentDrumOffset)]);
        }
    }
}

drumSequencerPage.onRightTopPressed = function(isActive)
{
}

drumSequencerPage.onRightTopReleased = function(isActive) 
{
    if (DRUMSEQMODE == drumSeqMode.NOTE)
    {
        if (DRUMSEQNOTEPAGE + 1 < drumNotePageNameArray.length)
        {
            DRUMSEQNOTEPAGE++;
        }
        else
        {
            DRUMSEQNOTEPAGE = 0;
        }
    }
    else
    {
    DRUMSEQMODE = drumSeqMode.NOTE;
    }
    host.showPopupNotification('Note Page: ' + drumNotePageNameArray[DRUMSEQNOTEPAGE]);
}

drumSequencerPage.onRightMiddlePressed = function(isActive)
{
}

drumSequencerPage.onRightMiddleReleased = function(isActive)
{
    if (DRUMSEQMODE == drumSeqMode.PATTERN)
    {
        if (DRUMSEQPATTERNPAGE + 1 < patternPageNameArray.length)
        {
            DRUMSEQPATTERNPAGE++;
        }
        else
        {
            DRUMSEQPATTERNPAGE = 0;
        }
    }
    else
    {
    DRUMSEQMODE = drumSeqMode.PATTERN;
    }
    host.showPopupNotification('Pattern Page: ' + patternPageNameArray[DRUMSEQPATTERNPAGE]);
}

drumSequencerPage.onRightBottomPressed = function(isActive)
{
}

drumSequencerPage.onRightBottomReleased = function(isActive)
{
    if (DRUMSEQMODE == drumSeqMode.SETTINGS)
    {
    }
    else
    {
    DRUMSEQMODE = drumSeqMode.SETTINGS;
    host.showPopupNotification('Settings Page 1');
    }
}

drumSequencerPage.onLeftTopPressed = function(isActive)
{
}

drumSequencerPage.onLeftTopReleased = function(isActive)
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

drumSequencerPage.onLeftMiddlePressed = function(isActive)
{
}

drumSequencerPage.onLeftMiddleReleased = function(isActive)
{
    CURRENTSEQMODE = 1;
    setActivePage(melodicSequencerPage);
}

drumSequencerPage.onLeftBottomPressed = function(isActive)
{
}

drumSequencerPage.onLeftBottomReleased = function(isActive)
{
    ENCODERBANK = 3;
    changeEncoderBank(ENCODERBANK);
    setActivePage(devicePage);
}

drumSequencerPage.updateRGBLEDs = function()
{
    if(DRUMSEQMODE == drumSeqMode.NOTE)
    {
        if(DRUMSEQNOTEPAGE == drumSeqModeNotePage.NOTE)
        {
            for(var i=0; i<16; i++)
                {
                    playingStep == (i + (currentScrollStepOffset*SEQ_STEPS)) ?
                        setRGBLED(i+encoderBankOffset.BANK4, COLOR.GREEN, STROBE.OFF) :
                            stepData[i][currentDrumKey] ? setRGBLED(i+encoderBankOffset.BANK4, COLOR.AQUA, STROBE.OFF) :
                                setRGBLED(i+encoderBankOffset.BANK4, COLOR.BLACK, STROBE.OFF);
                }
        }
        if(DRUMSEQNOTEPAGE == drumSeqModeNotePage.VELOCITY)
        {
            for(var i=0; i<16; i++)
                {
                    playingStep == (i + (currentScrollStepOffset*SEQ_STEPS)) ?
                        setRGBLED(i+encoderBankOffset.BANK4, COLOR.GREEN, STROBE.OFF) :
                            stepData[i][currentDrumKey] ? setRGBLED(i+encoderBankOffset.BANK4, COLOR.LIGHT_PINK, STROBE.OFF) :
                                setRGBLED(i+encoderBankOffset.BANK4, COLOR.BLACK, STROBE.OFF);
                }
        }
        if(DRUMSEQNOTEPAGE == drumSeqModeNotePage.PAD)
        {
            for(var i=0; i<16; i++)
            {
                currentDrumKey == (drumMatrix[i] + currentDrumOffset) ?
                    setRGBLED(i+encoderBankOffset.BANK4, COLOR.GREEN, STROBE.PULSE1) :
                        setRGBLED(i+encoderBankOffset.BANK4, COLOR.GOLD, STROBE.OFF);
            }
        }
    }
    if(DRUMSEQMODE == drumSeqMode.PATTERN)
    {
        if(DRUMSEQPATTERNPAGE == drumSeqModePatternPage.PATTERN_SET)
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
        if(DRUMSEQPATTERNPAGE == drumSeqModePatternPage.SECTION_SELECT)
        {
            var tempSections = ((clipLoopLength/STEP_SIZE)/16)
            for(var i=0; i<16; i++)
            {
                if (i < tempSections)
                {
                currentScrollStepOffset == i ?
                    setRGBLED(i+encoderBankOffset.BANK4, COLOR.GREEN, STROBE.PULSE1) :
                        setRGBLED(i+encoderBankOffset.BANK4, COLOR.LIGHT_YELLOW, STROBE.OFF)
                }
            }
        }
    }
    if(DRUMSEQMODE == drumSeqMode.SETTINGS)
    {
        setRGBLED((encoderBankOffset.BANK4+drumEncoderSetting.STEP), stepRGB, STROBE.OFF);
        setRGBLED((encoderBankOffset.BANK4+drumEncoderSetting.SEQ_FOLLOW), seqFollowRGB, sequencerFollow ? STROBE.OFF : STROBE.PULSE1);
        setRGBLED((encoderBankOffset.BANK4+drumEncoderSetting.DRUM_OFFSET), drumOffsetRGB, STROBE.OFF);
    }
}

drumSequencerPage.update11segLEDs = function()
{
    if(DRUMSEQMODE == drumSeqMode.NOTE)
    {
        if(DRUMSEQNOTEPAGE == drumSeqModeNotePage.NOTE)
        { 
            for(var i=0; i<16; i++)
                {
                    if(stepData[i][currentDrumKey])
                    {
                    set11segLED(i+encoderBankOffset.BANK4, 127);
                    }
                    else
                    {
                    set11segLED(i+encoderBankOffset.BANK4, 0);
                    }
                }
        }
        if(DRUMSEQNOTEPAGE == drumSeqModeNotePage.VELOCITY)
        {
            for(var i=0; i<16; i++)
                {
                    if(stepData[i][currentDrumKey])
                    {
                    set11segLED(i+encoderBankOffset.BANK4, 127);
                    }
                    else
                    {
                    set11segLED(i+encoderBankOffset.BANK4, 0);
                    }
                }
        }
        if(DRUMSEQNOTEPAGE == drumSeqModeNotePage.PAD)
        {
            for(var i=0; i<16; i++)
                {
                    if(currentDrumKey == drumMatrix[i]+currentDrumOffset)
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
    if(DRUMSEQMODE == drumSeqMode.PATTERN)
    {
        if(DRUMSEQPATTERNPAGE == drumSeqModePatternPage.PATTERN_SET)
        {
            for(var i=0; i<16; i++)
                {
                    set11segLED(i+encoderBankOffset.BANK4, 0);
                }
        }
        if(DRUMSEQPATTERNPAGE == drumSeqModePatternPage.SECTION_SELECT)
        {
            for(var i=0; i<16; i++)
                {
                    set11segLED(i+encoderBankOffset.BANK4, 0);
                }
        }
    }
    if(DRUMSEQMODE == drumSeqMode.SETTINGS)
    {
        set11segLED((drumEncoderSetting.STEP+encoderBankOffset.BANK4), scaleSizeToEncoder(stepSizeArray.indexOf(STEP_SIZE)));
        set11segLED((drumEncoderSetting.SEQ+encoderBankOffset.BANK4), scaleRootToEncoder(ROOT_NOTE));
        set11segLED((drumEncoderSetting.DRUM_OFFSET+encoderBankOffset.BANK4), scaleDrumOffsetToEncoder(drumOffsets.indexOf(currentDrumOffset)));
    }
}

drumSequencerPage.updateIndicators = function()
{
}

drumSequencerPage.updateSequencer = function()
{
    customScrollStep();
    currentBar = Math.floor(((playingStep*STEP_SIZE)/4));
}