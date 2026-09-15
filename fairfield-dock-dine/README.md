# Fairfield County Dock & Dine

A boater-first Dock & Dine guide for Fairfield County, Connecticut, covering Greenwich through Stratford.

## Coverage

- Greenwich Harbor
- Stamford Harbor / Harbor Point
- Five Mile River / Rowayton
- Norwalk Harbor / South Norwalk
- Saugatuck River / Westport
- Black Rock Harbor / Bridgeport Harbor
- Housatonic River / Stratford

Initial build: September 14, 2026.

## Live tide behavior

The static site calls NOAA Tides & Currents directly from the browser. Each destination is assigned to a practical local prediction station. The site first requests 6-minute predictions. If the station is subordinate and NOAA will not return a 6-minute series, the code automatically retries official high/low predictions and creates an explicitly labeled interpolated curve for planning display.

The user selects an arrival date/time, boat draft, and desired under-keel clearance.

Where a defensible low-water baseline is available:

- estimated dock depth = published dock baseline + NOAA predicted tide relative to MLLW
- estimated approach depth = published approach baseline + NOAA predicted tide relative to MLLW
- controlling estimate = shallower of available dock and approach estimates

The site never silently substitutes approach depth for dockside depth. If no dock baseline is available, it shows tide and any separately sourced approach information without manufacturing a dock estimate.

## Verification standard

A restaurant is included only when a current restaurant, marina, hotel, or municipal source establishes a real customer/transient access path. Marina-access restaurants are labeled separately from direct restaurant docks.

Primary access sources include Delamar Greenwich Harbor Marina, Harbor Point Marinas, Rowayton Seafood, Harbor Lights, The Bridge at Saugatuck, The Whelk, Captain's Cove Seaport, Bridgeport Harbor Marina, Safe Harbor Stratford and Boardwalk Marina.

Depth baselines prefer official marina publications. Where official soundings are unavailable, current Waterway Guide / marina-directory values are used as labeled planning inputs. They are not hydrographic surveys.

## Navigation disclaimer

This is a planning aid, not a navigation product. Astronomical tide predictions are not observed water levels. Wind, barometric pressure, river flow, storms, dredging and shoaling can materially change actual depth. Use current NOAA ENC, Coast Pilot, USCG Local Notice to Mariners, active aids to navigation, marina instructions and the vessel's depth sounder.
