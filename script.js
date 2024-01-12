"use strict";

const Player = (marker) => {
    let _marker = marker;

    const GetMarker = () => {
        return _marker;
    }

    const SetMarker = (marker) =>{
        _marker = marker;
    }

    return {
        GetMarker, SetMarker
    };
};

const message = document.getElementById("message");
const modal = document.getElementById('mode-modal');
const exitBtn = document.getElementById("exit-btn");
const field = document.getElementById("field");

function ShowModeModal() {
    modal.classList.add("active");
}

function HideModeModal() {
    modal.classList.remove("active");
}

function RestartGame() {
    cells.forEach(cell => cell.innerHTML = "");
    message.innerHTML = "Game is not started!";
}

const Mode = { FRND: 0, CMPT: 1, NONE: 2 }
const friendBtn = document.getElementById("friend-btn");
const computerBtn = document.getElementById("computer-btn");

function SetGameMode(btn) {
    if (btn.innerHTML === "Friend") {
        currentGame.mode = Mode.FRND;
        message.innerHTML = "Current mode is friend mode!";
    } else if (btn.innerHTML === "Computer") {
        currentGame.mode = Mode.CMPT;
        message.innerHTML = "Current mode is computer mode!";
    } else {
        currentGame.mode = Mode.NONE;
    }
    HideModeModal();
}

class Game{
    constructor(marker, mode){
        this.currentPlayer = Object.create(Player(marker));
        this.mode = mode;
    }
    SetCurrentPlayer(marker){
        this.currentPlayer.SetMarker(marker);
    }
    Start(){
        
    }
    Restart(){
        
    }
}

const currentGame = new Game('', Mode.NONE);

function StartGameValidator() {
    if (this.mode === Mode.NONE) {
        alert("Please, choose a game mode!");
    }
    else if (this.currentPlayer.GetMarker() === ''){
        alert("Please, choose a marker!");
    }
    else {
        message.innerHTML = "Game is started!";
        currentGame.Start();
    }
}

function SetMarker(btn)
{
    message.innerHTML = "Player " + btn.innerHTML;
    currentGame.SetCurrentPlayer(btn.innerHTML);
}
const cells = [];

function SetField() {
    for (let i = 1; i < 10; i++) {
        let cell = document.createElement('div');
        cell.classList.add("cell" + i);
        cell.addEventListener('click', StartGameValidator.bind(currentGame));
        cells.push(cell);
        field.append(cell);
    }
}
SetField();

friendBtn.addEventListener('click', () => SetGameMode(friendBtn));
computerBtn.addEventListener('click', () => SetGameMode(computerBtn));
