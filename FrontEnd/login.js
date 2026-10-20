// Etape 5.2
// Le formulaire et l'emplacement où afficher une erreur.
const loginForm = document.querySelector("#login form");
const loginError = document.querySelector("#login-error");

// Se déclenche à l'envoi du formulaire, par clic ou avec la touche Entrée.
loginForm.addEventListener("submit", async (event) => {
    // Empêche le rechargement pour que JavaScript puisse envoyer les identifiants à l'API.
    event.preventDefault();
    loginError.textContent = "";
    const submitButton = loginForm.querySelector('[type="submit"]');
    if (submitButton.disabled) return;
    submitButton.disabled = true;

    // Récupère ce que l'utilisateur a saisi.
    const email = document.querySelector("#email").value.trim();
    const password = document.querySelector("#password").value;

    // Envoie l'e-mail et le mot de passe à l'API de connexion.
    try {
        const response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            // Transforme la réponse de l'API en données JavaScript.
            const data = await response.json();
            if (!data.token) throw new Error("Token manquant");
            // Mémorise le token, puis retourne sur la page d'accueil.
            localStorage.setItem("token", data.token);
            window.location.href = "./index.html";
        } else {
            // Affiche un message si les identifiants sont refusés.
            loginError.textContent = [401, 404].includes(response.status)
                ? "E-mail ou mot de passe incorrect."
                : "Le serveur rencontre un problème. Réessayez plus tard.";
        }
    } catch (error) {
        loginError.textContent = "Impossible de terminer la connexion. Vérifiez que le serveur est disponible.";
    } finally {
        submitButton.disabled = false;
    }
});
