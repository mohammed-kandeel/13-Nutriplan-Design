// !  --- API ---

// !variables
let retryCounters = {}; //  URL,  current try
const maxTry = 6;
// ! method
function shouldStop(counter) {
   return counter >= maxTry;
}
// ! Meals Recipes
export class MealsRecipes {
   // att
   // * privet
   static #baseUrl = 'https://nutriplan-api.vercel.app/api/meals/';
   static #allAreas = 'areas';
   static #categories = 'categories';
   static #randomMeals = 'random?count=25';
   static #search = (input) => `search?q=${input}&page=1&limit=25`;
   static #area = (area) => `filter?area=${area}&page=1&limit=25`;
   static #category = (type) => `filter?category=${type}&page=1&limit=25`;
   static #ingredient = (type) => `filter?ingredient=${type}&page=1&limit=25`;

   // methods
   // * privet
   static async #fetchWithRetry(url) {
      if (!retryCounters[url]) {
         retryCounters[url] = 0;
      }
      if (shouldStop(retryCounters[url])) {
         retryCounters[url] = 0;
         console.warn(`Max retries reached for ${url}`);
         return null;
      }
      retryCounters[url]++;
      try {
         const response = await fetch(url);
         if (!response.ok) return this.#fetchWithRetry(url);
         const data = await response.json();
         retryCounters[url] = 0;
         return data;
      } catch (error) {
         return this.#fetchWithRetry(url);
      }
   }

   // * public
   static async getAllAreas() {
      return (await this.#fetchWithRetry(this.#baseUrl + this.#allAreas))?.results;
   }
   static async getCategories() {
      return (await this.#fetchWithRetry(this.#baseUrl + this.#categories))?.results;
   }
   static async getRandomMeals() {
      return (await this.#fetchWithRetry(this.#baseUrl + this.#randomMeals))?.results;
   }
   static async getMealById(id) {
      return (await this.#fetchWithRetry(this.#baseUrl + String(id)))?.result;
   }
   static async searchForMeals(input) {
      return (await this.#fetchWithRetry(this.#baseUrl + this.#search(input)))?.results;
   }
   static async getMealsByArea(area) {
      return (await this.#fetchWithRetry(this.#baseUrl + this.#area(area)))?.results;
   }
   static async getCategory(type) {
      return (await this.#fetchWithRetry(this.#baseUrl + this.#category(type)))?.results;
   }
   static async getIngredient(type) {
      return (await this.#fetchWithRetry(this.#baseUrl + this.#ingredient(type))).results;
   }
}
// ! Nutrition Facts
export class NutritionFacts {
   // att
   // * privet
   static #baseUrl = 'https://nutriplan-api.vercel.app';
   static #apiKey = 'vVmSOH1ZEpAb3xkdMzphgr6hKW9SRa85SU0VeLQF';
   static #analyzeRecipe = '/api/nutrition/analyze';
   static #searchFoods = (foodName) => `/api/nutrition/search?q=${foodName}&page=1&limit=24`;
   static #mealById = (id) => `/api/nutrition/food/${id}`;

   // methods
   // * privet
   static async #fetchWithRetry(url, options) {
      if (!retryCounters[url]) {
         retryCounters[url] = 0;
      }
      if (shouldStop(retryCounters[url])) {
         retryCounters[url] = 0;
         console.warn(`Max retries reached for ${url}`);
         return null;
      }
      retryCounters[url]++;
      try {
         const response = await fetch(url, {
            headers: {
               'x-api-key': this.#apiKey,
            },
            ...(options || {}),
         });

         if (!response.ok) return this.#fetchWithRetry(url);
         const data = await response.json();
         retryCounters[url] = 0;
         return data;
      } catch (error) {
         return this.#fetchWithRetry(url);
      }
   }
   static #convertObjectToArray(object) {
      return object.map((obj) => {
         return obj.measure + ' ' + obj.ingredient;
      });
   }

   // * public
   static async getSearchFoods(foodName) {
      return (await this.#fetchWithRetry(this.#baseUrl + this.#searchFoods(String(foodName))))?.results;
   }
   static async getFoodById(id) {
      return (await this.#fetchWithRetry(this.#baseUrl + this.#mealById(String(id))))?.result;
   }
   static async analyzeMeal(mealName, object) {
      const options = {
         method: 'POST',
         headers: {
            'x-api-key': this.#apiKey,
            'Content-Type': 'application/json',
         },
         body: JSON.stringify({
            title: mealName,
            ingredients: this.#convertObjectToArray(object),
         }),
      };
      return (await this.#fetchWithRetry(this.#baseUrl + this.#analyzeRecipe, options))?.data;
   }
}
// ! Product Scanner
export class ProductScanner {
   // att
   // * privet
   static #baseUrl = 'https://nutriplan-api.vercel.app/api/products/';
   static #categories = 'categories';
   static #category = (category) => `category/${category}`;
   static #barcode = (barcode) => `barcode/${barcode}`;
   static #search = (input) => `search?q=${input}`;

   // methods
   // * privet
   static async #fetch(url) {
      try {
         const response = await fetch(url);
         if (!response.ok) {
            console.warn(`Max retries reached for ${url}`);
            return null;
         }
         const data = await response.json();
         return data;
      } catch (error) {
         console.warn(`Max retries reached for ${url}`);
         return null;
      }
   }

   // * public
   static async getAllCategories() {
      return await this.#fetch(this.#baseUrl + this.#categories);
   }
   static async searchForCategory(category) {
      return await this.#fetch(this.#baseUrl + this.#category(category));
   }
   static async getProductByBarcode(barcode) {
      return await this.#fetch(this.#baseUrl + this.#barcode(barcode));
   }
   static async searchForProduct(input) {
      return await this.#fetch(this.#baseUrl + this.#search(input) + '&page=1&limit=24');
   }
   static async FilterByNutriScore(value, typeProses = 'category', nutriScoreFilter = 'all', totalPages = 10) {
      if (nutriScoreFilter === 'all' || nutriScoreFilter === '') {
         if (typeProses === 'category') return await this.searchForCategory(value);
         else if (typeProses === 'search') return await this.searchForProduct(value);
      }

      const urls = [];
      for (let page = 1; page <= totalPages; page++) {
         if (typeProses === 'category') urls.push(`${this.#baseUrl}${this.#category(value)}?page=${page}&limit=100`);
         else if (typeProses === 'search') urls.push(`${this.#baseUrl}${this.#search(value)}&page=${page}&limit=100`);
      }

      const promises = urls.map((url) => this.#fetch(url));
      const pagesData = await Promise.all(promises);

      const allFiltered = [];
      pagesData.forEach((data) => {
         if (data && data.results) {
            const filtered = data.results.filter((item) => item.nutritionGrade === nutriScoreFilter);
            allFiltered.push(...filtered);
         }
      });

      if (allFiltered.length === 0) return null;

      return {
         pagination: {
            total: allFiltered.length,
         },
         results: allFiltered,
      };
   }
}
