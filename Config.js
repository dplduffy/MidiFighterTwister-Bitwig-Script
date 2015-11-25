// ------------------------------
// Static configurations
// ------------------------------

// Inc/Dec of knobs
Config.fractionValue     = 1;
Config.fractionMinValue  = 0.5;
Config.maxParameterValue = 128;

// How fast the track and scene arrows scroll the banks/scenes
Config.trackScrollInterval = 100;
Config.sceneScrollInterval = 100;


// ------------------------------
// Editable configurations
// ------------------------------

Config.SCALES_SCALE          = 0;
Config.SCALES_BASE           = 1;
Config.SCALES_IN_KEY         = 2;
Config.SCALES_LAYOUT         = 3;
Config.CONVERT_AFTERTOUCH    = 4;

Config.scale             = 'Major';
Config.scaleBase         = 'C';
Config.scaleInKey        = true;
Config.scaleLayout       = '4th ^';
Config.convertAftertouch = 0;

Config.AFTERTOUCH_CONVERSION_VALUES = [ "Off", "Poly Aftertouch", "Channel Aftertouch" ];
for (var i = 0; i < 128; i++)
    Config.AFTERTOUCH_CONVERSION_VALUES.push ("CC " + i);

Config.DEFAULT_DEVICE_MODE_VALUES = [];
    

Config.init = function ()
{
    var prefs = host.getPreferences ();

    ///////////////////////////
    // Scale

    var scaleNames = Scales.getNames ();
    Config.scaleSetting = prefs.getEnumSetting ("Scale", "Scales", scaleNames, scaleNames[0]);
    Config.scaleSetting.addValueObserver (function (value)
    {
        Config.scale = value;
        Config.notifyListeners (Config.SCALES_SCALE);
    });
    
    Config.scaleBaseSetting = prefs.getEnumSetting ("Base", "Scales", Scales.BASES, Scales.BASES[0]);
    Config.scaleBaseSetting.addValueObserver (function (value)
    {
        Config.scaleBase = value;
        Config.notifyListeners (Config.SCALES_BASE);
    });

    Config.scaleInScaleSetting = prefs.getEnumSetting ("In Key", "Scales", [ "In Key", "Chromatic" ], "In Key");
    Config.scaleInScaleSetting.addValueObserver (function (value)
    {
        Config.scaleInKey = value == "In Key";
        Config.notifyListeners (Config.SCALES_IN_KEY);
    });

    Config.scaleLayoutSetting = prefs.getEnumSetting ("Layout", "Scales", Scales.LAYOUT_NAMES, Scales.LAYOUT_NAMES[0]);
    Config.scaleLayoutSetting.addValueObserver (function (value)
    {
        Config.scaleLayout = value;
        Config.notifyListeners (Config.SCALES_LAYOUT);
    });

    ///////////////////////////
    // Pad Sensitivity

    Config.convertAftertouchSetting = prefs.getEnumSetting ("Convert Poly Aftertouch to", "Pads", Config.AFTERTOUCH_CONVERSION_VALUES, Config.AFTERTOUCH_CONVERSION_VALUES[1]);
    Config.convertAftertouchSetting.addValueObserver (function (value)
    {
        
        for (var i = 0; i < Config.AFTERTOUCH_CONVERSION_VALUES.length; i++)
        {
            if (Config.AFTERTOUCH_CONVERSION_VALUES[i] == value)
            {
                Config.convertAftertouch = i - 3;
                break;
            }
        }
        Config.notifyListeners (Config.CONVERT_AFTERTOUCH);
    });
};

Config.setScale = function (scale)
{
    Config.scaleSetting.set (scale);
};

Config.setScaleBase = function (scaleBase)
{
    Config.scaleBaseSetting.set (scaleBase);
};

Config.setScaleInScale = function (inScale)
{
    Config.scaleInScaleSetting.set (inScale ? "In Key" : "Chromatic");
};

Config.setScaleLayout = function (scaleLayout)
{
    Config.scaleLayoutSetting.set (scaleLayout);
};

// ------------------------------
// Property listeners
// ------------------------------

Config.listeners = [];
for (var i = 0; i <= Config.CONVERT_AFTERTOUCH; i++)
    Config.listeners[i] = [];

Config.addPropertyListener = function (property, listener)
{
    Config.listeners[property].push (listener);
};

Config.notifyListeners = function (property)
{
    var ls = Config.listeners[property];
    for (var i = 0; i < ls.length; i++)
        ls[i].call (null);
};

function Config () {}
