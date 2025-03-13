let listeWorks = []
let listeCategories = []

// Fonction asynchrone pour récupérer les travaux depuis le back-end
async function fetchData() {
    const response = await fetch("http://localhost:5678/api/works")
    listeWorks = await response.json()
    afficherWorks(listeWorks)
}

// Fonction asynchrone pour récupérer les catégories depuis le back-end
async function fetchCategories() {
    const response = await fetch("http://localhost:5678/api/categories")
    listeCategories = await response.json()
    afficherCategories(listeCategories)
}

// Fonction pour afficher les travaux dans la galerie
const afficherWorks = (works) => {
    const gallery = document.querySelector(".gallery")
    gallery.innerHTML = ""

    works.forEach(work => {
        const figure = document.createElement("figure")
        const img = document.createElement("img")
        img.src = work.imageUrl
        img.alt = work.title

        const figcaption = document.createElement("figcaption")
        figcaption.textContent = work.title

        figure.appendChild(img)
        figure.appendChild(figcaption)
        gallery.appendChild(figure)
    })
}

// Fonction pour afficher les catégories dans les filtres
const afficherCategories = (categories) => {
    categories.unshift({
        id: 0,
        name: "Tous",
    })

    const filters = document.querySelector(".filters")
    if (!filters) return

    filters.innerHTML = ""

    let activeButton = null

    categories.forEach(category => {
        const button = document.createElement("button")
        button.textContent = category.name

        if (category.id === 0) {
            button.classList.add("button-active")
            activeButton = button
        }

        button.addEventListener("click", () => {
            if (activeButton) {
                activeButton.classList.remove("button-active")
            }
            button.classList.add("button-active")
            activeButton = button

            if (category.id === 0) {
                afficherWorks(listeWorks)
            } else {
                const filtrerWorks = listeWorks.filter(work => work.categoryId === category.id)
                afficherWorks(filtrerWorks)
            }
        })

        filters.appendChild(button)
    })
}

fetchData()
fetchCategories()
// fin étape 1.1 et 1.2 du projet