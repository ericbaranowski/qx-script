/**** Start conversion script ****/
let isQuantumultX=$task!=undefined;let isSurge=$httpClient!=undefined;let isLoon=isSurge&&typeof $loon!=undefined;var $task=isQuantumultX?$task:{};var $httpClient=isSurge?$httpClient:{};var $prefs=isQuantumultX?$prefs:{};var $persistentStore=isSurge?$persistentStore:{};var $notify=isQuantumultX?$notify:{};var $notification=isSurge?$notification:{};if(isQuantumultX){var errorInfo={error:"",};$httpClient={get:(url,cb)=>{var urlObj;if(typeof url=="string"){urlObj={url:url,}}else{urlObj=url}
$task.fetch(urlObj).then((response)=>{cb(undefined,response,response.body)},(reason)=>{errorInfo.error=reason.error;cb(errorInfo,response,"")})},post:(url,cb)=>{var urlObj;if(typeof url=="string"){urlObj={url:url,}}else{urlObj=url}
url.method="POST";$task.fetch(urlObj).then((response)=>{cb(undefined,response,response.body)},(reason)=>{errorInfo.error=reason.error;cb(errorInfo,response,"")})},}}
if(isSurge){$task={fetch:(url)=>{return new Promise((resolve,reject)=>{if(url.method=="POST"){$httpClient.post(url,(error,response,data)=>{if(response){response.body=data;resolve(response,{error:error,})}else{resolve(null,{error:error,})}})}else{$httpClient.get(url,(error,response,data)=>{if(response){response.body=data;resolve(response,{error:error,})}else{resolve(null,{error:error,})}})}})},}}
if(isQuantumultX){$persistentStore={read:(key)=>{return $prefs.valueForKey(key)},write:(val,key)=>{return $prefs.setValueForKey(val,key)},}}
if(isSurge){$prefs={valueForKey:(key)=>{return $persistentStore.read(key)},setValueForKey:(val,key)=>{return $persistentStore.write(val,key)},}}
if(isQuantumultX){$notify=((notify)=>{return function(title,subTitle,detail,url=undefined){detail=url===undefined?detail:`${detail}\nClick the link to jump: ${url}`;notify(title,subTitle,detail)}})($notify);$notification={post:(title,subTitle,detail,url=undefined)=>{detail=url===undefined?detail:`${detail}\nClick the link to jump: ${url}`;$notify(title,subTitle,detail)},}}
if(isSurge&&!isLoon){$notification.post=((notify)=>{return function(title,subTitle,detail,url=undefined){detail=url===undefined?detail:`${detail}\nClick the link to jump: ${url}`;notify.call($notification,title,subTitle,detail)}})($notification.post);$notify=(title,subTitle,detail,url=undefined)=>{detail=url===undefined?detail:`${detail}\nClick the link to jump: ${url}`;$notification.post(title,subTitle,detail)}}
if(isLoon){$notify=(title,subTitle,detail,url=undefined)=>{$notification.post(title,subTitle,detail,url)}}
/**** Conversion succeeded ****/

//Thông tin đăng nhập
const account = {
  user: "0354353735",
  pass: "1234qwer",
};

var body = "account=" + account.user + "&build_code=2020.4.15.2&cmnd=&device_id=00000000-0000-0000-0000-000000000000&device_name=L%20ng%20Kh%20ch%20s%20iPhone%20%28iPhone%20X%29&keyDeviceAcc=xxx&os_type=ios&os_version=13.300000&password=" + account.pass + "&version_app=4.3.4";

var apiloginmobile = {
  url: 'https://apivtp.vietteltelecom.vn:6768/myviettel.php/loginMobile',
  headers: {},
  body: body,
};

//
async function launch() {
  await loginmobile();
}

launch()

function loginmobile() {
  $httpClient.post(apiloginmobile, function (error, response, data) {
    if (error) {
      //console.log('error');
    } else {
      //console.log(data);
      if (response.status == 200) {
        let obj = JSON.parse(data);
        if (obj["errorCode"] === "0") {
          var token = obj["data"]["data"]["token"];
          getdataremain(token);
        }
        else {
          $notification.post("Data Flow acount user/pass false‼️", "", "");
          //console.log(data);
        }
      }
    }
    $done();
  });
}

function getdataremain(token) {
  var body = "build_code=2020.4.15.2&device_id=00000000-0000-0000-0000-000000000000&device_name=L%20ng%20Kh%20ch%20s%20iPhone%20%28iPhone%20X%29&os_type=ios&os_version=13.300000&token=" + token + "&version_app=4.3.4";
  var dataremain = {
    url: 'https://apivtp.vietteltelecom.vn:6768/myviettel.php/getDataRemain',
    headers: {},
    body: body,
  };
  $httpClient.post(dataremain, function (error, response, data) {
    if (error) {
      //console.log('error');
    } else {
      //console.log(data);
      if (response.status == 200) {
        let obj = JSON.parse(data);
        if (obj["errorCode"] === "0") {
          var data = obj["data"][0];
          $notification.post("Data Flow: " + data["pack_name"], "", "Remain: " + data["remain"] + "( ~" + Math.round(data["remain_mb"] / 1024) + " GB)\nExpiredate: " + data["expireDate"]);
        }
        else {
          $notification.post("Data Flow token expired‼️", "", "Try to login again in app My Viettel");
        }
      }
    }
    $done();
  });
}