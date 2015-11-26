
mixerPage = new page();

mixerPage.title = "Mixer";

mixerPage.canScrollMainChannelsUp = false;
mixerPage.canScrollMainChannelsDown = false;
mixerPage.canScrollEffectChannelsUp = false;
mixerPage.canScrollEffectChannelsDown = false;

mixerPage.updateOutputState = function()
{
    clear();
    this.updateRGBLEDs();
    this.update11segLEDs();
    this.updateIndicators();
}

mixerPage.onEncoderPress = function(isActive)
{
}

mixerPage.onEncoderRelease = function(isActive)
{ 
    if (MIXERMODE == mixerMode.MAIN)
    {
        if(encoderNum<(4+encoderBankOffset.BANK3))
        {
        mainTrackBank.getChannel(encoderNum-encoderBankOffset.BANK3).selectInMixer();
        }
        if(encoderNum>=(4+encoderBankOffset.BANK3) && encoderNum<(8+encoderBankOffset.BANK3))
        {
        mainTrackBank.getChannel((encoderNum-4)-encoderBankOffset.BANK3).getArm().toggle();
        }
        if(encoderNum>=(8+encoderBankOffset.BANK3) && encoderNum<(12+encoderBankOffset.BANK3))
        {
        mainTrackBank.getChannel((encoderNum-8)-encoderBankOffset.BANK3).getSolo().toggle();
        }
        if(encoderNum>=(12+encoderBankOffset.BANK3))
        {
        mainTrackBank.getChannel((encoderNum-12)-encoderBankOffset.BANK3).getMute().toggle();
        }
    }
    if (MIXERMODE == mixerMode.EFFECT)
    {
        if(encoderNum<(4+encoderBankOffset.BANK3))
        {
        effectTrackBank.getChannel(encoderNum-encoderBankOffset.BANK3).selectInMixer();
        }
        if(encoderNum>=(4+encoderBankOffset.BANK3) && encoderNum<(8+encoderBankOffset.BANK3))
        {
        effectTrackBank.getChannel((encoderNum-4)-encoderBankOffset.BANK3).getArm().toggle();
        }
        if(encoderNum>=(8+encoderBankOffset.BANK3) && encoderNum<(12+encoderBankOffset.BANK3))
        {
        effectTrackBank.getChannel((encoderNum-8)-encoderBankOffset.BANK3).getSolo().toggle();
        }
        if(encoderNum>=(12+encoderBankOffset.BANK3))
        {
        effectTrackBank.getChannel((encoderNum-12)-encoderBankOffset.BANK3).getMute().toggle();
        }
    }
    if (MIXERMODE == mixerMode.MASTER)
    {
        if(encoderNum<(4+encoderBankOffset.BANK3))
        {
        masterTrack.selectInMixer();
        }
        if(encoderNum>=(4+encoderBankOffset.BANK3) && encoderNum<(8+encoderBankOffset.BANK3))
        {
        masterTrack.getArm().toggle();
        }
        if(encoderNum>=(8+encoderBankOffset.BANK3) && encoderNum<(12+encoderBankOffset.BANK3))
        {
        masterTrack.getSolo().toggle();
        }
        if(encoderNum>=(12+encoderBankOffset.BANK3))
        {
        masterTrack.getMute().toggle();
        }
    }
}

mixerPage.onEncoderTurn = function(isActive)
{   
    if (MIXERMODE == mixerMode.MAIN)
    {
        if(encoderNum<(4+encoderBankOffset.BANK3))
        {
        mainTrackBank.getChannel(encoderNum-encoderBankOffset.BANK3).getVolume().set(encoderValue,127);
        }
        if(encoderNum>=(4+encoderBankOffset.BANK3) && encoderNum<(8+encoderBankOffset.BANK3))
        {
        mainTrackBank.getChannel((encoderNum-4)-encoderBankOffset.BANK3).getPan().set(encoderValue,127);
        }
        if(encoderNum>=(8+encoderBankOffset.BANK3) && encoderNum<(12+encoderBankOffset.BANK3))
        {
        mainTrackBank.getChannel((encoderNum-8)-encoderBankOffset.BANK3).getSend(currentSend).set(encoderValue,127);
        }
        if(encoderNum>=(12+encoderBankOffset.BANK3))
        {
        setSendNumber(encoderValue);
        }
    }
    if (MIXERMODE == mixerMode.EFFECT)
    {
        if(encoderNum<(4+encoderBankOffset.BANK3))
        {
        effectTrackBank.getChannel(encoderNum-encoderBankOffset.BANK3).getVolume().set(encoderValue,127);
        }
        if(encoderNum>=(4+encoderBankOffset.BANK3) && encoderNum<(8+encoderBankOffset.BANK3))
        {
        effectTrackBank.getChannel((encoderNum-4)-encoderBankOffset.BANK3).getPan().set(encoderValue,127);
        }
    }
    if (MIXERMODE == mixerMode.MASTER)
    {
        if(encoderNum<(4+encoderBankOffset.BANK3))
        {
        masterTrack.getVolume().set(encoderValue,127);
        }
        if(encoderNum>=(4+encoderBankOffset.BANK3) && encoderNum<(8+encoderBankOffset.BANK3))
        {
        masterTrack.getPan().set(encoderValue,127);
        }
    }
}

mixerPage.onRightTopPressed = function(isActive)
{
}

mixerPage.onRightTopReleased = function(isActive)
{
    if(MIXERMODE == mixerMode.MAIN)
    {
    mainTrackBank.scrollChannelsUp();
    }
    if(MIXERMODE == mixerMode.EFFECT)
    {
    effectTrackBank.scrollChannelsUp();
    }     
}

mixerPage.onRightMiddlePressed = function(isActive)
{
}

mixerPage.onRightMiddleReleased = function(isActive)
{
    var index = channelStepSizeArray.indexOf(channelStepSize);
    index == (channelStepSizeArray.length - 1) ? index = 0 : index++;
    channelStepSize = channelStepSizeArray[index];
    host.showPopupNotification("Channel Step Size: "+channelStepSize);
    mainTrackBank.setChannelScrollStepSize(channelStepSize);
    effectTrackBank.setChannelScrollStepSize(channelStepSize);
}

mixerPage.onRightBottomPressed = function(isActive)
{
}

mixerPage.onRightBottomReleased = function(isActive)
{
    if(MIXERMODE == mixerMode.MAIN)
    {
    mainTrackBank.scrollChannelsDown();
    }
    if(MIXERMODE == mixerMode.EFFECT)
    {
    effectTrackBank.scrollChannelsDown();
    }      
}

mixerPage.onLeftTopPressed = function(isActive)
{
}

mixerPage.onLeftTopReleased = function(isActive)
{
    MIXERMODE < 2 ? MIXERMODE++ : MIXERMODE = 0;
    this.clearIndication();
    host.showPopupNotification("Mixer Mode: "+mixerModeArray[MIXERMODE]);
}

mixerPage.onLeftMiddlePressed = function(isActive)
{
}

mixerPage.onLeftMiddleReleased = function(isActive)
{
    ENCODERBANK = 3;
    changeEncoderBank(ENCODERBANK);
	
    if (CURRENTSEQMODE == currentSeqMode.DRUM)
	{
		setActivePage(drumSequencerPage);
	}
	
    if (CURRENTSEQMODE == currentSeqMode.MELODIC)
	{
		setActivePage(melodicSequencerPage);
	}
}

mixerPage.onLeftBottomPressed = function(isActive)
{
}

mixerPage.onLeftBottomReleased = function(isActive)
{
    ENCODERBANK = 3;
    changeEncoderBank(ENCODERBANK);
    device2.nextParameterPage();
    setActivePage(devicePage);
}

mixerPage.updateRGBLEDs = function()
{
    if (MIXERMODE == mixerMode.MAIN) 
    {
        for(var i=0; i<16; i++)
        {
            if(i<4)
            {
            mainIsSelected[i] ?
                setRGBLED(i+encoderBankOffset.BANK3, COLOR.GREEN, STROBE.PULSE1) :
                    setRGBLED(i+encoderBankOffset.BANK3, mainColor[i], STROBE.OFF);
            }
            if(i>=4 && i <8)
            {
            mainArm[i-4] ?
                setRGBLED(i+encoderBankOffset.BANK3, COLOR.RED, STROBE.PULSE1) :
                    setRGBLED(i+encoderBankOffset.BANK3, mainColor[i-4], STROBE.OFF);
            }
            if(i>=8 && i<12)
            {
            mainSolo[i-8] ?
                setRGBLED(i+encoderBankOffset.BANK3, COLOR.DARK_BLUE, STROBE.PULSE1) :
                    setRGBLED(i+encoderBankOffset.BANK3, mainColor[i-8], STROBE.OFF);
            }
            if(i>=12)
            {
            mainMute[i-12] ?
                setRGBLED(i+encoderBankOffset.BANK3, COLOR.BROWN, STROBE.PULSE1) :
                    setRGBLED(i+encoderBankOffset.BANK3, mainColor[i-12], STROBE.OFF);
            }
        }
    }
    if (MIXERMODE == mixerMode.EFFECT) 
    {
        for(var i=0; i<16; i++)
        {
            if(i<4)
            {
            effectIsSelected[i] ?
                setRGBLED(i+encoderBankOffset.BANK3, COLOR.GREEN, STROBE.PULSE1) :
                    setRGBLED(i+encoderBankOffset.BANK3, effectColor[i], STROBE.OFF);
            }
            if(i>=4 && i <8)
            {
            effectArm[i-4] ?
                setRGBLED(i+encoderBankOffset.BANK3, COLOR.RED, STROBE.PULSE1) :
                    setRGBLED(i+encoderBankOffset.BANK3, effectColor[i-4], STROBE.OFF);
            }
            if(i>=8 && i<12)
            {
            effectSolo[i-8] ?
                setRGBLED(i+encoderBankOffset.BANK3, COLOR.DARK_BLUE, STROBE.PULSE1) :
                    setRGBLED(i+encoderBankOffset.BANK3, effectColor[i-8], STROBE.OFF);
            }
            if(i>=12)
            {
            effectMute[i-12] ?
                setRGBLED(i+encoderBankOffset.BANK3, COLOR.BROWN, STROBE.PULSE1) :
                    setRGBLED(i+encoderBankOffset.BANK3, effectColor[i-12], STROBE.OFF);
            }
        }
    }
    if (MIXERMODE == mixerMode.MASTER) 
    {
        for(var i=0; i<16; i++)
        {
            if(i==0)
            {
            masterIsSelected[i] ?
                setRGBLED(i+encoderBankOffset.BANK3, COLOR.GREEN, STROBE.PULSE1) :
                    setRGBLED(i+encoderBankOffset.BANK3, masterColor[0], STROBE.OFF);
            }
            if(i==4)
            {
            masterArm[i-4] ?
                setRGBLED(i+encoderBankOffset.BANK3, COLOR.RED, STROBE.PULSE1) :
                    setRGBLED(i+encoderBankOffset.BANK3, masterColor[0], STROBE.OFF);
            }
            if(i==8)
            {
            masterSolo[i-8] ?
                setRGBLED(i+encoderBankOffset.BANK3, COLOR.DARK_BLUE, STROBE.PULSE1) :
                    setRGBLED(i+encoderBankOffset.BANK3, effectColor[0], STROBE.OFF);
            }
            if(i==12)
            {
            masterMute[i-12] ?
                setRGBLED(i+encoderBankOffset.BANK3, COLOR.BROWN, STROBE.PULSE1) :
                    setRGBLED(i+encoderBankOffset.BANK3, masterColor[0], STROBE.OFF);
            }
            else
            {
            setRGBLED(i+encoderBankOffset.BANK3, COLOR.BLACK, STROBE.OFF);
            }
        }
    }
}

mixerPage.update11segLEDs = function()
{
    if (MIXERMODE == mixerMode.MAIN)
    {
        for(var i=0; i<16; i++)
        {
            if(i<4)
            {
            set11segLED(i+encoderBankOffset.BANK3, mainVolume[i]);
            }
            if(i>=4 && i <8)
            {
            set11segLED(i+encoderBankOffset.BANK3, mainPan[i-4]);
            }
            if(i>=8 && i<12)
            {
            set11segLED(i+encoderBankOffset.BANK3, sendArray[i-8][currentSend]);
            }
            if(i>=12)
            {
            set11segLED(i+encoderBankOffset.BANK3, currentSend11Seg);
            }
        }
    }
    if (MIXERMODE == mixerMode.EFFECT)
    {
        for(var i=0; i<16; i++)
        {
            if(i<4)
            {
            set11segLED(i+encoderBankOffset.BANK3, effectVolume[i]);
            }
            if(i>=4 && i <8)
            {
            set11segLED(i+encoderBankOffset.BANK3, effectPan[i-4]);
            }
            if(i>=8 && i<12)
            {
            set11segLED(i+encoderBankOffset.BANK3, 0);
            }
            if(i>=12)
            {
            set11segLED(i+encoderBankOffset.BANK3, 0);
            }
        }
    }
    if (MIXERMODE == mixerMode.MASTER)
    {
        for(var i=0; i<16; i++)
        {
            if(i==0)
            {
            set11segLED(i+encoderBankOffset.BANK3, masterVolume[0]);
            }
            else if(i==4)
            {
            set11segLED(i+encoderBankOffset.BANK3, masterPan[0]);
            }
            else
            {
            set11segLED(i+encoderBankOffset.BANK3, 0);
            }
        }
    }
}

mixerPage.updateIndicators = function()
{   
    if (MIXERMODE == mixerMode.MAIN)
    {
        for(var i=0; i<4; i++)
        {
            mainTrackBank.getChannel(i).getVolume().setIndication(true);
            mainTrackBank.getChannel(i).getPan().setIndication(true);
            for (var s=0; s<11; s++)
            {
            mainTrackBank.getChannel(i).getSend(s).setIndication(currentSend == s);
            }
        }
    }
    if (MIXERMODE == mixerMode.EFFECT)
    {
        for(var i=0; i<4; i++)
        {
            effectTrackBank.getChannel(i).getVolume().setIndication(true);
            effectTrackBank.getChannel(i).getPan().setIndication(true);
        }
    }
    if (MIXERMODE == mixerMode.MASTER)
    {
        masterTrack.getVolume().setIndication(true);
        masterTrack.getPan().setIndication(true);
    }
}

mixerPage.clearIndication = function()
{
    for(var i=0; i<4; i++)
    {
        mainTrackBank.getChannel(i).getVolume().setIndication(false);
        mainTrackBank.getChannel(i).getPan().setIndication(false);
        for (var s=0; s<11; s++)
        {
        mainTrackBank.getChannel(i).getSend(s).setIndication(false);
        }
        effectTrackBank.getChannel(i).getVolume().setIndication(false);
        effectTrackBank.getChannel(i).getPan().setIndication(false);
    }
    masterTrack.getVolume().setIndication(false);
    masterTrack.getPan().setIndication(false);
}

function setSendNumber(value)
{
    switch(true)
    {
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
