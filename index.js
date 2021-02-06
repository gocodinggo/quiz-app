//start variables
const ORDER_NUMBER = document.querySelector(".order_number");
const TIMER = document.getElementById("timer");
const NUMBER_1 = document.getElementById("number_1");
const NUMBER_2 = document.getElementById("number_2");
const OPERATION = document.getElementById("operation");
const ANSWERS_CONTENT = document.querySelector(".answers_content");
const POINTS_CONTENT = document.querySelector(".points_content");
const RESULT_CORRECT = document.getElementById("result_correct");
const RESULT_INCORRECT_AND_TIMED = document.getElementById(
  "result_incorrect_and_timed"
);
const RESULT_TOTAL_POINTS = document.getElementById("result_total_points");
let tests = [];
let currentTest = null;

// RENDER FUNCTIONS

const renderOrderNumber = () => {
  const { orderNumber } = currentTest;
  ORDER_NUMBER.innerText = orderNumber;
};

const renderQuestion = () => {
  const { number_1, number_2, operation } = currentTest;
  NUMBER_1.innerText = number_1;
  NUMBER_2.innerText = number_2;
  OPERATION.innerText = operation;
};

const renderAnswers = () => {
  let result = "";
  let answers = answersCreatorWithRandomNumbers();
  answers = answersConvertorWithHtmlTags(answers);
  for (let i = 0, j = 1; i < 3; i += 2, j += 2)
    result += `<div class="row">${answers[i]}${answers[j]}</div>`;
  ANSWERS_CONTENT.innerHTML = result;
};

// LOGICAL FUNCTIONS

const startQuizApp = () => {
  renderOrderNumber();
  renderQuestion();
  renderAnswers();
};

const randomNumber = (limit = 200) => {
  return Math.floor(Math.random() * limit);
};

const answersCreatorWithRandomNumbers = () => {
  const { correctAnswer } = currentTest;
  const answers = [correctAnswer];
  for (let i = 0; i < 3; i++) answers.push(randomNumber(correctAnswer));

  return answers.sort(() => Math.random() - 0.5);
};

const answersConvertorWithHtmlTags = (answers) => {
  const variants = ["A", "B", "C", "D"];
  return answers.map(
    (a, i) => `
     <div class="answer_box">
        <div class="answer_btn">${variants[i]}</div>
        <span class="answer_text">${a}</span>
     </div>
`
  );
};

const getRandomOperation = () => {
  const operations = ["-", "+", "*"];
  const randomIndex = randomNumber(operations.length);
  return operations[randomIndex];
};

const toCalculate = (num1, num2, oper) => eval(num1 + oper + num2);

const testCreator = () => {
  const number_1 = randomNumber();
  const number_2 = randomNumber();
  const operation = getRandomOperation();
  const test = {
    orderNumber: tests.length + 5,
    number_1,
    number_2,
    operation,
    correctStatus: 0, // 0 -> inCorrect(default), 1 -> correct, 2 -> timed
    correctAnswer: toCalculate(number_1, number_2, operation),
  };
  currentTest = test;
  tests.push(test);
  startQuizApp();
};

testCreator();
