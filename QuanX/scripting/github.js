let config = {
  username: "phd91105", 
  token: "AHFYIEVAHWN5ITNVWMEKES3A7OTAG", 
};

// load user prefs from box
const boxConfig = $persistentStore.read("github_private_repo");
if (boxConfig) {
  config = JSON.parse(boxConfig);
}

const username = $request.url.match(
  /https:\/\/(?:raw|gist)\.githubusercontent\.com\/([^\/]+)\//
)[1];
// rewrite headers for a specific user
if (username == config.username) {
  console.log(`ACCESSING PRIVATE REPO: ${$request.url}`);
  $done({ ...$request.headers, Authorization: `token ${config.token}` });
} else $done({});
