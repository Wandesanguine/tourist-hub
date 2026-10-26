import { Globe, Menu, Sun, X } from "lucide-react";
import { useState } from "react";

export function Header({ currentView, onNavigate }) {
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
