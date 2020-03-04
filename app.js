// __________________________________________________________________________________________________
// ************************************** Budget Controller - M *************************************
// __________________________________________________________________________________________________
const budgetController = (function() {
  const Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  const Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  const calculateTotal = function(type) {
    let sum = 0;
    data.allItems[type].forEach(function(cur) {
      sum += cur.value;
    });
    data.totals[type] = sum;
  };

  const data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    },
    budget: 0,
    percentage: -1
  };

  return {
    addItem: function(type, des, val) {
      let newItem;

      // ID = last ID + 1 - create new ID
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      // Create new item based on 'inc' or 'exp' type
      if (type === 'exp') {
        newItem = new Expense(ID, des, val);
      } else if (type === 'inc') {
        newItem = new Income(ID, des, val);
      }

      // push new item into our data structure
      data.allItems[type].push(newItem);
      // return the new element
      return newItem;
    },
    calculateBudget: function() {
      // Calculate total income and expenses
      calculateTotal('exp');
      calculateTotal('inc');
      // Calculate the budget: inc -exp
      data.budget = data.totals.inc - data.totals.exp;
      // Calculate the percentage of expenses
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }
    },
    getBudget: function() {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      };
    },
    testing: function() {
      console.log(data);
    }
  };
})();

// __________________________________________________________________________________________________
// *************************************** UI Controller - V ***************************************
// __________________________________________________________________________________________________
const UIController = (function() {
  // DOM elements
  const DOMstrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expensesLabel: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage'
  };

  return {
    getInput: function() {
      return {
        type: document.querySelector(DOMstrings.inputType).value, // Will be inc or exp
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: +document.querySelector(DOMstrings.inputValue).value
      };
    },
    addListItem: function(obj, type) {
      let html, newHtml, element;
      // 1. Ceate HTML string with placeholder text
      if (type === 'inc') {
        element = DOMstrings.incomeContainer;
        html =
          '<div class="item" id="income-%id%"> <div class="item__description">%description%</div> <div class="val-del"> <div class="item__value">%value%</div> <div class="item__delete"> <button class="item__delete--btn"> <i class="ion-ios-trash-outline"></i> </button></div></div> </div>';
      } else if (type === 'exp') {
        element = DOMstrings.expensesContainer;
        html =
          '<div class="item" id="income-%id%"><div class="item__description">%description%</div><div class="val-del"><div class="item__value">%value%</div> <div class="item__percentage">20%</div><div class="item__delete"><button class="item__delete--btn"> <i class="ion-ios-trash-outline"></i></button></div></div></div>';
      }

      // 2. Replace the placeholder text with some actual data
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', obj.value);

      // 3. Insert the Html into the DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    },
    clearFields: function() {
      let fields, fieldsArr;
      fields = document.querySelectorAll(
        DOMstrings.inputDescription + ', ' + DOMstrings.inputValue
      );
      // Convert the fields list into an array
      fieldsArr = Array.prototype.slice.call(fields);
      // Clear fields
      fieldsArr.forEach(function(cur) {
        cur.value = '';
      });
      // Set focus on the first element
      fieldsArr[0].focus();
    },
    displayBudget: function(obj) {
      document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
      document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
      document.querySelector(DOMstrings.expensesLabel).textContent =
        obj.totalExp;

      if (obj.percentage > 0) {
        document.querySelector(DOMstrings.percentageLabel).textContent =
          obj.percentage + '%';
      } else {
        document.querySelector(DOMstrings.percentageLabel).textContent = '---';
      }
    },
    getDOMstrings: function() {
      return DOMstrings;
    }
  };
})();

// __________________________________________________________________________________________________
// *************************************** App Controller - C ***************************************
// __________________________________________________________________________________________________
const conreoller = (function(budgetCtrl, UICtrl) {
  // Set up event listeners
  const setUpEventListeners = function() {
    // DOM strings
    const DOM = UICtrl.getDOMstrings();
    // Event listener for Btn
    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

    // Event Listener for 'Enter' key
    document.addEventListener('keypress', function(event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });
  };

  // Update Budget function
  const updateBudge = function() {
    // 1. Calculate the budget
    budgetCtrl.calculateBudget();
    // 2. Return the budget
    const budget = budgetCtrl.getBudget();
    // 3. Display the budget on the UI
    UICtrl.displayBudget(budget);
  };

  // Controll Add Item function
  const ctrlAddItem = function() {
    let input, newItem;

    // 1. Get the field input data
    input = UICtrl.getInput();

    // Check for input fields have content
    if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
      // 2. Add the item to the budget controller
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);

      // 3. Add new item to the UI
      UICtrl.addListItem(newItem, input.type);

      // 4. Clear the Fields
      UICtrl.clearFields();

      // 5. Calculate and update budget
      updateBudge();
    }
  };

  return {
    init: function() {
      console.log('App started!');
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1
      });
      setUpEventListeners();
    }
  };
})(budgetController, UIController);

conreoller.init();
