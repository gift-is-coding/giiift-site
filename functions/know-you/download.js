export async function onRequestGet() {
  const apiUrl =
    "https://api.github.com/repos/gift-is-coding/know-you-downloads/releases/latest";

  const response = await fetch(apiUrl, {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "giiift-site-download-proxy",
    },
  });

  if (!response.ok) {
    return new Response("Failed to resolve latest Know You release.", {
      status: 502,
    });
  }

  const release = await response.json();
  const zipAssets = (release.assets || []).filter(
    (item) => item.name && item.name.endsWith(".zip") && !item.name.endsWith(".zip.sha256"),
  );

  if (zipAssets.length !== 1) {
    return new Response(
      `Expected exactly one Know You zip asset in the latest release, found ${zipAssets.length}.`,
      {
        status: 409,
      },
    );
  }

  const [asset] = zipAssets;

  if (!asset.browser_download_url) {
    return new Response("No downloadable Know You artifact found.", {
      status: 404,
    });
  }

  return Response.redirect(asset.browser_download_url, 302);
}
