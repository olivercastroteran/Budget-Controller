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

  const data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    }
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
    inputBtn: '.add__btn'
  };

  return {
    getInput: function() {
      return {
        type: document.querySelector(DOMstrings.inputType).value, // Will be inc or exp
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: document.querySelector(DOMstrings.inputValue).value
      };
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

  // Controll Add Item function
  const ctrlAddItem = function() {
    let input, newItem;

    // 1. Get the field input data
    input = UICtrl.getInput();

    // 2. Add the item to the budget controller
    newItem = budgetCtrl.addItem(input.type, input.description, input.value);
    // 3. Add new item to the UI
    // 4. Calculate the budget
    // 5. Display the budget on the UI
  };

  return {
    init: function() {
      console.log('App started!');
      setUpEventListeners();
    }
  };
})(budgetController, UIController);

conreoller.init();
