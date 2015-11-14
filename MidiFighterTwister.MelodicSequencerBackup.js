
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
var currentScrollStepEnd = 31;

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
        var tempStepPress = ((encoderNum-encoderBankOffset.BANK4)+(currentSeqChunk*16));
        
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
    if (MELODICSEQMODE == melodicSeqMode.NOTE)
    {
        if (MELODICSEQNOTEPAGE == melodicSeqModeNotePage.PITCH)
        {
            var tempStepTurn = ((encoderNum-encoderBankOffset.BANK4)+(currentSeqChunk*16));
            
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
                    //host.showPopupNotification(rootNoteNames[(tempKey%12)]+octaveNoteNumbers[((CURRENT_OCT)+(Math.floor(tempKey/12)))]);
                }
            }
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
    MELODICSEQMODE = melodicSeqMode.PATTERN;
    host.showPopupNotification('Pattern Page');
}

melodicSequencerPage.onRightBottomPressed = function(isActive)
{
}

melodicSequencerPage.onRightBottomReleased = function(isActive)
{
    var curStepSizeIndex = stepSizeArray.indexOf(STEP_SIZE);
    curStepSizeIndex == (stepSizeArray.length-1) ? STEP_SIZE = stepSizeArray[0] : STEP_SIZE = stepSizeArray[curStepSizeIndex+1];
    cursorClip.setStepSize(STEP_SIZE);
    host.showPopupNotification('Step Size = ' + stepSizeNameArray[stepSizeArray.indexOf(STEP_SIZE)]);
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
                playingStep == (i + (currentSeqChunk*16)) ?
                    setRGBLED(i+encoderBankOffset.BANK4, COLOR.GREEN, STROBE.OFF) :
                        isAnyStepTrue((i+(currentSeqChunk*16)), stepData) ? setRGBLED(i+encoderBankOffset.BANK4, COLOR.AQUA, STROBE.OFF) :
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
}

melodicSequencerPage.update11segLEDs = function()
{
    if(MELODICSEQMODE == melodicSeqMode.NOTE)
    {
        for(var i=0; i<16; i++)
            {
                if(isAnyStepTrue((i+(currentSeqChunk*16)),stepData))
                {
                set11segLED(i+encoderBankOffset.BANK4, scaleKeyToEncoder(getFirstKey((i+(currentSeqChunk*16)), stepData)));
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
}

melodicSequencerPage.updateIndicators = function()
{
}

melodicSequencerPage.updateSequencer = function()
{
    currentBar = Math.floor((playingStep*STEP_SIZE)/4);
    barsOnPage = STEP_SIZE*4;
    //println('something '+32/STEP_SIZE)
    customScrollStep();
    println('currentScrollStepStart ' + currentScrollStepStart);
    println('currentScrollStepEnd ' + currentScrollStepEnd);
    println('playing step '+playingStep);
    println('Loop Length '+clipLoopLength);
}

function customScrollStep()
{
    if (playingStep > 0)
    {
        if (playingStep >= currentScrollStepStart && playingStep <= currentScrollStepEnd)
        {
            currentScrollStepOffset = currentScrollStepOffset
        }
        if(playingStep>currentScrollStepEnd)
        {
            cursorClip.scrollStepsPageForward();
            currentScrollStepOffset = currentScrollStepOffset + 1;
        }
        if(playingStep<currentScrollStepStart)
        {
            cursorClip.scrollStepsPageBackwards()
            currentScrollStepOffset = currentScrollStepOffset - 1;
        }
        currentScrollStepStart = (currentScrollStepOffset*SEQ_STEPS);
        currentScrollStepEnd = ((currentScrollStepOffset*SEQ_STEPS)+SEQ_STEPS);
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
    var a = (CURRENT_OCT*12);
    var b = (a+(OCTAVE_RANGE*12));
    var min = 0;
    var max = 127;
    return Math.floor(((((b-a)*(enc-min))/(max-min)) + a));
}
