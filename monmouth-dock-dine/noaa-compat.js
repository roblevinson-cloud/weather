// NOAA Tides & Currents compatibility shim for Monmouth Dock & Dine.
// Harmonic prediction stations support 6-minute predictions. NOAA subordinate
// stations support high/low predictions only. The app historically requested
// interval=6 for every station, which made valid subordinate stations appear
// unavailable. This shim transparently retries those prediction requests with
// interval=hilo. app.js already interpolates between returned prediction points.
(() => {
  const nativeFetch = window.fetch.bind(window);
  const NOAA_HOST = 'api.tidesandcurrents.noaa.gov';

  window.fetch = async function dockDineFetch(input, init) {
    let url;
    try {
      const raw = typeof input === 'string' ? input : input && input.url;
      url = new URL(raw, window.location.href);
    } catch {
      return nativeFetch(input, init);
    }

    const isNoaaPrediction =
      url.hostname === NOAA_HOST &&
      url.pathname.includes('/api/prod/datagetter') &&
      url.searchParams.get('product') === 'predictions' &&
      url.searchParams.get('interval') === '6';

    if (!isNoaaPrediction) return nativeFetch(input, init);

    let primary;
    try {
      primary = await nativeFetch(input, init);
      if (primary.ok) {
        const probe = await primary.clone().json().catch(() => null);
        if (Array.isArray(probe?.predictions) && probe.predictions.length) {
          return primary;
        }
      }
    } catch {
      // Fall through to NOAA high/low retry below.
    }

    const fallbackUrl = new URL(url.toString());
    fallbackUrl.searchParams.set('interval', 'hilo');
    const fallback = await nativeFetch(fallbackUrl.toString(), init);

    if (!fallback.ok) return primary || fallback;

    const probe = await fallback.clone().json().catch(() => null);
    if (!Array.isArray(probe?.predictions) || !probe.predictions.length) {
      return primary || fallback;
    }

    return fallback;
  };
})();
