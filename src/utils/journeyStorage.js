export const journeyStorageKey = "tourist-hub:journey";

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

export function loadJourneyData() {
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
