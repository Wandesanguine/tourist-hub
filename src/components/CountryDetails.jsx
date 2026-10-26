import {
  ArrowLeft,
  Bookmark,
  Check,
  CircleDollarSign,
  Globe,
  Landmark,
  Languages,
  MapPin,
  UsersRound,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function CountryDetails({
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
      if (!country) return;

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
