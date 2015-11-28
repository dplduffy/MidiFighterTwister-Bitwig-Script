function onStepExists(step, key, exists)
{
	stepData[step][key] = exists;
}

function isAnyStepTrue(step, array)
{
	for (k=0; k<SEQ_KEYS; k++)
	{
		if (array[step][k] === true)
		{
			return true;
		}
	}
	return false;
}

function getFirstKey(step, array)
{
	for (k=0; k<SEQ_KEYS; k++)
	{
		if (array[step][k] === true)
		{
			return k;
		}
	}
	return 0;
}

function onStepPlaying(step)
{
	playingStep = (step);
}

function customScrollStep()
{
    if (playingStep > -1)
    {
        if(sequencerFollow)
        {
            while (playingStep>currentScrollStepEnd)
            {
                cursorClip.scrollStepsPageForward();
                currentScrollStepOffset = currentScrollStepOffset + 1;
                currentScrollStepStart = (currentScrollStepOffset*SEQ_STEPS);
                currentScrollStepEnd = (((currentScrollStepOffset*SEQ_STEPS)+SEQ_STEPS) - 1) ;
            }
            while (playingStep<currentScrollStepStart)
            {
                cursorClip.scrollStepsPageBackwards()
                currentScrollStepOffset = currentScrollStepOffset - 1;
                currentScrollStepStart = (currentScrollStepOffset*SEQ_STEPS);
                currentScrollStepEnd = (((currentScrollStepOffset*SEQ_STEPS)+SEQ_STEPS) - 1) ;             
            }
        }
    }
}

function scaleKeyToEncoder(key)
{
    var keytemp = (key-((CURRENT_OCT*12)+ROOT_NOTE))+((OCTAVE_RANGE*12)/2);
    keytemp = (keytemp/(OCTAVE_RANGE*12))*127;
    keytemp > 127 ? keytemp = 127 : keytemp = Math.floor(keytemp);
    keytemp < 0 ? keytemp = 0 : keytemp = Math.floor(keytemp);
    return keytemp;
}

function scaleEncoderToKey(enc)
{
    a = (((CURRENT_OCT*12)+ROOT_NOTE))-((OCTAVE_RANGE*12)/2);
    b = (a+(OCTAVE_RANGE*12));
    return Math.ceil(((((b-a)*(enc-min))/(max-min)) + a));
}

function scaleOctToEncoder(oct)
{
   return Math.floor((oct/10)*127);
}

function scaleEncoderToOct(oct)
{
    a = 0;
    b = 10;
    return Math.floor(((((b-a)*(oct-min))/(max-min)) + a));
}

function scaleOctRangeToEncoder(range)
{
   return Math.floor((range/7)*127);
}

function scaleEncoderToOctRange(range)
{
    a = 0;
    b = 7;
    return Math.floor(((((b-a)*(range-min))/(max-min)) + a));
}

function scaleRootToEncoder(root)
{
    return Math.floor((root/(rootNoteNames.length-1))*127);
}

function scaleEncoderToRoot(enc)
{
    a = 0;
    b = rootNoteNames.length-1;
    return Math.floor(((((b-a)*(enc-min))/(max-min)) + a));
}

function scaleModeToEncoder(mode)
{
    return Math.floor((mode/(modernModes.length-1))*127);
}

function scaleEncoderToMode(enc)
{
    a = 0;
    b = modernModes.length-1;
    return Math.floor(((((b-a)*(enc-min))/(max-min)) + a));
}

function scaleSizeToEncoder(size)
{
    return Math.floor((size/(stepSizeArray.length-1))*127);
}

function scaleEncoderToSize(enc)
{
    a = 0;
    b = stepSizeArray.length-1;
    return Math.floor(((((b-a)*(enc-min))/(max-min)) + a));
}

function scaleDrumOffsetToEncoder(offset)
{
	return Math.floor((offset/(drumOffsets.length-1))*127);
}

function scaleEncoderToDrumOffset(enc)
{
	a=0
	b=drumOffsets.length-1;
	return Math.floor(((((b-a)*(enc-min))/(max-min)) + a));
}

//function incrementRainbow (varToInc)
//{
//    var tempIndex = rainbowArray.indexOf(varToInc);
//    rainbowArray[tempIndex+1] > -1 ? varToInc = rainbowArray[tempIndex+1] : varToInc = rainbowArray[0];
//    return varToInc;
//}
//
//function decrementRainbow (varToInc)
//{
//    var tempIndex = rainbowArray.indexOf(varToInc);
//    rainbowArray[tempIndex-1] > -1 ? varToInc = rainbowArray[tempIndex-1] : varToInc = rainbowArray[rainbowArray.length-1];
//    return varToInc;
//} 