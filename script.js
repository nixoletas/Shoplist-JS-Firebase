import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://playground-47213-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")

const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")
const deleteAllButton = document.getElementById("delete-all")

deleteAllButton.addEventListener("click", function() {
    
    remove(shoppingListInDB);
    
    clearInputEl()
})

addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value.trim()

    if (inputValue === "") {
        inputFieldEl.classList.add("error")
        inputFieldEl.placeholder = "Digite algo..."

        setTimeout(() => {
            inputFieldEl.classList.remove("error")
        }, 250);

    } else {
        push(shoppingListInDB, inputValue)
    
        clearInputEl()   
    }
})

onValue(shoppingListInDB, function(snapshot) {    
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())
    
        shoppingListEl.innerHTML = ""
        
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            
            appendItemToShoppingListEl(currentItem)
        } 
    } else {
        shoppingListEl.innerHTML = "Nenhum item na lista... ainda"
    }
})

function clearInputEl() {
    inputFieldEl.value = ""
}

function appendItemToShoppingListEl(item) {
    let itemID = item[0]
    let itemValue = item[1]
    
    let newEl = document.createElement("li")
    
    newEl.textContent = itemValue

    newEl.addEventListener("click", function() {
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)
        
        remove(exactLocationOfItemInDB)
    })
    
    shoppingListEl.append(newEl)
}