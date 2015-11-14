
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

drumSequencerPage.onRightTopPressed = function(isActive)
{
}

drumSequencerPage.onRightTopReleased = function (isActive)
{
}

drumSequencerPage.onRightMiddlePressed = function(isActive)
{
}

drumSequencerPage.onRightMiddleReleased = function(isActive)
{
}

drumSequencerPage.onRightBottomPressed = function(isActive)
{
}

drumSequencerPage.onRightBottomReleased = function (isActive)
{
}

drumSequencerPage.onLeftTopPressed = function(isActive)
{
}

drumSequencerPage.onLeftTopReleased = function(isActive)
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

drumSequencerPage.onLeftMiddlePressed = function(isActive)
{
}

drumSequencerPage.onLeftMiddleReleased = function(isActve)
{
    CURRENTSEQMODE = 1;
    setActivePage(melodicSequencerPage);
}

drumSequencerPage.onLeftBottomPressed = function(isActive)
{
}

drumSequencerPage.onLeftBottomReleased = function(isActive)
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