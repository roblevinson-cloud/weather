# Unified Dock & Dine

Canonical interface for the Fairfield County, Connecticut and Monmouth County, New Jersey boater dining guides.

## Canonical URL

`https://roblevinson-cloud.github.io/weather/dock-dine/`

Optional region filters:

- `?region=fairfield`
- `?region=monmouth`

## What is unified

- one destination map
- one search box
- one selected arrival date/time
- one boat draft input
- one desired under-keel-clearance input
- NOAA tide predictions with automatic high/low fallback for subordinate stations
- 24-hour tide charts for every destination
- tide-adjusted dock / approach depth estimates where defensible low-water baselines exist

The legacy Fairfield and Monmouth folders remain in the repository for their research ledgers and underlying source history, but their landing pages redirect to this interface.

## Trip Lab: Stamford ↔ Highlands beta

The first inter-area route optimizer is live inside the canonical interface. It currently supports Harbor Point, Stamford ↔ Highlands, New Jersey.

The Trip Lab:

- tests departures at 10-minute intervals across a user-selected window
- uses NOAA `currents_predictions` at Hell Gate (NYH1924), Brooklyn Bridge (NYH1920), Robbins Reef (NYH1915), and Highlands Bridge (NYH1933)
- requests harmonic current speed/direction predictions at 10-minute intervals
- projects each current vector onto the modeled vessel heading instead of simply adding or subtracting current speed
- iterates travel time by route leg so the current is evaluated at the time the boat is expected to reach that part of the route
- compares modeled trip time with the still-water trip at the selected cruise speed
- checks known departure and arrival low-water baselines against NOAA tide predictions and the selected draft + UKC
- penalizes departure windows that fail a known depth requirement
- plots trip duration versus departure time and draws the planning corridor on the shared map

The fixed planning corridor is Harbor Point → Throgs Neck → Hell Gate → Brooklyn Bridge → Robbins Reef → Verrazzano-Narrows → Sandy Hook → Highlands, reversed for the northbound trip.

### Important Trip Lab limitations

The Trip Lab is a planning model, not a route to steer. The current beta does not yet model western Long Island Sound current before Throgs Neck, wind/wave state, real-time current departures from harmonic predictions, traffic, security zones, bridge restrictions, local speed/no-wake rules, vessel handling, or avoidance routing. Route-current scaling between NOAA prediction stations is an engineering approximation intended to improve departure-time planning, not a hydrographic navigation product.

## Safety

This is a planning aid, not a navigation product. Predicted astronomical tide and tidal current can differ materially from observed conditions. Use current NOAA ENC, Coast Pilot, USCG notices, active aids to navigation, dockmaster instructions, local knowledge and the vessel's depth sounder.