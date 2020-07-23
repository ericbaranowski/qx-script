const $ = new Env('⏰ Nhắc mưa')
$.weather_url = ""  
$.pre_hours = 24 
$.timeout = 2000
$.always_notify = false
$.rain_test = false
if ($.weather_url == "" && $.getdata('tlb_weather_url') != undefined && $.getdata('tlb_weather_url') != "") {
    $.weather_url = $.getdata('tlb_weather_url')
}
if ($.getdata('tlb_pre_hours') != undefined && $.getdata('tlb_pre_hours') != "") {
    $.pre_hours = $.getdata('tlb_pre_hours') * 1
    if ($.pre_hours > 48) {
        $.pre_hours = 48
        $.setdata(48, 'tlb_pre_hours')
    }
}
if ($.getdata('tlb_rain_timeout') != undefined && $.getdata('tlb_rain_timeout') != "") {
    $.timeout = $.getdata('tlb_rain_timeout') * 1
    if ($.timeout > 4000) {
        $.timeout = 4000
        $.setdata(4000, 'tlb_rain_timeout')
    }
}
if ($.getdata('tlb_always_notify') != undefined) {
    if ($.getdata('tlb_always_notify') == true || $.getdata('tlb_always_notify') == 'true')
        $.always_notify = true
    else if ($.getdata('tlb_always_notify') == false || $.getdata('tlb_always_notify') == 'false')
        $.always_notify = false
}
if ($.getdata('tlb_rain_test') != undefined) {
    if ($.getdata('tlb_rain_test') == true || $.getdata('tlb_rain_test') == 'true')
        $.rain_test = true
    else if ($.getdata('tlb_rain_test') == false || $.getdata('tlb_rain_test') == 'false')
        $.rain_test = false
}
!(async () => {
    $.log('', `🔔 ${$.name}, Khởi đầu!`, '')
    if (!$.rain_test) {
        $.msg($.name, "🚫Tạm dừng [Bấm lâu để xem hướng dẫn cụ thể] "," 😭 Thỉnh thoảng xảy ra sự cố hết thời gian yêu cầu. \ n🌧 Và điều này sẽ khiến quanx hoặc loon khởi động lại. Học sinh nên chuyển sang các kịch bản thời tiết khác. \ n🙁 Chúng tôi sẽ cố gắng tìm giao diện thời tiết ổn định trong tương lai. Nếu bạn cần, bạn có thể nhấp vào thông báo này để theo dõi github。", "https://github.com/toulanboy/scripts")
        return
    }
    if ($.weather_url == undefined || $.weather_url == "" || $.weather_url.match(/hourbyhour/) == undefined || $.weather_url.match(/^https:.*?/) == undefined) {
        $.msg($.name, "", "🚫Khởi động thất bại, vui lòng định cấu hình Weather_url, vui lòng đọc tệp js để biết quy trình cấu hình cụ thể.")
        $.done()
        return
    }
    await getw()

})()
.catch((e) => {
    $.log('', `❌ ${$.name}, Lý do thất bại: ${e}!`, '')
})
.finally(() => {
    $.log('', `🔔 ${$.name}, Kết thúc!`, ''), $.done()
    return
})
function random_num(min_num,max_num){ 
    switch(arguments.length){ 
        case 1: 
            return parseInt(Math.random()*min_num+1,10); 
        break; 
        case 2: 
            return parseInt(Math.random()*(max_num-min_num+1)+min_num,10); 
        break; 
            default: 
                return 0; 
            break; 
    } 
}
function getw() {
    return new Promise((resolve) => {
        agent_rand = `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_${random_num(11,15)}_${random_num(1,5)}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${random_num(70,83)}.0.${random_num(2000,4000)}.${random_num(1,200)} Safari/537.36`
        // console.log(agent_rand) 
        url = {
            url: $.weather_url,
            headers: {
                'user-agent':agent_rand,
            }
        }
        $.get(url, (error, response, data) => {
            if (error) {
                console.log("🚫Có một lỗi trong yêu cầu, như sau：")
                console.log(error)
                resolve()
                throw new Error(error)
            }
            body = response.body
            city_name = body.match(/locationCard">.*?locationName--.*?>(.*?)</)
            if (city_name != undefined) {
                console.log(city_name[1])
                $.city_name = city_name[1]
            }
            else {
                console.log("🚫 Không thể lấy tên thành phố")
                $.city_name = "🚫 Không thể lấy tên thành phố"
            }
            var is_tomorrow = false
            var is_notify = false
            var time_prefix = ""
            var count = 1
            $.message = ""
            const reg_time = /daypartName.*?>(\d+:\d+)/g
            const reg_tmp = /TemperatureValue.*?DetailsSummary--tempValue.*?>(.*?)</g
            const reg_rain_p = /PercentageValue">(.*?)</g
            
            while ((r = reg_time.exec(body)) && (count <= $.pre_hours)) {
                time_point = r[1]
                tmp = reg_tmp.exec(body)[1]
                rain_p = reg_rain_p.exec(body)[1] 
                if (count == 1) {
                    $.message += `🌈 Nhiệt độ hiện tại ${tmp}，Xác suất mưa là ${rain_p}\n⬇️Xác suất cao có mưa trong ${$.pre_hours} giờ tiếp theo: \n`
                }
                time_point = time_prefix + time_point
                if (!is_tomorrow && parseInt(r[1].replace(/:\d+/, "")) == 23) {
                    time_prefix = "Ngày mai "
                    is_tomorrow = true
                }
                else if (is_tomorrow && parseInt(r[1].replace(/:\d+/, "")) == 23) {
                    time_prefix = "mua"
                }
                console.log(`${time_point} : Nhiệt độ ${tmp}，Xác suất mưa ${rain_p}`)
                if (parseInt(rain_p.replace(/°/, "")) >= 50) {
                    is_notify = true
                    $.message += `🌧 ${time_point} : Nhiệt độ ${tmp}，Xác suất mưa ${rain_p}\n`
                }
                count++
            }
            if ($.always_notify || is_notify){
                if(!is_notify) $.message += "🌟 Xác suất mưa hiện tại không lớn hơn 50%\n"
                $.msg(`${$.name}: ${$.city_name}`, ``, $.message)
            }
            else {
                console.log("🌟 Xác suất mưa hiện tại không lớn hơn 50%, vì vậy sẽ không có thông báo hệ thống nào bật lên")
            }
            resolve()
        })
        setTimeout(() => {
                console.log("🚨 Yêu cầu đã đạt đến giới hạn thời gian tối đa và nó sẽ tự động thoát.")
                resolve()
            }, $.timeout);
    })
}

function Env(s) {
    this.name = s, this.data = null, this.logs = [], this.isSurge = (() => "undefined" != typeof $httpClient), this.isQuanX = (() => "undefined" != typeof $task), this.isLoon = (() => "undefined" != typeof $loon),this.isNode = (() => "undefined" != typeof module && !!module.exports), this.log = ((...s) => {
        this.logs = [...this.logs, ...s], s ? console.log(s.join("\n")) : console.log(this.logs.join("\n"))
    }), this.msg = ((s = this.name, t = "", i = "", opts="") => {
        this.isLoon() && $notification.post(s, t, i, opts), this.isSurge() && !this.isLoon() && $notification.post(s, t, i), this.isQuanX() && $notify(s, t, i, { "open-url": opts});
        const e = ["", "============== console log =============="];
        s && e.push(s), t && e.push(t), i && e.push(i), console.log(e.join("\n"))
    }), this.getdata = (s => {
        if (this.isSurge()) return $persistentStore.read(s);
        if (this.isQuanX()) return $prefs.valueForKey(s);
        if (this.isNode()) {
            const t = "box.dat";
            return this.fs = this.fs ? this.fs : require("fs"), this.fs.existsSync(t) ? (this.data = JSON.parse(this.fs.readFileSync(t)), this.data[s]) : null
        }
    }), this.setdata = ((s, t) => {
        if (this.isSurge()) return $persistentStore.write(s, t);
        if (this.isQuanX()) return $prefs.setValueForKey(s, t);
        if (this.isNode()) {
            const i = "box.dat";
            return this.fs = this.fs ? this.fs : require("fs"), !!this.fs.existsSync(i) && (this.data = JSON.parse(this.fs.readFileSync(i)), this.data[t] = s, this.fs.writeFileSync(i, JSON.stringify(this.data)), !0)
        }
    }), this.wait = ((s, t = s) => i => setTimeout(() => i(), Math.floor(Math.random() * (t - s + 1) + s))), this.get = ((s, t) => this.send(s, "GET", t)), this.post = ((s, t) => this.send(s, "POST", t)), this.send = ((s, t, i) => {
        if (this.isSurge()) {
            const e = "POST" == t ? $httpClient.post : $httpClient.get;
            e(s, (s, t, e) => {
                t && (t.body = e, t.statusCode = t.status), i(s, t, e)
            })
        }
        this.isQuanX() && (s.method = t, $task.fetch(s).then(s => {
            s.status = s.statusCode, i(null, s, s.body)
        }, s => i(s.error, s, s))), this.isNode() && (this.request = this.request ? this.request : require("request"), s.method = t, s.gzip = !0, this.request(s, (s, t, e) => {
            t && (t.status = t.statusCode), i(null, t, e)
        }))
    }), this.done = ((s = {}) => this.isNode() ? null : $done(s))
}