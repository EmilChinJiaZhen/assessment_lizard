import { memo } from "react";

/**
 * CategoryFilter
 * - Multi-select list of category “chips” (buttons)
 * - Semantic controls with aria-pressed to announce selection state
 */
// props: categories (all), selected (Set), onToggle(name), onClear()
function CategoryFilter({ categories, selected, onToggle, onClear }) {
  // don't render if no categories at all
  if (!categories.length) return null;
  // render the list of category buttons, highlight selected ones. render each category as a "chip" button
  return (
    <div className="category-filter">
      <div className="category-filter__row">
        {categories.map((name) => {
          const isActive = selected.has(name);
          return (
            <button
              type="button"
              key={name}
              className={`chip ${isActive ? "chip--active" : ""}`}
              aria-pressed={isActive}
              onClick={() => onToggle(name)}
            >
              {name}
            </button>
          );
        })}
      </div>

      {/* if there is at least one selection, show a clear button and a live count */}
      {selected.size > 0 && (
        <div className="category-filter__actions">
          <button type="button" className="btn btn--ghost" onClick={onClear}>
            Clear filters
          </button>
          <span className="category-filter__count" aria-live="polite">
            {selected.size} selected
          </span>
        </div>
      )}
    </div>
  );
}
// memoize to avoid re-renders if props are the same
export default memo(CategoryFilter);
