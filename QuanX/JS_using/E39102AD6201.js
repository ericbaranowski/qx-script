
/**
 * @fileoverview Example to compose HTTP reqeuest
 * and handle the response.
 *
 */

const url = "http://conf.iapserver.com/config.php?i=6gk0oq0bq2h9cfg5kgbpiol5478ozz614244912065675318";
const method = "POST";
const headers = {"Field": "test-header-param"};
const data = {"info": "abc"};

const myRequest = {
    url: url,
    method: method, // Optional, default GET.
    headers: headers, // Optional.
    body: JSON.stringify(data) // Optional.
};

$task.fetch(myRequest).then(response => {
    // response.statusCode, response.headers, response.body
    console.log(response.body);
    $notify("Server VIP", "", response.body); // Success!
}, reason => {
    // reason.error
    $notify("Title", "Subtitle", reason.error); // Error!
});
