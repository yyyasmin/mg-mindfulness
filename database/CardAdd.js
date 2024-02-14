import React, { useState, useEffect } from "react";
import AddCard from "./AddCard";

function CardApp() {
  const [cards, setCards] = useState([]);

  // Load existing cards from the JSON file when the component mounts
  useEffect(() => {
    fetch("cards.json")
      .then((response) => response.json())
      .then((data) => setCards(data))
      .catch((error) => //console.error("Error loading cards", error));
  }, []);

  // Function to add a new card and write to the JSON file
  const addCard = (newCard) => {
    // Add the new card to the existing cards array
    const updatedCards = [...cards, newCard];
    setCards(updatedCards);

    // Write the updated cards array to the JSON file
    fetch("cards.json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedCards),
    })
      .then((response) => response.json())
      .then((data) => {
        //console.log("Card added and JSON file updated", data);
      })
      .catch((error) => //console.error("Error adding card", error));
  };

  return (
    <div>
      <h1>Card List</h1>
      <ul>
        {cards.map((card, index) => (
          <li key={index}>
            <strong>{card.title}</strong>: {card.description}
          </li>
        ))}
      </ul>
      <AddCard onAddCard={addCard} />
    </div>
  );
}

export default CardApp;
