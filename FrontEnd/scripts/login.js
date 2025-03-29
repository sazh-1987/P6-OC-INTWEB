// Sélecteurs
const emailInput = document.querySelector("[name=email]")
const passwordInput = document.querySelector("[name=password]")
const messageErreur = document.querySelector(".error-msg")
const formLogin = document.querySelector(".log-in-button")

// Vérifier si l'utilisateur est déjà connecté
const redirigerSiConnecte = () => {
  const token = localStorage.getItem("token")
  if (token) {
    window.location.href = "index.html"
  }
}

// Récupérer les valeurs des champs email et mot de passe
const obtenirDonneesConnexion = () => {
  return {
    email: emailInput.value,
    password: passwordInput.value
  }
}

// Afficher un message d'erreur dans la page
const afficherMessageErreur = (message) => {
  messageErreur.textContent = message
}

// Effacer les champs de formulaire
const effacerChampsFormulaire = () => {
  emailInput.value = ""
  passwordInput.value = ""
}

// Valider les champs de formulaire
const validerChampsFormulaire = () => {
  const email = emailInput.value
  const password = passwordInput.value

  if (!email || !password) {
    afficherMessageErreur("Veuillez remplir tous les champs.")
    return false
  }

  return true
}

// Gérer la soumission du formulaire
const gererSoumissionFormulaire = async (event) => {
  event.preventDefault()

  // Validation des champs avant soumission
  if (!validerChampsFormulaire()) return

  const donneesConnexion = obtenirDonneesConnexion()

  try {
    const reponse = await authentifierUtilisateur(donneesConnexion)

    if (reponse.ok) {
      const donnees = await reponse.json()
      stockerToken(donnees.token)
      window.location.href = "index.html"
    } else {
      afficherMessageErreur("Erreur dans l’identifiant ou le mot de passe")
    }
  } catch (error) {
    console.error("Une erreur est survenue", error)
    afficherMessageErreur("Une erreur est survenue, veuillez réessayer.")
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
  formLogin.addEventListener("click", gererSoumissionFormulaire)
}

// Lancer l'initialisation du script
initialiser()
