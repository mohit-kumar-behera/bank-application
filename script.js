'use strict';

/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Mohit Kumar',
  phone: 9863752738,
  movements: [
    {
      amount: 200,
      date: '2019-11-18T21:31:17.178Z',
    },
    {
      amount: 450,
      date: '2019-12-23T07:42:02.383Z',
    },
    {
      amount: -400,
      date: '2020-01-28T09:15:04.904Z',
    },
    {
      amount: 3000,
      date: '2020-04-01T10:17:24.185Z',
    },
    {
      amount: -650,
      date: '2021-05-31T14:11:59.604Z',
    },
    {
      amount: -130,
      date: '2021-06-03T17:01:17.194Z',
    },
    {
      amount: 70,
      date: '2021-06-04T23:36:17.929Z',
    },
    {
      amount: 1300,
      date: '2021-06-04T20:51:36.790Z',
    },
  ],

  interestRate: 1.2,
  pin: 1111,

  currency: 'INR',
  locale: 'en-GB',
};

const account2 = {
  owner: 'Jessica Davis',
  phone: 8763759024,
  movements: [
    {
      amount: 5000,
      date: '2019-11-01T13:15:33.035Z',
    },
    {
      amount: 3400,
      date: '2019-11-30T09:48:16.867Z',
    },
    {
      amount: -150,
      date: '2019-12-25T06:04:23.907Z',
    },
    {
      amount: 790,
      date: '2020-01-25T14:18:46.235Z',
    },
    {
      amount: -3210,
      date: '2020-02-05T16:33:06.386Z',
    },
    {
      amount: -1000,
      date: '2021-04-30T14:43:26.374Z',
    },
    {
      amount: 8500,
      date: '2021-06-05T18:49:59.371Z',
    },
    {
      amount: 30,
      date: '2021-06-06T10:51:36.790Z',
    },
  ],

  interestRate: 1.5,
  pin: 2222,

  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  phone: 7864062845,
  movements: [
    {
      amount: 200,
      date: '2017-01-01T13:15:33.035Z',
    },
    {
      amount: -200,
      date: '2018-10-30T09:48:16.867Z',
    },
    {
      amount: 340,
      date: '2018-12-25T06:04:23.907Z',
    },
    {
      amount: -300,
      date: '2019-01-25T14:18:46.235Z',
    },
    {
      amount: -20,
      date: '2020-07-26T12:01:20.894Z',
    },
    {
      amount: 1000,
      date: '2020-11-26T12:04:20.894Z',
    },
  ],

  interestRate: 0.7,
  pin: 3333,

  currency: 'EUR',
  locale: 'pt-PT',
};

const accounts = [account1, account2, account3];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');
const labelTransfer = document.querySelector('.operation--transfer > h2');
const labelLoan = document.querySelector('.operation--loan > h2');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const createUsername = function (accounts) {
  accounts.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')[0]
      .concat(acc.phone.toString().slice(5));
  });
};
createUsername(accounts);

const getMovementAmtArray = function (movements) {
  const amountArr = [];

  movements.forEach(mov => {
    amountArr.push(mov.amount);
  });
  return amountArr;
};

const calcDaysPassed = function (date) {
  return Math.floor((new Date() - date) / (24 * 60 * 60 * 1000)); // 1 day = 24 * 60 * 60 * 1000 millisecond
};

//Format Date + Time
const formatDateTime = function (date, locale) {
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  };

  return new Intl.DateTimeFormat(locale, options).format(date);
};

// Format Date
const formatDate = function (date, locale) {
  const daysPassed = calcDaysPassed(date);

  if (daysPassed === 0) return 'TODAY';
  else if (daysPassed === 1) return 'YESTERDAY';
  else if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    const options = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    };

    return new Intl.DateTimeFormat(locale, options).format(date);
  }
};

// Format Amount
const formatAmount = function (amt, locale, currency) {
  const options = {
    style: 'currency',
    currency: currency,
  };
  return new Intl.NumberFormat(locale, options).format(amt);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a.amount - b.amount)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov.amount > 0 ? 'deposit' : 'withdrawal';
    const movDate = new Date(mov.date);
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">
        ${i + 1} ${type}
        </div>
        <div class="movements__date">${formatDate(movDate, acc.locale)}</div>
        <div class="movements__value movements__value--${type}">
          ${formatAmount(Math.abs(mov.amount), acc.locale, acc.currency)}
        </div>
      </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

let movAmt; // Global declaration to store the result for getMovementAmtArray() for each call

const checkBalance = function (movs) {
  movAmt = getMovementAmtArray(movs);
  return movAmt.reduce((total, mov) => total + mov, 0);
};
const displayBalance = function (acc) {
  acc.balance = checkBalance(acc.movements);
  labelBalance.textContent = `${formatAmount(
    acc.balance,
    acc.locale,
    acc.currency
  )}`;
};

const displayMovementsSummary = function (acc) {
  movAmt = getMovementAmtArray(acc.movements);

  const creditSum = movAmt
    .filter(mov => mov > 0)
    .reduce((total, mov) => total + mov, 0);
  labelSumIn.textContent = `${formatAmount(
    creditSum,
    acc.locale,
    acc.currency
  )}`;

  const debitSum = Math.abs(
    movAmt.filter(mov => mov < 0).reduce((total, mov) => total + mov, 0)
  );
  labelSumOut.textContent = `${formatAmount(
    debitSum,
    acc.locale,
    acc.currency
  )}`;

  const interestSum = movAmt
    .filter(mov => mov > 0)
    .map(mov => (mov * acc.interestRate) / 100)
    .filter(interest => interest > 1)
    .reduce((total, interest) => total + interest, 0);
  labelSumInterest.textContent = `${formatAmount(
    interestSum,
    acc.locale,
    acc.currency
  )}`;
};

const displayCloseAccountUsername = function (acc) {
  inputCloseUsername.value = acc.username;
};

const updateUI = function (acc) {
  //Display Movements
  displayMovements(acc);

  //Display Balance
  displayBalance(acc);

  //Display Movements Summary
  displayMovementsSummary(acc);

  //Display Username in Close Account Input Field (by default)
  displayCloseAccountUsername(acc);
};

const hideUI = function () {
  containerApp.style.opacity = '0';
  labelWelcome.textContent = 'Log in to get started';
};

let currentAcc, timer;
const logoutTime = 300; // 5 mins

// Logout Timer
const startLogoutTimer = function (time) {
  const ticktock = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    labelTimer.textContent = `${min}:${sec}`;

    if (time === 0) {
      clearInterval(timer);

      // logout current user
      hideUI();
    }

    time--;
  };

  ticktock();
  timer = setInterval(ticktock, 1000);

  return timer;
};

//Login user
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAcc = accounts.find(acc => acc.username === inputLoginUsername.value);

  if (currentAcc && currentAcc.pin === Number(inputLoginPin.value)) {
    //Display welcome message and show UI
    labelWelcome.textContent = `Welcome Back, ${
      currentAcc.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = '1';

    //Start logout timer
    if (timer) clearInterval(timer); // clear previous timer
    timer = startLogoutTimer(logoutTime);

    //Display Time
    const now = new Date();
    labelDate.textContent = formatDateTime(now);

    //Clear and remove focus from input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    updateUI(currentAcc);
  } else {
    alert("Account doesn't exists");
  }
});

//Request a Loan
const canRequestLoan = function (acc, amount) {
  movAmt = getMovementAmtArray(acc.movements);
  const minLoanAmt = 10;

  if (amount <= 0) {
    alert("Amount can't be negative or zero");
    return false;
  } else if (amount < minLoanAmt) {
    alert(
      `Amount should be atleast ${formatAmount(
        minLoanAmt,
        acc.locale,
        acc.currency
      )}`
    );
    return false;
  } else if (!movAmt.some(acc => acc >= amount * 0.1)) {
    alert(
      'You can request a loan only if you have deposited 10% of loan amount in your previous transactions'
    );
    return false;
  } else {
    return true;
  }
};

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const loanAmount = Number(inputLoanAmount.value);

  //Request Loan Validation
  if (canRequestLoan(currentAcc, loanAmount)) {
    //Add Loan amount, date to accounts movement
    currentAcc.movements.push({
      amount: loanAmount,
      date: new Date().toISOString(),
    });

    labelLoan.textContent = 'Processing...';

    //Display successfull Transaction Message and updateUI
    setTimeout(() => {
      //Success Message
      labelLoan.textContent = 'Successfully Granted Loan';

      setTimeout(() => {
        //Back to Original state
        labelLoan.textContent = 'Request Loan';

        //Clear and remove focus from input fields
        inputLoanAmount.value = '';
        inputLoanAmount.blur();
      }, 1000);

      //Update UI
      updateUI(currentAcc);

      // Reset logout timer
      clearInterval(timer);
      timer = startLogoutTimer(logoutTime);
    }, 2500);
  }
});

//Transfer Amount
const transferValidation = function (acc, receiver, amount) {
  const minTransferAmt = 1;

  if (amount <= 0) {
    alert("Amount can't be negative or zero");
    return false;
  } else if (amount < 1) {
    alert(
      `Amount should be atleast ${formatAmount(
        minTransferAmt,
        acc.locale,
        acc.currency
      )}`
    );
    return false;
  } else if (currentAcc.balance < amount) {
    alert('Insufficient Balance');
    return false;
  } else if (!receiver) {
    alert('Receiver Account doesnot exists');
    return false;
  } else if (receiver.username === currentAcc.username) {
    alert("You can't send money to your own account");
    return false;
  } else {
    return true;
  }
};

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    account => account.username === inputTransferTo.value
  );

  //Account and amount Validation
  if (transferValidation(currentAcc, receiverAcc, amount)) {
    //Update movements in both bank accounts
    currentAcc.movements.push({
      amount: -amount,
      date: new Date().toISOString(),
    });
    receiverAcc.movements.push({
      amount: amount,
      date: new Date().toISOString(),
    });

    labelTransfer.textContent = 'Processing...';

    //Display successfull Transaction Message and updateUI
    setTimeout(() => {
      labelTransfer.textContent = 'Successfully Transfered!';

      setTimeout(() => {
        //Back to Original State
        labelTransfer.textContent = 'Transfer money';

        //Clear and remove focus from input fields
        inputTransferAmount.value = inputTransferTo.value = '';
        inputTransferAmount.blur();
        inputTransferTo.blur();
      }, 1000);

      // updateUI
      updateUI(currentAcc);

      // Reset logout timer
      clearInterval(timer);
      timer = startLogoutTimer(logoutTime);
    }, 2500);
  }
});

//Close Account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAcc.username &&
    Number(inputClosePin.value) === currentAcc.pin
  ) {
    //Find Account
    const accountIndex = accounts.findIndex(
      acc => acc.username === inputCloseUsername.value
    );

    //Delete Account
    accounts.splice(accountIndex, 1);

    //Hide UI
    hideUI();

    //Clear input fields
    inputCloseUsername.value = inputClosePin.value = '';
  } else {
    alert('Incorrect PIN');
  }
});

//Sort the Movements Data
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  sorted = !sorted;

  displayMovements(currentAcc, sorted);
});
