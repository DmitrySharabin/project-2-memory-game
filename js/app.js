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

showStatistics();

// Shows if only one card (that is not matched) is flipped
let isOnlyOneCardFlipped = false;

// Number of pairs of cards that are matched
let numOfMatchedPairs = 0;

// Count number of moves
let numOfMoves = 0;
const movesCounter = document.querySelector('.moves-counter');

// Number of stars
let rating = 3;

// Show if timer is on (game has started)
let isTimerOn = false;
const timerField = document.querySelector('.timer');
// Time the user spent to win the game (in seconds)
let numOfSeconds = 0;
let timerId;

// Add Event Listener to the Reset Button
document.querySelector('.reset-button').addEventListener('click', function () {
  // Simply reload the page from cache
  document.location.reload();
});

// Add Event Listener to the Clear Results Button
document.querySelector('.clear-results').addEventListener('click', function () {
  // Remove stats from Local Storage
  localStorage.removeItem('memoryGameStats');
  // Update info on the screen
  showStatistics();
});

// Add Event Listener to the game board
gameBoard.addEventListener('click', function(event) {
  // Game board shouldn't be flipped
  if (event.target.nodeName === 'UL') { return; }

  // At first click a timer starts
  if (!isTimerOn) {
    isTimerOn = true;
    timerId = setInterval(function () {
      // Count time every second
      numOfSeconds = numOfSeconds + 1;

      // Transform time to format mm:ss
      let numOfMinutes = Math.floor(numOfSeconds / 60);
      if (numOfMinutes < 10) {
        numOfMinutes = `0${numOfMinutes}`;
      }
      let time = `${numOfMinutes}:`;
      if ((numOfSeconds % 60) < 10) {
        time += '0';
      }
      time = `${time}${(numOfSeconds % 60)}`;

      // Show it to the user
      timerField.textContent = time;
    }, 1000);
  }

  // Event fires only on cards that are not flipped or matched
  if (!event.target.classList.contains('flipped') && !event.target.classList.contains('matched')) {
    event.target.classList.add('flipped');

    // Increase number of moves and show it to the player
    numOfMoves += 1;
    let movesText = numOfMoves > 1 ? 'Moves' : 'Move';
    movesCounter.textContent = `${numOfMoves} ${movesText}`;

    // Count rating and show it to the user
    if (rating > 0) {
      // Choose which star to switch off: it depends on number of moves
      switch (numOfMoves) {
        case 19:
          document.querySelector(`#star-${rating}`).classList.remove('full');
          rating -= 1;
          break;
        case 26:
          document.querySelector(`#star-${rating}`).classList.remove('full');
          rating -= 1;
          break;
        case 32:
          document.querySelector(`#star-${rating}`).classList.remove('full');
          rating -= 1;
      }
    }

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

      // Stop the timer
      clearInterval(timerId);

      // Form the result message
      let resultText = `You made ${numOfMoves} moves and earned`;
      switch (rating) {
        case 0:
          resultText = `${resultText} no stars.`;
          break;
        case 1:
          resultText = `${resultText} 1 star.`;
          break;
        case 2:
        case 3:
          resultText = `${resultText} ${rating} stars.`;
      }
      resultText = `${resultText} It took you ${timerField.textContent} min.`;

      // Add it to the modal window
      document.querySelector('.result').textContent = resultText;

      // Save the result of this attempt to Local Storage
      saveStatistics(numOfMoves, rating, timerField.textContent);

      // Add Event Listener to the 'Play Again!' button
      document.querySelector('.play-again').addEventListener('click', function () {
        // Simply reload the page from cache
        document.location.reload();
      });

      // Wait the animation ends and show the game results
      gameBoard.addEventListener('animationend', function () {
        // Show modal window after animation ends
        const gameOverModal = document.querySelector('.game-over');
        gameOverModal.style.setProperty('visibility', 'visible');
      });
    }
  }
});

// Save game statistics to Local Storage
function saveStatistics(moves, stars, time) {
  // Read data from Local Storage
  const statistics = JSON.parse(localStorage.getItem('memoryGameStats') || '[]');
  // Add new data to statistics
  statistics.push({moves, stars, time});
  // Save updated data back to Local Storage
  localStorage.setItem('memoryGameStats', JSON.stringify(statistics));
}

// Read game statistics from Local Storage and show it to the user
function showStatistics() {
  const fragment = document.createDocumentFragment();
  const attempts = document.querySelector('.attempts-stats > tbody');

  // Remove previous data from the table
  while (attempts.firstElementChild) {
    attempts.removeChild(attempts.firstElementChild);
  }

  // Read data from Local Storage
  const stats = JSON.parse(localStorage.getItem('memoryGameStats') || '[]');

  if (!stats.length) {
    // If there is no data yet, tell the user about that
    const row = document.createElement('tr');
    const td = document.createElement('td');
    td.setAttribute('colspan', 4);
    td.textContent = 'There is no attempts yet!';

    row.appendChild(td);

    fragment.appendChild(row);
  } else {
    // Construct rows with data
    for (let i = 0; i < stats.length; i++) {
      const row = document.createElement('tr');

      let td = document.createElement('td');
      td.textContent = `#${i + 1}`;
      row.appendChild(td);

      td = document.createElement('td');
      td.textContent = stats[i].moves;
      row.appendChild(td);

      td = document.createElement('td');
      td.textContent = stats[i].stars;
      row.appendChild(td);

      td = document.createElement('td');
      td.textContent = stats[i].time;
      row.appendChild(td);

      fragment.appendChild(row);
    }
  }
  // and add them to the table with attempts statistics
  attempts.appendChild(fragment);
}
