function printAttemptsRemaining(tries) {
    const timeRemaining = document.getElementById('timeRemaining');
    timeRemaining.innerHTML = `<h2> Time left: ${timeLeft}</h2>`;

}

function printClue(status, guess) {
    const [digit100, digit10, digit1] = status=='HI' ? ['H', 'I', '-'] : ['L', 'O', '-'];
    document.getElementById('digit-100s').src = `assets/${digit100}.png`;
    document.getElementById('digit-10s').src = `assets/${digit10}.png`;
    document.getElementById('digit-1s').src = `assets/${digit1}.png`;
    then = Date.now();

}

function printGameOver(status) {
    if (status === 'WIN') {
        var message = `<h1>You win! You got it in ${30-timeLeft} seconds</h1>`;
    }
    else {
        var message = `<h1>You lose! The number was ${passcode}</h1>`;
    }
    document.body.innerHTML = message;
}
function printDigits() {
    document.getElementById('digit-100s').src = `assets/${guess.hundreds}.png`;
    document.getElementById('digit-10s').src = `assets/${guess.tens}.png`;
    document.getElementById('digit-1s').src = `assets/${guess.ones}.png`;
}