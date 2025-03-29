let activeFilter = 0
let worksList = []
let categoriesList = []
const token = localStorage.getItem("token")

// Récupération des travaux depuis le back-end
async function fetchData() {
    const response = await fetch("http://localhost:5678/api/works")
    worksList = await response.json()
    displayWorks(worksList)
}

fetchData()

// Récupération des différentes catégories
async function fetchCategories() {
    const response = await fetch("http://localhost:5678/api/categories")
    categoriesList = await response.json()
    if (!token) {
        displayCategories(categoriesList)
    }
}

// Injection des projets de la galerie
const displayWorks = (works) => {
    const gallery = document.querySelector(".gallery")
    gallery.innerHTML = ""

    for (let i = 0; i < works.length; i++) {
    const figure = document.createElement("figure")
    const img = document.createElement("img")
    img.src = works[i].imageUrl
    img.alt = works[i].title
    const figcaption = document.createElement("figcaption")
    figcaption.innerHTML = works[i].title
    figure.appendChild(img)
    figure.appendChild(figcaption)
    gallery.appendChild(figure)
    }
}

fetchCategories()

// Création de la catégorie TOUS et tri des catégories
const displayCategories = (categories) => {
    categories.unshift({
        id: 0,
        name: "Tous",
    })

    const filtersContainers = document.querySelector(".filters")
    for (let i = 0; i < categories.length; i++) {
    const button = document.createElement("button")
    button.innerHTML = categories[i].name
    button.classList.add("category-button-" + i)

    if (categories[i].id === activeFilter) {
        button.className = "filter-button-active"
    } else {
        button.className = "filter-button"
    }

    filtersContainers.appendChild(button)

    // Ajout d'un écouteur d'événements à chaque nouveau bouton de filtre
    button.addEventListener("click", () => filterWorks(categories[i].id))
    }
}

// Fonction pour filtrer les travaux en fonction de la catégorie sélectionnée
const filterWorks = (categoryId) => {
    // Supprime tous les travaux actuellement affichés
    const gallery = document.querySelector(".gallery")
    gallery.innerHTML = ""

    const filteredWorks = 
        categoryId === 0
        ? worksList
        : worksList.filter((work) => work.categoryId === categoryId)

    displayWorks(filteredWorks)

    displayCategoryFilters(categoryId)
}

const displayCategoryFilters = (categoryId) => {
    const filters = document.querySelector(".filters")
    filters.innerHTML = ""  

    categoriesList.forEach((category, index) => {
        const button = document.createElement("button")
        button.textContent = category.name
        button.classList.add("category-button-" + index)

        button.classList.add(category.id === categoryId ? "filter-button-active" : "filter-button")

        button.addEventListener("click", () => filterWorks(category.id))

        filters.appendChild(button)
    })
}

// **********************************************************************************************
// **********************************************************************************************
// **********************************************************************************************

// Création de la fonction pour la fermeture de la modale
const modalContainer = document.querySelector(".modal-container")

const closeModal = () => {
    const modalContent = document.querySelector(".modal-content")

    // Cloner modalContent pour supprimer les événements attachés
    const newModalContent = modalContent.cloneNode(true)
    modalContent.parentNode.replaceChild(newModalContent, modalContent)

    document.querySelector(".modal-container").innerHTML = ""
}



    const modal = document.getElementById("myModal")
    const closeBtn = document.querySelector(".close")

// Création de la modale
const generateModal = () => {
    const modal = document.createElement("div")
    modal.className = "modal"
    modal.addEventListener("click", closeModal)
    const modalContent = document.createElement("div")
    modalContent.className = "modal-content"
    modalContent.addEventListener("click", (e) => e.stopPropagation())

    // Appelez la fonction pour générer le contenu de la modale dès le chargement de la page
    modal.appendChild(modalContent)
    modalContainer.appendChild(modal)
    generateFirstModalContent()
}

// **********************************************************************************************
// **********************************************************************************************
// **********************************************************************************************

// modificaton de la page index.html en fonction de la situation de connexion de l'utilisateur
if (token) {
    // Création de l'élément "p" après le h2 de l'id "Portfolio"
    const MesProjets = document.querySelector(".portfolio")
    if (MesProjets) {
        const h2Portfolio = MesProjets.querySelector("h2")

        if (h2Portfolio) {
            const nouvelIcone = document.createElement("i")
            nouvelIcone.className = "fa-regular fa-pen-to-square"
            h2Portfolio.insertAdjacentElement("afterend", nouvelIcone)

            const modifier = document.createElement("p")
            modifier.textContent = " modifier"
            nouvelIcone.insertAdjacentElement("afterend", modifier)
            nouvelIcone.addEventListener("click", generateModal)
            modifier.addEventListener("click", generateModal)
        }
    }

    //Ajout de la barre du mode édition
    const body = document.querySelector("body")
    body.style.paddingTop = "42px"
    const editionBar = document.createElement("div")
    body.appendChild(editionBar)
    editionBar.id = "editionBar"
    const editionMode = document.createElement("div")
    editionMode.classList.add("editionMode")
    editionMode.innerHTML = `<i class="fa-regular fa-pen-to-square"></i> <p>Mode édition</p>`
    editionMode.addEventListener("click", generateModal)
    editionBar.appendChild(editionMode)

    // Remplacement du texte "login" par "logout" et création d'une fonction déconnexion assignée à ce bouton
    const loginbouton = document.querySelector(".loginbouton")
    loginbouton.innerHTML = "logout"
    loginbouton.classList.add("logoutbouton")
    loginbouton.addEventListener("click", () => {
        event.preventDefault()
        localStorage.removeItem("token")
        window.location.href = "index.html"
    })

    // Création de la fonction pour la fermeture de la modale
    const modalContainer = document.querySelector(".modal-container")

    const closeModal = () => {
        modalContainer.innerHTML = ""
    }
}