var obj = JSON.parse($response.body);
obj= {  
  "receiptStatus": "ok",
  "isEligibleForIntroPeriod": false,
  "productId": "com.readdle.ReaddleDocsIPad.subscription.year90_nus",
  "subscriptionAutoRenewStatus": "autoRenewOff",
  "isInGracePeriod": false,
  "originalTransactionId": "390000458051403",
  "subscriptionExpirationDate": "14:54 18/09/2099",
  "subscriptionState": "trial",
  "inAppPurchased": [
    "com.readdle.ReaddleDocsIPad.subscription.year90_nus"
  ],
  "receiptId": 1588809109000,
  "isDocuments6User": true,
  "inAppStates": [
    {
      "receiptStatus": "ok",
      "isEligibleForIntroPeriod": false,
      "productId": "com.readdle.ReaddleDocsIPad.subscription.year90_nus",
      "subscriptionAutoRenewStatus": "autoRenewOff",
      "isInGracePeriod": false,
      "originalTransactionId": "390000458051403",
      "subscriptionExpirationDate": "14:54 18/09/2099",
      "subscriptionState": "trial",
      "productName": "subscription"
    }
  ],
  "chargingPlatform": "iOS AppStore",
  "bundleId": "com.readdle.ReaddleDocsIPad"
};

$done({body: JSON.stringify(obj)});
