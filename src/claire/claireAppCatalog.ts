// Aireon suite catalog — lets Claire recommend the right tool when a
// user's need is better served by another app in the suite.
//
// This is a curated snapshot of hub/src/data/tools.json (the canonical index)
// plus the launch URLs from hub/public/config.json. Refresh it
// when an app is added, removed, or repurposed.

/** One-paragraph description of what the Aireon suite is. */
export const SWISSNOVO_SUITE_BLURB =
  'Aireon, formerly SwissNovo, is a suite of focused web apps for Swiss real estate, built for ' +
  'owners, architects and brokers. Each app does one job well — valuation, ' +
  'zoning, GIS, monitoring, CRM, and more — and the hub links them all. ' +
  'Most accept a parcel or coordinates so the user can carry context from one ' +
  'tool to the next. Prefer the *.aireon.ch URLs; legacy Swissnovo/Vercel URLs ' +
  'continue to work for existing links and integrations.';

/**
 * Compact, grouped catalogue of every Aireon app — name, one-line purpose,
 * primary launch URL, and legacy launch URL where a Swissnovo/Vercel URL is
 * still live. Woven into Claire's system prompt so she can point users to the
 * most relevant tool without breaking older app assumptions.
 */
export const SWISSNOVO_APP_CATALOG = `Valuation & pricing:
- valoo — map of parcel values; spots pricing hotspots and underpriced pockets. https://valoo.aireon.ch/ (legacy: https://swissnovo-valoo.vercel.app/)
- proove — instant property valuation with transparent, factor-based pricing and upside estimates. https://proove.aireon.ch/ (legacy: https://proove.vercel.app/)
- scoore — auto-scores parcels on location, infrastructure and development potential. https://scoore.aireon.ch/ (legacy: https://swissnovo-scoore.vercel.app/)

Maps & GIS data:
- geopool — visual GIS data browser for real estate, like Google Maps for parcels. https://geopool.aireon.ch/ (legacy: https://geopool.vercel.app/)
- contoor — extracts CAD geodata, parcel boundaries and topographic information. https://contoor.aireon.ch/ (legacy: https://contoor.vercel.app/)
- woom — detects every available WMS map layer for a parcel. https://woom.aireon.ch/ (legacy: https://swissnovo-woom.vercel.app/)
- voogle — exports high-resolution Street View images for brochures. https://voogle.aireon.ch/ (legacy: https://swissnovo-voogle.vercel.app/)

Building, terrain & environment:
- roofs — analyzes building heights and roof structures. https://roofs.aireon.ch/ (legacy: https://swissnovo-roofs.vercel.app/)
- roots — researches building age and history for renovation/investment decisions. https://roots.aireon.ch/ (legacy: https://swissnovo-roots.vercel.app/)
- hood — simulates 3D sunlight and shadow patterns for any parcel. https://hood.aireon.ch/ (legacy: https://swissnovo-hood.vercel.app/)
- footprint — analyzes building footprints, coverage ratios and sealed surface. https://footprint.aireon.ch/ (legacy: https://swissnovo-footprint.vercel.app/)
- soolar — building-level solar/PV potential from the BFE Sonnendach dataset. https://soolar.aireon.ch/ (legacy: https://swissnovo-soolar.vercel.app/)
- boom — Swiss environmental noise map (road & rail) checked against legal limits. https://boom.aireon.ch/ (legacy: https://swissnovo-boom.vercel.app/)

Regulations & legal:
- xploore — finds building regulations, zoning plans and rules for a parcel. https://xploore.aireon.ch/ (legacy: https://xploore.vercel.app/)
- handbook — planning-document dataroom with AI summaries and regulation Q&A. https://handbook.aireon.ch/ (legacy: https://swissnovo-handbook.vercel.app/)
- roolez — AI-powered analysis and interpretation of building regulations. https://roolez-collector.aireon.ch/ (legacy: https://roolez-collector.vercel.app/)
- lookup — OEREB control center for public-law restriction queries. https://lookup.aireon.ch/ (legacy: https://swissnovo-lookup.vercel.app/)

Monitoring & market signals:
- scoops — real-time dashboard of property signals and market indicators. https://scoops.aireon.ch/ (legacy: https://swissnovo-scoops.vercel.app/)
- watchoo — tracks building permits Switzerland-wide to qualify leads early. https://watchoo.aireon.ch/ (legacy: https://swissnovo-watchoo.vercel.app/)
- vacoo — monitors Swiss vacancy rates and market availability. https://vacoo.aireon.ch/ (legacy: https://vacoo.vercel.app/)
- groove — monitors official GWR building data and detects registry changes. https://groove.aireon.ch/ (legacy: https://swissnovo-groove.vercel.app/)
- goody — map of every new building project in Switzerland from the GWR register. https://goody.aireon.ch/ (legacy: https://swissnovo-goody.vercel.app/)
- taxoo — compares Swiss tax rates across municipalities. https://taxoo.aireon.ch/ (legacy: https://taxoo.vercel.app/)

Search & parcel data:
- choose — SQL-backed parcel filter and export by size, price, city, year. https://choose.aireon.ch/ (legacy: https://swissnovo-choose.vercel.app/)
- showroom — full parcel data overview from an address search. https://showroom.aireon.ch/ (legacy: https://swissnovo-showroom.vercel.app/)

Pipeline & AI assistants:
- proom — parcel-first CRM with a Kanban pipeline, saved parcels and activity log. https://proom.aireon.ch/ (legacy: https://swissnovo-proom.vercel.app/)
- doorway — natural-language parcel chat about ownership, zoning and potential. https://doorway.aireon.ch/ (legacy: https://swissnovo-doorway.vercel.app/)
- booklet — builds professional property portfolios and company presentations. https://booklet.aireon.ch/ (legacy: https://swissnovo-booklet.vercel.app/)

Transactions & brokers:
- boost — compares brokers by performance, commission and specialization. https://boost.aireon.ch/ (legacy: https://swissnovo-boost.vercel.app/)
- zeroo — zero-commission marketplace to buy and sell property directly. https://zeroo.aireon.ch/ (legacy: https://swissnovo-zeroo.vercel.app/)
- realioo — fractional, tokenized Swiss real-estate investment. https://realioo.brokereum.xyz

Hub:
- hub — the suite dashboard: search and launch every Aireon tool. https://hub.aireon.ch/ (legacy: https://swissnovo-toolbox.vercel.app/)`;
