/*
 *
 * JavaScript for Chutes And Ladders
 *
 * Created on Apr. 27th, 2017
 *
 * By Andrew Prentiss Baker
 *
 */

function stall(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/*
 * 
 * Game Play
 * 
 */

var diceRoll = 0;
var tempDiceRoll = 0;
var thisFrame = 1;
var maxRollNum = 15;
var rollNum = 0;
var gameboardX = -184;
var gameboardY = -3750;
var newMainX = 28;
var tempMainX = 0;
var newMainY = 350;
var newMainWidth = 314;
var tempMainWidth = 0;
var newMainHeight = 420;
var newSpacerX = 28;
var newSpacerY = 114;
var newSpacerWidth = 318;
var newEndX = 28;
var newEndY = 94;
var newEndWidth = 314;
var newEndHeight = 420;
var side1 = 'right';
var side2 = 'left';
var shifted = false;

async function playGame() {
    setGameboard();
    await stall(5000);
    setGUI();
}

function firstRoll() {
    rollDice();
    setPlayingArea();
    switchGUI();
    document.addEventListener('keydown', function(e) {
        if (e.keyCode === 32 || e.key === " ") {
            checkCorL();
        }
    });
}

async function nextRoll() {
    fadeBoard();
    await stall(2000);
    setGameboardPos();
    rollDice();
    if (shifted) {
        shiftDown();
    }
    if (isNextLevel(thisFrame, diceRoll)) {
        shiftDown();
    }
    await stall(2000);
    resetPlayingArea();
    setPlayingArea();
}

async function setGameboard() {
    if (trebleClef) {
        gameBoard = 'Treble';
    } else {
        gameBoard = 'Bass';
    }
    $('#gameboard').css('background-image', 'url(../ChutesandLadders/images/ChutesandLadders' + gameBoard + '.png)');
    $('#gameboard').css('animation', 'introSlide 5s linear');
    await stall(1000);
    $('#gameboard').fadeIn(1000);
    $('#gameboard').css('background-position', '-184px -3750px');
    await stall(6000);
    $('#gameboard').css('animation', 'none');
}

function setSide() {
    if (isMovingRight(thisFrame)) {
        side1 = 'right';
        side2 = 'left';
    } else {
        side1 = 'left';
        side2 = 'right';
    }
}

async function setGUI() {
    $('#gui').fadeIn(1000);
    await stall(1000);
    $('#begin').on('click', function() {
        $('#begin').attr('id', 'active');
        firstRoll();
    });
}

function switchGUI() {
    $('#roll').fadeIn(1000);
    $('#gui').fadeOut(1000);
}

function rollDice() {
    if (quickGame) {
        rollNum++;
    }
    diceRoll = Math.floor((Math.random() * 6) + 1);

    //Allows user to input dice roll
    /*var dR = prompt('input dice roll between 1 and 6');
    if (dR != null) {
        diceRoll = parseInt(dR);
    }*/

}

function isMovingRight(n) {
    return (Math.trunc((n - 1) / 10) % 2) === 0;
}

function isNextLevel(f, d) {
    var current = Math.trunc((f - 1) / 10);
    var end = Math.trunc(((f - 1) + d - 1) / 10);
    return current !== end;
}

function shiftDown() {
    if (shifted) {
        newMainY -= 216;
    } else {
        gameboardY += 216;
        $('#gameboard').css('background-position-y', gameboardY + 'px');
        newMainY += 216;
    }
    $('#main-box').css('top', newMainY + 'px');
    shifted = !shifted;
}

function shiftLevel() {
    gameboardY += 432;
    $('#gameboard').css('background-position-y', gameboardY + 'px');
}

function setGameboardPos() {
    tempMainX = 0;
    gameboardY = (((Math.trunc((thisFrame - 1) / 10)) * 432) - 3750);
    if (isMovingRight(thisFrame)) {
        gameboardX = (-184 - (((thisFrame - 1) % 10) * 324));
    } else {
        gameboardX = (-1400 + (((thisFrame - 1) % 10) * 324));
    }
    if (gameboardX < -1400) {
        newMainX = (Math.abs(gameboardX + 1400));
        tempMainX = newMainX;
        gameboardX = -1400;
    } else if (gameboardX > -184) {
        tempMainX = Math.abs(gameboardX + 184);
        gameboardX = -184;
    }
    $('#gameboard').css('background-position-y', gameboardY + 'px');
    $('#gameboard').css('background-position-x', gameboardX + 'px');
    $('#gameboard').fadeIn(1000);
}

function resetPlayingArea() {
    $('#main-box').css('border', 'none');
    $('#spacer').css('border', 'none');
    $('#end-box').css('border', 'none');
    newMainWidth = 314;
    newMainHeight = 420;
    newEndHeight = 420;
}

function setPlayingArea() {
    setSide();
    tempDiceRoll = diceRoll;
    if (thisFrame + diceRoll > 100) {
        diceRoll = 101 - thisFrame;
    }
    if (isNextLevel(thisFrame, diceRoll)) {
        if (isMovingRight(thisFrame)) {
            newMainX = 28 + tempMainX;
            newMainWidth = (((10 - (thisFrame % 10)) * 314));
            newEndWidth = ((((thisFrame + diceRoll - 1) % 10) - 1) * 324) - 6;
            newSpacerX = 1732;
            newEndX = 1722 - newEndWidth;
        } else {
            tempMainWidth = 10 - (thisFrame % 10);
            newMainWidth = 324 * tempMainWidth - 5;
            newEndWidth = ((((thisFrame + diceRoll - 1) % 10) - 1) * 324) - 5;
            newSpacerX = 28;
            newEndX = 355;
        }

        if (thisFrame % 10 === 0 && diceRoll === 2) {
            justSpacerTurn();
        } else if (thisFrame % 10 === 0) {
            firstFrameTurn();
        } else if ((thisFrame + diceRoll - 1) % 10 === 1) {
            lastFrameTurn();
        } else {
            midFrameTurn();
        }
    } else {
        newMainX = 28 + tempMainX;
        newMainWidth = ((324 * diceRoll) - 12);
        if (!isMovingRight(thisFrame)) {
            newMainX = 2040 - newMainWidth - tempMainX;
        }
        $('#main-box').css('border', '10px solid');
    }
    $('#main-box').css('left', newMainX + 'px');
    $('#main-box').css('width', newMainWidth + 'px');
    $('#main-box').css('height', newMainHeight, 'px');
    $('#spacer').css('left', newSpacerX + 'px');
    $('#spacer').css('width', newSpacerWidth + 'px');
    $('#end-box').css('left', newEndX + 'px');
    $('#end-box').css('width', newEndWidth + 'px');
    $('#end-box').css('height', newEndHeight + 'px');
    diceRoll = tempDiceRoll;
    $('#roll').html('You rolled a: ' + diceRoll + '<br>Press Spacebar to Roll Again');
    $('.box').fadeIn(1000);
}

function justSpacerTurn() {
    if (isMovingRight(thisFrame)) {
        newSpacerX -= 4;
        newSpacerY += 20;
        newSpacerWidth -= 6;
    } else {
        newSpacerY += 20;
        newSpacerWidth -= 6;
    }
    $('#spacer').css('top', newSpacerY + 'px');
    $('#spacer').css('border', '10px solid');
}

function firstFrameTurn() {
    if (isMovingRight(thisFrame)) {
        newEndWidth = 1722 - newEndX;
        newMainHeight += 22;
    } else {
        newMainWidth = 350 - newMainX;
        newMainHeight += 22;
    }
    $('#main-box').css('top', newMainY + 'px');
    $('#spacer').css('top', newSpacerY + 'px');
    $('#end-box').css('top', newEndY + 'px');
    $('#main-box').css('border-' + side2, '10px solid');
    $('#spacer').css('border', '10px solid');
    $('#spacer').css('border-' + side2, 'none');
    $('#end-box').css('border', '10px solid');
    $('#end-box').css('border-' + side1, 'none');
}

function lastFrameTurn() {
    if (isMovingRight(thisFrame)) {
        newMainWidth = 1722 - newMainX;
        newEndHeight = 442;
    } else {
        newMainX = 355;
        newEndHeight = 442;
        newEndX -= 5;
    }
    $('#end-box').css('border-' + side1, '10px solid');
    $('#spacer').css('border', '10px solid');
    $('#spacer').css('border-' + side2, 'none');
    $('#main-box').css('border', '10px solid');
    $('#main-box').css('border-' + side1, 'none');
}

function midFrameTurn() {
    if (isMovingRight(thisFrame)) {
        newMainWidth = 1722 - newMainX;
    } else {
        newMainX = 355;
    }
    $('#main-box').css('border', '10px solid');
    $('#main-box').css('border-' + side1, 'none');
    $('#spacer').css('border', '10px solid');
    $('#spacer').css('border-' + side2, 'none');
    $('#end-box').css('border', '10px solid');
    $('#end-box').css('border-' + side1, 'none');
}

async function fadeBoard() {
    $('.box').fadeOut(1000);
    $('#gameboard').fadeOut(1000);
    await stall(1000);
    $('#roll').html('You rolled a: _<br>Press Spacebar to Roll Again');
}

function checkCorL() {
    thisFrame += (diceRoll - 1);
    switch (thisFrame) {
        case 1:
            thisFrame = 38;
            break;
        case 4:
            thisFrame = 14;
            break;
        case 9:
            thisFrame = 31;
            break;
        case 16:
            thisFrame = 6;
            break;
        case 21:
            thisFrame = 42;
            break;
        case 28:
            thisFrame = 84;
            break;
        case 36:
            thisFrame = 44;
            break;
        case 47:
            thisFrame = 26;
            break;
        case 49:
            thisFrame = 11;
            break;
        case 51:
            thisFrame = 67;
            break;
        case 56:
            thisFrame = 53;
            break;
        case 62:
            thisFrame = 19;
            break;
        case 64:
            thisFrame = 60;
            break;
        case 71:
            thisFrame = 91;
            break;
        case 80:
            thisFrame = 100;
            break;
        case 87:
            thisFrame = 24;
            break;
        case 93:
            thisFrame = 73;
            break;
        case 95:
            thisFrame = 75;
            break;
        case 98:
            thisFrame = 78;
            break;
        default:
            thisFrame++;
            break;
    }
    checkEndGame();
}

function checkEndGame() {
    if (thisFrame > 100) {
        triggerTrueEndGame();
    } else if (rollNum >= maxRollNum) {
        triggerQuickEndGame();
    } else {
        nextRoll();
    }
}

async function triggerTrueEndGame() {
    $('#gameboard').css('animation', 'playOut 10s linear');
    $('#gameboard').fadeOut(10000);
    await stall(10000);
    $('#gameover').fadeIn(2000);
    await stall(4000);
    $('#gameover').fadeOut(2000);
    await stall(2000);
    $('#gameover').text('Reload Page to Play Again');
    $('#gameover').fadeIn(2000);
    await stall(5000);
    main();
}

async function triggerQuickEndGame() {
    $('#gameboard').fadeOut(3000);
    await stall(3000);
    $('#gameover').text('Maximum Number of Rolls Met');
    $('#gameover').fadeIn(3000);
    await stall(3000);
    $('#gameover').fadeOut(3000);
    await stall(3000);
    $('#gameover').text('Reload Page to Play Again');
    $('#gameover').fadeIn(3000);
    await stall(5000);
    main();
}


/*
 *
 * Pregame
 * 
 */

var trebleClef = false;
var bassClef = false;
var trueGame = false;
var quickGame = false;

$(function main() {
    $('#pregame').fadeIn(1000);
    $('#pregame-bg').fadeIn(1000);
    $('#pregame-bg').css('animation', 'bgSlide 300s infinite linear');
    $('#perf-notes').on('mousedown', function() {
        $(this).attr('id', 'perf-active');
        window.open('images/CaLProgramNotes.png', 'popUpWindow', 'height=3300,width=2550');
    });
    $('#perf-notes').on('mouseup', function() {
        $(this).attr('id', 'perf-notes');
    });

    $('#option1').on('click', async function() {
        if (trebleClef || bassClef) {
            trueGame = true;
            $(this).attr('id', 'active')
            $('#pregame').fadeOut(1000);
            $('#pregame-bg').fadeOut(1000);
            await stall(1000);
            $('#pregame-bg').addClass('off');
            playGame();
        } else {
            trebleClef = true;
            $(this).attr('id', 'active');
            $('#options-box').fadeOut(1000);
            $('#prompt').fadeOut(1000);
            await stall(1000);
            $(this).attr('id', 'option1');
            $('#prompt').text('Pick a game type:');
            $(this).text('True');
            $('#option2').text('Quick');
            $('#options-box').fadeIn(1000);
            $('#prompt').fadeIn(1000);
        }
    });
    $('#option2').on('click', async function() {
        if (trebleClef || bassClef) {
            quickGame = true;
            $(this).attr('id', 'active');
            $('#pregame').fadeOut(1000);
            $('#pregame-bg').fadeOut(1000);
            await stall(1000);
            $('#pregame-bg').addClass('off');
            playGame();
        } else {
            bassClef = true;
            $(this).attr('id', 'active');
            $('#options-box').fadeOut(1000);
            $('#prompt').fadeOut(1000);
            await stall(1000);
            $(this).attr('id', 'option2');
            $('#prompt').text('Pick a game type:');
            $('#option1').text('True');
            $(this).text('Quick');
            $('#options-box').fadeIn(1000);
            $('#prompt').fadeIn(1000);
        }
    });
});