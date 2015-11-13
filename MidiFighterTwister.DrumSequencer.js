
drumSequencerPage = new page();

drumSequencerPage.title = "Drum Sequencer";

drumSequencerPage.canScrollTracksUp = false;
drumSequencerPage.canScrollTracksDown = false;

drumSequencerPage.updateOutputState = function()
{
    clear();
    this.updateRGBLEDs();
    this.update11segLEDs();
    this.updateIndicators();
}

drumSequencerPage.onEncoderPress = function(isActive)
{
}

drumSequencerPage.onEncoderRelease = function(isActive)
{
}

drumSequencerPage.onEncoderTurn = function(isActive)
{   
}

drumSequencerPage.onRightTop = function(isPressed)
{
}

drumSequencerPage.onRightMiddle = function(isPressed)
{
}

drumSequencerPage.onRightBottom = function(isPressed)
{
}

drumSequencerPage.onLeftTop = function(isPressed)
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

drumSequencerPage.onLeftMiddle = function(isPressed)
{
    CURRENTSEQMODE = 1;
    setActivePage(melodicSequencerPage);
}

drumSequencerPage.onLeftBottom = function(isPressed)
{
}

drumSequencerPage.updateRGBLEDs = function()
{
    
}

drumSequencerPage.update11segLEDs = function()
{
}

drumSequencerPage.updateIndicators = function()
{
}