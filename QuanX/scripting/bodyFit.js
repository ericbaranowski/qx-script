/*
  https:\/\/subscription-api\.bodybuilding\.com\/entitlements\/check 
  hostname = subscription-api.bodybuilding.com
*/

var obj = JSON.parse($response.body);
obj.active = "true";
obj.isFreeTrialEligible = "false";
//obj.inGracePeriod = "true";
$done({body: JSON.stringify(obj)});
