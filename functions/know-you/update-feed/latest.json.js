const UPDATE_FEED_URL =
  "https://raw.githubusercontent.com/gift-is-coding/know-you-downloads/main/update-feed/latest.json";

export async function onRequestGet({ env }) {
  const response = await fetch(UPDATE_FEED_URL, {
    headers: {
      Accept: "application/json",
      "User-Agent": "giiift-site-update-feed-proxy",
    },
  });

  if (!response.ok) {
    return new Response("KnowYou update feed is unavailable.", {
      status: 502,
    });
  }

  return new Response(response.body, {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, max-age=300",
    },
  });
}
