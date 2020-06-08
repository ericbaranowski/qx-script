/*https://sapi.m.zing.vn/lbk/themes/ios/get-detail-theme*/

var hcsavn = JSON.parse($response.body);

hcsavn.data.price = 0

$done({body: JSON.stringify(hcsavn)});