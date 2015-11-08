
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
        if(encoderNum<4)
        {
        trackBank.getChannel(encoderNum).getSolo().toggle();
        }
        if(encoderNum>=4 && encoderNum<8)
        {
        trackBank.getChannel(encoderNum-4).getArm().toggle();
        }
        if(encoderNum>=8 && encoderNum<12)
        {
        trackBank.getChannel(encoderNum-4).getSolo().toggle();
        }
        if(encoderNum>=12)
        {
        trackBank.getChannel(encoderNum-8).getArm().toggle();
        }
    }
}

mixerPage.onEncoderRelease = function(isActive)
{
}

mixerPage.onEncoderTurn = function(isActive)
{
    if (MIXERMODE == mixerMode.Mix4)
    {
    }
    
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
}

mixerPage.onRightBottom = function(isPressed)
{
    trackBank.scrollChannelsDown();
}

mixerPage.onRightMiddle = function(isPressed)
{
    var index = channelStepSizeArray.indexOf(channelStepSize);
    index == (channelStepSizeArray.length - 1) ? index = 0 : index = index++;
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
            solo[i] ? setRGBLED(i, COLOR.DARK_BLUE, STROBE.PULSE1) : setRGBLED(i, color[i], STROBE.OFF);
            }
            if(i>=4 && i <8)
            {
            arm[i-4] ? setRGBLED(i, COLOR.RED, STROBE.PULSE1) : setRGBLED(i, color[i-4], STROBE.OFF);
            }
            if(i>=8 && i<12)
            {
            solo[i-4] ? setRGBLED(i, COLOR.DARK_BLUE, STROBE.PULSE1) : setRGBLED(i, color[i-4], STROBE.OFF);
            }
            if(i>=12)
            {
            arm[i-8] ? setRGBLED(i, COLOR.RED, STROBE.PULSE1) : setRGBLED(i, color[i-8], STROBE.OFF);
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
    
    if (MIXERMODE == mixerMode.PAN)
    {
    }
}

mixerPage.updateIndicators = function()
{   
    if (MIXERMODE == mixerMode.VOLUME_PAN)
    {
        for(var i=0; i<8; i++)
        {
            trackBank.getChannel(i).getVolume().setIndication(MIXERMODE == mixerMode.VOLUME_PAN);
            trackBank.getChannel(i).getPan().setIndication(MIXERMODE == mixerMode.VOLUME_PAN);
        }
    }
    
    if (MIXERMODE == mixerMode.SEND)
    {
    }
    
    if (MIXERMODE == mixerMode.Mix4)
    {
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
