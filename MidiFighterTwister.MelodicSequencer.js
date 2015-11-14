
melodicSequencerPage = new page();

melodicSequencerPage.title = "Melodic Sequencer";

var tempPatternPressStart = 0;
var tempPatternPressEnd = 0;
var tempPatternStartPressed = false;
var currentBar = 0;
var barsOnPage = 0;
var currentSeqChunk = 0;
var currentScrollStepOffset = 0;
var currentScrollStepStart = 0;
var currentScrollStepEnd = 15;
var a = 0;
var b = 0;
var min = 0;
var max = 127;
var rootRGB = 80;
var modeRGB = 80;
var stepRGB = 67;

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
        
        if (isAnyStepTrue (tempStepPress, stepData))
        {
        cursorClip.clearStep(tempStepPress, getFirstKey(tempStepPress, stepData))
        }
        else
        {
        cursorClip.setStep(tempStepPress, (ROOT_NOTE+(12*CURRENT_OCT)), VELOCITY, STEP_SIZE);
        host.showPopupNotification(rootNoteNames[ROOT_NOTE]+octaveNoteNumbers[CURRENT_OCT]);
        }
    }
    
    if (MELODICSEQMODE == melodicSeqMode.PATTERN)
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
}

melodicSequencerPage.onEncoderRelease = function(isActive)
{
    if (MELODICSEQMODE == melodicSeqMode.PATTERN)
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
                if (modernModes[CURRENT_MODERN_MODE].indexOf((tempKey-ROOT_NOTE) % 12) > -1)
                {
                    for(i=0; i<128; i++)
                    {
                    cursorClip.clearStep(tempStepTurn, i);
                    }
                    cursorClip.setStep(tempStepTurn, tempKey, VELOCITY, STEP_SIZE);
                    host.showPopupNotification(rootNoteNames[(tempKey%12)]+octaveNoteNumbers[((CURRENT_OCT)+(Math.floor(tempKey/12)))]);
                }
            }
        }
    }
    if (MELODICSEQMODE == melodicSeqMode.SETTINGS)
    {
        if (tempStepTurn == melodicEncoderSetting.ROOT)
        {
            var tempPrevRoot = ROOT_NOTE;
            ROOT_NOTE = scaleEncoderToRoot(encoderValue);
            if(tempPrevRoot < ROOT_NOTE)
            {
                rootRGB = incrementRainbow(rootRGB);
            }
            if(tempPrevRoot > ROOT_NOTE)
            {
                rootRGB = decrementRainbow(rootRGB);
            }
            host.showPopupNotification('Root Note: '+rootNoteNames[ROOT_NOTE]);
        }
        if (tempStepTurn == melodicEncoderSetting.MODE)
        {
            var tempPrevMode = CURRENT_MODERN_MODE
            CURRENT_MODERN_MODE =  scaleEncoderToMode(encoderValue);
            if (tempPrevMode < CURRENT_MODERN_MODE)
            {
                modeRGB = incrementRainbow(modeRGB);
            }
            if (tempPrevMode > CURRENT_MODERN_MODE)
            {
                modeRGB = decrementRainbow(modeRGB);
            }
            host.showPopupNotification('Scale: '+modernModesNames[CURRENT_MODERN_MODE]);
        }
        if(tempStepTurn == melodicEncoderSetting.STEP)
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
    }
}

melodicSequencerPage.onRightTopPressed = function(isActive) //TODO: popup
{
}

melodicSequencerPage.onRightTopReleased = function(isActive)
{
    MELODICSEQMODE = melodicSeqMode.NOTE;
    host.showPopupNotification('Note Page');
}

melodicSequencerPage.onRightMiddlePressed = function(isActive)
{
}

melodicSequencerPage.onRightMiddleReleased = function(isActive)
{
    if (MELODICSEQMODE == melodicSeqMode.PATTERN)
    {
    }
    else
    {
    MELODICSEQMODE = melodicSeqMode.PATTERN;
    host.showPopupNotification('Pattern Page');
    }
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
}

melodicSequencerPage.updateRGBLEDs = function()
{
    if(MELODICSEQMODE == melodicSeqMode.NOTE)
    {
        for(var i=0; i<16; i++)
            {
                playingStep == (i + (currentScrollStepOffset*SEQ_STEPS)) ?
                    setRGBLED(i+encoderBankOffset.BANK4, COLOR.GREEN, STROBE.OFF) :
                        isAnyStepTrue(i, stepData) ? setRGBLED(i+encoderBankOffset.BANK4, COLOR.AQUA, STROBE.OFF) :
                            setRGBLED(i+encoderBankOffset.BANK4, COLOR.BLACK, STROBE.OFF);
            }
    }
    if(MELODICSEQMODE == melodicSeqMode.PATTERN)
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
    if(MELODICSEQMODE == melodicSeqMode.SETTINGS)
    {
        setRGBLED((encoderBankOffset.BANK4+melodicEncoderSetting.ROOT), rootRGB, STROBE.OFF);
        setRGBLED((encoderBankOffset.BANK4+melodicEncoderSetting.MODE), modeRGB, STROBE.OFF);
        setRGBLED((encoderBankOffset.BANK4+melodicEncoderSetting.STEP), stepRGB, STROBE.OFF);
    }
}

melodicSequencerPage.update11segLEDs = function()
{
    if(MELODICSEQMODE == melodicSeqMode.NOTE)
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
    if(MELODICSEQMODE == melodicSeqMode.PATTERN)
    {
        for(var i=0; i<16; i++)
            {
                set11segLED(i+encoderBankOffset.BANK4, 0);
            }
    }
    if(MELODICSEQMODE == melodicSeqMode.SETTINGS)
    {
        set11segLED((melodicEncoderSetting.ROOT+encoderBankOffset.BANK4), scaleRootToEncoder(ROOT_NOTE));
        set11segLED((melodicEncoderSetting.MODE+encoderBankOffset.BANK4), scaleModeToEncoder(CURRENT_MODERN_MODE));
        set11segLED((melodicEncoderSetting.STEP+encoderBankOffset.BANK4), scaleSizeToEncoder(stepSizeArray.indexOf(STEP_SIZE)));
    }
}

melodicSequencerPage.updateIndicators = function()
{
}

melodicSequencerPage.updateSequencer = function()
{
    customScrollStep();
}

function customScrollStep()
{
    if (playingStep > -1)
    {
        while (playingStep>currentScrollStepEnd)
        {
            cursorClip.scrollStepsPageForward();
            currentScrollStepOffset = currentScrollStepOffset + 1;
            currentScrollStepStart = (currentScrollStepOffset*SEQ_STEPS);
            currentScrollStepEnd = (((currentScrollStepOffset*SEQ_STEPS)+SEQ_STEPS) - 1) ;
        }
        while (playingStep<currentScrollStepStart)
        {
            cursorClip.scrollStepsPageBackwards()
            currentScrollStepOffset = currentScrollStepOffset - 1;
            currentScrollStepStart = (currentScrollStepOffset*SEQ_STEPS);
            currentScrollStepEnd = (((currentScrollStepOffset*SEQ_STEPS)+SEQ_STEPS) - 1) ;             
        }
    }
}

function scaleKeyToEncoder(key)
{
    var keytemp = key - (CURRENT_OCT*12);
    keytemp = (keytemp / (OCTAVE_RANGE*12)) * 127;
    keytemp > 127 ? keytemp = 127 : keytemp = Math.floor(keytemp);
    return keytemp;
}

function scaleEncoderToKey(enc)
{
    a = (CURRENT_OCT*12);
    b = (a+(OCTAVE_RANGE*12));
    return Math.floor(((((b-a)*(enc-min))/(max-min)) + a));
}

function scaleRootToEncoder(root)
{
    return Math.floor((root/(rootNoteNames.length-1))*127);
}

function scaleEncoderToRoot(enc)
{
    a = 0;
    b = rootNoteNames.length-1;
    return Math.floor(((((b-a)*(enc-min))/(max-min)) + a));
}

function scaleModeToEncoder(mode)
{
    return Math.floor((mode/(modernModes.length-1))*127);
}

function scaleEncoderToMode(enc)
{
    a = 0;
    b = modernModes.length-1;
    return Math.floor(((((b-a)*(enc-min))/(max-min)) + a));
}

function scaleSizeToEncoder(size)
{
    return Math.floor((size/(stepSizeArray.length-1))*127);
}

function scaleEncoderToSize(enc)
{
    a = 0;
    b = stepSizeArray.length-1;
    return Math.floor(((((b-a)*(enc-min))/(max-min)) + a));
}

function incrementRainbow (varToInc)
{
    var tempIndex = rainbowArray.indexOf(varToInc);
    rainbowArray[tempIndex+1] > -1 ? varToInc = rainbowArray[tempIndex+1] : varToInc = rainbowArray[0];
    return varToInc;
}

function decrementRainbow (varToInc)
{
    var tempIndex = rainbowArray.indexOf(varToInc);
    rainbowArray[tempIndex-1] > -1 ? varToInc = rainbowArray[tempIndex-1] : varToInc = rainbowArray[rainbowArray.length-1];
    return varToInc;
}
    
