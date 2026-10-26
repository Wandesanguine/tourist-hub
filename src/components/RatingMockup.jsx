import { Star } from "lucide-react";
import { useEffect, useState } from "react";

export function RatingMockup({ country, onClose, onSubmit }) {
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
