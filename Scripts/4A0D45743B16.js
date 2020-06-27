
/**
 * @fileoverview Example to compose HTTP reqeuest
 * and handle the response.
 *
 */

const url = "http://conf.iapserver.com/config.php?i=0liknzzpp7oinbd0q10g9mdm5k8ol0714483744471384145";
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
}, reason => {
    // reason.error
    $notify("Title", "Subtitle", reason.error); // Error!
});
