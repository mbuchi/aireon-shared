import { createContext, useState, useRef, useEffect, useMemo, useCallback, useContext } from 'react';
import { createPortal } from 'react-dom';
import { X, Sparkles, Tag, GitPullRequest, ExternalLink, Search, ChevronUp, ChevronDown } from 'lucide-react';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { WebStorageStateStore, UserManager } from 'oidc-client-ts';

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
var TOP_Z_INDEX = 2147483647;
var ALL_FILTERS = [
  { kind: "new", label: "New" },
  { kind: "improved", label: "Improved" },
  { kind: "fixed", label: "Fixed" },
  { kind: "breaking", label: "Breaking" },
  { kind: "docs", label: "Docs" }
];
function ReleaseNotesPanel({
  onClose,
  releases,
  repoUrl,
  brandPrefix = "",
  brandSuffix = "",
  brandNode,
  zIndex = TOP_Z_INDEX,
  closeRef
}) {
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
      { kind: "all", label: "All" },
      ...ALL_FILTERS.filter((f) => present.has(f.kind))
    ];
  }, [releases]);
  return createPortal(
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: `fixed inset-0 flex items-stretch justify-end transition-opacity duration-200 ${visible ? "opacity-100" : "opacity-0"}`,
        style: { zIndex },
        role: "dialog",
        "aria-modal": "true",
        "aria-label": "Release notes",
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
                      "aria-label": "Close",
                      children: /* @__PURE__ */ jsx(X, { size: 18 })
                    }
                  ),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
                    /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-red-50 border border-red-200 dark:bg-red-500/10 dark:border-red-500/30", children: /* @__PURE__ */ jsx(Sparkles, { className: "text-red-600 dark:text-red-400", size: 22 }) }),
                    /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                      /* @__PURE__ */ jsxs("h1", { className: "text-xl font-semibold text-gray-900 dark:text-white", children: [
                        "What's new in",
                        " ",
                        /* @__PURE__ */ jsx("span", { className: "font-normal", style: { fontFamily: "'Varela Round', sans-serif" }, children: brandNode ?? /* @__PURE__ */ jsxs(Fragment, { children: [
                          brandPrefix,
                          /* @__PURE__ */ jsx("span", { className: "text-red-600", children: "oo" }),
                          brandSuffix
                        ] }) })
                      ] }),
                      /* @__PURE__ */ jsxs("p", { className: "mt-1 text-sm leading-relaxed text-gray-500 dark:text-slate-400", children: [
                        "Every shipped change, grouped by version. Latest release",
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
                          " live"
                        ] }),
                        /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 dark:bg-white/[0.05] dark:text-slate-300", children: [
                          /* @__PURE__ */ jsx(Tag, { size: 12 }),
                          " ",
                          totals.releases,
                          " releases"
                        ] }),
                        /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 dark:bg-white/[0.05] dark:text-slate-300", children: [
                          /* @__PURE__ */ jsx(GitPullRequest, { size: 12 }),
                          " ",
                          totals.changes,
                          " changes"
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
                              " View all PRs"
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
                          placeholder: "Search changes, versions, or PR numbers\u2026 ( / to focus)",
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
                  filteredReleases.length === 0 && /* @__PURE__ */ jsx("div", { className: "text-center py-16 rounded-2xl border-2 border-dashed border-gray-200 text-gray-400 dark:border-white/[0.08] dark:text-slate-500", children: /* @__PURE__ */ jsx("p", { className: "text-sm", children: "No changes match that filter." }) }),
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
                                      isLatest && /* @__PURE__ */ jsx("span", { className: "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-red-600 text-white", children: "Latest" })
                                    ] }),
                                    /* @__PURE__ */ jsxs("p", { className: "text-xs mt-0.5 text-gray-400 dark:text-slate-500", children: [
                                      release.date,
                                      " \xB7 ",
                                      release.items.length,
                                      " change",
                                      release.items.length === 1 ? "" : "s"
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
                                            meta.label
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
                    "Versions follow",
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
                    ". History is reconstructed from merged pull requests."
                  ] }),
                  /* @__PURE__ */ jsxs(
                    "button",
                    {
                      onClick: handleClose,
                      className: "hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gray-100 text-gray-500 hover:text-gray-900 dark:bg-white/[0.05] dark:text-slate-400 dark:hover:text-slate-100",
                      children: [
                        "Close ",
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
  storageKey,
  repoUrl,
  brandPrefix,
  brandSuffix = "",
  brandNode,
  zIndex,
  className
}) {
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
        title: `What's new \u2014 v${currentVersion}`,
        "aria-label": `What's new \u2014 v${currentVersion}`,
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

export { AuthProvider, KIND_META, ReleaseNotesButton, ReleaseNotesPanel, SSO_ATTEMPTED_KEY, getAuthToken, getExistingUser, stripAuthParams, urlHasAuthParams, useAuth, userManager };
