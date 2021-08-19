# Welcome to the MidiFighterTwister-Bitwig-Script wiki!

Script updated 08/18/2021. Bitwig Version 4.0.1.  Check the "Issues" section of GitHub for known issues and future plans.

## Conventions
The Midi Fighter Twister (MFT) has 16 encoders, 16 buttons (referred to as "buttons" in this documentation), one for each encoder, and 3 buttons each on the left and right sides ("left buttons" and "right buttons").  The encoders and buttons start at 1 in the top left and end with 16 in the bottom right.  The left and right buttons start at 1 on the top and end with 3 on the bottom.  Each encoder has an 11 segment LED showing the current value of said encoder, and an RGB LED displaying additional information.  Values controlled by the script will be shown with an indicator in Bitwig Studio.

## Pages
A "page" is the current state of the 16 buttons and encoders on the front of the MFT.  The current script has the following pages
* Track Overview 
  * Controls macros and track functions
  * Accessed by Right Button 1
* Mixer Mode: Main & Mixer Mode: Eight (DOCUMENTATION TBD)
  * Mixer functions
  * Accessed by Right Button 2 (press a second time to flip between Main and Eight mode)
* User
  * User assignable buttons and encoders.
  * Accessed by Right Button 3.

## Overview Page
The script defaults to the Overview Page.  Controls for this page are as follows
* 1 - 8
  * Encoders control macros 1-8 of the selected remote control page of selected device on selected track. These update automatically based on track and device selection.  11 seg LED will tell you the current value of each macro. RGB LEDs match the indicator colors. Buttons currently do not control anything.
* 9
  * Encoder scrolls through devices on the selected track. When you change devices there will be a popup to show you the current device name. 11 seg LED RGB indicator will indicate which device you are on in the selected track, this scales with different device counts where device 1 is no LEDs and the last device is all 11 LEDs. The RGB indicator will go through the colors of the rainbow showing you have changed devices. Button toggles device panel.
* 10
  * Encoder scrolls through remote control pages on the selected device. When you change devices there will be a popup to show you the current page name (NOTE: Preset Pages are currently not supported with this popup). 11 seg LED RGB indicator will indicate which device you are on in the selected track, this scales with different device counts where device 1 is no LEDs and the last device is all 11 LEDs. The RGB indicator will go through the colors of the rainbow showing you have changed devices. Button toggles device page visibility.
* 11
  * Encoder scrolls through tracks. 11 seg LED RGB indicator does not show anything. The RGB indicator will indicate the track color or be flashing red if the track is record armed. Button toggles track record arm.
* 12
  * Encoder controls pan of selected track. 11 seg LED RGB indicator shows pan value (need to use MFT config utility to show as a single dot). The RGB indicator will indicate the track color or be flashing yellow if the track is solo'd. Button toggles track solo.
* 13-15
  * Currently unused. Will be added in future update.
* 16
  * Encoder controls volume of selected track. 11 seg LED RGB indicator shows volume value. The RGB indicator will indicate the track color or be flashing orange if the track is muted. Button toggles track mute.

## Mixer Page
TBD

## User Page
You can assign any of the 16 knobs and encoders to anything in Bitwig using midi learn in User mode.