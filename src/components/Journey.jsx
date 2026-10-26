import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Plane,
  Plus,
  Search,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SearchField } from "./SearchField.jsx";

export function Journey({
  visitedCountries,
  plannedCountries,
  activeList,
  onActiveListChange,
  onAddNewCountry,
  onCountrySelect,
  onRemoveCountry,
  onMovePlannedCountryToVisited,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortByList, setSortByList] = useState({
    visited: "added",
    planned: "added",
  });
  const [pageByList, setPageByList] = useState({
    visited: 1,
    planned: 1,
  });
  const sortBy = sortByList[activeList];
  const pageSize = 5;
  const countries =
    activeList === "visited" ? visitedCountries : plannedCountries;
  const normalizedSearch = searchQuery.trim().toLocaleLowerCase();
  const filteredCountries = countries
    .filter((country) =>
      country.name.toLocaleLowerCase().includes(normalizedSearch),
    )
    .sort((a, b) => {
      if (sortBy === "alphabetical") {
        return a.name.localeCompare(b.name);
      }

      if (normalizedSearch) {
        const aName = a.name.toLocaleLowerCase();
        const bName = b.name.toLocaleLowerCase();
        const aIndex = aName.indexOf(normalizedSearch);
        const bIndex = bName.indexOf(normalizedSearch);

        if (aIndex !== bIndex) return aIndex - bIndex;
        if (aName.length !== bName.length) return aName.length - bName.length;
      }

      return 0;
    });
  const pageCount = Math.ceil(filteredCountries.length / pageSize);
  const currentPage = Math.min(pageByList[activeList], pageCount || 1);
  const visibleCountries = filteredCountries.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  return (
    <section className="section journey-section" id="journey">
      <div className="countries-heading journey-heading">
        <div>
          <p className="eyebrow blue-eyebrow">COLLECT YOUR MEMORIES</p>
          <h2>My Travel Journey</h2>
          <p className="section-description">
            Countries you’ve visited and places you’re planning to visit.
          </p>
        </div>
        <div className="journey-tools">
          <SearchField
            placeholder="Search your lists..."
            className="countries-search"
            value={searchQuery}
            onChange={(event) => {
              setSearchQuery(event.target.value);
              setPageByList((currentPages) => ({
                ...currentPages,
                [activeList]: 1,
              }));
            }}
          />
          <label className="sr-only" htmlFor="journey-sort">
            Sort countries
          </label>
          <select
            className="journey-sort"
            id="journey-sort"
            value={sortBy}
            onChange={(event) => {
              setSortByList((currentSortByList) => ({
                ...currentSortByList,
                [activeList]: event.target.value,
              }));
              setPageByList((currentPages) => ({
                ...currentPages,
                [activeList]: 1,
              }));
            }}
          >
            <option value="added">Recently added</option>
            <option value="alphabetical">Alphabetical (A–Z)</option>
          </select>
        </div>
      </div>
      <div className="journey-tabs-row">
        <div className="journey-tabs" role="tablist" aria-label="Travel lists">
          <button
            className={activeList === "visited" ? "selected" : ""}
            id="visited-tab"
            type="button"
            role="tab"
            aria-selected={activeList === "visited"}
            aria-controls="journey-list"
            onClick={() => onActiveListChange("visited")}
          >
            Visited <b>{visitedCountries.length}</b>
          </button>
          <button
            className={activeList === "planned" ? "selected" : ""}
            id="planned-tab"
            type="button"
            role="tab"
            aria-selected={activeList === "planned"}
            aria-controls="journey-list"
            onClick={() => onActiveListChange("planned")}
          >
            Planning to Visit <b>{plannedCountries.length}</b>
          </button>
        </div>
        <button
          className="button-secondary journey-add-country"
          type="button"
          onClick={onAddNewCountry}
        >
          <Plus size={15} aria-hidden="true" />
          Add a new country
        </button>
      </div>
      <div
        id="journey-list"
        role="tabpanel"
        aria-labelledby={
          activeList === "visited" ? "visited-tab" : "planned-tab"
        }
      >
        <h3 className="list-heading">
          {activeList === "visited"
            ? `Visited Countries (${visitedCountries.length})`
            : `Planning to Visit (${plannedCountries.length})`}
        </h3>
        {filteredCountries.length === 0 ? (
          <p className="journey-empty">
            {countries.length > 0
              ? "No countries match your search."
              : activeList === "visited"
                ? "You haven’t marked any countries as visited yet."
                : "You haven’t added any planned destinations yet."}
          </p>
        ) : (
          visibleCountries.map((country) => (
            <JourneyCard
              flag={country.flag}
              name={country.name}
              detail={country.detail}
              review={country.review}
              rating={country.rating?.toFixed(1)}
              ratingValue={
                country.rating
                  ? `${"★".repeat(country.rating)}${"☆".repeat(
                      5 - country.rating,
                    )}`
                  : ""
              }
              planned={activeList === "planned"}
              onViewDetails={() => onCountrySelect(country.country)}
              onRemove={() => onRemoveCountry(country.id, activeList)}
              onMoveToVisited={() => onMovePlannedCountryToVisited(country)}
              key={country.id}
            />
          ))
        )}
      </div>
      {pageCount > 1 && (
        <nav
          className="pagination"
          aria-label={`${activeList} countries pages`}
        >
          <button
            type="button"
            aria-label="Previous page"
            onClick={() =>
              setPageByList((currentPages) => ({
                ...currentPages,
                [activeList]: currentPage - 1,
              }))
            }
            disabled={currentPage === 1}
          >
            <ChevronLeft size={17} />
          </button>
          {Array.from({ length: pageCount }, (_, index) => index + 1).map(
            (page) => (
              <button
                className={page === currentPage ? "selected" : ""}
                type="button"
                aria-current={page === currentPage ? "page" : undefined}
                key={page}
                onClick={() =>
                  setPageByList((currentPages) => ({
                    ...currentPages,
                    [activeList]: page,
                  }))
                }
              >
                {page}
              </button>
            ),
          )}
          <button
            type="button"
            aria-label="Next page"
            onClick={() =>
              setPageByList((currentPages) => ({
                ...currentPages,
                [activeList]: currentPage + 1,
              }))
            }
            disabled={currentPage === pageCount}
          >
            <ChevronRight size={17} />
          </button>
        </nav>
      )}
      <div className="journey-note">
        <Plane size={19} />
        <span>
          Track your journeys, plan your dreams.<small>— Tourist Hub</small>
        </span>
      </div>
    </section>
  );
}

function JourneyCard({
  flag,
  name,
  detail,
  review,
  rating,
  ratingValue,
  planned,
  onViewDetails,
  onRemove,
  onMoveToVisited,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!isMenuOpen) return undefined;

    function closeMenuOnOutsideClick(event) {
      if (!menuRef.current?.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }

    function closeMenuOnEscape(event) {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", closeMenuOnOutsideClick);
    document.addEventListener("keydown", closeMenuOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeMenuOnOutsideClick);
      document.removeEventListener("keydown", closeMenuOnEscape);
    };
  }, [isMenuOpen]);

  return (
    <article className="journey-card">
      <div
        className={`journey-image${planned ? " italy-image" : ""}`}
        aria-hidden="true"
      ></div>
      <div className="journey-country">
        <strong>
          <span aria-hidden="true">{flag}</span>
          {name}
        </strong>
        <p>{detail}</p>
        {!planned && ratingValue && (
          <>
            <div className="journey-rating">
              <span>{ratingValue}</span>
              <b>{rating}</b>
            </div>
            <p className="journey-review">{review}</p>
          </>
        )}
      </div>
      <button
        className="button-secondary view-details"
        type="button"
        onClick={onViewDetails}
      >
        <Search size={13} /> View Details
      </button>
      {planned ? (
        <div className="journey-menu" ref={menuRef}>
          <button
            className="more-button"
            type="button"
            aria-label={`More options for ${name}`}
            aria-haspopup="menu"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
          >
            <MoreHorizontal size={18} />
          </button>
          {isMenuOpen && (
            <div className="journey-menu-options" role="menu">
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  onRemove();
                  setIsMenuOpen(false);
                }}
              >
                Remove from list
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  onMoveToVisited();
                  setIsMenuOpen(false);
                }}
              >
                Move to visited countries
              </button>
            </div>
          )}
        </div>
      ) : (
        <button
          className="remove-button"
          type="button"
          aria-label={`Remove ${name} from visited countries`}
          onClick={onRemove}
        >
          <X size={18} />
        </button>
      )}
    </article>
  );
}
