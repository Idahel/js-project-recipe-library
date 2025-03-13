const recipesContainer = document.getElementById('recipes-container')
const dietFilter = document.getElementById('diet-filter')
const btnAscendingIngredients = document.getElementById('btn-ascending-ingredients')
const btnDescendingIngredients = document.getElementById('btn-descending-ingredients')
const btnDescending = document.getElementById('btn-descending')
const btnAscending = document.getElementById('btn-ascending')
const btnRandom = document.getElementById('btn-random')
const baseUrl = "https://api.spoonacular.com/recipes/random"
const apiKey = "110e75fc870c4091a4fd4bf706e6efc8"
const url = `${baseUrl}/?apiKey=${apiKey}&number=50`

let allRecipes = []

const fetchRecipes = () => {
    fetch (url)
    .then((response) => response.json ())
    .then ((data) => {
        console.log(data)
        allRecipes = data.recipes
        displayRecipes(allRecipes)

    })
    .catch(error => {
        console.error ('Error fetching data', error)
    })
}

const displayRecipes = (allRecipes) => {
    recipesContainer.innerHTML = ''

    allRecipes.forEach(recipe => {
        console.log(recipe)
        let ingredientListItems = ''
        recipe.extendedIngredients.forEach(ingredient => {
            ingredientListItems += `<li class="ingredients-li">${ingredient.name}</li>`
        })

    recipesContainer.innerHTML += `<div class="recipe-card" id="${recipe.id}">
        <img src="${recipe.image}" alt="${recipe.title}" class="recipe-img">
        <h2>${recipe.title}</h2>
        <hr>
        <p class="time-info"><span class="bold">Time:</span> ${recipe.readyInMinutes} minutes</p>
        <hr>
        <div class ="ingredient-list">
        <button class="ingredient-btn" onclick="toggleIngredients('ingredients-${recipe.id}')">Ingredients</button>
        <ul id="ingredients-${recipe.id}" class="hidden-ingredients">${ingredientListItems}</ul>
        </div>
        <button class="instructions-btn" onclick="showInstructions(${recipe.id})">Show Instructions</button>
    </div>`
})
}

function toggleIngredients(ingredientsId) {
    const ingredientsList = document.getElementById(ingredientsId);
    if (ingredientsList.style.display === 'none' || ingredientsList.style.display === '') {
        ingredientsList.style.display = 'block';
    } else {
        ingredientsList.style.display = 'none';
    }
}

const showInstructions = (recipeId) => {
    const recipe = allRecipes.find(r => r.id === recipeId)

    if (recipe) {
        const recipeCard = document.getElementById(recipeId)

        if (recipe.instructions) {
            recipeCard.innerHTML = `<h3>Instructions:</h3><p>${recipe.instructions}</p>
            <button onclick="displayRecipes(allRecipes)">Back</button>`
        } else {
            recipeCard.innerHTML = `<p>Instructions not available.</p>
            <button onclick="displayRecipes(allRecipes)">Back</button>`
        }
    }
}

const filterRecipesByDiet = (diet) => {
    let filteredRecipes
    if (diet === '') {
        filteredRecipes = allRecipes
    } else if (diet === 'vegetarian') {
        filteredRecipes = allRecipes.filter(recipe => recipe.vegetarian === true)
    } else if (diet === 'vegan') {
        filteredRecipes = allRecipes.filter(recipe => recipe.vegan === true)
    }

    if (filteredRecipes.length === 0) {
        recipesContainer.innerHTML = `<p>No recipes found. Try another filter.</p>`;
    } else {
        return filteredRecipes;
    }
}

const sortOnIngredients = (recipes, order) => {
    let sortedRecipesIngredients = [...recipes]

    sortedRecipesIngredients.sort ((a, b) => {
        if (order === 'asc') {
            return a.extendedIngredients.length - b.extendedIngredients.length
        } else {
            return b.extendedIngredients.length - a.extendedIngredients.length
        }
    })

    displayRecipes(sortedRecipesIngredients)
}


const sortOnTime = (recipes, order) => {
    let sortedRecipesTime = [...recipes]
    sortedRecipesTime.sort((a, b) => {
        if (order === 'asc') {
            return a.readyInMinutes - b.readyInMinutes
        } else {
            return b.readyInMinutes - a.readyInMinutes
        }
    })
    displayRecipes(sortedRecipesTime)
}


const showRandomRecipe = () => {
    if(allRecipes.length === 0) return
    const randomIndex = Math.floor(Math.random() * allRecipes.length)
    const randomRecipe = allRecipes[randomIndex]
    displayRecipes([randomRecipe])
}

dietFilter.addEventListener('change', () => {
    const diet = dietFilter.value
    const filteredRecipes = filterRecipesByDiet(diet)
    if (filteredRecipes) {
        displayRecipes (filteredRecipes)
    }
})

btnAscendingIngredients.addEventListener('click', () => {
    const diet = dietFilter.value
    const filteredRecipes = filterRecipesByDiet (diet)
    if (filteredRecipes) {
        sortOnIngredients(filteredRecipes, 'asc')
    }
})

btnDescendingIngredients.addEventListener('click', () => {
    const diet = dietFilter.value
    const filteredRecipes = filterRecipesByDiet (diet)
    if (filteredRecipes) {
        sortOnIngredients(filteredRecipes, 'desc')
    }
})

btnAscending.addEventListener('click', () => {
    const diet = dietFilter.value;
    const filteredRecipes = filterRecipesByDiet(diet);
    if(filteredRecipes){
        sortOnTime(filteredRecipes, 'asc');
    }
})

btnDescending.addEventListener('click', () => {
    const diet = dietFilter.value;
    const filteredRecipes = filterRecipesByDiet(diet);
    if(filteredRecipes){
        sortOnTime(filteredRecipes, 'desc');
    }
})

btnRandom.addEventListener('click', showRandomRecipe)

fetchRecipes()