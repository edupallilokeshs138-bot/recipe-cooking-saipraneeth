// ===== RecipeJS Part 3: IIFE, Expandable Steps & Ingredients =====
const RecipeApp = (() => {

    // ===== RECIPE DATA (Updated with steps & ingredients) =====
    const recipes = [
        {
            id: 1,
            title: "Classic Spaghetti Carbonara",
            time: 25,
            difficulty: "easy",
            description: "A creamy Italian pasta dish made with eggs, cheese, pancetta, and black pepper.",
            category: "pasta",
            ingredients: ["Spaghetti", "Eggs", "Pancetta", "Parmesan", "Black Pepper"],
            steps: [
                "Boil water and cook spaghetti",
                "Fry pancetta until crisp",
                "Whisk eggs and cheese together",
                {
                    text: "Combine pasta and sauce",
                    substeps: [
                        "Drain spaghetti and reserve some water",
                        "Mix pasta with pancetta",
                        "Add egg-cheese mixture slowly",
                        "Toss everything together"
                    ]
                },
                "Serve immediately with extra Parmesan"
            ]
        },
        {
            id: 2,
            title: "Chicken Tikka Masala",
            time: 45,
            difficulty: "medium",
            description: "Tender chicken pieces in a creamy, spiced tomato sauce.",
            category: "curry",
            ingredients: ["Chicken", "Yogurt", "Tomato Puree", "Spices", "Cream"],
            steps: [
                "Marinate chicken in yogurt and spices",
                "Grill chicken pieces",
                {
                    text: "Prepare sauce",
                    substeps: [
                        "Heat oil in pan",
                        "Add onions and garlic",
                        "Add tomato puree and spices",
                        "Simmer for 10 minutes"
                    ]
                },
                "Combine chicken with sauce and simmer",
                "Garnish with cream and coriander"
            ]
        },
        // ...add steps & ingredients to all remaining recipes (3–8) similarly
    ];

    // ===== STATE =====
    let currentFilter = "all";
    let currentSort = "none";

    // ===== DOM SELECTION =====
    const recipeContainer = document.querySelector('#recipe-container');
    const filterButtons = document.querySelectorAll('[data-filter]');
    const sortButtons = document.querySelectorAll('[data-sort]');

    // ===== RECURSIVE FUNCTION TO RENDER STEPS =====
    const renderSteps = (steps, level = 0) => {
        let html = '<ol>';
        steps.forEach(step => {
            if (typeof step === 'string') {
                html += `<li>${step}</li>`;
            } else if (step.text && step.substeps) {
                html += `<li>${step.text}${renderSteps(step.substeps, level + 1)}</li>`;
            }
        });
        html += '</ol>';
        return html;
    };

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

                <button class="toggle-btn" data-recipe-id="${recipe.id}" data-toggle="steps">Show Steps</button>
                <div class="steps-container" id="steps-${recipe.id}">
                    ${renderSteps(recipe.steps)}
                </div>

                <button class="toggle-btn" data-recipe-id="${recipe.id}" data-toggle="ingredients">Show Ingredients</button>
                <ul class="ingredients-container" id="ingredients-${recipe.id}">
                    ${recipe.ingredients.map(ing => `<li>${ing}</li>`).join('')}
                </ul>
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
                return [...recipes].sort((a, b) => a.title.localeCompare(b.title));
            case "time":
                return [...recipes].sort((a, b) => a.time - b.time);
            default:
                return recipes;
        }
    };

    // ===== MAIN UPDATE FUNCTION =====
    const updateDisplay = () => {
        let updatedRecipes = recipes;
        updatedRecipes = applyFilter(updatedRecipes, currentFilter);
        updatedRecipes = applySort(updatedRecipes, currentSort);
        renderRecipes(updatedRecipes);
        console.log(`Displaying ${updatedRecipes.length} recipes (Filter: ${currentFilter}, Sort: ${currentSort})`);
    };

    // ===== UPDATE ACTIVE BUTTONS =====
    const updateActiveButtons = () => {
        filterButtons.forEach(button => {
            button.classList.toggle("active", button.dataset.filter === currentFilter);
        });
        sortButtons.forEach(button => {
            button.classList.toggle("active", button.dataset.sort === currentSort);
        });
    };

    // ===== TOGGLE HANDLER (EVENT DELEGATION) =====
    const handleToggleClick = (event) => {
        const btn = event.target.closest('.toggle-btn');
        if (!btn) return;

        const recipeId = btn.dataset.recipeId;
        const toggleType = btn.dataset.toggle;
        const container = document.getElementById(`${toggleType}-${recipeId}`);
        if (!container) return;

        container.classList.toggle('visible');
        btn.textContent = container.classList.contains('visible')
            ? `Hide ${toggleType.charAt(0).toUpperCase() + toggleType.slice(1)}`
            : `Show ${toggleType.charAt(0).toUpperCase() + toggleType.slice(1)}`;
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

        // Event delegation for toggle buttons
        recipeContainer.addEventListener('click', handleToggleClick);
    };

    // ===== INITIALIZATION =====
    const init = () => {
        console.log("RecipeApp initializing...");
        setupEventListeners();
        updateDisplay();
        console.log("RecipeApp ready!");
    };

    // Expose public methods
    return { init, updateDisplay };

})();

// Initialize the app
RecipeApp.init();
