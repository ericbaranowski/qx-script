
const $ = API("caiyun");
$.write("", "weather");
$.write("", "address");

const ERR = MYERR();
const display_location = JSON.parse($.read("display_location") || "false");

if (typeof $request !== 'undefined') {
  // get location from request url
  const url = $request.url;
  const res = url.match(/weather\/.*?\/(.*)\/(.*)\?/);
  if (res === null) {
    $.notify("[Caiyun weather]", "❌ Regular expression matching error", `🥬 Can't get fromURL: ${url}Get location.`);
    $.done({ body: $request.body });
  }
  location = {
    latitude: res[1],
    longitude: res[2]
  }
  if (!$.read("location")) {
    $.notify("[Caiyun weather]", "", "🎉🎉🎉 Get positioning successfully.");
  }
  if (display_location) {
    $.info(`Successfully get current location: latitude ${location.latitude} 经度 ${location.longitude}`);
  }
  
  $.write(res[1], "#latitude");
  $.write(res[2], "#longitude");

  $.write(location, "location");
  $.done({ body: $request.body });
} else {
  // this is a task
  !(async () => {
    if (!$.read("token")) {
      // no token found
      throw new ERR.TokenError("❌ Token not found");
    } else if (!$.read("location")) {
      // no location
      $.notify("[Caiyun weather]", "❌ No location found", "🤖 You may not set MITM correctly, please check if the rewrite is successful.");
    } else {
      await scheduler();
    }
  })().catch((err) => {
    if (err instanceof ERR.TokenError)
      $.notify("[Caiyun weather]", err.message, "🤖 As API Token is time-sensitive, please go to\nhttps://t.me/cool_scripts\nGet the latest token.", {
        "open-url": "https://t.me/cool_scripts"
      });
    else
      $.notify("[Caiyun weather]", "❌ An error occurred", err.message);
  }).finally($.done());
}

async function scheduler() {
  const now = new Date();
  $.log(`Scheduler activated at ${now.getMonth() + 1}month${now.getDate()}day${now.getHours()}Time${now.getMinutes()}Minute`);
  await query();
  weatherAlert();
  realtimeWeather();
  // hourlyForcast();
  // dailyForcast();

}

async function query() {
  const now = new Date();
  // query API
  const url = `https://api.caiyunapp.com/v2.5/${$.read("token").caiyun}/${$.read("location").longitude},${$.read("location").latitude}/weather?lang=vi_VN&dailystart=0&hourlysteps=384&dailysteps=16&alert=true`;

  $.log("Query weather...");

  const weather = await $.get({
    url,
    headers: {
      'User-Agent': 'ColorfulCloudsPro/5.0.10 (iPhone; iOS 14.0; Scale/3.00)'
    }
  }).then(resp => {
    const body = JSON.parse(resp.body);
    if (body.status === 'failed') {
      throw new Error(body.error);
    }
    return body;
  }).catch(err => {
    throw err;
  });

  $.log("Query location...");
  await $.wait(Math.random() * 2000);
  const address =
    await $
      .get(`https://apis.map.qq.com/ws/geocoder/v1/?key=${$.read("token").tencent}&location=${$.read("location").latitude},${$.read("location").longitude}`)
      .then(resp => {
        const body = JSON.parse(resp.body);
        if (body.status !== 0) {
          throw new ERR.TokenError("❌ Tencent map token error");
        }
        return body.result.address_component;
      }).catch(err => {
        throw err;
      });

  $.weather = weather;

  if (display_location == true) {
    $.info(JSON.stringify(address));
  }
  $.address = address;
}

function weatherAlert() {
  const data = $.weather.result.alert;
  const address = $.address;
  const alerted = $.read("alerted") || [];

  if (data.status === 'ok') {
    data.content.forEach(alert => {
      if (alerted.indexOf(alert.alertId) === -1) {
        $.notify(
          `[Caiyun weather] ${address.city} ${address.district} ${address.street}`, alert.title, alert.description
        );
        alerted.push(alert.alertId);
        if (alerted.length > 10) {
          alerted.shift();
        }
        $.write(alerted, "alerted");
      }
    });
  }
}

function realtimeWeather() {
  const data = $.weather.result;
  const address = $.address;

  const alert = data.alert;
  const alertInfo = alert.content.length == 0 ? "" : alert.content.reduce((acc, curr) => {
    if (curr.status === 'Early warning') {
      return acc + "\n" + mapAlertCode(curr.code) + "Warning";
    } else {
      return acc;
    }
  }, "[Warning]") + "\n\n";

  const realtime = data.realtime;
  const keypoint = data.forecast_keypoint;

  const hourly = data.hourly;

  let hourlySkycon = "[Next 3 hours]\n";
  for (let i = 0; i < 3; i++) {
    const skycon = hourly.skycon[i];
    const dt = new Date(skycon.datetime);
    const now = dt.getHours() + 1;
    dt.setHours(dt.getHours() + 1)
    hourlySkycon += `${now}-${dt.getHours() + 1}h ${mapSkycon(skycon.value)[0]}` + (i == 2 ? "" : "\n")
  }

  $.notify(
    `[Caiyun weather] ${address.street} ${address.district} ${address.city}`,
    `${mapSkycon(realtime.skycon)[0]} ${realtime.temperature} ℃, 🌤 Air quality ${realtime.air_quality.description.chn}`,
    `${keypoint}
🌡 Experience ${realtime.life_index.comfort.desc} ${realtime.apparent_temperature}℃
💧 Humidity ${(realtime.humidity * 100).toFixed(0)}%
🌞 Ultraviolet rays ${realtime.life_index.ultraviolet.desc} 
💨 Wind force ${mapWind(realtime.wind.speed, realtime.wind.direction)}

${alertInfo}${hourlySkycon}
`,
    {
      "media-url": `${mapSkycon(realtime.skycon)[1]}`
    }
  );
}

function dailyForcast() {
}

function mapAlertCode(code) {
  const names = {
    "01": "🌪 Typhoon",
    "02": "⛈ torrential rain",
    "03": "❄️ Blizzard",
    "04": "❄ Cold Wave",
    "05": "💨 Gale",
    "06": "💨 Sandstorm",
    "07": "☄️ High temperature",
    "08": "☄️ Drought",
    "09": "⚡️ Thunder",
    "10": "💥 Hail",
    "11": "❄️ Frost",
    "12": "💨 Heavy fog",
    "13": "💨 Haze",
    "14": "❄️ The road is icy",
    "15": "🔥 Forest Fire",
    "16": "⛈ Thunderstorm and Gale"
  };

  const intensity = {
    "01": "Blue",
    "02": "Yellow",
    "03": "Orange",
    "04": "Red"
  };

  const res = code.match(/(\d{2})(\d{2})/);
  return `${names[res[1]]}${intensity[res[2]]}`
}

function mapWind(speed, direction) {
  let description = "";
  if (speed < 1) {
    description = "No Wind";
  } else if (speed <= 5) {
    description = "Level 1 Fresh Breeze";
  } else if (speed <= 11) {
    description = "Level 2 Breeze";
  } else if (speed <= 19) {
    description = "Level 3 leaves swing";
  } else if (speed <= 28) {
    description = "Level 4 branches shaking";
  } else if (speed <= 38) {
    description = "Level 5 strong wind";
  } else if (speed <= 49) {
    description = "Level 6 strong wind";
  } else if (speed <= 61) {
    description = "Level 7 wind is super strong";
  } else if (speed <= 74) {
    description = "Level 8 Sturdy Wind";
  } else if (speed <= 88) {
    description = "Level 9 Screaming Wind";
  } else {
    description = ">level 9 super strong wind";
  }
  return description;
}

function mapSkycon(skycon) {
  const map = {
    "CLEAR_DAY": ["☀️ Sunny day", "https://github.com/Peng-YM/QuanX/blob/master/assets/caiyun/CLEAR_DAY.mp4?raw=true"],
    "CLEAR_NIGHT": ["✨ Clear night"],
    "PARTLY_CLOUDY_DAY": ["⛅️ Cloudy daytime", "https://github.com/Peng-YM/QuanX/blob/master/assets/caiyun/CLOUDY_DAY.mp4?raw=true"],
    "PARTLY_CLOUDY_NIGHT": ["☁️ Cloudy at night"],
    "CLOUDY": ["☁️ yin"],
    "LIGHT_HAZE": ["😤 Slight haze"],
    "MODERATE_HAZE": ["😤 Moderate Haze"],
    "HEAVY_HAZE": ["😤 Severe Haze"],
    "LIGHT_RAIN": ["💧 Light rain", "https://github.com/Peng-YM/QuanX/blob/master/assets/caiyun/RAIN.mp4?raw=true"],
    "MODERATE_RAIN": ["💦 Moderate rain", "https://github.com/Peng-YM/QuanX/blob/master/assets/caiyun/RAIN.mp4?raw=true"],
    "HEAVY_RAIN": ["🌧 heavy rain", "https://github.com/Peng-YM/QuanX/blob/master/assets/caiyun/HEAVY_RAIN.mp4?raw=true"],
    "STORM_RAIN": ["⛈ rainstorm", "https://github.com/Peng-YM/QuanX/blob/master/assets/caiyun/HEAVY_RAIN.mp4?raw=true"],
    "LIGHT_SNOW": ["🌨 Koyuki"],
    "MODERATE_SNOW": ["❄️ Zhongxue"],
    "HEAVY_SNOW": ["☃️ Heavy snow"],
    "STORM_SNOW": ["⛄️Blizzard"],
    "DUST": ["💨Floating dust"],
    "SAND": ["💨 Sand dust"],
    "WIND": ["🌪 Gale"]
  }
  return map[skycon];
}

function mapPrecipitation(intensity) {
  if (0.031 < intensity && intensity < 0.25) {
    return "LIGHT";
  } else if (intensity < 0.35) {
    return "MODERATE";
  } else if (intensity < 0.48) {
    return "HEADY";
  } else if (intensity >= 0.48) {
    return "STORM";
  }
}

function mapIntensity(breakpoints) {

}

/************************** ERROR *********************************/
function MYERR() {
  class TokenError extends Error {
    constructor(message) {
      super(message);
      this.name = "TokenError";
    }
  }

  return {
    TokenError
  }
}

// prettier-ignore
/*********************************** API *************************************/
function API(t = "untitled", s = !1) { return new class { constructor(t, s) { this.name = t, this.debug = s, this.isQX = "undefined" != typeof $task, this.isLoon = "undefined" != typeof $loon, this.isSurge = "undefined" != typeof $httpClient && !this.isLoon, this.isNode = "function" == typeof require, this.isJSBox = this.isNode && "undefined" != typeof $jsbox, this.node = (() => this.isNode ? { request: "undefined" != typeof $request ? void 0 : require("request"), fs: require("fs") } : null)(), this.cache = this.initCache(), this.log(`INITIAL CACHE:\n${JSON.stringify(this.cache)}`), Promise.prototype.delay = function (t) { return this.then(function (s) { return ((t, s) => new Promise(function (e) { setTimeout(e.bind(null, s), t) }))(t, s) }) } } get(t) { return this.isQX ? ("string" == typeof t && (t = { url: t, method: "GET" }), $task.fetch(t)) : new Promise((s, e) => { this.isLoon || this.isSurge ? $httpClient.get(t, (t, i, o) => { t ? e(t) : s({ status: i.status, headers: i.headers, body: o }) }) : this.node.request(t, (t, i, o) => { t ? e(t) : s({ ...i, status: i.statusCode, body: o }) }) }) } post(t) { return this.isQX ? ("string" == typeof t && (t = { url: t }), t.method = "POST", $task.fetch(t)) : new Promise((s, e) => { this.isLoon || this.isSurge ? $httpClient.post(t, (t, i, o) => { t ? e(t) : s({ status: i.status, headers: i.headers, body: o }) }) : this.node.request.post(t, (t, i, o) => { t ? e(t) : s({ ...i, status: i.statusCode, body: o }) }) }) } initCache() { if (this.isQX) return JSON.parse($prefs.valueForKey(this.name) || "{}"); if (this.isLoon || this.isSurge) return JSON.parse($persistentStore.read(this.name) || "{}"); if (this.isNode) { const t = `${this.name}.json`; return this.node.fs.existsSync(t) ? JSON.parse(this.node.fs.readFileSync(`${this.name}.json`)) : (this.node.fs.writeFileSync(t, JSON.stringify({}), { flag: "wx" }, t => console.log(t)), {}) } } persistCache() { const t = JSON.stringify(this.cache); this.log(`FLUSHING DATA:\n${t}`), this.isQX && $prefs.setValueForKey(t, this.name), (this.isLoon || this.isSurge) && $persistentStore.write(t, this.name), this.isNode && this.node.fs.writeFileSync(`${this.name}.json`, t, { flag: "w" }, t => console.log(t)) } write(t, s) { this.log(`SET ${s} = ${JSON.stringify(t)}`), this.cache[s] = t, this.persistCache() } read(t) { return this.log(`READ ${t} ==> ${JSON.stringify(this.cache[t])}`), this.cache[t] } delete(t) { this.log(`DELETE ${t}`), delete this.cache[t], this.persistCache() } notify(t, s, e, i) { const o = "string" == typeof i ? i : void 0, n = e + (null == o ? "" : `\n${o}`); this.isQX && (void 0 !== o ? $notify(t, s, e, { "open-url": o }) : $notify(t, s, e, i)), this.isSurge && $notification.post(t, s, n), this.isLoon && $notification.post(t, s, e), this.isNode && (this.isJSBox ? require("push").schedule({ title: t, body: s ? s + "\n" + e : e }) : console.log(`${t}\n${s}\n${n}\n\n`)) } log(t) { this.debug && console.log(t) } info(t) { console.log(t) } error(t) { console.log("ERROR: " + t) } wait(t) { return new Promise(s => setTimeout(s, t)) } done(t = {}) { this.isQX || this.isLoon || this.isSurge ? $done(t) : this.isNode && !this.isJSBox && "undefined" != typeof $context && ($context.headers = t.headers, $context.statusCode = t.statusCode, $context.body = t.body) } }(t, s) }
/*****************************************************************************/
