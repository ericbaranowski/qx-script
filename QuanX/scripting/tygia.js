var wurl = {
  url: "https://tygia.com/json.php?ran=0&rate=0&gold=1&bank=VIETCOM&date=now",
};
tygia();
function tygia() {
  $task.fetch(wurl).then((response) => {
    var obj = JSON.parse(response.body);
    var updatetime = obj.golds[0].updated;
    var brand = obj.golds[0].value[38].brand;
    var usdbuy = obj.golds[0].value[37].buy;
    var usdsell = obj.golds[0].value[37].sell;
    var sjcbuy = obj.golds[0].value[4].buy;
    var sjcsell = obj.golds[0].value[4].sell;
    var dojibuy = obj.golds[0].value[27].buy;
    var dojisell = obj.golds[0].value[27].sell;

    $notify(
      "Tỷ giá - " + brand,
      "Cập nhật lúc: " + updatetime,
      "[USD] " +
        "Mua vào: " +
        usdbuy.replace(".00", "") +
        " - Bán ra: " +
        usdsell.replace(".00", "") +
        "" +
        "\n[SJC ] " +
        "Mua vào: " +
        sjcbuy.replace(".00", ",000") +
        " - Bán ra: " +
        sjcsell.replace(".00", ",000") +
        "\n[DOJI] " +
        "Mua vào: " +
        dojibuy.replace(".00", ",000") +
        " - Bán ra: " +
        dojisell.replace(".00", ",000")
    );
  });
}
