var startBtn = document.querySelector("#start");
var questionsEl = document.querySelector("#questions");
var choicesEl = document.querySelector("#choices");
var timerEl = document.querySelector("#time");
var submitBtn = document.querySelector("#submit");
var initialsEl = document.querySelector("#initials");
var feedbackEl = document.querySelector("#feedback");
var currentQuestionIndex = 0;
var time = questions.length * 15;
var timerId;

function startQuiz() {
    // hide start screen
    var startScreenEl = document.getElementById("start-screen");
    startScreenEl.setAttribute("class", "hide");
  
    // un-hide questions section
    questionsEl.removeAttribute("class");
  
    // start timer
    timerId = setInterval(clockTimer, 1000);
  
    // show starting time
    timerEl.textContent = time;
  
    getQuestion();
}
  
function getQuestion() {
    // gets current question from array
    var currentQuestion = questions[currentQuestionIndex];

    // update title with current question
    var titleEl = document.getElementById("question-title");
    titleEl.textContent = currentQuestion.title;

    // clear out any old choices
    choicesEl.innerHTML = "";

    // loop over choices
    currentQuestion.choices.forEach(function(choice, i) {
        // create new button for each choice
        var choiceNode = document.createElement("button");
        choiceNode.setAttribute("class", "choice");
        choiceNode.setAttribute("value", choice);

        choiceNode.textContent = i + 1 + ". " + choice;

        // attach click event listener to each choice
        choiceNode.onclick = questionClick;

        // display on the page
        choicesEl.appendChild(choiceNode);
    });
}

function questionClick() {
    // check if user guessed wrong
    if (this.value !== questions[currentQuestionIndex].answer) {
        // penalize time
        time -= 10;

        if (time < 0) {
        time = 0;
        }
        // display new time on page
        timerEl.textContent = time;
        feedbackEl.textContent = "Wrong!";
        feedbackEl.style.color = "red";
        feedbackEl.style.fontSize = "400%";
    } else {
        feedbackEl.textContent = "Correct!";
        feedbackEl.style.color = "green";
        feedbackEl.style.fontSize = "400%";
    }

    // display right or wrong
    feedbackEl.setAttribute("class", "feedback");
    setTimeout(function() {
        feedbackEl.setAttribute("class", "feedback hide");
    }, 1000);

    // next question
    currentQuestionIndex++;

    if (currentQuestionIndex === questions.length) {
        quizEnd();
    } else {
        getQuestion();
    }
}

function quizEnd() {
    // stop timer
    clearInterval(timerId);

    // show end screen
    var endScreenEl = document.getElementById("end-screen");
    endScreenEl.removeAttribute("class");

    // show your final score
    var finalScoreEl = document.getElementById("final-score");
    finalScoreEl.textContent = time;

    // hide questions section
    questionsEl.setAttribute("class", "hide");
}

function clockTimer() {
    // update time
    time--;
    timerEl.textContent = time;

    // check if user ran out of time
    if (time <= 0) {
        quizEnd();
    }
}

function saveScore() {
    // gets value of input box
    var initials = initialsEl.value.trim();

    if (initials !== "") {
        // gets saved scores from localstorage, or if not any, set to empty array
        var highscores =
        JSON.parse(window.localStorage.getItem("highscores")) || [];

        // new score for current user
        var newScore = {
        score: time,
        initials: initials
        };

        // save to localstorage
        highscores.push(newScore);
        window.localStorage.setItem("highscores", JSON.stringify(highscores));

        // redirect to next page
        window.location.href = "./scores.html";
    }
}

submitBtn.onclick = saveScore;
startBtn.onclick = startQuiz;
