const token = localStorage.getItem("token")
if (token) {
  window.location.href = "../index.html"
}

const formLogin = document.querySelector(".login-connexion") // Sélection du formulaire

formLogin.addEventListener("submit", async function (event) { 
  event.preventDefault()

  const identify = {
    email: document.querySelector("#email").value,
    password: document.querySelector("#password").value,
  };

  console.log(identify)

  const chargeUtile = JSON.stringify(identify)

  try {
    const reponse = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: chargeUtile,
    })

    if (reponse.ok) {
      const data = await reponse.json()
      localStorage.setItem("token", data.token)
      window.location.href = "../index.html"
    } else {
      document.querySelector(".error-msg").textContent = "Erreur dans l’identifiant ou le mot de passe";
    }

    // Réinitialiser les champs du formulaire
    try {
      document.querySelector("#email").value = ""
      document.querySelector("#password").value = ""
    } catch (e) {
      console.log("Impossible de réinitialiser les champs :", e)
    }
  } catch (error) {
    console.log("Une erreur est survenue", error)
  }
})
