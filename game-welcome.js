document.addEventListener("DOMContentLoaded", function() {
    // Retrieve the player name from localStorage
    var playerName = localStorage.getItem("playerName");

    // Set the player name in the span element
    var playerNameSpan = document.getElementById("playerName");
    if (playerNameSpan) {
        playerNameSpan.textContent = playerName;
    }

    // Activate the button to start the game
    var startGameButton = document.getElementById("startGameButton");
    if (startGameButton) {
        startGameButton.addEventListener("click", function() {
            // Redirect to the game page
            window.location.href = "index.html";
        });
    }
});
