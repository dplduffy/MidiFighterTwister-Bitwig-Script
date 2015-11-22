
devicePage = new page();

devicePage.title = "Device";

devicePage.updateOutputState = function()
{
    clear();
    device2.setParameterPage(selectedParamPage+1);
    deviceBank2.scrollTo(deviceBank1PositionObserver);
    this.updateRGBLEDs();
    this.update11segLEDs();
    this.updateIndicators();
    this.deviceChangePopup();
}

devicePage.onEncoderPress = function(isActive)
{
}

devicePage.onEncoderRelease = function(isActive)
{
}

devicePage.onEncoderTurn = function(isActive)
{
    if ((encoderNum - encoderBankOffset.BANK4) < 8)
    {
    device1.getParameter(encoderNum-encoderBankOffset.BANK4).set(encoderValue,127);
    }
    if ((encoderNum - encoderBankOffset.BANK4) > 7)
    {
    if(dualParamPageView)
    {
    isNextDevice1ParamPage ?
        device2.getParameter((encoderNum-encoderBankOffset.BANK4)-8).set(encoderValue,127)
            : null;
    }
    }
}

devicePage.onRightTopPressed = function(isActive)
{
}

devicePage.onRightTopReleased = function(isActive)
{
    if(dualParamPageView)
    {
        if(isPrevDevice1ParamPage)
        {
            device1.setParameterPage(selectedParamPage-2);
            host.showPopupNotification(((device1ParamPageNames[selectedParamPage-2])+' & '+(device1ParamPageNames[selectedParamPage-1])));
        }
        else
        {
            if(deviceBank1CanScrollUp)
            {
            tempDevice1Name = device1Name;
            deviceBank1.scrollUp()
            popupSet = true;
            scrollUp = true;
            }
        }
    }
    else
    {
        if(isPrevDevice1ParamPage)
        {
            device1.setParameterPage(selectedParamPage-1);
            host.showPopupNotification(device1ParamPageNames[selectedParamPage-1])
        }
        else
        {
            if(deviceBank1CanScrollUp)
            {
            tempDevice1Name = device1Name;
            deviceBank1.scrollUp();
            popupSet = true;
            scrollUp = true;
            }
        }
    }
}

devicePage.onRightMiddlePressed = function(isActive)
{
}

devicePage.onRightMiddleReleased = function(isActive)
{
    dualParamPageView = !dualParamPageView;
    dualParamPageView ? 
        host.showPopupNotification('Dual Page View') : host.showPopupNotification('Single Page View');
}

devicePage.onRightBottomPressed = function(isActive)
{
}

devicePage.onRightBottomReleased = function(isActive)
{
    if(dualParamPageView)
    {
        if(isNextDevice2ParamPage)
        {
            device1.setParameterPage(selectedParamPage+2);
            if(typeof (device1ParamPageNames[selectedParamPage+3]) === 'undefined')
            {
            host.showPopupNotification(device1ParamPageNames[selectedParamPage+2]);
            }
            else
            {
            host.showPopupNotification((device1ParamPageNames[selectedParamPage+2])+' & '+(device1ParamPageNames[selectedParamPage+3]));
            }

        }
        else
        {
            if(isNextDevice1ParamPage)
            {
            device1.setParameterPage(selectedParamPage+1);
            host.showPopupNotification(device1ParamPageNames[selectedParamPage+1])
            }
            else
            {
                if(deviceBank1CanScrollDown)
                {
                tempDevice1Name = device1Name;
                deviceBank1.scrollDown();
                popupSet = true;
                }
            }
        }
    }
    else
    {
        if(isNextDevice1ParamPage)
        {
            device1.setParameterPage(selectedParamPage+1);
            host.showPopupNotification(device1ParamPageNames[selectedParamPage+1]);
        }
        else
        {
            if(deviceBank1CanScrollDown)
            {
            tempDevice1Name = device1Name;
            deviceBank1.scrollDown();
            popupSet = true;
            }
        }
    }
}

devicePage.onLeftTopPressed = function(isActive)
{
}

devicePage.onLeftTopReleased = function(isActive)
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

devicePage.onLeftMiddlePressed = function(isActive)
{
}

devicePage.onLeftMiddleReleased = function(isActive)
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

devicePage.onLeftBottomPressed = function(isActive)
{
}

devicePage.onLeftBottomReleased = function(isActive)
{
}

devicePage.updateRGBLEDs = function()
{
    for(var i=0; i<8; i++)
    {
        setRGBLED(i+encoderBankOffset.BANK4, INDICATOR_COLOR[i], STROBE.OFF);
        
        if(dualParamPageView)
        {
        (isNextDevice1ParamPage) ?
            setRGBLED((i+encoderBankOffset.BANK4)+8, INDICATOR_COLOR[i], STROBE.OFF) :
                setRGBLED(i+encoderBankOffset.BANK4+8, COLOR.BLACK, STROBE.OFF);
        }
        else
        {
            setRGBLED(i+encoderBankOffset.BANK4+8, COLOR.BLACK, STROBE.OFF);
        }
    }
}

devicePage.update11segLEDs = function()
{
    for(var i=0; i<8; i++)
    {
        set11segLED(i+encoderBankOffset.BANK4, device1Param[i]);
        if(dualParamPageView)
        {
        (isNextDevice1ParamPage) ?
            set11segLED((i+encoderBankOffset.BANK4)+8, device2Param[i]) :
                set11segLED(i+encoderBankOffset.BANK4+8, 0);
        }
        else
        {
            set11segLED(i+encoderBankOffset.BANK4 +8, 0);
        }
    }
}

devicePage.updateIndicators = function()
{
    for (var i=0; i<8; i++)
    {
        device1.getParameter(i).setIndication(true);
        dualParamPageView ? device2.getParameter(i).setIndication(true) : device2.getParameter(i).setIndication(false);
    }
}

devicePage.deviceChangePopup = function()
{
    if(tempDevice1Name != device1Name)
    {
        if(scrollUp)
        {
            scrollUp = false;
        }   
        if(popupSet)
        {
            if(dualParamPageView)
            {
                if(typeof (device1ParamPageNames[selectedParamPage+1]) === 'undefined')
                {
                host.showPopupNotification(
                    (device1Name)+
                        ': '+(device1ParamPageNames[selectedParamPage]));
                }
                else
                {
                host.showPopupNotification(
                    (device1Name)+
                        ': '+(device1ParamPageNames[selectedParamPage])+
                            ' & '+(device1ParamPageNames[selectedParamPage+1]));
                }
            }
            else
            {
            host.showPopupNotification((device1Name) + ': ' + device1ParamPageNames[selectedParamPage]);
            }
        }
    popupSet = false;
    }
}
