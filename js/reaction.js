var i = 0;
var countdownTime;
var timer;
var circleAppearTime;
var clickTime;
var reactionTime;
var reactionTimer;
var interval;
const results = [];

/**
 * Shows the countdown timer and hides most of the other elements.
 */
function startGame() {
    clearPreviousRound();
    document.getElementById("start").style.visibility = "hidden";
    document.getElementById("intro").style.visibility = "hidden";
    document.getElementById("gameover").style.visibility = "hidden";
    document.getElementById("results").style.visibility = "hidden";
    document.getElementById("info").style.visibility = "hidden";
    playCountdownAudio();
    var countdownTimer = setInterval(function() {
        countdownTime--;
        document.getElementById("countdown").textContent = countdownTime;
        if (countdownTime == 2) {
            document.getElementById("countdown").style.color = "yellow";
        }
        if (countdownTime == 1) {
            document.getElementById("countdown").style.color = "#00e400";
        }
        if (countdownTime <= 0) {
            document.getElementById("countdown").style.visibility = "hidden";
            clearInterval(countdownTimer);
            pressReaction();
        }
    }, 1000);
}

/**
 * Generates a random number between 2 and 15 and uses it as 
 * countdown timer for showing the circle.
 * When 10 reactions times have been provided, the process stops.
 */
function pressReaction() {
    if (checkFull() == false) {
        clearInterval(interval);
        timer = Math.floor(Math.random() * (15 - 2) + 2);
        reactionTimer = setInterval(function() {
            timer--;
            if (timer <= 0 && i < 10) {
                document.getElementById("circle").style.visibility = "visible";
                clearInterval(reactionTimer);
                circleAppearTime = Date.now();
            }   
        }, 1000);
    }
}

/**
 * Calculates the reaction time when the circle is clicked.
 */
function clickCircle() {
    if (i < 10) {
        clickTime = Date.now();
        reactionTime = (clickTime - circleAppearTime) / 1000; // rounds to 3 decimals
        document.getElementById("time" + i).innerHTML = reactionTime;
        playClickAudio();
        results.push(reactionTime);
        i++;
        document.getElementById("circle").style.visibility = "hidden";
        interval = setTimeout(pressReaction, 2000);
    }
}

/**
 * Checks whether 10 reaction times have been provided.
 * @returns {boolean} If true, game ends and elements to give info for user are shown.
 */
function checkFull() {
    if (i < 10) {
        return false;
    }
    else {
        var sum = 0;
        for (var j = 0; j < results.length; j++) {
            sum += results[j];
        }
        var avgTime = Math.round((sum / 10) * 1000) / 1000;
        var minTime = Math.min(...results);
        var maxTime = Math.max(...results);
        document.getElementById("avg").innerHTML = avgTime;
        document.getElementById("min").innerHTML = minTime;
        document.getElementById("max").innerHTML = maxTime;
        document.getElementById("circle").style.visibility = "hidden";
        clearTimeout(interval);
        playGameOverAudio();
        document.getElementById("results").innerHTML = "Your average reaction time was: " + avgTime + "s<br> Can you improve? Play again!";
        createChart();
        document.getElementById("gameover").style.visibility = "visible";
        document.getElementById("results").style.visibility = "visible";
        document.getElementById("newgame").style.visibility = "visible";
        document.getElementById("info").style.visibility = "visible";
        return true;
    }
}

/**
 * Creates line chart to review the progression 
 * during the game.
 */
function createChart() {
    document.getElementById("chart").style.visibility = "visible";
    const xValues = [1,2,3,4,5,6,7,8,9,10];
    const yValues = results;
    new Chart("chart", {
        type: "line",
        data: {
            labels: xValues,
            datasets: [{
                fill: false,
                lineTension: 0,
                backgroundColor: "#5ff553",
                borderColor: "#043000 ",
                data: yValues
            }]
        },
        options: {
            legend: {display: false},
            scales: {
                yAxes: [{ticks: {min: 0, max: (Math.round(Math.max(...yValues) * 10) / 10) + 0.1}}],
            },
        }
    });
}

/**
 * Clears all values from previous round.
 */
function clearPreviousRound() {
    document.getElementById("time0").innerHTML = null;
    document.getElementById("time1").innerHTML = null;
    document.getElementById("time2").innerHTML = null;
    document.getElementById("time3").innerHTML = null;
    document.getElementById("time4").innerHTML = null;
    document.getElementById("time5").innerHTML = null;
    document.getElementById("time6").innerHTML = null;
    document.getElementById("time7").innerHTML = null;
    document.getElementById("time8").innerHTML = null;
    document.getElementById("time9").innerHTML = null;
    document.getElementById("avg").innerHTML = null;
    document.getElementById("min").innerHTML = null;
    document.getElementById("max").innerHTML = null;
    results.length = 0;
    countdownTime = 3;
    i = 0;
    document.getElementById("countdown").textContent = countdownTime;
    document.getElementById("countdown").style.visibility = "visible";
    document.getElementById("countdown").style.color = "red";
    document.getElementById("newgame").style.visibility = "hidden";
    document.getElementById("chart").style.visibility = "hidden";
}

/**
 * Functions for playing audio on specific situations
 */

function playCountdownAudio() {
    var audio = document.getElementById("audio");
    audio.volume = 0.08;
    audio.play();
}

function playClickAudio() {
    var audio = document.getElementById("audio3");
    audio.volume = 0.1;
    audio.play();
}

function playGameOverAudio() {
    var audio = document.getElementById("audio2");
    audio.volume = 0.08;
    audio.play();
}
