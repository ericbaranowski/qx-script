const $ = env();
const account = {
  user: "0354353735",
  pass: "1234qwer",
};

var body = "account=" + account.user + "&build_code=2020.4.15.2&cmnd=&device_id=00000000-0000-0000-0000-000000000000&device_name=duy&keyDeviceAcc=xxx&os_type=ios&os_version=13.600000&password=" + account.pass + "&version_app=4.3.4";

var apiloginmobile = {
  url: 'https://apivtp.vietteltelecom.vn:6768/myviettel.php/loginMobile',
  headers: {},
  body: body,
};

async function launch() {
  await loginmobile();
}
launch()

function loginmobile() {
  $.post(apiloginmobile, function (error, response, data) {
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
          $.notify("Data Flow acount user/pass false‼️", "", "");
          //console.log(data);
        }
      }
    }
    $.done();
  });
}

function getdataremain(token) {
  var body = "build_code=2020.4.15.2&device_id=00000000-0000-0000-0000-000000000000&device_name=duy&os_type=ios&os_version=13.600000&token=" + token + "&version_app=4.3.4";
  var dataremain = {
    url: 'https://apivtp.vietteltelecom.vn:6768/myviettel.php/getDataRemain',
    headers: {},
    body: body,
  };
  $.post(dataremain, function (error, response, data) {
    if (error) {
      //console.log('error');
    } else {
      //console.log(data);
      if (response.status == 200) {
        let obj = JSON.parse(data);
        if (obj["errorCode"] === "0") {
          var data = obj["data"][0];
          $.notify("Data Flow: " + data["pack_name"], "", "Remain: " + data["remain"] + "( ~" + Math.round(data["remain_mb"] / 1024) + " GB)\nExpiredate: " + data["expireDate"]);
        }
        else {
          $.notify("Data Flow token expired‼️", "", "Try to login again in app My Viettel");
        }
      }
    }
    $.done();
  });
}

function env() {
    const isRequest = typeof $request != "undefined";
    const isSurge = typeof $httpClient != "undefined";
    const isQuanX = typeof $task != "undefined";
    const notify = (title, subtitle, message) => {
        if (isQuanX) $notify(title, subtitle, message);
        if (isSurge) $notification.post(title, subtitle, message);
    };
    const write = (value, key) => {
        if (isQuanX) return $prefs.setValueForKey(value, key);
        if (isSurge) return $persistentStore.write(value, key);
    };
    const read = (key) => {
        if (isQuanX) return $prefs.valueForKey(key);
        if (isSurge) return $persistentStore.read(key);
    };
    const adapterStatus = (response) => {
        if (response) {
            if (response.status) {
                response["statusCode"] = response.status;
            } else if (response.statusCode) {
                response["status"] = response.statusCode;
            }
        }
        return response;
    };
    const get = (options, callback) => {
        if (isQuanX) {
            if (typeof options == "string")
                options = {
                    url: options,
                };
            options["method"] = "GET";
            $task.fetch(options).then(
                (response) => {
                    callback(null, adapterStatus(response), response.body);
                },
                (reason) => callback(reason.error, null, null)
            );
        }
        if (isSurge)
            $httpClient.get(options, (error, response, body) => {
                callback(error, adapterStatus(response), body);
            });
    };
    const post = (options, callback) => {
        if (isQuanX) {
            if (typeof options == "string")
                options = {
                    url: options,
                };
            options["method"] = "POST";
            $task.fetch(options).then(
                (response) => {
                    callback(null, adapterStatus(response), response.body);
                },
                (reason) => callback(reason.error, null, null)
            );
        }
        if (isSurge) {
            $httpClient.post(options, (error, response, body) => {
                callback(error, adapterStatus(response), body);
            });
        }
    };
    const done = (value = {}) => {
        if (isQuanX) isRequest ? $done(value) : null;
        if (isSurge) isRequest ? $done(value) : $done();
    };
    return {
        isRequest,
        notify,
        write,
        read,
        get,
        post,
        done,
    };
}