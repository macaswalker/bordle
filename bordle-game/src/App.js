// src/App.js
import React, { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { borders } from "./borders";
import "./App.css";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const App = () => {
  const [currentCountries, setCurrentCountries] = useState([]);
  const [inputVal, setInputVal] = useState("");
  const [lives, setLives] = useState(3);
  const [message, setMessage] = useState("Initializing Satellite...");
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const allCountries = Object.keys(borders);
    const randomStart = allCountries[Math.floor(Math.random() * allCountries.length)];
    
    setCurrentCountries([randomStart]);
    setLives(3);
    setGameOver(false);
    setGameWon(false);
    setInputVal("");
    setMessage(`Signal detected in ${randomStart}. Expand coverage.`);
  };

  // Helper: Matches user input (e.g. "france") to dictionary key ("France")
  const findCountryMatch = (input) => {
    const cleanInput = input.trim().toLowerCase();
    const keys = Object.keys(borders);
    return keys.find(key => key.toLowerCase() === cleanInput);
  };

  // Helper: Maps GeoJSON name to Borders.js key
  // (We need this to color the map correctly based on the GeoJSON file)
  const getDictionaryName = (mapName) => {
    if (borders[mapName]) return mapName;
    const overrides = {
        "United States of America": "United States of America",
        "Dem. Rep. Congo": "Dem. Rep. Congo",
        "Congo": "Congo",
        "Czechia": "Czechia",
        "Bosnia and Herz.": "Bosnia and Herz.",
        "Central African Rep.": "Central African Rep.",
        "Eq. Guinea": "Eq. Guinea",
        "Dominican Rep.": "Dominican Rep.",
        "S. Sudan": "South Sudan"
    };
    if (overrides[mapName] && borders[overrides[mapName]]) return overrides[mapName];
    return null; 
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (gameOver || gameWon) return;

    const matchedName = findCountryMatch(inputVal);

    // 1. Valid Country check
    if (!matchedName) {
      setMessage(`"${inputVal}" is not a recognized country.`);
      setInputVal("");
      return;
    }

    // 2. Already Visited Check
    if (currentCountries.includes(matchedName)) {
      setMessage(`Already secured ${matchedName}.`);
      setInputVal("");
      return;
    }

    // 3. Border Check
    const isNeighbor = currentCountries.some(ownedCountry => {
      const neighbors = borders[ownedCountry];
      return neighbors && neighbors.includes(matchedName);
    });

    if (isNeighbor) {
      const newCountryList = [...currentCountries, matchedName];
      setCurrentCountries(newCountryList);
      setMessage(`Access granted: ${matchedName}.`);
      setInputVal(""); // Clear input on success

      if (newCountryList.length === Object.keys(borders).length) {
        setGameWon(true);
        setMessage("WORLD CONQUERED.");
      }
    } else {
      const newLives = lives - 1;
      setLives(newLives);
      setInputVal(""); // Clear input on fail
      
      if (newLives <= 0) {
        setGameOver(true);
        setMessage(`Signal Lost. Game Over.`);
      } else {
        setMessage(`Connection Failed: ${matchedName} is not adjacent.`);
      }
    }
  };

  // The "Fog of War" Style Logic
  const getGeographyStyle = (geo) => {
    const dictName = getDictionaryName(geo.properties.name);
    const isDiscovered = dictName && currentCountries.includes(dictName);

    // If discovered: Neon Green. 
    // If NOT discovered: Same color as background (Invisible)
    const fillColor = isDiscovered ? "#4CAF50" : "#1a1d29"; 
    const strokeColor = isDiscovered ? "#ffffff" : "#1a1d29";
    
    // Z-index illusion: we draw the stroke thick on invisible countries to hide borders
    // between two invisible countries, but make visible ones pop.
    
    return {
      default: { fill: fillColor, stroke: strokeColor, strokeWidth: 0.5, outline: "none" },
      hover: { fill: isDiscovered ? "#66bb6a" : "#1a1d29", stroke: strokeColor, strokeWidth: 0.5, outline: "none" },
      pressed: { fill: fillColor, outline: "none" },
    };
  };

  return (
    <div className="game-container">
      {/* Floating HUD */}
      <div className="hud">
        <h1>BORDLE</h1>
        <p className="status">{message}</p>
        
        {!gameOver ? (
            <form onSubmit={handleSubmit} className="guess-form">
            <input 
                type="text" 
                className="guess-input"
                placeholder="Enter country..." 
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                autoFocus
            />
            <button type="submit" className="guess-btn">SCAN</button>
            </form>
        ) : (
            <button onClick={startNewGame} className="guess-btn">REBOOT SYSTEM</button>
        )}

        <div className="stats">
          <span>SIGNAL STRENGTH: {lives}</span>
          <span>TERRITORY: {currentCountries.length}</span>
        </div>
      </div>

      {/* Map */}
      <div className="map-wrapper">
        <ComposableMap 
            projectionConfig={{ scale: 180 }} 
            width={800} 
            height={600}
            style={{ width: "100%", height: "100%" }} // Ensures canvas fills div
        >
          <ZoomableGroup 
            minZoom={1} 
            maxZoom={10} 
            translateExtent={[[0, 0], [800, 600]]} // Keeps map from flying off screen
          >
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    // No onClick anymore
                    style={getGeographyStyle(geo)}
                    // Make non-interactive to prevent cursor flicker on invisible lands
                    pointerEvents={currentCountries.includes(getDictionaryName(geo.properties.name)) ? "all" : "none"}
                  />
                ))
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
      </div>
    </div>
  );
};

export default App;