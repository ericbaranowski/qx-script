let config = {
  username: "phd91105", 
  token: "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", 
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
