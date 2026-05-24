import './chunk-6YKTLPIC.js';
export { RES_API_BASE_URL, createResApiClient } from './chunk-J3SBZ4RV.js';
import { createContext, useState, useRef, useEffect, useMemo, useCallback, useContext, useInsertionEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Tag, GitPullRequest, ExternalLink, Search, ChevronUp, ChevronDown, Lock, MapPin, RefreshCw, Download, LayoutGrid, ArrowUpDown, Compass, Layers, Trash2, Plus, Phone, PhoneOff, Volume2, VolumeX, Loader2, AlertCircle, Send, Check } from 'lucide-react';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { WebStorageStateStore, UserManager } from 'oidc-client-ts';

// src/releaseNotes/types.ts
var KIND_META = {
  new: {
    label: "New",
    classes: "text-red-700 bg-red-50 border-red-200 dark:text-red-300 dark:bg-red-500/10 dark:border-red-500/30",
    dot: "bg-red-500"
  },
  improved: {
    label: "Improved",
    classes: "text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-300 dark:bg-amber-500/10 dark:border-amber-500/30",
    dot: "bg-amber-500"
  },
  fixed: {
    label: "Fixed",
    classes: "text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-300 dark:bg-emerald-500/10 dark:border-emerald-500/30",
    dot: "bg-emerald-500"
  },
  breaking: {
    label: "Breaking",
    classes: "text-rose-700 bg-rose-50 border-rose-200 dark:text-rose-400 dark:bg-rose-500/10 dark:border-rose-500/30",
    dot: "bg-rose-500"
  },
  docs: {
    label: "Docs",
    classes: "text-sky-700 bg-sky-50 border-sky-200 dark:text-sky-300 dark:bg-sky-500/10 dark:border-sky-500/30",
    dot: "bg-sky-500"
  }
};

// src/releaseNotes/i18n.ts
var RELEASE_NOTES_STRINGS = {
  en: {
    whatsNewIn: "What's new in",
    subtitleLead: "Every shipped change, grouped by version. Latest release",
    live: "live",
    releases: "releases",
    changes: "changes",
    viewAllPRs: "View all PRs",
    searchPlaceholder: "Search changes, versions, or PR numbers\u2026 ( / to focus)",
    filterAll: "All",
    noMatch: "No changes match that filter.",
    latest: "Latest",
    change: "change",
    changesPlural: "changes",
    footerPre: "Versions follow",
    footerPost: ". History is reconstructed from merged pull requests.",
    close: "Close",
    dialogLabel: "Release notes",
    whatsNew: "What's new",
    kind: { new: "New", improved: "Improved", fixed: "Fixed", breaking: "Breaking", docs: "Docs" }
  },
  de: {
    whatsNewIn: "Neuigkeiten in",
    subtitleLead: "Jede ausgelieferte \xC4nderung, nach Version gruppiert. Neueste Version",
    live: "live",
    releases: "Versionen",
    changes: "\xC4nderungen",
    viewAllPRs: "Alle PRs ansehen",
    searchPlaceholder: "\xC4nderungen, Versionen oder PR-Nummern suchen\u2026 ( / zum Fokussieren)",
    filterAll: "Alle",
    noMatch: "Keine \xC4nderungen passen zu diesem Filter.",
    latest: "Neueste",
    change: "\xC4nderung",
    changesPlural: "\xC4nderungen",
    footerPre: "Versionen folgen",
    footerPost: ". Der Verlauf wird aus zusammengef\xFChrten Pull Requests rekonstruiert.",
    close: "Schlie\xDFen",
    dialogLabel: "Versionshinweise",
    whatsNew: "Neuigkeiten",
    kind: { new: "Neu", improved: "Verbessert", fixed: "Behoben", breaking: "Breaking", docs: "Docs" }
  },
  fr: {
    whatsNewIn: "Nouveaut\xE9s dans",
    subtitleLead: "Chaque changement livr\xE9, regroup\xE9 par version. Derni\xE8re version",
    live: "en ligne",
    releases: "versions",
    changes: "changements",
    viewAllPRs: "Voir toutes les PR",
    searchPlaceholder: "Rechercher changements, versions ou num\xE9ros de PR\u2026 ( / pour cibler)",
    filterAll: "Tous",
    noMatch: "Aucun changement ne correspond \xE0 ce filtre.",
    latest: "Derni\xE8re",
    change: "changement",
    changesPlural: "changements",
    footerPre: "Les versions suivent",
    footerPost: ". L\u2019historique est reconstruit \xE0 partir des pull requests fusionn\xE9es.",
    close: "Fermer",
    dialogLabel: "Notes de version",
    whatsNew: "Nouveaut\xE9s",
    kind: { new: "Nouveau", improved: "Am\xE9lior\xE9", fixed: "Corrig\xE9", breaking: "Breaking", docs: "Docs" }
  },
  it: {
    whatsNewIn: "Novit\xE0 in",
    subtitleLead: "Ogni modifica rilasciata, raggruppata per versione. Ultima versione",
    live: "attiva",
    releases: "versioni",
    changes: "modifiche",
    viewAllPRs: "Vedi tutte le PR",
    searchPlaceholder: "Cerca modifiche, versioni o numeri di PR\u2026 ( / per mettere a fuoco)",
    filterAll: "Tutti",
    noMatch: "Nessuna modifica corrisponde a questo filtro.",
    latest: "Ultima",
    change: "modifica",
    changesPlural: "modifiche",
    footerPre: "Le versioni seguono",
    footerPost: ". La cronologia \xE8 ricostruita dalle pull request unite.",
    close: "Chiudi",
    dialogLabel: "Note di rilascio",
    whatsNew: "Novit\xE0",
    kind: { new: "Nuovo", improved: "Migliorato", fixed: "Corretto", breaking: "Breaking", docs: "Docs" }
  }
};
var getReleaseNotesStrings = (locale = "en") => RELEASE_NOTES_STRINGS[locale] ?? RELEASE_NOTES_STRINGS.en;
var TOP_Z_INDEX = 2147483647;
var FILTER_ORDER = ["new", "improved", "fixed", "breaking", "docs"];
function ReleaseNotesPanel({
  onClose,
  locale = "en",
  releases,
  repoUrl,
  brandPrefix = "",
  brandSuffix = "",
  brandNode,
  zIndex = TOP_Z_INDEX,
  closeRef
}) {
  const t = getReleaseNotesStrings(locale);
  const [visible, setVisible] = useState(false);
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [openVersions, setOpenVersions] = useState(() => ({
    [releases[0].version]: true
  }));
  const searchRef = useRef(null);
  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    if (closeRef) closeRef.current = handleClose;
    const onKey = (e) => {
      if (e.key === "Escape") handleClose();
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (closeRef) closeRef.current = null;
    };
  }, []);
  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 200);
  };
  const toggle = (v) => setOpenVersions((prev) => ({ ...prev, [v]: !prev[v] }));
  const filteredReleases = useMemo(() => {
    const q = query.trim().toLowerCase();
    return releases.map((release) => {
      const items = release.items.filter((item) => {
        const kindOk = activeFilter === "all" || item.kind === activeFilter;
        const queryOk = !q || item.text.toLowerCase().includes(q) || release.codename.toLowerCase().includes(q) || release.version.includes(q) || (item.prs ?? []).some((n) => `#${n}`.includes(q) || String(n) === q);
        return kindOk && queryOk;
      });
      return { ...release, items };
    }).filter((r) => r.items.length > 0);
  }, [query, activeFilter, releases]);
  const totals = useMemo(() => {
    const all = releases.flatMap((r) => r.items);
    return {
      releases: releases.length,
      changes: all.length,
      latest: releases[0]
    };
  }, [releases]);
  const latest = totals.latest;
  const filters = useMemo(() => {
    const present = new Set(releases.flatMap((r) => r.items.map((i) => i.kind)));
    return [
      { kind: "all", label: t.filterAll },
      ...FILTER_ORDER.filter((k) => present.has(k)).map((k) => ({ kind: k, label: t.kind[k] }))
    ];
  }, [releases, t]);
  return createPortal(
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: `fixed inset-0 flex items-stretch justify-end transition-opacity duration-200 ${visible ? "opacity-100" : "opacity-0"}`,
        style: { zIndex },
        role: "dialog",
        "aria-modal": "true",
        "aria-label": t.dialogLabel,
        children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm",
              onClick: handleClose
            }
          ),
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: `relative w-full max-w-3xl h-full overflow-hidden flex flex-col bg-white dark:bg-[#0B0F1A] text-gray-900 dark:text-gray-100 border-l border-gray-200 dark:border-white/[0.06] shadow-2xl transition-transform duration-200 ${visible ? "translate-x-0" : "translate-x-6"}`,
              children: [
                /* @__PURE__ */ jsxs("div", { className: "relative shrink-0 px-6 pt-6 pb-5 border-b border-gray-200 dark:border-white/[0.06]", children: [
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: handleClose,
                      className: "absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-colors",
                      "aria-label": t.close,
                      children: /* @__PURE__ */ jsx(X, { size: 18 })
                    }
                  ),
                  /* @__PURE__ */ jsx("div", { className: "flex items-start gap-4", children: /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ jsxs("h1", { className: "text-xl font-semibold text-gray-900 dark:text-white", children: [
                      t.whatsNewIn,
                      " ",
                      /* @__PURE__ */ jsx("span", { className: "font-normal", style: { fontFamily: "'Varela Round', sans-serif" }, children: brandNode ?? /* @__PURE__ */ jsxs(Fragment, { children: [
                        brandPrefix,
                        /* @__PURE__ */ jsx("span", { className: "text-red-600", children: "oo" }),
                        brandSuffix
                      ] }) })
                    ] }),
                    /* @__PURE__ */ jsxs("p", { className: "mt-1 text-sm leading-relaxed text-gray-500 dark:text-slate-400", children: [
                      t.subtitleLead,
                      " ",
                      /* @__PURE__ */ jsxs("span", { className: "font-mono font-semibold text-red-600 dark:text-red-400", children: [
                        "v",
                        latest.version
                      ] }),
                      " ",
                      "\xB7 ",
                      /* @__PURE__ */ jsx("span", { className: "font-medium", children: latest.codename }),
                      " \xB7 ",
                      latest.date,
                      "."
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "mt-3 flex flex-wrap items-center gap-2 text-xs", children: [
                      /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-semibold bg-red-50 text-red-700 border border-red-200 dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/30", children: [
                        /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" }),
                        "v",
                        latest.version,
                        " ",
                        t.live
                      ] }),
                      /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 dark:bg-white/[0.05] dark:text-slate-300", children: [
                        /* @__PURE__ */ jsx(Tag, { size: 12 }),
                        " ",
                        totals.releases,
                        " ",
                        t.releases
                      ] }),
                      /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 dark:bg-white/[0.05] dark:text-slate-300", children: [
                        /* @__PURE__ */ jsx(GitPullRequest, { size: 12 }),
                        " ",
                        totals.changes,
                        " ",
                        t.changes
                      ] }),
                      /* @__PURE__ */ jsxs(
                        "a",
                        {
                          href: `${repoUrl}/pulls?q=is%3Apr+is%3Aclosed`,
                          target: "_blank",
                          rel: "noopener noreferrer",
                          className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-white/[0.05] dark:text-slate-300 dark:hover:bg-white/[0.08] transition-colors",
                          children: [
                            /* @__PURE__ */ jsx(ExternalLink, { size: 12 }),
                            " ",
                            t.viewAllPRs
                          ]
                        }
                      )
                    ] })
                  ] }) }),
                  /* @__PURE__ */ jsxs("div", { className: "mt-5 flex flex-col sm:flex-row sm:items-center gap-3", children: [
                    /* @__PURE__ */ jsxs("div", { className: "relative flex-1", children: [
                      /* @__PURE__ */ jsx(
                        Search,
                        {
                          size: 15,
                          className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500"
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "input",
                        {
                          ref: searchRef,
                          value: query,
                          onChange: (e) => setQuery(e.target.value),
                          placeholder: t.searchPlaceholder,
                          className: "w-full h-9 pl-9 pr-3 text-sm rounded-lg bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 dark:bg-white/[0.04] dark:border-white/[0.08] dark:text-gray-100 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-400 transition-colors"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1.5 flex-wrap", children: filters.map((f) => {
                      const active = activeFilter === f.kind;
                      return /* @__PURE__ */ jsx(
                        "button",
                        {
                          onClick: () => setActiveFilter(f.kind),
                          className: `px-2.5 h-7 rounded-full text-xs font-medium transition-colors border ${active ? "bg-red-50 border-red-200 text-red-700 dark:bg-red-500/10 dark:border-red-500/40 dark:text-red-300" : "bg-transparent border-gray-200 text-gray-500 hover:text-gray-900 hover:border-gray-300 dark:border-white/[0.08] dark:text-slate-400 dark:hover:text-slate-200 dark:hover:border-white/[0.16]"}`,
                          children: f.label
                        },
                        f.kind
                      );
                    }) })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-y-auto px-6 py-6", children: [
                  filteredReleases.length === 0 && /* @__PURE__ */ jsx("div", { className: "text-center py-16 rounded-2xl border-2 border-dashed border-gray-200 text-gray-400 dark:border-white/[0.08] dark:text-slate-500", children: /* @__PURE__ */ jsx("p", { className: "text-sm", children: t.noMatch }) }),
                  /* @__PURE__ */ jsx("ol", { className: "relative space-y-5", children: filteredReleases.map((release, idx) => {
                    const isOpen = openVersions[release.version] ?? false;
                    const isLatest = idx === 0 && release.version === releases[0].version;
                    return /* @__PURE__ */ jsxs("li", { className: "relative", children: [
                      idx < filteredReleases.length - 1 && /* @__PURE__ */ jsx(
                        "span",
                        {
                          className: "absolute left-[18px] top-12 bottom-[-20px] w-px bg-gray-200 dark:bg-white/[0.08]",
                          "aria-hidden": true
                        }
                      ),
                      /* @__PURE__ */ jsxs("div", { className: "flex items-stretch gap-4", children: [
                        /* @__PURE__ */ jsx("div", { className: "shrink-0 pt-3", children: /* @__PURE__ */ jsxs(
                          "div",
                          {
                            className: `relative w-9 h-9 rounded-full flex items-center justify-center ${isLatest ? "bg-red-50 border border-red-200 dark:bg-red-500/10 dark:border-red-500/40" : "bg-gray-100 border border-gray-200 dark:bg-white/[0.04] dark:border-white/[0.08]"}`,
                            children: [
                              /* @__PURE__ */ jsx(
                                Tag,
                                {
                                  size: 14,
                                  className: isLatest ? "text-red-600 dark:text-red-400" : "text-gray-400 dark:text-slate-500"
                                }
                              ),
                              isLatest && /* @__PURE__ */ jsx("span", { className: "absolute inset-0 rounded-full bg-red-500/30 animate-ping opacity-50" })
                            ]
                          }
                        ) }),
                        /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                          /* @__PURE__ */ jsxs(
                            "button",
                            {
                              onClick: () => toggle(release.version),
                              className: "w-full text-left rounded-2xl overflow-hidden border bg-white border-gray-200 hover:border-gray-300 dark:bg-white/[0.03] dark:border-white/[0.06] dark:hover:border-white/[0.12] transition-colors",
                              children: [
                                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 px-5 py-4", children: [
                                  /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                                      /* @__PURE__ */ jsxs("span", { className: "text-base font-bold font-mono text-gray-900 dark:text-white", children: [
                                        "v",
                                        release.version
                                      ] }),
                                      /* @__PURE__ */ jsx("span", { className: "text-gray-300 dark:text-slate-600", children: "\xB7" }),
                                      /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-gray-700 dark:text-slate-200", children: release.codename }),
                                      isLatest && /* @__PURE__ */ jsx("span", { className: "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-red-600 text-white", children: t.latest })
                                    ] }),
                                    /* @__PURE__ */ jsxs("p", { className: "text-xs mt-0.5 text-gray-400 dark:text-slate-500", children: [
                                      release.date,
                                      " \xB7 ",
                                      release.items.length,
                                      " ",
                                      release.items.length === 1 ? t.change : t.changesPlural
                                    ] })
                                  ] }),
                                  isOpen ? /* @__PURE__ */ jsx(ChevronUp, { size: 16, className: "text-gray-400 dark:text-slate-500" }) : /* @__PURE__ */ jsx(ChevronDown, { size: 16, className: "text-gray-400 dark:text-slate-500" })
                                ] }),
                                isOpen && /* @__PURE__ */ jsx("div", { className: "border-t border-gray-100 px-5 py-4 dark:border-white/[0.06]", children: /* @__PURE__ */ jsx("p", { className: "text-sm leading-relaxed text-gray-600 dark:text-slate-400", children: release.summary }) })
                              ]
                            }
                          ),
                          isOpen && /* @__PURE__ */ jsx("ul", { className: "mt-3 space-y-2", children: release.items.map((item, i) => {
                            const meta = KIND_META[item.kind];
                            const Icon = item.icon;
                            return /* @__PURE__ */ jsxs(
                              "li",
                              {
                                className: "flex items-start gap-3 rounded-xl px-4 py-3 border bg-gray-50 border-gray-100 hover:border-gray-200 dark:bg-white/[0.02] dark:border-white/[0.06] dark:hover:border-white/[0.12] transition-colors",
                                children: [
                                  /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-white border border-gray-200 dark:bg-white/[0.04] dark:border-white/[0.06]", children: /* @__PURE__ */ jsx(Icon, { size: 15, className: "text-gray-600 dark:text-slate-300" }) }),
                                  /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-wrap mb-1", children: [
                                      /* @__PURE__ */ jsxs(
                                        "span",
                                        {
                                          className: `inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wide border ${meta.classes}`,
                                          children: [
                                            /* @__PURE__ */ jsx("span", { className: `w-1 h-1 rounded-full ${meta.dot}` }),
                                            t.kind[item.kind]
                                          ]
                                        }
                                      ),
                                      (item.prs ?? []).map((n) => /* @__PURE__ */ jsxs(
                                        "a",
                                        {
                                          href: `${repoUrl}/pull/${n}`,
                                          target: "_blank",
                                          rel: "noopener noreferrer",
                                          className: "inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-gray-100 text-gray-500 hover:text-red-600 hover:bg-gray-200 dark:bg-white/[0.05] dark:text-slate-400 dark:hover:text-red-300 dark:hover:bg-white/[0.08] transition-colors",
                                          title: `Pull request #${n}`,
                                          children: [
                                            /* @__PURE__ */ jsx(GitPullRequest, { size: 10 }),
                                            "#",
                                            n
                                          ]
                                        },
                                        n
                                      ))
                                    ] }),
                                    /* @__PURE__ */ jsx("p", { className: "text-sm leading-relaxed text-gray-700 dark:text-slate-300", children: item.text })
                                  ] })
                                ]
                              },
                              i
                            );
                          }) })
                        ] })
                      ] })
                    ] }, release.version);
                  }) })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "shrink-0 px-6 py-4 border-t border-gray-200 dark:border-white/[0.06] text-gray-400 dark:text-slate-500 flex items-center justify-between text-xs", children: [
                  /* @__PURE__ */ jsxs("span", { children: [
                    t.footerPre,
                    " ",
                    /* @__PURE__ */ jsx(
                      "a",
                      {
                        href: "https://semver.org",
                        target: "_blank",
                        rel: "noopener noreferrer",
                        className: "text-gray-600 hover:text-red-600 underline dark:text-slate-300 dark:hover:text-red-300",
                        children: "SemVer"
                      }
                    ),
                    t.footerPost
                  ] }),
                  /* @__PURE__ */ jsxs(
                    "button",
                    {
                      onClick: handleClose,
                      className: "hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gray-100 text-gray-500 hover:text-gray-900 dark:bg-white/[0.05] dark:text-slate-400 dark:hover:text-slate-100",
                      children: [
                        t.close,
                        " ",
                        /* @__PURE__ */ jsx("kbd", { className: "font-mono text-[10px]", children: "Esc" })
                      ]
                    }
                  )
                ] })
              ]
            }
          )
        ]
      }
    ),
    document.body
  );
}
var HASH = "#release-notes";
function ReleaseNotesButton({
  releases,
  locale = "en",
  storageKey,
  repoUrl,
  brandPrefix,
  brandSuffix = "",
  brandNode,
  zIndex,
  className
}) {
  const t = getReleaseNotesStrings(locale);
  const currentVersion = releases[0].version;
  const [open, setOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const closeRef = useRef(null);
  useEffect(() => {
    try {
      const lastSeen = localStorage.getItem(storageKey);
      if (lastSeen !== currentVersion) setHasUnread(true);
    } catch {
    }
    if (window.location.hash === HASH) setOpen(true);
    const onHash = () => {
      if (window.location.hash === HASH) setOpen(true);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [storageKey, currentVersion]);
  const handleOpen = useCallback(() => {
    setOpen(true);
    if (window.location.hash !== HASH) {
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}${window.location.search}${HASH}`
      );
    }
  }, []);
  const handleToggle = useCallback(() => {
    if (open) {
      if (closeRef.current) closeRef.current();
      else setOpen(false);
    } else {
      handleOpen();
    }
  }, [open, handleOpen]);
  const handleClose = useCallback(() => {
    setOpen(false);
    setHasUnread(false);
    try {
      localStorage.setItem(storageKey, currentVersion);
    } catch {
    }
    if (window.location.hash === HASH) {
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}${window.location.search}`
      );
    }
  }, [storageKey, currentVersion]);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: handleToggle,
        "aria-expanded": open,
        title: `${t.whatsNew} \u2014 v${currentVersion}`,
        "aria-label": `${t.whatsNew} \u2014 v${currentVersion}`,
        className: `relative hidden sm:inline-flex items-center justify-center w-9 h-9 rounded-lg transition-colors text-gray-600 hover:text-red-700 hover:bg-red-50 dark:text-gray-300 dark:hover:text-red-300 dark:hover:bg-red-500/10 ${className ?? ""}`,
        children: [
          /* @__PURE__ */ jsx(Tag, { size: 18 }),
          hasUnread && /* @__PURE__ */ jsx("span", { className: "absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" })
        ]
      }
    ),
    open && /* @__PURE__ */ jsx(
      ReleaseNotesPanel,
      {
        onClose: handleClose,
        closeRef,
        locale,
        releases,
        repoUrl,
        brandPrefix,
        brandSuffix,
        brandNode,
        zIndex
      }
    )
  ] });
}
var LOCALE_LABELS = {
  en: "EN",
  fr: "FR",
  de: "DE",
  it: "IT"
};
var LOCALE_OPTIONS = ["en", "fr", "de", "it"];
function LocaleSelector({
  locale,
  onChange,
  ariaLabel,
  className
}) {
  return /* @__PURE__ */ jsx(
    "select",
    {
      value: locale,
      onChange: (e) => onChange(e.target.value),
      "aria-label": ariaLabel ?? "Select language",
      className: [
        "h-9 text-xs font-semibold text-gray-500 dark:text-gray-400",
        "bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg px-1.5",
        "hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer",
        "focus:outline-none focus:ring-2 focus:ring-red-500/40",
        className ?? ""
      ].filter(Boolean).join(" "),
      children: LOCALE_OPTIONS.map((l) => /* @__PURE__ */ jsx(
        "option",
        {
          value: l,
          className: "bg-white dark:bg-gray-900",
          children: LOCALE_LABELS[l]
        },
        l
      ))
    }
  );
}
var LocaleSelector_default = LocaleSelector;
var ZITADEL_AUTHORITY = "https://swissnovo-ekqvxs.ch1.zitadel.cloud/";
var ZITADEL_CLIENT_ID = "366334583324661156";
var origin = typeof window !== "undefined" ? window.location.origin : "";
var settings = {
  authority: ZITADEL_AUTHORITY,
  client_id: ZITADEL_CLIENT_ID,
  redirect_uri: `${origin}/`,
  post_logout_redirect_uri: `${origin}/`,
  silent_redirect_uri: `${origin}/silent-callback.html`,
  response_type: "code",
  scope: "openid profile email",
  loadUserInfo: true,
  automaticSilentRenew: true,
  monitorSession: false,
  // Bound the hidden-iframe silent SSO. oidc-client-ts defaults to 10s, so a
  // visitor with no Zitadel session waits the full 10s before the app settles
  // to anonymous. A logged-in check resolves in well under a second; 5s leaves
  // ample room for a slow network while capping the worst case.
  silentRequestTimeoutInSeconds: 5,
  userStore: new WebStorageStateStore({ store: window.localStorage }),
  stateStore: new WebStorageStateStore({ store: window.localStorage })
};
var userManager = new UserManager(settings);
userManager.events.addSilentRenewError((e) => {
  console.warn("[auth] silent renew error", e);
});
var SSO_ATTEMPTED_KEY = "swissnovo:silent_sso_attempted";
async function getExistingUser() {
  try {
    const user = await userManager.getUser();
    return user && !user.expired ? user : null;
  } catch {
    return null;
  }
}
async function getAuthToken() {
  const user = await getExistingUser();
  return user ? user.id_token ?? user.access_token ?? null : null;
}
function urlHasAuthParams(url = new URL(window.location.href)) {
  const p = url.searchParams;
  return (p.has("code") || p.has("error")) && p.has("state");
}
function stripAuthParams() {
  const url = new URL(window.location.href);
  ["code", "state", "session_state", "iss", "error", "error_description"].forEach(
    (k) => url.searchParams.delete(k)
  );
  window.history.replaceState({}, document.title, `${url.pathname}${url.search}${url.hash}`);
}
function StyledAppName({ name }) {
  return /* @__PURE__ */ jsx(Fragment, { children: name.split(/(oo)/gi).map(
    (part, i) => part.toLowerCase() === "oo" ? /* @__PURE__ */ jsx("span", { className: "text-red-600", children: part }, i) : /* @__PURE__ */ jsx("span", { children: part }, i)
  ) });
}
function LoginModal({
  open,
  onClose,
  appName,
  description,
  features,
  blocking = false,
  login,
  register
}) {
  useEffect(() => {
    if (!open || blocking) return;
    const onEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [open, blocking, onClose]);
  if (!open) return null;
  return createPortal(
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: "fixed inset-0 z-[200] flex items-center justify-center p-4",
        role: "dialog",
        "aria-modal": "true",
        children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "absolute inset-0 bg-black/50 backdrop-blur-sm",
              onClick: blocking ? void 0 : onClose
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "relative w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden", children: [
            /* @__PURE__ */ jsx("div", { className: "h-1.5 bg-gradient-to-r from-red-500 via-red-600 to-rose-700" }),
            /* @__PURE__ */ jsxs("div", { className: "px-8 pt-7 pb-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center text-center", children: [
                /* @__PURE__ */ jsxs(
                  "p",
                  {
                    className: "text-2xl sm:text-3xl font-normal leading-none select-none",
                    style: { fontFamily: "'Varela Round', sans-serif" },
                    "aria-label": "SWISSNOVO",
                    children: [
                      /* @__PURE__ */ jsx("span", { className: "text-gray-900 dark:text-white", children: "SWISSN" }),
                      /* @__PURE__ */ jsx("span", { className: "text-red-600", children: "O" }),
                      /* @__PURE__ */ jsx("span", { className: "text-gray-900 dark:text-white", children: "V" }),
                      /* @__PURE__ */ jsx("span", { className: "text-red-600", children: "O" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsx(
                  "h2",
                  {
                    className: "mt-1 text-xl sm:text-2xl font-normal leading-none text-gray-900 dark:text-gray-100",
                    style: { fontFamily: "'Varela Round', sans-serif" },
                    children: /* @__PURE__ */ jsx(StyledAppName, { name: appName })
                  }
                ),
                description && /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm text-gray-500 dark:text-gray-400 leading-relaxed", children: description })
              ] }),
              features && features.length > 0 && /* @__PURE__ */ jsx("div", { className: "mt-6 space-y-2", children: features.map((f, i) => /* @__PURE__ */ jsx(FeatureRow, { feature: f }, i)) }),
              /* @__PURE__ */ jsxs("div", { className: "mt-6 flex flex-col gap-3", children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: register,
                    className: "w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-sm font-semibold rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900",
                    children: "Create free account"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: login,
                    className: "w-full py-2.5 px-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm font-medium rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400",
                    children: "Sign in"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "mt-5 flex items-center justify-center gap-1.5 text-[11px] text-gray-400 dark:text-gray-500", children: [
                /* @__PURE__ */ jsx(Lock, { size: 11 }),
                /* @__PURE__ */ jsx("span", { children: "Secured with single sign-on via Zitadel" })
              ] }),
              !blocking && /* @__PURE__ */ jsx("div", { className: "mt-3 text-center", children: /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: onClose,
                  className: "text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors underline-offset-2 hover:underline",
                  children: "Continue without signing in"
                }
              ) })
            ] })
          ] })
        ]
      }
    ),
    document.body
  );
}
function FeatureRow({ feature }) {
  const { icon: Icon, label, locked } = feature;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${locked ? "text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800/50" : "text-gray-700 dark:text-gray-300 bg-red-50/60 dark:bg-red-900/10"}`,
      children: [
        Icon && /* @__PURE__ */ jsx(
          "span",
          {
            className: locked ? "text-gray-400 dark:text-gray-500" : "text-red-500 dark:text-red-400",
            children: /* @__PURE__ */ jsx(Icon, { size: 15 })
          }
        ),
        /* @__PURE__ */ jsx("span", { className: "flex-1", children: label }),
        locked && /* @__PURE__ */ jsx("span", { className: "text-[10px] font-semibold uppercase tracking-wide text-amber-500 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-1.5 py-0.5 rounded", children: "Pro" })
      ]
    }
  );
}
var LOGIN_DISMISSED_KEY = "swissnovo:login-prompt-dismissed";
var AuthContext = createContext(void 0);
function computeInitials(name, email) {
  const source = name.trim() || email.trim();
  if (!source) return "?";
  if (source.includes("@")) return source[0].toUpperCase();
  const parts = source.split(/\s+/).filter(Boolean);
  return parts.slice(0, 2).map((p) => p[0].toUpperCase()).join("") || source[0].toUpperCase();
}
function AuthProvider({
  children,
  appName,
  loginDescription,
  loginFeatures,
  loginBlocking = false,
  loginPromptOnFirstVisit = false
}) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const initStarted = useRef(false);
  const [loginRequested, setLoginRequested] = useState(false);
  const firstVisitDecided = useRef(false);
  useEffect(() => {
    const t = setTimeout(() => {
      setIsLoading((prev) => {
        if (prev) console.warn("[auth] init death-switch fired \u2014 falling to anonymous");
        return false;
      });
    }, 8e3);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    const onLoaded = (u) => setUser(u);
    const onUnloaded = () => setUser(null);
    const onExpired = () => {
      userManager.removeUser().finally(() => setUser(null));
    };
    userManager.events.addUserLoaded(onLoaded);
    userManager.events.addUserUnloaded(onUnloaded);
    userManager.events.addAccessTokenExpired(onExpired);
    return () => {
      userManager.events.removeUserLoaded(onLoaded);
      userManager.events.removeUserUnloaded(onUnloaded);
      userManager.events.removeAccessTokenExpired(onExpired);
    };
  }, []);
  useEffect(() => {
    if (initStarted.current) return;
    initStarted.current = true;
    const finish = (loaded) => {
      setUser(loaded);
      setIsLoading(false);
    };
    (async () => {
      try {
        if (urlHasAuthParams()) {
          try {
            const completed = await userManager.signinRedirectCallback();
            sessionStorage.setItem(SSO_ATTEMPTED_KEY, "1");
            stripAuthParams();
            finish(completed ?? null);
            return;
          } catch (err) {
            sessionStorage.setItem(SSO_ATTEMPTED_KEY, "1");
            stripAuthParams();
            console.warn("[auth] sign-in callback failed", err);
            finish(null);
            return;
          }
        }
        const existing = await userManager.getUser();
        if (existing && !existing.expired) {
          finish(existing);
          return;
        }
        if (existing?.expired) await userManager.removeUser().catch(() => {
        });
        if (sessionStorage.getItem(SSO_ATTEMPTED_KEY) !== "1") {
          sessionStorage.setItem(SSO_ATTEMPTED_KEY, "1");
          try {
            const silent = await Promise.race([
              userManager.signinSilent(),
              new Promise(
                (_, reject) => setTimeout(() => reject(new Error("silent SSO hard timeout")), 6e3)
              )
            ]);
            finish(silent && !silent.expired ? silent : null);
            return;
          } catch {
          }
        }
        finish(null);
      } catch (err) {
        console.warn("[auth] init error", err);
        finish(null);
      }
    })();
  }, []);
  const isAuthenticatedNow = !!user && !user.expired;
  useEffect(() => {
    if (!loginPromptOnFirstVisit || isLoading || firstVisitDecided.current) return;
    firstVisitDecided.current = true;
    if (isAuthenticatedNow) return;
    if (sessionStorage.getItem(LOGIN_DISMISSED_KEY)) return;
    const params = new URLSearchParams(window.location.search);
    if (params.has("lat") && params.has("lng")) return;
    setLoginRequested(true);
  }, [loginPromptOnFirstVisit, isLoading, isAuthenticatedNow]);
  const login = useCallback(async () => {
    sessionStorage.removeItem(SSO_ATTEMPTED_KEY);
    await userManager.signinRedirect();
  }, []);
  const register = useCallback(async () => {
    sessionStorage.removeItem(SSO_ATTEMPTED_KEY);
    await userManager.signinRedirect({ extraQueryParams: { prompt: "create" } });
  }, []);
  const logout = useCallback(async () => {
    sessionStorage.setItem(SSO_ATTEMPTED_KEY, "1");
    try {
      await userManager.signoutRedirect();
    } catch {
      await userManager.removeUser().catch(() => {
      });
      setUser(null);
    }
  }, []);
  const getAccessToken = useCallback(() => user?.access_token, [user]);
  const promptLogin = useCallback(() => setLoginRequested(true), []);
  const closeLogin = useCallback(() => {
    sessionStorage.setItem(LOGIN_DISMISSED_KEY, "1");
    setLoginRequested(false);
  }, []);
  const value = useMemo(() => {
    const profile = user?.profile;
    const displayName = profile?.name || [profile?.given_name, profile?.family_name].filter(Boolean).join(" ") || "";
    const email = profile?.email ?? "";
    const picture = profile?.picture ?? null;
    const isAuthenticated = !!user && !user.expired;
    return {
      user,
      status: isLoading ? "loading" : isAuthenticated ? "authenticated" : "anonymous",
      isAuthenticated,
      isLoading,
      login,
      register,
      logout,
      getAccessToken,
      displayName: displayName || email || "User",
      email,
      initials: computeInitials(displayName, email),
      picture,
      promptLogin,
      requireAuth: () => {
        if (!isAuthenticated) setLoginRequested(true);
        return isAuthenticated;
      },
      closeLogin,
      isLoginModalOpen: !isAuthenticated && (loginRequested || loginBlocking && !isLoading)
    };
  }, [
    user,
    isLoading,
    login,
    register,
    logout,
    getAccessToken,
    promptLogin,
    closeLogin,
    loginRequested,
    loginBlocking
  ]);
  return /* @__PURE__ */ jsxs(AuthContext.Provider, { value, children: [
    children,
    appName && /* @__PURE__ */ jsx(
      LoginModal,
      {
        open: value.isLoginModalOpen,
        onClose: closeLogin,
        appName,
        description: loginDescription,
        features: loginFeatures,
        blocking: loginBlocking,
        login,
        register
      }
    )
  ] });
}
function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}

// src/prm/api.ts
var PROOM_API_BASE = "https://swissnovo-proom.vercel.app/api";
var PRM_STATES = [
  { value: "new", color: "text-sky-400", bg: "bg-sky-500" },
  { value: "contacted", color: "text-amber-400", bg: "bg-amber-500" },
  { value: "negotiation", color: "text-orange-400", bg: "bg-orange-500" },
  { value: "due_diligence", color: "text-teal-400", bg: "bg-teal-500" },
  { value: "closed", color: "text-emerald-400", bg: "bg-emerald-500" },
  { value: "rejected", color: "text-red-400", bg: "bg-red-500" }
];
var PRM_PRIORITIES = [
  { value: "low", color: "text-slate-400" },
  { value: "medium", color: "text-sky-400" },
  { value: "high", color: "text-orange-400" },
  { value: "urgent", color: "text-red-400" }
];
var AuthRequiredError = class extends Error {
  constructor() {
    super("Sign in required to save parcels to PRM");
    this.name = "AuthRequiredError";
  }
};
async function prmFetch(path, init, token) {
  if (!token) throw new AuthRequiredError();
  const res = await fetch(`${PROOM_API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...init.headers
    }
  });
  if (!res.ok) {
    let detail = "";
    try {
      detail = (await res.json())?.error ?? "";
    } catch {
    }
    throw new Error(
      `${res.status} ${res.statusText}${detail ? `: ${detail}` : ""}`
    );
  }
  if (res.status === 204) return void 0;
  return await res.json();
}
function fetchPrmByParcel(token, parcelId) {
  return prmFetch(
    `/prm-records?parcel_id=${encodeURIComponent(parcelId)}`,
    { method: "GET" },
    token
  );
}
function createPrmRecord(token, input) {
  return prmFetch(
    "/prm-records",
    { method: "POST", body: JSON.stringify(input) },
    token
  );
}
function fetchPrmRecords(token) {
  return prmFetch("/prm-records", { method: "GET" }, token);
}
function updatePrmState(token, id, state) {
  return prmFetch(
    `/prm-records/${encodeURIComponent(id)}`,
    { method: "PATCH", body: JSON.stringify({ state }) },
    token
  );
}
function updatePrmPriority(token, id, priority) {
  return prmFetch(
    `/prm-records/${encodeURIComponent(id)}`,
    { method: "PATCH", body: JSON.stringify({ priority }) },
    token
  );
}
function updatePrmTags(token, id, tags) {
  return prmFetch(
    `/prm-records/${encodeURIComponent(id)}`,
    { method: "PATCH", body: JSON.stringify({ tags }) },
    token
  );
}
async function deletePrmRecord(token, id) {
  await prmFetch(
    `/prm-records/${encodeURIComponent(id)}`,
    { method: "DELETE" },
    token
  );
}
var PROOM_APP_URL = "https://swissnovo-proom.vercel.app";
var TOOLBOX_APP_URL = "https://swissnovo-toolbox.vercel.app";
var GEOPOOL_APP_URL = "https://swissnovo-geopool.vercel.app";

// src/prm/i18n.ts
var en = {
  title: "My saved parcels",
  refresh: "Refresh",
  exportCsv: "Export CSV",
  openInProom: "Open in proom",
  searchPlaceholder: "Search address, tag, parcel ID\u2026",
  filterAllStates: "All states",
  showingAll: (n) => `${n} parcels`,
  showingFiltered: (n, total) => `${n} of ${total}`,
  empty: "No saved parcels yet",
  emptyHint: "Save a parcel from any SwissNovo app and it will land here \u2014 and in proom.",
  noMatch: "No parcels match your filter.",
  loadFailed: "Could not load saved parcels",
  signinRequired: "Sign in to view your saved parcels",
  colAddress: "Address",
  colMunicipality: "Municipality",
  colState: "State",
  colPriority: "Priority",
  colTags: "Tags",
  colUpdated: "Updated",
  colActions: "Actions",
  openHere: "Open here",
  openInToolbox: "Open in toolbox",
  openInGeopool: "Open in geopool",
  delete: "Remove",
  tagPlaceholder: "Tag\u2026",
  addTag: "Add",
  removeTag: (tag) => `Remove tag ${tag}`,
  confirmDeleteTitle: "Remove this parcel from PRM?",
  confirmDeleteBody: "It will be removed from proom too. This cannot be undone.",
  close: "Close",
  cancel: "Cancel",
  state: {
    new: "New",
    contacted: "Contacted",
    negotiation: "Negotiation",
    due_diligence: "Due Diligence",
    closed: "Closed",
    rejected: "Rejected"
  },
  priority: { low: "Low", medium: "Medium", high: "High", urgent: "Urgent" }
};
var fr = {
  title: "Mes parcelles enregistr\xE9es",
  refresh: "Actualiser",
  exportCsv: "Exporter en CSV",
  openInProom: "Ouvrir dans proom",
  searchPlaceholder: "Rechercher adresse, tag, ID\u2026",
  filterAllStates: "Tous les statuts",
  showingAll: (n) => `${n} parcelles`,
  showingFiltered: (n, total) => `${n} sur ${total}`,
  empty: "Aucune parcelle enregistr\xE9e",
  emptyHint: "Enregistrez une parcelle depuis n'importe quelle app SwissNovo \u2014 elle appara\xEEtra ici et dans proom.",
  noMatch: "Aucune parcelle ne correspond.",
  loadFailed: "Impossible de charger les parcelles",
  signinRequired: "Connectez-vous pour voir vos parcelles",
  colAddress: "Adresse",
  colMunicipality: "Commune",
  colState: "Statut",
  colPriority: "Priorit\xE9",
  colTags: "Tags",
  colUpdated: "Mis \xE0 jour",
  colActions: "Actions",
  openHere: "Ouvrir ici",
  openInToolbox: "Ouvrir dans toolbox",
  openInGeopool: "Ouvrir dans geopool",
  delete: "Supprimer",
  tagPlaceholder: "Tag\u2026",
  addTag: "Ajouter",
  removeTag: (tag) => `Retirer le tag ${tag}`,
  confirmDeleteTitle: "Retirer cette parcelle du PRM ?",
  confirmDeleteBody: "Elle sera aussi retir\xE9e de proom. Action irr\xE9versible.",
  close: "Fermer",
  cancel: "Annuler",
  state: {
    new: "Nouveau",
    contacted: "Contact\xE9",
    negotiation: "N\xE9gociation",
    due_diligence: "Due diligence",
    closed: "Cl\xF4tur\xE9",
    rejected: "Rejet\xE9"
  },
  priority: { low: "Basse", medium: "Moyenne", high: "Haute", urgent: "Urgent" }
};
var de = {
  title: "Meine gespeicherten Parzellen",
  refresh: "Aktualisieren",
  exportCsv: "CSV exportieren",
  openInProom: "In proom \xF6ffnen",
  searchPlaceholder: "Adresse, Tag, Parzellen-ID\u2026",
  filterAllStates: "Alle Status",
  showingAll: (n) => `${n} Parzellen`,
  showingFiltered: (n, total) => `${n} von ${total}`,
  empty: "Noch keine Parzellen gespeichert",
  emptyHint: "Speichere eine Parzelle aus einer beliebigen SwissNovo-App \u2014 sie erscheint hier und in proom.",
  noMatch: "Keine Parzelle entspricht dem Filter.",
  loadFailed: "Parzellen konnten nicht geladen werden",
  signinRequired: "Melde dich an, um deine Parzellen zu sehen",
  colAddress: "Adresse",
  colMunicipality: "Gemeinde",
  colState: "Status",
  colPriority: "Priorit\xE4t",
  colTags: "Tags",
  colUpdated: "Aktualisiert",
  colActions: "Aktionen",
  openHere: "Hier \xF6ffnen",
  openInToolbox: "In toolbox \xF6ffnen",
  openInGeopool: "In geopool \xF6ffnen",
  delete: "Entfernen",
  tagPlaceholder: "Tag\u2026",
  addTag: "Hinzuf\xFCgen",
  removeTag: (tag) => `Tag ${tag} entfernen`,
  confirmDeleteTitle: "Parzelle aus PRM entfernen?",
  confirmDeleteBody: "Sie wird auch aus proom entfernt. Diese Aktion ist endg\xFCltig.",
  close: "Schliessen",
  cancel: "Abbrechen",
  state: {
    new: "Neu",
    contacted: "Kontaktiert",
    negotiation: "Verhandlung",
    due_diligence: "Due Diligence",
    closed: "Abgeschlossen",
    rejected: "Abgelehnt"
  },
  priority: { low: "Niedrig", medium: "Mittel", high: "Hoch", urgent: "Dringend" }
};
var it = {
  title: "Le mie particelle salvate",
  refresh: "Aggiorna",
  exportCsv: "Esporta CSV",
  openInProom: "Apri in proom",
  searchPlaceholder: "Cerca indirizzo, tag, ID particella\u2026",
  filterAllStates: "Tutti gli stati",
  showingAll: (n) => `${n} particelle`,
  showingFiltered: (n, total) => `${n} di ${total}`,
  empty: "Nessuna particella salvata",
  emptyHint: "Salva una particella da una qualsiasi app SwissNovo \u2014 comparir\xE0 qui e in proom.",
  noMatch: "Nessuna particella corrisponde.",
  loadFailed: "Impossibile caricare le particelle",
  signinRequired: "Accedi per vedere le tue particelle",
  colAddress: "Indirizzo",
  colMunicipality: "Comune",
  colState: "Stato",
  colPriority: "Priorit\xE0",
  colTags: "Tag",
  colUpdated: "Aggiornata",
  colActions: "Azioni",
  openHere: "Apri qui",
  openInToolbox: "Apri in toolbox",
  openInGeopool: "Apri in geopool",
  delete: "Rimuovi",
  tagPlaceholder: "Tag\u2026",
  addTag: "Aggiungi",
  removeTag: (tag) => `Rimuovi tag ${tag}`,
  confirmDeleteTitle: "Rimuovere questa particella dal PRM?",
  confirmDeleteBody: "Sar\xE0 rimossa anche da proom. Azione irreversibile.",
  close: "Chiudi",
  cancel: "Annulla",
  state: {
    new: "Nuova",
    contacted: "Contattata",
    negotiation: "Negoziazione",
    due_diligence: "Due diligence",
    closed: "Chiusa",
    rejected: "Rifiutata"
  },
  priority: { low: "Bassa", medium: "Media", high: "Alta", urgent: "Urgente" }
};
var SAVED_PARCELS_STRINGS = {
  en,
  fr,
  de,
  it
};
var getSavedParcelsStrings = (locale = "en") => SAVED_PARCELS_STRINGS[locale] ?? SAVED_PARCELS_STRINGS.en;
function SavedParcelsModal({
  locale = "en",
  onClose,
  onOpenHere,
  openHereLabel
}) {
  const t = getSavedParcelsStrings(locale);
  const auth = useAuth();
  const accessToken = auth.getAccessToken();
  const isAuthenticated = auth.isAuthenticated;
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortKey, setSortKey] = useState("updated_at");
  const [sortAsc, setSortAsc] = useState(false);
  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState("all");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const refresh = () => {
    if (!isAuthenticated || !accessToken) return;
    setLoading(true);
    setError(null);
    fetchPrmRecords(accessToken).then(setRecords).catch((err) => setError(String(err?.message ?? err))).finally(() => setLoading(false));
  };
  useEffect(refresh, [accessToken, isAuthenticated]);
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);
  const handleSort = (key) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  };
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return records.filter((r) => stateFilter === "all" || r.state === stateFilter).filter((r) => {
      if (!q) return true;
      const blob = [
        r.parcel_label,
        r.parcel_municipality,
        r.parcel_id,
        (r.tags || []).join(" ")
      ].join(" ").toLowerCase();
      return blob.includes(q);
    });
  }, [records, search, stateFilter]);
  const sorted = useMemo(() => {
    const dir = sortAsc ? 1 : -1;
    return [...filtered].sort((a, b) => {
      const va = a[sortKey] ?? "";
      const vb = b[sortKey] ?? "";
      if (va < vb) return -1 * dir;
      if (va > vb) return 1 * dir;
      return 0;
    });
  }, [filtered, sortKey, sortAsc]);
  const exportCsv = () => {
    const headers = [
      "Parcel ID",
      "Address",
      "Municipality",
      "Area (m2)",
      "State",
      "Priority",
      "Tags",
      "Lat",
      "Lng",
      "Updated"
    ];
    const rows = sorted.map((r) => [
      r.parcel_id,
      r.parcel_label,
      r.parcel_municipality,
      r.parcel_area,
      r.state,
      r.priority,
      (r.tags || []).join("; "),
      r.parcel_lat,
      r.parcel_lng,
      new Date(r.updated_at).toLocaleDateString()
    ]);
    const csv = [headers, ...rows].map(
      (row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
    ).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `saved_parcels_${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };
  const patchLocal = (id, patch) => {
    setRecords(
      (rs) => rs.map((r) => r.id === id ? { ...r, ...patch, updated_at: (/* @__PURE__ */ new Date()).toISOString() } : r)
    );
  };
  const onChangeState = async (rec, next) => {
    if (rec.state === next || !accessToken) return;
    patchLocal(rec.id, { state: next });
    try {
      const updated = await updatePrmState(accessToken, rec.id, next);
      patchLocal(rec.id, updated);
    } catch {
      patchLocal(rec.id, { state: rec.state });
    }
  };
  const onChangePriority = async (rec, next) => {
    if (rec.priority === next || !accessToken) return;
    patchLocal(rec.id, { priority: next });
    try {
      const updated = await updatePrmPriority(accessToken, rec.id, next);
      patchLocal(rec.id, updated);
    } catch {
      patchLocal(rec.id, { priority: rec.priority });
    }
  };
  const onChangeTags = async (rec, next) => {
    if (!accessToken) return;
    patchLocal(rec.id, { tags: next });
    try {
      const updated = await updatePrmTags(accessToken, rec.id, next);
      patchLocal(rec.id, updated);
    } catch {
      patchLocal(rec.id, { tags: rec.tags });
    }
  };
  const onDelete = async (id) => {
    if (!accessToken) return;
    const prev = records;
    setRecords((rs) => rs.filter((r) => r.id !== id));
    setConfirmDeleteId(null);
    try {
      await deletePrmRecord(accessToken, id);
    } catch {
      setRecords(prev);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-[200] flex items-center justify-center p-4", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/55 backdrop-blur-sm", onClick: onClose }),
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: "relative w-full max-w-5xl max-h-[85vh] rounded-2xl shadow-2xl border overflow-hidden flex flex-col bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700",
        style: { animation: "savedParcelsIn 0.22s cubic-bezier(0.34,1.56,0.64,1) both" },
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-5 py-3.5 border-b border-gray-200 dark:border-gray-700 flex-shrink-0", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5 min-w-0", children: [
              /* @__PURE__ */ jsx(MapPin, { size: 18, className: "text-emerald-600 dark:text-emerald-400 shrink-0" }),
              /* @__PURE__ */ jsx("h2", { className: "text-base font-semibold text-gray-900 dark:text-white", children: t.title }),
              /* @__PURE__ */ jsx("span", { className: "text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400", children: records.length })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: refresh,
                  title: t.refresh,
                  "aria-label": t.refresh,
                  className: "p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
                  children: /* @__PURE__ */ jsx(RefreshCw, { size: 15, className: loading ? "animate-spin" : "" })
                }
              ),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: exportCsv,
                  disabled: records.length === 0,
                  className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 hover:bg-emerald-100 dark:hover:bg-emerald-500/25 transition-colors disabled:opacity-40",
                  children: [
                    /* @__PURE__ */ jsx(Download, { size: 13 }),
                    t.exportCsv
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                "a",
                {
                  href: `${PROOM_APP_URL}/`,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors",
                  children: [
                    /* @__PURE__ */ jsx(LayoutGrid, { size: 13 }),
                    t.openInProom
                  ]
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: onClose,
                  "aria-label": t.close,
                  className: "p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
                  children: /* @__PURE__ */ jsx(X, { size: 17 })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2 px-5 py-2.5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/30", children: [
            /* @__PURE__ */ jsxs("div", { className: "relative flex-1 min-w-[160px] max-w-sm", children: [
              /* @__PURE__ */ jsx(Search, { size: 14, className: "absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: search,
                  onChange: (e) => setSearch(e.target.value),
                  placeholder: t.searchPlaceholder,
                  className: "w-full pl-8 pr-3 py-1.5 rounded-lg text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                value: stateFilter,
                onChange: (e) => setStateFilter(e.target.value),
                className: "px-2.5 py-1.5 rounded-lg text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "all", children: t.filterAllStates }),
                  PRM_STATES.map((s) => /* @__PURE__ */ jsx("option", { value: s.value, children: t.state[s.value] }, s.value))
                ]
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "ml-auto text-[11px] text-gray-500 dark:text-gray-400", children: sorted.length === records.length ? t.showingAll(records.length) : t.showingFiltered(sorted.length, records.length) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-auto", children: !isAuthenticated ? /* @__PURE__ */ jsx(EmptyState, { icon: /* @__PURE__ */ jsx(MapPin, { size: 32, className: "text-gray-400" }), title: t.signinRequired }) : loading ? /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center py-16", children: /* @__PURE__ */ jsx(RefreshCw, { size: 20, className: "animate-spin text-gray-400" }) }) : error ? /* @__PURE__ */ jsx(EmptyState, { icon: /* @__PURE__ */ jsx(X, { size: 32, className: "text-red-400" }), title: t.loadFailed, hint: error }) : records.length === 0 ? /* @__PURE__ */ jsx(EmptyState, { icon: /* @__PURE__ */ jsx(MapPin, { size: 32, className: "text-gray-400" }), title: t.empty, hint: t.emptyHint }) : sorted.length === 0 ? /* @__PURE__ */ jsx(EmptyState, { icon: /* @__PURE__ */ jsx(Search, { size: 32, className: "text-gray-400" }), title: t.noMatch }) : /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
            /* @__PURE__ */ jsx("thead", { className: "sticky top-0 z-10 bg-gray-50 dark:bg-gray-800/80 backdrop-blur", children: /* @__PURE__ */ jsxs("tr", { className: "border-b border-gray-200 dark:border-gray-700", children: [
              /* @__PURE__ */ jsx(Th, { children: /* @__PURE__ */ jsx(SortBtn, { label: t.colAddress, field: "parcel_label", sortKey, sortAsc, onClick: handleSort }) }),
              /* @__PURE__ */ jsx(Th, { children: /* @__PURE__ */ jsx(SortBtn, { label: t.colMunicipality, field: "parcel_municipality", sortKey, sortAsc, onClick: handleSort }) }),
              /* @__PURE__ */ jsx(Th, { children: /* @__PURE__ */ jsx(SortBtn, { label: t.colState, field: "state", sortKey, sortAsc, onClick: handleSort }) }),
              /* @__PURE__ */ jsx(Th, { children: /* @__PURE__ */ jsx(SortBtn, { label: t.colPriority, field: "priority", sortKey, sortAsc, onClick: handleSort }) }),
              /* @__PURE__ */ jsx(Th, { className: "hidden md:table-cell", children: t.colTags }),
              /* @__PURE__ */ jsx(Th, { children: /* @__PURE__ */ jsx(SortBtn, { label: t.colUpdated, field: "updated_at", sortKey, sortAsc, onClick: handleSort }) }),
              /* @__PURE__ */ jsx(Th, { align: "right", children: t.colActions })
            ] }) }),
            /* @__PURE__ */ jsx("tbody", { children: sorted.map((r) => /* @__PURE__ */ jsx(
              Row,
              {
                record: r,
                t,
                openHereLabel: openHereLabel ?? t.openHere,
                onChangeState,
                onChangePriority,
                onChangeTags,
                onDelete: () => setConfirmDeleteId(r.id),
                onOpenHere
              },
              r.id
            )) })
          ] }) }),
          confirmDeleteId && /* @__PURE__ */ jsx(
            ConfirmDelete,
            {
              t,
              onCancel: () => setConfirmDeleteId(null),
              onConfirm: () => onDelete(confirmDeleteId)
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsx("style", { children: `
        @keyframes savedParcelsIn {
          from { opacity: 0; transform: scale(0.92) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      ` })
  ] });
}
function Th({ children, align = "left", className = "" }) {
  return /* @__PURE__ */ jsx("th", { className: `px-3 py-2.5 text-[10px] uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400 ${align === "right" ? "text-right" : "text-left"} ${className}`, children });
}
function SortBtn({ label, field, sortKey, sortAsc, onClick }) {
  const active = sortKey === field;
  return /* @__PURE__ */ jsxs(
    "button",
    {
      onClick: () => onClick(field),
      className: "inline-flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-200 transition-colors",
      children: [
        label,
        /* @__PURE__ */ jsx(
          ArrowUpDown,
          {
            size: 10,
            className: active ? "text-emerald-500" : "opacity-30",
            style: active ? { transform: sortAsc ? void 0 : "scaleY(-1)" } : void 0
          }
        )
      ]
    }
  );
}
function EmptyState({ icon, title, hint }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-16 gap-2 px-4 text-center", children: [
    icon,
    /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-700 dark:text-gray-300", children: title }),
    hint && /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 dark:text-gray-400 max-w-md", children: hint })
  ] });
}
function Row({ record, t, openHereLabel, onChangeState, onChangePriority, onChangeTags, onDelete, onOpenHere }) {
  const stateInfo = PRM_STATES.find((s) => s.value === record.state);
  const priorityInfo = PRM_PRIORITIES.find((p) => p.value === record.priority);
  const params = `?lat=${record.parcel_lat}&lng=${record.parcel_lng}${record.parcel_label ? `&address=${encodeURIComponent(record.parcel_label)}` : ""}`;
  return /* @__PURE__ */ jsxs("tr", { className: "border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors align-top", children: [
    /* @__PURE__ */ jsxs("td", { className: "px-3 py-3", children: [
      /* @__PURE__ */ jsx("div", { className: "font-medium text-gray-900 dark:text-gray-100 text-sm max-w-[220px] truncate", children: record.parcel_label || record.parcel_id }),
      /* @__PURE__ */ jsx("div", { className: "text-[10px] text-gray-500 dark:text-gray-400 font-mono mt-0.5 truncate", children: record.parcel_id })
    ] }),
    /* @__PURE__ */ jsxs("td", { className: "px-3 py-3 text-xs text-gray-600 dark:text-gray-300", children: [
      record.parcel_municipality || "\u2014",
      record.parcel_area > 0 && /* @__PURE__ */ jsxs("div", { className: "text-[10px] text-gray-400 mt-0.5", children: [
        Math.round(record.parcel_area).toLocaleString("de-CH"),
        " m\xB2"
      ] })
    ] }),
    /* @__PURE__ */ jsx("td", { className: "px-3 py-3", children: /* @__PURE__ */ jsx(
      PillSelect,
      {
        value: record.state,
        onChange: (v) => onChangeState(record, v),
        options: PRM_STATES.map((s) => ({ value: s.value, label: t.state[s.value] })),
        dotClass: stateInfo?.bg ?? "bg-slate-500",
        colorClass: stateInfo?.color ?? "text-gray-500"
      }
    ) }),
    /* @__PURE__ */ jsx("td", { className: "px-3 py-3", children: /* @__PURE__ */ jsx(
      PillSelect,
      {
        value: record.priority,
        onChange: (v) => onChangePriority(record, v),
        options: PRM_PRIORITIES.map((p) => ({ value: p.value, label: t.priority[p.value] })),
        colorClass: priorityInfo?.color ?? "text-gray-500"
      }
    ) }),
    /* @__PURE__ */ jsx("td", { className: "px-3 py-3 hidden md:table-cell max-w-[220px]", children: /* @__PURE__ */ jsx(TagEditor, { tags: record.tags || [], onChange: (next) => onChangeTags(record, next), t }) }),
    /* @__PURE__ */ jsx("td", { className: "px-3 py-3 text-[11px] text-gray-500 dark:text-gray-400 whitespace-nowrap", children: new Date(record.updated_at).toLocaleDateString() }),
    /* @__PURE__ */ jsx("td", { className: "px-3 py-3 text-right", children: /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-0.5", children: [
      onOpenHere && /* @__PURE__ */ jsx(ActionBtn, { onClick: () => onOpenHere(record), title: openHereLabel, icon: /* @__PURE__ */ jsx(MapPin, { size: 13 }) }),
      /* @__PURE__ */ jsx(ActionBtn, { href: `${TOOLBOX_APP_URL}/${params}`, title: t.openInToolbox, icon: /* @__PURE__ */ jsx(Compass, { size: 13 }) }),
      /* @__PURE__ */ jsx(ActionBtn, { href: `${GEOPOOL_APP_URL}/${params}`, title: t.openInGeopool, icon: /* @__PURE__ */ jsx(Layers, { size: 13 }) }),
      /* @__PURE__ */ jsx(ActionBtn, { href: `${PROOM_APP_URL}/?prm=${encodeURIComponent(record.id)}`, title: t.openInProom, icon: /* @__PURE__ */ jsx(ExternalLink, { size: 13 }) }),
      /* @__PURE__ */ jsx(ActionBtn, { onClick: onDelete, title: t.delete, icon: /* @__PURE__ */ jsx(Trash2, { size: 13 }), danger: true })
    ] }) })
  ] });
}
function ActionBtn({ onClick, href, title, icon, danger }) {
  const base = "p-1.5 rounded-md transition-colors text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/60";
  const hover = danger ? "hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10" : "hover:text-emerald-600 dark:hover:text-emerald-400";
  const className = `${base} ${hover}`;
  if (href) {
    return /* @__PURE__ */ jsx("a", { href, target: "_blank", rel: "noopener noreferrer", title, className, children: icon });
  }
  return /* @__PURE__ */ jsx("button", { type: "button", onClick, title, className, children: icon });
}
function PillSelect({ value, onChange, options, dotClass, colorClass }) {
  return /* @__PURE__ */ jsxs("label", { className: "inline-flex items-center gap-1.5 cursor-pointer group", children: [
    dotClass && /* @__PURE__ */ jsx("span", { className: `w-1.5 h-1.5 rounded-full ${dotClass} shrink-0` }),
    /* @__PURE__ */ jsx("span", { className: "relative", children: /* @__PURE__ */ jsx(
      "select",
      {
        value,
        onChange: (e) => onChange(e.target.value),
        className: `appearance-none bg-transparent border-0 pr-3 text-xs font-medium cursor-pointer focus:outline-none focus:ring-0 ${colorClass} group-hover:underline`,
        children: options.map((o) => /* @__PURE__ */ jsx("option", { value: o.value, className: "text-gray-900", children: o.label }, o.value))
      }
    ) })
  ] });
}
function TagEditor({ tags, onChange, t }) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");
  const inputRef = useRef(null);
  useEffect(() => {
    if (adding) inputRef.current?.focus();
  }, [adding]);
  const commit = () => {
    const v = draft.trim();
    setDraft("");
    setAdding(false);
    if (!v) return;
    if (tags.includes(v)) return;
    onChange([...tags, v]);
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-1", children: [
    tags.map((tag) => /* @__PURE__ */ jsxs(
      "span",
      {
        className: "inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700",
        children: [
          tag,
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => onChange(tags.filter((x) => x !== tag)),
              className: "text-gray-400 hover:text-red-500",
              "aria-label": t.removeTag(tag),
              children: /* @__PURE__ */ jsx(X, { size: 10 })
            }
          )
        ]
      },
      tag
    )),
    adding ? /* @__PURE__ */ jsx(
      "input",
      {
        ref: inputRef,
        type: "text",
        value: draft,
        onChange: (e) => setDraft(e.target.value),
        onBlur: commit,
        onKeyDown: (e) => {
          if (e.key === "Enter") commit();
          else if (e.key === "Escape") {
            setDraft("");
            setAdding(false);
          }
        },
        placeholder: t.tagPlaceholder,
        className: "text-[10px] px-1.5 py-0.5 rounded bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 w-20 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
      }
    ) : /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        onClick: () => setAdding(true),
        className: "inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 border border-dashed border-gray-300 dark:border-gray-700",
        "aria-label": t.addTag,
        children: [
          /* @__PURE__ */ jsx(Plus, { size: 10 }),
          t.addTag
        ]
      }
    )
  ] });
}
function ConfirmDelete({ t, onCancel, onConfirm }) {
  return /* @__PURE__ */ jsx("div", { className: "absolute inset-0 z-10 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm", children: /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-5 max-w-sm w-full", children: [
    /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-gray-900 dark:text-white", children: t.confirmDeleteTitle }),
    /* @__PURE__ */ jsx("p", { className: "mt-1.5 text-xs text-gray-500 dark:text-gray-400", children: t.confirmDeleteBody }),
    /* @__PURE__ */ jsxs("div", { className: "mt-4 flex justify-end gap-2", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: onCancel,
          className: "px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700",
          children: t.cancel
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: onConfirm,
          className: "px-3 py-1.5 rounded-lg text-xs font-medium bg-red-600 hover:bg-red-500 text-white",
          children: t.delete
        }
      )
    ] })
  ] }) });
}

// src/claire/claireAppCatalog.ts
var SWISSNOVO_SUITE_BLURB = "SwissNovo is a suite of focused web apps for Swiss real estate, built for owners, architects and brokers. Each app does one job well \u2014 valuation, zoning, GIS, monitoring, CRM, and more \u2014 and the toolbox dashboard links them all. Most accept a parcel or coordinates so the user can carry context from one tool to the next.";
var SWISSNOVO_APP_CATALOG = `Valuation & pricing:
- valoo \u2014 map of parcel values; spots pricing hotspots and underpriced pockets. https://swissnovo-valoo.vercel.app
- proove \u2014 instant property valuation with transparent, factor-based pricing and upside estimates. https://proove.vercel.app/
- scoore \u2014 auto-scores parcels on location, infrastructure and development potential. https://swissnovo-scoore.vercel.app/

Maps & GIS data:
- geopool \u2014 visual GIS data browser for real estate, like Google Maps for parcels. https://geopool.vercel.app/
- contoor \u2014 extracts CAD geodata, parcel boundaries and topographic information. https://contoor.vercel.app/
- woom \u2014 detects every available WMS map layer for a parcel. https://swissnovo-woom.vercel.app/
- voogle \u2014 exports high-resolution Street View images for brochures. https://swissnovo-voogle.vercel.app/

Building, terrain & environment:
- roofs \u2014 analyzes building heights and roof structures. https://swissnovo-roofs.vercel.app/
- roots \u2014 researches building age and history for renovation/investment decisions. https://swissnovo-roots.vercel.app/
- hood \u2014 simulates 3D sunlight and shadow patterns for any parcel. https://swissnovo-hood.vercel.app/
- footprint \u2014 analyzes building footprints, coverage ratios and sealed surface. https://swissnovo-footprint.vercel.app/
- soolar \u2014 building-level solar/PV potential from the BFE Sonnendach dataset. https://swissnovo-soolar.vercel.app/
- boom \u2014 Swiss environmental noise map (road & rail) checked against legal limits. https://swissnovo-boom.vercel.app/

Regulations & legal:
- xploore \u2014 finds building regulations, zoning plans and rules for a parcel. https://xploore.vercel.app/
- handbook \u2014 planning-document dataroom with AI summaries and regulation Q&A. https://swissnovo-handbook.vercel.app/
- roolez \u2014 AI-powered analysis and interpretation of building regulations. https://roolez.vercel.app/
- lookup \u2014 OEREB control center for public-law restriction queries. https://swissnovo-lookup.vercel.app/

Monitoring & market signals:
- scoops \u2014 real-time dashboard of property signals and market indicators. https://swissnovo-scoops.vercel.app/
- watchoo \u2014 tracks building permits Switzerland-wide to qualify leads early. https://swissnovo-watchoo.vercel.app/
- vacoo \u2014 monitors Swiss vacancy rates and market availability. https://vacoo.vercel.app/
- groove \u2014 monitors official GWR building data and detects registry changes. https://swissnovo-groove.vercel.app/
- goody \u2014 map of every new building project in Switzerland from the GWR register. https://swissnovo-goody.vercel.app/
- taxoo \u2014 compares Swiss tax rates across municipalities. https://taxoo.vercel.app/

Search & parcel data:
- choose \u2014 SQL-backed parcel filter and export by size, price, city, year. https://swissnovo-choose.vercel.app/
- showroom \u2014 full parcel data overview from an address search. https://swissnovo-showroom.vercel.app/

Pipeline & AI assistants:
- proom \u2014 parcel-first CRM with a Kanban pipeline, saved parcels and activity log. https://swissnovo-proom.vercel.app/
- doorway \u2014 natural-language parcel chat about ownership, zoning and potential. https://swissnovo-doorway.vercel.app/
- booklet \u2014 builds professional property portfolios and company presentations. https://swissnovo-booklet.vercel.app/

Transactions & brokers:
- boost \u2014 compares brokers by performance, commission and specialization. https://swissnovo-boost.vercel.app/
- zeroo \u2014 zero-commission marketplace to buy and sell property directly. https://swissnovo-zeroo.vercel.app/
- realioo \u2014 fractional, tokenized Swiss real-estate investment. https://realioo.brokereum.xyz

Hub:
- toolbox \u2014 the suite dashboard: search and launch every SwissNovo tool. https://swissnovo-toolbox.vercel.app/`;

// src/claire/geminiClient.ts
var DEFAULT_GEMINI_MODEL = "gemini-3.1-flash-lite";
var GEMINI_ENDPOINT = (model, key) => `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(
  key
)}`;
var FIELD_LABELS = {
  estimated_price_m2: "Estimated price per m\xB2 (CHF)",
  estimated_price: "Estimated total value (CHF)",
  price_m2: "Market price per m\xB2 (CHF)",
  price: "Market price (CHF)",
  area_m2: "Plot area (m\xB2)",
  parcel_area: "Plot area (m\xB2)",
  flaeche: "Plot area (m\xB2)",
  grundflaeche: "Ground area (m\xB2)",
  bldg_count: "Building count",
  building_count: "Building count",
  bldg_size: "Building footprint (m\xB2)",
  bldg_floors: "Building floors",
  bldg_height_mean: "Mean building height (m)",
  bldg_constr_year: "Construction year",
  construction_year: "Construction year",
  baujahr: "Construction year",
  rooms: "Rooms",
  zimmer: "Rooms",
  floors: "Floors",
  geschosse: "Floors",
  cz_local: "Local construction zone",
  cz_harmonized: "Harmonized zone type",
  construction_zone: "Construction zone",
  bauzone: "Construction zone",
  nutzungszone: "Usage zone",
  address: "Address",
  street: "Street",
  strasse: "Street",
  streetname: "Street",
  cityname: "City",
  city: "City",
  ort: "City",
  gemeinde: "Municipality",
  municipality: "Municipality",
  fso_name_2021: "Municipality (FSO)",
  districtname: "District",
  plz: "Postal code",
  zip: "Postal code",
  canton: "Canton",
  kanton: "Canton",
  cz_canton_name: "Canton",
  parcel_id: "Parcel ID",
  parcel_local_id: "Parcel local ID",
  gwr_egid: "GWR EGID",
  grundstueck_nr: "Plot number",
  parzelle: "Parcel number",
  nummer: "Number",
  owner: "Owner",
  is_sell: "Listed for sale"
};
function formatValue(key, raw) {
  if (raw === null || raw === void 0 || raw === "") return null;
  if (typeof raw === "boolean") return raw ? "yes" : "no";
  if (typeof raw === "number") {
    if (!Number.isFinite(raw)) return null;
    if (key.includes("price") || key.endsWith("_chf")) {
      return Math.round(raw).toLocaleString("en-US");
    }
    if (Number.isInteger(raw)) return raw.toString();
    return raw.toFixed(2);
  }
  return String(raw);
}
function buildParcelContextSummary(input) {
  const lines = [];
  const seen = /* @__PURE__ */ new Set();
  const props = { ...input.properties ?? {} };
  if (input.enrichment) {
    for (const [k, v] of Object.entries(input.enrichment)) {
      const lower = k.toLowerCase();
      if (props[lower] === void 0) props[lower] = v;
    }
  }
  for (const [rawKey, value] of Object.entries(props)) {
    const key = rawKey.toLowerCase();
    const label = FIELD_LABELS[key];
    if (!label) continue;
    if (seen.has(label)) continue;
    const formatted = formatValue(key, value);
    if (formatted === null) continue;
    seen.add(label);
    lines.push(`- ${label}: ${formatted}`);
  }
  const { lng, lat } = input.lngLat;
  lines.push(`- WGS84 coordinates: ${lat.toFixed(6)}, ${lng.toFixed(6)}`);
  if (input.lv95) {
    lines.push(`- Swiss LV95 coordinates: E ${input.lv95.E}, N ${input.lv95.N}`);
  }
  return lines.join("\n");
}
function systemInstruction(appName) {
  const where = appName ? `${appName}, a SwissNovo real-estate analytics app` : "a SwissNovo real-estate analytics app";
  const currentApp = appName ?? "the current app";
  return `You are "Claire", the AI parcel assistant embedded inside ${where}. You help investors, developers and property owners understand a single selected parcel.

Tone and format:
- Concise, expert, and grounded in the parcel context provided. Avoid filler.
- Use short paragraphs and tight bullet lists when listing items.
- Prices are in CHF. Areas in m\xB2. Use Swiss thousand separators when natural.
- Answer in the same language as the user's question (default English).

Rules:
- Always stay focused on the currently selected parcel below. If the user asks for nearby comparisons, market trends, or legal advice, give helpful general guidance grounded in the parcel context and clearly mark estimates as such.
- Never invent specific cadastral, legal, or pricing figures that aren't supplied. If data is missing, say so briefly and suggest what would be needed.
- When the user asks about the neighbourhood (schools, transit, shops, restaurants, parks, services), draw from the "Surrounding location & amenities" block if present \u2014 quote names and distances faithfully and do not invent POIs not listed.
- If a "Location-accessibility score" is present, treat it as the parcel's scoore walkability score: it runs 0\u20136, where 6 means key amenities are at the doorstep. Cite it as "<n>/6" and explain weak categories using the per-category breakdown.
- Mention regulatory caveats for Switzerland where relevant (e.g. zoning law, Lex Koller, planning permissions) at a high level.
- When another SwissNovo app would clearly serve the user's need better than this one, recommend it by name with its URL \u2014 usually a single suggestion. Never recommend ${currentApp} itself (it is the app they are already using). Point users to the toolbox dashboard when they want to browse the whole suite.
- Do not output disclaimers longer than one short sentence.

About the SwissNovo suite:
${SWISSNOVO_SUITE_BLURB}

${SWISSNOVO_APP_CATALOG}`;
}
var GeminiConfigError = class extends Error {
  constructor() {
    super(
      "Gemini API key missing. Set VITE_GEMINI_API_KEY in the app\u2019s .env file."
    );
    this.name = "GeminiConfigError";
  }
};
async function generateParcelChatReply({
  apiKey,
  model,
  appName,
  parcelContext,
  history,
  signal
}) {
  if (!apiKey) throw new GeminiConfigError();
  if (history.length === 0)
    throw new Error("history must contain at least one user message");
  const systemText = `${systemInstruction(appName)}

Selected parcel context:
${parcelContext}`;
  const contents = history.map((turn) => ({
    role: turn.role === "assistant" ? "model" : "user",
    parts: [{ text: turn.content }]
  }));
  const res = await fetch(
    GEMINI_ENDPOINT(model || DEFAULT_GEMINI_MODEL, apiKey),
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { role: "system", parts: [{ text: systemText }] },
        contents,
        generationConfig: {
          temperature: 0.55,
          topP: 0.9,
          maxOutputTokens: 800
        },
        safetySettings: []
      }),
      signal
    }
  );
  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error(`Gemini request failed (${res.status})`);
  }
  if (!res.ok) {
    const msg = data?.error?.message ?? `Gemini request failed (${res.status})`;
    throw new Error(msg);
  }
  if (data.promptFeedback?.blockReason) {
    throw new Error(`Response blocked: ${data.promptFeedback.blockReason}`);
  }
  const text = data.candidates?.flatMap((c) => c.content?.parts ?? []).map((p) => p.text ?? "").join("").trim();
  if (!text) throw new Error("Empty response from Gemini.");
  return text;
}

// src/claire/elevenLabsClient.ts
var DEFAULT_TTS_MODEL = "eleven_turbo_v2_5";
var DEFAULT_VOICE_ID = "EXAVITQu4vr4xnSDxMaL";
var TTS_ENDPOINT = (voiceId) => `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}`;
var ElevenLabsConfigError = class extends Error {
  constructor() {
    super("ElevenLabs API key missing \u2014 Claire\u2019s voice is disabled.");
    this.name = "ElevenLabsConfigError";
  }
};
function plainSpeechText(text) {
  return text.replace(/\*\*([^*]+)\*\*/g, "$1").replace(/`([^`]+)`/g, "$1").replace(/^\s*[-*]\s+/gm, "").replace(/\n{2,}/g, ". ").replace(/\n/g, " ").replace(/\s{2,}/g, " ").trim();
}
async function synthesizeSpeech({
  apiKey,
  voiceId,
  model,
  text,
  signal
}) {
  if (!apiKey) throw new ElevenLabsConfigError();
  const clean = plainSpeechText(text);
  if (!clean) throw new Error("Nothing to speak.");
  const res = await fetch(TTS_ENDPOINT(voiceId || DEFAULT_VOICE_ID), {
    method: "POST",
    headers: {
      "xi-api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "audio/mpeg"
    },
    body: JSON.stringify({
      text: clean,
      model_id: model || DEFAULT_TTS_MODEL,
      // Balanced settings: stable enough for an informational assistant,
      // with a touch of expressiveness so Claire doesn't sound robotic.
      voice_settings: {
        stability: 0.45,
        similarity_boost: 0.8,
        style: 0.1,
        use_speaker_boost: true
      }
    }),
    signal
  });
  if (!res.ok) {
    let detail = `ElevenLabs request failed (${res.status})`;
    try {
      const err = await res.json();
      const d = err?.detail;
      if (typeof d === "string") detail = d;
      else if (d?.message) detail = d.message;
    } catch {
    }
    throw new Error(detail);
  }
  return res.blob();
}

// src/claire/voiceWorklets.ts
var MIC_WORKLET_SOURCE = `
class ClaireMicProcessor extends AudioWorkletProcessor {
    constructor(options) {
        super();
        const opts = (options && options.processorOptions) || {};
        // 1600 samples at 16 kHz = 100 ms. Smaller buffers raise mic-to-cloud
        // latency; larger buffers raise WebSocket framing overhead.
        this.bufferSize = opts.bufferSize || 1600;
        this.buffer = new Int16Array(this.bufferSize);
        this.index = 0;
    }
    process(inputs) {
        const input = inputs[0];
        if (!input || input.length === 0) return true;
        const channel = input[0];
        if (!channel) return true;
        for (let i = 0; i < channel.length; i++) {
            let s = channel[i];
            if (s > 1) s = 1; else if (s < -1) s = -1;
            this.buffer[this.index++] = s < 0 ? s * 0x8000 : s * 0x7fff;
            if (this.index >= this.bufferSize) {
                this.port.postMessage(this.buffer.slice(0, this.index));
                this.index = 0;
            }
        }
        return true;
    }
}
registerProcessor('claire-mic-processor', ClaireMicProcessor);
`;
var SPEAKER_WORKLET_SOURCE = `
class ClaireSpeakerProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        this.queue = [];
        this.current = null;
        this.idx = 0;
        this.port.onmessage = (event) => {
            const d = event.data;
            if (!d) return;
            if (d.type === 'audio' && d.samples) {
                this.queue.push(d.samples);
            } else if (d.type === 'clear') {
                this.queue = [];
                this.current = null;
                this.idx = 0;
            }
        };
    }
    process(_inputs, outputs) {
        const output = outputs[0];
        if (!output || output.length === 0) return true;
        const channel = output[0];
        for (let i = 0; i < channel.length; i++) {
            while (!this.current || this.idx >= this.current.length) {
                if (this.queue.length === 0) {
                    this.current = null;
                    break;
                }
                this.current = this.queue.shift();
                this.idx = 0;
            }
            channel[i] = this.current ? this.current[this.idx++] / 0x8000 : 0;
        }
        return true;
    }
}
registerProcessor('claire-speaker-processor', ClaireSpeakerProcessor);
`;

// src/claire/voiceCall.ts
var DEFAULT_WS_URL = "wss://res.zeroo.ch/res_api/claire/voice/ws";
var MIC_BUFFER_SIZE = 1600;
var MIC_SAMPLE_RATE = 16e3;
var SPEAKER_SAMPLE_RATE = 24e3;
function generateConversationId() {
  const c = typeof globalThis !== "undefined" ? globalThis.crypto : void 0;
  if (c && typeof c.randomUUID === "function") {
    return c.randomUUID();
  }
  return `cv_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}
async function registerWorklet(ctx, source) {
  const blob = new Blob([source], { type: "application/javascript" });
  const url = URL.createObjectURL(blob);
  try {
    await ctx.audioWorklet.addModule(url);
  } finally {
    URL.revokeObjectURL(url);
  }
}
async function startVoiceCall(options) {
  const conversationId = generateConversationId();
  const wsUrl = options.wsUrl || DEFAULT_WS_URL;
  if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
    throw new Error("Voice calls require a browser with mic support.");
  }
  let stream;
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        channelCount: 1,
        sampleRate: MIC_SAMPLE_RATE,
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      }
    });
  } catch {
    throw new Error("Microphone permission was denied or unavailable.");
  }
  const AudioCtor = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtor) {
    stream.getTracks().forEach((t) => t.stop());
    throw new Error("Voice calls require AudioContext support.");
  }
  const micCtx = new AudioCtor({ sampleRate: MIC_SAMPLE_RATE });
  const playCtx = new AudioCtor({ sampleRate: SPEAKER_SAMPLE_RATE });
  try {
    await Promise.all([
      registerWorklet(micCtx, MIC_WORKLET_SOURCE),
      registerWorklet(playCtx, SPEAKER_WORKLET_SOURCE)
    ]);
  } catch (err) {
    stream.getTracks().forEach((t) => t.stop());
    await micCtx.close().catch(() => {
    });
    await playCtx.close().catch(() => {
    });
    throw new Error(
      err instanceof Error ? `Could not initialise audio worklets: ${err.message}` : "Could not initialise audio worklets."
    );
  }
  await Promise.all([
    micCtx.state === "suspended" ? micCtx.resume() : Promise.resolve(),
    playCtx.state === "suspended" ? playCtx.resume() : Promise.resolve()
  ]);
  const speakerNode = new AudioWorkletNode(playCtx, "claire-speaker-processor");
  speakerNode.connect(playCtx.destination);
  const micSource = micCtx.createMediaStreamSource(stream);
  const micNode = new AudioWorkletNode(micCtx, "claire-mic-processor", {
    processorOptions: { bufferSize: MIC_BUFFER_SIZE }
  });
  micSource.connect(micNode);
  let closed = false;
  let teardownPromise = null;
  const ws = new WebSocket(wsUrl);
  ws.binaryType = "arraybuffer";
  micNode.port.onmessage = (event) => {
    if (closed || ws.readyState !== WebSocket.OPEN) return;
    const samples = event.data;
    if (!samples || samples.length === 0) return;
    try {
      ws.send(samples.buffer);
    } catch {
    }
  };
  function teardown() {
    if (teardownPromise) return teardownPromise;
    teardownPromise = (async () => {
      closed = true;
      try {
        micNode.port.onmessage = null;
      } catch {
      }
      try {
        micNode.disconnect();
      } catch {
      }
      try {
        micSource.disconnect();
      } catch {
      }
      try {
        speakerNode.port.postMessage({ type: "clear" });
      } catch {
      }
      try {
        speakerNode.disconnect();
      } catch {
      }
      try {
        stream.getTracks().forEach((t) => t.stop());
      } catch {
      }
      try {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: "end" }));
        }
      } catch {
      }
      try {
        ws.close();
      } catch {
      }
      await micCtx.close().catch(() => {
      });
      await playCtx.close().catch(() => {
      });
      options.onDisconnect?.();
    })();
    return teardownPromise;
  }
  ws.addEventListener("open", () => {
    try {
      ws.send(
        JSON.stringify({
          type: "setup",
          conversationId,
          appName: options.appName,
          language: (options.language || "de").toLowerCase(),
          address: options.address || "",
          parcelContext: options.parcelContext || ""
        })
      );
      options.onDebug?.({ type: "setup_sent", conversationId });
    } catch {
      options.onError?.("Failed to send setup frame.");
      void teardown();
    }
  });
  ws.addEventListener("message", (event) => {
    if (closed) return;
    if (typeof event.data === "string") {
      let msg;
      try {
        msg = JSON.parse(event.data);
      } catch {
        return;
      }
      const type = msg.type;
      if (type === "connected") {
        options.onConnect?.({ conversationId });
      } else if (type === "mode") {
        const mode = msg.mode;
        if (mode === "listening" || mode === "speaking") {
          options.onModeChange?.({ mode });
        }
      } else if (type === "transcript") {
        const role = msg.role;
        const text = msg.text;
        if ((role === "user" || role === "agent") && typeof text === "string") {
          options.onMessage?.({ role, message: text });
        }
      } else if (type === "interrupted") {
        try {
          speakerNode.port.postMessage({ type: "clear" });
        } catch {
        }
        options.onInterrupted?.();
      } else if (type === "error") {
        options.onError?.(
          typeof msg.message === "string" ? msg.message : "Voice call error."
        );
        void teardown();
      } else if (type === "closed") {
        options.onDebug?.({ type: "closed", reason: msg.reason });
        void teardown();
      }
    } else if (event.data instanceof ArrayBuffer) {
      const samples = new Int16Array(event.data);
      try {
        speakerNode.port.postMessage({ type: "audio", samples });
      } catch {
      }
    }
  });
  ws.addEventListener("close", () => {
    if (!closed) void teardown();
  });
  ws.addEventListener("error", () => {
    if (!closed) {
      options.onError?.("Voice connection failed.");
      void teardown();
    }
  });
  return {
    conversationId,
    async endSession() {
      await teardown();
    }
  };
}

// src/signal/client.ts
var DEFAULT_ENDPOINT = "/api/signal-collect";
function createSignalClient(options) {
  const appName = options.appName.toLowerCase();
  const endpoint = options.endpoint ?? DEFAULT_ENDPOINT;
  return {
    async send(userAction, target) {
      try {
        await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            app_name: appName,
            user_action: userAction,
            // The suite convention sends the target coordinates as both the
            // user `lat`/`lng` and the `target_*` fields; the RES API
            // resolves the canonical parcel from `target_lat`/`target_lng`.
            lat: target?.lat,
            lng: target?.lng,
            target_address: target?.address,
            target_lat: target?.lat,
            target_lng: target?.lng,
            meta_data: target?.metaData
          })
        });
      } catch (err) {
        console.error("Signal collection error:", err);
      }
    }
  };
}

// src/claire/signal.ts
async function sendClaireMessageSignal({
  appName,
  lat,
  lng,
  address,
  source
}) {
  await createSignalClient({ appName }).send("Claire Assistant Message", {
    address,
    lat,
    lng,
    metaData: source ? { source } : void 0
  });
}

// src/claire/claireContext.ts
var IDENTIFY_API = "https://api3.geo.admin.ch/rest/services/api/MapServer/identify";
var GWR_LAYER = "ch.bfs.gebaeude_wohnungs_register";
var BAUZONEN_LAYER = "ch.are.bauzonen";
var PLZ_LAYER = "ch.swisstopo-vd.ortschaftenverzeichnis_plz";
var GKAT = {
  "1010": "Provisional accommodation",
  "1020": "Residential building (residential use only)",
  "1030": "Residential building with secondary use",
  "1040": "Building with partial residential use",
  "1060": "Building without residential use",
  "1080": "Special structure"
};
var GKLAS = {
  "1110": "One-dwelling building",
  "1121": "Two-dwelling building",
  "1122": "Building with three or more dwellings",
  "1130": "Residential building for communities",
  "1211": "Hotel building",
  "1212": "Other short-stay accommodation building",
  "1220": "Office building",
  "1230": "Wholesale / retail building",
  "1231": "Restaurant / bar building",
  "1241": "Transport / communications building",
  "1242": "Garage building",
  "1251": "Industrial building",
  "1252": "Tank / silo / warehouse building",
  "1261": "Culture / leisure building",
  "1262": "Museum / library building",
  "1263": "School / university building",
  "1264": "Hospital building",
  "1265": "Sports hall",
  "1271": "Agricultural building",
  "1272": "Church / religious building",
  "1273": "Historic monument",
  "1274": "Other non-residential building",
  "1275": "Other building",
  "1276": "Protective structure"
};
var GSTAT = {
  "1001": "Planned",
  "1002": "Authorised",
  "1003": "Under construction",
  "1004": "Existing",
  "1005": "Not usable",
  "1007": "Demolished",
  "1008": "Not built"
};
var GBAUP = {
  "8011": "before 1919",
  "8012": "1919\u20131945",
  "8013": "1946\u20131960",
  "8014": "1961\u20131970",
  "8015": "1971\u20131980",
  "8016": "1981\u20131985",
  "8017": "1986\u20131990",
  "8018": "1991\u20131995",
  "8019": "1996\u20132000",
  "8020": "2001\u20132005",
  "8021": "2006\u20132010",
  "8022": "2011\u20132015",
  "8023": "2016\u20132020",
  "8024": "2021\u20132025",
  "8025": "2026\u20132030"
};
function str(v) {
  if (v === void 0 || v === null || v === "") return void 0;
  return String(v);
}
function num(v) {
  if (v === void 0 || v === null || v === "") return void 0;
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : void 0;
}
function firstString(attrs, keys) {
  for (const k of keys) {
    const s = str(attrs[k]);
    if (s !== void 0) return s;
  }
  return void 0;
}
function gwrLines(p) {
  const lines = [];
  const add = (label, value) => {
    if (value !== void 0 && value !== "") lines.push(`- ${label}: ${value}`);
  };
  add("GWR building ID (EGID)", str(p.egid));
  add("Building address (GWR)", str(p.strname_deinr));
  const place = [str(p.dplz4) ?? str(p.plz_plz6), str(p.ggdename ?? p.dplzname)].filter(Boolean).join(" ");
  add("Municipality", [place, str(p.gdekt)].filter(Boolean).join(", ") || void 0);
  add("Official parcel ID (EGRID)", str(p.egrid));
  const year = num(p.gbauj);
  add("Construction year", year ?? (str(p.gbaup) && GBAUP[String(p.gbaup)]));
  add("Floors above ground", num(p.gastw));
  add("Dwellings", num(p.ganzwhg));
  add("Building footprint", num(p.garea) !== void 0 ? `${num(p.garea)} m\xB2` : void 0);
  add("Building volume", num(p.gvol) !== void 0 ? `${num(p.gvol)} m\xB3` : void 0);
  add(
    "Energy reference area",
    num(p.gebf) !== void 0 ? `${num(p.gebf)} m\xB2` : void 0
  );
  add("Building category", str(p.gkat) && GKAT[String(p.gkat)]);
  add("Building class", str(p.gklas) && GKLAS[String(p.gklas)]);
  add("Building status", str(p.gstat) && GSTAT[String(p.gstat)]);
  const rooms = Array.isArray(p.wazim) ? p.wazim.map(num).filter((n) => n !== void 0) : [];
  if (rooms.length > 0) {
    const min = Math.min(...rooms);
    const max = Math.max(...rooms);
    add("Dwelling sizes", min === max ? `${min} rooms` : `${min}\u2013${max} rooms`);
  }
  return lines;
}
async function fetchClaireContext(lng, lat, signal) {
  const delta = 12e-4;
  const params = new URLSearchParams({
    geometry: `${lng},${lat}`,
    geometryType: "esriGeometryPoint",
    geometryFormat: "geojson",
    imageDisplay: "1024,768,96",
    mapExtent: `${lng - delta},${lat - delta},${lng + delta},${lat + delta}`,
    tolerance: "6",
    layers: `all:${GWR_LAYER},${BAUZONEN_LAYER},${PLZ_LAYER}`,
    sr: "4326",
    returnGeometry: "false",
    lang: "en"
  });
  let results;
  try {
    const res = await fetch(`${IDENTIFY_API}?${params}`, { signal });
    if (!res.ok) return { text: "" };
    const data = await res.json();
    results = data.results ?? [];
  } catch {
    return { text: "" };
  }
  const sections = [];
  let address;
  const gwr = results.find((r) => r.layerBodId === GWR_LAYER);
  if (gwr) {
    const p = gwr.properties ?? gwr.attributes ?? {};
    const lines = gwrLines(p);
    if (lines.length > 0) {
      sections.push(`Federal Register of Buildings and Dwellings (GWR):
${lines.join("\n")}`);
    }
    const street = str(p.strname_deinr);
    if (street) {
      const city = str(p.ggdename) ?? str(p.dplzname);
      const zip = str(p.dplz4) ?? str(p.plz_plz6);
      const place = [zip, city].filter(Boolean).join(" ");
      address = place ? `${street}, ${place}` : street;
    }
  }
  const zone = results.find((r) => r.layerBodId === BAUZONEN_LAYER);
  const zoneName = zone ? firstString(zone.properties ?? zone.attributes ?? {}, [
    "ch_bez_d",
    "ch_bez_f"
  ]) : void 0;
  const plz = results.find((r) => r.layerBodId === PLZ_LAYER);
  const plzAttrs = plz ? plz.properties ?? plz.attributes ?? {} : {};
  const town = firstString(plzAttrs, ["ortbez27", "ortbez18", "ortschaftsname"]);
  const code = firstString(plzAttrs, ["plz", "postleitzahl"]);
  const misc = [];
  if (zoneName) misc.push(`- Harmonised building zone (ARE): ${zoneName}`);
  if (town || code) {
    misc.push(`- Locality: ${[code, town].filter(Boolean).join(" ")}`);
  }
  if (misc.length > 0) {
    sections.push(`Official zoning & locality (swisstopo / ARE):
${misc.join("\n")}`);
  }
  const text = sections.length === 0 ? "" : `Authoritative Swiss federal records for this location:

${sections.join("\n\n")}`;
  return { text, address };
}

// src/claire/claireScore.ts
var SCORE_CATEGORIES = [
  { name: "Transport", minPOIs: 2, perfectDistance: 100, radius: 1e3, penaltyFactor: 1, weight: 1 },
  { name: "Utilities", minPOIs: 2, perfectDistance: 100, radius: 1e3, penaltyFactor: 1, weight: 1 },
  { name: "Education", minPOIs: 1, perfectDistance: 200, radius: 5e3, penaltyFactor: 1, weight: 1 },
  { name: "Health", minPOIs: 2, perfectDistance: 200, radius: 1e3, penaltyFactor: 1, weight: 1 },
  { name: "Groceries", minPOIs: 3, perfectDistance: 50, radius: 1e3, penaltyFactor: 1, weight: 1 },
  { name: "Food_Dining", minPOIs: 3, perfectDistance: 50, radius: 1e3, penaltyFactor: 1, weight: 1 },
  { name: "Recreation", minPOIs: 2, perfectDistance: 200, radius: 2e3, penaltyFactor: 1, weight: 1 },
  { name: "Public_Services", minPOIs: 2, perfectDistance: 200, radius: 2e3, penaltyFactor: 1, weight: 1 },
  { name: "Community", minPOIs: 2, perfectDistance: 200, radius: 1e3, penaltyFactor: 1, weight: 1 },
  { name: "Outdoor", minPOIs: 2, perfectDistance: 300, radius: 5e3, penaltyFactor: 1, weight: 1 }
];
function poiScore(distance, perfectDistance, penaltyFactor) {
  if (distance <= 0) return 6;
  const score = 6 - penaltyFactor * Math.log2(distance / perfectDistance);
  return Math.max(0, Math.min(6, score));
}
function categoryScore(cat, distances) {
  const nearest = distances.filter((d) => d <= cat.radius).sort((a, b) => a - b).slice(0, cat.minPOIs).map((d) => poiScore(d, cat.perfectDistance, cat.penaltyFactor));
  while (nearest.length < cat.minPOIs) nearest.push(0);
  return nearest.reduce((acc, s) => acc + s, 0) / cat.minPOIs;
}
function computeLocationScore(categoryDistances) {
  const byCategory = {};
  let weightedSum = 0;
  let totalWeight = 0;
  for (const cat of SCORE_CATEGORIES) {
    const distances = categoryDistances[cat.name] ?? [];
    const score = distances.length > 0 ? categoryScore(cat, distances) : 0;
    byCategory[cat.name] = Math.round(score * 100) / 100;
    weightedSum += score * cat.weight;
    totalWeight += cat.weight;
  }
  const total = totalWeight > 0 ? Math.round(weightedSum / totalWeight * 100) / 100 : 0;
  return { total, byCategory };
}

// src/claire/clairePOIs.ts
var POI_ENDPOINT = "/api/claire-pois";
var TAG_CATEGORY = {
  "amenity=restaurant": "Food_Dining",
  "amenity=cafe": "Food_Dining",
  "amenity=bar": "Food_Dining",
  "amenity=pub": "Food_Dining",
  "amenity=biergarten": "Food_Dining",
  "amenity=fast_food": "Food_Dining",
  "amenity=ice_cream": "Food_Dining",
  "amenity=food_court": "Food_Dining",
  "shop=supermarket": "Groceries",
  "shop=convenience": "Groceries",
  "shop=bakery": "Groceries",
  "shop=butcher": "Groceries",
  "shop=greengrocer": "Groceries",
  "shop=deli": "Groceries",
  "shop=organic": "Groceries",
  "shop=beverages": "Groceries",
  "shop=cheese": "Groceries",
  "amenity=hospital": "Health",
  "amenity=clinic": "Health",
  "amenity=pharmacy": "Health",
  "amenity=doctors": "Health",
  "healthcare=doctor": "Health",
  "healthcare=dentist": "Health",
  "healthcare=clinic": "Health",
  "healthcare=hospital": "Health",
  "healthcare=pharmacy": "Health",
  "amenity=school": "Education",
  "amenity=kindergarten": "Education",
  "amenity=library": "Education",
  "amenity=university": "Education",
  "amenity=college": "Education",
  "amenity=childcare": "Education",
  "amenity=bus_station": "Transport",
  "highway=bus_stop": "Transport",
  "railway=station": "Transport",
  "railway=halt": "Transport",
  "railway=tram_stop": "Transport",
  "amenity=post_office": "Public_Services",
  "amenity=police": "Public_Services",
  "amenity=townhall": "Public_Services",
  "amenity=marketplace": "Public_Services",
  "amenity=bank": "Utilities",
  "amenity=atm": "Utilities",
  "amenity=money_exchange": "Utilities",
  "amenity=fuel": "Utilities",
  "amenity=charging_station": "Utilities",
  "amenity=cinema": "Recreation",
  "amenity=theatre": "Recreation",
  "amenity=arts_centre": "Recreation",
  "amenity=museum": "Recreation",
  "amenity=gallery": "Recreation",
  "leisure=sports_centre": "Recreation",
  "leisure=fitness_centre": "Recreation",
  "leisure=stadium": "Recreation",
  "leisure=park": "Outdoor",
  "leisure=playground": "Outdoor",
  "amenity=community_centre": "Community",
  "amenity=place_of_worship": "Community",
  "amenity=social_facility": "Community"
};
var CATEGORY_LABEL = {
  Transport: "Transport",
  Education: "Education",
  Groceries: "Groceries",
  Food_Dining: "Food & dining",
  Health: "Health",
  Public_Services: "Public services",
  Recreation: "Recreation",
  Outdoor: "Outdoors",
  Utilities: "Money & fuel",
  Community: "Community"
};
var CATEGORY_ORDER = [
  "Transport",
  "Education",
  "Groceries",
  "Food_Dining",
  "Health",
  "Public_Services",
  "Recreation",
  "Outdoor",
  "Utilities",
  "Community"
];
var CAP_PER_CATEGORY = 5;
function haversineMetres(lat1, lng1, lat2, lng2) {
  const R = 6371e3;
  const toRad = (x) => x * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}
function coordsOf(el) {
  if (typeof el.lat === "number" && typeof el.lon === "number")
    return { lat: el.lat, lng: el.lon };
  if (el.center) return { lat: el.center.lat, lng: el.center.lon };
  return null;
}
function categoryOf(tags) {
  for (const [k, v] of Object.entries(tags)) {
    const cat = TAG_CATEGORY[`${k}=${v}`];
    if (cat) return cat;
  }
  return null;
}
function nameOf(tags) {
  if (tags.name) return tags.name;
  const primary = tags.amenity ?? tags.shop ?? tags.leisure ?? tags.railway ?? tags.highway ?? tags.healthcare;
  if (primary) {
    return primary.charAt(0).toUpperCase() + primary.slice(1).replace(/_/g, " ");
  }
  return "Unnamed";
}
function formatDistance(metres) {
  if (metres < 1e3) return `${Math.round(metres)} m`;
  if (metres < 1e4) return `${(metres / 1e3).toFixed(1)} km`;
  return `${Math.round(metres / 1e3)} km`;
}
async function fetchClairePOIs(lng, lat, signal) {
  let data;
  try {
    const res = await fetch(POI_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lat, lng }),
      signal
    });
    if (!res.ok) return { text: "", count: 0, score: null };
    data = await res.json();
  } catch {
    return { text: "", count: 0, score: null };
  }
  const elements = data.elements ?? [];
  if (elements.length === 0) return { text: "", count: 0, score: null };
  const buckets = {};
  let total = 0;
  for (const el of elements) {
    if (!el.tags) continue;
    const c = coordsOf(el);
    if (!c) continue;
    const cat = categoryOf(el.tags);
    if (!cat) continue;
    const distance = haversineMetres(lat, lng, c.lat, c.lng);
    (buckets[cat] ?? (buckets[cat] = [])).push({ name: nameOf(el.tags), distance });
    total += 1;
  }
  if (total === 0) return { text: "", count: 0, score: null };
  const distancesByCategory = {};
  for (const [cat, items] of Object.entries(buckets)) {
    distancesByCategory[cat] = items.map((i) => i.distance);
  }
  const score = computeLocationScore(distancesByCategory);
  const perCategory = CATEGORY_ORDER.map(
    (cat) => `${CATEGORY_LABEL[cat]} ${score.byCategory[cat].toFixed(1)}`
  ).join(", ");
  const poiLines = [];
  for (const cat of CATEGORY_ORDER) {
    const items = buckets[cat];
    if (!items || items.length === 0) continue;
    items.sort((a, b) => a.distance - b.distance);
    const top = items.slice(0, CAP_PER_CATEGORY);
    const list = top.map((p) => `${p.name} (${formatDistance(p.distance)})`).join(", ");
    const suffix = items.length > top.length ? `, +${items.length - top.length} more` : "";
    poiLines.push(
      `- ${CATEGORY_LABEL[cat]} (${items.length} within radius): ${list}${suffix}`
    );
  }
  const text = `Surrounding location & amenities (OpenStreetMap):
Location-accessibility score (scoore walkability model, 0\u20136 where 6 means key amenities are at the doorstep): ${score.total.toFixed(1)} / 6.
Per category (0\u20136): ${perCategory}.
Nearest points of interest:
${poiLines.join("\n")}`;
  return { text, count: total, score };
}

// src/claire/claireConversation.ts
var CLAIRE_API_BASE = "https://res.zeroo.ch/res_api/claire";
async function loadClaireConversation(parcelId, accessToken) {
  if (!accessToken || !parcelId) return [];
  try {
    const url = `${CLAIRE_API_BASE}/conversation?parcel_id=${encodeURIComponent(
      parcelId
    )}`;
    const res = await fetch(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/json" }
    });
    if (!res.ok) return [];
    const data = await res.json();
    return sanitizeTurns(data?.messages);
  } catch {
    return [];
  }
}
async function saveClaireConversation({
  parcelId,
  messages,
  accessToken,
  appName,
  address,
  lat,
  lng
}) {
  if (!accessToken || !parcelId) return;
  try {
    await fetch(`${CLAIRE_API_BASE}/conversation`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        parcel_id: parcelId,
        app_name: appName,
        messages: messages.map(({ role, content }) => ({ role, content })),
        target_address: address,
        target_lat: lat,
        target_lng: lng
      })
    });
  } catch {
  }
}
function sanitizeTurns(raw) {
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (t) => !!t && typeof t === "object" && (t.role === "user" || t.role === "assistant") && typeof t.content === "string"
  ).map(({ role, content }) => ({ role, content }));
}
var CLAIRE_SVG = `<svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
  <style>
    .open-eyes { animation: openBlink 2.2s infinite; transform-origin: center; }
    .closed-eyes { animation: closedBlink 2.2s infinite; opacity: 0; }
    @keyframes openBlink { 0%, 78%, 100% { opacity: 1; } 82%, 88% { opacity: 0; } }
    @keyframes closedBlink { 0%, 78%, 100% { opacity: 0; } 82%, 88% { opacity: 1; } }
  </style>
  <path d="M91 98 C84 105 74 109 63 109 C38 109 18 89 18 64 C18 39 38 19 63 19 C88 19 108 39 108 64 L108 93 C108 102 112 107 118 108" fill="none" stroke="#141414" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"></path>
  <g class="open-eyes" fill="#141414">
    <circle cx="51" cy="58" r="4"></circle>
    <circle cx="77" cy="58" r="4"></circle>
  </g>
  <g class="closed-eyes" fill="none" stroke="#141414" stroke-width="4" stroke-linecap="round">
    <path d="M46 58 Q51 62 56 58"></path>
    <path d="M72 58 Q77 62 82 58"></path>
  </g>
  <path d="M56 75 Q64 82 72 75" fill="none" stroke="#141414" stroke-width="4" stroke-linecap="round"></path>
</svg>`;
var CLAIRE_AVATAR = `data:image/svg+xml,${encodeURIComponent(CLAIRE_SVG)}`;
var QUICK_PROMPTS = [
  {
    label: "Investment potential",
    prompt: "What is the estimated investment potential of this parcel?"
  },
  {
    label: "Zoning restrictions",
    prompt: "Summarize zoning restrictions for this property."
  },
  {
    label: "What can be built?",
    prompt: "What can legally be built here?"
  },
  {
    label: "Compare nearby",
    prompt: "Compare this parcel with nearby properties."
  },
  {
    label: "Risks to know",
    prompt: "What risks should I know about?"
  },
  {
    label: "Redevelopment",
    prompt: "Estimate redevelopment opportunities."
  },
  {
    label: "Market insights",
    prompt: "Show market insights for this area."
  }
];
function newId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
function resolveParcelId(props) {
  for (const key of ["parcel_id", "egrid", "id_parcel", "id"]) {
    const v = props[key];
    if (v !== void 0 && v !== null && v !== "") return String(v);
  }
  return null;
}
function renderAssistantText(text) {
  const paragraphs = text.split(/\n{2,}/);
  return paragraphs.map((para, pi) => /* @__PURE__ */ jsx("p", { className: pi === 0 ? "" : "mt-2", children: para.split(/\n/).map((line, li, arr) => /* @__PURE__ */ jsxs("span", { children: [
    renderInlineBold(line),
    li < arr.length - 1 ? /* @__PURE__ */ jsx("br", {}) : null
  ] }, li)) }, pi));
}
function renderInlineBold(line) {
  const parts = line.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    if (/^\*\*[^*]+\*\*$/.test(p)) {
      return /* @__PURE__ */ jsx("strong", { className: "font-semibold", children: p.slice(2, -2) }, i);
    }
    return /* @__PURE__ */ jsx("span", { children: p }, i);
  });
}
var ClaireAssistant = ({
  appName,
  geminiApiKey,
  geminiModel,
  elevenLabsApiKey,
  elevenLabsVoiceId,
  elevenLabsModel,
  voiceCallEnabled = false,
  properties,
  enrichment,
  lngLat,
  lv95,
  headerAddress
}) => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const abortRef = useRef(null);
  const voiceAvailable = useMemo(
    () => Boolean(elevenLabsApiKey),
    [elevenLabsApiKey]
  );
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [speakingId, setSpeakingId] = useState(null);
  const [speechReady, setSpeechReady] = useState(false);
  const [speechError, setSpeechError] = useState(null);
  const audioRef = useRef(null);
  const audioUrlRef = useRef(null);
  const speechAbortRef = useRef(null);
  const speakingIdRef = useRef(null);
  const voiceEnabledRef = useRef(voiceEnabled);
  useEffect(() => {
    speakingIdRef.current = speakingId;
  }, [speakingId]);
  useEffect(() => {
    voiceEnabledRef.current = voiceEnabled;
  }, [voiceEnabled]);
  const [callStatus, setCallStatus] = useState("idle");
  const [callMode, setCallMode] = useState(null);
  const [callError, setCallError] = useState(null);
  const [voiceTurns, setVoiceTurns] = useState([]);
  const voiceTranscriptRef = useRef(null);
  const conversationRef = useRef(null);
  const { isAuthenticated, getAccessToken } = useAuth();
  const configured = useMemo(() => Boolean(geminiApiKey), [geminiApiKey]);
  const parcelId = useMemo(() => resolveParcelId(properties), [properties]);
  const parcelContext = useMemo(
    () => buildParcelContextSummary({
      properties,
      enrichment: enrichment ?? null,
      lngLat,
      lv95: lv95 ?? null
    }),
    [properties, enrichment, lngLat, lv95]
  );
  const [official, setOfficial] = useState({
    text: ""
  });
  useEffect(() => {
    const controller = new AbortController();
    setOfficial({ text: "" });
    void fetchClaireContext(lngLat.lng, lngLat.lat, controller.signal).then((res) => setOfficial(res)).catch(() => {
    });
    return () => controller.abort();
  }, [lngLat.lng, lngLat.lat]);
  const [pois, setPois] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    setPois("");
    void fetchClairePOIs(lngLat.lng, lngLat.lat, controller.signal).then((res) => setPois(res.text)).catch(() => {
    });
    return () => controller.abort();
  }, [lngLat.lng, lngLat.lat]);
  const fullContext = useMemo(
    () => [parcelContext, official.text, pois].filter(Boolean).join("\n\n"),
    [parcelContext, official.text, pois]
  );
  const endCall = useCallback(async () => {
    const conv = conversationRef.current;
    conversationRef.current = null;
    if (!conv) {
      setCallStatus("idle");
      setCallMode(null);
      return;
    }
    setCallStatus("ending");
    try {
      await conv.endSession();
    } catch {
    }
    setCallStatus("idle");
    setCallMode(null);
    setVoiceTurns([]);
  }, []);
  const stopSpeech = useCallback(() => {
    speechAbortRef.current?.abort();
    speechAbortRef.current = null;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
    setSpeakingId(null);
    setSpeechReady(false);
  }, []);
  useEffect(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    stopSpeech();
    void endCall();
    setMessages([]);
    setInput("");
    setError(null);
    setSpeechError(null);
    setCallError(null);
    setLoading(false);
  }, [lngLat.lng, lngLat.lat, stopSpeech, endCall]);
  useEffect(() => {
    if (!parcelId || !isAuthenticated) return;
    const token = getAccessToken();
    if (!token) return;
    let cancelled = false;
    setHistoryLoading(true);
    void loadClaireConversation(parcelId, token).then((turns) => {
      if (cancelled || turns.length === 0) return;
      setMessages(
        turns.map((t) => ({ id: newId(), role: t.role, content: t.content }))
      );
    }).finally(() => {
      if (!cancelled) setHistoryLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [parcelId, isAuthenticated, getAccessToken]);
  useEffect(() => {
    if (!open || !scrollRef.current) return;
    scrollRef.current.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth"
    });
  }, [messages, loading, open]);
  useEffect(() => {
    if (voiceTranscriptRef.current) {
      voiceTranscriptRef.current.scrollTop = voiceTranscriptRef.current.scrollHeight;
    }
  }, [voiceTurns]);
  useEffect(
    () => () => {
      abortRef.current?.abort();
      stopSpeech();
      void endCall();
    },
    [stopSpeech, endCall]
  );
  const speakMessage = useCallback(
    async (id, text) => {
      if (!elevenLabsApiKey) return;
      if (speakingIdRef.current === id) {
        stopSpeech();
        return;
      }
      stopSpeech();
      const controller = new AbortController();
      speechAbortRef.current = controller;
      setSpeakingId(id);
      setSpeechReady(false);
      setSpeechError(null);
      try {
        const blob = await synthesizeSpeech({
          apiKey: elevenLabsApiKey,
          voiceId: elevenLabsVoiceId,
          model: elevenLabsModel,
          text,
          signal: controller.signal
        });
        if (controller.signal.aborted) return;
        const url = URL.createObjectURL(blob);
        audioUrlRef.current = url;
        const audio = new Audio(url);
        audioRef.current = audio;
        const clear = () => {
          if (speakingIdRef.current === id) stopSpeech();
        };
        audio.onended = clear;
        audio.onerror = clear;
        await audio.play();
        if (speakingIdRef.current === id) setSpeechReady(true);
      } catch (err) {
        if (err?.name === "AbortError") return;
        setSpeechError(
          err instanceof Error ? err.message : "Claire could not speak."
        );
        setSpeakingId(null);
        setSpeechReady(false);
      }
    },
    [elevenLabsApiKey, elevenLabsVoiceId, elevenLabsModel, stopSpeech]
  );
  const startCall = useCallback(async () => {
    if (callStatus !== "idle") return;
    setCallError(null);
    setCallStatus("connecting");
    try {
      const language = typeof document !== "undefined" && document.documentElement.lang || "de";
      const conv = await startVoiceCall({
        appName,
        parcelContext: fullContext,
        address: headerAddress || official.address,
        language,
        onConnect: () => {
          setCallStatus("connected");
        },
        onDisconnect: () => {
          conversationRef.current = null;
          setCallStatus("idle");
          setCallMode(null);
        },
        onModeChange: ({ mode }) => {
          if (mode === "listening" || mode === "speaking") {
            setCallMode(mode);
          }
        },
        onMessage: ({ message, role }) => {
          if (!message) return;
          setVoiceTurns((prev) => [
            ...prev,
            { id: newId(), role, text: message }
          ]);
        },
        onDebug: (info) => {
          console.log("[claire-voice]", info);
        },
        onError: (message) => {
          setCallError(message || "Voice call failed.");
          conversationRef.current = null;
          setCallStatus("idle");
          setCallMode(null);
        }
      });
      conversationRef.current = conv;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not start the call.";
      setCallError(msg);
      setCallStatus("idle");
      setCallMode(null);
    }
  }, [callStatus, fullContext, appName, headerAddress, official.address]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 220);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(focusTimer);
    };
  }, [open]);
  const sendMessage = useCallback(
    async (text, source = "composer") => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;
      if (!configured) {
        setError(
          "Gemini API key missing. Set VITE_GEMINI_API_KEY in the app\u2019s .env file."
        );
        return;
      }
      const userMsg = {
        id: newId(),
        role: "user",
        content: trimmed
      };
      const nextHistory = [
        ...messages.map(({ role, content }) => ({ role, content })),
        { role: "user", content: trimmed }
      ];
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setError(null);
      setLoading(true);
      const address = headerAddress || official.address;
      void sendClaireMessageSignal({
        appName,
        lat: lngLat.lat,
        lng: lngLat.lng,
        address,
        source
      });
      const controller = new AbortController();
      abortRef.current = controller;
      try {
        const reply = await generateParcelChatReply({
          apiKey: geminiApiKey ?? "",
          model: geminiModel,
          appName,
          parcelContext: fullContext,
          history: nextHistory,
          signal: controller.signal
        });
        const assistantId = newId();
        setMessages((prev) => [
          ...prev,
          { id: assistantId, role: "assistant", content: reply }
        ]);
        if (voiceEnabledRef.current) {
          void speakMessage(assistantId, reply);
        }
        if (parcelId) {
          void saveClaireConversation({
            parcelId,
            messages: [...nextHistory, { role: "assistant", content: reply }],
            accessToken: getAccessToken(),
            appName,
            address,
            lat: lngLat.lat,
            lng: lngLat.lng
          });
        }
      } catch (err) {
        if (err?.name === "AbortError") return;
        const message = err instanceof GeminiConfigError ? err.message : err instanceof Error ? err.message : "Something went wrong.";
        setError(message);
      } finally {
        setLoading(false);
        abortRef.current = null;
      }
    },
    [
      configured,
      loading,
      messages,
      fullContext,
      lngLat.lat,
      lngLat.lng,
      parcelId,
      headerAddress,
      official.address,
      getAccessToken,
      appName,
      geminiApiKey,
      geminiModel,
      speakMessage
    ]
  );
  const onSubmit = (e) => {
    e.preventDefault();
    void sendMessage(input);
  };
  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage(input);
    }
  };
  const onQuickPrompt = (prompt) => {
    void sendMessage(prompt, "quick_prompt");
    inputRef.current?.focus();
  };
  const sendDisabled = !input.trim() || loading;
  const showQuickPrompts = messages.length === 0 && !loading && !historyLoading;
  const subtitle = headerAddress ? `About ${headerAddress}` : "Powered by Gemini";
  const launcherPos = "right-6 bottom-6";
  const cardPos = "inset-x-3 top-20 bottom-3 md:inset-x-auto md:top-auto md:bottom-6 md:right-6 md:left-auto md:w-[23rem] md:h-auto md:max-h-[min(78vh,560px)]";
  const launcher = /* @__PURE__ */ jsxs(
    "button",
    {
      type: "button",
      onClick: () => setOpen(true),
      "aria-label": "Open Claire, the AI parcel assistant",
      title: "Ask Claire about this parcel",
      className: `fixed z-[60] ${launcherPos} group flex items-center justify-center w-14 h-14 rounded-full transition-all duration-200 active:scale-95 ${"bg-gradient-to-br from-amber-400 to-orange-500 text-[#1a0f00] shadow-[0_10px_30px_-8px_rgba(251,191,36,0.55)] hover:brightness-110" }`,
      children: [
        /* @__PURE__ */ jsx("span", { className: "absolute inset-0 rounded-full bg-amber-400/50 chat-launch-ping" }),
        /* @__PURE__ */ jsx(
          "img",
          {
            src: CLAIRE_AVATAR,
            alt: "",
            className: "relative w-full h-full rounded-full object-cover"
          }
        )
      ]
    }
  );
  const card = /* @__PURE__ */ jsxs(
    "div",
    {
      role: "dialog",
      "aria-label": "Claire \u2014 AI Parcel Assistant",
      className: `fixed z-[60] ${cardPos} chat-card-pop flex flex-col overflow-hidden rounded-2xl ${"bg-[#0b0f15] ring-1 ring-white/[0.08] shadow-[0_24px_60px_-20px_rgba(0,0,0,0.85)]" }`,
      children: [
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: `flex items-center gap-3 px-3.5 py-3 shrink-0 ${"bg-gradient-to-b from-white/[0.04] to-transparent border-b border-white/[0.06]" }`,
            children: [
              /* @__PURE__ */ jsxs(
                "div",
                {
                  className: `relative w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${"bg-gradient-to-br from-amber-400/20 via-orange-500/15 to-rose-500/10 ring-1 ring-amber-300/20" }`,
                  children: [
                    /* @__PURE__ */ jsx(
                      "img",
                      {
                        src: CLAIRE_AVATAR,
                        alt: "Claire",
                        className: "w-full h-full rounded-xl object-cover"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "span",
                      {
                        className: `absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full ring-2 ${"bg-emerald-400 ring-[#0b0f15]" }`
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: `text-[13px] font-semibold leading-tight ${"text-white" }`,
                    children: "Claire"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: `text-[10.5px] font-medium uppercase tracking-[0.1em] mt-0.5 truncate ${"text-amber-200/70" }`,
                    children: subtitle
                  }
                )
              ] }),
              voiceCallEnabled && /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => callStatus === "idle" ? void startCall() : void endCall(),
                  disabled: callStatus === "connecting" || callStatus === "ending",
                  "aria-label": callStatus === "idle" ? "Call Claire" : "End call",
                  title: callStatus === "idle" ? "Have a spoken conversation with Claire" : "End the call",
                  className: `w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${callStatus === "idle" ? "text-gray-400 hover:text-emerald-300 hover:bg-emerald-400/10" : "text-rose-200 bg-rose-500/15 ring-1 ring-rose-400/30 hover:bg-rose-500/25 disabled:opacity-60"}`,
                  children: callStatus === "idle" ? /* @__PURE__ */ jsx(Phone, { size: 15 }) : /* @__PURE__ */ jsx(PhoneOff, { size: 15 })
                }
              ),
              voiceAvailable && /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setVoiceEnabled((v) => {
                    if (v) stopSpeech();
                    return !v;
                  }),
                  "aria-pressed": voiceEnabled,
                  "aria-label": voiceEnabled ? "Mute Claire" : "Let Claire speak",
                  title: voiceEnabled ? "Claire speaks her replies aloud \u2014 click to mute" : "Hear Claire speak her replies",
                  className: `w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${voiceEnabled ? "text-amber-300 bg-amber-400/15 ring-1 ring-amber-300/25" : "text-gray-400 hover:text-white hover:bg-white/[0.08]"}`,
                  children: voiceEnabled ? /* @__PURE__ */ jsx(Volume2, { size: 15 }) : /* @__PURE__ */ jsx(VolumeX, { size: 15 })
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setOpen(false),
                  "aria-label": "Close Claire",
                  className: `w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${"text-gray-400 hover:text-white hover:bg-white/[0.08]" }`,
                  children: /* @__PURE__ */ jsx(X, { size: 16 })
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "div",
          {
            ref: scrollRef,
            className: "chat-scroll flex-1 md:flex-none md:max-h-[340px] overflow-y-auto px-3.5 py-3 space-y-2",
            "aria-live": "polite",
            children: [
              messages.length === 0 && historyLoading && /* @__PURE__ */ jsxs(
                "div",
                {
                  className: `flex items-center gap-2 rounded-xl px-3 py-2.5 text-[12px] ${"bg-white/[0.025] text-gray-400 ring-1 ring-white/[0.04]" }`,
                  children: [
                    /* @__PURE__ */ jsx(Loader2, { size: 13, className: "animate-spin shrink-0" }),
                    "Restoring your conversation about this parcel\u2026"
                  ]
                }
              ),
              messages.length === 0 && !historyLoading && /* @__PURE__ */ jsx(
                "div",
                {
                  className: `rounded-xl px-3 py-2.5 text-[12px] leading-relaxed ${"bg-white/[0.025] text-gray-300 ring-1 ring-white/[0.04]" }`,
                  children: "Hi, I\u2019m Claire. Ask me anything about this parcel \u2014 zoning, value, what can be built, comparable properties, or hidden risks. My answers are scoped to the selection on the map."
                }
              ),
              messages.map(
                (msg) => msg.role === "user" ? /* @__PURE__ */ jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: `max-w-[88%] rounded-2xl rounded-tr-md px-3 py-2 text-[12.5px] leading-relaxed whitespace-pre-wrap ${"bg-amber-400/15 text-amber-50 ring-1 ring-amber-300/20" }`,
                    children: msg.content
                  }
                ) }, msg.id) : /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2", children: [
                  /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: `w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${"bg-gradient-to-br from-amber-400/25 to-rose-500/15 ring-1 ring-amber-300/20" }`,
                      children: /* @__PURE__ */ jsx(
                        "img",
                        {
                          src: CLAIRE_AVATAR,
                          alt: "",
                          className: "w-full h-full rounded-lg object-cover"
                        }
                      )
                    }
                  ),
                  /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-start gap-1 max-w-[88%]", children: [
                    /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: `rounded-2xl rounded-tl-md px-3 py-2 text-[12.5px] leading-relaxed ${"bg-white/[0.04] text-gray-100 ring-1 ring-white/[0.05]" }`,
                        children: renderAssistantText(msg.content)
                      }
                    ),
                    voiceAvailable && /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => void speakMessage(msg.id, msg.content),
                        "aria-label": speakingId === msg.id ? "Stop Claire speaking" : "Play this reply aloud",
                        title: speakingId === msg.id ? "Stop" : "Hear this reply",
                        className: "flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-medium text-gray-500 hover:text-amber-200 hover:bg-white/[0.05] transition-colors",
                        children: speakingId === msg.id ? speechReady ? /* @__PURE__ */ jsxs(Fragment, { children: [
                          /* @__PURE__ */ jsx(VolumeX, { size: 11 }),
                          "Stop"
                        ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                          /* @__PURE__ */ jsx(Loader2, { size: 11, className: "animate-spin" }),
                          "Loading\u2026"
                        ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                          /* @__PURE__ */ jsx(Volume2, { size: 11 }),
                          "Play"
                        ] })
                      }
                    )
                  ] })
                ] }, msg.id)
              ),
              loading && /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2", children: [
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: `w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${"bg-gradient-to-br from-amber-400/25 to-rose-500/15 ring-1 ring-amber-300/20" }`,
                    children: /* @__PURE__ */ jsx(
                      "img",
                      {
                        src: CLAIRE_AVATAR,
                        alt: "",
                        className: "w-full h-full rounded-lg object-cover animate-pulse"
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsxs(
                  "div",
                  {
                    className: `rounded-2xl rounded-tl-md px-3 py-2.5 flex items-center gap-1.5 ${"bg-white/[0.04] ring-1 ring-white/[0.05]" }`,
                    "aria-label": "Claire is typing",
                    children: [
                      /* @__PURE__ */ jsx("span", { className: "chat-dot" }),
                      /* @__PURE__ */ jsx("span", { className: "chat-dot", style: { animationDelay: "0.15s" } }),
                      /* @__PURE__ */ jsx("span", { className: "chat-dot", style: { animationDelay: "0.3s" } })
                    ]
                  }
                )
              ] }),
              error && /* @__PURE__ */ jsxs(
                "div",
                {
                  className: `flex items-start gap-2 rounded-xl px-3 py-2 text-[12px] ${"bg-rose-500/10 text-rose-200 ring-1 ring-rose-400/20" }`,
                  children: [
                    /* @__PURE__ */ jsx(AlertCircle, { size: 13, className: "shrink-0 mt-0.5" }),
                    /* @__PURE__ */ jsx("span", { children: error })
                  ]
                }
              ),
              speechError && /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2 rounded-xl px-3 py-2 text-[11.5px] bg-amber-500/10 text-amber-200/90 ring-1 ring-amber-400/20", children: [
                /* @__PURE__ */ jsx(VolumeX, { size: 12, className: "shrink-0 mt-0.5" }),
                /* @__PURE__ */ jsxs("span", { children: [
                  "Claire\u2019s voice is unavailable: ",
                  speechError
                ] })
              ] }),
              callError && callStatus === "idle" && /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2 rounded-xl px-3 py-2 text-[11.5px] bg-rose-500/10 text-rose-200/90 ring-1 ring-rose-400/20", children: [
                /* @__PURE__ */ jsx(PhoneOff, { size: 12, className: "shrink-0 mt-0.5" }),
                /* @__PURE__ */ jsxs("span", { children: [
                  "Voice call ended: ",
                  callError
                ] })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: `shrink-0 px-3.5 pt-2.5 pb-3 ${"border-t border-white/[0.06] bg-gradient-to-t from-white/[0.025] to-transparent" }`,
            children: [
              showQuickPrompts && /* @__PURE__ */ jsx("div", { className: "mb-2.5 flex flex-wrap gap-1.5", children: QUICK_PROMPTS.map((q) => /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => onQuickPrompt(q.prompt),
                  title: q.prompt,
                  className: `text-[11px] font-medium px-2.5 py-1 rounded-full transition-all duration-150 ${"bg-white/[0.04] text-gray-200 ring-1 ring-white/[0.06] hover:bg-amber-400/10 hover:text-amber-200 hover:ring-amber-300/30" }`,
                  children: q.label
                },
                q.label
              )) }),
              /* @__PURE__ */ jsxs("form", { onSubmit, children: [
                /* @__PURE__ */ jsxs(
                  "div",
                  {
                    className: `flex items-end gap-1.5 rounded-xl px-2.5 py-1.5 transition-all duration-150 focus-within:ring-2 ${"bg-white/[0.04] ring-1 ring-white/[0.06] focus-within:ring-amber-400/40" }`,
                    children: [
                      /* @__PURE__ */ jsx(
                        "textarea",
                        {
                          ref: inputRef,
                          value: input,
                          onChange: (e) => setInput(e.target.value),
                          onKeyDown,
                          placeholder: "Ask Claire about this parcel...",
                          rows: 1,
                          className: `flex-1 resize-none bg-transparent outline-none text-[12.5px] leading-snug py-1.5 max-h-24 ${"text-gray-100 placeholder:text-gray-500" }`
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          type: "submit",
                          disabled: sendDisabled,
                          "aria-label": "Send message",
                          className: `w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-150 ${sendDisabled ? "bg-white/[0.04] text-gray-600 cursor-not-allowed"  : "bg-gradient-to-br from-amber-400 to-orange-500 text-white hover:brightness-105 shadow-[0_4px_12px_-4px_rgba(251,191,36,0.5)]"}`,
                          children: loading ? /* @__PURE__ */ jsx(Loader2, { size: 14, className: "animate-spin" }) : /* @__PURE__ */ jsx(Send, { size: 13 })
                        }
                      )
                    ]
                  }
                ),
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: `mt-1.5 text-[10px] tracking-wide ${"text-gray-500" }`,
                    children: "Enter to send \xB7 Shift+Enter for newline"
                  }
                )
              ] })
            ]
          }
        ),
        callStatus !== "idle" && /* @__PURE__ */ jsxs("div", { className: "absolute inset-x-0 bottom-0 top-[58px] flex flex-col items-center justify-center px-4 bg-[#0b0f15]/95 backdrop-blur-sm", children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: `w-20 h-20 rounded-2xl flex items-center justify-center bg-gradient-to-br from-amber-400/25 to-rose-500/15 ring-1 ring-amber-300/30 transition-transform ${callMode === "speaking" ? "scale-105 animate-pulse" : ""}`,
              children: /* @__PURE__ */ jsx(
                "img",
                {
                  src: CLAIRE_AVATAR,
                  alt: "",
                  className: "w-full h-full rounded-2xl object-cover"
                }
              )
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "mt-4 text-sm font-semibold text-white", children: callStatus === "connecting" ? "Calling Claire\u2026" : callStatus === "ending" ? "Ending call\u2026" : callMode === "speaking" ? "Claire is speaking" : "Listening\u2026" }),
          /* @__PURE__ */ jsx("div", { className: "mt-1 text-[11px] text-amber-200/70 min-h-[14px]", children: callStatus === "connected" ? "Speak naturally \u2014 this is a live voice call." : "\xA0" }),
          voiceTurns.length > 0 && /* @__PURE__ */ jsx(
            "div",
            {
              ref: voiceTranscriptRef,
              className: "mt-4 w-full max-w-[22rem] max-h-[12rem] overflow-y-auto px-3 py-2 rounded-lg bg-white/[0.04] ring-1 ring-white/[0.06] text-[12px] leading-snug text-left space-y-1.5",
              children: voiceTurns.map((t) => /* @__PURE__ */ jsxs(
                "div",
                {
                  className: t.role === "user" ? "text-amber-200/90" : "text-gray-100",
                  children: [
                    /* @__PURE__ */ jsx("span", { className: "font-semibold mr-1", children: t.role === "user" ? "You:" : "Claire:" }),
                    t.text
                  ]
                },
                t.id
              ))
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => void endCall(),
              disabled: callStatus === "connecting" || callStatus === "ending",
              className: "mt-5 inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-[12px] font-semibold text-white bg-rose-500 hover:bg-rose-400 disabled:opacity-60 transition-colors shadow-[0_4px_12px_-4px_rgba(244,63,94,0.6)]",
              children: [
                /* @__PURE__ */ jsx(PhoneOff, { size: 13 }),
                " End call"
              ]
            }
          ),
          callError && /* @__PURE__ */ jsx("div", { className: "mt-3 text-[11px] text-rose-300 text-center max-w-[18rem]", children: callError })
        ] })
      ]
    }
  );
  return createPortal(
    /* @__PURE__ */ jsxs(Fragment, { children: [
      open ? card : launcher,
      /* @__PURE__ */ jsx("style", { children: `
        .chat-scroll::-webkit-scrollbar { width: 3px; }
        .chat-scroll::-webkit-scrollbar-track { background: transparent; }
        .chat-scroll::-webkit-scrollbar-thumb {
          background: ${"rgba(255,255,255,0.08)" };
          border-radius: 4px;
        }
        .chat-dot {
          width: 5px;
          height: 5px;
          border-radius: 9999px;
          background: ${"rgba(251,191,36,0.85)" };
          display: inline-block;
          animation: chatDot 1.1s infinite ease-in-out;
        }
        @keyframes chatDot {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-3px); opacity: 1; }
        }
        .chat-launch-ping {
          animation: chatLaunchPing 2.4s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        @keyframes chatLaunchPing {
          0% { transform: scale(1); opacity: 0.6; }
          70%, 100% { transform: scale(2); opacity: 0; }
        }
        .chat-card-pop {
          animation: chatCardPop 0.22s cubic-bezier(0.16, 1, 0.3, 1) both;
          transform-origin: bottom right;
        }
        @keyframes chatCardPop {
          from { opacity: 0; transform: translateY(12px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      ` })
    ] }),
    document.body
  );
};
var ClaireAssistant_default = ClaireAssistant;
var STYLE_ID = "swn-skeleton-styles";
var STYLE_CONTENT = '.swn-skeleton{--swn-skeleton-color:rgba(15,23,42,0.09);border-radius:8px;background-color:var(--swn-skeleton-color);animation:swn-skeleton-blink 1.8s ease-in-out infinite}.swn-skeleton-group{display:flex;flex-direction:column}.dark .swn-skeleton,[data-theme="dark"] .swn-skeleton{--swn-skeleton-color:rgba(255,255,255,0.11)}@keyframes swn-skeleton-blink{0%,100%{opacity:1}50%{opacity:0.4}}@media (prefers-reduced-motion:reduce){.swn-skeleton{animation-duration:3s}}';
function useSkeletonStyles() {
  useInsertionEffect(() => {
    if (typeof document === "undefined") return;
    if (document.getElementById(STYLE_ID)) return;
    const el = document.createElement("style");
    el.id = STYLE_ID;
    el.textContent = STYLE_CONTENT;
    document.head.appendChild(el);
  }, []);
}
var DARK_COLOR = "rgba(255,255,255,0.11)";
var LIGHT_COLOR = "rgba(15,23,42,0.09)";
function toDim(v) {
  return typeof v === "number" ? `${v}px` : v;
}
function Skeleton({
  width,
  height,
  radius,
  circle,
  dark,
  delay,
  className,
  style,
  as
}) {
  useSkeletonStyles();
  const Tag3 = as ?? "div";
  const css = {
    width: toDim(width),
    height: toDim(height) ?? (circle ? toDim(width) : void 0),
    borderRadius: circle ? "9999px" : toDim(radius),
    animationDelay: delay,
    ...dark != null ? { "--swn-skeleton-color": dark ? DARK_COLOR : LIGHT_COLOR } : {},
    ...style
  };
  return /* @__PURE__ */ jsx(
    Tag3,
    {
      className: `swn-skeleton${className ? ` ${className}` : ""}`,
      style: css,
      "aria-hidden": "true"
    }
  );
}
function SkeletonText({
  lines = 3,
  gap = 8,
  lineHeight = 12,
  lastLineWidth = "60%",
  dark,
  className,
  style
}) {
  useSkeletonStyles();
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: `swn-skeleton-group${className ? ` ${className}` : ""}`,
      style: { gap: toDim(gap), ...style },
      "aria-hidden": "true",
      children: Array.from({ length: Math.max(1, lines) }).map((_, i) => /* @__PURE__ */ jsx(
        Skeleton,
        {
          height: lineHeight,
          dark,
          delay: `${i * 90}ms`,
          width: i === lines - 1 && lines > 1 ? lastLineWidth : "100%"
        },
        i
      ))
    }
  );
}
function SkeletonGroup({ children }) {
  return /* @__PURE__ */ jsx("div", { role: "status", "aria-busy": "true", "aria-live": "polite", children });
}
function Avatar({ url, initials, size = 28, className = "" }) {
  const [errored, setErrored] = useState(false);
  const show = url && !errored;
  if (!show) {
    return /* @__PURE__ */ jsx(
      "span",
      {
        className: `inline-flex items-center justify-center rounded-full bg-red-600 font-semibold text-white ${className}`,
        style: { width: size, height: size, fontSize: Math.round(size * 0.42) },
        children: initials
      }
    );
  }
  return /* @__PURE__ */ jsx(
    "img",
    {
      src: url,
      alt: "",
      width: size,
      height: size,
      onError: () => setErrored(true),
      className: `rounded-full bg-gray-100 object-contain p-0.5 dark:bg-gray-700 ${className}`,
      style: { width: size, height: size }
    }
  );
}

// src/profile/avatars.ts
var TWEMOJI_TAG = "15.1.0";
var TWEMOJI_BASE = `https://cdn.jsdelivr.net/gh/jdecked/twemoji@${TWEMOJI_TAG}/assets/svg`;
var avatarOptions = [
  { id: "fox", label: "Fox", codepoint: "1f98a", tint: "#fde4d3" },
  { id: "panda", label: "Panda", codepoint: "1f43c", tint: "#e8eef2" },
  { id: "tiger", label: "Tiger", codepoint: "1f42f", tint: "#fdeecb" },
  { id: "koala", label: "Koala", codepoint: "1f428", tint: "#e3e7ea" },
  { id: "owl", label: "Owl", codepoint: "1f989", tint: "#ece1d2" },
  { id: "rabbit", label: "Rabbit", codepoint: "1f430", tint: "#f6e7ee" },
  { id: "cat", label: "Cat", codepoint: "1f431", tint: "#fbe6cf" },
  { id: "dog", label: "Dog", codepoint: "1f436", tint: "#f0e4d4" },
  { id: "bear", label: "Bear", codepoint: "1f43b", tint: "#e9ddcf" },
  { id: "monkey", label: "Monkey", codepoint: "1f435", tint: "#ede0d1" },
  { id: "penguin", label: "Penguin", codepoint: "1f427", tint: "#dde6ec" },
  { id: "lion", label: "Lion", codepoint: "1f981", tint: "#fdeccb" },
  { id: "frog", label: "Frog", codepoint: "1f438", tint: "#dff0d8" },
  { id: "chick", label: "Chick", codepoint: "1f425", tint: "#fdf3cf" },
  { id: "unicorn", label: "Unicorn", codepoint: "1f984", tint: "#f1e3f5" },
  { id: "octopus", label: "Octopus", codepoint: "1f419", tint: "#f7dde0" }
];
function avatarUrl(opt) {
  return `${TWEMOJI_BASE}/${opt.codepoint}.svg`;
}
function avatarUrlById(id) {
  if (!id) return null;
  const opt = avatarOptions.find((a) => a.id === id);
  return opt ? avatarUrl(opt) : null;
}
function avatarUrlFromSeed(seed) {
  return `https://api.dicebear.com/9.x/pixel-art/svg?seed=${encodeURIComponent(seed)}&radius=50`;
}

// src/profile/identity.ts
function readClaim(p, key) {
  const v = p?.[key];
  return typeof v === "string" && v.trim() ? v.trim() : void 0;
}
function emailOf(user) {
  return readClaim(user?.profile, "email") ?? "";
}
function fullNameOf(user) {
  const p = user?.profile;
  const name = readClaim(p, "name");
  if (name) return name;
  const given = readClaim(p, "given_name");
  const family = readClaim(p, "family_name");
  const combined = [given, family].filter(Boolean).join(" ").trim();
  if (combined) return combined;
  return readClaim(p, "preferred_username") ?? "";
}
function firstNameOf(user) {
  const given = readClaim(user?.profile, "given_name");
  if (given) return given;
  const full = fullNameOf(user);
  if (full) {
    const head = full.split(/\s+/)[0];
    if (head) return head;
  }
  const email = emailOf(user);
  if (email.includes("@")) return email.split("@")[0];
  return email || "Account";
}
function initialsOf(user) {
  const source = fullNameOf(user) || emailOf(user);
  if (!source) return "?";
  if (source.includes("@")) return source[0].toUpperCase();
  const parts = source.split(/\s+/).filter(Boolean);
  const letters = parts.slice(0, 2).map((p) => p[0].toUpperCase()).join("");
  return letters || source[0].toUpperCase();
}
function pictureOf(user) {
  return readClaim(user?.profile, "picture") ?? null;
}

// src/profile/profileStore.ts
var LS_KEY = "swissnovo:profile";
var LEGACY_AVATAR_KEY = "swissnovo:avatar_id";
var DEFAULT_PROFILE_URL = "https://res.zeroo.ch/res_api/swissnovo_user/profile";
function profileApiUrl() {
  try {
    const env = import.meta.env;
    const override = env?.VITE_PROFILE_API_URL?.trim();
    if (override) return override;
  } catch {
  }
  return DEFAULT_PROFILE_URL;
}
function defaultProfile() {
  return { avatar_id: null, gender: "unspecified", age: null, about: "" };
}
function coerce(raw) {
  const base = defaultProfile();
  if (!raw || typeof raw !== "object") return base;
  return {
    avatar_id: typeof raw.avatar_id === "string" && raw.avatar_id ? raw.avatar_id : null,
    gender: ["male", "female", "other", "unspecified"].includes(raw.gender) ? raw.gender : "unspecified",
    age: typeof raw.age === "number" && Number.isFinite(raw.age) ? raw.age : null,
    about: typeof raw.about === "string" ? raw.about : ""
  };
}
function loadLocal() {
  if (typeof window === "undefined") return defaultProfile();
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    if (raw) return coerce(JSON.parse(raw));
    const legacy = window.localStorage.getItem(LEGACY_AVATAR_KEY);
    if (legacy) return coerce({ avatar_id: legacy });
  } catch {
  }
  return defaultProfile();
}
function writeLocal(p) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LS_KEY, JSON.stringify(p));
    if (p.avatar_id) window.localStorage.setItem(LEGACY_AVATAR_KEY, p.avatar_id);
    else window.localStorage.removeItem(LEGACY_AVATAR_KEY);
  } catch {
  }
}
var current = null;
var subscribers = /* @__PURE__ */ new Set();
function getProfile() {
  if (!current) current = loadLocal();
  return current;
}
function subscribe(cb) {
  subscribers.add(cb);
  return () => {
    subscribers.delete(cb);
  };
}
function broadcast(next) {
  current = next;
  writeLocal(next);
  subscribers.forEach((cb) => cb(next));
}
var warnedAboutRemote = false;
function isDev() {
  try {
    return Boolean(import.meta.env?.DEV);
  } catch {
    return false;
  }
}
async function fetchRemoteProfile(accessToken) {
  if (!accessToken) return null;
  try {
    const res = await fetch(profileApiUrl(), {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/json" }
    });
    if (!res.ok) return null;
    const data = await res.json();
    return coerce({
      avatar_id: typeof data?.avatar_icon === "string" ? data.avatar_icon : null,
      gender: data?.gender,
      age: typeof data?.age === "number" ? data.age : null,
      about: typeof data?.account_info?.about === "string" ? data.account_info.about : ""
    });
  } catch {
    return null;
  }
}
async function pushRemoteProfile(p, accessToken) {
  if (!accessToken) return;
  try {
    const res = await fetch(profileApiUrl(), {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        avatar_icon: p.avatar_id,
        gender: p.gender,
        age: p.age,
        account_info: { about: p.about }
      })
    });
    if (!res.ok && !warnedAboutRemote && isDev()) {
      warnedAboutRemote = true;
      console.info("[profile] RES API profile PUT returned", res.status, "\u2014 using localStorage only.");
    }
  } catch {
  }
}
function updateProfile(patch, accessToken) {
  const next = coerce({ ...getProfile(), ...patch });
  broadcast(next);
  void pushRemoteProfile(next, accessToken);
  return next;
}
async function hydrateFromRemote(accessToken) {
  const remote = await fetchRemoteProfile(accessToken);
  if (remote) broadcast(remote);
}

// src/profile/useUserProfile.ts
function useUserProfile(user) {
  const [profile, setProfileState] = useState(() => getProfile());
  const accessToken = user && !user.expired ? user.access_token : void 0;
  useEffect(() => subscribe(setProfileState), []);
  useEffect(() => {
    if (!accessToken) return;
    void hydrateFromRemote(accessToken);
  }, [accessToken]);
  const updateProfile2 = useCallback(
    (patch) => {
      updateProfile(patch, accessToken);
    },
    [accessToken]
  );
  const setAvatarId = useCallback(
    (id) => {
      updateProfile({ avatar_id: id }, accessToken);
    },
    [accessToken]
  );
  return {
    profile,
    avatarId: profile.avatar_id,
    avatarUrl: avatarUrlById(profile.avatar_id),
    setAvatarId,
    updateProfile: updateProfile2
  };
}
var GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
  { value: "unspecified", label: "Prefer not to say" }
];
var FIELD_CLASS = "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100";
function ProfileModal({ user, onClose, dark = false }) {
  const { profile, avatarId, avatarUrl: chosenUrl, setAvatarId, updateProfile: updateProfile2 } = useUserProfile(user);
  const [draft, setDraft] = useState({
    gender: profile.gender,
    age: profile.age,
    about: profile.about
  });
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);
  const name = fullNameOf(user) || initialsOf(user);
  const email = emailOf(user);
  const initials = initialsOf(user);
  const dirty = useMemo(
    () => draft.gender !== profile.gender || draft.age !== profile.age || draft.about !== profile.about,
    [draft, profile]
  );
  function handleSave() {
    updateProfile2(draft);
    onClose();
  }
  return createPortal(
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: `${dark ? "dark " : ""}fixed inset-0 z-[200] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm`,
        onClick: onClose,
        role: "dialog",
        "aria-modal": "true",
        "aria-label": "Profile",
        children: [
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: "relative flex max-h-[90vh] w-full max-w-sm flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-900",
              onClick: (e) => e.stopPropagation(),
              style: { animation: "swn-profile-in 0.22s cubic-bezier(0.34,1.56,0.64,1) both" },
              children: [
                /* @__PURE__ */ jsx("div", { className: "h-1.5 shrink-0 bg-gradient-to-r from-red-500 via-red-600 to-rose-700" }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: onClose,
                    className: "absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300",
                    "aria-label": "Close",
                    children: /* @__PURE__ */ jsx(X, { size: 16 })
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-y-auto px-5 pb-5 pt-6", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center", children: [
                    /* @__PURE__ */ jsx("span", { className: "rounded-full ring-2 ring-gray-100 dark:ring-gray-800", children: /* @__PURE__ */ jsx(Avatar, { url: chosenUrl, initials, size: 80 }) }),
                    /* @__PURE__ */ jsxs("div", { className: "mt-3 text-center", children: [
                      /* @__PURE__ */ jsx("div", { className: "max-w-[16rem] truncate text-base font-semibold text-gray-900 dark:text-gray-100", children: name }),
                      email && /* @__PURE__ */ jsx("div", { className: "max-w-[16rem] truncate text-xs text-gray-500 dark:text-gray-400", children: email }),
                      /* @__PURE__ */ jsxs("div", { className: "mt-1.5 flex items-center justify-center gap-1.5", children: [
                        /* @__PURE__ */ jsxs("span", { className: "relative flex h-2 w-2", children: [
                          /* @__PURE__ */ jsx("span", { className: "absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" }),
                          /* @__PURE__ */ jsx("span", { className: "relative inline-flex h-2 w-2 rounded-full bg-green-500" })
                        ] }),
                        /* @__PURE__ */ jsx("span", { className: "text-[11px] font-medium text-green-600 dark:text-green-400", children: "Active session" })
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "mt-5", children: [
                    /* @__PURE__ */ jsx("div", { className: "mb-2 text-xs font-medium text-gray-700 dark:text-gray-300", children: "Choose your avatar" }),
                    /* @__PURE__ */ jsx("p", { className: "mb-3 text-[11px] text-gray-500 dark:text-gray-400", children: "Your pick follows you across every SwissNovo app." }),
                    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-4 gap-2.5", children: avatarOptions.map((opt) => {
                      const selected = opt.id === avatarId;
                      return /* @__PURE__ */ jsxs(
                        "button",
                        {
                          type: "button",
                          onClick: () => setAvatarId(opt.id),
                          title: opt.label,
                          "aria-label": opt.label,
                          "aria-pressed": selected,
                          className: `relative aspect-square rounded-xl border-2 p-1.5 transition-all ${selected ? "border-red-500 ring-2 ring-red-500/30" : "border-transparent hover:border-gray-300 dark:hover:border-gray-600"}`,
                          style: { backgroundColor: opt.tint },
                          children: [
                            /* @__PURE__ */ jsx(
                              "img",
                              {
                                src: avatarUrl(opt),
                                alt: "",
                                className: "h-full w-full object-contain"
                              }
                            ),
                            selected && /* @__PURE__ */ jsx(
                              "span",
                              {
                                "aria-hidden": "true",
                                className: "absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white shadow",
                                children: /* @__PURE__ */ jsx(Check, { size: 12 })
                              }
                            )
                          ]
                        },
                        opt.id
                      );
                    }) })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "mt-5 space-y-3", children: [
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx(
                        "label",
                        {
                          htmlFor: "swn-profile-gender",
                          className: "mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300",
                          children: "Gender"
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "select",
                        {
                          id: "swn-profile-gender",
                          value: draft.gender,
                          onChange: (e) => setDraft((d) => ({ ...d, gender: e.target.value })),
                          className: FIELD_CLASS,
                          children: GENDER_OPTIONS.map((opt) => /* @__PURE__ */ jsx("option", { value: opt.value, children: opt.label }, opt.value))
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx(
                        "label",
                        {
                          htmlFor: "swn-profile-age",
                          className: "mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300",
                          children: "Age"
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "input",
                        {
                          id: "swn-profile-age",
                          type: "number",
                          min: 0,
                          max: 120,
                          value: draft.age ?? "",
                          onChange: (e) => {
                            const v = e.target.value;
                            setDraft((d) => ({
                              ...d,
                              age: v === "" ? null : Math.max(0, Math.min(120, Number(v)))
                            }));
                          },
                          placeholder: "\u2014",
                          className: FIELD_CLASS
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx(
                        "label",
                        {
                          htmlFor: "swn-profile-about",
                          className: "mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300",
                          children: "About"
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "textarea",
                        {
                          id: "swn-profile-about",
                          rows: 3,
                          value: draft.about,
                          onChange: (e) => setDraft((d) => ({ ...d, about: e.target.value })),
                          placeholder: "A short bio (optional)",
                          className: `${FIELD_CLASS} resize-none`
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "mt-5 flex items-center justify-end gap-2", children: [
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: onClose,
                        className: "rounded-xl px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800",
                        children: "Close"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: handleSave,
                        disabled: !dirty,
                        className: "rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40",
                        children: "Save changes"
                      }
                    )
                  ] })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsx("style", { children: `@keyframes swn-profile-in{from{opacity:0;transform:scale(0.9) translateY(12px)}to{opacity:1;transform:scale(1) translateY(0)}}` })
        ]
      }
    ),
    document.body
  );
}

export { AuthProvider, Avatar, ClaireAssistant_default as ClaireAssistant, ElevenLabsConfigError, GEOPOOL_APP_URL, GeminiConfigError, KIND_META, LocaleSelector, LocaleSelector_default as LocaleSelectorDefault, LoginModal, PRM_PRIORITIES, PRM_STATES, PROOM_APP_URL, AuthRequiredError as PrmAuthRequiredError, ProfileModal, RELEASE_NOTES_STRINGS, ReleaseNotesButton, ReleaseNotesPanel, SAVED_PARCELS_STRINGS, SSO_ATTEMPTED_KEY, SWISSNOVO_APP_CATALOG, SWISSNOVO_SUITE_BLURB, SavedParcelsModal, Skeleton, SkeletonGroup, SkeletonText, TOOLBOX_APP_URL, avatarOptions, avatarUrl, avatarUrlById, avatarUrlFromSeed, buildParcelContextSummary, computeLocationScore, createPrmRecord, createSignalClient, defaultProfile, deletePrmRecord, emailOf, fetchClaireContext, fetchClairePOIs, fetchPrmByParcel, fetchPrmRecords, fetchRemoteProfile, firstNameOf, fullNameOf, generateParcelChatReply, getAuthToken, getExistingUser, getProfile, getReleaseNotesStrings, getSavedParcelsStrings, hydrateFromRemote, initialsOf, loadClaireConversation, pictureOf, plainSpeechText, saveClaireConversation, sendClaireMessageSignal, startVoiceCall, stripAuthParams, subscribe as subscribeProfile, synthesizeSpeech, updatePrmPriority, updatePrmState, updatePrmTags, updateProfile, urlHasAuthParams, useAuth, useUserProfile, userManager };
