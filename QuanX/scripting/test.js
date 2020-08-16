var obj = JSON.parse($response.body);
obj.memberships = {
  endAt: 2546942400,
  id: "1",
  name: "普通会员",
  ownership: "temporary",
  startAt: 1597581821,
  usageType: "unlimited",
};
$done({ body: JSON.stringify(obj) });
