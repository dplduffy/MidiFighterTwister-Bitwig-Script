
mixerPage = new page();

mixerPage.title = "Mixer";

mixerPage.canScrollTracksUp = false;
mixerPage.canScrollTracksDown = false;

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
    if (MIXERMODE == mixerMode.VOLUME_PAN)
    {
        if(encoderNum<4)
        {
        trackBank.getChannel(encoderNum).selectInMixer();
        }
        if(encoderNum>=4 && encoderNum<8)
        {
        trackBank.getChannel(encoderNum-4).getArm().toggle();
        }
        if(encoderNum>=8 && encoderNum<12)
        {
        trackBank.getChannel(encoderNum-4).selectInMixer();
        }
        if(encoderNum>=12)
        {
        trackBank.getChannel(encoderNum-8).getArm().toggle();
        }
    }
    
    if (MIXERMODE == mixerMode.SEND)
    {
        if(encoderNum<(4+16))
        {
        trackBank.getChannel(encoderNum-16).getSolo().toggle();
        }
        if(encoderNum>=(4+16) && encoderNum<(8+16))
        {
        trackBank.getChannel((encoderNum-4)-16).getMute().toggle();
        }
        if(encoderNum>=(8+16) && encoderNum<(12+16))
        {
        trackBank.getChannel((encoderNum-4)-16).getSolo().toggle();
        }
        if(encoderNum>=(12+16))
        {
        trackBank.getChannel((encoderNum-8)-16).getMute().toggle();
        }
    }
    
    if (MIXERMODE == mixerMode.Mix4)
    {
        if(encoderNum<(4+32))
        {
        trackBank.getChannel(encoderNum-32).selectInMixer();
        }
        if(encoderNum>=(4+32) && encoderNum<(8+32))
        {
        trackBank.getChannel((encoderNum-4)-32).getArm().toggle();
        }
        if(encoderNum>=(8+32) && encoderNum<(12+32))
        {
        trackBank.getChannel((encoderNum-8)-32).getSolo().toggle();
        }
        if(encoderNum>=(12+32))
        {
        trackBank.getChannel((encoderNum-12)-32).getMute().toggle();
        }
    }
}

mixerPage.onEncoderTurn = function(isActive)
{   
    if (MIXERMODE == mixerMode.VOLUME_PAN)
    {
        if(encoderNum<4)
        {
        trackBank.getChannel(encoderNum).getVolume().set(encoderValue,127);
        }
        if(encoderNum>=4 && encoderNum<8)
        {
        trackBank.getChannel(encoderNum-4).getPan().set(encoderValue,127);
        }
        if(encoderNum>=8 && encoderNum<12)
        {
        trackBank.getChannel(encoderNum-4).getVolume().set(encoderValue,127);
        }
        if(encoderNum>=12)
        {
        trackBank.getChannel(encoderNum-8).getPan().set(encoderValue,127);
        }
    }
    
    if (MIXERMODE == mixerMode.SEND)
    {
        if(encoderNum<(4+16))
        {
        trackBank.getChannel(encoderNum-16).getSend(currentSend).set(encoderValue,127);
        }
        if(encoderNum>=(4+16) && encoderNum<(8+16))
        {
        setSendNumber(encoderValue);
        }
        if(encoderNum>=(8+16) && encoderNum<(12+16))
        {
        trackBank.getChannel((encoderNum-4)-16).getSend(currentSend).set(encoderValue,127);
        }
        if(encoderNum>=(12+16))
        {
        setSendNumber(encoderValue);
        }
    }
    
    if (MIXERMODE == mixerMode.Mix4)
    {
        if(encoderNum<(4+32))
        {
        trackBank.getChannel(encoderNum-32).getVolume().set(encoderValue,127);
        }
        if(encoderNum>=(4+32) && encoderNum<(8+32))
        {
        trackBank.getChannel((encoderNum-4)-32).getPan().set(encoderValue,127);
        }
        if(encoderNum>=(8+32) && encoderNum<(12+32))
        {
        trackBank.getChannel((encoderNum-8)-32).getSend(currentSend).set(encoderValue,127);
        }
        if(encoderNum>=(12+32))
        {
        setSendNumber(encoderValue);
        }
    }
}

mixerPage.onRightTopPressed = function(isActive)
{
}

mixerPage.onRightTopReleased = function(isActive)
{
    trackBank.scrollChannelsUp();
}

mixerPage.onRightMiddlePressed = function(isActive)
{
}

mixerPage.onRightMiddleReleased = function(isActive)
{
    var index = channelStepSizeArray.indexOf(channelStepSize);
    MIXERMODE == mixerMode.Mix4 ? index == (channelStepSizeArray.length - 2) ? index = 0 : index++ : index == (channelStepSizeArray.length - 1) ? index = 0 : index++;
    channelStepSize = channelStepSizeArray[index];
    host.showPopupNotification("Channel Step Size: "+channelStepSize);
    trackBank.setChannelScrollStepSize(channelStepSize);
}

mixerPage.onRightBottomPressed = function(isActive)
{
}

mixerPage.onRightBottomReleased = function(isActive)
{
    trackBank.scrollChannelsDown();
}

mixerPage.onLeftTopPressed = function(isActive)
{
}

mixerPage.onLeftTopReleased = function(isActive)
{
    MIXERMODE < 2 ? MIXERMODE++ : MIXERMODE = 0;
    host.showPopupNotification("Mixer Mode: "+mixerModeArray[MIXERMODE]);
    
    if (MIXERMODE == mixerMode.Mix4 && channelStepSize == 8)
    {
    channelStepSize = 4;
    trackBank.setChannelScrollStepSize(channelStepSize);
    }
    
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
    if (MIXERMODE == mixerMode.VOLUME_PAN) 
    {
        for(var i=0; i<16; i++)
        {
            if(i<4)
            {
            isSelected[i] ? setRGBLED(i, COLOR.GREEN, STROBE.PULSE1) : setRGBLED(i, color[i], STROBE.OFF);
            }
            if(i>=4 && i <8)
            {
            arm[i-4] ? setRGBLED(i, COLOR.RED, STROBE.PULSE1) : setRGBLED(i, color[i-4], STROBE.OFF);
            }
            if(i>=8 && i<12)
            {
            isSelected[i-4] ? setRGBLED(i, COLOR.GREEN, STROBE.PULSE1) : setRGBLED(i, color[i-4], STROBE.OFF);
            }
            if(i>=12)
            {
            arm[i-8] ? setRGBLED(i, COLOR.RED, STROBE.PULSE1) : setRGBLED(i, color[i-8], STROBE.OFF);
            }
        }
    }
    
    if (MIXERMODE == mixerMode.SEND) 
    {
        for(var i=0; i<16; i++)
        {
            if(i<4)
            {
            solo[i] ? setRGBLED(i+16, COLOR.DARK_BLUE, STROBE.PULSE1) : setRGBLED(i+16, color[i], STROBE.OFF);
            }
            if(i>=4 && i <8)
            {
            mute[i-4] ? setRGBLED(i+16, COLOR.BROWN, STROBE.PULSE1) : setRGBLED(i+16, color[i-4], STROBE.OFF);
            }
            if(i>=8 && i<12)
            {
            solo[i-4] ? setRGBLED(i+16, COLOR.DARK_BLUE, STROBE.PULSE1) : setRGBLED(i+16, color[i-4], STROBE.OFF);
            }
            if(i>=12)
            {
            mute[i-8] ? setRGBLED(i+16, COLOR.BROWN, STROBE.PULSE1) : setRGBLED(i+16, color[i-8], STROBE.OFF);
            }
        }
    }

    if (MIXERMODE == mixerMode.Mix4) 
    {
        for(var i=0; i<16; i++)
        {
            if(i<4)
            {
            isSelected[i] ? setRGBLED(i+32, COLOR.GREEN, STROBE.PULSE1) : setRGBLED(i+32, color[i], STROBE.OFF);
            }
            if(i>=4 && i <8)
            {
            arm[i-4] ? setRGBLED(i+32, COLOR.RED, STROBE.PULSE1) : setRGBLED(i+32, color[i-4], STROBE.OFF);
            }
            if(i>=8 && i<12)
            {
            solo[i-8] ? setRGBLED(i+32, COLOR.DARK_BLUE, STROBE.PULSE1) : setRGBLED(i+32, color[i-8], STROBE.OFF);
            }
            if(i>=12)
            {
            mute[i-12] ? setRGBLED(i+32, COLOR.BROWN, STROBE.PULSE1) : setRGBLED(i+32, color[i-12], STROBE.OFF);
            }
        }
    }
}

mixerPage.update11segLEDs = function()
{
    //TODO: only set PAN leds if track exists
    if (MIXERMODE == mixerMode.VOLUME_PAN)
    {
        for(var i=0; i<16; i++)
        {
            if(i<4)
            {
            set11segLED(i, volume[i]);
            }
            if(i>=4 && i <8)
            {
            set11segLED(i, pan[i-4]);
            }
            if(i>=8 && i<12)
            {
            set11segLED(i, volume[i-4]);
            }
            if(i>=12)
            {
            set11segLED(i, pan[i-8]);
            }
        }
    }
    
    if (MIXERMODE == mixerMode.SEND)
    {
        for(var i=0; i<16; i++)
        { 
            if(i<4)
            {
            set11segLED(i+16, sendArray[i][currentSend]);
            }
            if(i>=4 && i <8)
            {
            set11segLED(i+16, currentSend11Seg);
            }
            if(i>=8 && i<12)
            {
            set11segLED(i+16, sendArray[i-4][currentSend]);
            }
            if(i>=12)
            {
            set11segLED(i+16, currentSend11Seg);
            }
        }
    }
    
    if (MIXERMODE == mixerMode.Mix4)
    {
        for(var i=0; i<16; i++)
        { 
            if(i<4)
            {
            set11segLED(i+32, volume[i]);
            }
            if(i>=4 && i <8)
            {
            set11segLED(i+32, pan[i-4]);
            }
            if(i>=8 && i<12)
            {
            set11segLED(i+32, sendArray[i-4][currentSend]);
            }
            if(i>=12)
            {
            set11segLED(i+32, currentSend11Seg);
            }
        }
    }
}

mixerPage.updateIndicators = function()
{
    if (MIXERMODE == mixerMode.VOLUME_PAN || MIXERMODE == mixerMode.SEND)
    {
        for(var i=0; i<8; i++)
        {
            trackBank.getChannel(i).getVolume().setIndication(MIXERMODE == mixerMode.VOLUME_PAN);
            trackBank.getChannel(i).getPan().setIndication(MIXERMODE == mixerMode.VOLUME_PAN);
            for (var s=0; s<11; s++)
            {
            trackBank.getChannel(i).getSend(s).setIndication(MIXERMODE == mixerMode.SEND && currentSend == s);
            }
        }
    }
    
    if (MIXERMODE == mixerMode.Mix4)
    {
        for(var i=0; i<4; i++)
        {
            trackBank.getChannel(i).getVolume().setIndication(true);
            trackBank.getChannel(i).getPan().setIndication(true);
            for (var s=0; s<11; s++)
            {
            trackBank.getChannel(i).getSend(s).setIndication(currentSend == s);
            }
        }
        for(var i=4; i<8; i++)
        {
            for (var s=0; s<11; s++)
            {
            trackBank.getChannel(i).getSend(s).setIndication(false);
            }
        }
    }
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
