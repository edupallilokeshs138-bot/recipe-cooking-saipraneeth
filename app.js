// Recipe data - Foundation for all 4 parts
const recipes = [
    {
        id: 1,
        title: "Classic Spaghetti Carbonara",
        time: 25,
        difficulty: "easy",
        description: "A creamy Italian pasta dish made with eggs, cheese, pancetta, and black pepper.",
        category: "pasta"
    },
    {
        id: 2,
        title: "Chicken Tikka Masala",
        time: 45,
        difficulty: "medium",
        description: "Tender chicken pieces in a creamy, spiced tomato sauce.",
        category: "curry"
    },
    {
        id: 3,
        title: "Homemade Croissants",
        time: 180,
        difficulty: "hard",
        description: "Buttery, flaky French pastries that require patience but deliver amazing results.",
        category: "baking"
    },
    {
        id: 4,
        title: "Greek Salad",
        time: 15,
        difficulty: "easy",
        description: "Fresh vegetables, feta cheese, and olives tossed in olive oil and herbs.",
        category: "salad"
    },
    {
        id: 5,
        title: "Beef Wellington",
        time: 120,
        difficulty: "hard",
        description: "Tender beef fillet coated with mushroom duxelles and wrapped in puff pastry.",
        category: "meat"
    },
    {
        id: 6,
        title: "Vegetable Stir Fry",
        time: 20,
        difficulty: "easy",
        description: "Colorful mixed vegetables cooked quickly in a savory sauce.",
        category: "vegetarian"
    },
    {
        id: 7,
        title: "Pad Thai",
        time: 30,
        difficulty: "medium",
        description: "Thai stir-fried rice noodles with shrimp, peanuts, and tangy tamarind sauce.",
        category: "noodles"
    },
    {
        id: 8,
        title: "Margherita Pizza",
        time: 60,
        difficulty: "medium",
        description: "Classic Italian pizza with fresh mozzarella, tomatoes, and basil.",
        category: "pizza"
    }
];

// ===== STATE =====
let currentFilter = "all";
let currentSort = "none";

// ===== DOM SELECTION =====
const recipeContainer = document.querySelector('#recipe-container');
const filterButtons = document.querySelectorAll('[data-filter]');
const sortButtons = document.querySelectorAll('[data-sort]');

// ===== CREATE CARD =====
const createRecipeCard = (recipe) => {
    return `
        <div class="recipe-card" data-id="${recipe.id}">
            <h3>${recipe.title}</h3>
            <div class="recipe-meta">
                <span>⏱️ ${recipe.time} min</span>
                <span class="difficulty ${recipe.difficulty}">
                    ${recipe.difficulty}
                </span>
            </div>
            <p>${recipe.description}</p>
        </div>
    `;
};

// ===== RENDER FUNCTION =====
const renderRecipes = (recipesToRender) => {
    const recipeCardsHTML = recipesToRender
        .map(createRecipeCard)
        .join('');

    recipeContainer.innerHTML = recipeCardsHTML;
};

// ===== FILTER FUNCTION (PURE) =====
const applyFilter = (recipes, filterType) => {

    switch (filterType) {

        case "easy":
        case "medium":
        case "hard":
            return recipes.filter(recipe => recipe.difficulty === filterType);

        case "quick":
            return recipes.filter(recipe => recipe.time < 30);

        default:
            return recipes;
    }
};

// ===== SORT FUNCTION (PURE) =====
const applySort = (recipes, sortType) => {

    switch (sortType) {

        case "name":
            return [...recipes].sort((a, b) =>
                a.title.localeCompare(b.title)
            );

        case "time":
            return [...recipes].sort((a, b) =>
                a.time - b.time
            );

        default:
            return recipes;
    }
};

// ===== MAIN UPDATE FUNCTION =====
const updateDisplay = () => {

    let updatedRecipes = recipes;

    // Apply Filter
    updatedRecipes = applyFilter(updatedRecipes, currentFilter);

    // Apply Sort
    updatedRecipes = applySort(updatedRecipes, currentSort);

    renderRecipes(updatedRecipes);

    console.log(`Displaying ${updatedRecipes.length} recipes (Filter: ${currentFilter}, Sort: ${currentSort})`);
};

// ===== UPDATE ACTIVE BUTTONS =====
const updateActiveButtons = () => {

    filterButtons.forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.filter === currentFilter
        );
    });

    sortButtons.forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.sort === currentSort
        );
    });
};

// ===== EVENT LISTENERS =====
const setupEventListeners = () => {

    filterButtons.forEach(button => {
        button.addEventListener("click", (event) => {
            currentFilter = event.target.dataset.filter;
            updateActiveButtons();
            updateDisplay();
        });
    });

    sortButtons.forEach(button => {
        button.addEventListener("click", (event) => {
            currentSort = event.target.dataset.sort;
            updateActiveButtons();
            updateDisplay();
        });
    });
};

// ===== INITIALIZATION =====
setupEventListeners();
updateDisplay();
