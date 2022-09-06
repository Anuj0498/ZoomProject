package com.launchmycareer.android;

import android.app.Activity;
import android.content.Intent;
import android.os.Build;

import com.facebook.react.ReactActivity;

import us.zoom.sdk.ZoomVideoSDK;
import us.zoom.sdk.ZoomVideoSDKShareHelper;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "LMC";
  }

  /**
   *  Users need to add below to their own project to use sharing.
   */
  @Override
  public void onActivityResult(int requestCode, int resultCode, Intent data) {
    super.onActivityResult(requestCode, resultCode, data);
    if (requestCode == 0 && resultCode == Activity.RESULT_OK) {
      Intent intent = new Intent(this, NotificationService.class);
      ZoomVideoSDKShareHelper shareHelper = ZoomVideoSDK.getInstance().getShareHelper();
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        startForegroundService(intent);
      } else {
        startService(intent);
      }
      shareHelper.startShareScreen(data);
    }
  }
}
