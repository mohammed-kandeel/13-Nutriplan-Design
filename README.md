# 🥗 NutriPlan — Nutrition Tracking App

A full-featured nutrition tracking web app built with vanilla JavaScript (OOP) and ES6 modules. Browse meals, view detailed nutrition facts, scan food products by barcode, and track your daily calorie and macro intake — all with a clean SPA architecture and URL-based navigation.

🌐 **Live Demo:** [mohammed-kandeel.github.io/13-Nutriplan-Design/#/home](https://mohammed-kandeel.github.io/13-Nutriplan-Design/#/home)

---

## 🚀 Features

### 🏠 Home — Meals & Recipes
- Browse **25 random meals** on load
- Filter by **Area** (Egyptian, Italian, Japanese...) or **Category** (Chicken, Pasta, Vegan...)
- Real-time **search** with 400ms debounce
- **Grid / List** view toggle (preference saved to localStorage)
- Loading spinners between requests

### 🍽️ Meal Details Page
- Full meal info: ingredients with checkboxes, step-by-step instructions, YouTube video embed
- **Nutrition facts** panel: calories, protein, carbs, fat, fiber, sugar, cholesterol, sodium — with progress bars
- **Log This Meal** button → opens serving count modal → adds to Food Log

### 📦 Product Scanner
- Search by **product name** or **barcode**
- Browse by **10 product categories** (cereals, beverages, snacks, dairy...)
- Filter results by **Nutri-Score** (A → E) using `Promise.all` parallel fetching
- Product detail modal with Nutri-Score badge + NOVA group indicator
- **Log This Food** → adds product to Food Log

### 📋 Food Log
- Tracks daily intake: Calories (2000 kcal), Protein (50g), Carbs (250g), Fat (65g)
- Progress bars turn red when limits are exceeded
- **Weekly chart** showing calories per day
- Delete individual items or clear all (SweetAlert2 confirmation)
- All data persisted to **localStorage**

### 🔗 URL Navigation (History API)
- `#/home` → Home
- `#/products` → Product Scanner
- `#/foodlog` → Food Log
- `#/meal/Meal-Name` → Meal Details
- Browser back/forward buttons work correctly

---

## 🛠️ Technologies Used

- **HTML5** — Semantic structure
- **Tailwind CSS** — Full utility-class styling
- **JavaScript (ES6+)** — Modules, Classes (OOP), Async/Await, `Promise.all`
- **SweetAlert2** — Meal log confirm toasts + delete confirmations
- **Font Awesome** — Icons
- **Custom API** — `nutriplan-api.vercel.app`

---

## 🏗️ Architecture — ES6 Modules + OOP

```
src/
├── main.js              # App entry point, event wiring
├── state/
│   └── appState.js      # Global app state object
├── api/
│   └── mealdb.js        # API classes: MealsRecipes, NutritionFacts, ProductScanner
└── ui/
    └── components.js    # UI classes: Sidebar, ViewManager, MealsRecipes,
                         #   MealDetails, ProductScanner, FoodLog, FirstRun
```

### Key Classes

| Class | Responsibility |
|-------|----------------|
| `LoadingOverlay` | Full-screen loading on app start |
| `LoadingSpinner` | Inline spinners per section |
| `Sidebar` | Mobile sidebar open/close with overlay |
| `SidebarLinks` | Active link tracking + navigation |
| `ViewManager` | Section show/hide (replaces routing) |
| `MealsRecipes` | Render recipe grid, area/category filters, search |
| `MealDetails` | Full meal page: ingredients, instructions, video, nutrition |
| `ProductScanner` | Search/browse/filter food products |
| `FoodLog` | Daily log with progress bars and weekly chart |
| `FirstRun` | Initializes all classes on app start |

---

## 🔌 APIs Used

| API | Endpoint | Used For |
|-----|----------|----------|
| **NutriPlan Meals** | `nutriplan-api.vercel.app/api/meals/` | Recipes, categories, areas, search |
| **NutriPlan Nutrition** | `nutriplan-api.vercel.app/api/nutrition/analyze` | Analyze meal ingredients for macros |
| **NutriPlan Products** | `nutriplan-api.vercel.app/api/products/` | Product search, barcode lookup, categories |

---

## 🧠 JavaScript Concepts Used

### Debounced Search
```javascript
function searchRecipes({ target }) {
  if (target.value.length > 0 && target.value.length < 2) return;
  clearTimeout(timer);
  timer = setTimeout(async () => {
    // fetch + render
  }, 400);
}
```

### Retry Logic with Max Attempts
```javascript
static async #fetchWithRetry(url) {
  if (shouldStop(retryCounters[url])) return null;
  retryCounters[url]++;
  try {
    const response = await fetch(url);
    if (!response.ok) return this.#fetchWithRetry(url); // recursive retry
    return await response.json();
  } catch {
    return this.#fetchWithRetry(url);
  }
}
```

### Parallel Fetching for Nutri-Score Filter
```javascript
const urls = []; // build 10 page URLs
const promises = urls.map((url) => this.#fetch(url));
const pagesData = await Promise.all(promises);
// filter all results client-side by nutritionGrade
```

### History API Navigation (BONUS)
```javascript
export function changUrl(index = 0, meal = '') {
  const url = ['home', 'products', 'foodlog', `meal/${meal}`];
  history.pushState({ page: index, meal }, '', `#/${url[index]}`);
}
window.addEventListener('popstate', (event) => {
  components.ViewManager.getSection(event.state.page);
});
```

### Private Class Fields
```javascript
export class Sidebar {
  static #sidebar = document.querySelector('#sidebar');
  static #isOpen = false;
  static #open() { ... }
  static toggle() { this.#isOpen ? this.#close() : this.#open(); }
}
```

---

## 📁 Project Structure

```
NutriPlan/
│
├── index.html
├── assets/
│   └── css/
│       └── style.css
├── src/
│   ├── main.js
│   ├── state/
│   │   └── appState.js
│   ├── api/
│   │   └── mealdb.js
│   └── ui/
│       └── components.js
│
└── README.md
```

---

## ▶️ How to Run

Requires a local server (uses ES6 modules):

```bash
# Using VS Code Live Server or:
npx serve .
```

Then open `http://localhost:3000`

---

## 👤 Author

**Mohammed Kandeel**  
🔗 [13-Nutriplan-Design](https://github.com/mohammed-kandeel/13-Nutriplan-Design/tree/main)  
🌐 [Live Demo](https://mohammed-kandeel.github.io/13-Nutriplan-Design/#/home)






/*--------------------------------------------
# NutriPlan - JavaScript Starter Project

Welcome to the NutriPlan starter project! The design is fully complete - your task is to bring it to life with JavaScript.

## 🎯 Project Overview

NutriPlan is a Food, Nutrition & Fitness Planner web application. The HTML and CSS are ready - you need to implement the JavaScript functionality.

## 📁 Project Structure

```
starter/
├── index.html          # Main HTML file (ready)
├── README.md           # This file
└── src/
    ├── css/
    │   └── style.css   # Styles (ready)
    └── js/
        ├── main.js           # Entry point (implement here)
        ├── api/
        │   └── mealdb.js     # API module (implement here)
        ├── state/
        │   └── appState.js   # State management (implement here)
        └── ui/
            └── components.js  # UI components (implement here)
```

## 🚀 Getting Started

1. Open `index.html` in your browser to see the design
2. Start implementing the JavaScript files
3. Begin with `src/js/api/mealdb.js` - fetch data from the API
4. Then update `src/js/main.js` to load and display data

## 🔗 API Reference

### TheMealDB API (Free, No API Key Required)

Base URL: `https://www.themealdb.com/api/json/v1/1/`

| Endpoint | Description | Example |
|----------|-------------|---------|
| `/categories.php` | Get all categories | [Try it](https://www.themealdb.com/api/json/v1/1/categories.php) |
| `/search.php?s={query}` | Search meals by name | [Try it](https://www.themealdb.com/api/json/v1/1/search.php?s=chicken) |
| `/lookup.php?i={id}` | Get meal by ID | [Try it](https://www.themealdb.com/api/json/v1/1/lookup.php?i=52772) |
| `/filter.php?c={category}` | Filter by category | [Try it](https://www.themealdb.com/api/json/v1/1/filter.php?c=Seafood) |
| `/filter.php?a={area}` | Filter by area/cuisine | [Try it](https://www.themealdb.com/api/json/v1/1/filter.php?a=Italian) |
| `/random.php` | Get random meal | [Try it](https://www.themealdb.com/api/json/v1/1/random.php) |

## ✅ Tasks to Complete

### Level 1: Basic Functionality
- [ ] Fetch and display meal categories in `#categories-grid`
- [ ] Fetch and display recipes in `#recipes-grid`
- [ ] Hide the loading overlay when data is loaded
- [ ] Update the recipe count text

### Level 2: Interactivity
- [ ] Implement search functionality (use `#search-input`)
- [ ] Filter recipes when clicking on a category
- [ ] Show meal details when clicking on a recipe card

### Level 3: Navigation
- [ ] Implement sidebar navigation between pages
- [ ] Create different views (Meals, Products, Food Log)

### Level 4: Advanced Features
- [ ] Add loading states while fetching data
- [ ] Implement error handling for API calls
- [ ] Save favorites to localStorage

## 🎨 Key HTML Elements

### Meals Page
| Element ID | Purpose |
|------------|---------|
| `#app-loading-overlay` | Loading screen (hide when ready) |
| `#categories-grid` | Container for category cards |
| `#recipes-grid` | Container for recipe cards |
| `#search-input` | Search input field |
| `#recipes-count` | Text showing recipe count |

### Product Scanner Page
| Element ID | Purpose |
|------------|---------|
| `#products-section` | Product scanner page container (toggle display) |
| `#product-search-input` | Product name search input |
| `#barcode-input` | Barcode number input |
| `#search-product-btn` | Product search button |
| `#lookup-barcode-btn` | Barcode lookup button |
| `#products-grid` | Container for product cards |
| `#products-count` | Text showing products count |
| `.nutri-score-filter` | Nutri-Score filter buttons |

### Food Log Page
| Element ID | Purpose |
|------------|---------|
| `#foodlog-section` | Food log page container (toggle display) |
| `#foodlog-date` | Current date display |
| `#foodlog-today-section` | Today's nutrition summary |
| `#logged-items-list` | Container for logged food items |
| `#weekly-chart` | Weekly chart container (Plotly) |
| `#clear-foodlog` | Clear all logged items button |
| `.quick-log-btn` | Quick action buttons |

## 💡 Tips

1. **Start Simple**: First just fetch and log data to console
2. **Use Modules**: The project uses ES6 modules (`type="module"`)
3. **Check Console**: Look for TODO messages and errors
4. **Inspect Design**: The skeleton loaders show the expected card layout
5. **Navigation**: Use `style.display = "none"` or `style.display = ""` to show/hide sections
6. **Page State**: Track current page in your app state for navigation

## 🔄 Navigation

To switch between pages, hide/show the relevant sections:
- **Meals Page**: Show `#search-filters-section`, `#meal-categories-section`, `#all-recipes-section`
- **Product Scanner**: Show `#products-section`
- **Food Log**: Show `#foodlog-section`
  */
