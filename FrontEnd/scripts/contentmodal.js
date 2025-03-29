// fonction pour la modale

const appendCloseButton = (modalContent, arrowColor, action) => {
    const banniereBtn = document.createElement("div")
    banniereBtn.className = "banniere-modal2"
    modalContent.appendChild(banniereBtn)

    const boutonPrécédent = document.createElement("span")
    const arrowPrevious = document.createElement("i")
    arrowPrevious.style.color = arrowColor  // Utilise la couleur définie par l'argument
    arrowPrevious.className = "fa-solid fa-arrow-left"
    boutonPrécédent.appendChild(arrowPrevious)
    banniereBtn.appendChild(boutonPrécédent)

    const close = document.createElement("span")
    close.innerHTML = "&times"
    close.className = "close"
    close.addEventListener("click", closeModal) // Ajoute l'événement pour fermer la modale
    banniereBtn.appendChild(close)

    // Ajouter ou retirer l'eventListener selon l'action choisie
    if (action === 'add') {
        boutonPrécédent.addEventListener("click", generateFirstModalContent)
    } else if (action === 'remove') {
        boutonPrécédent.removeEventListener("click", generateFirstModalContent)
    }
}

const appendTitle = (titleText) => {
    const h2 = document.createElement("h2")
    h2.innerHTML = titleText
    document.querySelector(".modal-content").appendChild(h2)
}

const appendModalLine = (modalContent) => {
    const line = document.createElement("div")
    line.className = "modal-line"
    modalContent.appendChild(line)
}

const createAddPhotoButton = (buttonText) => {
    const boutonAjoutProjet = document.createElement("button")
    boutonAjoutProjet.innerHTML = buttonText

    const divbutton = document.createElement("div")
    divbutton.classList.add("divbutton")
    divbutton.appendChild(boutonAjoutProjet)

    document.querySelector(".modal-content").appendChild(divbutton)

    return boutonAjoutProjet
}

const createImageContainer = () => {
    const imageContainer = document.createElement("div")
    imageContainer.className = "image-container"
    document.querySelector(".modal-content").appendChild(imageContainer)
    return imageContainer
}

// **********************************************************************************************
// **********************************************************************************************
// **********************************************************************************************


// Création de la 1ère modale
const generateFirstModalContent = () => {
    
    const modalContent = document.querySelector(".modal-content")
    modalContent.innerHTML = ""

    appendCloseButton(modalContent, "#FFFFFF", "remove")

    appendTitle("Galerie photo")


    // Injection des projets de la gallerie

    const imageContainer = createImageContainer()
    
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

    appendModalLine(modalContent)

    const boutonAjoutProjet = createAddPhotoButton("Ajouter une photo")

    boutonAjoutProjet.addEventListener("click", generateSecondModal)
}

// **********************************************************************************************
// **********************************************************************************************
// **********************************************************************************************

// Création de la 2nd modale
const generateSecondModal = () => {
    const modalContent = document.querySelector(".modal-content")
    modalContent.innerHTML = ""

    appendCloseButton(modalContent, "#000000", "add")

    appendTitle("Ajout photo")

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
            if (
                file.type !== "image/jpeg" &&
                file.type !== "image/png" &&
                file.type !== "image/jpg"
            ) {
                textError = "Le fichier n'est pas du type jpeg ou png"
                errorP.textContent = textError
            } else if (file.size > 4100000) {
                textError = "La photo est supérieure à 4 Mo"
                errorP.textContent = textError
            } else {
                iconeImage.className = "display-none"
                labelAjoutPhoto.className = "display-none"
                formatsAcceptes.className = "display-none"
                image.src = URL.createObjectURL(file)
                image.className = "add-image display-block"
                boutonValider.style.backgroundColor = "#1D6154"
                boutonValider.disabled = false
                textError = "" // Réinitialiser l'erreur si tout est OK
                errorP.textContent = textError
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
    }
    formulaireModal.appendChild(labelCategory)
    formulaireModal.appendChild(categorySelect)

    divFormulaireModal.appendChild(formulaireModal)

    // Création de la fonction de vérification des conditions requises à l'ajout d'un nouveau projet dans la gallerie
    let textError = "" // Déclaration de la variable pour stocker le message d'erreur

    // Création de la fonction de vérification des conditions requises à l'ajout d'un nouveau projet
    const addwork = () => {
        const formData = new FormData()

        if (inputPhoto.files[0]) {
            formData.append("image", inputPhoto.files[0])
        } else {
            textError = "Une image est requise pour ajouter un travail"
            errorP.textContent = textError
            return
        }

        if (inputTitle.value) {
            formData.append("title", inputTitle.value)
        } else {
            textError = "Un titre est requis pour ajouter un travail"
            errorP.textContent = textError
            return
        }

        if (categorySelect.value) {
            formData.append("category", categorySelect.value)
        } else {
            textError = "Une catégorie est requise pour ajouter un travail"
            errorP.textContent = textError
            return
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
                textError = "" // Réinitialise l'erreur si tout est OK
                errorP.textContent = textError
            }
        })
    }

    // Ajout du message d'erreur sous le bouton
    const errorP = document.createElement("p")
    errorP.style.textAlign = "center"
    errorP.style.paddingTop = "20px"
    errorP.style.color = "red" 
    modalContent.insertAdjacentElement("beforeend", errorP)

    // Création du bouton "Valider"
    appendModalLine(modalContent)
    const boutonValider = createAddPhotoButton("Valider")
    boutonValider.addEventListener("click", addwork)
    boutonValider.style.backgroundColor = "#A7A7A7"
}
