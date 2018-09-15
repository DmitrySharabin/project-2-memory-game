// Basic properties of the game

// Number of pairs of cards
const NUMBER_OF_PAIRS = 8;

// Themes of the game: symbols that are on one side of the cards and the color of the cards
const themes = [
  {
    name: 'animals',
    theme: '🐶🐱🐭🐹🐻🐼🐵🐯',
    color: '#4dc774'
  },
  {
    name: 'emoji',
    theme: '😇😍😂😎😘😱😳😉',
    color: '#ee7622'
  },
  {
    name: 'flora',
    theme: '🌵🌲🌴🌿🍁🌷🌺🌾',
    color: '#60b3f1'
  }
];

// Returns random integer number from 0 to num - 1
const randomInt = function (num) {
  num = num || 0;
  return Math.floor(Math.random() * num);
}

// Pick random theme
const themeNumber = randomInt(themes.length);
// Set theme symbols
const theme = themes[themeNumber].theme;
// Set theme color
document.querySelector(':root').style.setProperty('--themeColor', themes[themeNumber].color);

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

// Number of pairs of cards that are matched
let numOfMatchedPairs = 0;

// Shows if all cards are matched and the gave is over
let gameOver = false;

// Add Event Listener to the game board
gameBoard.addEventListener('click', function(event) {
  // Game board shouldn't be flipped
  if (event.target.nodeName === 'UL') { return; }

  // Event fires only on cards that are not flipped or matched
  if (!gameOver && !event.target.classList.contains('flipped') && !event.target.classList.contains('matched')) {
    event.target.classList.add('flipped');
    if (isOnlyOneCardFlipped) {
      // Select flipped cards
      const flippedCards = gameBoard.querySelectorAll('.flipped');

      // Check if the flipped cards match
      if (flippedCards[0].textContent === flippedCards[1].textContent) {
        // Increase number of matched pairs
        numOfMatchedPairs++;

        // and mark the cards as matched
        for (const flippedCard of flippedCards) {
          flippedCard.classList.add('matched');
        }
      } else {
        // Add labels to the flipped cards that have been guessed incorrectly
        for (const flippedCard of flippedCards) {
          flippedCard.classList.add('incorrect');
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

      // Remove labels from the flipped cards that have been guessed incorrectly
      const incorrectCards = gameBoard.querySelectorAll('.incorrect');
      for (const incorrectCard of incorrectCards) {
        incorrectCard.classList.remove('incorrect');
      }
    }

    // Check if all cards are matched
    if (numOfMatchedPairs === NUMBER_OF_PAIRS) {
      // The game is over
      gameOver = true;
      gameBoard.addEventListener('animationend', function () {
        // Add Event Listener to the 'Play Again!' button
        document.querySelector('.play-again').addEventListener('click', function () {
          // Simply reload the page from cache
          document.location.reload();
        });

        // Show modal window after animation ends
        const gameOverModal = document.querySelector('.game-over');
        gameOverModal.style.setProperty('visibility', 'visible');
      });
    }
  }
});
