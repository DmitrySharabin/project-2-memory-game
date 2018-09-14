// Basic properties of the game

// Number of pairs of cards
const NUMBER_OF_PAIRS = 8;

// Array of symbols that are on one side of the cards - theme of the game
const theme = ['🐶', '🐱', '🐭', '🐹', '🐻', '🐼', '🐵', '🐯'];

// Returns random integer number from 0 to num - 1
const randomInt = function (num) {
  num = num || 0;
  return Math.floor(Math.random() * num);
}

// Game Initialization
const init = function () {
  // There are two cards with the same symbol on it.
  // Use every symbol of the theme twice
  const symbols = [...theme, ...theme];

  // Add cards to the game board: every card is an element of
  // the unordered list with id game-board
  const gameBoard = document.querySelector('#game-board');

  // Use DocumentFragment to efficiently add cards to the game board
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < 2 * NUMBER_OF_PAIRS; i++) {

    // Create card
    const card = document.createElement('li');
    card.classList.add('card');

    // Symbol on a card is a random element of the array symbols.
    // To simulate shuffle of the cards pick one random element
    // of the array symbols and remove it from there.
    // randomInt(symbols.length) is index of the element
    card.textContent = symbols.splice(randomInt(symbols.length), 1);

    fragment.appendChild(card);
  }
  // Add cards to the game board
  gameBoard.appendChild(fragment);

  // Shows if only one card (that is not matched) is flipped
  let isOnlyOneCardFlipped = false;

  // Add Event Listener to the game board
  gameBoard.addEventListener('click', function(event) {
    // Event fires only on cards that are not flipped or matched:
    //  only on cards that have only one class 'card'
    if (event.target.classList.length === 1) {
      event.target.classList.add('flipped');
      if (isOnlyOneCardFlipped) {
        // Select flipped cards
        const flippedCards = gameBoard.querySelectorAll('.flipped');

        // Check if the flipped cards match
        if (flippedCards[0].textContent === flippedCards[1].textContent) {
          for (const flippedCard of flippedCards) {
            flippedCard.classList.add('matched');
          }
        }
        // Flip back cards. If they matched they will stay 'flipped'
        for (const flippedCard of flippedCards) {
          flippedCard.classList.remove('flipped');
        }
        // There is no flipped cards that are not mached
        isOnlyOneCardFlipped = false;
      } else {
        // There is only one flipped card that is not matched
        isOnlyOneCardFlipped = true;
      }
    }
  });
}

init();
