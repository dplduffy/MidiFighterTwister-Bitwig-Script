var masterTrack;
var track = initArray(0, 8);
var mainIsSelected = initArray(0, 8);
var effectTrack = initArray(0, 8);
var effectIsSelected = initArray(0, 4);
var masterIsSelected = initArray(0, 1);
var performTrack1IsSelected = initArray(0, 0);
var performTrack2IsSelected = initArray(0, 0);
var cursorClipColor = initArray(0, 0);
var cursorClipPosition = 0;

var activePage = null;
var channelStepSize = 1;
var channelStepSizeArray = [1, 4];
var cursorTrackName;
var cursorTrackPosition = 0;
//var cursorTrackPositionObserver = 0;
var tempCursorDRCPI = 0;
var tempCursorDI = 0;

var pageIndex = 0;

var statusType = {
   ENCODER_PRESS:177,
   ENCODER_TURN:176,
   SIDEBUTTON:179,
}
var SIDE_BUTTON = {
   LH_TOP:8,
   LH_MIDDLE:9,
   LH_BOTTOM:10,
   RH_TOP:11,
   RH_MIDDLE:12,
   RH_BOTTOM:13,
}

var pendingRGBLEDs = new Array(64);
var activeRGBLEDs = new Array(64);
var pendingRGBSTROBEs = new Array(64);
var activeRGBSTROBEs = new Array(64);
var pending11segLEDs = new Array(64);
var active11segLEDs = new Array(64);

var COLOR = {
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
}

var RAINBOW_ARRAY = [
   COLOR.RED,
   COLOR.DARK_ORANGE,
   COLOR.GOLD,
   COLOR.LIGHT_GREEN,
   COLOR.LIGHT_BLUE,
   COLOR.DARK_PINK,
   COLOR.MINT,
   COLOR.LIGHT_PURPLE,
];

var INDICATOR_COLOR = [
   COLOR.RED,
   COLOR.DARK_ORANGE,
   COLOR.GOLD,
   COLOR.GREEN,
   COLOR.LIGHT_GREEN,
   COLOR.LIGHT_BLUE,
   COLOR.LIGHT_PURPLE,
   COLOR.DARK_PINK
]
var STROBE = {
   RAINBOW:127,
   PULSE1:13,
   PULSE2:14,
   PULSE3:16,
   ON:1,
   OFF:0,
}
var trackColors = [
    [ 0.5                , 0.5                , 0.5                , COLOR.GREY],         // No Color?
    [ 0.3294117748737335 , 0.3294117748737335 , 0.3294117748737335 , COLOR.GREY],         // Dark Gray
    [ 0.47843137383461   , 0.47843137383461   , 0.47843137383461   , COLOR.GREY],         // Gray
    [ 0.7882353067398071 , 0.7882353067398071 , 0.7882353067398071 , COLOR.GREY],         // Light Gray
    [ 0.5254902243614197 , 0.5372549295425415 , 0.6745098233222961 , COLOR.SILVER],       // Silver
    [ 0.6392157077789307 , 0.4745098054409027 , 0.26274511218070984, COLOR.BROWN],        // Dark Brown
    [ 0.7764706015586853 , 0.6235294342041016 , 0.43921568989753723, COLOR.LIGHT_BROWN],  // Brown
    [ 0.34117648005485535, 0.3803921639919281 , 0.7764706015586853 , COLOR.DARK_PURPLE],  // Dark Blue
    [ 0.5176470875740051 , 0.5411764979362488 , 0.8784313797950745 , COLOR.LIGHT_PURPLE], // Light Blue
    [ 0.5843137502670288 , 0.2862745225429535 , 0.7960784435272217 , COLOR.DARK_PURPLE],  // Purple
    [ 0.8509804010391235 , 0.21960784494876862, 0.4431372582912445 , COLOR.DARK_PINK],    // Pink
    [ 0.8509804010391235 , 0.18039216101169586, 0.1411764770746231 , COLOR.RED],          // Red
    [ 1                  , 0.34117648005485535, 0.0235294122248888 , COLOR.DARK_ORANGE],  // Orange
    [ 0.8509804010391235 , 0.615686297416687  , 0.062745101749897  , COLOR.GOLD],         // Gold
    [ 0.45098039507865906, 0.5960784554481506 , 0.0784313753247261 , COLOR.FOREST_GREEN], // Forest Green
    [ 0                  , 0.615686297416687  , 0.27843138575553894, COLOR.GREEN],        // Green
    [ 0                  , 0.6509804129600525 , 0.5803921818733215 , COLOR.TURQUOISE],    // Turquiose
    [ 0                  , 0.6000000238418579 , 0.8509804010391235 , COLOR.AQUA],         // Aqua
    [ 0.7372549176216125 , 0.4627451002597809 , 0.9411764740943909 , COLOR.LIGHT_PURPLE], // Light Purple
    [ 0.8823529481887817 , 0.4000000059604645 , 0.5686274766921997 , COLOR.LIGHT_PINK],   // Light Pink
    [ 0.9254902005195618 , 0.3803921639919281 , 0.34117648005485535, COLOR.LIGHT_PINK],   // Skin
    [ 1                  , 0.5137255191802979 , 0.24313725531101227, COLOR.LIGHT_ORANGE], // Light Orange
    [ 0.8941176533699036 , 0.7176470756530762 , 0.30588236451148987, COLOR.LIGHT_YELLOW], // Light Yellow
    [ 0.6274510025978088 , 0.7529411911964417 , 0.2980392277240753 , COLOR.PUKE_GREEN],   // Puke Green
    [ 0.24313725531101227, 0.7333333492279053 , 0.3843137323856354 , COLOR.LIGHT_GREEN],  // Light Green
    [ 0.26274511218070984, 0.8235294222831726 , 0.7254902124404907 , COLOR.MINT],         // Mint
    [ 0.2666666805744171 , 0.7843137383460999 , 1                  , COLOR.LIGHT_BLUE]    // Blue
]

var MIXERMODE = 0;
var mixerModeArray = ["Main", "Eight", "Effect", "Master"];
var mixerMode = {
   MAIN:0,
   EIGHT:1,
   EFFECT:2,
   MASTER:3,
}

var OVMODE = 0;
var ovMode = {
   OVERVIEW:0,
   PERFORM2:1,
   PERFORM4:2,
}

var pTrackBank = initArray(0, 4);
var pTrack = initArray(0, 4);
var pTrackIsSelected = initArray(0, 4);
var pTrackColor = initArray(0, 4);
var pDeviceBank = initArray(0, 4);
var pDeviceName = initArray(0, 4);
var pTrackName = initArray(0, 4);
var pDRCP = initArray(0, 4);
var pDeviceParam = [
   [0,0,0,0],
   [0,0,0,0],
   [0,0,0,0],
   [0,0,0,0]];
var pDevice = initArray(0, 4);
var PMODE = initArray(0, 4);
var pMode = {
   DEVICE:0,
   TRACK:1,
}



trackIndex1 = 0;
trackIndex2 = 0;
deviceIndex1 = 0;
deviceIndex2 = 0;

var Mix4 = {
   BANK1 : 0,
   BANK2 : 1,
}

var CURRENT_MIX4 = 0;
var Mix4Array = [32,28];
var Mix4ArrayRGB = [0,4];

var currentPT1Send = 0;
var currentPT2Send = 0;

var currentSend = 0;
var currentSend11Seg = 1;
var sendArray = [
   [0,0,0,0,0,0,0,0,0,0,0] , //track1
   [0,0,0,0,0,0,0,0,0,0,0] , //track2
	[0,0,0,0,0,0,0,0,0,0,0] , //track3
	[0,0,0,0,0,0,0,0,0,0,0] , //track4
   [0,0,0,0,0,0,0,0,0,0,0] , //track1
   [0,0,0,0,0,0,0,0,0,0,0] , //track2
	[0,0,0,0,0,0,0,0,0,0,0] , //track3
	[0,0,0,0,0,0,0,0,0,0,0] , //track4
];

var ENC_SHIFT = initArray(0,16);
var ROW_SHIFT = initArray(0,4);
var enc = -1;
var val = 0;

var OVERVIEW = {
   DEVICE: 8,
   PAGE: 9,
   TRACK_SEL: 10,
   PAN: 11,
   CLIP: 12,
   SEND_SEL: 13,
   SELD_LVL: 14,
   VOLUME: 15,
}

var currentSideButtonOffset = 0;

var BANK = [0,1,2,3];
var BANK_ENC_OFFSET = [0,16,32,64];
var BANK_SB_OFFSET = [0,6,12,18];

var ENC = 
{
   OVERVIEW,
   BANK,
   BANK_ENC_OFFSET,
   BANK_SB_OFFSET,
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
var CURRENT_OCT = 3;    //0-10
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
   LENGTH:2,      //not possible in current API
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
var cursorDeviceParam = initArray (0, 8);
var cursorDeviceName = null;
var deviceBank1CanScrollUp = false;
var deviceBank1CanScrollDown = false;
var deviceBank1PositionObserver = 0;
var deviceBank1Count = 0;
var selectedParamPage = 0;
var performDevice1Param = initArray (0, 8);
var performDevice2Param = initArray (0, 8);
