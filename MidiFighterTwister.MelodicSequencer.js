
melodicSequencerPage = new page();

melodicSequencerPage.title = "Melodic Sequencer";

melodicSequencerPage.updateOutputState = function()
{
    clear();
    this.updateRGBLEDs();
    this.update11segLEDs();
    this.updateIndicators();
}

melodicSequencerPage.onEncoderPress = function(isActive)
{
    if (MELODICSEQMODE == melodicSeqMode.NOTE)
    {
        var tempStepPress = encoderNum-encoderBankOffset.BANK4;
        if (isAnyStepTrue (tempStepPress, stepData))
        {
        cursorClip.clearStep(tempStepPress, getFirstKey(tempStepPress, stepData))
        }
        else
        {
        cursorClip.setStep(tempStepPress, ROOT_NOTE, VELOCITY, STEP_SIZE);
        host.showPopupNotification(rootNoteNames[ROOT_NOTE]+octaveNoteNumbers[CURRENT_OCT]);
        }
    }
}

melodicSequencerPage.onEncoderRelease = function(isActive)
{
}

melodicSequencerPage.onEncoderTurn = function(isActive)
{
    if (MELODICSEQMODE == melodicSeqMode.NOTE)
    {
        if (MELODICSEQNOTEPAGE == melodicSeqModeNotePage.PITCH)
        {
            var tempStepTurn = encoderNum-encoderBankOffset.BANK4;
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
}

melodicSequencerPage.onRightTop = function(isPressed)
{
    
}

melodicSequencerPage.onRightMiddle = function(isPressed)
{
}

melodicSequencerPage.onRightBottom = function(isPressed)
{
    var curStepSizeIndex = stepSizeArray.indexOf(STEP_SIZE);
    println(curStepSizeIndex)
    println(stepSizeArray.length);
    curStepSizeIndex == (stepSizeArray.length-1) ? STEP_SIZE = stepSizeArray[0] : STEP_SIZE = stepSizeArray[curStepSizeIndex+1];
    println(STEP_SIZE);
    println(stepSizeArray.indexOf(STEP_SIZE));
    cursorClip.setStepSize(STEP_SIZE);
    host.showPopupNotification('Step Size = ' + stepSizeNameArray[stepSizeArray.indexOf(STEP_SIZE)]);
}

melodicSequencerPage.onLeftTop = function(isPressed)
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

melodicSequencerPage.onLeftMiddle = function(isPressed)
{
    CURRENTSEQMODE = 0;
    setActivePage(drumSequencerPage);
}

melodicSequencerPage.onLeftBottom = function(isPressed)
{
}

melodicSequencerPage.updateRGBLEDs = function()
{
    for(var i=0; i<16; i++)
        {
            if(i<4)
            {
            playingStep == i ?
                setRGBLED(i+encoderBankOffset.BANK4, COLOR.GREEN, STROBE.OFF) :
                    isAnyStepTrue(i, stepData) ? setRGBLED(i+encoderBankOffset.BANK4, COLOR.AQUA, STROBE.OFF) :
                        setRGBLED(i+encoderBankOffset.BANK4, COLOR.BLACK, STROBE.OFF);
            }
            if(i>=4 && i <8)
            {
            playingStep == i ?
                setRGBLED(i+encoderBankOffset.BANK4, COLOR.GREEN, STROBE.OFF) :
                    isAnyStepTrue(i, stepData) ? setRGBLED(i+encoderBankOffset.BANK4, COLOR.AQUA, STROBE.OFF) :
                        setRGBLED(i+encoderBankOffset.BANK4, COLOR.BLACK, STROBE.OFF);
            }
            if(i>=8 && i<12)
            {
            playingStep == i ?
                setRGBLED(i+encoderBankOffset.BANK4, COLOR.GREEN, STROBE.OFF) :
                    isAnyStepTrue(i, stepData) ? setRGBLED(i+encoderBankOffset.BANK4, COLOR.AQUA, STROBE.OFF) :
                        setRGBLED(i+encoderBankOffset.BANK4, COLOR.BLACK, STROBE.OFF);
            }
            if(i>=12)
            {
            playingStep == i ?
                setRGBLED(i+encoderBankOffset.BANK4, COLOR.GREEN, STROBE.OFF) :
                    isAnyStepTrue(i, stepData) ? setRGBLED(i+encoderBankOffset.BANK4, COLOR.AQUA, STROBE.OFF) :
                        setRGBLED(i+encoderBankOffset.BANK4, COLOR.BLACK, STROBE.OFF);
            }
        }
}

melodicSequencerPage.update11segLEDs = function()
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

melodicSequencerPage.updateIndicators = function()
{
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