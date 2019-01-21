//BUDGET CONTROLLER
var budgetController = (function () {
    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var allExpenses = [];
    var allIncomes = [];

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    }

})();

//UI CONTROLLER
var UIController = (function () {

    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add_btn'
    }
    return {
        getinput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
            };

        },
        getDOMstrings: function () {
            return DOMstrings;
        }
    }
})();

//GLOBAL APP CONTROLLER
var controller = (function (budgetCtrl, UICtrl) {
    var setupEventListeners = function () {
        var DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function (e /*means: event*/ ) {
            if (e.keyCode === 13 || e.which === 13) {

            }
        });
    };

    var ctrlAddItem = function () {
        /*********TO DO LIST***********/
        //1. Get the filled input data
        var input = UICtrl.getinput();

        //2. add the item to the budhet controller


        //3. Add the item to the UI
        //4. Calculate the budget
        //5. Display the budhet on the UI
    }

    return {
        init: function () {

        }
    }

})(budgetController, UIController);

controller.init();