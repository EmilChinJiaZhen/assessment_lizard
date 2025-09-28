import { useEffect, useMemo, useState } from "react";
import { Routes, Route, useSearchParams } from "react-router-dom";
import CategoryFilter from "./CategoryFilter";
import PostList from "./PostList";
import PostDetail from "./PostDetail"; // new

// IMPORTANT: If encountered ERR_PACKAGE_PATH_NOT_EXPORTED error, in order to run the app, you must run $env:NODE_OPTIONS="--openssl-legacy-provider" before running "npm start"

/**
 * App component
 * - Fetches posts from MirageJS (/api/posts)
 * - Manages UI state: loading, error, selected categories, pagination
 * - Persists state to the query string with react-router's useSearchParams
 */

// a constant for how many posts to show per page before load more
const PAGE_SIZE = 8;

// main component for this screen
function App() {
  //local state: fetched posts, loading flad and error string if any exists.
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  // gives a read/write interface to the query string
  const [searchParams, setSearchParams] = useSearchParams();

  // on first render, read all cat params from thte URL and store them in a set
  const [selectedCategories, setSelectedCategories] = useState(() => {
    return new Set(searchParams.getAll("cat"));
  });

  // on first render, read the page param, default to 1 if missing or invalid
  const [page, setPage] = useState(() => {
    const p = Number(searchParams.get("page"));
    return Number.isFinite(p) && p > 0 ? p : 1;
  });

  // Fetch data from the mock API, uses canceled flag to avoid setting state if the component unmounts mid-fetch
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setErr(null);
      try {
        const res = await fetch("/api/posts");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!cancelled) setAllPosts(data.posts ?? []);
      } catch (e) {
        if (!cancelled) setErr(e.message || "Failed to fetch posts");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // Compute unique category names for the filter, derive a sorted and unique list of category names from allPosts
  // useMemo recalculates only when allPosts changes
  const allCategories = useMemo(() => {
    const names = new Set();
    for (const post of allPosts) {
      for (const c of post.categories || []) names.add(c.name);
    }
    return Array.from(names).sort((a, b) => a.localeCompare(b));
  }, [allPosts]);

  // Filter posts based on selected categories, if no filters selected, show all posts, otherwise only posts having at least one selected category
  const filtered = useMemo(() => {
    if (selectedCategories.size === 0) return allPosts;
    return allPosts.filter((p) =>
      (p.categories || []).some((c) => selectedCategories.has(c.name))
    );
  }, [allPosts, selectedCategories]);

  // Pagination: “Load more” style, how many items to show now, whether there are more to load
  const visible = filtered.slice(0, page * PAGE_SIZE);
  const canLoadMore = visible.length < filtered.length;

  // Sync state to the query string (router-native), keep the URL's query string in sync with UI
  useEffect(() => {
    const params = new URLSearchParams();
    for (const name of selectedCategories) params.append("cat", name);
    if (page > 1) params.set("page", String(page));
    setSearchParams(params, { replace: true });
  }, [selectedCategories, page, setSearchParams]);

  // Event handlers, toggle a chip on/off, reset to page 1 after any filter change
  function toggleCategory(name) {
    setPage(1); // reset pagination when filters change
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }

  // remove all category filgers, back to first page
  function clearFilters() {
    setSelectedCategories(new Set());
    setPage(1);
  }

  // layout and page headings
  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">Posts</h1>
        <p className="app__subtitle">
          Fetched from a MirageJS mock API and rendered with filtering & pagination.
        </p>
      </header> 

      {/* Routes: home list(at /) + detail page(at /post/:id) */}
      <main className="app__main">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <section aria-labelledby="filters-heading" className="filters">
                  <h2 id="filters-heading" className="visually-hidden">
                    Filters
                  </h2>
                  <CategoryFilter
                    categories={allCategories}
                    selected={selectedCategories}
                    onToggle={toggleCategory}
                    onClear={clearFilters}
                  />
                </section>

                <section aria-labelledby="list-heading" className="list">
                  <h2 id="list-heading" className="visually-hidden">
                    Post list
                  </h2>

                  {loading && <p role="status">Loading posts…</p>}
                  {err && (
                    <div role="alert" className="error">
                      Failed to load posts: {err}
                    </div>
                  )}

                  {!loading && !err && (
                    <>
                      <PostList posts={visible} />
                      {filtered.length === 0 && (
                        <p>No posts match the selected categories.</p>
                      )}

                      {canLoadMore && (
                        <div className="load-more">
                          <button
                            type="button"
                            className="btn"
                            onClick={() => setPage((p) => p + 1)}
                          >
                            Load more
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </section>
              </>
            }
          />
          <Route path="/post/:id" element={<PostDetail posts={allPosts} />} />
        </Routes>
      </main>

      {/* footer with current year */}
      <footer className="app__footer">
        <small>&copy; {new Date().getFullYear()} Demo Blog</small>
      </footer>
    </div>
  );
}
// export the component
export default App;
