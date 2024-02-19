function startGame() {
    const playerName = document.getElementById('playerName').value;
    
    if (playerName.trim() === '') {
        alert('Please enter your name before starting the game.');
        return;
    }

    // Store the player name (you can use local storage or pass it to the game page as a query parameter)
    localStorage.setItem('playerName', playerName);

    // Redirect to the game page
    window.location.href = 'game-welcome.html';
}
