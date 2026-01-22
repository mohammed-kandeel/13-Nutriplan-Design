'use strict';
// ! import
import * as components from './ui/components.js';
import * as mealdb from './api/mealdb.js';
import * as appState from './state/appState.js';

// ! variables
let timer;
// ! window
window.addEventListener('keydown', ({ key }) => {
   // navbar
   if (key === 'Escape' && components.Sidebar.isOpen()) components.Sidebar.toggle();
});
window.addEventListener('resize', () => {
   // navbar
   if (components.Sidebar.isOpen()) components.Sidebar.toggle();
});
window.addEventListener('popstate', (event) => {
   if (!event.state || typeof event.state.page === 'undefined') return;
   let { page, meal } = event.state;
   components.ViewManager.getSection(page);
   components.SidebarLinks.setActiveLink(page);
});

// ! methods
export function changUrl(index = 0, meal = '') {
   const url = ['home', 'products', 'foodlog', `meal/${meal}`];
   history.pushState({ page: index, meal: meal }, '', `#/${url[index]}${meal ? '/' + meal : ''}`);
}
function isMainMenuRecipesEmpty() {
   if (appState.app.MainMenu.recipes.length === 0) {
      components.MealsRecipes.emptyState();
   }
   return appState.app.MainMenu.recipes.length === 0;
}
function searchRecipes({ target }) {
   if (target.value.length > 0 && target.value.length < 2) return;
   clearTimeout(timer);
   timer = setTimeout(async () => {
      components.LoadingSpinner.show('#recipes-grid', '#recipes-grid > div');
      appState.app.MainMenu.search = await mealdb.MealsRecipes.searchForMeals(target.value);
      if (appState.app.MainMenu.search.length === 0) {
         components.MealsRecipes.renderRecipesCount(0, target.value);
         components.MealsRecipes.emptyState();
         return;
      }
      components.MealsRecipes.generateRecipes(appState.app.MainMenu.search);
      components.MealsRecipes.renderRecipesCount(appState.app.MainMenu.search.length, target.value);

      components.MealsRecipes.initCategoryBtnRecipe(onRecipeClick);
      if (appState.app.nutritionFacts) components.MealDetails.getMealInfo(appState.app.MainMenu.search, appState.app.nutritionFacts, foodLog);

      if (target.value === '') components.MealsRecipes.generateRecipes(appState.app.MainMenu.recipes);
   }, 400);
}
async function onAreaBtnClick({ target }) {
   components.LoadingSpinner.show('#recipes-grid', '#recipes-grid > div');
   let index = Number(target.getAttribute('data-index'));
   components.MealsRecipes.setActiveBtnArea(index, appState.app.MainMenu.areaBtn);
   appState.app.MainMenu.areaBtn = index;
   if (index === 0) {
      appState.app.MainMenu.recipes = await mealdb.MealsRecipes.getRandomMeals();
   } else {
      index--;
      appState.app.MainMenu.recipes = await mealdb.MealsRecipes.getMealsByArea(appState.app.MainMenu.allAreas[index].name);
   }
   if (isMainMenuRecipesEmpty()) return;
   components.MealsRecipes.generateRecipes(appState.app.MainMenu.recipes);
   components.MealsRecipes.initCategoryBtnRecipe(onRecipeClick);
}
async function onCategoryBtnClick(e) {
   components.LoadingSpinner.show('#recipes-grid', '#recipes-grid > div');
   let target = e.currentTarget;
   const category = target.getAttribute('data-category');
   appState.app.MainMenu.recipes = await mealdb.MealsRecipes.getCategory(category);
   if (isMainMenuRecipesEmpty()) return;
   components.MealsRecipes.generateRecipes(appState.app.MainMenu.recipes);
   components.MealsRecipes.initCategoryBtnRecipe(onRecipeClick);
}
async function onRecipeClick(e) {
   components.ViewManager.setMealDetails();
   components.LoadingSpinner.show('#meal-details', '#meal-details > div');
   const target = e.currentTarget;
   appState.app.MainMenu.meal = await mealdb.MealsRecipes.getMealById(target.getAttribute('data-meal-id'));
   appState.app.nutritionFacts = await mealdb.NutritionFacts.analyzeMeal(appState.app.MainMenu.meal.name, appState.app.MainMenu.meal.ingredients);
   if (appState.app.nutritionFacts) components.MealDetails.getMealInfo(appState.app.MainMenu.meal, appState.app.nutritionFacts, foodLog);
   changUrl(3, appState.app.MainMenu.meal.name.replaceAll(' ', '-'));
   components.LoadingSpinner.hide('#meal-details', '#meal-details > div');
}
function swalConfirmMeal(calories) {
   Swal.fire({
      icon: 'success',
      title: 'Meal Logged!',
      html: `
       Chicken Mandi (1 serving) has been added to your daily log.<br>
       <strong style="color:#16a34a">+${calories} calories</strong>
     `,
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
   });
}
// ProductScanner
async function searchProductScanner(e, value = '') {
   if (value === '') return;
   components.LoadingSpinner.show('#products-grid', '#products-grid > div');

   let target = e.currentTarget;
   if (target === document.querySelector('#search-product-btn')) {
      appState.app.productScanner.products = await mealdb.ProductScanner.searchForProduct(value);
      if (appState.app.productScanner.products?.results.length === 0) appState.app.productScanner.products = null;
      // stor proses product Scanner
      appState.app.productScanner.proses.type = 'search';
      appState.app.productScanner.proses.value = value;
   } else {
      appState.app.productScanner.products = await mealdb.ProductScanner.getProductByBarcode(value);
   }

   if (appState.app.productScanner.products) {
      components.ProductScanner.setProducts(appState.app.productScanner.products);
      if (target === document.querySelector('#search-product-btn')) components.ProductScanner.productsCountMassage(`Found ${appState.app.productScanner.products.pagination.total} products in "${value}"`);
      else {
         components.ProductScanner.productsCountMassage(`Found product : "${value}"`);
         components.ProductScanner.getProductInfo(appState.app.productScanner.products, productLog);
      }
   } else {
      components.LoadingSpinner.hide('#products-grid', '#products-grid > div');
      components.ProductScanner.productsEmpty();
      document.querySelector('#product-categories');
      components.ProductScanner.productsCountMassage(`No products found for "${value}"`);
      components.ProductScanner.productNotFoundInDatabase();
   }

   //  click Product
   components.ProductScanner.inetProducts(onProductClick);
}
async function onProductCategoriesBtn(e) {
   // show loading screen
   components.LoadingSpinner.show('#products-grid', '#products-grid > div');

   // get current Target element
   const target = e.currentTarget;

   // stor proses product Scanner
   appState.app.productScanner.proses.type = 'category';
   appState.app.productScanner.proses.value = target.getAttribute('data-category');

   // get data
   appState.app.productScanner.products = await mealdb.ProductScanner.searchForCategory(target.getAttribute('data-category'));

   // check data and display
   if (appState.app.productScanner.products) {
      components.ProductScanner.productsCountMassage(`Found ${appState.app.productScanner.products.pagination.total} products in ${target.getAttribute('data-category')}`);
      components.ProductScanner.setProducts(appState.app.productScanner.products);
   } else {
      components.LoadingSpinner.hide('#products-grid', '#products-grid > div');
      components.ProductScanner.productsEmpty();
      components.ProductScanner.productsCountMassage(`No Found products for "${target.getAttribute('data-category')}"`);
   }
   //  click Product
   components.ProductScanner.inetProducts(onProductClick);
}
async function onNutriScoreBtn(e) {
   if (appState.app.productScanner.proses.type === '' && appState.app.productScanner.proses.value === '') return;

   // show loading screen
   components.LoadingSpinner.show('#products-grid', '#products-grid > div');
   // get current Target element
   const target = e.currentTarget;
   // get data
   appState.app.productScanner.products = await mealdb.ProductScanner.FilterByNutriScore(appState.app.productScanner.proses.value, appState.app.productScanner.proses.type, target.getAttribute('data-grade'));
   console.log(appState.app.productScanner.products);

   // check data and display
   if (appState.app.productScanner.products) {
      components.ProductScanner.setProducts(appState.app.productScanner.products);
      components.ProductScanner.productsCountMassage(
         `Found ${appState.app.productScanner.products.pagination.total} products in ${appState.app.productScanner.proses.value}, Filter by Nutri-Score: ${target.getAttribute('data-grade').toUpperCase()}`
      );
   } else {
      components.LoadingSpinner.hide('#products-grid', '#products-grid > div');
      components.ProductScanner.productsEmpty();
      components.ProductScanner.productsCountMassage(`No Found products for "${appState.app.productScanner.proses.value}" with Nutri-Score: ${target.getAttribute('data-grade').toUpperCase()}`);
   }

   // function click
   components.ProductScanner.inetProducts(onProductClick);
}
async function onProductClick(target) {
   document.body.append(components.ProductScanner.productDetailModal());
   components.LoadingSpinner.show('#product-detail-modal > div > div ', '#meal-details > div > div > div ');
   appState.app.productScanner.product = await mealdb.ProductScanner.getProductByBarcode(target.getAttribute('data-barcode'));
   document.querySelector('#product-detail-modal')?.remove;
   if (appState.app.productScanner.product) components.ProductScanner.getProductInfo(appState.app.productScanner.product, productLog);
   else document.querySelector('#product-detail-modal')?.remove;
}
// foodLog
function foodLog(mealInfo) {
   swalConfirmMeal(mealInfo.nutritionFacts.perServing.calories);
   logData({ data: mealInfo, type: 'Product' });
}
function productLog(productInfo) {
   logData({ data: productInfo, type: 'Recipe' });
}
function logData({ data, type }) {
   components.FoodLog.updateFoodLog({ newItem: data, typeOfItem: type });
}

async function getAppData() {
   components.LoadingOverlay.show();
   appState.app.MainMenu.allAreas = await mealdb.MealsRecipes.getAllAreas();
   appState.app.MainMenu.categories = await mealdb.MealsRecipes.getCategories();
   appState.app.MainMenu.recipes = await mealdb.MealsRecipes.getRandomMeals();
   renderApp();
   await components.LoadingOverlay.hide();
}
function renderApp() {
   history.replaceState({}, '', location.href);
   localStorage.removeItem('recipeGride');
   // Meals and Recipes
   components.MealsRecipes.initSearchForMeals(searchRecipes);
   components.MealsRecipes.generateBtnsArea(appState.app.MainMenu.allAreas);
   components.MealsRecipes.generateBtnsCategories(appState.app.MainMenu.categories);
   if (appState.app.MainMenu.recipes?.length > 0) components.MealsRecipes.generateRecipes(appState.app.MainMenu.recipes);
   components.MealsRecipes.initCategoryBtnRecipe(onRecipeClick);

   components.MealsRecipes.initAreaButtons(onAreaBtnClick);
   components.MealsRecipes.initCategoriesButtons(onCategoryBtnClick);
   components.MealsRecipes.setActiveBtnArea();

   components.ProductScanner.search(searchProductScanner);
   components.ProductScanner.initProductCategoriesBtns(onProductCategoriesBtn);
   components.ProductScanner.initNutriScoreBtn(onNutriScoreBtn);
}
// ! first Run
getAppData();
changUrl();
components.FirstRun.init();
