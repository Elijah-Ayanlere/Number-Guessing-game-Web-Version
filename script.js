let secretNumber;
let attemptsLeft;
let mysteryModifier;
let hintCoins;
let wildcardNumber;
let difficulty;

function startGame() {
    setDifficulty(); // Set initial difficulty
    secretNumber = generateSecretNumber();
    mysteryModifier = generateMysteryModifier();
    hintCoins = 3;
    updateAttemptsDisplay();
    updateHintCoins(); // Add this line to update hint coins

    // Display the welcome message with the user's name
    const playerName = localStorage.getItem('playerName');
    const message = document.getElementById('message');
    message.innerHTML = `<h3>Welcome, ${playerName}! Try to guess the number.</h3>`;
}

// Update difficulty immediately when user changes it
function updateDifficulty() {
    setDifficulty();
    updateAttemptsDisplay();
}

function setDifficulty() {
    difficulty = document.getElementById('difficulty').value;
    document.querySelector('.container').className = `container ${difficulty}`;

    // Set attempts based on difficulty
    switch (difficulty) {
        case 'easy':
            attemptsLeft = 10;
            break;
        case 'medium':
            attemptsLeft = 7;
            break;
        case 'hard':
            attemptsLeft = 5;
            break;
        default:
            attemptsLeft = 10;    
    }
    updateHintCoins();
}

function updateHintCoins() {
    const hintMessage = document.getElementById('message');

    // Set hint coins based on difficulty
    switch (difficulty) {
        case 'easy':
            hintCoins = 5;
            break;
        case 'medium':
            hintCoins = 3;
            break;
        case 'hard':
            hintCoins = 2;
            break;
        default:
            hintCoins = 5;
    }

    hintMessage.textContent = `You have ${hintCoins} Hint Coin(s) remaining.`;
    setTimeout(() => {
        hintMessage.textContent = '';
    }, 4000);
}

function generateSecretNumber() {
    return Math.floor(Math.random() * 100) + 1;
}

function generateMysteryModifier() {
    return Math.floor(Math.random() * 21) - 10;
}

function applyMysteryModifier(number) {
    return number + mysteryModifier;
}

function checkGuess() {
    const guessInput = document.getElementById('guess');
    const message = document.getElementById('message');

    const userGuess = parseInt(guessInput.value);

    if (isNaN(userGuess) || userGuess < 1 || userGuess > 100) {
        message.textContent = 'Invalid input. Please enter a number between 1 and 100.';
        return;
    }

    attemptsLeft--;

    const modifiedSecretNumber = applyMysteryModifier(secretNumber);

    if (userGuess === modifiedSecretNumber) {
        message.textContent = `Congratulations! You guessed the correct number ${secretNumber} with the mystery modifier ${mysteryModifier}!`;
        disableInput();
        playCorrectAudio();
    } else {
        message.textContent = userGuess < modifiedSecretNumber ? 'Too low! Try a higher number.' : 'Too high! Try a lower number.';
        updateAttemptsDisplay();
        playWrongAudio();
    }

    if (attemptsLeft === 0) {
        message.textContent = `Sorry, you've run out of attempts. The correct number was ${secretNumber} with the mystery modifier ${mysteryModifier}. Better luck next time!`;
        disableInput();
        playWrongAudio();
    }
}

function updateAttemptsDisplay() {
    const attemptsDisplay = document.getElementById('attempts');
    attemptsDisplay.textContent = attemptsLeft;
}

function disableInput() {
    document.getElementById('guess').disabled = true;
    document.querySelector('button').disabled = true;
    document.querySelectorAll('.action-button')[0].disabled = true;
    document.querySelectorAll('.action-button')[1].disabled = true;
}

function useHint() {
    const message = document.getElementById('message');

    if (hintCoins > 0) {
        hintCoins--;
        const evenOddHint = secretNumber % 2 === 0 ? 'even' : 'odd';
        message.textContent = `Hint: The correct number is ${evenOddHint}. You have ${hintCoins} Hint Coin(s) remaining.`;
        playHintCoinAudio();
        setTimeout(() => {
            message.textContent = '';
        }, 5000);
    } else {
        message.textContent = 'Sorry, you have no Hint Coins remaining.';
        setTimeout(() => {
            message.textContent = '';
        }, 5000);
    }
}


function playWildcardRound() {
    // resetGame();
    wildcardNumber = generateSecretNumber();
    const wildcardMessage = document.getElementById('wildcardMessage');
    wildcardMessage.style.display = 'block';
    document.querySelector('.submit-button').disabled = false;
    document.querySelectorAll('.action-button')[0].disabled = true;
    document.querySelectorAll('.action-button')[1].disabled = false;
    document.getElementById('playWildcardButton').innerHTML = '<b>Quit Wildcard Round</b>';
    document.getElementById('playWildcardButton').onclick = quitWildcardRound;
    playWildRoundAudio();

    const message = document.getElementById('message');
    message.textContent = '';

}

function quitWildcardRound() {
    const wildcardMessage = document.getElementById('wildcardMessage');
    wildcardMessage.style.display = 'none';
    document.querySelector('.submit-button').disabled = false;
    document.querySelectorAll('.action-button')[0].disabled = false;
    document.querySelectorAll('.action-button')[1].disabled = false;
    document.getElementById('playWildcardButton').innerHTML = '<b>Play Wildcard Round</b>';
    document.getElementById('playWildcardButton').onclick = playWildcardRound;
    const wildcardAudio = document.getElementById('wildRoundAudio');
    wildcardAudio.pause();
    wildcardAudio.load();
}

function checkWildcardGuess() {
    const guessInput = document.getElementById('guess');
    const message = document.getElementById('message');

    const userGuess = parseInt(guessInput.value);

    if (isNaN(userGuess) || userGuess < 1 || userGuess > 100) {
        message.textContent = 'Invalid input. Please enter a number between 1 and 100.';
        return;
    }

    if (userGuess === wildcardNumber) {
        message.textContent = `Congratulations! You guessed the Wildcard number ${wildcardNumber} and earned bonus points!`;
        disableInput();
    } else {
        message.textContent = 'Incorrect! Try again for bonus points.';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    hideWildcardMessage();
    startGame();
    document.querySelector('.card').classList.add('show');
    document.querySelector('.container').classList.add('show');
});

function hideWildcardMessage() {
    const wildcardMessage = document.getElementById('wildcardMessage');
    wildcardMessage.style.display = 'none';
}

let currentlyPlayingAudio = null;

function playWrongAudio() {
    stopCurrentlyPlayingAudio();
    currentlyPlayingAudio = document.getElementById('wrongAudio');
    currentlyPlayingAudio.play();
}

function playCorrectAudio() {
    stopCurrentlyPlayingAudio();
    currentlyPlayingAudio = document.getElementById('correctAudio');
    currentlyPlayingAudio.play();
}

function playWildRoundAudio() {
    stopCurrentlyPlayingAudio();
    currentlyPlayingAudio = document.getElementById('wildRoundAudio');
    currentlyPlayingAudio.play();
}

function playHintCoinAudio() {
    stopCurrentlyPlayingAudio();
    currentlyPlayingAudio = document.getElementById('hintCoinAudio');
    currentlyPlayingAudio.play();
}

function stopCurrentlyPlayingAudio() {
    if (currentlyPlayingAudio) {
        currentlyPlayingAudio.pause();
        currentlyPlayingAudio.currentTime = 0;
    }
}


document.addEventListener('DOMContentLoaded', startGame);
