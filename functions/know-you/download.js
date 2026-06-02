const UPDATE_FEED_URL =
  "https://raw.githubusercontent.com/gift-is-coding/know-you-downloads/main/update-feed/latest.json";
const LATEST_RELEASE_API_URL =
  "https://api.github.com/repos/gift-is-coding/know-you-downloads/releases/latest";

function isChecksumAsset(item) {
  return item.name && item.name.endsWith(".sha256");
}

function findDownloadAsset(release) {
  return (release.assets || []).find(
    (item) =>
      item.name &&
      item.name.endsWith(".dmg") &&
      !isChecksumAsset(item) &&
      item.browser_download_url,
  );
}

async function latestReleaseDownloadURL() {
  const response = await fetch(LATEST_RELEASE_API_URL, {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "giiift-site-download-proxy",
    },
  });

  if (!response.ok) {
    return null;
  }

  const release = await response.json();
  return findDownloadAsset(release)?.browser_download_url || null;
}

async function redirectToLatestDownload() {
  const feedURL = new URL(UPDATE_FEED_URL);
  feedURL.searchParams.set("ts", Date.now().toString());

  const response = await fetch(feedURL.toString(), {
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "Cache-Control": "no-cache",
      "User-Agent": "giiift-site-download-proxy",
    },
  });

  if (!response.ok) {
    const fallbackURL = await latestReleaseDownloadURL();
    if (fallbackURL) {
      return Response.redirect(fallbackURL, 302);
    }
    return new Response("No downloadable Know You artifact found.", {
      status: 404,
    });
  }

  const update = await response.json();
  if (!update.downloadURL) {
    return new Response("No downloadable Know You artifact found.", {
      status: 404,
    });
  }

  return Response.redirect(update.downloadURL, 302);
}

export async function onRequestGet() {
  return redirectToLatestDownload();
}

export async function onRequestHead() {
  return redirectToLatestDownload();
}
