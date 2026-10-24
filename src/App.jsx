import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Flag,
  Globe,
  Landmark,
  Languages,
  MapPin,
  Menu,
  MoreHorizontal,
  Plane,
  Plus,
  Search,
  Star,
  Sun,
  UsersRound,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const popularCountryNames = [
  "United States",
  "Canada",
  "United Kingdom",
  "France",
  "Germany",
  "Japan",
  "Australia",
  "Brazil",
];
const countryCapitalsUrl =
  "https://countriesnow.space/api/v0.1/countries/capital";
const countryFlagsUrl =
  "https://countriesnow.space/api/v0.1/countries/flag/images";

const sovereignIso3Codes = new Set([
  "AFG",
  "ALB",
  "DZA",
  "AND",
  "AGO",
  "ATG",
  "ARG",
  "ARM",
  "AUS",
  "AUT",
  "AZE",
  "BHS",
  "BHR",
  "BGD",
  "BRB",
  "BLR",
  "BEL",
  "BLZ",
  "BEN",
  "BTN",
  "BOL",
  "BIH",
  "BWA",
  "BRA",
  "BRN",
  "BGR",
  "BFA",
  "BDI",
  "CPV",
  "KHM",
  "CMR",
  "CAN",
  "CAF",
  "TCD",
  "CHL",
  "CHN",
  "COL",
  "COM",
  "COG",
  "CRI",
  "CIV",
  "HRV",
  "CUB",
  "CYP",
  "CZE",
  "PRK",
  "COD",
  "DNK",
  "DJI",
  "DMA",
  "DOM",
  "ECU",
  "EGY",
  "SLV",
  "GNQ",
  "ERI",
  "EST",
  "SWZ",
  "ETH",
  "FJI",
  "FIN",
  "FRA",
  "GAB",
  "GMB",
  "GEO",
  "DEU",
  "GHA",
  "GRC",
  "GRD",
  "GTM",
  "GIN",
  "GNB",
  "GUY",
  "HTI",
  "HND",
  "HUN",
  "ISL",
  "IND",
  "IDN",
  "IRN",
  "IRQ",
  "IRL",
  "ISR",
  "ITA",
  "JAM",
  "JPN",
  "JOR",
  "KAZ",
  "KEN",
  "KIR",
  "KWT",
  "KGZ",
  "LAO",
  "LVA",
  "LBN",
  "LSO",
  "LBR",
  "LBY",
  "LIE",
  "LTU",
  "LUX",
  "MDG",
  "MWI",
  "MYS",
  "MDV",
  "MLI",
  "MLT",
  "MHL",
  "MRT",
  "MUS",
  "MEX",
  "FSM",
  "MDA",
  "MCO",
  "MNG",
  "MNE",
  "MAR",
  "MOZ",
  "MMR",
  "NAM",
  "NRU",
  "NPL",
  "NLD",
  "NZL",
  "NIC",
  "NER",
  "NGA",
  "MKD",
  "NOR",
  "OMN",
  "PAK",
  "PLW",
  "PAN",
  "PNG",
  "PRY",
  "PER",
  "PHL",
  "POL",
  "PRT",
  "QAT",
  "KOR",
  "ROU",
  "RUS",
  "RWA",
  "KNA",
  "LCA",
  "VCT",
  "WSM",
  "SMR",
  "STP",
  "SAU",
  "SEN",
  "SRB",
  "SYC",
  "SLE",
  "SGP",
  "SVK",
  "SVN",
  "SLB",
  "SOM",
  "ZAF",
  "SSD",
  "ESP",
  "LKA",
  "SDN",
  "SUR",
  "SWE",
  "CHE",
  "SYR",
  "TJK",
  "TZA",
  "THA",
  "TLS",
  "TGO",
  "TON",
  "TTO",
  "TUN",
  "TUR",
  "TKM",
  "TUV",
  "UGA",
  "UKR",
  "ARE",
  "GBR",
  "USA",
  "URY",
  "UZB",
  "VUT",
  "VEN",
  "VNM",
  "YEM",
  "ZMB",
  "ZWE",
  "VAT",
  "PSE",
]);

const continentIso3Codes = {
  africa:
    "DZA AGO BEN BWA BFA BDI CPV CMR CAF TCD COM COG COD CIV DJI EGY GNQ ERI SWZ ETH GAB GMB GHA GIN GNB KEN LSO LBR LBY MDG MWI MLI MRT MUS MAR MOZ NAM NER NGA RWA STP SEN SYC SLE SOM ZAF SSD SDN TZA TGO TUN UGA ZMB ZWE",
  asia: "AFG ARM AZE BHR BGD BTN BRN KHM CHN CYP GEO IND IDN IRN IRQ ISR JPN JOR KAZ KWT KGZ LAO LBN MYS MDV MNG MMR NPL PRK OMN PAK PHL QAT KOR SAU SGP LKA SYR TJK THA TLS TUR TKM ARE UZB VNM YEM PSE",
  europe:
    "ALB AND AUT BLR BEL BIH BGR HRV CZE DNK EST FIN FRA DEU GRC HUN ISL IRL ITA LVA LIE LTU LUX MLT MDA MCO MNE NLD MKD NOR POL PRT ROU RUS SMR SRB SVK SVN ESP SWE CHE UKR GBR VAT",
  northAmerica:
    "ATG BHS BRB BLZ CAN CRI CUB DMA DOM SLV GRD GTM HTI HND JAM MEX NIC PAN KNA LCA VCT TTO USA",
  southAmerica: "ARG BOL BRA CHL COL ECU GUY PRY PER SUR URY VEN",
  oceania: "AUS FJI KIR MHL FSM NRU NZL PLW PNG WSM SLB TON TUV VUT",
};
const continentByIso3 = new Map(
  Object.entries(continentIso3Codes).flatMap(([continent, iso3Codes]) =>
    iso3Codes.split(" ").map((iso3) => [iso3, continent]),
  ),
);
const popularRegionIso3Codes = {
  "eastern-asia": "CHN JPN MNG PRK KOR",
  "western-europe": "AUT BEL FRA DEU LIE LUX MCO NLD CHE",
  "southeast-asia": "BRN KHM IDN LAO MYS MMR PHL SGP THA TLS VNM",
  "south-asia": "AFG BGD BTN IND MDV NPL PAK LKA",
  "middle-east":
    "ARM AZE BHR CYP GEO IRN IRQ ISR JOR KWT LBN OMN PSE QAT SAU SYR TUR ARE YEM",
  "north-africa": "DZA EGY LBY MAR MRT SDN TUN",
  "sub-saharan-africa":
    "AGO BEN BWA BFA BDI CPV CMR CAF TCD COM COG COD CIV DJI GNQ ERI SWZ ETH GAB GMB GHA GIN GNB KEN LSO LBR MDG MWI MLI MUS MOZ NAM NER NGA RWA STP SEN SYC SLE SOM ZAF SSD TZA TGO UGA ZMB ZWE",
  "north-america": "CAN MEX USA",
  "central-america":
    "ATG BHS BRB BLZ CRI CUB DMA DOM SLV GRD GTM HTI HND JAM NIC PAN KNA LCA VCT TTO",
};
const popularRegionByIso3 = new Map(
  Object.entries(popularRegionIso3Codes).flatMap(([region, iso3Codes]) =>
    iso3Codes.split(" ").map((iso3) => [iso3, region]),
  ),
);
const journeyStorageKey = "tourist-hub:journey";

function isStoredJourneyCountry(entry) {
  const country = entry?.country;

  return (
    entry &&
    typeof entry === "object" &&
    typeof entry.id === "string" &&
    typeof entry.name === "string" &&
    typeof entry.detail === "string" &&
    typeof entry.flag === "string" &&
    country &&
    typeof country === "object" &&
    typeof country.id === "string" &&
    typeof country.name === "string" &&
    typeof country.code === "string" &&
    typeof country.capital === "string" &&
    typeof country.flag === "string" &&
    typeof country.flagEmoji === "string" &&
    typeof country.continent === "string" &&
    (country.population === null || typeof country.population === "number")
  );
}

function loadJourneyData() {
  const emptyJourneyData = { visitedCountries: [], plannedCountries: [] };

  try {
    const storedJourney = window.localStorage.getItem(journeyStorageKey);
    if (storedJourney === null) return emptyJourneyData;

    const journeyData = JSON.parse(storedJourney);
    if (
      !journeyData ||
      typeof journeyData !== "object" ||
      !Array.isArray(journeyData.visitedCountries) ||
      !Array.isArray(journeyData.plannedCountries) ||
      !journeyData.visitedCountries.every(isStoredJourneyCountry) ||
      !journeyData.plannedCountries.every(isStoredJourneyCountry)
    ) {
      throw new Error("Stored travel lists have an invalid format.");
    }

    return journeyData;
  } catch (error) {
    console.error("Could not load saved travel lists.", error);
    return emptyJourneyData;
  }
}

export default function App() {
  const [currentView, setCurrentView] = useState("home");
  const [previousView, setPreviousView] = useState("popular");
  const [countriesSearchQuery, setCountriesSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [ratingCountry, setRatingCountry] = useState(null);
  const [journeyList, setJourneyList] = useState("visited");
  const [journeyData, setJourneyData] = useState(loadJourneyData);
  const { visitedCountries, plannedCountries } = journeyData;

  useEffect(() => {
    try {
      window.localStorage.setItem(
        journeyStorageKey,
        JSON.stringify(journeyData),
      );
    } catch (error) {
      console.error("Could not save travel lists.", error);
    }
  }, [journeyData]);

  function navigateTo(view) {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleCountrySelect(country) {
    setPreviousView(currentView);
    setSelectedCountry({ ...country });
    navigateTo("details");
  }

  function handleHeroSearch(query) {
    setCountriesSearchQuery(query);
    navigateTo("countries");
  }

  function handleVisitReviewSubmit(country, rating, review, month, year) {
    const visitedCountry = {
      id: country.id,
      country,
      flag: country.flagEmoji,
      name: country.name,
      detail: `Visited on: ${month} ${year}`,
      review,
      rating,
    };

    setJourneyData((currentJourney) => ({
      visitedCountries: [
        visitedCountry,
        ...currentJourney.visitedCountries.filter(
          (visited) => visited.id !== visitedCountry.id,
        ),
      ],
      plannedCountries: currentJourney.plannedCountries.filter(
        (plannedCountry) => plannedCountry.id !== country.id,
      ),
    }));
    setRatingCountry(null);
    setJourneyList("visited");
    navigateTo("journey");
  }

  function handlePlanVisit(country) {
    setJourneyData((currentJourney) => ({
      ...currentJourney,
      plannedCountries: [
        {
          id: country.id,
          country,
          flag: country.flagEmoji,
          name: country.name,
          detail: "Added to your travel plans",
        },
        ...currentJourney.plannedCountries.filter(
          (plannedCountry) => plannedCountry.id !== country.id,
        ),
      ],
    }));
    setJourneyList("planned");
    navigateTo("journey");
  }

  function handleMovePlannedCountryToVisited(plannedCountry) {
    const visitedCountry = {
      id: plannedCountry.id,
      country: plannedCountry.country,
      flag: plannedCountry.flag,
      name: plannedCountry.name,
      detail: "Moved from planning to visited",
    };

    setJourneyData((currentJourney) => ({
      visitedCountries: [
        visitedCountry,
        ...currentJourney.visitedCountries.filter(
          (country) => country.id !== visitedCountry.id,
        ),
      ],
      plannedCountries: currentJourney.plannedCountries.filter(
        (country) => country.id !== plannedCountry.id,
      ),
    }));
  }

  return (
    <div className="app-shell">
      <Header currentView={currentView} onNavigate={navigateTo} />
      <main>
        {currentView === "home" && (
          <Hero
            onBrowseCountries={() => navigateTo("popular")}
            onSearch={handleHeroSearch}
          />
        )}
        {currentView === "popular" && (
          <PopularCountries
            onCountrySelect={handleCountrySelect}
            onViewAllCountries={() => {
              setCountriesSearchQuery("");
              navigateTo("countries");
            }}
          />
        )}
        {currentView === "countries" && (
          <Countries
            onCountrySelect={handleCountrySelect}
            initialSearchQuery={countriesSearchQuery}
            onBack={() => navigateTo("popular")}
          />
        )}
        {currentView === "details" && selectedCountry && (
          <CountryDetails
            country={selectedCountry}
            onBack={() => navigateTo(previousView)}
            onMarkVisited={setRatingCountry}
            onPlanVisit={handlePlanVisit}
            isVisited={visitedCountries.some(
              (visitedCountry) => visitedCountry.id === selectedCountry.id,
            )}
            isPlanned={plannedCountries.some(
              (plannedCountry) => plannedCountry.id === selectedCountry.id,
            )}
          />
        )}
        {currentView === "journey" && (
          <Journey
            visitedCountries={visitedCountries}
            plannedCountries={plannedCountries}
            activeList={journeyList}
            onActiveListChange={setJourneyList}
            onAddNewCountry={() => navigateTo("popular")}
            onCountrySelect={handleCountrySelect}
            onRemoveCountry={(countryId, list) => {
              const listKey =
                list === "visited" ? "visitedCountries" : "plannedCountries";
              setJourneyData((currentJourney) => ({
                ...currentJourney,
                [listKey]: currentJourney[listKey].filter(
                  (country) => country.id !== countryId,
                ),
              }));
            }}
            onMovePlannedCountryToVisited={handleMovePlannedCountryToVisited}
          />
        )}
      </main>
      {ratingCountry && (
        <RatingMockup
          country={ratingCountry}
          onClose={() => setRatingCountry(null)}
          onSubmit={handleVisitReviewSubmit}
        />
      )}
      {currentView !== "home" && (
        <footer className="site-footer">
          <span>© 2026 Tourist Hub</span>
          <span>Discover more of our world.</span>
          <CalendarDays size={16} />
        </footer>
      )}
      <div className="sr-only">
        <ChevronLeft />
        <ArrowRight />
      </div>
    </div>
  );
}

function SearchField({ placeholder, className = "", value, onChange }) {
  return (
    <label className={`search-field ${className}`}>
      <Search size={17} aria-hidden="true" />
      <input
        type="search"
        placeholder={placeholder}
        aria-label={placeholder}
        value={value}
        onChange={onChange}
      />
    </label>
  );
}

function Header({ currentView, onNavigate }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const countriesActive = ["popular", "countries", "details"].includes(
    currentView,
  );

  function handleNavigate(view) {
    setIsMenuOpen(false);
    onNavigate(view);
  }

  return (
    <header className="navbar">
      <a
        className="brand"
        href="#home"
        aria-label="Tourist Hub home"
        onClick={(event) => {
          event.preventDefault();
          handleNavigate("home");
        }}
      >
        <img src="/tourist-hub-logo.svg" alt="Tourist Hub" />
      </a>
      <nav
        className={`main-nav${isMenuOpen ? " is-open" : ""}`}
        id="main-navigation"
        aria-label="Main navigation"
      >
        <a
          className={currentView === "home" ? "active" : ""}
          href="#home"
          onClick={(event) => {
            event.preventDefault();
            handleNavigate("home");
          }}
        >
          Home
        </a>
        <a
          className={countriesActive ? "active" : ""}
          href="#countries"
          onClick={(event) => {
            event.preventDefault();
            handleNavigate("popular");
          }}
        >
          Countries
        </a>
        <a
          className={currentView === "journey" ? "active" : ""}
          href="#journey"
          onClick={(event) => {
            event.preventDefault();
            handleNavigate("journey");
          }}
        >
          Tourism
        </a>
      </nav>
      <div className="navbar-icons">
        <button
          className="icon-button"
          type="button"
          aria-label="Browse all countries"
          onClick={() => handleNavigate("countries")}
        >
          <Globe size={19} />
        </button>
        <button className="icon-button" type="button" aria-label="Color theme">
          <Sun size={19} />
        </button>
        <button
          className="icon-button mobile-menu-toggle"
          type="button"
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMenuOpen}
          aria-controls="main-navigation"
          onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
        >
          {isMenuOpen ? <X size={19} /> : <Menu size={19} />}
        </button>
      </div>
    </header>
  );
}

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

function Hero({ onBrowseCountries, onSearch }) {
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

function PopularCountries({ onCountrySelect, onViewAllCountries }) {
  const [popularCountries, setPopularCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(function () {
    const controller = new AbortController();

    async function getPopularCountries() {
      try {
        const responses = await Promise.all([
          fetch(countryCapitalsUrl, { signal: controller.signal }),
          fetch(countryFlagsUrl, { signal: controller.signal }),
        ]);
        const failedResponse = responses.find((res) => !res.ok);
        if (failedResponse) {
          throw new Error(`Country request failed (${failedResponse.status}).`);
        }

        const [capitals, flags] = await Promise.all(
          responses.map((res) => res.json()),
        );
        if (
          capitals.error ||
          flags.error ||
          !Array.isArray(capitals.data) ||
          !Array.isArray(flags.data)
        ) {
          throw new Error("Country request returned an unexpected response.");
        }

        const capitalsByName = new Map(
          capitals.data.map((country) => [country.name, country.capital]),
        );
        const flagsByName = new Map(
          flags.data.map((country) => [country.name, country]),
        );
        const data = popularCountryNames.map((name) => {
          const countryFlag = flagsByName.get(name);
          const capital = capitalsByName.get(name);
          const iso3 = countryFlag?.iso3?.toUpperCase();
          const iso2 = countryFlag?.iso2?.toUpperCase();
          if (!countryFlag || !capital || !iso3 || !iso2) {
            throw new Error(`Country data is missing for ${name}.`);
          }
          const continent = continentByIso3.get(iso3);
          if (!continent) {
            throw new Error(`Continent details are missing for ${iso3}.`);
          }
          const flagEmoji = iso2
            .split("")
            .map((letter) =>
              String.fromCodePoint(letter.charCodeAt(0) + 127397),
            )
            .join("");

          return {
            id: iso3,
            name,
            code: iso2,
            capital,
            flag: countryFlag.flag,
            flagEmoji,
            population: null,
            continent,
          };
        });

        setPopularCountries(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    getPopularCountries();

    return () => controller.abort();
  }, []);

  return (
    <section className="section popular-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow blue-eyebrow">START EXPLORING</p>
          <h2>Popular Countries</h2>
        </div>
        <button
          className="text-link"
          type="button"
          onClick={onViewAllCountries}
        >
          View all Countries
          <ArrowRight size={16} />
        </button>
      </div>
      <div className="popular-grid">
        {popularCountries.map((country) => (
          <article
            className="popular-card"
            key={country.id}
            role="button"
            tabIndex={0}
            aria-label={`View details for ${country.name}`}
            onClick={() => onCountrySelect(country)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onCountrySelect(country);
              }
            }}
          >
            <span className="popular-flag">
              <img src={country.flag} alt={`${country.name} flag`} />
            </span>
            <h3>{country.name}</h3>
            <p>Capital: {country.capital}</p>
          </article>
        ))}
      </div>
      {isLoading && <p role="status">Loading popular countries...</p>}
      {error && <p role="alert">Could not load popular countries: {error}</p>}
    </section>
  );
}

function Countries({ onCountrySelect, initialSearchQuery, onBack }) {
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

function CountryDetails({
  country,
  onBack,
  onMarkVisited,
  onPlanVisit,
  isVisited,
  isPlanned,
}) {
  const [countryInfo, setCountryInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const countryInfoByIso3 = useRef(new Map());

  useEffect(
    function () {
      if (!country) return undefined;

      const controller = new AbortController();

      async function loadCountryInfo() {
        const cachedInfo = countryInfoByIso3.current.get(country.id);
        if (cachedInfo) {
          setCountryInfo(cachedInfo);
          setError("");
          setIsLoading(false);
          return;
        }

        setCountryInfo(null);
        setError("");
        setIsLoading(true);

        try {
          const [response, geographyResponse] = await Promise.all([
            fetch(
              "https://countriesnow.space/api/v0.1/countries/info?returns=currency,unicodeFlag,capital,iso2,iso3",
              { signal: controller.signal },
            ),
            fetch(
              "https://raw.githubusercontent.com/mledoze/countries/master/countries.json",
              { signal: controller.signal },
            ),
          ]);
          if (!response.ok || !geographyResponse.ok) {
            const failedResponse = !response.ok ? response : geographyResponse;
            throw new Error(
              `Country details request failed (${failedResponse.status}).`,
            );
          }

          const [result, geographyResult] = await Promise.all([
            response.json(),
            geographyResponse.json(),
          ]);
          if (
            result.error ||
            !Array.isArray(result.data) ||
            !Array.isArray(geographyResult)
          ) {
            throw new Error(
              result.msg ||
                "The country details API returned an unexpected response.",
            );
          }

          const geographyByIso3 = new Map(
            geographyResult
              .filter((details) => details.cca3)
              .map((details) => [details.cca3.toUpperCase(), details]),
          );
          const selectedBaseInfo = result.data.find(
            (details) => details.iso3?.toUpperCase() === country.id,
          );
          const selectedGeography = geographyByIso3.get(country.id);
          if (!selectedBaseInfo || !selectedGeography) {
            throw new Error(
              `No additional details were found for ${country.name}.`,
            );
          }

          let governmentTypes = [];
          let timezones = [];
          let governanceError = "";
          const query = `
            SELECT ?governmentLabel ?timezoneLabel WHERE {
              ?country wdt:P298 "${country.id}".
              OPTIONAL { ?country wdt:P122 ?government. }
              OPTIONAL { ?country wdt:P421 ?timezone. }
              SERVICE wikibase:label {
                bd:serviceParam wikibase:language "en".
              }
            }
            LIMIT 50
          `;
          try {
            const wikidataResponse = await fetch(
              `https://query.wikidata.org/sparql?query=${encodeURIComponent(query)}&format=json`,
              {
                signal: controller.signal,
                headers: { Accept: "application/sparql-results+json" },
              },
            );
            if (!wikidataResponse.ok) {
              throw new Error(
                `Government details request failed (${wikidataResponse.status}).`,
              );
            }

            const wikidataResult = await wikidataResponse.json();
            const bindings = wikidataResult.results?.bindings;
            if (!Array.isArray(bindings)) {
              throw new Error(
                "The government details API returned an unexpected response.",
              );
            }

            governmentTypes = [
              ...new Set(
                bindings
                  .map((binding) => binding.governmentLabel?.value)
                  .filter(Boolean),
              ),
            ];
            timezones = [
              ...new Set(
                bindings
                  .map((binding) => binding.timezoneLabel?.value)
                  .filter(Boolean),
              ),
            ];
          } catch (err) {
            if (controller.signal.aborted) return;
            governanceError =
              err instanceof Error
                ? err.message
                : "Could not load government and national day details.";
          }

          const selectedInfo = {
            ...selectedBaseInfo,
            area: selectedGeography.area,
            languages: selectedGeography.languages,
            governmentTypes,
            timezones,
          };

          if (!governanceError) {
            countryInfoByIso3.current.set(country.id, selectedInfo);
          }
          setCountryInfo(selectedInfo);
          setError(governanceError);
        } catch (err) {
          if (!controller.signal.aborted) {
            setError(
              err instanceof Error
                ? err.message
                : "Could not load the selected country's details.",
            );
          }
        } finally {
          if (!controller.signal.aborted) {
            setIsLoading(false);
          }
        }
      }

      loadCountryInfo();

      return () => controller.abort();
    },
    [country],
  );

  if (!country) {
    return (
      <section className="section details-section" id="country-details">
        <h2>Country details</h2>
        <p>Select a country above to view its details.</p>
      </section>
    );
  }

  const formatPopulation = (population) =>
    population === null ? "Not available" : population.toLocaleString();
  const currency =
    countryInfo?.currency_name || countryInfo?.currency || "Not available";
  const languageValue = countryInfo?.languages || countryInfo?.language;
  const languages = Array.isArray(languageValue)
    ? languageValue.join(", ")
    : languageValue && typeof languageValue === "object"
      ? Object.values(languageValue).join(", ")
      : languageValue || "Not available";
  const area = countryInfo?.area
    ? `${Number(countryInfo.area).toLocaleString()} km²`
    : "Not available";
  const governmentType =
    countryInfo?.governmentTypes?.join(", ") || "Not available";
  const timeZones = countryInfo?.timezones?.join(", ") || "Not available";
  const continentName = country.continent
    .split("-")
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
  const nativeName =
    countryInfo?.nativeName || countryInfo?.native_name || country.name;

  return (
    <section className="section details-section" id="country-details">
      <button className="back-link" type="button" onClick={onBack}>
        <ArrowLeft size={15} /> Back to countries
      </button>
      {isLoading && <p role="status">Loading {country.name} details...</p>}
      {error && <p role="alert">Could not load additional details: {error}</p>}
      <div className="country-overview">
        <div className="gallery">
          <div className="gallery-thumbnails" aria-hidden="true">
            <span className="thumb thumb-one"></span>
            <span className="thumb thumb-two"></span>
            <span className="thumb thumb-three"></span>
            <span className="thumb thumb-four"></span>
          </div>
          <div className="country-photo">
            <span className="photo-caption">Explore {country.name}</span>
          </div>
        </div>
        <div className="country-summary">
          <div className="country-title">
            <span className="title-flag" aria-hidden="true">
              {country.flagEmoji}
            </span>
            <div>
              <h2>{country.name}</h2>
              <p className="native-name">{nativeName}</p>
              <p className="capital">
                <MapPin size={14} /> Capital: {country.capital}
              </p>
            </div>
          </div>
          <div className="country-facts">
            <div>
              <UsersRound />
              <span>
                Population
                <strong>{formatPopulation(country.population)}</strong>
              </span>
            </div>
            <div>
              <Languages />
              <span>
                Languages<strong>{languages}</strong>
              </span>
            </div>
            <div>
              <CircleDollarSign />
              <span>
                Currency<strong>{currency}</strong>
              </span>
            </div>
            <div>
              <MapPin />
              <span>
                Continent<strong>{continentName}</strong>
              </span>
            </div>
          </div>
          <p className="country-description">
            {country.name} is in {continentName}. Its capital is{" "}
            {country.capital}.
          </p>
          <div className="travel-actions">
            {isVisited ? (
              <button
                className="button-primary visited-button"
                type="button"
                disabled
              >
                <Check size={16} /> Country added to visited
              </button>
            ) : isPlanned ? (
              <button className="button-secondary" type="button" disabled>
                <Check size={16} /> Added to planned visit
              </button>
            ) : (
              <>
                <button
                  className="button-primary"
                  type="button"
                  onClick={() => onMarkVisited(country)}
                >
                  <Check size={16} /> Mark as Visited
                </button>
                <button
                  className="button-secondary"
                  type="button"
                  onClick={() => onPlanVisit(country)}
                >
                  <Bookmark size={16} /> Plan to Visit
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      {/* <nav className="detail-tabs" aria-label="Country details">
        <a className="selected" href="#overview">
          Overview
        </a>
        <a href="#flag">Flag</a>
        <a href="#map">Map</a>
        <a href="#facts">Facts</a>
      </nav> */}
      <div className="detail-panels" id="overview">
        <article className="info-panel quick-facts" id="facts">
          <h3>Quick Facts</h3>
          <dl>
            <div>
              <dt>
                <Globe /> Country
              </dt>
              <dd>{country.name}</dd>
            </div>
            <div>
              <dt>
                <Landmark /> Capital
              </dt>
              <dd>{country.capital}</dd>
            </div>
            <div>
              <dt>
                <UsersRound /> Population
              </dt>
              <dd>{formatPopulation(country.population)}</dd>
            </div>
            <div>
              <dt>
                <MapPin /> Area
              </dt>
              <dd>{area}</dd>
            </div>
            <div>
              <dt>
                <CircleDollarSign /> Currency
              </dt>
              <dd>{currency}</dd>
            </div>
            <div>
              <dt>
                <Languages /> Languages
              </dt>
              <dd>{languages}</dd>
            </div>
            <div>
              <dt>
                <Landmark /> Government type
              </dt>
              <dd>{governmentType}</dd>
            </div>
            <div>
              <dt>
                <Globe /> Time zone
              </dt>
              <dd>{timeZones}</dd>
            </div>
          </dl>
        </article>
        <article className="info-panel flag-panel" id="flag">
          <h3>Flag</h3>
          <div className="country-detail-flag">
            {country.flag ? (
              <img src={country.flag} alt={`Flag of ${country.name}`} />
            ) : (
              <span aria-label={`Flag of ${country.name}`}>
                {country.flagEmoji}
              </span>
            )}
          </div>
          <p>Flag of {country.name}</p>
        </article>
        <article className="info-panel map-panel" id="map">
          <h3>Map</h3>
          <div className="map-placeholder">
            <div className="map-watermark">{continentName.toUpperCase()}</div>
            <span className="map-pin">
              <MapPin size={22} fill="currentColor" />
            </span>
            <span className="map-label">{country.name}</span>
          </div>
        </article>
      </div>
    </section>
  );
}

function RatingMockup({ country, onClose, onSubmit }) {
  const [rating, setRating] = useState(0);
  const [note, setNote] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const hasNote = /[\p{L}\p{N}]+/u.test(note.trim());
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1899 }, (_, index) =>
    String(currentYear - index),
  );
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  function handleSubmit(event) {
    event.preventDefault();
    if (rating > 0 && hasNote && month && year) {
      onSubmit(country, rating, note.trim(), month, year);
    }
  }

  return (
    <div
      className="rating-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <form
        className="rating-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="rating-title"
        onSubmit={handleSubmit}
      >
        <div className="rating-heading">
          <div>
            <p className="eyebrow blue-eyebrow">SHARE YOUR STORY</p>
            <h3 id="rating-title">
              How was your experience in {country.name}?
            </h3>
          </div>
          <button
            type="button"
            aria-label="Close rating form"
            onClick={onClose}
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <p>Choose a rating and leave at least one word about your visit.</p>
        <div className="rating-stars" role="group" aria-label="Choose a rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              type="button"
              key={star}
              aria-label={`${star} ${star === 1 ? "star" : "stars"}`}
              aria-pressed={rating === star}
              onClick={() => setRating(star)}
            >
              <Star fill={star <= rating ? "currentColor" : "none"} />
            </button>
          ))}
        </div>
        <div className="visit-date-fields">
          <label htmlFor="visit-month">Month visited</label>
          <select
            id="visit-month"
            value={month}
            onChange={(event) => setMonth(event.target.value)}
            required
          >
            <option value="">Choose a month</option>
            {months.map((monthName) => (
              <option key={monthName} value={monthName}>
                {monthName}
              </option>
            ))}
          </select>
          <label htmlFor="visit-year">Year visited</label>
          <select
            id="visit-year"
            value={year}
            onChange={(event) => setYear(event.target.value)}
            required
          >
            <option value="">Choose a year</option>
            {years.map((yearOption) => (
              <option key={yearOption} value={yearOption}>
                {yearOption}
              </option>
            ))}
          </select>
        </div>
        <label className="rating-note-label" htmlFor="rating-note">
          Your note
        </label>
        <textarea
          id="rating-note"
          placeholder="Write a short note..."
          maxLength={200}
          value={note}
          onChange={(event) => setNote(event.target.value)}
          required
        />
        <p className="rating-note-hint">Enter at least one word to submit.</p>
        <button
          className="button-primary submit-rating"
          type="submit"
          disabled={rating === 0 || !hasNote || !month || !year}
        >
          Submit review
        </button>
      </form>
    </div>
  );
}

function Journey({
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

// function App() {
//   return (
//     <div className="app-shell">
//       <Header />
//       <main>
//         <Hero />
//         <PopularCountries />
//         <Countries />
//         <CountryDetails />
//         <Journey />
//       </main>
//       <footer className="site-footer">
//         <span>© 2026 Tourist Hub</span>
//         <span>Discover more of our world.</span>
//         <CalendarDays size={16} />
//       </footer>
//       <nav className="mobile-nav" aria-label="Mobile navigation">
//         <a className="selected" href="#home">
//           <Globe size={18} />
//           <span>Home</span>
//         </a>
//         <a href="#countries">
//           <Flag size={18} />
//           <span>Countries</span>
//         </a>
//         <a href="#journey">
//           <UsersRound size={18} />
//           <span>Tourism</span>
//         </a>
//       </nav>
//       <div className="sr-only">
//         <ChevronLeft />
//         <ArrowRight />
//       </div>
//     </div>
//   );
// }

// export default App;
