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
    // Math.floor(Math.random() * symbols.length) is index of the element
    card.textContent = symbols.splice(randomInt(symbols.length), 1);

    fragment.appendChild(card);
  }
  // Add cards to the game board
  gameBoard.appendChild(fragment);

  // Add Event Listener to the game board
  gameBoard.addEventListener('click', function(event) {
    // Select flipped cards
    const flippedCards = gameBoard.querySelectorAll('.flipped');

    // Two cards maximum can be flipped (if they are not matched)
    if (flippedCards.length > 1) {
      for (const flippedCard of flippedCards) {
        flippedCard.classList.remove('flipped');
      }
    } // End if (flippedCards.length > 1)
    event.target.classList.add('flipped');
  });
}

init();
