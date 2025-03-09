document.addEventListener('DOMContentLoaded', () => {
    const expenseForm = document.getElementById('expense-form');
    const expenseNameInput = document.getElementById('expense-name');
    const expenseAmountInput = document.getElementById('expense-amount');
    const expenseList = document.getElementById('expense-list');
    const totalAmountDisplay = document.getElementById('total-amount');

    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

    function calculateTotal() {
        return expenses.reduce((sum, expense) => sum + expense.amount, 0);
    }

    function saveExpensesToLocal() {
        localStorage.setItem('expenses', JSON.stringify(expenses));
    }

    function updateTotal() {
        totalAmountDisplay.textContent = calculateTotal().toFixed(2);
    }

    function renderExpenses() {
        expenseList.innerHTML = "";
        expenses.forEach(expense => {
            const li = document.createElement('li');
            li.innerHTML = `
        <span>${expense.name} - $${expense.amount.toFixed(2)}</span>
        <button class="edit-btn" data-id="${expense.id}">Edit</button>
        <button class="delete-btn" data-id="${expense.id}">Delete</button>
      `;
            expenseList.appendChild(li);
        });
    }

    expenseForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = expenseNameInput.value.trim();
        const amount = parseFloat(expenseAmountInput.value.trim());

        if (name && !isNaN(amount) && amount > 0) {
            expenses.push({ id: Date.now(), name, amount });
            saveExpensesToLocal();
            renderExpenses();
            updateTotal();

            expenseNameInput.value = "";
            expenseAmountInput.value = "";
        }
    });

    expenseList.addEventListener('click', (e) => {
        const id = parseInt(e.target.dataset.id);

        if (e.target.classList.contains('delete-btn')) {
            expenses = expenses.filter(expense => expense.id !== id);
            saveExpensesToLocal();
            renderExpenses();
            updateTotal();
        }

        if (e.target.classList.contains('edit-btn')) {
            const li = e.target.parentElement;
            const span = li.querySelector('span');
            const [currentName, currentAmount] = span.textContent.split(' - $');

            span.innerHTML = `
        <input type="text" class="edit-name" value="${currentName}">
        <input type="number" class="edit-amount" value="${parseFloat(currentAmount)}">
        <button class="save-btn" data-id="${e.target.dataset.id}">Save</button>
      `;

            e.target.style.display = 'none';

            li.querySelector('.edit-name').focus();

            li.querySelector('.edit-name').addEventListener('blur', () => {
                const newName = li.querySelector('.edit-name').value.trim();
                if (newName !== "") {
                    span.innerHTML = `${newName} - $${parseFloat(currentAmount).toFixed(2)}`;
                    expenses = expenses.map(expense =>
                        expense.id === parseInt(e.target.dataset.id) ? {...expense, name: newName } : expense
                    );
                    saveExpensesToLocal();
                    renderExpenses();
                    updateTotal();
                } else {
                    renderExpenses(); // revert if empty
                }
            });
        }
    });

    function saveExpensesToLocal() {
        localStorage.setItem('expenses', JSON.stringify(expenses));
    }

    function updateTotal() {
        totalAmountDisplay.textContent = calculateTotal().toFixed(2);
    }

    function renderExpenses() {
        expenseList.innerHTML = "";
        expenses.forEach(expense => {
            const li = document.createElement('li');
            li.innerHTML = `
        <span>${expense.name} - $${expense.amount.toFixed(2)}</span>
        <button class="edit-btn" data-id="${expense.id}">Edit</button>
        <button class="delete-btn" data-id="${expense.id}">Delete</button>
      `;
            expenseList.appendChild(li);
        });
    }

    renderExpenses();
    updateTotal();
});
