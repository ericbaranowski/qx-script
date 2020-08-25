/*
  https:\/\/subscription-api\.bodybuilding\.com\/entitlements\/check url script-response-body https://raw.githubusercontent.com/phd91105/Scripts/master/QuanX/scripting/bodyFit.js
  hostname = subscription-api.bodybuilding.com
*/

var obj = JSON.parse($response.body);
obj.active = "true";
obj.isFreeTrialEligible = "false";
//obj.inGracePeriod = "true";
$done({body: JSON.stringify(obj)});
