import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { continentByIso3, popularRegionByIso3, sovereignIso3Codes } from "../data/countryData.js";
import { SearchField } from "./SearchField.jsx";

function CountryCard({ country, compact = false, onSelect }) {
  return (
    <article
      className={`country-card${compact ? " compact" : ""}`}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${country.name}`}
      onClick={() => onSelect(country)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(country);
        }
      }}
    >
      <span className="country-flag">
        {country.flag ? (
          <img src={country.flag} alt={`${country.name} flag`} />
        ) : (
          <span aria-hidden="true">{country.flagEmoji}</span>
        )}
      </span>
      <div className="country-card-copy">
        <h3>{country.name}</h3>
        <p>Capital: {country.capital}</p>
        {country.population !== null && (
          <p>Population: {country.population.toLocaleString()}</p>
        )}
      </div>
      {compact && <ChevronRight className="card-chevron" size={18} />}
    </article>
  );
}

export function Countries({ onCountrySelect, initialSearchQuery, onBack }) {
  const [countries, setCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [sortBy, setSortBy] = useState("");
  const [region, setRegion] = useState("");
  const [continent, setContinent] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const countriesPerPage = 12;
  const pageWindowSize = 5;

  useEffect(function () {
    const controller = new AbortController();

    async function loadCountries() {
      try {
        const [
          countriesResponse,
          capitalsResponse,
          flagsResponse,
          populationResponse,
        ] = await Promise.all([
          fetch("https://countriesnow.space/api/v0.1/countries", {
            signal: controller.signal,
          }),
          fetch("https://countriesnow.space/api/v0.1/countries/capital", {
            signal: controller.signal,
          }),
          fetch("https://countriesnow.space/api/v0.1/countries/flag/images", {
            signal: controller.signal,
          }),
          fetch("https://countriesnow.space/api/v0.1/countries/population", {
            signal: controller.signal,
          }),
        ]);

        const failedResponse = [
          countriesResponse,
          capitalsResponse,
          flagsResponse,
          populationResponse,
        ].find((response) => !response.ok);
        if (failedResponse) {
          throw new Error(
            `A country data request failed (${failedResponse.status}).`,
          );
        }

        const [countriesResult, capitalsResult, flagsResult, populationResult] =
          await Promise.all([
            countriesResponse.json(),
            capitalsResponse.json(),
            flagsResponse.json(),
            populationResponse.json(),
          ]);
        if (
          countriesResult.error ||
          capitalsResult.error ||
          flagsResult.error ||
          populationResult.error ||
          !Array.isArray(countriesResult.data) ||
          !Array.isArray(capitalsResult.data) ||
          !Array.isArray(flagsResult.data) ||
          !Array.isArray(populationResult.data)
        ) {
          throw new Error("The API returned an unexpected response.");
        }

        const countryDetailsByIso3 = new Map(
          countriesResult.data.map((country) => [country.iso3, country]),
        );
        const capitalsByIso3 = new Map(
          capitalsResult.data.map((country) => [
            country.iso3?.toUpperCase(),
            country,
          ]),
        );
        const flagsByIso3 = new Map(
          flagsResult.data.map((country) => [
            country.iso3?.toUpperCase(),
            country.flag,
          ]),
        );
        const populationByIso3 = new Map(
          populationResult.data.map((country) => {
            const latestPopulation = (country.populationCounts ?? []).reduce(
              (latest, entry) =>
                !latest || Number(entry.year) > Number(latest.year)
                  ? entry
                  : latest,
              null,
            );

            return [
              country.iso3?.toUpperCase(),
              latestPopulation ? Number(latestPopulation.value) : null,
            ];
          }),
        );
        const sortedCountries = Array.from(sovereignIso3Codes, (iso3) => {
          const country =
            countryDetailsByIso3.get(iso3) ?? capitalsByIso3.get(iso3);
          const capitalData = capitalsByIso3.get(iso3);
          if (!country || !capitalData) {
            throw new Error(`Country details are missing for ${iso3}.`);
          }

          const countryContinent = continentByIso3.get(iso3);
          if (!countryContinent) {
            throw new Error(`Continent details are missing for ${iso3}.`);
          }

          const code = country.iso2 ?? capitalData.iso2;
          if (!code || !(country.country ?? country.name)) {
            throw new Error(`Country identity is incomplete for ${iso3}.`);
          }
          const flagEmoji = code
            .toUpperCase()
            .split("")
            .map((letter) =>
              String.fromCodePoint(letter.charCodeAt(0) + 127397),
            )
            .join("");

          return {
            id: iso3,
            name: country.country ?? country.name,
            code,
            capital: capitalData.capital || "Capital unavailable",
            flag: flagsByIso3.get(iso3) || "",
            flagEmoji,
            population: populationByIso3.get(iso3) ?? null,
            continent: countryContinent,
            region: popularRegionByIso3.get(iso3) ?? "",
          };
        }).sort((a, b) => a.name.localeCompare(b.name));
        setCountries(sortedCountries);
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(
            err instanceof Error ? err.message : "Could not load countries.",
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadCountries();

    return () => controller.abort();
  }, []);

  const normalizedSearch = searchQuery.trim().toLocaleLowerCase();
  const filteredCountries = countries.filter((country) => {
    const matchesSearch = country.name
      .toLocaleLowerCase()
      .includes(normalizedSearch);

    return (
      matchesSearch &&
      (!region || country.region === region) &&
      (!continent || country.continent === continent)
    );
  });

  const displayedCountries = [...filteredCountries].sort((a, b) => {
    if (normalizedSearch) {
      const aName = a.name.toLocaleLowerCase();
      const bName = b.name.toLocaleLowerCase();
      const aIndex = aName.indexOf(normalizedSearch);
      const bIndex = bName.indexOf(normalizedSearch);

      if (aIndex !== bIndex) return aIndex - bIndex;
      if (aName.length !== bName.length) return aName.length - bName.length;
    }

    if (sortBy === "population") {
      if (a.population === null && b.population === null) {
        return a.name.localeCompare(b.name);
      }
      if (a.population === null) return 1;
      if (b.population === null) return -1;
      return b.population - a.population;
    }

    return a.name.localeCompare(b.name);
  });
  const totalPages = Math.ceil(displayedCountries.length / countriesPerPage);
  const firstVisiblePage =
    Math.floor((currentPage - 1) / pageWindowSize) * pageWindowSize + 1;
  const lastVisiblePage = Math.min(
    firstVisiblePage + pageWindowSize - 1,
    totalPages,
  );
  const visiblePages = Array.from(
    { length: lastVisiblePage - firstVisiblePage + 1 },
    (_, index) => firstVisiblePage + index,
  );
  const startIndex = (currentPage - 1) * countriesPerPage;
  const paginatedCountries = displayedCountries.slice(
    startIndex,
    startIndex + countriesPerPage,
  );

  return (
    <section className="section countries-section" id="countries">
      <button className="back-link" type="button" onClick={onBack}>
        <ArrowLeft size={15} /> Back to popular countries
      </button>
      <div className="countries-heading">
        <div>
          <p className="eyebrow blue-eyebrow">FIND YOUR NEXT DESTINATION</p>
          <h2>All Countries</h2>
          <p className="section-description">
            Browse through all 195 countries. Search or filter to find your
            favourite.
          </p>
        </div>
        <SearchField
          placeholder="Search countries..."
          className="countries-search"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>
      <div className="filters">
        <label>
          <span className="sr-only">Region</span>
          <select
            value={region}
            onChange={(e) => {
              setRegion(e.target.value);
              setCurrentPage(1);
            }}
            disabled={Boolean(continent)}
          >
            <option value=""> Popular regions</option>
            <option value="eastern-asia">Eastern Asia</option>
            <option value="western-europe">Western Europe</option>
            <option value="southeast-asia">Southeast Asia</option>
            <option value="south-asia">South Asia</option>
            <option value="middle-east">Middle East</option>
            <option value="north-africa">North Africa</option>
            <option value="sub-saharan-africa">Sub-Saharan Africa</option>
            <option value="north-america">North America</option>
            <option value="central-america">
              Central America &amp; Caribean
            </option>
          </select>
        </label>
        <label>
          <span className="sr-only">Continent</span>
          <select
            value={continent}
            onChange={(e) => {
              setContinent(e.target.value);
              setCurrentPage(1);
            }}
            disabled={Boolean(region)}
          >
            <option value="">Continent</option>
            <option value="africa">Africa</option>
            <option value="asia">Asia</option>
            <option value="europe">Europe</option>
            <option value="north-america">North America</option>
            <option value="south-america">South America</option>
            <option value="oceania">Oceania</option>
          </select>
        </label>
        <label>
          <span className="sr-only">Sort countries</span>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="name(a-z)">Name (A–Z)</option>
            <option value="population">Population: highest to lowest</option>
          </select>
        </label>
      </div>
      <div className="results-line">
        <span>{filteredCountries.length} countries found</span>
      </div>
      {isLoading && <p role="status">Loading countries...</p>}
      {error && <p role="alert">Could not load countries: {error}</p>}
      <div className="country-grid">
        {paginatedCountries.map((country) => (
          <CountryCard
            country={country}
            compact
            key={country.id}
            onSelect={onCountrySelect}
          />
        ))}
      </div>
      {totalPages > 1 && (
        <nav className="pagination" aria-label="Countries pages">
          <button
            type="button"
            aria-label="Previous page"
            onClick={() => setCurrentPage(firstVisiblePage - 1)}
            disabled={firstVisiblePage === 1}
          >
            <ChevronLeft size={17} />
          </button>
          {visiblePages.map((page) => (
            <button
              className={page === currentPage ? "selected" : ""}
              type="button"
              aria-current={page === currentPage ? "page" : undefined}
              key={page}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
          <button
            type="button"
            aria-label="Next page"
            onClick={() => setCurrentPage(lastVisiblePage + 1)}
            disabled={lastVisiblePage === totalPages}
          >
            <ChevronRight size={17} />
          </button>
        </nav>
      )}
    </section>
  );
}
