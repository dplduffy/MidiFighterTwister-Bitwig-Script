
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
     if (MIXERMODE == MixerMode.VOLUME_PAN)
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
}

mixerPage.onEncoderRelease = function(isActive)
{
}

mixerPage.onEncoderTurn = function(isActive)
{
    if (MIXERMODE == MixerMode.Mix4)
    {
    }
    
    if (MIXERMODE == MixerMode.VOLUME_PAN)
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
    
}

mixerPage.onRightBottom = function(isPressed)
{
    trackBank.scrollChannelsDown();
}

mixerPage.onRightMiddle = function(isPressed)
{
    var index = channelStepSizeArray.indexOf(channelStepSize);
    index == (channelStepSizeArray.length - 1) ? index = 0 : index = index + 1;
    channelStepSize = channelStepSizeArray[index];
    host.showPopupNotification("Channel Step Size = "+channelStepSize);
    trackBank.setChannelScrollStepSize(channelStepSize);
}

mixerPage.onRightTop = function(isPressed)
{
    trackBank.scrollChannelsUp();
}


mixerPage.updateRGBLEDs = function() //TODO: feedback for mute, solo, & selected
{
    if (MIXERMODE == MixerMode.VOLUME_PAN) 
    {
        for(var i=0; i<16; i++)
        {
            if(i<4)
            {
            setRGBLED(i, color[i]);
            }
            if(i>=4 && i <8)
            {
            setRGBLED(i, color[i-4]);
            }
            if(i>=8 && i<12)
            {
            setRGBLED(i, color[i-4]);
            }
            if(i>=12)
            {
            setRGBLED(i, color[i-8]);
            }
        }
    }
}

mixerPage.update11segLEDs = function()
{
    //TODO: only set PAN leds if track exists
    if (MIXERMODE == MixerMode.VOLUME_PAN)
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
    
    if (MIXERMODE == MixerMode.PAN)
    {
    }
}

mixerPage.updateIndicators = function()
{
    if (MIXERMODE == MixerMode.Mix4)
    {
    }
    
    if (MIXERMODE == MixerMode.VOLUME_PAN)
    {
        for(var i=0; i<8; i++)
        {
            trackBank.getChannel(i).getVolume().setIndication(MIXERMODE == MixerMode.VOLUME_PAN);
            trackBank.getChannel(i).getPan().setIndication(MIXERMODE == MixerMode.VOLUME_PAN);
        }
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
