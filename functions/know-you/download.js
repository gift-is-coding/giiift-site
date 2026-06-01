const UPDATE_FEED_URL =
  "https://raw.githubusercontent.com/gift-is-coding/know-you-downloads/main/update-feed/latest.json";
const FALLBACK_DOWNLOAD_URL =
  "https://github.com/gift-is-coding/know-you-downloads/releases/download/v1.2.0-build315/KnowYou-1.2.0-315.dmg";

async function redirectToLatestDownload() {
  const response = await fetch(UPDATE_FEED_URL, {
    headers: {
      Accept: "application/json",
      "User-Agent": "giiift-site-download-proxy",
    },
  });

  if (!response.ok) {
    return Response.redirect(FALLBACK_DOWNLOAD_URL, 302);
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
