var $ = env();
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
Giaxang();
var wurl = {
  url: "https://api-qtx.000webhostapp.com/giaxang.php",
};
var today = new Date();
function Giaxang() {
  $.get(wurl).then(
    (response) => {
      var obj = JSON.parse(response.body);
      $.notify(
        "Giá xăng 🇻🇳 " +
        addZero(today.getDate()) +
        "/" +
        addZero(today.getMonth() + 1) +
        "/" +
        today.getFullYear(),
        "",
        obj.elements[0].title +
        ": " +
        obj.elements[0].subtitle +
        "\n" +
        obj.elements[1].title +
        ": " +
        obj.elements[1].subtitle +
        "\n" +
        obj.elements[2].title +
        ": " +
        obj.elements[2].subtitle
      );
    },
    (reason) => {
      $.notify("False!", "", reason.error);
    }
  );
}
function addZero(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}
