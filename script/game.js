const button = document.getElementById("start_button");
const first_step = document.getElementsByClassName("first_step");
const level_button = document.getElementsByClassName("level_button");
const all_mole = document.getElementsByClassName("all_mole");
const container_countdown = document.getElementById("container_countdown");
const countdown = document.getElementById("countdown");
const score_display = document.getElementById('score_display');
const background_audio = document.getElementById("background_audio");
const click = document.getElementById("click");
const button_leaderboard = document.getElementById("show_leaderboard_button");
const mole_sound_1 = document.getElementById("mole_sound_1");
const mole_sound_2 = document.getElementById("mole_sound_2");
const mole_sound_3 = document.getElementById("mole_sound_3");
const mole_sound_4 = document.getElementById("mole_sound_4");
const mole_sound_scream_1 = document.getElementById("mole_sound_scream_1");
const mole_sound_scream_2 = document.getElementById("mole_sound_scream_2");
const game_over = document.getElementById("game_over");
let nameInput = document.getElementById("name_input");
let niveauDifficulte = "facile";
let leaderboardData = [];
let playerName;
let timer = 30;
let score = 0;
let moleIndex;
let moleConfettis = [];

class MoleConfetti {
    constructor(moleId) {
        this.confetti = new Confetti(moleId);
    }

    celebrate() {
        this.confetti.setCount(95);
        this.confetti.setSize(1);
        this.confetti.setPower(75);
        this.confetti.setFade(false);
        this.confetti.destroyTarget(true);
    }
}

function lowerAudioOnClick() {
    background_audio.volume = 0.1;
}

for (let i = 0; i < level_button.length; i++) {
    level_button[i].addEventListener("click", function() {
        toggleButtonState(this);
        click.play();
        lowerAudioOnClick();

        if (this.id === "level_button_easy") {
            niveauDifficulte = "facile";
        } else if (this.id === "level_button_medium") {
            niveauDifficulte = "moyen";
        } else if (this.id === "level_button_hard") {
            niveauDifficulte = "difficile";
        }    
    });
}

function toggleButtonState(button) {
    button.classList.toggle("active");
}

button.addEventListener("click", function() {

    click.play();

    playerName = nameInput.value;
    if (playerName === "") {
        playerName = "Joueur Anonyme";
    }

    button.style.display = "none"; 
    container_countdown.style.display = "flex";
    score_display.style.display = "flex";

    for (let i = 0; i < first_step.length; i++) {
        const first_step = document.getElementsByClassName("first_step")[i];
        first_step.style.display = "none";    
    }

    for (let i = 0; i < level_button.length; i++) {
        const level_button = document.getElementsByClassName("level_button")[i];
        level_button.style.display = "none";
    }

    for (let i = 0; i < all_mole.length; i++) {
        const all_mole = document.getElementsByClassName("all_mole")[i];
        all_mole.style.display = "none";
    }

    function updateCountdown() {
        countdown.innerText = timer;
        timer--;

        if (timer < 0) {
            clearInterval(intervalId);
            countdown.innerText = "GAME OVER";
            countdown.style.color = "Red";
            countdown.style.fontSize = "60px";
            countdown.style.fontWeight = "bolder";
            finalScoreDisplay();
            game_over.play();
        }
    }

    function playRandomMoleSound() {
        let random_sound_index = Math.floor(Math.random() * 4) + 1;
        let mole_sound = document.getElementById("mole_sound_" + random_sound_index);
        mole_sound.play();
    }

    function playRandomMoleSoundScream() {
        let random_sound_scream_index = Math.floor(Math.random() * 2) + 1;
        let mole_sound_scream = document.getElementById("mole_sound_scream_" + random_sound_scream_index);
        mole_sound_scream.play();
    }

    function moleClicked() {
        playRandomMoleSoundScream();
        score++;
        updateScoreDisplay();

        let mole_id = "mole_" + moleIndex; 
        let moleConfetti = moleConfettis.find(confetti => confetti.confetti.target === mole_id);

        if (moleConfetti) {
            moleConfetti.celebrate();
        }
    }

    function updateScoreDisplay() {
        score_display.innerText = "Score de " + playerName + " : " + score;
    }

    function getFunnyMessage(score) {
        if (score < 4) {
            return "C'est un début, " + playerName + " ! Mais franchement, tu devrais peut-être changer de métier..";
        } else if (score < 8) {
            return "Pas mal, " + playerName + " ! On dirait que tu commences à comprendre.. Attention, elles sont rusées !";
        } else if (score < 11) {
            return "Wow, " + playerName + " ! Avec toi, les taupes ne savent plus où se cacher !";
        } else if (score < 15) {
            return "Impressionnant, " + playerName + " ! T'es en train de devenir un pro de l'extermination de taupes !";
        } else {
            return "Incroyable, " + playerName + " ! C'est la taupe-ocalypse.. T'es une véritable machine à taupes !";
        }
    }

    function hideGameElements() {
        const elementsToHide = document.querySelectorAll('.landscape_game > *:not(#countdown):not(.leaderboard-container)');
        
        elementsToHide.forEach(element => {
            element.style.display = 'none';
        });
    }

    function displayLeaderboard() {
        const leaderboardContainer = document.createElement("div");
        leaderboardContainer.classList.add("leaderboard-container");
        hideGameElements();
    
        for (let i = 0; i < leaderboardData.length; i++) {
            const playerData = leaderboardData[i];
    
            const playerDiv = document.createElement("div");
            playerDiv.classList.add("leaderboard-player");
    
            const playerImage = document.createElement("img");
            playerImage.src = "./assets/oyster.png";
            playerImage.alt = "Player Image";
    
            const playerNameDiv = document.createElement("div");
            playerNameDiv.innerText = playerData.playerName;
    
            const playerScoreDiv = document.createElement("div");
            playerScoreDiv.innerText = "Score: " + playerData.score;
    
            const playerIQDiv = document.createElement("div");
            playerIQDiv.innerText = getFunnyMessage(playerData.score);
    
            playerDiv.appendChild(playerImage);
            playerDiv.appendChild(playerNameDiv);
            playerDiv.appendChild(playerScoreDiv);
            playerDiv.appendChild(playerIQDiv);
    
            leaderboardContainer.appendChild(playerDiv);
        }
    
        document.body.appendChild(leaderboardContainer);
    }

    button_leaderboard.addEventListener("click", function() {
        displayLeaderboard();
    });

    function finalScoreDisplay() {
        const funnyMessage = getFunnyMessage(score);
        leaderboardData.push({ playerName, score });
        leaderboardData.sort((a, b) => b.score - a.score);
        button_leaderboard.style.display = "flex";
        score_display.innerText = "Tu as atomisé " + score + " taupes. " + funnyMessage;
    }

    const intervalId = setInterval(updateCountdown, 1000);

    function moleDisplay() {
        if (timer >= 0) {
            moleIndex = Math.floor(Math.random() * all_mole.length);
            all_mole[moleIndex].style.display = "flex";
            all_mole[moleIndex].addEventListener("click", moleClicked);
            playRandomMoleSound();

            moleConfettis.push(new MoleConfetti("mole_" + moleIndex));

            let tempsAffichage;

            if (niveauDifficulte === "facile") {
                tempsAffichage = Math.random() * 2000;
            } else if (niveauDifficulte === "moyen") {
                tempsAffichage = Math.random() * 1500;
            } else if (niveauDifficulte === "difficile") {
                tempsAffichage = Math.random() * 1000;
            }
    
            setTimeout(() => {
                all_mole[moleIndex].style.display = "none";
                all_mole[moleIndex].removeEventListener("click", moleClicked);
                setTimeout(moleDisplay, tempsAffichage);
            }, tempsAffichage);         
        }
    }    
    
    moleDisplay();
});