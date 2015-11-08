
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

var tempvar = 0;

mixerPage.onEncoderPress = function(isActive)
{
     if (MIXERMODE == mixerMode.VOLUME_PAN)
    {
        if(encoderNum<4)
        {
        trackBank.getChannel(encoderNum).selectInMixer();
        }
        if(encoderNum>=4 && encoderNum<8)
        {
        trackBank.getChannel(encoderNum-4).getMute().toggle();
        }
        if(encoderNum>=8 && encoderNum<12)
        {
        trackBank.getChannel(encoderNum-4).selectInMixer();
        }
        if(encoderNum>=12)
        {
        trackBank.getChannel(encoderNum-8).getMute().toggle();
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
        trackBank.getChannel((encoderNum-4)-16).getArm().toggle();
        }
        if(encoderNum>=(8+16) && encoderNum<(12+16))
        {
        trackBank.getChannel((encoderNum-4)-16).getSolo().toggle();
        }
        if(encoderNum>=(12+16))
        {
        trackBank.getChannel((encoderNum-8)-16).getArm().toggle();
        }
    }
}

mixerPage.onEncoderRelease = function(isActive)
{
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
        this.update11segLEDs();
        }
        if(encoderNum>=(8+16) && encoderNum<(12+16))
        {
        trackBank.getChannel((encoderNum-4)-16).getSend(currentSend).set(encoderValue,127);
        }
        if(encoderNum>=(12+16))
        {
        setSendNumber(encoderValue);
        this.update11segLEDs();
        }
    }
}

mixerPage.onLeftBottom = function(isPressed)
{
}

mixerPage.onLeftMiddle = function(isPressed)
{
}

mixerPage.onLeftTop = function(isPressed)
{
    MIXERMODE < 2 ? MIXERMODE++ : MIXERMODE = 0;
    host.showPopupNotification("Mixer Mode: "+mixerModeArray[MIXERMODE]);
    
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
    sendMidi(147, ENCODERBANK, 127);
}

mixerPage.onRightBottom = function(isPressed)
{
    trackBank.scrollChannelsDown();
}

mixerPage.onRightMiddle = function(isPressed)
{
    var index = channelStepSizeArray.indexOf(channelStepSize);
    index == (channelStepSizeArray.length - 1) ? index = 0 : index++;
    channelStepSize = channelStepSizeArray[index];
    host.showPopupNotification("Channel Step Size: "+channelStepSize);
    trackBank.setChannelScrollStepSize(channelStepSize);
}

mixerPage.onRightTop = function(isPressed)
{
    trackBank.scrollChannelsUp();
}


mixerPage.updateRGBLEDs = function() //TODO: feedback for mute, solo, & selected
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
            mute[i-4] ? setRGBLED(i, COLOR.BROWN, STROBE.PULSE1) : setRGBLED(i, color[i-4], STROBE.OFF);
            }
            if(i>=8 && i<12)
            {
            isSelected[i-4] ? setRGBLED(i, COLOR.GREEN, STROBE.PULSE1) : setRGBLED(i, color[i-4], STROBE.OFF);
            }
            if(i>=12)
            {
            mute[i-8] ? setRGBLED(i, COLOR.BROWN, STROBE.PULSE1) : setRGBLED(i, color[i-8], STROBE.OFF);
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
            arm[i-4] ? setRGBLED(i+16, COLOR.RED, STROBE.PULSE1) : setRGBLED(i+16, color[i-4], STROBE.OFF);
            }
            if(i>=8 && i<12)
            {
            solo[i-4] ? setRGBLED(i+16, COLOR.DARK_BLUE, STROBE.PULSE1) : setRGBLED(i+16, color[i-4], STROBE.OFF);
            }
            if(i>=12)
            {
            arm[i-8] ? setRGBLED(i+16, COLOR.RED, STROBE.PULSE1) : setRGBLED(i+16, color[i-8], STROBE.OFF);
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
            set11segLED(i+16, (sendArray[i][currentSend]));
            }
            //if(i>=4 && i <8)
            //{
            //set11segLED(i+16, (currentSend*11));
            //}
            //if(i>=8 && i<12)
            //{
            //set11segLED(i+16, sendArray[i-4][currentSend]);
            //}
            //if(i>=12)
            //{
            //set11segLED(i+16, 0);
            //}
        }
    }
}

mixerPage.updateIndicators = function()
{   
        for(var i=0; i<8; i++)
        {
            trackBank.getChannel(i).getVolume().setIndication(MIXERMODE == mixerMode.VOLUME_PAN);
            trackBank.getChannel(i).getPan().setIndication(MIXERMODE == mixerMode.VOLUME_PAN);
            for (var s=0; i<11; s++)
            {
                if (sendArray[i][s] != undefined)
                {
                trackBank.getChannel(i).getSend(s).setIndication(MIXERMODE == mixerMode.SEND && currentSend == s);
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
            break;
        case (value > 11 && value < 24):
            currentSend = 1;
            break;
        case (value > 23 && value < 35):
            currentSend = 2;
            break;
        case (value > 34 && value <47):
            currentSend = 3;
            break;
        case (value > 46 && value < 59):
            currentSend = 4;
            break;
        case (value > 58 && value < 70):
            currentSend = 5;
            break;
        case (value > 69 && value < 82):
            currentSend = 6;
            break;
        case (value > 81 && value < 94):
            currentSend = 7;
            break;
        case (value > 93 && value < 105):
            currentSend = 8;
            break;
        case (value > 105 && value < 117):
            currentSend = 9;
            break;
        case (value > 117 ):
            currentSend = 10;
            break;
    }
}

//mixerPage.setMixerMode = function(mode)
//{
//    if (mode == MIXERMODE) return;
//   
//    MIXERMODE = mode;
//
//    if (mode == MixerMode.VOLUME || mode == MixerMode.PAN)
//    {
//        for(var i=0; i<16; i++)
//        {
//        var track = trackBank.getTrack(p);
//        track.getVolume().setIndication(mode == MixerMode.VOLUME);
//        track.getPan().setIndication(mode == MixerMode.PAN);
//        }
//    }
//    
//};
