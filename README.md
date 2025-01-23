# react-card-effects
Build an app that displays a deck of cards, one card at a time. When the page loads, go to the Deck of Cards API to create a new deck, and show a button on the page that will let you draw a card.
Every time you click the button, display a new card, until there are no cards left in the deck. If you try to draw when there are no cards remaining, an alert message should appear on the screen with the text “Error: no cards remaining!”.

**Our solution has some fancy CSS styling. The goal here is to focus on React and not CSS so please get the core functionality working and then get a code review. Do not focus on CSS at all for now.**

Here’s how this might look (with styling added):
## **Part 2: Shuffle The Deck**

Add a button that when clicked, will shuffle the deck, so that you can start drawing from a full deck without refreshing the page. You’ll have to make a call to the cards api to shuffle the existing deck. The button should not be clickable while the shuffle is in progress. The shuffle should remove all of the cards from the screen.

## **Further Study**

- Style your app so that it looks nice.
- Change the behavior of the app so that when you click on the button rather than drawing a single card, the page will draw one card every second. These draws will continue until you press the button again, or until the deck has been exhausted (at which point the alert message from Part 1 should appear). Make sure to change the button text appropriately as well (for example, it could toggle between “Start drawing” and “Stop drawing.”
    
    You will have to investigate the *useRef* hook to manage a *setInterval* call.
