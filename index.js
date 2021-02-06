//Start variables
const ORDER_NUMBER = document.querySelector(".order_number");
const TIMER = document.getElementById("timer");
const NUMBER_1 = document.getElementById("number_1");
const NUMBER_2 = document.getElementById("number_2");
const OPERATION = document.getElementById("operation");
const RESULT_CORRECT_POINT = document.getElementById("result_correct");
const RESULT_INCORRECT_AND_TIMED_POINT = document.getElementById(
  "result_incorrect_and_timed"
);
const RESULT_TOTAL_POINTS = document.getElementById("result_total_points");
const ANSWERS_CONTENT = document.querySelector(".answers_content");
const POINTS_CONTENT = document.querySelector(".points_content");
const WRAPPER_TOTAL_POINTS = document.querySelector(".wrapper_total_points");
const WRAPPER_QUIZ = document.querySelector(".wrapper_quiz");
const WRAPPER_BTN = document.querySelector(".wrapper_btn");
const ONE_POINT_BALL = 10;
const TESTS_LENGHT = 15;
let tests = [];
let current = null;
let timeInterval = null;
//end variables

// quiz starter //
const startQuizTest = () => {
  renderOrderNumber();
  renderQuetion();
  renderAnswers();
  timerCreator();
};

//RENDER OREDER NUMBER //
const renderOrderNumber = () => {
  const { sequence } = current;
  ORDER_NUMBER.innerText = sequence;
};

//RENDER QUESTION //
const renderQuetion = () => {
  const { number1, number2, operation } = current;
  NUMBER_1.innerText = number1;
  NUMBER_2.innerText = number2;
  OPERATION.innerText = operation;
};

//RENDER ANSWERS //
const renderAnswers = () => {
  let randomAnswers = answersConvertorWithRandomNumber();
  let answersWithHtml = answersConvertorWithHtmlTags(randomAnswers);
  let result = "";
  for (let i = 0, j = 1; i < 3; i += 2, j += 2) {
    result += `<div class="row">
    ${answersWithHtml[i]}
    ${answersWithHtml[j]}
    </div>`;
  }
  ANSWERS_CONTENT.innerHTML = result;
};

//RENDER POINTS //
const renderPoints = () => {
  let result = "";
  tests.forEach(({ correctStatus: st }) => {
    result += `<li class="${checkPointAndGetClass(st)}"></li>`;
  });
  POINTS_CONTENT.innerHTML = result;
};
// check point and get class
const checkPointAndGetClass = (status) => {
  return `pointer ${
    status === 1 ? "pointer-success" : status === 0 ? "pointer-failed" : ""
  }`;
};

// random number
const randomNumber = (limit = 200) => {
  return Math.floor(Math.random() * limit);
};

// to calculate with js statment //
const toCalculate = (num1, oper, num2) => {
  return eval(num1 + oper + num2);
};

//answers convertor with random numbers //
const answersConvertorWithRandomNumber = () => {
  let { correctAnswer } = current;
  let answers = [correctAnswer];
  for (let i = 0; i < 3; i++) answers.push(randomNumber(correctAnswer));
  return answers.sort(() => Math.random() - 0.5);
};

// get random operation //
const getRandomOperation = () => {
  let operations = ["-", "*", "+"];
  let randomIndex = randomNumber(operations.length);
  return operations[randomIndex];
};

//answers convertor with html tags
const answersConvertorWithHtmlTags = (answers) => {
  let variants = ["A", "B", "C", "D"];
  return answers.map(
    (answer, index) =>
      `<div class="answer_box" onclick="checkAnswer(${answer})">
        <div class="answer_btn">
          ${variants[index]}
        </div>
        <span class="answer_text">
          ${answer}
        </span>
       </div>`
  );
};

// test creator //
const testCreator = () => {
  let number1 = randomNumber();
  let number2 = randomNumber();
  let operation = getRandomOperation();
  let test = {
    number1,
    operation,
    number2,
    correctStatus: 0, // 0 -> inCorrect(default), 1 -> correct, 2 -> timed
    sequence: tests.length + 1,
    correctAnswer: toCalculate(number1, operation, number2),
  };
  tests.push(test);
  current = test;
  startQuizTest();
};

// check answers //
const checkAnswer = (answer) => {
  const answerStatus = getAnswerStatus(answer);
  setCorrectStatus(answerStatus);
  removeTimer();
  nextQuestions();
};

//set correct status //
const setCorrectStatus = (status = 2 /*timed status (default) */) => {
  const test = getCurrentTestOfTestsArray();
  test.correctStatus = status;
};

// get currect test of tests global array //
const getCurrentTestOfTestsArray = () => {
  const tempTests = [...tests];
  const { sequence } = current;
  const tempCurrentTest = tempTests.find((test) => test.sequence === sequence);
  const index = tempTests.indexOf(tempCurrentTest);
  return tempTests[index];
};

// get answers status //
const getAnswerStatus = (choosedAnswer) => {
  const { correctAnswer } = current;
  return correctAnswer === choosedAnswer ? 1 : 0;
};

// timer creator //
const timerCreator = () => {
  timeInterval = setInterval(timerListining, 1000);
};

const timerListining = () => {
  const currentSekund = parseInt(TIMER.innerText.replace(/s/gi, ""));
  if (currentSekund === 0) closeQuestionAndNextQuestionAndUpdateTimer();
  else TIMER.innerText = currentSekund - 1 + "s";
};

// remove timer //
const removeTimer = () => {
  clearInterval(timeInterval);
  TIMER.innerText = "10s";
};

// next question //
const nextQuestions = () => {
  const TESTS_LENGHT_STATUS = tests.length !== TESTS_LENGHT;
  if (!TESTS_LENGHT_STATUS) return openTotalPoints();
  renderPoints();
  testCreator();
};

// open total points //
const openTotalPoints = () => {
  const {
    amountIncorrectAndTimedAnswers,
    amountCorrectAnswers,
    totalPoints,
  } = toCalculateTotalPoints();

  RESULT_INCORRECT_AND_TIMED_POINT.innerText = amountIncorrectAndTimedAnswers;
  RESULT_CORRECT_POINT.innerText = amountCorrectAnswers;
  RESULT_TOTAL_POINTS.innerText = totalPoints;
  changeWrapperElemtens(WRAPPER_QUIZ, WRAPPER_TOTAL_POINTS);
};

// to calculate total points //
const toCalculateTotalPoints = () => {
  let amountCorrectAnswers = 0;
  let amountIncorrectAndTimedAnswers = 0;
  let totalPoints = ONE_POINT_BALL;

  tests.forEach(({ correctStatus }) =>
    correctStatus === 1
      ? amountCorrectAnswers++
      : amountIncorrectAndTimedAnswers++
  );

  totalPoints *= amountCorrectAnswers;
  return { amountCorrectAnswers, amountIncorrectAndTimedAnswers, totalPoints };
};

// close and next question and update timer //
const closeQuestionAndNextQuestionAndUpdateTimer = () => {
  removeTimer();
  setCorrectStatus();
  nextQuestions();
};

// change wrappern elements.
// 1. hiddentElement -> yopilishi kerak bo`lgan element
// 2. shownElement   -> ko`rsatilishi kerak bo`lgan element
const changeWrapperElemtens = (hiddenElement, shownElement) => {
  hiddenElement.classList.add("d-none");
  shownElement.classList.remove("d-none");
};

// open Quiz app //
const openQuizApp = () => {
  changeWrapperElemtens(WRAPPER_BTN, WRAPPER_QUIZ);
  testCreator();
};
