// Le formulaire et l'emplacement où afficher une erreur.
const loginForm = document.querySelector("#login form");
const loginError = document.querySelector("#login-error");

// Se déclenche à l'envoi du formulaire, par clic ou avec la touche Entrée.
loginForm.addEventListener("submit", async (event) => {
    // Empêche le rechargement pour que JavaScript puisse envoyer les identifiants à l'API.
    event.preventDefault();

    // Récupère ce que l'utilisateur a saisi.
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;

    // Envoie l'e-mail et le mot de passe à l'API de connexion.
    const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    });

    // Transforme la réponse de l'API en données JavaScript.
    const data = await response.json();
    if (response.ok) {
        // Mémorise le token, puis retourne sur la page d'accueil.
        localStorage.setItem("token", data.token);
        window.location.href = "./index.html";
    } else {
        // Affiche un message si les identifiants sont refusés.
        loginError.textContent = "E-mail ou mot de passe incorrect.";
    }
});
