import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { continentByIso3, countryCapitalsUrl, countryFlagsUrl, popularCountryNames } from "../data/countryData.js";

export function PopularCountries({ onCountrySelect, onViewAllCountries }) {
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
