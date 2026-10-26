import { CalendarDays } from "lucide-react";
import { useEffect, useState } from "react";
import { journeyStorageKey, loadJourneyData } from "./utils/journeyStorage.js";
import { CountryDetails } from "./components/CountryDetails.jsx";
import { Countries } from "./components/Countries.jsx";
import { Header } from "./components/Header.jsx";
import { Hero } from "./components/Hero.jsx";
import { Journey } from "./components/Journey.jsx";
import { PopularCountries } from "./components/PopularCountries.jsx";
import { RatingMockup } from "./components/RatingMockup.jsx";

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
            onMovePlannedCountryToVisited={(plannedCountry) =>
              setRatingCountry(plannedCountry.country)
            }
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
    </div>
  );
}
