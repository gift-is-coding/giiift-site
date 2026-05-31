const RELEASE_BUCKET = "knowyou-releases";

function supabaseUpdateFeedURL(env) {
  if (env.KNOWYOU_UPDATE_FEED_URL) {
    return env.KNOWYOU_UPDATE_FEED_URL;
  }

  const configuredURL = env.KNOWYOU_SUPABASE_URL || "";
  const supabaseURL = configuredURL.replace(/\/+$/, "");
  if (!supabaseURL) {
    return null;
  }

  return `${supabaseURL}/storage/v1/object/public/${RELEASE_BUCKET}/update-feed/latest.json`;
}

export async function onRequestGet({ env }) {
  const feedURL = supabaseUpdateFeedURL(env);
  if (!feedURL) {
    return new Response("KnowYou update feed is not configured.", {
      status: 503,
    });
  }

  const response = await fetch(feedURL, {
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
