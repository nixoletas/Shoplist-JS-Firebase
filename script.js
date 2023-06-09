console.log(`%c  

         888
         888        
.d8888b  88888b.  88888888 88888b.  
88K      888 "88b 88888888 888 "88b 
"Y8888b. 888  888 88    88 888  888
     X88 888  888 88888888 888 d88P 
888888P' 888  888 88888888 88888P"  
                           888      
                           888      
                            `, "font-family:monospace; color: orange;");

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

inputFieldEl.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    addItem();
  }
});

deleteAllButton.addEventListener("click", function() {
    
    remove(shoppingListInDB);   
    clearInputEl()
    inputFieldEl.focus();
})

addButtonEl.addEventListener("click", addItem);

function addItem() {
    let inputValue = inputFieldEl.value.trim()

    if (inputValue === "") {
        inputFieldEl.classList.add("error")
        inputFieldEl.placeholder = "Digite algo..."

        setTimeout(() => {
            inputFieldEl.classList.remove("error")
        }, 10);

    } else {
        push(shoppingListInDB, inputValue)
    
        clearInputEl();
        inputFieldEl.focus();
    }
}
const loadingList = document.getElementById("loading-list");
onValue(shoppingListInDB, function(snapshot) {  
      
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())
        loadingList.style.display = "none";
        shoppingListEl.innerHTML = ""
        
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            
            appendItemToShoppingListEl(currentItem)
        } 
    } else {
        loadingList.style.display = "none";
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
