import { Flag, Globe, Landmark, Search, UsersRound } from "lucide-react";
import { useState } from "react";
import { SearchField } from "./SearchField.jsx";

export function Hero({ onBrowseCountries, onSearch }) {
  const [searchCountry, setSearchCountry] = useState("");

  function handleSearchSubmit(event) {
    event.preventDefault();
    onSearch(searchCountry.trim());
  }

  return (
    <section className="hero" id="home">
      <div className="hero-content">
        <p className="eyebrow">YOUR WORLD, A LITTLE CLOSER</p>
        <h1>
          Explore the World
          <span>One Country at a Time</span>
        </h1>
        <p className="hero-description">
          Discover countries, learn about their cultures, flags, capitals,
          population and more.
        </p>
        <form className="hero-search-row" onSubmit={handleSearchSubmit}>
          <SearchField
            placeholder="Search for a country..."
            className="hero-search"
            value={searchCountry}
            onChange={(event) => setSearchCountry(event.target.value)}
          />
          <button
            className="search-submit"
            type="submit"
            aria-label="Search countries"
          >
            <Search size={20} />
          </button>
        </form>
        <div className="stats">
          <button
            className="hero-stat-link"
            type="button"
            onClick={onBrowseCountries}
          >
            <div className="stat-item">
              <Globe />
              <p>195</p>
              <span>Countries</span>
            </div>
          </button>

          <button
            className="hero-stat-link"
            type="button"
            onClick={onBrowseCountries}
          >
            <div className="stat-item">
              <Flag />
              <p>Flags</p>
              <span>&amp; Symbols</span>
            </div>
          </button>
          <button
            className="hero-stat-link"
            type="button"
            onClick={onBrowseCountries}
          >
            <div className="stat-item">
              <Landmark />
              <p>Capitals</p>
              <span>&amp; Cities</span>
            </div>
          </button>
          <button
            className="hero-stat-link"
            type="button"
            onClick={onBrowseCountries}
          >
            <div className="stat-item">
              <UsersRound />
              <p>Population</p>
              <span>&amp; More</span>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}
