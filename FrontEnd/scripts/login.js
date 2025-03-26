// Vérifier si l'utilisateur est déjà connecté 
const redirigerSiConnecte = () => {
    const token = localStorage.getItem("token")
    if (token) {
      window.location.href = "../index.html"
    }
  }
  
  // Récupérer les valeurs des champs email et mot de passe
  const obtenirDonneesConnexion = () => {
    return {
      email: document.querySelector("[name=email]").value,
      password: document.querySelector("[name=password]").value
    }
  }
  
  // Afficher un message d'erreur dans la page
  const afficherMessageErreur = (message) => {
    const messageErreur = document.querySelector(".error-msg")
    messageErreur.textContent = message
  }
  
  // Effacer les champs de formulaire
  const effacerChampsFormulaire = () => {
    document.querySelector("#email").value = ""
    document.querySelector("#password").value = ""
  }
  
  // Gérer la soumission du formulaire
  const gererSoumissionFormulaire = async (event) => {
    event.preventDefault()
    
    const donneesConnexion = obtenirDonneesConnexion()
    console.log(donneesConnexion)
  
    try {
      const reponse = await authentifierUtilisateur(donneesConnexion)
      if (reponse.ok) {
        const donnees = await reponse.json()
        stockerToken(donnees.token)
        window.location.href = "../index.html"
      } else {
        afficherMessageErreur("Erreur dans l’identifiant ou le mot de passe")
      }
    } catch (error) {
      console.error("Une erreur est survenue", error)
    } finally {
      effacerChampsFormulaire()
    }
  }
  
  // Authentifier l'utilisateur via l'API
  const authentifierUtilisateur = async (donneesConnexion) => {
    const payload = JSON.stringify(donneesConnexion)
    return await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: payload
    })
  }
  
  // Stocker le token dans le localStorage
  const stockerToken = (token) => {
    localStorage.setItem("token", token)
  }
  
  // Initialisation
  const initialiser = () => {
    redirigerSiConnecte()
    
    const formLogin = document.querySelector(".log-in-button")
    formLogin.addEventListener("click", gererSoumissionFormulaire)
  }
  
  // Lancer l'initialisation du script
  initialiser()
  