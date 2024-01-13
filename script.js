"use strict";

const Player = (marker) => {
    let _marker = marker;

    const GetMarker = () => {
        return _marker;
    }

    const SetMarker = (marker) =>{
        _marker = marker;
    }

    const ToggleMarker = () =>{
        _marker = (_marker === 'x') ? 'o' : 'x';
    }

    return {
        GetMarker, SetMarker, ToggleMarker
    };
};

const overlay = document.getElementById("overlay");
const message = document.getElementById("message");
const modal = document.getElementById('mode-modal');
const exitBtn = document.getElementById("exit-btn");
const xBtn = document.getElementById("x-marker-btn");
const oBtn = document.getElementById("o-marker-btn");
const field = document.getElementById("field");
const modeBtn = document.getElementById("mode-btn");
const restartBtn = document.getElementById("restart-btn");
const header = document.getElementById("header");

function ShowModeModal() {
    modal.classList.add("active");
    overlay.style.display = "block";
    console.log("Success: mode modal is shown");
}

function HideModeModal() {
    modal.classList.remove("active");
    overlay.style.display = "none";
    console.log("Success: mode modal is hidden")
}

const Mode = { FRND: 0, CMPT: 1, NONE: 2 }
const friendBtn = document.getElementById("friend-btn");
const computerBtn = document.getElementById("computer-btn");

function SetGameMode(btn) {
    if (btn.innerHTML === "Friend") {
        friendBtn.classList.add("chosen");
        computerBtn.classList.remove("chosen");
        currentGame.mode = Mode.FRND;
        console.log("Success: current mode in friend mode");
    } else if (btn.innerHTML === "Computer") {
        friendBtn.classList.remove("chosen");
        computerBtn.classList.add("chosen");
        currentGame.mode = Mode.CMPT;
        console.log("Success: current mode is computer mode");
    } else {
        currentGame.mode = Mode.NONE;
    }
    HideModeModal();
}
const winCases = [
    [1, 2, 3], 
    [4, 5, 6], 
    [7, 8, 9], 
    [1, 4, 7], 
    [2, 5, 8], 
    [3, 6, 9],
    [1, 5, 9],
    [3, 5, 7]
];

class Game{
    constructor(marker, mode, status, theme){
        this.currentPlayer = Object.create(Player(marker));
        this.mode = mode;
        this.status = status;
        this.theme = theme;
    }
    
    CheckWin() {
        for (const winCase of winCases) {
            const [a, b, c] = winCase;
            if (cells[a - 1].innerHTML === this.currentPlayer.GetMarker() && cells[b - 1].innerHTML === this.currentPlayer.GetMarker() && cells[c - 1].innerHTML === this.currentPlayer.GetMarker()) {
                if(this.theme === "light"){
                    cells[a-1].style.backgroundColor = "hotpink";
                    cells[b-1].style.backgroundColor = "hotpink";
                    cells[c-1].style.backgroundColor = "hotpink";
                }
                else{
                    cells[a-1].style.backgroundColor = "purple";
                    cells[b-1].style.backgroundColor = "purple";
                    cells[c-1].style.backgroundColor = "purple";
                }
                
                return true;
            }
        }
        return false;
    }
    CheckDraw() {
        return cells.every(cell => cell.classList.contains("marked"));
    }
    SetCurrentPlayer(marker){
        this.currentPlayer.SetMarker(marker);
    }
    //recheck
    SwitchCurrentPlayer(){
        this.currentPlayer.ToggleMarker();
        console.log("Player is switched to " + this.currentPlayer.GetMarker());
    }
    Start(){
        this.status = true;
        xBtn.disabled = true;
        oBtn.disabled = true;
        friendBtn.disabled = true;
        computerBtn.disabled = true;
        console.log("Status: game is started");
    }
    Stop(){
        this.status = false;
        message.innerHTML = this.currentPlayer.GetMarker() + " wins!";
        cells.forEach(cell => cell.classList.add("marked"));
        console.log("Status: game is stopped");
    }
    //maybe destructor to delete current game and create new one
    Restart(){
        this.currentPlayer.SetMarker('');
        this.mode = Mode.NONE;
        this.status = false;
    }
}

const currentGame = new Game('', Mode.NONE, false, "light");

function StartGameValidator() {
    if (this.status) {
        return;
    }

    if (this.mode === Mode.NONE) {
        alert("Please, choose a game mode!");
        console.log("Error: mode is not chosen");
    }
    else if (this.currentPlayer.GetMarker() === ''){
        alert("Please, choose a marker!");
        console.log("Error: marker is not chosen");
    }
    else {
        currentGame.Start();
    }
}

function SetMarker(btn)
{
    message.innerHTML = "Player " + btn.innerHTML;
    if ( btn.innerHTML === 'x'){
        xBtn.classList.add("chosen");
        oBtn.classList.remove("chosen");
    }
    else{
        oBtn.classList.add("chosen");
        xBtn.classList.remove("chosen");
    }
    console.log("Status: current marker is " + btn.innerHTML);
    currentGame.SetCurrentPlayer(btn.innerHTML);
}



const cells = [];
function MarkCell(cell) {
    if (!cell.classList.contains("marked")) {
        cell.innerHTML = currentGame.currentPlayer.GetMarker();
        let cellMarker = cell.innerHTML;
        let cellIndex = cell.classList[0];
        console.log("Success: " + cellIndex + " is marked with " + cellMarker);
        cell.classList.add("marked");

        if (currentGame.CheckWin()) {
            currentGame.Stop();
            return;
        }

        if (currentGame.mode === Mode.CMPT && currentGame.status) {
            const emptyCells = cells.filter(cell => !cell.classList.contains("marked"));
            if (emptyCells.length > 0) {
                const randomIndex = Math.floor(Math.random() * emptyCells.length);
                setTimeout(() => {
                    emptyCells[randomIndex].innerHTML = currentGame.currentPlayer.GetMarker();
                    emptyCells[randomIndex].classList.add("marked");

                    // Check for win conditions after the computer's move
                    if (currentGame.CheckWin()) {
                        currentGame.Stop();
                        return;
                    }

                    currentGame.SwitchCurrentPlayer();
                }, 1000);
            } else {
                currentGame.Stop();
            }
        }

        if (currentGame.CheckWin()) {
            currentGame.Stop();
            return;
        }

        if (currentGame.CheckDraw() && !currentGame.CheckWin()) {
            currentGame.Stop();
            message.innerHTML = "It's a draw!";
            console.log("Status: game is a draw");
        } else {
            currentGame.SwitchCurrentPlayer();
        }
    }
}

function SetField() {
    for (let i = 1; i < 10; i++) {
        let cell = document.createElement('div');
        cell.classList.add("cell" + i);
        cell.addEventListener('click', function () {
            StartGameValidator.call(currentGame);
            if (currentGame.status) {
                MarkCell(this);
            }
        });
        cells.push(cell);
        field.append(cell);
    }
}
SetField();
function RestartGame() {
    cells.forEach(cell => cell.innerHTML = ' ');
    cells.forEach(cell => cell.classList.remove("marked"));
    xBtn.disabled = false;
    oBtn.disabled = false;
    xBtn.classList.remove("chosen");
    oBtn.classList.remove("chosen");
    friendBtn.disabled = false;
    computerBtn.disabled = false;
    friendBtn.classList.remove("chosen");
    computerBtn.classList.remove("chosen");
    cells.forEach(cell => cell.style.backgroundColor = "transparent");
    console.log("Status: game is restarted");
    message.innerHTML = "";
    currentGame.Restart();
}
friendBtn.addEventListener('click', () => SetGameMode(friendBtn));
computerBtn.addEventListener('click', () => SetGameMode(computerBtn));

const themeBtn = document.getElementById("theme-btn");
const slider = document.getElementById("theme-slider");
const main = document.getElementById("main");
const gameplay = document.querySelector(".main-container");

themeBtn.addEventListener('change', function () {
    if (themeBtn.checked) {
        currentGame.theme = "dark"
        slider.style.background = "linear-gradient(90deg, purple 0%, black 100%)";
        main.classList.add("dark-theme-bg");
        gameplay.classList.add("dark-theme");
        field.classList.add("dark-theme");
        cells.forEach(cell => cell.classList.add("dark-theme"));
        oBtn.classList.add("dark-theme");
        xBtn.classList.add("dark-theme");
        friendBtn.classList.add("dark-theme");
        computerBtn.classList.add("dark-theme");
        modeBtn.classList.add("dark-theme");
        restartBtn.classList.add("dark-theme");
        header.classList.add("dark-theme");
        message.classList.add("dark-theme");

    } else {
        slider.style.background = "";
        currentGame.theme = "light";
        slider.style.background = "linear-gradient(90deg, hotpink 0%, rgb(193, 154, 255) 100%)";
        main.classList.remove("dark-theme-bg");
        gameplay.classList.remove("dark-theme");
        field.classList.remove("dark-theme");
        cells.forEach(cell => cell.classList.remove("dark-theme"));
        oBtn.classList.remove("dark-theme");
        xBtn.classList.remove("dark-theme");
        friendBtn.classList.remove("dark-theme");
        computerBtn.classList.remove("dark-theme");
        modeBtn.classList.remove("dark-theme");
        restartBtn.classList.remove("dark-theme");
        header.classList.remove("dark-theme");
        message.classList.remove("dark-theme");
    }
});