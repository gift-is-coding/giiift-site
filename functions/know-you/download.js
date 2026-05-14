const RELEASE_API_URL =
  "https://api.github.com/repos/gift-is-coding/know-you-downloads/releases/latest";
const FALLBACK_DOWNLOAD_URL =
  "https://github.com/gift-is-coding/know-you-downloads/releases/download/v1.0.4-build139/KnowYou-1.0.4-3.dmg";

function isChecksumAsset(item) {
  return item.name && item.name.endsWith(".sha256");
}

function findSingleAsset(release, extension) {
  return (release.assets || []).filter(
    (item) => item.name && item.name.endsWith(extension) && !isChecksumAsset(item),
  );
}

async function redirectToLatestDownload() {
  const response = await fetch(RELEASE_API_URL, {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "giiift-site-download-proxy",
    },
  });

  if (!response.ok) {
    return Response.redirect(FALLBACK_DOWNLOAD_URL, 302);
  }

  const release = await response.json();
  const dmgAssets = findSingleAsset(release, ".dmg");
  const zipAssets = findSingleAsset(release, ".zip");
  const preferredAssets = dmgAssets.length > 0 ? dmgAssets : zipAssets;
  const expectedType = dmgAssets.length > 0 ? "dmg" : "zip";

  if (preferredAssets.length !== 1) {
    return new Response(
      `Expected exactly one Know You ${expectedType} asset in the latest release, found ${preferredAssets.length}.`,
      {
        status: 409,
      },
    );
  }

  const [asset] = preferredAssets;

  if (!asset.browser_download_url) {
    return new Response("No downloadable Know You artifact found.", {
      status: 404,
    });
  }

  return Response.redirect(asset.browser_download_url, 302);
}

export async function onRequestGet() {
  return redirectToLatestDownload();
}

export async function onRequestHead() {
  return redirectToLatestDownload();
}
