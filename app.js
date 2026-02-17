// ===== RecipeJS Complete: Parts 1-4 =====
const RecipeApp = (() => {

  // ===== RECIPE DATA (With ingredients & steps) =====
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
    // Add remaining recipes 3-8 with ingredients & steps
  ];

  // ===== STATE =====
  let currentFilter = "all";
  let currentSort = "none";
  let searchQuery = "";
  let favorites = JSON.parse(localStorage.getItem("recipeFavorites")) || [];

  // ===== DOM SELECTION =====
  const recipeContainer = document.querySelector('#recipe-container');
  const filterButtons = document.querySelectorAll('[data-filter]');
  const sortButtons = document.querySelectorAll('[data-sort]');
  const searchInput = document.querySelector('#search-input');
  const searchClearBtn = document.querySelector('#search-clear');
  const recipeCounter = document.querySelector('#recipe-counter');

  // ===== HELPER FUNCTIONS =====
  const renderSteps = (steps) => {
    let html = '<ol>';
    steps.forEach(step => {
      if (typeof step === 'string') {
        html += `<li>${step}</li>`;
      } else if (step.text && step.substeps) {
        html += `<li>${step.text}${renderSteps(step.substeps)}</li>`;
      }
    });
    html += '</ol>';
    return html;
  };

  const isFavorite = (id) => favorites.includes(id);

  // ===== CREATE RECIPE CARD =====
  const createRecipeCard = (recipe) => {
    return `
      <div class="recipe-card" data-id="${recipe.id}">
        <h3>${recipe.title}</h3>
        <div class="recipe-meta">
          <span>⏱️ ${recipe.time} min</span>
          <span class="difficulty ${recipe.difficulty}">${recipe.difficulty}</span>
        </div>
        <p>${recipe.description}</p>

        <button class="toggle-btn" data-recipe-id="${recipe.id}" data-toggle="steps">
          Show Steps
        </button>
        <div class="steps-container" id="steps-${recipe.id}">
          ${renderSteps(recipe.steps)}
        </div>

        <button class="toggle-btn" data-recipe-id="${recipe.id}" data-toggle="ingredients">
          Show Ingredients
        </button>
        <ul class="ingredients-container" id="ingredients-${recipe.id}">
          ${recipe.ingredients.map(ing => `<li>${ing}</li>`).join('')}
        </ul>

        <button class="favorite-btn" data-recipe-id="${recipe.id}">
          ${isFavorite(recipe.id) ? '❤️' : '🤍'}
        </button>
      </div>
    `;
  };

  // ===== FILTER, SORT, SEARCH =====
  const applyFilter = (recipesList) => {
    let filtered = [...recipesList];

    // Difficulty & Quick Filters
    switch (currentFilter) {
      case "easy":
      case "medium":
      case "hard":
        filtered = filtered.filter(r => r.difficulty === currentFilter);
        break;
      case "quick":
        filtered = filtered.filter(r => r.time < 30);
        break;
      case "favorites":
        filtered = filtered.filter(r => isFavorite(r.id));
        break;
    }

    // Search Filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(r =>
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.ingredients.some(i => i.toLowerCase().includes(q))
      );
    }

    return filtered;
  };

  const applySort = (recipesList) => {
    switch (currentSort) {
      case "name":
        return [...recipesList].sort((a, b) => a.title.localeCompare(b.title));
      case "time":
        return [...recipesList].sort((a, b) => a.time - b.time);
      default:
        return recipesList;
    }
  };

  // ===== RENDER =====
  const renderRecipes = () => {
    let updated = applyFilter(recipes);
    updated = applySort(updated);

    recipeContainer.innerHTML = updated.map(createRecipeCard).join('');
    recipeCounter.textContent = `Showing ${updated.length} of ${recipes.length} recipes`;
  };

  // ===== EVENT HANDLERS =====
  const handleToggleClick = (e) => {
    const btn = e.target.closest('.toggle-btn');
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

  const handleFavoriteClick = (e) => {
    const btn = e.target.closest('.favorite-btn');
    if (!btn) return;

    const id = parseInt(btn.dataset.recipeId);
    if (isFavorite(id)) {
      favorites = favorites.filter(fav => fav !== id);
    } else {
      favorites.push(id);
    }
    localStorage.setItem("recipeFavorites", JSON.stringify(favorites));
    renderRecipes();
  };

  const debounce = (fn, delay = 300) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  };

  const handleSearch = debounce((e) => {
    searchQuery = e.target.value.trim();
    searchClearBtn.style.display = searchQuery ? 'inline-block' : 'none';
    renderRecipes();
  });

  const clearSearch = () => {
    searchQuery = "";
    searchInput.value = "";
    searchClearBtn.style.display = 'none';
    renderRecipes();
  };

  const setupEventListeners = () => {
    // Filters
    filterButtons.forEach(btn => btn.addEventListener('click', () => {
      currentFilter = btn.dataset.filter;
      updateActiveButtons();
      renderRecipes();
    }));

    // Sorts
    sortButtons.forEach(btn => btn.addEventListener('click', () => {
      currentSort = btn.dataset.sort;
      updateActiveButtons();
      renderRecipes();
    }));

    // Toggles & Favorites via event delegation
    recipeContainer.addEventListener('click', handleToggleClick);
    recipeContainer.addEventListener('click', handleFavoriteClick);

    // Search
    searchInput.addEventListener('input', handleSearch);
    searchClearBtn.addEventListener('click', clearSearch);
  };

  const updateActiveButtons = () => {
    filterButtons.forEach(btn => btn.classList.toggle("active", btn.dataset.filter === currentFilter));
    sortButtons.forEach(btn => btn.classList.toggle("active", btn.dataset.sort === currentSort));
  };

  // ===== INIT =====
  const init = () => {
    console.log("RecipeApp initializing...");
    setupEventListeners();
    renderRecipes();
    console.log("RecipeApp ready!");
  };

  return { init };
})();

// Initialize
RecipeApp.init();
