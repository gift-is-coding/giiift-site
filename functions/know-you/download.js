const RELEASE_BUCKET = "knowyou-releases";
const FALLBACK_DMG_PATH =
  "macos/v1.1.2-build305/KnowYou-1.1.2-305.dmg";
const FALLBACK_DMG_NAME = "KnowYou-1.1.2-305.dmg";

function supabasePublicURL(env, objectPath) {
  const configuredURL = env.KNOWYOU_SUPABASE_URL || "";
  const supabaseURL = configuredURL.replace(/\/+$/, "");
  if (!supabaseURL) {
    return null;
  }

  return `${supabaseURL}/storage/v1/object/public/${RELEASE_BUCKET}/${objectPath}`;
}

function updateFeedURL(env) {
  return (
    env.KNOWYOU_UPDATE_FEED_URL ||
    supabasePublicURL(env, "update-feed/latest.json")
  );
}

function fallbackDownloadURL(env) {
  const publicURL = supabasePublicURL(env, FALLBACK_DMG_PATH);
  if (!publicURL) {
    return null;
  }

  return `${publicURL}?download=${FALLBACK_DMG_NAME}`;
}

async function redirectToLatestDownload(env) {
  const feedURL = updateFeedURL(env);
  const fallbackURL = fallbackDownloadURL(env);
  if (!feedURL || !fallbackURL) {
    return new Response("KnowYou downloads are not configured.", {
      status: 503,
    });
  }

  const response = await fetch(feedURL, {
    headers: {
      Accept: "application/json",
      "User-Agent": "giiift-site-download-proxy",
    },
  });

  if (!response.ok) {
    return Response.redirect(fallbackURL, 302);
  }

  const update = await response.json();
  if (!update.downloadURL) {
    return new Response("No downloadable Know You artifact found.", {
      status: 404,
    });
  }

  return Response.redirect(update.downloadURL, 302);
}

export async function onRequestGet({ env }) {
  return redirectToLatestDownload(env);
}

export async function onRequestHead({ env }) {
  return redirectToLatestDownload(env);
}
