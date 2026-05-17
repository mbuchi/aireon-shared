import { createContext, useState, useRef, useEffect, useMemo, useCallback, useContext } from 'react';
import { createPortal } from 'react-dom';
import { X, Sparkles, Tag, GitPullRequest, ExternalLink, Search, ChevronUp, ChevronDown, Loader2, AlertCircle, Send } from 'lucide-react';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { WebStorageStateStore, UserManager } from 'oidc-client-ts';
import createClient from 'openapi-fetch';

// src/releaseNotes/ReleaseNotesPanel.tsx

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
                  /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
                    /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-red-50 border border-red-200 dark:bg-red-500/10 dark:border-red-500/30", children: /* @__PURE__ */ jsx(Sparkles, { className: "text-red-600 dark:text-red-400", size: 22 }) }),
                    /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
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
                    ] })
                  ] }),
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
        className: `hidden sm:inline-flex items-center gap-1.5 h-7 pl-2 pr-2.5 rounded-full text-[11px] font-semibold border transition-colors border-gray-200 text-gray-600 hover:text-red-700 hover:border-red-200 hover:bg-red-50 dark:border-gray-700 dark:text-gray-300 dark:hover:text-red-300 dark:hover:border-red-500/40 dark:hover:bg-red-500/10 ${className ?? ""}`,
        children: [
          /* @__PURE__ */ jsx(Sparkles, { size: 12, className: "text-red-600 dark:text-red-400" }),
          /* @__PURE__ */ jsxs("span", { className: "font-mono", children: [
            "v",
            currentVersion
          ] }),
          hasUnread && /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" })
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
var AuthContext = createContext(void 0);
function computeInitials(name, email) {
  const source = name.trim() || email.trim();
  if (!source) return "?";
  if (source.includes("@")) return source[0].toUpperCase();
  const parts = source.split(/\s+/).filter(Boolean);
  return parts.slice(0, 2).map((p) => p[0].toUpperCase()).join("") || source[0].toUpperCase();
}
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const initStarted = useRef(false);
  useEffect(() => {
    if (initStarted.current) return;
    initStarted.current = true;
    let cancelled = false;
    const finish = (loaded) => {
      if (cancelled) return;
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
            const silent = await userManager.signinSilent();
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
    const onLoaded = (u) => {
      if (!cancelled) setUser(u);
    };
    const onUnloaded = () => {
      if (!cancelled) setUser(null);
    };
    const onExpired = () => {
      if (!cancelled) {
        userManager.removeUser().finally(() => {
          if (!cancelled) setUser(null);
        });
      }
    };
    userManager.events.addUserLoaded(onLoaded);
    userManager.events.addUserUnloaded(onUnloaded);
    userManager.events.addAccessTokenExpired(onExpired);
    return () => {
      cancelled = true;
      userManager.events.removeUserLoaded(onLoaded);
      userManager.events.removeUserUnloaded(onUnloaded);
      userManager.events.removeAccessTokenExpired(onExpired);
    };
  }, []);
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
      picture
    };
  }, [user, isLoading, login, register, logout, getAccessToken]);
  return /* @__PURE__ */ jsx(AuthContext.Provider, { value, children });
}
function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}

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
  return `You are "Claire", the AI parcel assistant embedded inside ${where}. You help investors, developers and property owners understand a single selected parcel.

Tone and format:
- Concise, expert, and grounded in the parcel context provided. Avoid filler.
- Use short paragraphs and tight bullet lists when listing items.
- Prices are in CHF. Areas in m\xB2. Use Swiss thousand separators when natural.
- Answer in the same language as the user's question (default English).

Rules:
- Always stay focused on the currently selected parcel below. If the user asks for nearby comparisons, market trends, or legal advice, give helpful general guidance grounded in the parcel context and clearly mark estimates as such.
- Never invent specific cadastral, legal, or pricing figures that aren't supplied. If data is missing, say so briefly and suggest what would be needed.
- Mention regulatory caveats for Switzerland where relevant (e.g. zoning law, Lex Koller, planning permissions) at a high level.
- Do not output disclaimers longer than one short sentence.`;
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

// src/claire/signal.ts
var SIGNAL_ENDPOINT = "/api/signal-collect";
async function sendClaireMessageSignal({
  appName,
  lat,
  lng,
  address,
  source
}) {
  try {
    await fetch(SIGNAL_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        app_name: appName,
        user_action: "Claire Assistant Message",
        // No parcel_id is sent: the RES API resolves the canonical parcel
        // (SwissTopo EGRID) from target_lat/lng, so the Claire signal stays
        // consistent with the address-search signal instead of recording an
        // app-internal tile id.
        lat,
        lng,
        target_address: address,
        target_lat: lat,
        target_lng: lng,
        meta_data: source ? { source } : void 0
      })
    });
  } catch (err) {
    console.error("Signal collection error:", err);
  }
}

// src/claire/claireContext.ts
var IDENTIFY_API = "https://api3.geo.admin.ch/rest/services/api/MapServer/identify";
var GWR_LAYER = "ch.bfs.gebaeude_wohnungs_register";
var BAUZONEN_LAYER = "ch.are.bauzonen_harmonisiert_v2";
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
    "ch_bezeichnung",
    "ch_typ_text",
    "typ_kt_text",
    "typ_text",
    "bezeichnung_de",
    "bezeichnung"
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
  darkMode,
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
  const fullContext = useMemo(
    () => official.text ? `${parcelContext}

${official.text}` : parcelContext,
    [parcelContext, official.text]
  );
  useEffect(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setMessages([]);
    setInput("");
    setError(null);
    setLoading(false);
  }, [lngLat.lng, lngLat.lat]);
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
  useEffect(() => () => abortRef.current?.abort(), []);
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
        setMessages((prev) => [
          ...prev,
          { id: newId(), role: "assistant", content: reply }
        ]);
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
      geminiModel
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
      className: `fixed z-[60] ${launcherPos} group flex items-center justify-center w-14 h-14 rounded-full transition-all duration-200 active:scale-95 ${darkMode ? "bg-gradient-to-br from-amber-400 to-orange-500 text-[#1a0f00] shadow-[0_10px_30px_-8px_rgba(251,191,36,0.55)] hover:brightness-110" : "bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-[0_10px_30px_-8px_rgba(251,146,60,0.6)] hover:brightness-105"}`,
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
      className: `fixed z-[60] ${cardPos} chat-card-pop flex flex-col overflow-hidden rounded-2xl ${darkMode ? "bg-[#0b0f15] ring-1 ring-white/[0.08] shadow-[0_24px_60px_-20px_rgba(0,0,0,0.85)]" : "bg-white ring-1 ring-gray-200/90 shadow-[0_24px_60px_-20px_rgba(15,23,42,0.4)]"}`,
      children: [
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: `flex items-center gap-3 px-3.5 py-3 shrink-0 ${darkMode ? "bg-gradient-to-b from-white/[0.04] to-transparent border-b border-white/[0.06]" : "bg-gradient-to-b from-gray-50/80 to-transparent border-b border-gray-200/70"}`,
            children: [
              /* @__PURE__ */ jsxs(
                "div",
                {
                  className: `relative w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${darkMode ? "bg-gradient-to-br from-amber-400/20 via-orange-500/15 to-rose-500/10 ring-1 ring-amber-300/20" : "bg-gradient-to-br from-amber-100 via-orange-100 to-rose-100 ring-1 ring-amber-200/70"}`,
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
                        className: `absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full ring-2 ${darkMode ? "bg-emerald-400 ring-[#0b0f15]" : "bg-emerald-500 ring-white"}`
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: `text-[13px] font-semibold leading-tight ${darkMode ? "text-white" : "text-gray-900"}`,
                    children: "Claire"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: `text-[10.5px] font-medium uppercase tracking-[0.1em] mt-0.5 truncate ${darkMode ? "text-amber-200/70" : "text-amber-700/80"}`,
                    children: subtitle
                  }
                )
              ] }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setOpen(false),
                  "aria-label": "Close Claire",
                  className: `w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${darkMode ? "text-gray-400 hover:text-white hover:bg-white/[0.08]" : "text-gray-400 hover:text-gray-700 hover:bg-gray-100"}`,
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
                  className: `flex items-center gap-2 rounded-xl px-3 py-2.5 text-[12px] ${darkMode ? "bg-white/[0.025] text-gray-400 ring-1 ring-white/[0.04]" : "bg-gray-50 text-gray-500 ring-1 ring-gray-200/70"}`,
                  children: [
                    /* @__PURE__ */ jsx(Loader2, { size: 13, className: "animate-spin shrink-0" }),
                    "Restoring your conversation about this parcel\u2026"
                  ]
                }
              ),
              messages.length === 0 && !historyLoading && /* @__PURE__ */ jsx(
                "div",
                {
                  className: `rounded-xl px-3 py-2.5 text-[12px] leading-relaxed ${darkMode ? "bg-white/[0.025] text-gray-300 ring-1 ring-white/[0.04]" : "bg-gray-50 text-gray-600 ring-1 ring-gray-200/70"}`,
                  children: "Hi, I\u2019m Claire. Ask me anything about this parcel \u2014 zoning, value, what can be built, comparable properties, or hidden risks. My answers are scoped to the selection on the map."
                }
              ),
              messages.map(
                (msg) => msg.role === "user" ? /* @__PURE__ */ jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: `max-w-[88%] rounded-2xl rounded-tr-md px-3 py-2 text-[12.5px] leading-relaxed whitespace-pre-wrap ${darkMode ? "bg-amber-400/15 text-amber-50 ring-1 ring-amber-300/20" : "bg-amber-50 text-amber-900 ring-1 ring-amber-200/80"}`,
                    children: msg.content
                  }
                ) }, msg.id) : /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2", children: [
                  /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: `w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${darkMode ? "bg-gradient-to-br from-amber-400/25 to-rose-500/15 ring-1 ring-amber-300/20" : "bg-gradient-to-br from-amber-100 to-rose-100 ring-1 ring-amber-200/70"}`,
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
                  /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: `max-w-[88%] rounded-2xl rounded-tl-md px-3 py-2 text-[12.5px] leading-relaxed ${darkMode ? "bg-white/[0.04] text-gray-100 ring-1 ring-white/[0.05]" : "bg-gray-50 text-gray-800 ring-1 ring-gray-200/70"}`,
                      children: renderAssistantText(msg.content)
                    }
                  )
                ] }, msg.id)
              ),
              loading && /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2", children: [
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: `w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${darkMode ? "bg-gradient-to-br from-amber-400/25 to-rose-500/15 ring-1 ring-amber-300/20" : "bg-gradient-to-br from-amber-100 to-rose-100 ring-1 ring-amber-200/70"}`,
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
                    className: `rounded-2xl rounded-tl-md px-3 py-2.5 flex items-center gap-1.5 ${darkMode ? "bg-white/[0.04] ring-1 ring-white/[0.05]" : "bg-gray-50 ring-1 ring-gray-200/70"}`,
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
                  className: `flex items-start gap-2 rounded-xl px-3 py-2 text-[12px] ${darkMode ? "bg-rose-500/10 text-rose-200 ring-1 ring-rose-400/20" : "bg-rose-50 text-rose-700 ring-1 ring-rose-200"}`,
                  children: [
                    /* @__PURE__ */ jsx(AlertCircle, { size: 13, className: "shrink-0 mt-0.5" }),
                    /* @__PURE__ */ jsx("span", { children: error })
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: `shrink-0 px-3.5 pt-2.5 pb-3 ${darkMode ? "border-t border-white/[0.06] bg-gradient-to-t from-white/[0.025] to-transparent" : "border-t border-gray-200/70 bg-gradient-to-t from-gray-50/70 to-transparent"}`,
            children: [
              showQuickPrompts && /* @__PURE__ */ jsx("div", { className: "mb-2.5 flex flex-wrap gap-1.5", children: QUICK_PROMPTS.map((q) => /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => onQuickPrompt(q.prompt),
                  title: q.prompt,
                  className: `text-[11px] font-medium px-2.5 py-1 rounded-full transition-all duration-150 ${darkMode ? "bg-white/[0.04] text-gray-200 ring-1 ring-white/[0.06] hover:bg-amber-400/10 hover:text-amber-200 hover:ring-amber-300/30" : "bg-white text-gray-700 ring-1 ring-gray-200/80 hover:bg-amber-50 hover:text-amber-700 hover:ring-amber-200"}`,
                  children: q.label
                },
                q.label
              )) }),
              /* @__PURE__ */ jsxs("form", { onSubmit, children: [
                /* @__PURE__ */ jsxs(
                  "div",
                  {
                    className: `flex items-end gap-1.5 rounded-xl px-2.5 py-1.5 transition-all duration-150 focus-within:ring-2 ${darkMode ? "bg-white/[0.04] ring-1 ring-white/[0.06] focus-within:ring-amber-400/40" : "bg-white ring-1 ring-gray-200/80 focus-within:ring-amber-300"}`,
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
                          className: `flex-1 resize-none bg-transparent outline-none text-[12.5px] leading-snug py-1.5 max-h-24 ${darkMode ? "text-gray-100 placeholder:text-gray-500" : "text-gray-900 placeholder:text-gray-400"}`
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          type: "submit",
                          disabled: sendDisabled,
                          "aria-label": "Send message",
                          className: `w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-150 ${sendDisabled ? darkMode ? "bg-white/[0.04] text-gray-600 cursor-not-allowed" : "bg-gray-100 text-gray-300 cursor-not-allowed" : "bg-gradient-to-br from-amber-400 to-orange-500 text-white hover:brightness-105 shadow-[0_4px_12px_-4px_rgba(251,191,36,0.5)]"}`,
                          children: loading ? /* @__PURE__ */ jsx(Loader2, { size: 14, className: "animate-spin" }) : /* @__PURE__ */ jsx(Send, { size: 13 })
                        }
                      )
                    ]
                  }
                ),
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: `mt-1.5 text-[10px] tracking-wide ${darkMode ? "text-gray-500" : "text-gray-400"}`,
                    children: "Enter to send \xB7 Shift+Enter for newline"
                  }
                )
              ] })
            ]
          }
        )
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
          background: ${darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"};
          border-radius: 4px;
        }
        .chat-dot {
          width: 5px;
          height: 5px;
          border-radius: 9999px;
          background: ${darkMode ? "rgba(251,191,36,0.85)" : "rgba(217,119,6,0.7)"};
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
var RES_API_BASE_URL = "https://res.zeroo.ch";
function createResApiClient(options = {}) {
  const { baseUrl = RES_API_BASE_URL, token, fetch: fetch2 } = options;
  const headers = {
    // Opt in to the corrected error contract — see project_RES openapi.json.
    "X-RES-API-Version": "2"
  };
  if (token) {
    headers.token = token;
  }
  return createClient({
    baseUrl,
    headers,
    ...fetch2 ? { fetch: fetch2 } : {}
  });
}

export { AuthProvider, ClaireAssistant_default as ClaireAssistant, GeminiConfigError, KIND_META, RELEASE_NOTES_STRINGS, RES_API_BASE_URL, ReleaseNotesButton, ReleaseNotesPanel, SSO_ATTEMPTED_KEY, buildParcelContextSummary, createResApiClient, fetchClaireContext, generateParcelChatReply, getAuthToken, getExistingUser, getReleaseNotesStrings, loadClaireConversation, saveClaireConversation, sendClaireMessageSignal, stripAuthParams, urlHasAuthParams, useAuth, userManager };
