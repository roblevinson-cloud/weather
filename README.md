# Gauge Log

A Precip-style rain & snow dashboard for Darien, CT and Park City, UT. One static HTML file, no backend, no API keys. Data comes live from the free [Open-Meteo](https://open-meteo.com/) APIs:

- **Recent (last 31 days + last 24 hours):** NOAA model analysis via the forecast API
- **History (1940–present):** ERA5 reanalysis via the archive API
- 1991–2020 monthly normals and long-run averages are computed in the browser
- History is cached in localStorage and refreshed once per day

## Host it on GitHub Pages

1. Create a new repository (e.g. `gauge-log`) and upload `index.html` and this `README.md`.
2. In the repo: **Settings → Pages → Source: Deploy from a branch → Branch: main / (root) → Save**.
3. After a minute your dashboard is live at `https://<your-username>.github.io/gauge-log/`.

Every visit pulls fresh data — nothing to redeploy.

## Run it locally

Just open `index.html` in a browser. That's it.

## Customize

- **Locations:** edit the `LOCS` array at the top of the `<script>` block (name, lat, lon, caption).
- **History start:** change `HIST_START` (Open-Meteo archive goes back to 1940).
- **Normals window:** change `NORM_Y0` / `NORM_Y1`.

## Notes on accuracy

Open-Meteo values are gridded estimates (~1–10 km cells), so they behave like a "virtual gauge" — usually close to, but not identical to, a physical gauge. For official station records to cross-check (Stamford 5N / Norwalk for Darien; Park City–area coop stations), use NOAA NCEI Climate Data Online or NWS NOWData. Park City snowfall from ERA5 will read lower than resort/SNOTEL numbers at elevation — the grid cell averages over terrain.
