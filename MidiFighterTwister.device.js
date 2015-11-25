
devicePage = new page();

devicePage.title = "Device";

var devicePageRGB = 80;
var deviceCountRGB = 80;
var rgbPageDone = false;
var rgbDeviceDone = false;

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
    var tempEncoderTurn = encoderNum - encoderBankOffset.BANK4;
    
    if(CURRENT_DEVICE_MODE == currentDeviceMode.DEVICE)
    {
        if(tempEncoderTurn < 8)
        {
        device1.getParameter(tempEncoderTurn).set(encoderValue,127);
        }
        if(tempEncoderTurn > 7)
        {
            if(dualParamPageView)
            {
            isNextDevice1ParamPage ?
                device2.getParameter((tempEncoderTurn)-8).set(encoderValue,127)
                    : null;
            }
            else
            {
                if(tempEncoderTurn == singleDeviceSetting.DEVICE)
                {
                    var tempPrevDevice = deviceBank1PositionObserver;
                    var tempDevice = scaleEncoderToDeviceCount(encoderValue);
    
                    if(!rgbDeviceDone)
                    {
                        if (tempPrevDevice < tempDevice)
                        {
                            deviceCountRGB = incrementRainbow(deviceCountRGB);
                            devicePageRGB = 80;
                            rgbDeviceDone = true;
                        }
                        if (tempPrevDevice > tempDevice)
                        {
                            deviceCountRGB = decrementRainbow(deviceCountRGB);
                            devicePageRGB = 80;
                            rgbDeviceDone = true
                        }
                    }
                    if(rgbDeviceDone && (tempDevice == deviceBank1PositionObserver))
                    {
                        rgbDeviceDone = false;
                    }
    
                    deviceBank1.scrollTo(tempDevice);
                    tempDevice1Name = device1Name;
                    popupSet = true;
                }
                if(tempEncoderTurn == singleDeviceSetting.PAGE)
                {
                    var tempPrevPage = selectedParamPage;
                    var tempPage = scaleEncoderToDevicePage(encoderValue);
                    if(!rgbPageDone)
                    {
                        if (tempPrevPage < tempPage)
                        {
                            devicePageRGB = incrementRainbow(devicePageRGB);
                            device1.setParameterPage(tempPage);
                            host.showPopupNotification(device1ParamPageNames[selectedParamPage+1])
                            rgbPageDone = true;
                        }
                        if (tempPrevPage > tempPage)
                        {
                            devicePageRGB = decrementRainbow(devicePageRGB);
                            device1.setParameterPage(tempPage);
                            host.showPopupNotification(device1ParamPageNames[selectedParamPage-1])
                            rgbPageDone = true
                        }
                    }
                    if(rgbPageDone && (tempPage == selectedParamPage))
                    {
                        rgbPageDone = false;
                    }
                }
            }
        }
    }
}

devicePage.onRightTopPressed = function(isActive)
{
}

devicePage.onRightTopReleased = function(isActive)
{
    if(CURRENT_DEVICE_MODE == currentDeviceMode.DEVICE)
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
}

devicePage.onRightMiddlePressed = function(isActive)
{
}

devicePage.onRightMiddleReleased = function(isActive)
{
    if(CURRENT_DEVICE_MODE == currentDeviceMode.DEVICE)
    {
        dualParamPageView = !dualParamPageView;
        dualParamPageView ? 
            host.showPopupNotification('Dual Page View') : host.showPopupNotification('Single Page View');
    }
}

devicePage.onRightBottomPressed = function(isActive)
{
}

devicePage.onRightBottomReleased = function(isActive)
{
    if(CURRENT_DEVICE_MODE == currentDeviceMode.DEVICE)
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
    
    if(CURRENT_DEVICE_MODE == currentDeviceMode.DEVICE)
    {
        CURRENT_DEVICE_MODE = currentDeviceMode.MACRO;
        host.showPopupNotification('Macro Mode');
    }
    else if(CURRENT_DEVICE_MODE == currentDeviceMode.MACRO)
    {
        CURRENT_DEVICE_MODE = currentDeviceMode.DEVICE;
        host.showPopupNotification('Device Mode');
    }
    devicePage.clearIndication();
}

devicePage.updateRGBLEDs = function()
{
    if(CURRENT_DEVICE_MODE == currentDeviceMode.DEVICE)
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
                if((i+8) == singleDeviceSetting.DEVICE)
                {
                setRGBLED(i+encoderBankOffset.BANK4+8, deviceCountRGB, STROBE.OFF);
                }
                else if((i+8) == singleDeviceSetting.PAGE)
                {
                setRGBLED(i+encoderBankOffset.BANK4+8, devicePageRGB, STROBE.OFF);
                }
                else
                {
                setRGBLED(i+encoderBankOffset.BANK4+8, COLOR.BLACK, STROBE.OFF);
                }
            }
        }
    }
    if(CURRENT_DEVICE_MODE == currentDeviceMode.MACRO)
    {
        for (var i=0; i<8; i++)
        {
            setRGBLED(i+encoderBankOffset.BANK4, INDICATOR_COLOR[i], STROBE.OFF);
            setRGBLED(i+encoderBankOffset.BANK4+8, COLOR.BLACK, STROBE.OFF);
        }
    }
}

devicePage.update11segLEDs = function()
{
    if(CURRENT_DEVICE_MODE == currentDeviceMode.DEVICE)
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
                if((i+8) == singleDeviceSetting.DEVICE)
                {
                set11segLED(i+encoderBankOffset.BANK4+8, scaleDeviceCountToEncoder(deviceBank1PositionObserver));
                }
                else if((i+8) == singleDeviceSetting.PAGE)
                {
                device1ParamPageNames.length > 1 ?
                    set11segLED(i+encoderBankOffset.BANK4+8, scaleDevicePageToEncoder(selectedParamPage)) :
                        set11segLED(i+encoderBankOffset.BANK4+8, 0);
                }
                else
                {
                set11segLED(i+encoderBankOffset.BANK4 +8, 0);
                }
            }
        }
    }
}

devicePage.updateIndicators = function()
{
    if(CURRENT_DEVICE_MODE == currentDeviceMode.DEVICE)
    {
        for (var i=0; i<8; i++)
        {
            device1.getParameter(i).setIndication(true);
            dualParamPageView ? device2.getParameter(i).setIndication(true) : device2.getParameter(i).setIndication(false);
        }
    }
    if(CURRENT_DEVICE_MODE == currentDeviceMode.MACRO)
    {
        for (var i=0; i<8; i++)
        {
            device1Macro[i].setIndication(true);
        }
    }
}

devicePage.deviceChangePopup = function()
{
    if(CURRENT_DEVICE_MODE == currentDeviceMode.DEVICE)
    {
        if(tempDevice1Name != device1Name)
        {
            if(scrollUp)
            {
                dualParamPageView ?
                    device1.setParameterPage(device1ParamPageNames.length-1) :
                        device1.setParameterPage(device1ParamPageNames.length);
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
}

devicePage.clearIndication = function()
{
    for (var i=0; i<8; i++)
    {
        device1.getParameter(i).setIndication(false);
        device2.getParameter(i).setIndication(false);
        device1Macro[i].setIndication(false);
    }
}

function scaleDevicePageToEncoder(page)
{
	return Math.round((page/(device1ParamPageNames.length-1))*127);
}

function scaleEncoderToDevicePage(enc)
{
	a=0
	b=device1ParamPageNames.length-1;
	return Math.round(((((b-a)*(enc-min))/(max-min)) + a));
}

function scaleDeviceCountToEncoder(count)
{
    return Math.round((count/(deviceBank1Count-1))*127);
}

function scaleEncoderToDeviceCount(enc)
{
	a=0;
	b=deviceBank1Count-1;
	return Math.round(((((b-a)*(enc-min))/(max-min)) + a));
}