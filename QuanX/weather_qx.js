const lang = "vi"
var HoChiMinh = "10.7457999,106.6855690"
var LongAn = "10.6466139,106.3019494"
var api = "d61d56e7025c803083cb4e4d4513d1a3"

weather(HoChiMinh);
weather(LongAn);

function weather(location)
{
    var wurl = {
        url: "https://api.darksky.net/forecast/" + api + "/" + location + "?lang=" + lang + "&units=si&exclude=currently,minutely",
    };

    $task.fetch(wurl).then(response => {
        var obj = JSON.parse(response.body);
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

        if (location==HoChiMinh)
        {
            $notify("Quận 8 - Hồ Chí Minh" , icon + " " + Math.round(daily_mintemp) + "°C" + " - " + Math.round(daily_maxtemp) + "°C" + "  ☔️ " + (Number(daily_prec_chance) * 100).toFixed(1) + "%", hour_summary);
        }
        else if (location==LongAn)
        {
            $notify("Thủ Thừa - Long An" , icon + " " + Math.round(daily_mintemp) + "°C" + " - " + Math.round(daily_maxtemp) + "°C" + "  ☔️ " + (Number(daily_prec_chance) * 100).toFixed(1) + "%", hour_summary);
        }
    }, reason => {
    $notify("Dark Sky", lat_lon + 'bad connection', reason.error);
    });
}
