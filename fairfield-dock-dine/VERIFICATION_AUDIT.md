# Fairfield County Dock & Dine — Verification Audit

Research refresh: September 14, 2026.

This ledger separates **access verification** from **depth verification**. A restaurant can have verified boat access while its exact dockside sounding remains unknown.

| Destination | Access status | Access evidence | Low-water planning baseline | Baseline confidence |
|---|---|---|---|---|
| L'escale / Delamar Greenwich Harbor | Direct marina / restaurant access | Delamar Greenwich Harbor Marina official marina page | 9 ft approach / 8 ft dockside (Waterway Guide) | Medium |
| Prime, Stamford | Harbor Point West Dock & Dine | Harbor Point Marinas official Dock & Dine list | 12 ft approach / 8 ft dockside (Waterway Guide) | Medium |
| The Wheel, Stamford | Harbor Point Dock & Dine | Harbor Point Marinas official Dock & Dine list | 10 ft approach / 6 ft MLW dock depth (Marinas.com) | Medium |
| Fortina, Stamford | Harbor Point North Dock & Dine | Harbor Point Marinas official Dock & Dine list | 10 ft approach / 6 ft MLW dock depth (Marinas.com) | Medium |
| Sign of the Whale, Stamford | Harbor Point North Dock & Dine | Harbor Point Marinas official Dock & Dine list | 10 ft approach / 6 ft MLW dock depth (Marinas.com) | Medium |
| Bareburger, Stamford | Harbor Point North Dock & Dine | Harbor Point Marinas official Dock & Dine list | 10 ft approach / 6 ft MLW dock depth (Marinas.com) | Medium |
| Rowayton Seafood | Direct restaurant slips, reservation required | Rowayton Seafood official Dock page | Restaurant-dock sounding not published; conservative local approach context only | Low |
| Harbor Lights, Norwalk | Direct customer dock | Harbor Lights official site explicitly welcomes boat arrivals | No defensible dock baseline located | Unknown |
| Sunset Grille / Norwalk Cove | Marina-access dining | Norwalk Cove Marina / on-site restaurant | 9 ft approach / 9 ft dockside (Waterway Guide) | Medium |
| SoNo Seaport Seafood | Municipal visitor-dock access / short walk | City of Norwalk Visitor's Docks | 12 ft approach / 8 ft dockside at municipal visitor docks (Waterway Guide) | Medium |
| The Bridge at Saugatuck | 8 private restaurant slips | The Bridge official Dock & Dine page | Restaurant dock unknown; NOAA Coast Pilot reports severe shoaling and ~1 ft controlling-depth warning farther upriver | Low / conservative |
| The Whelk | 3 customer slips, boats to 33 ft | The Whelk official contact page | Restaurant dock unknown; same conservative Saugatuck controlling-depth warning | Low / conservative |
| Captain's Cove Seaport | Transient marina + on-site restaurant | Captain's Cove official marina and restaurant pages | 18 ft approach / 13 ft dockside (Waterway Guide) | Medium |
| Boca Oyster Bar | Bridgeport Harbor Marina Dock & Dine | Bridgeport Harbor Marina official Dock & Dine page | 25 ft approach / 12 ft dockside (Waterway Guide) | Medium |
| Outriggers | Safe Harbor Stratford transient access + on-site restaurant | Safe Harbor Stratford official page | 15 ft approach / 12 ft dockside (Waterway Guide); 8 ft transient-draft planning ceiling | Medium |
| Joey C's Boathouse | Boardwalk Marina on-site dining | Boardwalk Marina official page | 13 ft approach / 12 ft dockside (Waterway Guide) | Medium |

## NOAA stations

- 8469549 — Cos Cob Harbor / Greenwich (subordinate)
- 8469198 — Stamford Harbor (harmonic)
- 8468609 — Rowayton / Five Mile River (subordinate)
- 8468448 — South Norwalk (harmonic)
- 8468191 — Saugatuck River (harmonic)
- 8467373 — Black Rock Harbor (harmonic)
- 8467150 — Bridgeport (harmonic)
- 8466797 — Stratford / I-95 Bridge (subordinate)

The code does not hard-code the harmonic/subordinate behavior. It tries NOAA's 6-minute prediction series and automatically retries `hilo` if the first request is unsupported or empty.

## Important interpretation

A published marina dock depth is not a guarantee of the assigned transient slip, and an approach baseline is not a restaurant-dock sounding. All estimated depths are **astronomical-tide planning estimates**. Confirm current conditions with the dockmaster and use the vessel's depth sounder.
