// SwissNovo suite catalog — lets Claire recommend the right tool when a
// user's need is better served by another app in the suite.
//
// This is a curated snapshot of toolbox/src/data/tools.json (the canonical
// index) plus the launch URLs from toolbox/public/config.json. Refresh it
// when an app is added, removed, or repurposed.

/** One-paragraph description of what the SwissNovo suite is. */
export const SWISSNOVO_SUITE_BLURB =
  'SwissNovo is a suite of focused web apps for Swiss real estate, built for ' +
  'owners, architects and brokers. Each app does one job well — valuation, ' +
  'zoning, GIS, monitoring, CRM, and more — and the toolbox dashboard links ' +
  'them all. Most accept a parcel or coordinates so the user can carry ' +
  'context from one tool to the next.';

/**
 * Compact, grouped catalogue of every SwissNovo app — name, one-line purpose,
 * and launch URL. Woven into Claire's system prompt so she can point users to
 * the most relevant tool.
 */
export const SWISSNOVO_APP_CATALOG = `Valuation & pricing:
- valoo — map of parcel values; spots pricing hotspots and underpriced pockets. https://swissnovo-valoo.vercel.app
- proove — instant property valuation with transparent, factor-based pricing and upside estimates. https://proove.vercel.app/
- scoore — auto-scores parcels on location, infrastructure and development potential. https://swissnovo-scoore.vercel.app/

Maps & GIS data:
- geopool — visual GIS data browser for real estate, like Google Maps for parcels. https://geopool.vercel.app/
- contoor — extracts CAD geodata, parcel boundaries and topographic information. https://contoor.vercel.app/
- woom — detects every available WMS map layer for a parcel. https://swissnovo-woom.vercel.app/
- voogle — exports high-resolution Street View images for brochures. https://swissnovo-voogle.vercel.app/

Building, terrain & environment:
- roofs — analyzes building heights and roof structures. https://swissnovo-roofs.vercel.app/
- roots — researches building age and history for renovation/investment decisions. https://swissnovo-roots.vercel.app/
- hood — simulates 3D sunlight and shadow patterns for any parcel. https://swissnovo-hood.vercel.app/
- footprint — analyzes building footprints, coverage ratios and sealed surface. https://swissnovo-footprint.vercel.app/
- soolar — building-level solar/PV potential from the BFE Sonnendach dataset. https://swissnovo-soolar.vercel.app/
- boom — Swiss environmental noise map (road & rail) checked against legal limits. https://swissnovo-boom.vercel.app/

Regulations & legal:
- xploore — finds building regulations, zoning plans and rules for a parcel. https://xploore.vercel.app/
- handbook — planning-document dataroom with AI summaries and regulation Q&A. https://swissnovo-handbook.vercel.app/
- roolez — AI-powered analysis and interpretation of building regulations. https://roolez.vercel.app/
- lookup — OEREB control center for public-law restriction queries. https://swissnovo-lookup.vercel.app/

Monitoring & market signals:
- scoops — real-time dashboard of property signals and market indicators. https://swissnovo-scoops.vercel.app/
- watchoo — tracks building permits Switzerland-wide to qualify leads early. https://swissnovo-watchoo.vercel.app/
- vacoo — monitors Swiss vacancy rates and market availability. https://vacoo.vercel.app/
- groove — monitors official GWR building data and detects registry changes. https://swissnovo-groove.vercel.app/
- goody — map of every new building project in Switzerland from the GWR register. https://swissnovo-goody.vercel.app/
- taxoo — compares Swiss tax rates across municipalities. https://taxoo.vercel.app/

Search & parcel data:
- choose — SQL-backed parcel filter and export by size, price, city, year. https://swissnovo-choose.vercel.app/
- showroom — full parcel data overview from an address search. https://swissnovo-showroom.vercel.app/

Pipeline & AI assistants:
- proom — parcel-first CRM with a Kanban pipeline, saved parcels and activity log. https://swissnovo-proom.vercel.app/
- doorway — natural-language parcel chat about ownership, zoning and potential. https://swissnovo-doorway.vercel.app/
- booklet — builds professional property portfolios and company presentations. https://swissnovo-booklet.vercel.app/

Transactions & brokers:
- boost — compares brokers by performance, commission and specialization. https://swissnovo-boost.vercel.app/
- zeroo — zero-commission marketplace to buy and sell property directly. https://swissnovo-zeroo.vercel.app/
- realioo — fractional, tokenized Swiss real-estate investment. https://realioo.brokereum.xyz

Hub:
- toolbox — the suite dashboard: search and launch every SwissNovo tool. https://swissnovo-toolbox.vercel.app/`;
