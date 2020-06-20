const lang = "en"
var lat_lon = "10.7457999,106.6855690"
var api = "d61d56e7025c803083cb4e4d4513d1a3"

const $nobyda = nobyda();
async function launch() {
    weather();
    $nobyda.end();
}
launch()

function weather() {
    let info = {
        url: "https://api.darksky.net/forecast/" + api + "/" + lat_lon + "?lang=" + lang + "&units=si&exclude=currently,minutely",  //?lang=en&units=si
        headers: {},
    }
    $nobyda.get(info, async function (error, response, data) {
        if (error) {
            console.log(error);
            $nobyda.notify("Dark Sky", lat_lon + 'bad connection', error);
        } else {
            var obj = JSON.parse(data);
            console.log(obj);
            var hour_summary = obj.hourly.summary;
            var icon_text = obj.hourly.icon;
            var icon = "❓"
            if (icon_text == "clear-day") icon = "☀️";
            if (icon_text == "partly-cloudy-day") icon = "🌤";
            if (icon_text == "cloudy") icon = "☁️";
            if (icon_text == "rain") icon = "🌧";
            if (icon_text == "snow") icon = "☃️";
            if (icon_text == "sleet") icon = "🌨";
            if (icon_text == "wind") icon = "🌬";
            if (icon_text == "fog") icon = "🌫";
            if (icon_text == "partly-cloudy-night") icon = "🌑";
            if (icon_text == "clear-night") icon = "🌑";
            var daily_prec_chance = obj.daily.data[0].precipProbability;
            var daily_maxtemp = obj.daily.data[0].temperatureMax;
            var daily_mintemp = obj.daily.data[0].temperatureMin;
            $nobyda.notify("Dark Sky", icon + " " +Math.round(daily_mintemp) + " - " + Math.round(daily_maxtemp) + "  ☔️ " + (Number(daily_prec_chance) * 100).toFixed(1)+ "%", hour_summary);        }
    });
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
    const post = (options, callback) => {
        if (isQuanX) {
            if (typeof options == "string") options = { url: options }
            options["method"] = "POST"
            $task.fetch(options).then(response => {
                response["status"] = response.statusCode
                callback(null, response, response.body)
            }, reason => callback(reason.error, null, null))
        }
        if (isSurge) $httpClient.post(options, callback)
    }
    const end = () => {
        if (isQuanX) isRequest ? $done({}) : ""
        if (isSurge) isRequest ? $done({}) : $done()
    }
    return { isRequest, isQuanX, isSurge, notify, write, read, post, end }
};