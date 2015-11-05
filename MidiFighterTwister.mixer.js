
mixerPage = new page();

mixerPage.title = "Mixer";

mixerPage.updateOutputState = function()
{
    clear();
    this.updateRGBLEDs();
    this.update11segLEDs();
    this.updateIndicators();
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
        trackBank8.getChannel(encoderNum).getVolume().set(encoderValue,127);
        }
        if(encoderNum>=4 && encoderNum<8)
        {
        trackBank8.getChannel(encoderNum-4).getPan().set(encoderValue,127);
        }
        if(encoderNum>=8 && encoderNum<12)
        {
        trackBank8.getChannel(encoderNum-4).getVolume().set(encoderValue,127);
        }
        if(encoderNum>=12)
        {
        trackBank8.getChannel(encoderNum-8).getPan().set(encoderValue,127);
        }
        
    }
}

mixerPage.updateRGBLEDs = function()
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
            trackBank8.getChannel(i).getVolume().setIndication(MIXERMODE == MixerMode.VOLUME_PAN);
            trackBank8.getChannel(i).getPan().setIndication(MIXERMODE == MixerMode.VOLUME_PAN);
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
