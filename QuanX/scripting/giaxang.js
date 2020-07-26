var wurl = {
  url: "https://api-qtx.000webhostapp.com/giaxang.php",
};
var today = new Date();

Giaxang();

function Giaxang() {
  $task.fetch(wurl).then(
    (response) => {
      var obj = JSON.parse(response.body);
      $notify(
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
        obj.elements[3].title +
        ": " +
        obj.elements[3].subtitle
      );
    },
    (reason) => {
      $notify("False!", "", reason.error);
    }
  );
}

function addZero(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}
