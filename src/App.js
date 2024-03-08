import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [pokemonData, setPokemonData] = useState(null);
  const [error, setError] = useState(null);
  const [filteredPokemonData, setFilteredPokemonData] = useState([]);
  const [selectedType, setSelectedType] = useState(null);

  useEffect(() => {
    const fetchPokemonData = async () => {
      try {
        const response = await axios.get(
          `https://pokeapi.co/api/v2/pokemon?limit=200`
        );
        setPokemonData(response.data.results);
        setError(null);
      } catch (error) {
        setError("Erro ao procurar Pokémon.");
      }
    };

    fetchPokemonData();
  }, []);

  const fetchPokemonByType = async (type) => {
    try {
      const response = await axios.get(
        `https://pokeapi.co/api/v2/type/${type}`
      );
      setFilteredPokemonData(response.data.pokemon.map((p) => p.pokemon));
      setError(null);
    } catch (error) {
      setError("Erro ao procurar Pokémon do tipo selecionado.");
    }
  };

  const handleTypeButtonClick = (type) => {
    setSelectedType(type);
    fetchPokemonByType(type);
  };

  const getTypeBackgroundColor = (types) => {
    if (types && types.length === 1) {
      return typeColors[types[0]] || "white";
    } else if (types && types.length === 2) {
      return `linear-gradient(to right, ${typeColors[types[0]] || "white"}, ${
        typeColors[types[1]] || "white"
      })`;
    } else {
      return "white";
    }
  };

  const getPokemonImage = (pokemon) => {
    const pokemonId = pokemon.url.split("/")[6];
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
  };

  const getPokemonBackgroundColor = (pokemon) => {
    if (pokemon && pokemon.types) {
      const types = pokemon.types.map((t) => t.type.name);
      return getTypeBackgroundColor(types);
    } else {
      return "white";
    }
  };

  return (
    <div className="flex flex-col h-screen items-center">
      <div className="grid grid-cols-9 gap-4 mb-4">
        {Object.keys(typeColors).map((type) => (
          <button
            key={type}
            onClick={() => handleTypeButtonClick(type)}
            className={`px-4 py-2 bg-${type} text-white rounded-md`}
            style={{ backgroundColor: typeColors[type] }}
          >
            {type}
          </button>
        ))}
      </div>
      {error && <div className="text-red-500">{error}</div>}
      <div className="grid grid-cols-4 gap-4">
        {selectedType
          ? filteredPokemonData.map((pokemon, index) => (
              <div
                key={index}
                className="flex flex-col items-center rounded-md"
                style={{ backgroundColor: getPokemonBackgroundColor(pokemon) }}
              >
                <div className={`text-2xl font-bold`}>{pokemon.name}</div>
                <img
                  src={getPokemonImage(pokemon)}
                  alt={pokemon.name}
                  className="mt-2"
                />
              </div>
            ))
          : pokemonData &&
            pokemonData.map((pokemon, index) => (
              <div
                key={index}
                className="flex flex-col items-center rounded-md"
              >
                <div className={`text-2xl font-bold`}>{pokemon.name}</div>
                <img
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
                    index + 1
                  }.png`}
                  alt={pokemon.name}
                  className="mt-2"
                />
              </div>
            ))}
      </div>
    </div>
  );
};

const typeColors = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD",
};

export default App;
