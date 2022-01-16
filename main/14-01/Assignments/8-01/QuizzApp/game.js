const question = document.getElementById('question')
const choices = Array.from(document.getElementsByClassName('choice-text'))
//console.log(choices)
//returns a nodelist of choices in that question


//const questionCounterText = document.getElementById('questionCounter')
const questionCounterText = document.getElementById('progressText')
const scoreText = document.getElementById('score')

const progressBarFull = document.getElementById('progress-bar-full')

let currentQuestion = {}

//initially before question aint loaded, were not accepting answers
let acceptingAnswers = false 
let score = 0 
let questionCounter = 0 //signifies which question we at 
let availableQuestions = []

//for audio
const music = new Audio('play.mp3')
const wrongmusic = new Audio('wrong.mp3')
const correctmusic = new Audio('correct.mp3')

//for timer 
const time_line = document.querySelector(".time_line");
const timeText = document.querySelector(".time_left_txt");
const timeCount = document.querySelector(".timer_sec");
 
let questions = [
    // //each question is an object
    // {
    //     question: 'inside which htmle elemnt do we put js',
    //     choice1: 'script',
    //     choice2: 'javascript',
    //     choice3: 'js',
    //     choice4: 'scripting',
    //     answer: 1
    // },

    // {
    //     question: 'whats your fav color',
    //     choice1: 'red',
    //     choice2: 'black',
    //     choice3: 'blue',
    //     choice4: 'green',
    //     answer: 2
    // },

    // {
    //     question: 'what comes after a',
    //     choice1: 'c',
    //     choice2: 'ript',
    //     choice3: 'b',
    //     choice4: 'scripting',
    //     answer: 3
    // }
];

//use the ftech function to fetch questions from the json 
fetch("questions.json").then( res => {
    console.log(res)
    return res.json()
    //return response in the promise 
}).then(loadedQuestions => {
    console.log(loadedQuestions)
    questions = loadedQuestions
    startGame()
}).catch( err => {
    console.log(err)
})

//constants 
const CORRECT_BONUS = 1000;
const MAX_QUESTIONS = 3; //how many qs user gets before they finish the game

startGame = () =>
{
    questionCounter = 0;
    score = 0;

    //copy question from questions array 
    //take this array"questions"
    // spread each items and put each array in available questions 
    availableQuestions = [...questions]
    console.log("available qs",availableQuestions)
    getNewQuestion()
    music.play();
    startTimer(15)
    startTimerLine(0)
}

let counter;

function startTimer(time) {
    counter = setInterval(timer, 1000);
    function timer(){
        timeCount.textContent = time; //changing the value of timeCount with time value
        time--; //decrement the time value
        if(time < 9){ //if timer is less than 9
            let addZero = timeCount.textContent; 
            timeCount.textContent = "0" + addZero; //add a 0 before time value
        }
        if(time < 0){ //if timer is less than 0
            clearInterval(counter); //clear counter
            timeText.textContent = "Time Off"; //change the time text to time off

            localStorage.setItem("mostRecentScore", score)

            //when there are no questions in array. then go to end page 
            return window.location.assign("end.html")
            }
    }
}

function startTimerLine(time){
    counterLine = setInterval(timer, 29);
    function timer(){
        time += 1; //upgrading time value with 1
        //time_line.style.width = time + "px"; //increasing width of time_line with px by time value
        if(time > 549){ //if time value is greater than 549
            clearInterval(counterLine); //clear counterLine
        }
    }
}

//fat arrow syntax 
getNewQuestion = () => {
    if(availableQuestions.length == 0 || 
        questionCounter > MAX_QUESTIONS) {
            //we'll use local storage to save our score when we reach the end page 
            localStorage.setItem("mostRecentScore", score)

            //when there are no questions in array. then go to end page 
            return window.location.assign("end.html")
        }
    //counter keeps increasing everytime we encounter a question 
    // 0 
    // 1 
    // 2
    // while questionCounter > MAX_QUESTIONS
    questionCounter++

    //HUD 
    //updating question counter text
    questionCounterText.innerText = "Questions " + questionCounter + "/" + MAX_QUESTIONS

    console.log("progress", questionCounter/MAX_QUESTIONS * 100);
    //WE'LL BE USING this as a reference for creating the progress bar 
    //we'll multiply by 100 to get a percent value 

    progressBarFull.style.width =
    `${(questionCounter/MAX_QUESTIONS)*100}%`;


    //were going to get a random number to fetch a random question 
    const questionIndex = Math.floor(Math.random() * availableQuestions.length)
    //Math.random()- generates a random number form 0 to 1 
    //Math.random() * 3- generates random number frm 0 to 3 
    //Math.floor(Math.random() * availableQuestions*length) - generates the lower side of the value generated by math.random() so we'll be dealing with an integer value 

    //we'll be dealing with integer value between 0 to 3
    //console.log(questionIndex)
    currentQuestion = availableQuestions[questionIndex]

    question.innerText = currentQuestion.question;
    //console.log(currentQuestion)

    choices.forEach(choice => {
        const number = choice.dataset['number']
        choice.innerText = currentQuestion['choice' + number]
        console.log(choice.innerText)
    });

//splice out the question we used from the array, so it doesnt repeat 
availableQuestions.splice(questionIndex, 1)

console.log(availableQuestions)
//note that: our availablequestions array has only 2 elements now 

acceptingAnswers = true 
};

choices.forEach(choice => {
    choice.addEventListener('click', e => {
        if(!acceptingAnswers)
            return;

        acceptingAnswers = false
        const selectedChoice = e.target 
        const selectedAnswer = selectedChoice.dataset['number']
        //what is the dataset of the selected answer by user
        
        //const classToApply = 'incorrect'

        //what answer did the usser sellect
        console.log("sa", selectedAnswer)

        console.log(e.target)
        //returns the element we click on

        //what is the correct answer acrd to the game
       console.log("ca",currentQuestion.answer)

        // if(selectedAnswer == currentQuestion.answer){
        //    classToApply = 'correct'
        // }else {
        //     classToApply = 'incorrect'
        // }

        //ternary operator 
        const classToApply = selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect'

        console.log(selectedAnswer == currentQuestion.answer)

        //increementing score on calling 
        if(classToApply == 'correct') {
            //incremment by 10 points 
            increementScore(CORRECT_BONUS);
            correctmusic.play()
        }

        else {
            wrongmusic.play()
            //adding red color on picking wrong answer
            selectedChoice.parentElement.classList.add(classToApply)

            localStorage.setItem("mostRecentScore", score)

            //when there are no questions in array. then go to end page 
            return window.location.assign("end.html")

        }

        //add green bg-color when correct answer is picked
        selectedChoice.parentElement.classList.add(classToApply)

        setTimeout( () => {
            selectedChoice.parentElement.classList.remove(classToApply)
            getNewQuestion()
            clearInterval(counter); //clear counter ✅
            clearInterval(counterLine); //clear counterLine ✅
        }, 1000)

    });
});


increementScore = (num) => {
    //over here num=10 when answer is correct, because it maps CORRECT_BONUS 
    //score = 0 + num 

    //num=0 when answer is incorrect 
    //score = 0+0 = 0
    score = score + num 
    scoreText.innerText = score
};


//startGame()