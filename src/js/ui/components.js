// ? import
import { changUrl } from '../main.js';

// ! Loading Overlay
export class LoadingOverlay {
   // att
   // * privet
   static #overlay = document.querySelector('#app-loading-overlay');

   // methods
   // * public
   static show() {
      this.#overlay.classList.remove('loading');
      this.#overlay.classList.remove('opacity-80');
   }
   static hide() {
      return new Promise((resolve) => {
         this.#overlay.classList.add('opacity-80');
         setTimeout(() => {
            this.#overlay.classList.add('loading');
            resolve();
         }, 290);
      });
   }
}
// ! Loading Spinner
export class LoadingSpinner {
   static show(counter, containerChild) {
      counter = document.querySelector(counter);
      containerChild = document.querySelectorAll(containerChild);
      const spinner = document.createElement('div');
      spinner.classList.add('loadingSpinner', 'flex', 'items-center', 'justify-center', 'py-12');
      spinner.innerHTML = '<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>';
      containerChild.forEach((element) => {
         element.classList.add('hidden');
         element.style.display = 'none';
      });
      counter.append(spinner);
   }
   static hide(counter, containerChild) {
      counter = document.querySelector(counter);
      containerChild = document.querySelectorAll(containerChild);
      const spinner = document.querySelector('.loadingSpinner');
      spinner?.remove();
      containerChild.forEach((element) => {
         element.classList.remove('hidden');
         element.style = '';
      });
   }
}
// ! Sidebar
export class Sidebar {
   // att
   // * privet
   static #sidebar = document.querySelector('#sidebar');
   static #sidebarOverlay = document.querySelector('#sidebar-overlay');
   static #isOpen = false;

   // methods
   // * privet
   static #open() {
      this.#sidebar.style.transform = 'translate(0)';
      this.#sidebarOverlay.style.cssText = `
         opacity: 1;
         display: block`;
      this.#isOpen = true;
   }
   static #close() {
      this.#sidebar.style = '';
      this.#sidebarOverlay.style = '';
      this.#isOpen = false;
   }
   // * public
   static toggle() {
      this.#isOpen ? this.#close() : this.#open();
   }
   static isOpen() {
      return this.#isOpen;
   }
   static init() {
      document.querySelector('#header-menu-btn').addEventListener('click', () => {
         this.toggle();
      });
      document.querySelector('#sidebar-overlay').addEventListener('click', () => {
         this.toggle();
      });
      document.querySelector('#sidebar-close-btn').addEventListener('click', () => {
         this.toggle();
      });
   }
}
// ! Sidebar Links
export class SidebarLinks {
   // att
   // * privet
   static #allLinks = document.querySelectorAll('#sidebar nav  ul > li > a');
   static #dataAttributeIndex = 0;

   // methods
   // * privet
   static #setDataIndex() {
      this.#allLinks.forEach((element) => {
         element.setAttribute('data-index', this.#dataAttributeIndex);
         this.#dataAttributeIndex++;
      });
   }
   // * public
   static setActiveLink(activeLink) {
      this.#allLinks.forEach((link) => {
         if (+link.getAttribute('data-index') === +activeLink) {
            link.classList.add('bg-emerald-50', 'text-emerald-700');
            link.classList.remove('text-gray-600', 'hover:bg-gray-50');
         } else {
            link.classList.remove('bg-emerald-50', 'text-emerald-700');
            link.classList.add('text-gray-600', 'hover:bg-gray-50');
         }
      });
   }
   static init() {
      this.#setDataIndex();
      this.#allLinks.forEach((element) => {
         element.addEventListener('click', (e) => {
            e.preventDefault();
            let target = e.currentTarget;
            ViewManager.getSection(target.getAttribute('data-index'));
            this.setActiveLink(target.getAttribute('data-index'));
            Sidebar.toggle();
            changUrl(target.getAttribute('data-index'));
         });
      });
   }
}
// ! Section Controller
export class ViewManager {
   // att
   // * privet
   static #searchFilters = document.querySelector('#search-filters-section');
   static #mealCategories = document.querySelector('#meal-categories-section');
   static #allRecipes = document.querySelector('#all-recipes-section');
   static #mealDetails = document.querySelector('#meal-details');
   static #products = document.querySelector('#products-section');
   static #foodlog = document.querySelector('#foodlog-section');

   // methods
   // * privet
   static #showMealsRecipes() {
      this.#searchFilters.classList.remove('hidden');
      this.#mealCategories.classList.remove('hidden');
      this.#allRecipes.classList.remove('hidden');
   }
   static #ShowProductScanner() {
      this.#products.classList.remove('hidden');
   }
   static #ShowMealDetails() {
      this.#mealDetails.classList.remove('hidden');
   }
   static #showFoodLog() {
      this.#foodlog.classList.remove('hidden');
   }
   static #hideMealsRecipes() {
      this.#searchFilters.classList.add('hidden');
      this.#mealCategories.classList.add('hidden');
      this.#allRecipes.classList.add('hidden');
   }
   static #hideMealDetails() {
      this.#mealDetails.classList.add('hidden');
   }
   static #hideProductScanner() {
      this.#products.classList.add('hidden');
   }
   static #hideFoodLog() {
      this.#foodlog.classList.add('hidden');
   }
   // * public
   static setSearchFilters() {
      this.#showMealsRecipes();
      this.#hideMealDetails();
      this.#hideProductScanner();
      this.#hideFoodLog();
   }
   static setMealDetails() {
      this.#hideMealsRecipes();
      this.#ShowMealDetails();
      this.#hideProductScanner();
      this.#hideFoodLog();
   }
   static setProductScanner() {
      this.#hideMealsRecipes();
      this.#hideMealDetails();
      this.#ShowProductScanner();
      this.#hideFoodLog();
   }
   static setFoodLog() {
      this.#hideMealsRecipes();
      this.#hideMealDetails();
      this.#hideProductScanner();
      this.#showFoodLog();
   }
   static getSection(index) {
      switch (String(index)) {
         case '0':
            this.setSearchFilters();
            break;
         case '1':
            this.setProductScanner();
            break;
         case '2':
            this.setFoodLog();
            break;
         case '3':
            this.setMealDetails();
            break;
         default:
            this.setSearchFilters();
            changUrl(target.getAttribute(0));
            break;
      }
   }
}
// ! Meals & Recipes
export class MealsRecipes {
   // att
   // * privet
   static #search = document.querySelector('#search-input');
   static #areasBtnsContainer = document.querySelector('#search-filters-section > div > div:last-child');
   static #categoriesBtnsContainer = document.querySelector('#categories-grid');
   static #gridViewBtn = document.querySelector('#grid-view-btn');
   static #listViewBtn = document.querySelector('#list-view-btn');
   static #recipesGrid = document.querySelector('#recipes-grid');
   static #recipesCount = document.querySelector('#recipes-count');
   // methods
   // * privet
   static #toggleGridListView() {
      this.#recipesGrid.classList.toggle('grid-cols-4');
      this.#recipesGrid.classList.toggle('gap-5');
      this.#recipesGrid.classList.toggle('grid-cols-2');
      this.#recipesGrid.classList.toggle('gap-4');
      const allRecipesCards = document.querySelectorAll('#recipes-grid > .recipe-card');
      allRecipesCards.forEach((element) => {
         element.classList.toggle('flex');
         element.classList.toggle('flex-row');
         element.classList.toggle('h-40');
      });
      const imageRecipesContainer = document.querySelectorAll('#recipes-grid > .recipe-card > div:first-child');
      imageRecipesContainer.forEach((element) => {
         element.classList.toggle('w-48');
         element.classList.toggle('flex-shrink-0');
         element.lastElementChild.classList.toggle('hidden');
      });
      this.#gridViewBtn.classList.toggle('bg-white');
      this.#gridViewBtn.classList.toggle('rounded-md');
      this.#gridViewBtn.classList.toggle('shadow-sm');
      this.#gridViewBtn.classList.toggle('active');
      this.#listViewBtn.classList.toggle('bg-white');
      this.#listViewBtn.classList.toggle('rounded-md');
      this.#listViewBtn.classList.toggle('shadow-sm');
      this.#listViewBtn.classList.toggle('active');
   }
   static #getAreasBtn(index, area) {
      const btn = document.createElement('button');
      btn.classList.add('px-4', 'py-2', 'rounded-full', 'font-medium', 'text-sm', 'whitespace-nowrap', 'transition-all', 'bg-gray-100', 'text-gray-700', 'hover:bg-gray-200');
      btn.setAttribute('data-index', index);
      btn.textContent = area;
      return btn;
   }
   static #getCategoriesBtn(categories) {
      const categoryStyles = {
         Beef: {
            categoryCard: 'from-red-50 to-rose-50 border-red-200 hover:border-red-400',
            icon: 'fa-drumstick-bite',
            iconClass: 'from-red-400 to-rose-500',
         },
         Chicken: {
            categoryCard: 'from-amber-50 to-orange-50 border-amber-200 hover:border-amber-400',
            icon: 'fa-drumstick-bite',
            iconClass: 'from-amber-400 to-orange-500',
         },
         Dessert: {
            categoryCard: 'from-pink-50 to-rose-50 border-pink-200 hover:border-pink-400',
            icon: 'fa-cake-candles',
            iconClass: 'from-pink-400 to-rose-500',
         },
         Lamb: {
            categoryCard: 'from-orange-50 to-amber-50 border-orange-200 hover:border-orange-400',
            icon: 'fa-drumstick-bite',
            iconClass: 'from-orange-400 to-amber-500',
         },
         Miscellaneous: {
            categoryCard: 'from-slate-50 to-gray-50 border-slate-200 hover:border-slate-400',
            icon: 'fa-bowl-rice',
            iconClass: 'from-slate-400 to-gray-500',
         },
         Pasta: {
            categoryCard: 'from-yellow-50 to-amber-50 border-yellow-200 hover:border-yellow-400',
            icon: 'fa-bowl-food',
            iconClass: 'from-yellow-400 to-amber-500',
         },
         Pork: {
            categoryCard: 'from-rose-50 to-red-50 border-rose-200 hover:border-rose-400',
            icon: 'fa-bacon',
            iconClass: 'from-rose-400 to-red-500',
         },
         Seafood: {
            categoryCard: 'from-cyan-50 to-blue-50 border-cyan-200 hover:border-cyan-400',
            icon: 'fa-fish',
            iconClass: 'from-cyan-400 to-blue-500',
         },
         Side: {
            categoryCard: 'from-green-50 to-emerald-50 border-green-200 hover:border-green-400',
            icon: 'fa-plate-wheat',
            iconClass: 'from-green-400 to-emerald-500',
         },
         Starter: {
            categoryCard: 'from-teal-50 to-cyan-50 border-teal-200 hover:border-teal-400',
            icon: 'fa-utensils',
            iconClass: 'from-teal-400 to-cyan-500',
         },
         Vegan: {
            categoryCard: 'from-emerald-50 to-green-50 border-emerald-200 hover:border-emerald-400',
            icon: 'fa-leaf',
            iconClass: 'from-emerald-400 to-green-500',
         },
         Vegetarian: {
            categoryCard: 'from-lime-50 to-green-50 border-lime-200 hover:border-lime-400',
            icon: 'fa-seedling',
            iconClass: 'from-lime-400 to-green-500',
         },
      };
      return `
                  <div class="category-card bg-gradient-to-br rounded-xl p-3 border hover:shadow-md cursor-pointer transition-all group ${categoryStyles[categories].categoryCard}" data-category="${categories}">
                     <div class="flex items-center gap-2.5">
                        <div class="text-white w-9 h-9 bg-gradient-to-br ${categoryStyles[categories].iconClass} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                           <i class="fa-solid ${categoryStyles[categories].icon}"></i>
                        </div>
                        <div>
                           <h3 class="text-sm font-bold text-gray-900">${categories}</h3>
                        </div>
                     </div>
                  </div>
      
      `;
   }
   static #setToLocalStorageRecipeGride() {
      let styleRecipeGride = {
         allRecipesCards: String([...document.querySelector('#recipes-grid > .recipe-card')?.classList]).replaceAll(',', ' '),
         imageRecipesContainer: String([...document.querySelector('#recipes-grid > .recipe-card > div:first-child')?.classList]).replaceAll(',', ' '),
      };
      localStorage.setItem('recipeGride', JSON.stringify(styleRecipeGride));
   }
   static #getToLocalStorageRecipeGride() {
      return JSON.parse(localStorage.getItem('recipeGride'));
   }
   // * public
   static emptyState() {
      this.#recipesGrid.innerHTML = `
      <div class="flex flex-col items-center justify-center py-12 text-center">
         <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <i class="fa-solid fa-search text-gray-400 text-2xl"></i>
         </div>
         <p class="text-gray-500 text-lg">No recipes found</p>
         <p class="text-gray-400 text-sm mt-2">Try searching for something else</p>
      </div>   
      `;
   }
   static initSearchForMeals(searchRecipes) {
      this.#search.addEventListener('input', searchRecipes);
   }
   static generateBtnsArea(array) {
      let btns = [];
      btns.push(this.#getAreasBtn(0, 'All Recipes'));
      for (let i = 0; i < array.length && i < 10; i++) {
         btns.push(this.#getAreasBtn(i + 1, array[i].name));
      }
      this.#areasBtnsContainer.innerHTML = '';
      btns.forEach((element) => {
         this.#areasBtnsContainer.append(element);
      });
   }
   static setActiveBtnArea(index = 0, oldIndex = 0) {
      const btns = document.querySelectorAll('#search-filters-section > div > div:last-child > button');
      btns[oldIndex].classList.add('bg-gray-100', 'text-gray-700', 'hover:bg-gray-200');
      btns[oldIndex].classList.remove('bg-emerald-600', 'text-white', 'hover:bg-emerald-700');
      btns[index].classList.remove('bg-gray-100', 'text-gray-700', 'hover:bg-gray-200');
      btns[index].classList.add('bg-emerald-600', 'text-white', 'hover:bg-emerald-700');
   }
   static initAreaButtons(onAreaBtnClick) {
      const btns = document.querySelectorAll('#search-filters-section > div > div:last-child > button');
      btns.forEach((btn) => {
         btn.addEventListener('click', onAreaBtnClick);
      });
   }
   static generateBtnsCategories(array) {
      let btns = '';
      for (let i = 0; i < array.length && i < 12; i++) {
         btns += this.#getCategoriesBtn(array[i].name);
      }
      this.#categoriesBtnsContainer.innerHTML = btns;
   }
   static initCategoriesButtons(onCategoryBtnClick) {
      const btns = document.querySelectorAll('#categories-grid > div');
      btns.forEach((btn) => {
         btn.addEventListener('click', onCategoryBtnClick);
      });
   }
   static renderRecipesCount(count, label = '') {
      this.#recipesCount.innerHTML = label ? `Showing ${count} recipes for "${label}"` : `Showing ${count} recipes`;
   }
   static generateRecipes(recipes) {
      document.querySelectorAll('#log-meal-modal').forEach((el) => el.remove());
      const gride = this.#getToLocalStorageRecipeGride();
      const allRecipesCardsClass = gride?.allRecipesCards ? gride['allRecipesCards'] : null;
      const imageRecipesContainerClass = gride?.imageRecipesContainer ? gride['imageRecipesContainer'] : null;

      this.renderRecipesCount(recipes.length);
      let cartona = '';
      recipes.forEach((recipe) => {
         cartona += `
                  <div class="${allRecipesCardsClass ? allRecipesCardsClass : 'recipe-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group'}" data-meal-id="${recipe.id}">
                     <div class="${imageRecipesContainerClass ? imageRecipesContainerClass : 'relative h-48 overflow-hidden'}">
                        <img
                           class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                           src="${recipe.thumbnail}"
                           alt="${recipe.name}"
                           loading="lazy"
                        />
                        <div class="absolute bottom-3 left-3 flex gap-2">
                           <span class="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold rounded-full text-gray-700"> ${recipe.category} </span>
                           <span class="px-2 py-1 bg-emerald-500 text-xs font-semibold rounded-full text-white"> ${recipe.area} </span>
                        </div>
                     </div>

                     <div class="p-4">
                        <h3 class="text-base font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors line-clamp-1">${recipe.name}</h3>
                        <p class="text-xs text-gray-600 mb-3 line-clamp-2">${recipe.instructions[0]}</p>
                        <div class="flex items-center justify-between text-xs">
                           <span class="font-semibold text-gray-900">
                              <i class="fa-solid fa-utensils text-emerald-600 mr-1"></i>
                              ${recipe.category}
                           </span>
                           <span class="font-semibold text-gray-500">
                              <i class="fa-solid fa-globe text-blue-500 mr-1"></i>
                              ${recipe.area}
                           </span>
                        </div>
                     </div>
                  </div>
         
         `;
      });
      this.#recipesGrid.innerHTML = cartona;
   }
   static initCategoryBtnRecipe(onCategoryBtnRecipe) {
      document.querySelectorAll('#recipes-grid > div').forEach((element) => {
         element.addEventListener('click', onCategoryBtnRecipe);
      });
   }

   static init() {
      // Grid List View btns
      this.#gridViewBtn.classList.add('active');
      this.#listViewBtn.classList.remove('active');
      this.#gridViewBtn.addEventListener('click', () => {
         if (!this.#gridViewBtn.classList.contains('active')) {
            this.#toggleGridListView();
            this.#setToLocalStorageRecipeGride();
         }
      });
      this.#listViewBtn.addEventListener('click', () => {
         if (!this.#listViewBtn.classList.contains('active')) {
            this.#toggleGridListView();
            this.#setToLocalStorageRecipeGride();
         }
      });
   }
}
export class MealDetails {
   // att
   // * privet
   static #meal = '';
   static #nutritionFacts = '';
   static #foodLogFunction;
   // static #mealDetails = document.querySelector('#meal-details');
   static #backToMealsBtn = document.querySelector('#back-to-meals-btn');
   static #hero = document.querySelector('#meal-details > div > div:nth-child(2)');
   static #ingredientsSection = document.querySelector('#meal-details > div > div:nth-child(4) > div:nth-child(1) > div:nth-child(1)');
   static #instructionsSection = document.querySelector('#meal-details > div > div:nth-child(4) > div:nth-child(1) > div:nth-child(2)');
   static #videoSection = document.querySelector('#meal-details > div > div:nth-child(4) > div:nth-child(1) > div:nth-child(3)');

   static #sideContainer = document.querySelector('#meal-details > div > div:nth-child(4) > div:nth-child(2) > div');
   static #rightColumn = (element) => `#meal-details > div > div:nth-child(4) > div:nth-child(2) > div > div > div > ${element}`;
   static #caloriesSection = document.querySelector(this.#rightColumn('div:nth-child(2)'));
   static #factsSection = document.querySelector(this.#rightColumn('div:nth-child(3)'));
   static #otherSection = document.querySelector(this.#rightColumn('div:nth-child(4)'));

   // methods
   // * privet
   static #heroSection() {
      return `
                  <div class="relative h-80 md:h-96">
                     <img src="${this.#meal.thumbnail}" alt="${this.#meal.name}" class="w-full h-full object-cover" />
                     <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                     <div class="absolute bottom-0 left-0 right-0 p-8">
                        <div class="flex items-center gap-3 mb-3">
                           <span class="px-3 py-1 bg-emerald-500 text-white text-sm font-semibold rounded-full">${this.#meal.category}</span>
                           <span class="px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-full">${this.#meal.area}</span>
                           <span class="px-3 py-1 bg-purple-500 text-white text-sm font-semibold rounded-full ${this.#meal.tags?.length > 0 ? '' : 'hidden'}">${this.#meal.tags?.length > 0 ? this.#meal.tags[0] : ''}</span>
                        </div>
                        <h1 class="text-3xl md:text-4xl font-bold text-white mb-2">${this.#meal.name}</h1>
                        <div class="flex items-center gap-6 text-white/90">
                           <span class="flex items-center gap-2">
                              <i class="fa-solid fa-clock"></i>
                              <span>30 min</span>
                           </span>
                           <span class="flex items-center gap-2">
                              <i class="fa-solid fa-utensils"></i>
                              <span id="hero-servings">4 servings</span>
                           </span>
                           <span class="flex items-center gap-2">
                              <i class="fa-solid fa-fire"></i>
                              <span id="hero-calories">485 cal/serving</span>
                           </span>
                        </div>
                     </div>
                  </div>
   `;
   }
   static #ingredients() {
      let cartona = '';
      this.#meal.ingredients.forEach((element) => {
         cartona += `
            <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-emerald-50 transition-colors">
               <input type="checkbox" class="ingredient-checkbox w-5 h-5 text-emerald-600 rounded border-gray-300" />
               <span class="text-gray-700"> <span class="font-medium text-gray-900">${element['measure']}</span> ${element['ingredient']} </span>
            </div>
         `;
      });
      return `
                        <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                           <i class="fa-solid fa-list-check text-emerald-600"></i>
                           Ingredients
                           <span class="text-sm font-normal text-gray-500 ml-auto">${this.#meal.ingredients.length} items</span>
                        </h2>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                        ${cartona}
                        </div>
      `;
   }
   static #instructions() {
      let cartona = '';
      this.#meal.instructions.forEach((element, index) => {
         cartona += `
            <div class="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
               <div class="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">${index + 1}</div>
               <p class="text-gray-700 leading-relaxed pt-2">${element}</p>
            </div>
         `;
      });
      return `
                        <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                           <i class="fa-solid fa-shoe-prints text-emerald-600"></i>
                           Instructions
                        </h2>
                        <div class="space-y-4">
                           ${cartona}
                        </div>
      `;
   }
   static #getEmbedUrl(url) {
      if (!url) return '';

      if (url.includes('watch?v=')) {
         return url.replace('watch?v=', 'embed/');
      }

      if (url.includes('youtu.be/')) {
         return url.replace('youtu.be/', 'www.youtube.com/embed/');
      }

      if (url.includes('shorts/')) {
         return url.replace('shorts/', 'embed/');
      }

      return url;
   }
   static #video() {
      const embedUrl = this.#getEmbedUrl(this.#meal.youtube);
      return `
                        <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                           <i class="fa-solid fa-video text-red-500"></i>
                           Video Tutorial
                        </h2>
                        <div class="relative aspect-video rounded-xl overflow-hidden bg-gray-100">
                           <iframe
                              src="${embedUrl}"
                              class="absolute inset-0 w-full h-full"
                              frameborder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowfullscreen
                           >
                           </iframe>
                        </div>
      `;
   }
   static #source() {
      const tag = document.createElement('div');
      tag.classList.add('bg-white', 'rounded-2xl', 'shadow-lg', 'p-6');
      tag.innerHTML = `
            <h3 class="text-sm font-semibold text-gray-900 mb-2">Recipe Source</h3>
            <a href="${this.#meal.source}" target="_blank" class="text-emerald-600 hover:text-emerald-700 text-sm flex items-center gap-2">
               <i data-fa-i2svg="">
               <svg class="svg-inline--fa fa-arrow-up-right-from-square" data-prefix="fas" data-icon="arrow-up-right-from-square" role="img" viewBox="0 0 512 512" aria-hidden="true" data-fa-i2svg="">
                     <path
                        fill="currentColor"
                        d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0-201.4 201.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3 448 192c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 96C35.8 96 0 131.8 0 176L0 432c0 44.2 35.8 80 80 80l256 0c44.2 0 80-35.8 80-80l0-80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 80c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-256c0-8.8 7.2-16 16-16l80 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 96z"
                     ></path>
                  </svg>
               </i>
               View Original Recipe
            </a>
         `;
      return tag;
   }
   static #logThisMeal() {
      const cartona = `
            <div class="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
               <div class="flex items-center gap-4 mb-6">
                  <img src="${this.#meal.thumbnail}" alt="${this.#meal.name}" class="w-16 h-16 rounded-xl object-cover" />
                  <div>
                     <h3 class="text-xl font-bold text-gray-900">Log This Meal</h3>
                     <p class="text-gray-500 text-sm">${this.#meal.name}</p>
                  </div>
               </div>

               <div class="mb-6">
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Number of Servings</label>
                  <div class="flex items-center gap-3">
                     <button id="decrease-servings" class="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
                        <i class="text-gray-600" data-fa-i2svg=""
                           ><svg class="svg-inline--fa fa-minus" data-prefix="fas" data-icon="minus" role="img" viewBox="0 0 448 512" aria-hidden="true" data-fa-i2svg="">
                              <path fill="currentColor" d="M0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32z"></path></svg
                        ></i>
                     </button>
                     <input type="number" id="meal-servings" value="1" min="0.5" max="10" step="0.5" class="w-20 text-center text-xl font-bold border-2 border-gray-200 rounded-lg py-2" />
                     <button id="increase-servings" class="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
                        <i class="text-gray-600" data-fa-i2svg=""
                           ><svg class="svg-inline--fa fa-plus" data-prefix="fas" data-icon="plus" role="img" viewBox="0 0 448 512" aria-hidden="true" data-fa-i2svg="">
                              <path
                                 fill="currentColor"
                                 d="M256 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 160-160 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l160 0 0 160c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160 160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-160 0 0-160z"
                              ></path></svg
                        ></i>
                     </button>
                  </div>
               </div>

               <div class="bg-emerald-50 rounded-xl p-4 mb-6">
                  <p class="text-sm text-gray-600 mb-2">Estimated nutrition per serving:</p>
                  <div class="grid grid-cols-4 gap-2 text-center">
                     <div>
                        <p class="text-lg font-bold text-emerald-600" id="modal-calories">${this.#nutritionFacts.perServing.calories}</p>
                        <p class="text-xs text-gray-500">Calories</p>
                     </div>
                     <div>
                        <p class="text-lg font-bold text-blue-600" id="modal-protein">${this.#nutritionFacts.perServing.protein}g</p>
                        <p class="text-xs text-gray-500">Protein</p>
                     </div>
                     <div>
                        <p class="text-lg font-bold text-amber-600" id="modal-carbs">${this.#nutritionFacts.perServing.carbs}g</p>
                        <p class="text-xs text-gray-500">Carbs</p>
                     </div>
                     <div>
                        <p class="text-lg font-bold text-purple-600" id="modal-fat">${this.#nutritionFacts.perServing.fat}g</p>
                        <p class="text-xs text-gray-500">Fat</p>
                     </div>
                  </div>
               </div>

               <div class="flex gap-3">
                  <button id="cancel-log-meal" class="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all">Cancel</button>
                  <button id="confirm-log-meal" class="flex-1 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all">
                     <i class="mr-2" data-fa-i2svg=""
                        ><svg class="svg-inline--fa fa-clipboard-list" data-prefix="fas" data-icon="clipboard-list" role="img" viewBox="0 0 384 512" aria-hidden="true" data-fa-i2svg="">
                           <path
                              fill="currentColor"
                              d="M311.4 32l8.6 0c35.3 0 64 28.7 64 64l0 352c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 96C0 60.7 28.7 32 64 32l8.6 0C83.6 12.9 104.3 0 128 0L256 0c23.7 0 44.4 12.9 55.4 32zM248 112c13.3 0 24-10.7 24-24s-10.7-24-24-24L136 64c-13.3 0-24 10.7-24 24s10.7 24 24 24l112 0zM128 256a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm32 0c0 13.3 10.7 24 24 24l112 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-112 0c-13.3 0-24 10.7-24 24zm0 128c0 13.3 10.7 24 24 24l112 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-112 0c-13.3 0-24 10.7-24 24zM96 416a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"
                           ></path></svg
                     ></i>
                     Log Meal
                  </button>
               </div>
            </div>
      `;
      const logMeal = document.createElement('div');
      logMeal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
      logMeal.setAttribute('id', 'log-meal-modal');
      logMeal.innerHTML = cartona;
      return logMeal;
   }
   static #logThisMealActins() {
      const input = document.querySelector('#meal-servings');
      const add = document.querySelector('#increase-servings');
      const mines = document.querySelector('#decrease-servings');
      const cancel = document.querySelector('#cancel-log-meal');
      const confirm = document.querySelector('#confirm-log-meal');

      add.addEventListener('click', () => {
         if (input.value < 10) input.value = Number(input.value) + 0.5;
      });
      mines.addEventListener('click', () => {
         if (input.value > 0.5) input.value = Number(input.value) - 0.5;
      });
      cancel.addEventListener('click', () => {
         document.querySelectorAll('#log-meal-modal').forEach((el) => el.remove());
      });
      confirm.addEventListener('click', () => {
         const meal = {
            recipe: this.#meal,
            nutritionFacts: this.#nutritionFacts,
            numberOfServings: input.value,
         };
         document.querySelectorAll('#log-meal-modal').forEach((el) => el.remove());
         this.#foodLogFunction(meal);
      });
      document.querySelector('#log-meal-modal').addEventListener('click', (e) => {
         if (e.target === e.currentTarget) document.querySelectorAll('#log-meal-modal').forEach((el) => el.remove());
      });
   }
   //  Right Column - Nutrition
   static #renderSource() {
      const oldSource = this.#sideContainer.querySelector('.recipe-source');
      if (oldSource) oldSource.remove();
      if (this.#meal.source) {
         const source = this.#source();
         source.classList.add('recipe-source');
         this.#sideContainer.append(source);
      }
   }
   static #calories() {
      return `
                              <p class="text-sm text-gray-600">Calories per serving</p>
                              <p class="text-4xl font-bold text-emerald-600">${this.#nutritionFacts.perServing.calories}</p>
                              <p class="text-xs text-gray-500 mt-1">Total: ${this.#nutritionFacts.totals.calories} cal</p>
      `;
   }
   static #facts() {
      const colors = {
         protein: 'bg-emerald-500',
         carbs: 'bg-blue-500',
         fat: 'bg-purple-500',
         fiber: 'bg-orange-500',
         sugar: 'bg-pink-500',
         saturatedFat: 'bg-red-500',
      };
      const MACRO_CALORIES = {
         protein: 4,
         carbs: 4,
         fat: 9,
         fiber: 2,
         sugar: 4,
      };
      let cartona = '';
      Object.entries(this.#nutritionFacts.totals).forEach(([key, value]) => {
         if (key == 'calories' || key == 'sodium' || key == 'cholesterol') return ``;
         const grams = this.#nutritionFacts.perServing[key];
         const calPerGram = MACRO_CALORIES[key] || 0;
         const caloriesFromMacro = grams * calPerGram;
         const percent = Math.round((caloriesFromMacro / this.#nutritionFacts.perServing.calories) * 100);
         cartona += `
                              <div class="flex items-center justify-between">
                                 <div class="flex items-center gap-2">
                                    <div class="w-3 h-3 rounded-full ${colors[key]}"></div>
                                    <span class="text-gray-700">${key}</span>
                                 </div>
                                 <span class="font-bold text-gray-900">${this.#nutritionFacts.perServing[key]}g</span>
                              </div>
                              <div class="w-full bg-gray-100 rounded-full h-2">
                                 <div class="${colors[key]} h-2 rounded-full" style="width: ${percent < 100 ? percent : 100}%"></div>
                              </div>
         `;
      });
      return cartona;
   }
   static #other() {
      return `
                                 <h3 class="text-sm font-semibold text-gray-900 mb-3">Other</h3>
                                 <div class="grid grid-cols-2 gap-3 text-sm">
                                    <div class="flex justify-between">
                                       <span class="text-gray-600">Cholesterol</span>
                                       <span class="font-medium">${this.#nutritionFacts.perServing.cholesterol}mg</span>
                                    </div>
                                    <div class="flex justify-between">
                                       <span class="text-gray-600">Sodium</span>
                                       <span class="font-medium">${this.#nutritionFacts.perServing.sodium}mg</span>
                                    </div>
                                 </div>
      `;
   }

   static #initLogMeal() {
      const actionBtnSection = document.querySelector('#log-meal-btn');
      actionBtnSection.addEventListener('click', () => {
         if (!this.#meal) return;
         document.body.append(this.#logThisMeal());
         this.#logThisMealActins();
      });
   }

   // * public
   static getMealInfo(recipe, nutritionFacts, foodLog) {
      this.#meal = recipe;
      this.#nutritionFacts = nutritionFacts;
      this.#foodLogFunction = foodLog;
      this.#hero.innerHTML = this.#heroSection();
      this.#ingredientsSection.innerHTML = this.#ingredients();
      this.#instructionsSection.innerHTML = this.#instructions();
      if (!this.#meal.youtube) {
         this.#videoSection.classList.add('hidden');
      } else {
         this.#videoSection.classList.remove('hidden');
         this.#videoSection.innerHTML = this.#video();
      }
      this.#renderSource();
      this.#caloriesSection.innerHTML = this.#calories();
      this.#factsSection.innerHTML = this.#facts();
      this.#otherSection.innerHTML = this.#other();
      const actionBtnSection = document.querySelector('#log-meal-btn');
      actionBtnSection.setAttribute('data-meal-id', recipe.id);
   }
   static init() {
      this.#backToMealsBtn.addEventListener('click', () => {
         ViewManager.setSearchFilters();
         changUrl();
      });
      this.#initLogMeal();
   }
}
// ! Product Scanner
export class ProductScanner {
   // att
   // * privet
   static #searchInput = document.querySelector('#product-search-input');
   static #searchBtn = document.querySelector('#search-product-btn');
   static #barcodeInput = document.querySelector('#barcode-input');
   static #barcodeBtn = document.querySelector('#lookup-barcode-btn');
   static #nutriScoreFilterGridBtns = document.querySelectorAll('#nutri-score-filter-grid button');
   static #productCategories = document.querySelector('#product-categories');
   static #productsCount = document.querySelector('#products-count');
   static #productsGrid = document.querySelector('#products-grid');
   // methods
   // * privet
   static #productCategoriesBtns() {
      // Category Buttons
      const category = {
         breakfast_cereals: { categoryStyle: ' from-amber-500 to-orange-500', icon: 'fa-wheat-awn' },
         beverages: { categoryStyle: ' from-blue-500 to-cyan-500', icon: 'fa-bottle-water' },
         snacks: { categoryStyle: ' from-purple-500 to-pink-500', icon: 'fa-cookie' },
         dairy: { categoryStyle: ' from-sky-400 to-blue-500', icon: 'fa-cheese' },
         fruits: { categoryStyle: ' from-red-500 to-rose-500', icon: 'fa-apple-whole' },
         vegetables: { categoryStyle: ' from-green-500 to-emerald-500', icon: 'fa-carrot' },
         breads: { categoryStyle: ' from-amber-600 to-yellow-500', icon: 'fa-bread-slice' },
         meats: { categoryStyle: ' from-red-600 to-rose-600', icon: 'fa-drumstick-bite' },
         frozen_foods: { categoryStyle: ' from-cyan-500 to-blue-600', icon: 'fa-snowflake' },
         sauces: { categoryStyle: ' from-orange-500 to-red-500', icon: 'fa-jar' },
      };
      let cartona = '';
      Object.entries(category).forEach(([key, value]) => {
         cartona += `
            <button class="product-category-btn flex-shrink-0 px-5 py-3 bg-gradient-to-r text-white rounded-xl font-semibold hover:shadow-lg transition-all  ${value.categoryStyle}" data-category="${key}">
               <i class="fa-solid ${value.icon} mr-1.5"></i> ${String(key).replace('_', ' ')}
            </button>`;
      });
      this.#productCategories.innerHTML = cartona;
   }
   static #productsGridContainer(product) {
      // Products Grid
      const nutriScoreStyle = {
         unknown: 'bg-gray-400',
         a: 'bg-green-500',
         b: 'bg-lime-500',
         c: 'bg-yellow-500',
         d: 'bg-orange-500 ',
         e: 'bg-red-500',
      };
      const novaGroupStyle = {
         1: 'bg-green-500',
         2: 'bg-lime-500',
         3: 'bg-orange-500',
         4: 'bg-red-500',
      };
      return `
                     <div class="product-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group" data-barcode="${product.barcode}">
                        <div class="relative h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
                           <img
                              class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                              src="${product.image}"
                              alt="${product.name}"
                              loading="lazy"
                           />

                           <!-- Nutri-Score Badge -->
                           <div class="absolute top-2 left-2 ${nutriScoreStyle[product.nutritionGrade]} text-white text-xs font-bold px-2 py-1 rounded uppercase">Nutri-Score ${product.nutritionGrade}</div>

                           <!-- NOVA Badge -->
                           <div class="absolute top-2 right-2 ${novaGroupStyle[product.novaGroup]} text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center" title="NOVA ${product.novaGroup}">${product.novaGroup}</div>
                        </div>

                        <div class="p-4">
                           <p class="text-xs text-emerald-600 font-semibold mb-1 truncate">${product.brand}</p>
                           <h3 class="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">${product.name}</h3>

                           <div class="flex items-center gap-3 text-xs text-gray-500 mb-3">
                              <span><i class="fa-solid fa-fire mr-1"></i>${product.nutrients.calories} kcal/100g</span>
                           </div>

                           <!-- Mini Nutrition -->
                           <div class="grid grid-cols-4 gap-1 text-center">
                              <div class="bg-emerald-50 rounded p-1.5">
                                 <p class="text-xs font-bold text-emerald-700">${product.nutrients.protein}g</p>
                                 <p class="text-[10px] text-gray-500">Protein</p>
                              </div>
                              <div class="bg-blue-50 rounded p-1.5">
                                 <p class="text-xs font-bold text-blue-700">${product.nutrients.carbs}g</p>
                                 <p class="text-[10px] text-gray-500">Carbs</p>
                              </div>
                              <div class="bg-purple-50 rounded p-1.5">
                                 <p class="text-xs font-bold text-purple-700">${product.nutrients.fat}g</p>
                                 <p class="text-[10px] text-gray-500">Fat</p>
                              </div>
                              <div class="bg-orange-50 rounded p-1.5">
                                 <p class="text-xs font-bold text-orange-700">${product.nutrients.sugar}g</p>
                                 <p class="text-[10px] text-gray-500">Sugar</p>
                              </div>
                           </div>
                        </div>
                     </div>
      `;
   }
   static #logThisProductActins(productLog, product) {
      const cancelBtns = document.querySelectorAll('.close-product-modal');
      const confirmBtn = document.querySelector('button.add-product-to-log');
      const model = document.querySelector('#product-detail-modal');
      cancelBtns.forEach((btn) => {
         btn.addEventListener('click', () => {
            model.remove();
         });
      });
      confirmBtn.addEventListener('click', () => {
         productLog(product);
         this.#productConfirmAlert(product.result.name);
         model.remove();
      });
      model.addEventListener('click', (e) => {
         if (e.target === e.currentTarget) model.remove();
      });
   }
   static #productConfirmAlert(productName) {
      const element = document.createElement('div');
      element.id = 'productConfirmAlert';
      element.className = 'fixed bottom-4 right-4 bg-emerald-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 toast-notification';
      element.textContent = `${productName} logged to your daily intake! 📝`;
      document.body.append(element);
      setTimeout(() => {
         element.remove();
      }, 3500);
   }
   // * public
   static search(searchProductScanner) {
      this.#searchBtn.addEventListener('click', (e) => {
         searchProductScanner(e, this.#searchInput.value);
      });
      this.#barcodeBtn.addEventListener('click', (e) => {
         searchProductScanner(e, this.#barcodeInput.value);
      });
   }
   static productNotFoundInDatabase() {
      const element = document.createElement('div');
      element.id = 'productNotFoundInDatabase';
      element.className = 'fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 toast-notification';
      element.textContent = `Product not found in database`;
      document.body.append(element);
      setTimeout(() => {
         element.remove();
      }, 3500);
   }
   static initProductCategoriesBtns(onProductCategoriesBtn) {
      const btns = document.querySelectorAll('#product-categories button');
      btns.forEach((element) => {
         element.addEventListener('click', (e) => {
            onProductCategoriesBtn(e);
         });
      });
   }
   static initNutriScoreBtn(onNutriScoreBtn) {
      this.#nutriScoreFilterGridBtns.forEach((element) => {
         element.addEventListener('click', (e) => {
            onNutriScoreBtn(e);
         });
      });
   }
   static productsEmpty() {
      this.#productsCount.innerHTML = 'Search for products to see results';
      this.#productsGrid.innerHTML = `
   <div id="products-empty" class="col-span-full flex items-center justify-center py-12">
      <div class="text-center">
         <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="text-3xl text-gray-400" data-fa-i2svg="">
               <svg class="svg-inline--fa fa-box-open" data-prefix="fas" data-icon="box-open" role="img" viewBox="0 0 640 512" aria-hidden="true" data-fa-i2svg="">
                  <path
                     fill="currentColor"
                     d="M560.3 237.2c10.4 11.8 28.3 14.4 41.8 5.5 14.7-9.8 18.7-29.7 8.9-44.4l-48-72c-2.8-4.2-6.6-7.7-11.1-10.2L351.4 4.7c-19.3-10.7-42.8-10.7-62.2 0L88.8 116c-5.4 3-9.7 7.4-12.6 12.8L27.7 218.7c-12.6 23.4-3.8 52.5 19.6 65.1l33 17.7 0 53.3c0 23 12.4 44.3 32.4 55.7l176 99.7c19.6 11.1 43.5 11.1 63.1 0l176-99.7c20.1-11.4 32.4-32.6 32.4-55.7l0-117.5zm-240-9.8L170.2 144 320.3 60.6 470.4 144 320.3 227.4zm-41.5 50.2l-21.3 46.2-165.8-88.8 25.4-47.2 161.7 89.8z"
                  ></path>
               </svg>
            </i>
         </div>
         <p class="text-gray-500 text-lg mb-2">No products to display</p>
         <p class="text-gray-400 text-sm">Search for a product or browse by category</p>
      </div>
   </div>
   `;
   }
   static productsCountMassage(massage) {
      this.#productsCount.innerHTML = massage;
   }
   static setProducts(products) {
      let cartona = '';
      if (products.results?.length > 0) {
         for (let i = 0; i < products.results.length && i < 24; i++) {
            cartona += this.#productsGridContainer(products.results[i]);
         }
      } else cartona = this.#productsGridContainer(products.result);
      this.#productsGrid.innerHTML = cartona;
   }
   static inetProducts(onProductsClick) {
      const allProducts = document.querySelectorAll('#products-grid > .product-card');
      allProducts.forEach((element) => {
         element.addEventListener('click', (e) => {
            onProductsClick(e.currentTarget);
         });
      });
   }
   static productDetailModal(product) {
      const nutriScoreStyle = {
         unknown: ['bg-gray-400', '--color-gray-400', '--color-gray-100'],
         a: ['bg-green-500', '--color-green-500', '--color-green-100'],
         b: ['bg-lime-500', '--color-lime-500', '--color-lime-100'],
         c: ['bg-yellow-500', '--color-yellow-500', '--color-yellow-100'],
         d: ['bg-orange-500', '--color-orange-500', '--color-orange-100 '],
         e: ['bg-red-500', '--color-red-500', '--color-red-100'],
      };
      const novaGroupStyle = {
         1: ['bg-green-500', '--color-green-100', '--color-green-500'],
         2: ['bg-lime-500', '--color-lime-100', '--color-lime-500'],
         3: ['bg-orange-500', '--color-orange-100', '--color-orange-500'],
         4: ['bg-red-500', '--color-red-100', '--color-red-500'],
      };

      let cartona = '';
      let cartona2 = '';
      if (product) {
         product = product.result;
         cartona2 = `
                  <!-- Header -->
                  <div class="flex items-start gap-6 mb-6">
                     <div class="w-32 h-32 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                        <img src="${product.image}" alt="${product.name}" class="w-full h-full object-contain" />
                     </div>
                     <div class="flex-1">
                        <p class="text-sm text-emerald-600 font-semibold mb-1">${product.brand}</p>
                        <h2 class="text-2xl font-bold text-gray-900 mb-2">${product.name}</h2>

                        <div class="flex items-center gap-3">
                           <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg "  style="background-color: var(${nutriScoreStyle[product.nutritionGrade][2]})">
                              <span class="w-8 h-8 rounded flex items-center justify-center text-white font-bold uppercase ${nutriScoreStyle[product.nutritionGrade][0]}"> ${product.nutritionGrade} </span>
                              <div>
                                 <p class="text-xs font-bold "  style="color: var(${nutriScoreStyle[product.nutritionGrade][1]})">Nutri-Score</p>
                                 <p class="text-[10px] text-gray-600">${product.nutritionGrade === 'a' ? 'Excellent' : product.nutritionGrade === 'b' ? 'Good' : product.nutritionGrade === 'c' ? 'Average' : product.nutritionGrade === 'd' ? 'Poor' : 'Bad'}</p>
                              </div>
                           </div>

                           <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg "   style="background-color: var(${novaGroupStyle[product.novaGroup][1]})">
                              <span class="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${novaGroupStyle[product.novaGroup][0]}" > ${product.novaGroup} </span>
                              <div>
                                 <p class="text-xs font-bold " style="color: var(${novaGroupStyle[product.novaGroup][2]})" >NOVA</p>
                                 <p class="text-[10px] text-gray-600">${product.novaGroup == '1' ? 'Unprocessed' : product.novaGroup == '2' ? 'Processed Ingredients' : product.novaGroup == '3' ? 'Processed' : 'Ultra-processed'}</p>
                              </div>
                           </div>
                        </div>
                     </div>

                     <button class="close-product-modal text-gray-400 hover:text-gray-600">
                        <i class="text-2xl" data-fa-i2svg=""
                           ><svg class="svg-inline--fa fa-xmark" data-prefix="fas" data-icon="xmark" role="img" viewBox="0 0 384 512" aria-hidden="true" data-fa-i2svg="">
                              <path
                                 fill="currentColor"
                                 d="M55.1 73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L147.2 256 9.9 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192.5 301.3 329.9 438.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.8 256 375.1 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192.5 210.7 55.1 73.4z"
                              ></path></svg
                        ></i>
                     </button>
                  </div>

                  <!-- Nutrition Facts -->
                  <div class="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-5 mb-6 border border-emerald-200">
                     <h3 class="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <i class="text-emerald-600" data-fa-i2svg=""
                           ><svg class="svg-inline--fa fa-chart-pie" data-prefix="fas" data-icon="chart-pie" role="img" viewBox="0 0 576 512" aria-hidden="true" data-fa-i2svg="">
                              <path
                                 fill="currentColor"
                                 d="M512.4 240l-176 0c-17.7 0-32-14.3-32-32l0-176c0-17.7 14.4-32.2 31.9-29.9 107 14.2 191.8 99 206 206 2.3 17.5-12.2 31.9-29.9 31.9zM222.6 37.2c18.1-3.8 33.8 11 33.8 29.5l0 197.3c0 5.6 2 11 5.5 15.3L394 438.7c11.7 14.1 9.2 35.4-6.9 44.1-34.1 18.6-73.2 29.2-114.7 29.2-132.5 0-240-107.5-240-240 0-115.5 81.5-211.9 190.2-234.8zM477.8 288l64 0c18.5 0 33.3 15.7 29.5 33.8-10.2 48.4-35 91.4-69.6 124.2-12.3 11.7-31.6 9.2-42.4-3.9L374.9 340.4c-17.3-20.9-2.4-52.4 24.6-52.4l78.2 0z"
                              ></path></svg
                        ></i>
                        Nutrition Facts <span class="text-sm font-normal text-gray-500">(per 100g)</span>
                     </h3>

                     <div class="text-center mb-4 pb-4 border-b border-emerald-200">
                        <p class="text-4xl font-bold text-gray-900">${product.nutrients.calories}</p>
                        <p class="text-sm text-gray-500">Calories</p>
                     </div>

                     <div class="grid grid-cols-4 gap-4">
                        <div class="text-center">
                           <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
                              <div class="bg-emerald-500 h-2 rounded-full" style="width:${product.nutrients.protein}%"></div>
                           </div>
                           <p class="text-lg font-bold text-emerald-600">${product.nutrients.protein}g</p>
                           <p class="text-xs text-gray-500">Protein</p>
                        </div>

                        <div class="text-center">
                           <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
                              <div class="bg-blue-500 h-2 rounded-full" style="width:${product.nutrients.carbs}%"></div>
                           </div>
                           <p class="text-lg font-bold text-blue-600">${product.nutrients.carbs}g</p>
                           <p class="text-xs text-gray-500">Carbs</p>
                        </div>

                        <div class="text-center">
                           <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
                              <div class="bg-purple-500 h-2 rounded-full" style="width:${product.nutrients.fat}%"></div>
                           </div>
                           <p class="text-lg font-bold text-purple-600">${product.nutrients.fat}g</p>
                           <p class="text-xs text-gray-500">Fat</p>
                        </div>

                        <div class="text-center">
                           <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
                              <div class="bg-orange-500 h-2 rounded-full" style="width:${product.nutrients.sugar}%"></div>
                           </div>
                           <p class="text-lg font-bold text-orange-600">${product.nutrients.sugar}g</p>
                           <p class="text-xs text-gray-500">Sugar</p>
                        </div>
                     </div>
                     <div class="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-emerald-200">
                        <div class="text-center">
                           <p class="text-sm font-semibold text-gray-900">2.0g</p>
                           <p class="text-xs text-gray-500">Saturated Fat</p>
                        </div>
                        <div class="text-center">
                           <p class="text-sm font-semibold text-gray-900">10.0g</p>
                           <p class="text-xs text-gray-500">Fiber</p>
                        </div>
                        <div class="text-center">
                           <p class="text-sm font-semibold text-gray-900">0.00g</p>
                           <p class="text-xs text-gray-500">Salt</p>
                        </div>
                     </div>
                  </div>

                  <!-- Actions -->
                  <div class="flex gap-3">
                     <button class="add-product-to-log flex-1 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all" data-barcode="3168930010265">
                        <i class="mr-2" data-fa-i2svg=""
                           ><svg class="svg-inline--fa fa-plus" data-prefix="fas" data-icon="plus" role="img" viewBox="0 0 448 512" aria-hidden="true" data-fa-i2svg="">
                              <path
                                 fill="currentColor"
                                 d="M256 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 160-160 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l160 0 0 160c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160 160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-160 0 0-160z"
                              ></path></svg></i
                        >Log This Food
                     </button>
                     <button class="close-product-modal flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all">Close</button>
                  </div>
      `;
      }

      cartona = `
            <div class="bg-white rounded-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
               <div class="p-6">
                  ${product ? cartona2 : ''}
               </div>
            </div>
      `;

      const modal = document.createElement('div');
      modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
      modal.id = 'product-detail-modal';
      modal.innerHTML = cartona;
      return modal;
   }
   static getProductInfo(product, productLog) {
      document.querySelector('#product-detail-modal')?.remove();
      document.body.append(this.productDetailModal(product));
      this.#logThisProductActins(productLog, product);
   }

   static init() {
      this.#productCategoriesBtns();
      this.productsEmpty();
   }
}
// ! Food Log
export class FoodLog {
   // att
   // * privet
   static #foodlogDateIds = document.querySelector('#foodlog-date');
   // foodlog-today-section
   static #progressBarsIds = document.querySelector('#foodlog-today-section > div:nth-child(2)');
   static #loggedItemsNumberIds = document.querySelector('#foodlog-today-section > div:nth-child(3) h4');
   static #clearFoodlogBtnIds = document.querySelector('#clear-foodlog');
   static #loggedItemsListIds = document.querySelector('#logged-items-list');
   // weekly-chart
   static #weeklyChartIds = document.querySelector('#weekly-chart');
   // Quick Actions
   static #logMealBtnIds = document.querySelector('button:nth-child(1).quick-log-btn');
   static #scanProductBtnIds = document.querySelector('button:nth-child(2).quick-log-btn');
   static #weeklyAverageIds = document.querySelector('#weekly-average  p:nth-child(2)');

   // methods
   // * privet
   static #foodlogDate() {
      const date = new Date();
      const formattedDate = date.toLocaleDateString('en-US', {
         weekday: 'long',
         month: 'short',
         day: 'numeric',
      });
      this.#foodlogDateIds.textContent = formattedDate;
   }
   static #progressBarsHTML(total = { calories: 0, protein: 0, carbs: 0, fat: 0 }) {
      function color(number) {
         if (number < 100) return '';
         if (number >= 100) return `;background-color:oklch(63.7% .237 25.331)`;
      }

      this.#progressBarsIds.innerHTML = `
                     <!-- Calories Progress -->
                     <div class="bg-emerald-50 rounded-xl p-4">
                        <div class="flex flex-col justify-between mb-2">
                           <span class="text-sm font-semibold text-gray-700 text-left">Calories</span>
                           <span class="text-sm text-gray-500 text-right">${total.calories} / 2000kcal</span>
                        </div>

                        <div class="w-full bg-gray-200 rounded-full h-2.5 ">
                           <div class="bg-emerald-500 h-2.5 rounded-full" style="width: ${(total.calories / 2000) * 100 > 100 ? 100 : (total.calories / 2000) * 100}% ${color((total.calories / 2000) * 100)}"></div>
                        </div>
                     </div>
                     <!-- Protein Progress -->
                     <div class="bg-blue-50 rounded-xl p-4">
                        <div class="flex items-center justify-between mb-2">
                           <span class="text-sm font-semibold text-gray-700">Protein</span>
                           <span class="text-sm text-gray-500">${total.protein} / 50 g</span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2.5">
                           <div class="bg-blue-500 h-2.5 rounded-full" style="width: ${(total.protein / 50) * 100 > 100 ? 100 : (total.protein / 50) * 100}% ${color((total.protein / 50) * 100)}"></div>
                        </div>
                     </div>
                     <!-- Carbs Progress -->
                     <div class="bg-amber-50 rounded-xl p-4">
                        <div class="flex items-center justify-between mb-2">
                           <span class="text-sm font-semibold text-gray-700">Carbs</span>
                           <span class="text-sm text-gray-500">${total.carbs} / 250 g</span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2.5">
                           <div class="bg-amber-500 h-2.5 rounded-full" style="width: ${(total.carbs / 250) * 100 > 100 ? 100 : (total.carbs / 250) * 100}% ${color((total.carbs / 250) * 100)}"></div>
                        </div>
                     </div>
                     <!-- Fat Progress -->
                     <div class="bg-purple-50 rounded-xl p-4">
                        <div class="flex items-center justify-between mb-2">
                           <span class="text-sm font-semibold text-gray-700">Fat</span>
                           <span class="text-sm text-gray-500">${total.fat} / 65 g</span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2.5">
                           <div class="bg-purple-500 h-2.5 rounded-full" style="width: ${(total.fat / 65) * 100 > 100 ? 100 : (total.fat / 65) * 100}% ${color((total.fat / 65) * 100)}"></div>
                        </div>
                     </div>
      
      `;
   }
   static #loggedItemsListHTML(items) {
      if (items.length === 0) {
         this.#loggedItemsListIds.innerHTML = `
                  <div class="text-center py-12">
                     <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="text-3xl text-gray-300" data-fa-i2svg=""><svg class="svg-inline--fa fa-utensils" data-prefix="fas" data-icon="utensils" role="img" viewBox="0 0 512 512" aria-hidden="true" data-fa-i2svg=""><path fill="currentColor" d="M63.9 14.4C63.1 6.2 56.2 0 48 0s-15.1 6.2-16 14.3L17.9 149.7c-1.3 6-1.9 12.1-1.9 18.2 0 45.9 35.1 83.6 80 87.7L96 480c0 17.7 14.3 32 32 32s32-14.3 32-32l0-224.4c44.9-4.1 80-41.8 80-87.7 0-6.1-.6-12.2-1.9-18.2L223.9 14.3C223.1 6.2 216.2 0 208 0s-15.1 6.2-15.9 14.4L178.5 149.9c-.6 5.7-5.4 10.1-11.1 10.1-5.8 0-10.6-4.4-11.2-10.2L143.9 14.6C143.2 6.3 136.3 0 128 0s-15.2 6.3-15.9 14.6L99.8 149.8c-.5 5.8-5.4 10.2-11.2 10.2-5.8 0-10.6-4.4-11.1-10.1L63.9 14.4zM448 0C432 0 320 32 320 176l0 112c0 35.3 28.7 64 64 64l32 0 0 128c0 17.7 14.3 32 32 32s32-14.3 32-32l0-448c0-17.7-14.3-32-32-32z"></path></svg></i>
                     </div>
                     <p class="text-gray-500 font-medium mb-2">No food logged today</p>
                     <p class="text-gray-400 text-sm mb-4">Start tracking your nutrition by logging meals or scanning products</p>
                  </div>
      `;
         return;
      }

      let cartona = '';
      items.forEach((element, index) => {
         cartona += `<div class="flex items-center justify-between bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-all" data-id="${element.id}">
               <div class="flex items-center gap-4">
                  ${
                     element.image
                        ? `<img src="${element.image}" alt="${element.name}" class="w-14 h-14 rounded-xl object-cover">`
                        : `
                        <div class="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                           <i class="text-blue-600 text-xl" data-fa-i2svg="">
                              <svg class="svg-inline--fa fa-box" data-prefix="fas" data-icon="box" role="img" viewBox="0 0 448 512" aria-hidden="true" data-fa-i2svg="">
                                 <path
                                    fill="currentColor"
                                    d="M369.4 128l-34.3-48-222.1 0-34.3 48 290.7 0zM0 148.5c0-13.3 4.2-26.3 11.9-37.2L60.9 42.8C72.9 26 92.3 16 112.9 16l222.1 0c20.7 0 40.1 10 52.1 26.8l48.9 68.5c7.8 10.9 11.9 23.9 11.9 37.2L448 416c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 148.5z"
                                 ></path>
                              </svg>
                           </i>
                        </div>
                        `
                  }
                  <div>
                     <p class="font-semibold text-gray-900">${element.name}</p>
                     <p class="text-sm text-gray-500">
                        ${element.brandOrServe}
                        <span class="mx-1">•</span>
                        <span class="${element.type.toLocaleLowerCase() === 'Product'.toLocaleLowerCase() ? 'text-blue-600' : 'text-emerald-600'}">${element.type}</span>
                     </p>
                     <p class="text-xs text-gray-400 mt-1">${element.time}</p>
                  </div>
               </div>

               <div class="flex items-center gap-4">
                  <div class="text-right">
                     <p class="text-lg font-bold text-emerald-600">${element.perServing.calories}</p>
                     <p class="text-xs text-gray-500">kcal</p>
                  </div>
                  <div class="hidden md:flex gap-2 text-xs text-gray-500">
                     <span class="px-2 py-1 bg-blue-50 rounded">${element.perServing.protein}g P</span>
                     <span class="px-2 py-1 bg-amber-50 rounded">${element.perServing.carbs}g C</span>
                     <span class="px-2 py-1 bg-purple-50 rounded">${element.perServing.fat}g F</span>
                  </div>
                  <button class="remove-foodlog-item text-gray-400 hover:text-red-500 transition-all p-2" data-index="${index}">
                     <i data-fa-i2svg="">
                        <svg class="svg-inline--fa fa-trash-can" data-prefix="fas" data-icon="trash-can" role="img" viewBox="0 0 448 512" aria-hidden="true" data-fa-i2svg="">
                           <path
                              fill="currentColor"
                              d="M136.7 5.9C141.1-7.2 153.3-16 167.1-16l113.9 0c13.8 0 26 8.8 30.4 21.9L320 32 416 32c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 96C14.3 96 0 81.7 0 64S14.3 32 32 32l96 0 8.7-26.1zM32 144l384 0 0 304c0 35.3-28.7 64-64 64L96 512c-35.3 0-64-28.7-64-64l0-304zm88 64c-13.3 0-24 10.7-24 24l0 192c0 13.3 10.7 24 24 24s24-10.7 24-24l0-192c0-13.3-10.7-24-24-24zm104 0c-13.3 0-24 10.7-24 24l0 192c0 13.3 10.7 24 24 24s24-10.7 24-24l0-192c0-13.3-10.7-24-24-24zm104 0c-13.3 0-24 10.7-24 24l0 192c0 13.3 10.7 24 24 24s24-10.7 24-24l0-192c0-13.3-10.7-24-24-24z"
                           ></path>
                        </svg>
                     </i>
                  </button>
               </div>
            </div>`;
      });
      this.#loggedItemsListIds.innerHTML = cartona;
      this.#initDeleteItemFormList();
   }
   static #initDeleteItemFormList() {
      document.querySelectorAll('.remove-foodlog-item').forEach((btn) => {
         btn.addEventListener('click', (e) => {
            const target = e.currentTarget;

            this.updateFoodLog({ indexOfItem: +target.getAttribute('data-index') });
            const element = document.createElement('div');
            element.id = 'productNotFoundInDatabase';
            element.className = 'fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 toast-notification';
            element.textContent = `Product not found in database`;
            document.body.append(element);
            setTimeout(() => {
               element.remove();
            }, 3500);
         });
      });
   }
   static #weeklyChartHTML(weekData) {
      let cartona = '';
      weekData.forEach((week) => {
         cartona += `               
                     <div class="text-center  ${week.numberOfItems > 0 ? ` bg-indigo-100 rounded-xl p-1` : ''}">
                        <p class="text-xs text-gray-500 mb-1">${week.date.dayName}</p>
                        <p class="text-sm font-medium text-gray-900">${week.date.dayNumber}</p>
                        <div class="mt-2  ${week.numberOfItems > 0 ? `text-emerald-600` : 'text-gray-300'}">
                           <p class="text-lg font-bold">${week.calories}</p>
                           <p class="text-xs">kcal</p>
                        </div>
                        ${week.numberOfItems > 0 ? `<p class="text-xs text-gray-400 mt-1">${week.numberOfItems} items</p>` : ''}
                     </div>`;
      });
      this.#weeklyChartIds.innerHTML = cartona;
   }
   static #calcWeeklyAverageCalories(weekData) {
      let calc = 0;
      weekData.forEach((day) => {
         calc += day.calories;
      });
      return calc;
   }
   static #getStorWeaklyData() {
      let data = JSON.parse(localStorage.getItem('food-log'));
      if (data) return data;
      else return [];
   }
   static #storWeaklyData(data) {
      localStorage.setItem('food-log', JSON.stringify(data));
   }
   static #getTodayData() {
      let data = JSON.parse(localStorage.getItem('food-log-today'));
      const today = new Date();
      const dayName = today.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNumber = today.getDate().toString();
      if (data?.weekData.find((day) => day.date.dayName === dayName && day.date.dayNumber === dayNumber)) return data;
      else
         return {
            weekData: [...this.#getStorWeaklyData()],
            totalTodayServing: {
               calories: 0,
               protein: 0,
               carbs: 0,
               fat: 0,
            },
            todayElements: [],
         };
   }
   static #storTodayData(data) {
      localStorage.setItem('food-log-today', JSON.stringify(data));
   }
   static #filterData(newItem, type) {
      if (type.toLowerCase().includes('Product'.toLowerCase())) {
         return {
            id: newItem.recipe,
            type: 'Product',
            name: newItem.recipe.name,
            image: newItem.recipe.thumbnail,
            brandOrServe: newItem.numberOfServings + ' serving',
            time: new Date().toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit', hour12: true }),
            perServing: {
               calories: newItem.nutritionFacts.perServing.calories,
               protein: newItem.nutritionFacts.perServing.protein,
               carbs: newItem.nutritionFacts.perServing.carbs,
               fat: newItem.nutritionFacts.perServing.fat,
            },
         };
      } else if (type.toLowerCase().includes('Recipe'.toLowerCase())) {
         return {
            id: newItem.result.id,
            type: 'Recipe',
            name: newItem.result.name,
            image: null,
            brandOrServe: newItem.result.brand,
            time: new Date().toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit', hour12: true }),
            perServing: {
               calories: newItem.result.nutrients.calories,
               protein: newItem.result.nutrients.protein,
               carbs: newItem.result.nutrients.carbs,
               fat: newItem.result.nutrients.fat,
            },
         };
      }
   }
   static #calcTotalTodayServing(todayElements) {
      let totalCalories = 0;
      let totalCarbs = 0;
      let totalFat = 0;
      let totalProtein = 0;
      todayElements.forEach(({ perServing: { calories, protein, carbs, fat } }) => {
         totalCalories += calories;
         totalCarbs += protein;
         totalFat += carbs;
         totalProtein += fat;
      });

      return { calories: totalCalories, protein: totalCarbs, carbs: totalFat, fat: totalProtein };
   }
   static #updateWeekData(weekData, newCalories = 0, newNumberOfItems = 0) {
      const today = new Date();

      const dayName = today.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNumber = today.getDate().toString();

      const existingDay = weekData.find((day) => day.date.dayName === dayName && day.date.dayNumber === dayNumber);

      if (existingDay) {
         existingDay.calories = newCalories;
         existingDay.numberOfItems = newNumberOfItems;
      } else {
         const newDay = {
            date: {
               dayName,
               dayNumber,
            },
            calories: newCalories,
            numberOfItems: newNumberOfItems,
         };
         weekData.push(newDay);
      }

      while (weekData.length < 7) {
         const lastDay = weekData[0]?.date ? new Date(today.getTime() - weekData.length * 24 * 60 * 60 * 1000) : new Date();
         const dayNameOld = lastDay.toLocaleDateString('en-US', { weekday: 'short' });
         const dayNumberOld = lastDay.getDate().toString();

         weekData.unshift({
            date: {
               dayName: dayNameOld,
               dayNumber: dayNumberOld,
            },
            calories: 0,
            numberOfItems: 0,
         });
      }

      while (weekData.length > 7) {
         weekData.shift();
      }

      return weekData;
   }
   static #UI(allData) {
      this.#foodlogDate();
      this.#progressBarsHTML(allData.totalTodayServing);
      this.#loggedItemsNumberIds.textContent = `Logged Items (${allData.todayElements.length})`;
      if (allData.todayElements.length === 0) this.#clearFoodlogBtnIds.style.display = 'none';
      else this.#clearFoodlogBtnIds.style = '';
      this.#loggedItemsListHTML(allData.todayElements);
      this.#weeklyChartHTML(allData.weekData);
      this.#weeklyAverageIds.textContent = `${this.#calcWeeklyAverageCalories(allData.weekData)} kcal`;
   }
   static #deleteProduct(array, { indexOfItem = -1, deleteAll = false }) {
      if (indexOfItem === -1 && deleteAll === false) return array;
      if (deleteAll) return [];
      return array.filter((_, index) => index !== indexOfItem);
   }

   // * public
   static updateFoodLog({ newItem = null, typeOfItem = null, indexOfItem = -1, deleteAll = false } = {}) {
      let allData = this.#getTodayData();

      // delete
      allData.todayElements = this.#deleteProduct(allData.todayElements, { indexOfItem, deleteAll });

      // new item
      if (newItem) allData.todayElements.push(this.#filterData(newItem, typeOfItem));

      // update
      allData.totalTodayServing = this.#calcTotalTodayServing(allData.todayElements);
      allData.weekData = this.#updateWeekData(allData.weekData, allData.totalTodayServing.calories, allData.todayElements.length);

      // display
      this.#UI(allData);

      // update and stor to localStorage
      this.#storWeaklyData(allData.weekData);
      this.#storTodayData(allData);
   }
   static init() {
      this.#foodlogDate();
      this.#clearFoodlogBtnIds.addEventListener('click', () => {
         //   clear Logged Items
      });
      this.updateFoodLog();

      this.#logMealBtnIds.addEventListener('click', () => {
         ViewManager.getSection(0);
         SidebarLinks.setActiveLink(0);
      });
      this.#scanProductBtnIds.addEventListener('click', () => {
         ViewManager.getSection(1);
         SidebarLinks.setActiveLink(1);
      });

      this.#clearFoodlogBtnIds.addEventListener('click', () => {
         Swal.fire({
            title: "Clear Today's Log?",
            text: 'This will remove all logged food items for today.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, clear it!',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#d33',
         }).then((result) => {
            if (result.isConfirmed) {
               FoodLog.updateFoodLog({ deleteAll: true });
               Swal.fire({
                  title: 'Cleared!',
                  text: 'All items have been removed.',
                  icon: 'success',
                  timer: 1500,
                  timerProgressBar: true,
                  showConfirmButton: false,
               });
            }
         });
      });
   }
}
// ! First Run
export class FirstRun {
   // method
   // * public
   static init() {
      Sidebar.init();
      SidebarLinks.init();
      ViewManager.getSection('0');
      MealsRecipes.init();
      MealDetails.init();
      ProductScanner.init();
      FoodLog.init();
   }
}


