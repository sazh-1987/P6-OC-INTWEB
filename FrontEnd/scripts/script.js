let listeWorks = []

// fonction asynchrone pour récupérer les travaux depuis le back-end
async function fetchData() {
    const reponse = await fetch("http://localhost:5678/api/works")
    listeWorks = await reponse.json()
    afficherWorks(listeWorks)
}

fetchData()

// récupération dynamique des photos via l'API
const afficherWorks = (works) => {
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

 