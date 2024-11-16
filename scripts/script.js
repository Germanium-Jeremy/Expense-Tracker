const expenseForm = document.getElementById('addExpense');
const expenseList = document.getElementById('theExpenses');
const totalAmount = document.getElementById('totalExpense');
const showForm = document.getElementById("showForm")
const close = document.getElementById("close")
const behindForm = document.getElementById("behindForm")
const username = document.getElementById("username").value
const editName = document.getElementById("editName")

let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

// Function to update the total amount
const updateTotal = () => {
     const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
     totalAmount.textContent = total.toFixed(0);
};

// Function to save expenses to local storage
const saveToLocalStorage = () => {
     localStorage.setItem('expenses', JSON.stringify(expenses));
};

// function to get the Name of the user from local storage
const getName = () => {
     const username = localStorage.getItem("ExpenseTrackerUsername") || "Your Username";
     if (!username || username === "Your Username") {
          localStorage.setItem("ExpenseTrackerUsername", "Your Username");
     } else {
          document.getElementById("username").value = username;
     }
}
getName()
const updateName = () => {
     localStorage.setItem("ExpenseTrackerUsername", document.getElementById("username").value)
}
editName.addEventListener("click", updateName)

// Function to render expenses
const formatDate = (dateString) => {
     const date = new Date(dateString);
     const now = new Date();
     const diff = now.getTime() - date.getTime();
   
     if (diff < 24 * 60 * 60 * 1000) {
          // Less than 24 hours ago
          if (diff < 60 * 60 * 1000) {
          // Less than 1 hour ago
               const minutes = Math.floor(diff / (60 * 1000));
               return `Today, ${minutes} min ago`;
          } else {
               const hours = Math.floor(diff / (60 * 60 * 1000));
               return `Today, ${hours}:${date.getMinutes().toString().padStart(2, '0')} H`;
          }
     } else if (diff < 48 * 60 * 60 * 1000) {
          // Less than 48 hours ago
          const hours = Math.floor(diff / (60 * 60 * 1000));
          return `Yesterday, ${hours}:${date.getMinutes().toString().padStart(2, '0')} H`;
     } else {
          // More than 48 hours ago
          const options = { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' };
          return date.toLocaleString('en-US', options);
     }
};

const renderExpenses = () => {
     expenseList.innerHTML = '';
     expenses.slice().reverse().forEach((expense, index) => {
          const article = document.createElement('article');
          article.classList.add("expense")
          article.innerHTML = `
               <div class="content">
                    <div>
                         <h2>${expense.name}</h2>
                         <span>${formatDate(expense.date) == "Invalid Date" ? "Not specified" : formatDate(expense.date)}</span>
                    </div>
                    <div class="amoutExpense">$: ${expense.amount.toFixed(2)}</div>
               </div>
               <div class="actions">
                    <button class="edit" data-index="${expenses.length - 1 - index}">Edit</button>
                    <button class="delete" data-index="${expenses.length - 1 - index}">Delete</button>
               </div>
          `;
          expenseList.appendChild(article);
     });
     updateTotal();
};

// function to show and hide expense
const showExpenses = () => {
     behindForm.style.display = "flex"
}
const hideExpenses = () => {
     behindForm.style.display = "none"
}
showForm.addEventListener("click", showExpenses)
close.addEventListener("click", hideExpenses)


// Add Expense
expenseForm.addEventListener('submit', (e) => {
     e.preventDefault();
     const name = document.getElementById('expenseName').value.trim();
     const amount = parseFloat(document.getElementById('expenseAmount').value);
     const date = new Date().toLocaleDateString();

     if (name && amount > 0) {
          expenses.push({ name, amount, date });
          saveToLocalStorage();
          renderExpenses();
          expenseForm.reset();
     }
});

// Edit or Delete Expense
expenseList.addEventListener('click', (e) => {
     const index = e.target.dataset.index;
     if (e.target.classList.contains('delete')) {
          expenses.splice(index, 1);
     } else if (e.target.classList.contains('edit')) {
          const expense = expenses[index];
          document.getElementById('expenseName').value = expense.name;
          document.getElementById('expenseAmount').value = expense.amount;
          showExpenses()
          expenses.splice(index, 1); // Remove the item temporarily
     }
     saveToLocalStorage();
     renderExpenses();
});

// Initial Render
renderExpenses();
