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
        console.log("Error: mode is not chosen");
    }
    else if (this.currentPlayer.GetMarker() === ''){
        alert("Please, choose a marker!");
        console.log("Error: marker is not chosen");
    }
    else {
        message.innerHTML = "Game is started!";
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
function MarkCell(cell){
    if(!cell.classList.contains("marked")){
        cell.innerHTML = currentGame.currentPlayer.GetMarker();
        let cellMarker = cell.innerHTML;
        let cellIndex = cell.classList[0];
        console.log("Success: " + cellIndex + " is marked with " + cellMarker);
        cell.classList.add("marked");
        currentGame.SwitchCurrentPlayer();
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
    console.log("Status: game is restarted");
    message.innerHTML = "";
    currentGame.Restart();
}
friendBtn.addEventListener('click', () => SetGameMode(friendBtn));
computerBtn.addEventListener('click', () => SetGameMode(computerBtn));
