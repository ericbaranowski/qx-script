/*
Shoppe Check in Get Cookie.
The following URL check in once
https://shopee.vn

http-request ^https:\/\/shopee\.vn\/me\/setting max-size=0,script-path=shopee_getcookie.js

MITM = shopee.vn
*/
var $nobyda = nobyda();
var date = new Date()
if ($nobyda.isRequest) {
  GetCookie()
/*} else {
  checkin()*/
}
function GetCookie() {
if ($request.headers['Cookie']) {
    var headerSP = $request.headers['Cookie'];
    var cookie = $persistentStore.write(headerSP, "CookieSP");
    if (!cookie){
      $nobyda.notify("Shopee Cookie lỗi‼️", "", "Đăng nhập lại")
    } else {
      $nobyda.notify("Shopee  Cookie done 🎉", "", "")
    }
  } else {
    $nobyda.notify("Shopee lỗi đọc cookiee‼️", "", "Đăng nhập lại")
  }
  $nobyda.done();
}

function nobyda() {
    const isRequest = typeof $request != "undefined"
    const isSurge = typeof $httpClient != "undefined"
    const isQuanX = typeof $task != "undefined"
    const notify = (title, subtitle, message) => {
      if (isQuanX) $notify(title, subtitle, message)
      if (isSurge) $notification.post(title, subtitle, message)
    }
    const write = (value, key) => {
      if (isQuanX) return $prefs.setValueForKey(value, key)
      if (isSurge) return $persistentStore.write(value, key)
    }
    const read = (key) => {
      if (isQuanX) return $prefs.valueForKey(key)
      if (isSurge) return $persistentStore.read(key)
    }
    const adapterStatus = (response) => {
      if (response) {
        if (response.status) {
          response["statusCode"] = response.status
        } else if (response.statusCode) {
          response["status"] = response.statusCode
        }
      }
      return response
    }
    const get = (options, callback) => {
      if (isQuanX) {
        if (typeof options == "string") options = {
          url: options
        }
        options["method"] = "GET"
        $task.fetch(options).then(response => {
          callback(null, adapterStatus(response), response.body)
        }, reason => callback(reason.error, null, null))
      }
      if (isSurge) $httpClient.get(options, (error, response, body) => {
        callback(error, adapterStatus(response), body)
      })
    }
    const done = (value = {}) => {
      if (isQuanX) isRequest ? $done(value) : null
      if (isSurge) isRequest ? $done(value) : $done()
    }
    return {
      isRequest,
      notify,
      write,
      read,
      get,
      done
    }
  };

