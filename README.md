# ZoomProject


# How to run the project.

1. Run npm install to install all the required dependencies.
2. Run npm start or npx react-native run-android (for android) or npx react-native run-ios (for ios).
3. Add custom RoomName and RoomPassword in config.js file present in src/config folder to start zoom meeting.


# Problem Statement in Android: 

- User unable to screen share in Android



# Steps Followed - 

1. Joined Meeting as Host.
2. Enable Screen Share by using lockShare() setting as false.
3. Tried to share screen on android using shareScreen().


Expected Result - Screen shared on Android.

Actual Result - App got crashed.



# Code Snippets: 

// Function to enable to share screen
	zoom.shareHelper.lockShare(false); 

// Function to share Screen	
	const onPressShare = async () => {
const isOtherSharing = await zoom.shareHelper.isOtherSharing();
    const isShareLocked = await zoom.shareHelper.isShareLocked();

    if (isOtherSharing) {
      Alert.alert('Other is sharing');
    } else if (isShareLocked) {
      Alert.alert('Share is locked by host');
    } else if (isSharing) {
      zoom.shareHelper.stopShare();
    } else {
      zoom.shareHelper.shareScreen(); // App got crash here
    }
  };
  
  
  # Problem Statement in IOS:
  
  
- User unable to screen share in IOS


# Steps Followed - 

1. Followed Zoom Developer Document For iOS ScreenSharing ( Broadcast the device screen).
Refer Link : https://marketplace.zoom.us/docs/sdk/video/ios/advanced/screen-share/broadcast/#broadcast-the-device-screen


# Problem Facing - 

Using Objective C Language for that , we are able to start broadcast on debug device. However , At the same time we are not able to sync with Zoom Platform with Broadcasting. we are not have the SampleHandler class where the code to handle different broadcasting events resides. To handle the events. We are facing 'ZoomVideoSDKScreenShare/ZoomVideoSDKScreenShareService.h’ file not found.

