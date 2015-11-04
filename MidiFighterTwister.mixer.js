
mixerPage = new page();

mixerPage.title = "Mixer";

mixerPage.updateOutputState = function()
{
    clear();
    this.updateRGBLEDs();
    this.update11segLEDs();
    this.updateIndicators();
}

mixerPage.updateRGBLEDs = function()
{
}

mixerPage.update11segLEDs = function()
{
    if (MIXERMODE == MixerMode.VOLUME)
    {
        for(var i=0; i<16; i++)
        {
            set11segLED(i, volume[i]);
        }
    }
    
    if (MIXERMODE == MixerMode.PAN)
    {
    }
}

mixerPage.updateIndicators = function()
{
    if (MIXERMODE == MixerMode.VOLUME || MIXERMODE == MixerMode.PAN)
    {
        for(var i=0; i<4; i++)
        {
        var track = trackBank4.getTrack(i);
        track.getVolume().setIndication(MIXERMODE == MixerMode.VOLUME);
        track.getPan().setIndication(MIXERMODE == MixerMode.PAN);
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
