var obj = JSON.parse($response.body);
obj.data["subscriptions"] =   {
          "id": "d7207db0-6fb4-48e8-9dbd-56ea99dc1531",
          "status": "trial",
          "autorenew_enabled": true,
          "in_retry_billing": false,
          "expires_at": "2030-08-19T13:17:12.000Z",
          "cancelled_at": null,
          "retries_count": 0,
          "started_at": "2020-08-16T13:17:12.000Z",
          "unit": "year",
          "units_count": 1,
          "active_till": "2020-08-19T13:17:12.000Z",
          "product_id": "vt.free.sub.12m.3d.trial_2",
          "introductory_activated": true,
          "kind": "autorenewable"
        };
$done({ body: JSON.stringify(obj) });
