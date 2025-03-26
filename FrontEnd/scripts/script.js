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

// Injection des projets de la gallerie
const displayWorks = (works) => {
    const gallery = document.querySelector(".gallery")

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

// Récupération des différentes catégories
async function fetchCategories() {
    const response = await fetch("http://localhost:5678/api/categories")
    categoriesList = await response.json()
    if (!token) {
        displayCategories(categoriesList)
    }
}

fetchCategories()

// Création de la catégorie TOUS et tri des catégories
const displayCategories = (categories) => {
    categories.push({
        id: 0,
        name: "Tous",
    })
    categories.sort((a, b) => a.id - b.id)
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

  // Filtre les travaux en fonction de la catégorie sélectionnée
    const filteredWorks =
    categoryId === 0
    ? worksList
    : worksList.filter((work) => work.categoryId === categoryId)

    const filters = document.querySelector(".filters")
    filters.innerHTML = ""

    for (let i = 0; i < categoriesList.length; i++) {
        const button = document.createElement("button")
        button.innerHTML = categoriesList[i].name
        button.classList.add("category-button-" + i)

        if (categoriesList[i].id === categoryId) {
            button.className = "filter-button-active"
        } else {
            button.className = "filter-button"
        }
        filters.appendChild(button)

    // Ajout d'un écouteur d'événements à chaque nouveau bouton de filtre
    button.addEventListener("click", () => filterWorks(categoriesList[i].id))
    }
    // Affiche les travaux filtrés
    displayWorks(filteredWorks)
}

// ***** // ***** // ***** // ***** // ***** // ***** // ***** // ***** // ***** // ***** 

// Création de la fonction pour la fermeture de la modale
const modalContainer = document.querySelector(".modal-container")
const closeModal = () => {
    modalContainer.innerHTML = ""
}




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

// Création de la foncion en situation de connexion de l'utilisateur
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
        }
    }

    //Ajout de la barre du mode édition
    const body = document.querySelector("body")
    body.style.paddingTop = "40px"
    const editionBar = document.createElement("div")
    body.appendChild(editionBar)
    editionBar.id = "editionBar"
    const editionMode = document.createElement("div")
    editionMode.classList.add("editionMode")
    editionMode.innerHTML = `<i class="fa-regular fa-pen-to-square"></i> <p>Mode édition</p>`
    editionBar.appendChild(editionMode)

    // Remplacement du texte "login" par "logout" et création d'une fonction déconnexion assignée à ce bouton
    const loginbouton = document.querySelector(".loginbouton")
    loginbouton.innerHTML = ""
    loginbouton.innerHTML = "logout"
    loginbouton.classList.add("logoutbouton")
    loginbouton.addEventListener("click", () => {
        localStorage.removeItem("token")
        loginbouton.innerHTML = ""
        const a = document.createElement("a")
        a.href = "./scripts/login.html"
        const li = document.createElement("li")
        li.innerHTML = "login"
        a.appendChild(li)
        loginbouton.appendChild(a)
        window.location.href = "index.html"
    })

    // Suppression de la barre d'édition et son contenu
    loginbouton.addEventListener("click", () => {
        const editionBar = document.getElementById("editionBar")
        if (editionBar) {
        editionBar.remove()
        }
        const editionMode = document.querySelector("editionMode")
        if (editionMode) {
        editionMode.remove()
        }
    })

    const modal = document.getElementById("myModal")
    const closeBtn = document.querySelector(".close")
}

// ** // ** // ** // ** // ** // **  // ** //

// Création de la 1ère modale
const generateFirstModalContent = () => {
    const modalContent = document.querySelector(".modal-content")
    modalContent.innerHTML = ""
    const close = document.createElement("span")
    close.innerHTML = "&times"
    close.className = "close"
    modalContent.appendChild(close);
    const h2 = document.createElement("h2")
    h2.innerHTML = "Galerie photo"
    modalContent.appendChild(h2)
    const line = document.createElement("div")
    line.className = "modal-line"
    modalContent.appendChild(line)

    // Injection des projets de la gallerie
    const imageContainer = document.createElement("div")
    imageContainer.className = "image-container"

    for (let i = 0; i < worksList.length; i++) {
        const figure = document.createElement("figure")
        const img = document.createElement("img")
        img.src = worksList[i].imageUrl
        figure.className = "modal-figure"
        figure.appendChild(img)
        imageContainer.appendChild(figure)

        // Création de l'icône de suppression de projet(s)
        const carreNoir = document.createElement("div")
        carreNoir.className = "carre-noir"
        figure.appendChild(carreNoir)
        const trashIcone = document.createElement("i")
        trashIcone.className = "fa-solid fa-trash-can"
        carreNoir.appendChild(trashIcone)

        // Création de la fonction de suppression de projet(s)
        async function deleteWorks(Id) {
            try {
                const deletefetch = await fetch(`http://localhost:5678/api/works/${Id}`,
                {
                    method: "DELETE",
                    headers: {
                    accept: "*/*",
                    Authorization: `Bearer ${token}`,
                    },
                })

                if (deletefetch.ok) {
                    await fetchData()
                    generateFirstModalContent()
                } else {
                console.error("Une erreur s'est produite lors de la suppression de l'image.")
                }
            } catch (error) {}
        }

        // Ajout d'un gestionnaire d'événements pour la suppression de projet(s)
        trashIcone.addEventListener("click", () => {
        // Suppression du parent de l'icône de la galerie à savoir la figure
        deleteWorks(worksList[i].id)
        })
    }

    close.addEventListener("click", closeModal)
    modalContent.appendChild(imageContainer)

    // Création du bouton "Ajouter Photo" qui mène à la 2nd modale
    const boutonAjoutProjet = document.createElement("button")
    boutonAjoutProjet.innerHTML = "Ajouter une photo"
    boutonAjoutProjet.addEventListener("click", generateSecondModal)
    modalContent.appendChild(boutonAjoutProjet)
}

// Création de la 2nd modale
const generateSecondModal = () => {
    const modalContent = document.querySelector(".modal-content")
    modalContent.innerHTML = ""
    const banniereBtn = document.createElement("div")
    banniereBtn.className = "banniere-modal2"
    modalContent.appendChild(banniereBtn)
    const boutonPrécédent = document.createElement("span")
    const arrowPrevious = document.createElement("i")
    arrowPrevious.className = "fa-solid fa-arrow-left"
    boutonPrécédent.appendChild(arrowPrevious)
    banniereBtn.appendChild(boutonPrécédent)
    const close = document.createElement("span")
    close.innerHTML = "&times"
    close.className = "close"
    banniereBtn.appendChild(close)
    close.addEventListener("click", closeModal)
    boutonPrécédent.addEventListener("click", generateFirstModalContent)
    const h2 = document.createElement("h2")
    h2.innerHTML = "Ajout photo"
    h2.className = "h2-modal2"
    modalContent.appendChild(h2);
    const line = document.createElement("div")
    line.className = "modal-line"
    modalContent.appendChild(line)

    const inputPhoto = document.createElement("input")
    inputPhoto.setAttribute("type", "file")
    inputPhoto.setAttribute("id", "inputAjoutPhoto")
    inputPhoto.name = "add-image"
    inputPhoto.className = "display-none"

    const imageAjouterPhoto = document.createElement("label")
    imageAjouterPhoto.className = "image-ajouter-photo"
    imageAjouterPhoto.htmlFor = "inputAjoutPhoto"
    modalContent.appendChild(imageAjouterPhoto)
    const iconeImage = document.createElement("i")
    iconeImage.className = "fa-regular fa-image"
    imageAjouterPhoto.appendChild(iconeImage)

    // Création du bouton "+ Ajouter une photo" de la 2nd modale
    const labelAjoutPhoto = document.createElement("div")
    labelAjoutPhoto.textContent = "+ Ajouter une photo"
    labelAjoutPhoto.setAttribute("for", "inputAjoutPhoto")
    labelAjoutPhoto.classList.add("bouton-ajout-photo")
    imageAjouterPhoto.appendChild(labelAjoutPhoto)

    const image = document.createElement("img")
    image.src = ""
    image.className = "add-image display-none"
    imageAjouterPhoto.appendChild(image)

    // Création de la fonction de l'ajout de projet(s)
    inputPhoto.addEventListener("change", function (event) {
        const fichier = event.target.files[0]
        if (fichier) {
        console.log("Nouvelle photo sélectionnée :", fichier.name)
        }
    })

    modalContent.appendChild(inputPhoto)
    const formatsAcceptes = document.createElement("p")
    formatsAcceptes.textContent = "jpg, png : 4mo max"
    imageAjouterPhoto.appendChild(formatsAcceptes)

    inputPhoto.onchange = (evt) => {
        const [file] = inputPhoto.files
        if (file) {
            /*Condition pour accepter que les images inférieur à 4mo et refuser les documents d'autres types que jpeg et png */

            if (
                file.type !== "image/jpeg" &&
                file.type !== "image/png" &&
                file.type !== "image/jpg"
            ) {
                alert("Le fichier n'est pas du type jpeg ou png")
            } else if (file.size > 4100000) {
                alert("La photo est supérieur à 4 mo")
            } else {
                iconeImage.className = "display-none"
                labelAjoutPhoto.className = "display-none"
                formatsAcceptes.className = "display-none"
                image.src = URL.createObjectURL(file)
                image.className = "add-image display-block"
                boutonValider.style.backgroundColor = "#1D6154"
            }
        }
    }

    const divFormulaireModal = document.createElement("div")
    divFormulaireModal.className = "div-formulaire-modal"
    modalContent.appendChild(divFormulaireModal)
    const formulaireModal = document.createElement("form")
    formulaireModal.action = "post"
    const labelTitle = document.createElement("label")
    labelTitle.for = "title"
    labelTitle.innerHTML = `Titre`
    const inputTitle = document.createElement("input")
    inputTitle.type = "text"
    inputTitle.id = "titre"
    inputTitle.name = "titre"
    inputTitle.className = "inputTitle"
    formulaireModal.appendChild(labelTitle)
    formulaireModal.appendChild(inputTitle)

    const labelCategory = document.createElement("label")
    labelCategory.for = "categorie"
    labelCategory.innerHTML = `Catégorie`
    const categorySelect = document.createElement("select")
    categorySelect.id = "modalCategorie"
    categorySelect.name = "categorie"

    // Récupération des différentes catégories depuis le back-end pour le formulaire de la 2nd modale
    for (let i = 0; i < categoriesList.length; i++) {
        const option = document.createElement("option")
        option.value = categoriesList[i].id
        option.innerHTML = categoriesList[i].name
        categorySelect.appendChild(option)
        console.log(categoriesList[i].name)
    }
    formulaireModal.appendChild(labelCategory)
    formulaireModal.appendChild(categorySelect)

    divFormulaireModal.appendChild(formulaireModal)

    // Création de la fonction de vérification des conditions requises à l'ajout d'un nouveau projet dans la gallerie
    const addwork = () => {
        const formData = new FormData()
        if (inputPhoto.files[0]) {
            formData.append("image", inputPhoto.files[0])
        } else {
            return alert("Une image est requise pour ajouter un travail")
        }

        if (inputTitle.value) {
            formData.append("title", inputTitle.value)
        } else {
            return alert("Un titre est requis pour ajouter un travail")
        }

        if (categorySelect.value) {
            formData.append("category", categorySelect.value)
        } else {
            return alert("Une catégorie est requise pour ajouter un travail")
        }

        fetch(`http://localhost:5678/api/works`, {
            method: "POST",
            headers: {
            accept: "*/*",
            Authorization: `Bearer ${token}`,
        },
            body: formData,
        }).then(async (res) => {
            if (res.ok) {
                await fetchData()
                generateSecondModal()
            }
        })
    }

    const boutonValider = document.createElement("button")
    boutonValider.textContent = "Valider"
    boutonValider.addEventListener("click", addwork)
    imageAjouterPhoto.appendChild(boutonValider)
}