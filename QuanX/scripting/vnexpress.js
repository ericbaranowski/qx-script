var wurl = {
    url: "https://api-qtx.000webhostapp.com/vnexpress.php",
};
$task.fetch(wurl).then(
    (response) => {
        var obj = JSON.parse(response.body);
        $notify("⏰VN[E]XPRESS.NET", obj.elements[0].title, "📆 "+obj.elements[0].time+"\n"+obj.elements[0].content, { "open-url": obj.elements[0].link, "media-url": obj.elements[0].video });
    },
    (reason) => {
        $notify("False!", "", reason.error);
    }
);
