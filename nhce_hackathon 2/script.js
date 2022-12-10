"use strict";

let donations = [];

const account1 = {
  owner: "John Wick",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Jones",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};
const account5 = {
  owner: "Prathik D'souza",
  movements: [240, 600, -440, -150, -60, 30],
  interestRate: 0.7,
  pin: 5555,
};
const account6 = {
  owner: "Nikhil Narayan",
  movements: [220, -180, 340, -250, -20, 60, 410, -360],
  interestRate: 0.7,
  pin: 6666,
};

const accounts = [account1, account2, account3, account4, account5, account6];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const btnRules = document.querySelector(".btn--extra");
const modal = document.querySelector(".modal");
const closeModal = document.querySelector(".close-modal");
const overlay = document.querySelector(".overlay");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = "";

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  console.log(movs);

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";

    const html = `
    <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__value">₹${mov}</div>
    </div>
    `;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

const createUsernames = (accs) => {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map(function (ch) {
        return ch[0];
      })
      .join("");
  });
};
createUsernames(accounts);

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((accu, ele) => accu + ele, 0);

  labelBalance.textContent = "₹" + acc.balance;
};

const calcDisplaySummary = function (acc) {
  const income = acc.movements
    .filter((ele) => ele > 0)
    .reduce((accu, ele) => accu + ele, 0);
  labelSumIn.textContent = "₹" + income;
  // console.log(income);
  // console.log(labelSumIn.textContent);

  const spent = acc.movements
    .filter((ele) => ele < 0)
    .reduce((accu, ele) => accu + ele, 0);
  labelSumOut.textContent = "₹" + Math.abs(spent);

  let sum = 0;
  for (let i of donations) sum += i;

  labelSumInterest.textContent = "₹" + sum;
};
// calcDisplaySummary(account1.movements);

const updateUI = function (acc) {
  // displaying movements
  displayMovements(acc.movements);
  // displaying balance
  calcDisplayBalance(acc);
  // displaying summary
  calcDisplaySummary(acc);
};

let currentAccount;
btnLogin.addEventListener("click", function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );
  if (currentAccount && currentAccount.pin === Number(inputLoginPin.value)) {
    // clearing input field boxes
    inputLoginUsername.value = inputLoginPin.value = "";
    // removing focus/cursor from pin box
    inputLoginPin.blur();
    inputLoginUsername.blur();

    // displaying UI and welcome message
    labelWelcome.textContent = `Welcome, ${currentAccount.owner}`;
    containerApp.style.opacity = 100;

    updateUI(currentAccount);
    // console.log(currentAccount.owner);
  }
});

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = "";
  inputTransferAmount.blur();
  inputTransferTo.blur();
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    console.log("Transfer possible");
    currentAccount.movements.push(-(amount - (amount % 10) + 10));
    receiverAcc.movements.push(amount - (amount % 10) + 10);
    // let dig=amount%10
    // let bruh =
    donations.push(10 - (amount % 10));
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (
    amount > 0 &&
    currentAccount.movements.some((ele) => ele >= 0.1 * amount)
  ) {
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
  }
  inputLoanAmount.value = "";
  inputLoanAmount.blur();
});

// btnClose.addEventListener("click", function (e) {
//   e.preventDefault();
//   const closeAcc = accounts.find(
//     (acc) => acc.username === inputCloseUsername.value
//   );
//   const pin = Number(inputClosePin.value);
//   console.log(closeAcc, pin);
//   inputClosePin.value = inputCloseUsername.value = "";
//   if (closeAcc === currentAccount && pin === currentAccount.pin) {
//     const index = accounts.findIndex(
//       (acc) => acc.username === currentAccount.username
//     );
//     accounts.splice(index, 1);
//     containerApp.style.opacity = 0;
//     console.log("Deletion possible", accounts);
//   }
// });

let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

btnRules.addEventListener("click", function () {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
});

closeModal.addEventListener("click", function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
});
