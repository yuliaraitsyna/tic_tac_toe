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
    constructor(marker, mode, status){
        this.currentPlayer = Object.create(Player(marker));
        this.mode = mode;
        this.status = status;
    }
    SetCurrentPlayer(marker){
        this.currentPlayer.SetMarker(marker);
    }
    //recheck
    SwitchCurrentPlayer(){
        this.currentPlayer.ToggleMarker();
    }
    Start(){
        this.status = true;
    }
    Stop(){
        this.status = false;
    }
    //maybe destructor to delete current game and create new one
    Restart(){
        this.currentPlayer.SetMarker('');
        this.mode = Mode.NONE;
        this.status = false;
    }
}

const currentGame = new Game('', Mode.NONE, false);

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
function RestartGame() {
    cells.forEach(cell => cell.innerHTML = "");
    message.innerHTML = "Game is not started!";
    currentGame.Restart();
}

const cells = [];
function MarkCell(cell){
    cell.innerHTML = currentGame.currentPlayer.GetMarker();
}
function SetField() {
    for (let i = 1; i < 10; i++) {
        let cell = document.createElement('div');
        cell.classList.add("cell" + i);
        cell.addEventListener('click', function () {
            StartGameValidator.call(currentGame);
            if (currentGame.status) {
                MarkCell(this);
                currentGame.SwitchCurrentPlayer();
            }
        });
        cells.push(cell);
        field.append(cell);
    }
}
SetField();

friendBtn.addEventListener('click', () => SetGameMode(friendBtn));
computerBtn.addEventListener('click', () => SetGameMode(computerBtn));
