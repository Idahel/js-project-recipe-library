const recipesContainer = document.getElementById('recipes-container')
const dietFilter = document.getElementById('diet-filter')
const btnAscendingIngredients = document.getElementById('btn-ascending-ingredients')
const btnDescendingIngredients = document.getElementById('btn-descending-ingredients')
const btnDescending = document.getElementById('btn-descending')
const btnAscending = document.getElementById('btn-ascending')
const btnRandom = document.getElementById('btn-random')

const baseUrl = "https://api.spoonacular.com/recipes/random"
const apiKey = "110e75fc870c4091a4fd4bf706e6efc8"
const numRecipes = 50;
const url = `${baseUrl}?apiKey=${apiKey}&number=${numRecipes}`

let allRecipes = []
let currentRecipes = []
let lastSortAction = null;

const displayError = (message) => {
    recipesContainer.innerHTML = `<p class="error-message">${message}</p>`
}

const createRecipeCard = (recipe) => {
    const ingredientListItems = recipe.extendedIngredients
    .map(ingredient => `<li>${ingredient.original}</li>`)
    .join('')
    return `
        <div class="recipe-card" id="${recipe.id}">
        <img src="${recipe.image}" alt="${recipe.title}" class="recipe-img">
        <h2>${recipe.title}</h2>
        <hr>
        <p class="time-info"><span class="bold">Time:</span> ${recipe.readyInMinutes} minutes</p>
        <hr>
        <div class="card-buttons">
        <div class ="ingredient-list">
        <button class="ingredient-btn" onclick="toggleIngredients('ingredients-${recipe.id}')">Ingredients</button>
        <ul id="ingredients-${recipe.id}" class="hidden-ingredients">${ingredientListItems}</ul>
        </div>
        <button class="instructions-btn" onclick="showInstructions(${recipe.id})">Show Instructions</button>
        </div>
    </div>`
}

const displayRecipes = (recipes) => {
    recipesContainer.innerHTML = recipes.map(createRecipeCard).join('') 
}

const toggleIngredients = (ingredientsId) => {
    const ingredientsList = document.getElementById(ingredientsId);
    if (ingredientsList.style.display === 'none' || ingredientsList.style.display === '') {
        ingredientsList.style.display = 'block';
    } else {
        ingredientsList.style.display = 'none';
    }
}

const showInstructions = (recipeId) => {
    const recipe = allRecipes.find(r => r.id === recipeId)

    if (!recipe) {
        displayError('Instructions not found. Please try again.')
        return
    }
    const recipeCard = document.getElementById(recipeId)
    const backButton = `<button class="button" onclick="displayRecipes(currentRecipes)">Back</button>`

    if (recipe.instructions) {
            recipeCard.innerHTML = `<h3>Instructions:</h3><p>${recipe.instructions}</p>${backButton}`
    } else {
            recipeCard.innerHTML = `<p>Instructions not available.</p>${backButton}`
    }
}

const filterRecipesByDiet = (diet) => {
 if (!diet) {
     return allRecipes
 }
 return allRecipes.filter(recipe => recipe[diet] === true)
}

const sortRecipes = (recipes, key, order = 'asc') => {
    if (!recipes || recipes.length === 0) {
        return []
    }
    const sortedRecipes = [...recipes]

    sortedRecipes.sort((a, b) => {
        const valueA = key === 'extendedIngredients' ? a[key].length : a[key]
        const valueB = key === 'extendedIngredients' ? b[key].length : b[key]

        if (order === 'asc') {
            return valueA - valueB
        } else {
            return valueB - valueA
        }
    })
    return sortedRecipes
}

const applyFilterAndSort = () => {
    const diet = dietFilter.value
    const filteredRecipes = filterRecipesByDiet(diet)

    if (filteredRecipes.length === 0) {
        displayError('No recipes found matching the selected diet. Please try again.')
        currentRecipes = []
        return
    }

    if (lastSortAction === 'ingredients-asc') {
        filteredRecipes = sortRecipes(filteredRecipes, 'extendedIngredients', 'asc')
    } else if (lastSortAction === 'ingredients-desc') {
        filteredRecipes = sortRecipes(filteredRecipes, 'extendedIngredients', 'desc')
    } else if (lastSortAction === 'time-asc') {
        filteredRecipes = sortRecipes(filteredRecipes, 'readyInMinutes', 'asc')
    } else if (lastSortAction === 'time-desc') {
        filteredRecipes = sortRecipes(filteredRecipes, 'readyInMinutes', 'desc')
    }
    currentRecipes = filteredRecipes
    displayRecipes(currentRecipes)
}

// const sortOnIngredients = (recipes, order) => {
//     let sortedRecipesIngredients = [...recipes]

//     sortedRecipesIngredients.sort ((a, b) => {
//         if (order === 'asc') {
//             return a.extendedIngredients.length - b.extendedIngredients.length
//         } else {
//             return b.extendedIngredients.length - a.extendedIngredients.length
//         }
//     })

//     displayRecipes(sortedRecipesIngredients)
// }


// const sortOnTime = (recipes, order) => {
//     let sortedRecipesTime = [...recipes]
//     sortedRecipesTime.sort((a, b) => {
//         if (order === 'asc') {
//             return a.readyInMinutes - b.readyInMinutes
//         } else {
//             return b.readyInMinutes - a.readyInMinutes
//         }
//     })
//     displayRecipes(sortedRecipesTime)
// }


const showRandomRecipe = () => {
    if(allRecipes.length === 0){
        displayError('No recipes found. Please try again.')
        return
    }
    const randomIndex = Math.floor(Math.random() * allRecipes.length)
    const randomRecipe = allRecipes[randomIndex]
    currentRecipes = [randomRecipe]
    displayRecipes(currentRecipes)
}

dietFilter.addEventListener('change', applyFilterAndSort)

btnAscendingIngredients.addEventListener('click', () => {
    lastSortAction = 'ingredients-asc'
    applyFilterAndSort()
})

btnDescendingIngredients.addEventListener('click', () => {
    lastSortAction = 'ingredients-desc'
    applyFilterAndSort()
})

btnAscending.addEventListener('click', () => {
    lastSortAction = 'time-asc'
    applyFilterAndSort()
})

btnDescending.addEventListener('click', () => {
    lastSortAction = 'time-desc'
    applyFilterAndSort()
})

btnRandom.addEventListener('click', showRandomRecipe)

const fetchRecipes = () => {
    fetch (url)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${error.message}`)
        }
        return response.json()
    })
    .then ((data) => {
        allRecipes = data.recipes
        currentRecipes = data.recipes
        displayRecipes(currentRecipes)

    })
    .catch(error => {
        displayError (`Error fetching data: ${error.message}`)
    })
}

fetchRecipes()