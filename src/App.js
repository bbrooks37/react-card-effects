import React, { useState, useEffect, useRef } from 'react';
import './App.css'; 

/**
 * Main application component.
 * 
 * This component manages the state and logic for the card drawing game.
 * It fetches a deck of cards, allows users to draw cards, shuffle the deck,
 * and provides options for automatic card drawing.
 */
function App() {
  const [deckId, setDeckId] = useState(null);
  const [remaining, setRemaining] = useState(0);
  const [cardImage, setCardImage] = useState(null);
  const [error, setError] = useState(null); 
  const [errorMessageVisible, setErrorMessageVisible] = useState(false); 
  const [isShuffling, setIsShuffling] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false); 
  const [shuffleSpeed, setShuffleSpeed] = useState(1000); 
  const intervalRef = useRef(null);
  const errorTimeoutRef = useRef(null); 

  useEffect(() => {
    const fetchDeck = async () => {
      try {
        const response = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
        const data = await response.json();
        setDeckId(data.deck_id);
        setRemaining(data.remaining);
      } catch (err) {
        console.error('Error fetching deck:', err);
        setError('Failed to fetch deck.');
      }
    };

    fetchDeck();
  }, []);

  /**
   * Draws a single card from the current deck.
   */
  const drawCard = async () => {
    if (remaining === 0) {
      setError('Error: no cards remaining!');
      setErrorMessageVisible(true);
      setIsDrawing(false);
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      clearTimeout(errorTimeoutRef.current);
      errorTimeoutRef.current = setTimeout(() => {
        setErrorMessageVisible(false);
      }, 3000);
      return;
    }

    try {
      const response = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);
      const data = await response.json();

      if (data && data.cards && data.cards.length > 0) {
        setCardImage(data.cards[0].image);
        setRemaining(data.remaining);
      } else {
        // Handle cases where 'data.cards' is undefined or empty
        if (!data.cards) {
          console.error('Error: Invalid API response. Missing "cards" property.');
          setError('Error: Invalid API response.');
          setErrorMessageVisible(true); 
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          clearTimeout(errorTimeoutRef.current);
          errorTimeoutRef.current = setTimeout(() => {
            setErrorMessageVisible(false);
          }, 3000);
        } else if (data.cards.length === 0) {
          console.error('No cards found in the response.');
          setError('Error: No cards available.');
          setErrorMessageVisible(true);
          setIsDrawing(false); 
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          clearTimeout(errorTimeoutRef.current);
          errorTimeoutRef.current = setTimeout(() => {
            setErrorMessageVisible(false);
          }, 3000);
        }
      }

    } catch (err) {
      console.error('Error drawing card:', err);
      setError('Failed to draw card.');
    }
  };

  /**
   * Shuffles the existing deck of cards.
   */
  const shuffleDeck = async () => {
    setIsShuffling(true);
    try {
      const response = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/shuffle/`);
      const data = await response.json();
      setRemaining(data.remaining);
      setCardImage(null);
      setIsShuffling(false);
    } catch (err) {
      console.error('Error shuffling deck:', err);
      setError('Failed to shuffle deck.');
      setIsShuffling(false);
    }
  };

  /**
   * Handles the start/stop drawing functionality.
   */
  const handleDraw = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsDrawing(false); 
    } else {
      intervalRef.current = setInterval(drawCard, 1000); 
      setIsDrawing(true); 
    }
  };

  /**
   * Toggles the shuffle speed between normal and fast.
   */
  const handleShuffleSpeed = () => {
    setShuffleSpeed(shuffleSpeed === 1000 ? 500 : 1000); 
  };

  return (
    <div className="container"> 
      <h1>Card Drawer</h1>
      {errorMessageVisible && ( 
        <p className="error">{error}</p> 
      )}
      {deckId && (
        <>
          <button className="button" onClick={handleDraw}>
            {isDrawing ? 'Stop Drawing' : 'Start Drawing'}
          </button>
          <button className="button" onClick={shuffleDeck} disabled={isShuffling}>
            Shuffle Deck
          </button>
          <button className="button" onClick={handleShuffleSpeed}>
            {shuffleSpeed === 1000 ? 'Fast Shuffle' : 'Normal Shuffle'} 
          </button>
          {cardImage && (
            <div className="card-container">
              <img src={cardImage} alt="Drawn Card" className="card" />
            </div>
          )}
          <p className="remaining">Cards Remaining: {remaining}</p>
        </>
      )}
    </div>
  );
}

export default App;