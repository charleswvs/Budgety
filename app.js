//BUDGET CONTROLLER
var budgetController = (function () {
  var Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  Expense.prototype.calcPercentages = function (totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100)
    } else {
      this.percentage = -1;
    }
  };

  Expense.prototype.getPercentages = function () {
    return this.percentage;
  };

  var Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var calculateTotal = function (type) {
    //go through all items and then sums up each's value
    var sum = 0;
    data.allItems[type].forEach(function (cur) {
      sum += cur.value;
    });
    data.totals[type] = sum;
  };
  //var allExpenses = [];
  //var allIncomes = [];

  var data = {
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
    addItem: function (type, des, val) {
      var newItem, ID;

      //[1 2 3 4 5], next ID = 6
      //[1 2 4 6 8], next ID = 9
      // ID = last ID + 1

      // Create new ID
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      // Create new item based on 'inc' or 'exp' type
      if (type === "exp") {
        newItem = new Expense(ID, des, val);
      } else if (type === "inc") {
        newItem = new Income(ID, des, val);
      }

      // Push it into our data structure
      data.allItems[type].push(newItem);

      // Return the new element
      return newItem;
    },

    deleteItem: function (type, id) {
      var ids, index;
      //look up the type and id, then it deletes it
      // ids = [1 2 4 6 8]

      ids = data.allItems[type].map(function (current) {
        return current.id;
      });

      index = ids.indexOf(id);

      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }
    },

    calculateBudget: function () {
      // calculate total income and expenses
      calculateTotal("exp");
      calculateTotal("inc");

      // Calculate the budget: income - expenses
      data.budget = data.totals.inc - data.totals.exp;

      // calculate the percentage of income that we spent
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      }
    },

    calculatePercentages: function () {
      // Calculates the percentages of each element in the array
      data.allItems.exp.forEach(function (cur) {
        cur.calcPercentages(data.totals.inc);
      });
    },

    getPercentages: function () {
      // Stores the items values in a array
      var allPerc = data.allItems.exp.map(function (cur) {
        return cur.getPercentages();
      });
      return allPerc
    },

    getBudget: function () {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      };
    },

    testing: function () {
      console.log(data);
    }
  };
})();

//UI CONTROLLER
var UIController = (function () {
  var DOMstrings = {
    //store each html element in variable, so they may be easily changed if needed
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputBtn: ".add__btn",
    incomeContainer: ".income__list",
    expensesContainer: ".expenses__list",
    budgetLabel: ".budget__value",
    incomeLabel: ".budget__income--value",
    expensesLabel: ".budget__expenses--value",
    percentageLabel: ".budget__expenses--percentage",
    container: ".container",
    expensesPercLabel: ".item__percentage",
    dateLabel: ".budget__title--month"
  };

  var formatNumber = function (num, type) {
    var numSplit, int, dec;
    /*
    '-' or '+' berfore number
    exactly 2 decimal points
    comma separating the thousands
    */
    num = Math.abs(num);
    num = num.toFixed(2);

    numSplit = num.split('.');

    int = numSplit[0];

    if (int.length > 3) {
      int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, int.length);
    }

    dec = numSplit[1];

    return (type === 'exp' ? sign = '-' : sign = '+') + '' + int + '.' + dec;
  };

  var nodeListforEach = function (list, callback) {
    for (var i = 0; i < list.length; i++) {
      callback(list[i], i);
    }
  };

  return {
    getinput: function () {
      //Return the type, description and value which were get from the user

      return {
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
      };
    },

    addListItem: function (obj, type) {
      var html, newHtml, element;
      // Create HTML string with placeholder text

      if (type === "inc") {
        element = DOMstrings.incomeContainer;

        html =
          '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === "exp") {
        element = DOMstrings.expensesContainer;

        html =
          '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      // Replace the placeholder text with some actual data
      newHtml = html.replace("%id%", obj.id);
      newHtml = newHtml.replace("%description%", obj.description);
      newHtml = newHtml.replace("%value%", formatNumber(obj.value, type));

      // Insert the HTML into the DOM
      document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
    },

    //rm element from list
    deleteListItem: function (selectorID) {
      // get the parent
      var el = document.getElementById(selectorID);
      // then select child, from the parent you found
      el.parentNode.removeChild(el);
    },

    //clear the field for another use
    clearFields: function () {
      var fields, fieldsArr;

      fields = document.querySelectorAll(
        DOMstrings.inputDescription + ", " + DOMstrings.inputValue
      );

      //"fields" is a list, u need to use the array "slice" method to hack your way into making fields an array
      fieldsArr = Array.prototype.slice.call(fields);

      // now you grab the new array, and make its value empty
      fieldsArr.forEach(element => {
        element.value = "";
      });

      // And now focus on the first element of the array which is the"Add description" field
      fieldsArr[0].focus();
    },

    displayBudget: function (obj) {
      //display budget on these html elements
      var type
      obj.budget > 0 ? type = 'inc' : type = 'exp';

      document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
      document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
      document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
      obj.totalExp;

      if (obj.percentage > 0) {
        document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage;
      } else {
        document.querySelector(DOMstrings.percentageLabel).textContent = "----";
      }
    },

    displayMonth: function () {
      var now, year, month, months;
      var now = new Date();

      months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'Octorber', 'November', 'December']
      month = now.getMonth();
      year = now.getFullYear();
      document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ', ' + year;
    },

    displayPercentages: function (percentages) {
      var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

      nodeListforEach(fields, function (current, index) {

        if (percentages[index] > 0) {
          current.textContent = percentages[index] + '%';
        } else {
          current.textContent = '---'
        }
      });
    },

    //this function changes the form colors acording to the type
    changedType: function () {
      var fields = document.querySelectorAll(
        DOMstrings.inputType + ',' +
        DOMstrings.inputDescription + ',' +
        DOMstrings.inputValue
      );

      nodeListforEach(fields, function (cur) {
        cur.classList.toggle('red-focus');
      });

      document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
    },

    getDOMstrings: function () {
      return DOMstrings;
    }
  };
})();

//GLOBAL APP CONTROLLER
var controller = (function (budgetCtrl, UICtrl) {
  var setupEventListeners = function () {
    var DOM = UICtrl.getDOMstrings();

    //Listeners which get the click on the button or the keypress on enter

    document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);
    document.addEventListener("keypress", function (event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });

    //Event Delegation
    document.querySelector(DOM.container).addEventListener("click", crtlDeleteItem);

    //changes the input field's color according to the type
    document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType)
  };

  var updateBudget = function () {
    // 1. Calculate the budget
    budgetCtrl.calculateBudget();

    // 2. Return the budget
    var budget = budgetCtrl.getBudget();

    // 3. Display the budget on the UI
    UICtrl.displayBudget(budget);
  };

  var updatePercentages = function () {
    // 1. Calculate percentages
    budgetCtrl.calculatePercentages();

    // 2. Read percentages from the budget controller
    var percentages = budgetCtrl.getPercentages();

    // 3. Update the UI with the new percentages
    UICtrl.displayPercentages(percentages);
  }
  var ctrlAddItem = function () {
    var input, newItem;

    /*********TO DO LIST***********/
    //1. Get the filled input data
    input = UICtrl.getinput();

    //2. add the item to the budget controller
    newItem = budgetCtrl.addItem(input.type, input.description, input.value);

    //3. Add the item to the UI
    UICtrl.addListItem(newItem, input.type);

    //4.Clear the field
    UICtrl.clearFields();

    //5. Calculate the budget
    updateBudget();

    // 6. Calculate and update percentages
    updatePercentages();
  };

  var crtlDeleteItem = function (event) {
    var itemID, splitID, ID;

    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

    if (itemID) {
      //inc-1
      splitID = itemID.split("-");
      type = splitID[0];
      ID = parseInt(splitID[1]);

      //1. delete the item from the data structure
      budgetCtrl.deleteItem(type, ID);

      //2. delete the item form the user
      UICtrl.deleteListItem(itemID);

      //3. update and show the new budget
      updateBudget();

      // 4. Calculate and update percentages
      updatePercentages();
    }
  };

  return {
    init: function () {
      console.log("Application has started.");
      UICtrl.displayMonth();
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1
      });
      setupEventListeners();
    }
  };
})(budgetController, UIController);

//starts the application
controller.init();