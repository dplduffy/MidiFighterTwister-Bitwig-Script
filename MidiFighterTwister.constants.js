var volume = initArray(0, 4);
var pan = initArray(0, 4);
var mute = initArray(0, 4);
var solo = initArray(0, 4);
var arm = initArray(0, 4);
var color = initArray(0, 4);
var isSelected = initArray(0, 4);
var activePage = null;
var channelStepSize = 1;
var channelStepSizeArray = [1, 4, 8];
var cursorTrackName;

var statusType =
{
   SIDEBUTTON_RELEASE:131,
   SIDEBUTTON_PRESS:147,
   ENCODER_PRESS:177,
   ENCODER_TURN:176,
}
var SIDE_BUTTON =
{
   LH_TOP:8,
   LH_MIDDLE:9,
   LH_BOTTOM:10,
   RH_TOP:11,
   RH_MIDDLE:12,
   RH_BOTTOM:13,
};
var LEFT_BUTTON =
{
    TOP:8,
    MIDDLE:9,
    BOTTOM:10,
};

var pendingRGBLEDs = new Array(64);
var activeRGBLEDs = new Array(64);
var pendingRGBSTROBEs = new Array(64);
var activeRGBSTROBEs = new Array(64);
var pending11segLEDs = new Array(64);
var active11segLEDs = new Array(64);
var rainbowArray = [80, 67, 60, 40, 18, 100, 117];
var COLOR =
{
    SILVER:0,
    WHITE:0,
    GREY:0,
    BLACK:0,
    DARK_BLUE:13,
    LIGHT_BLUE:18,
    AQUA:25,
    TURQUOISE:35,
    MINT:30,
    LIGHT_GREEN:40,
    GREEN:45,
    PUKE_GREEN:57,
    FOREST_GREEN:57,
    LIGHT_YELLOW:60,
    GOLD:62,
    BROWN:63,
    LIGHT_BROWN:62,
    LIGHT_ORANGE:67,
    DARK_ORANGE:70,
    LIGHT_RED:72,
    RED:80,
    DARK_PINK:90,
    LIGHT_PINK:100,
    LIGHT_PURPLE:110,
    DARK_PURPLE:112,
    LIGHT_PURPLE2:117,
    DARK_PURPLE2:125,
};
var INDICATOR_COLOR =
[
   COLOR.RED,
   COLOR.DARK_ORANGE,
   COLOR.GOLD,
   COLOR.LIGHT_GREEN,
   COLOR.MINT,
   COLOR.LIGHT_BLUE,
   COLOR.LIGHT_PURPLE,
   COLOR.DARK_PINK
]
   
var STROBE =
{
   RAINBOW:127,
   PULSE1:12,
   PULSE2:13,
   ON:1,
   OFF:0,
}
var trackColors =
[
    [ 0.3294117748737335 , 0.3294117748737335 , 0.3294117748737335 , COLOR.GREY],    // Dark Gray
    [ 0.47843137383461   , 0.47843137383461   , 0.47843137383461   , COLOR.GREY],    // Gray
    [ 0.7882353067398071 , 0.7882353067398071 , 0.7882353067398071 , COLOR.GREY],    // Light Gray
    [ 0.5254902243614197 , 0.5372549295425415 , 0.6745098233222961 , COLOR.SILVER],   // Silver
    [ 0.6392157077789307 , 0.4745098054409027 , 0.26274511218070984, COLOR.BROWN],   // Dark Brown
    [ 0.7764706015586853 , 0.6235294342041016 , 0.43921568989753723, COLOR.LIGHT_BROWN],   // Brown
    [ 0.34117648005485535, 0.3803921639919281 , 0.7764706015586853 , COLOR.DARK_PURPLE],   // Dark Blue
    [ 0.5176470875740051 , 0.5411764979362488 , 0.8784313797950745 , COLOR.LIGHT_PURPLE],   // Light Blue
    [ 0.5843137502670288 , 0.2862745225429535 , 0.7960784435272217 , COLOR.DARK_PURPLE],   // Purple
    [ 0.8509804010391235 , 0.21960784494876862, 0.4431372582912445 , COLOR.DARK_PINK],   // Pink
    [ 0.8509804010391235 , 0.18039216101169586, 0.1411764770746231 , COLOR.RED],    // Red
    [ 1                  , 0.34117648005485535, 0.0235294122248888 , COLOR.DARK_ORANGE],   // Orange
    [ 0.8509804010391235 , 0.615686297416687  , 0.062745101749897  , COLOR.GOLD],   // Gold
    [ 0.45098039507865906, 0.5960784554481506 , 0.0784313753247261 , COLOR.FOREST_GREEN],   // Forest Green
    [ 0                  , 0.615686297416687  , 0.27843138575553894, COLOR.GREEN],   // Green
    [ 0                  , 0.6509804129600525 , 0.5803921818733215 , COLOR.TURQUOISE],   // Turquiose
    [ 0                  , 0.6000000238418579 , 0.8509804010391235 , COLOR.AQUA],   // Aqua
    [ 0.7372549176216125 , 0.4627451002597809 , 0.9411764740943909 , COLOR.LIGHT_PURPLE],   // Light Purple
    [ 0.8823529481887817 , 0.4000000059604645 , 0.5686274766921997 , COLOR.LIGHT_PINK],   // Light Pink
    [ 0.9254902005195618 , 0.3803921639919281 , 0.34117648005485535, COLOR.LIGHT_PINK],    // Skin
    [ 1                  , 0.5137255191802979 , 0.24313725531101227, COLOR.LIGHT_ORANGE],   // Light Orange
    [ 0.8941176533699036 , 0.7176470756530762 , 0.30588236451148987, COLOR.LIGHT_YELLOW],   // Light Yellow
    [ 0.6274510025978088 , 0.7529411911964417 , 0.2980392277240753 , COLOR.PUKE_GREEN],   // Puke Green
    [ 0.24313725531101227, 0.7333333492279053 , 0.3843137323856354 , COLOR.LIGHT_GREEN],   // Light Green
    [ 0.26274511218070984, 0.8235294222831726 , 0.7254902124404907 , COLOR.MINT],   // Mint
    [ 0.2666666805744171 , 0.7843137383460999 , 1                  , COLOR.LIGHT_BLUE]    // Blue
];

var MIXERMODE = 2;
var mixerModeArray = ["Volume / Pan", "Sends", "Mix 4"];
var mixerMode =
{
   VOLUME_PAN:0,
   SEND:1,
   Mix4:2,
};

//possible for future mix 8 mode
var Mix4 =
{
   BANK1 : 0,
   BANK2 : 1,
}
var CURRENT_MIX4 = 0;
var Mix4Array = [32,28];
var Mix4ArrayRGB = [0,4];

var currentSend = 0;
var currentSend11Seg = 1;
var sendArray =
[
    [0,0,0,0,0,0,0,0,0,0,0] , //track1
    [0,0,0,0,0,0,0,0,0,0,0] , //track2
	[0,0,0,0,0,0,0,0,0,0,0] , //track3
	[0,0,0,0,0,0,0,0,0,0,0] , //track3
	[0,0,0,0,0,0,0,0,0,0,0] , //track4
	[0,0,0,0,0,0,0,0,0,0,0] , //track5
	[0,0,0,0,0,0,0,0,0,0,0] , //track6
	[0,0,0,0,0,0,0,0,0,0,0] , //track7
	[0,0,0,0,0,0,0,0,0,0,0] , //track8
];

var ENCODERBANK = 2;
var encoderNum = -1;
var encoderValue = 0;
var encoderBankOffset =
{
   BANK1:0,
   BANK2:16,
   BANK3:32,
   BANK4:48,
}
var encoderBank =
{
   BANK1:12,
   BANK2:13,
   BANK3:14,
   BANK4:15,
}
var Bank1 =
{
	ENCODER1:1,
	ENCODER2:2,
	ENCODER3:3,
	ENCODER4:4,
	ENCODER5:5,
	ENCODER6:6,
	ENCODER7:7,
	ENCODER8:8,
	ENCODER9:9,
	ENCODER10:10,
	ENCODER11:11,
	ENCODER12:12,
	ENCODER13:13,
	ENCODER14:14,
	ENCODER15:15,
	ENCODER16:16,
}
var Bank2 =
{
	ENCODER1:17,
	ENCODER2:18,
	ENCODER3:19,
	ENCODER4:20,
	ENCODER5:21,
	ENCODER6:22,
	ENCODER7:23,
	ENCODER8:24,
	ENCODER9:25,
	ENCODER10:26,
	ENCODER11:27,
	ENCODER12:28,
	ENCODER13:29,
	ENCODER14:30,
	ENCODER15:31,
	ENCODER16:32,
}
var Bank3 =
{
	ENCODER1:33,
	ENCODER2:34,
	ENCODER3:35,
	ENCODER4:36,
	ENCODER5:37,
	ENCODER6:38,
	ENCODER7:39,
	ENCODER8:40,
	ENCODER9:41,
	ENCODER10:42,
	ENCODER11:43,
	ENCODER12:44,
	ENCODER13:45,
	ENCODER14:46,
	ENCODER15:47,
	ENCODER16:48,
}
var Bank4 =
{
	ENCODER1:49,
	ENCODER2:50,
	ENCODER3:51,
	ENCODER4:52,
	ENCODER5:53,
	ENCODER6:54,
	ENCODER7:55,
	ENCODER8:56,
	ENCODER9:57,
	ENCODER10:58,
	ENCODER11:59,
	ENCODER12:60,
	ENCODER13:61,
	ENCODER14:62,
	ENCODER15:63,
	ENCODER16:64,
}

var tempPatternPressStart = 0;
var tempPatternPressEnd = 0;
var tempPatternStartPressed = false;
var tempStepPressStart = 0;
var tempStepPressEnd = 0;
var tempStepStartPressed = false;
var currentBar = 0;
var barsOnPage = 0;
var currentSeqChunk = 0;
var currentScrollStepOffset = 0;
var currentScrollStepStart = 0;
var currentScrollStepEnd = 15;
var a = 0;
var b = 0;
var min = 0;
var max = 127;
var stepRGB = 67;
var seqFollowRGB = COLOR.GREEN;
var rootRGB = 80;
var modeRGB = 80;
var octRGB = 40;
var octRangeRGB = 60;
var currentDrumKey = 36;
var currentDrumOffset = 36;
var drumOffsetRGB = 40;
var sequencerFollow = true;
var prevStepData = [];
var stepData = [];
var activeStep = 0;
var playingStep = -1;
var clipStart = 0.0;
var clipStop  = 4.0;
var clipLoopStart = 0.0;
var clipLoopLength = 4.0;
var STEP_SIZE = 0.25;
var SEQ_STEPS = 16;
var SEQ_KEYS = 128;
var KEYS_OCT_LO = 0;
var KEYS_OCT_HI = 48;
var CURRENT_OCT = 3;   //0-10
var OCTAVE_RANGE = 2;   //1-10
var ROOT_NOTE = 0;
var CURRENT_MODERN_MODE = 0;
var VELOCITY = 127;
var CURRENTSEQMODE = 0;
var MELODICSEQMODE = 0;
var MELODICSEQNOTEPAGE = 0;
var MELODICSEQPATTERNPAGE = 0;
var MELODICSEQSETTINGSPAGE = 0;
var DRUMSEQMODE = 0;
var DRUMSEQNOTEPAGE = 2;
var DRUMSEQPATTERNPAGE = 0;
var DRUMSEQSETTINGSPAGE = 0;
var octaveNoteNumbers = [ '-2', '-1', '0', '1', '2', '3', '4', '5', '6', '7', '8']
var octaveRangeNames = ['± 6', '±12', '±18', '±24', '±30', '±36', '±42', '±48']
var stepSizeNameArray = ['1/32', '1/16', '1/8', '1/4', '1/2', '1']
var stepSizeArray = [0.125, 0.25, 0.5, 1, 2, 4]
var melodicNotePageNameArray = ['Pitch', 'Velocity']
var drumNotePageNameArray = ['Step Enter', 'Velocity', 'Drum Pads']
var patternPageNameArray = ['Pattern Set', 'Section Select']

var currentSeqMode =
{
	DRUM:0,
	MELODIC:1,
}
var melodicSeqMode =
{
	NOTE:0,
	PATTERN:1,
	SETTINGS:2,
}
var melodicSeqModeNotePage =
{
	PITCH:0,
	VELOCITY:1,
    LENGTH:2,           //not possible in current API
	MODULATION:3,  //not possible in current API
}
var melodicSeqModePatternPage =
{
   PATTERN_SET:0,
   SECTION_SELECT:1,
}
var melodicSeqModeSettingsPage =
{
   PAGE1 : 0,
}
var drumSeqMode =
{
	NOTE:0,
	PATTERN:1,
	SETTINGS:2,
}
var drumSeqModeNotePage =
{
	NOTE:0,
	VELOCITY:1,
    PAD:2,
}
var drumSeqModePatternPage =
{
	PATTERN_SET:0,
    SECTION_SELECT:1,
}
var drumSeqModeSettingsPage =
{
   PAGE1:0,
}
var modernModes =
[
 [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
 [ 0, 2, 4, 5, 7, 9, 11] ,
 [ 0, 2, 3, 5, 7, 8, 10] ,
 [ 0, 2, 3, 5, 7, 9, 10] ,
 [ 0, 2, 4, 5, 7, 9, 10] ,
 [ 0, 2, 4, 6, 7, 9, 11] ,
 [ 0, 1, 3, 5, 7, 8, 10] ,
 [ 0, 1, 3, 4, 6, 8, 10] ,
 [ 0, 1, 3, 4, 6, 7, 9] ,
 [ 0, 2, 3, 5, 6, 8, 9] ,
 [ 0, 2, 4, 6, 8, 10] ,
 [ 0, 3, 5, 6, 7, 10] ,
 [ 0, 3, 5, 7, 10] ,
 [ 0, 2, 4, 7, 9] ,
 [ 0, 2, 3, 5, 7, 8, 11] ,
 [ 0, 2, 3, 5, 7, 9, 11] ,
 [ 0, 1, 3, 4, 6, 8, 10] ,
 [ 0, 1, 4, 5, 7, 8, 11] ,
 [ 0, 2, 3, 6, 7, 8, 11] ,
 [ 0, 1, 4, 5, 7, 8, 10] ,
 [ 0, 4, 6, 7, 11] ,
 [ 0, 1, 5, 7, 10] ,
 [ 0, 1, 5, 6, 10] ,
 [ 0, 2, 3, 7, 9] ,
 [ 0, 1, 3, 7, 8] ,
 [ 0, 1, 4, 5, 7, 9, 10] 
];
var modernModesNames =
[
  ['Chromatic'],
  ['Major'],
  ['Minor'],
  ['Dorian'],
  ['Mixolydian'],
  ['Lydian'],
  ['Phrygian'],
  ['Locrian'],
  ['Dimished'],
  ['Whole-half'],
  ['Whole Tone'],
  ['Minor Blues'],
  ['Minor Pentaonic'],
  ['Marjor Pentatonic'],
  ['Harmonic Minor'],
  ['Melodic Minor'],
  ['Super Locorian'],
  ['Bhairav'],
  ['Hungarian Minor'],
  ['Minor Gypsy'],
  ['Hirojoshi'],
  ['In-Sen'],
  ['Iwato'],
  ['Kumoi'],
  ['Pelog'],
  ['Spanish']
];
var rootNoteNames = 
[
  ['C'],
  ['C#'],
  ['D'],
  ['D#'],
  ['E'],
  ['F'],
  ['F#'],
  ['G'],
  ['G#'],
  ['A'],
  ['A#'],
  ['B']
];
var melodicEncoderSetting =
{
   STEP : 8,
   SEQ_FOLLOW : 9,
   ROOT : 12,
   MODE : 13,
   OCT: 14,
   OCT_RANGE: 15,
}
var drumEncoderSetting =
{
   STEP : 8,
   SEQ_FOLLOW : 9,
   DRUM_OFFSET : 12,
}

var drumMatrix = [
   12, 13, 14, 15,
   8, 9, 10, 11,
   4, 5, 6, 7,
   0, 1, 2, 3]

var drumOffsets = [0, 4, 20, 36, 52, 68, 84, 100, 112]
var drumOffsetNames = ['C-2 to D#-1', 'E-2 to G-1', 'G#-1 to B0', 'C1 to D#2', 'E2 to G3', 'G#3 to B4', 'C5 to D#6', 'E6 to G7', 'E7 to G8']

var scrollUp = false;
var popupSet = false;
var tempDevice1Name = null;
var device1Param = initArray (0, 8);
var device2Param = initArray (0, 8);
var device1Macro = initArray (0, 8);
var device1ParamPageNames = null;
var device1Name = null;
var dualParamPageView = true;
var deviceBank1CanScrollUp = false;
var deviceBank1CanScrollDown = false;
var deviceBank1PositionObserver = 0;
var deviceBank1Count = 0;
var isNextDevice1ParamPage = false;
var isNextDevice2ParamPage = false;
var isPrevDevice1ParamPage = false;
var isPrevDevice2ParamPage = false;
var selectedParamPage = 0;
var CURRENT_DEVICE_MODE = 0;
var currentDeviceMode =
{
   DEVICE : 0,
   MACRO : 1,
}
var singleDeviceSetting =
{
   DEVICE : 12,
   PAGE : 13,
}