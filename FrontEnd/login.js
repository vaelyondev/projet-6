const loginForm = document.querySelector("#login form");
const loginError = document.querySelector("#login-error");

// Se déclenche à l'envoi du formulaire, par clic ou avec la touche Entrée.
loginForm.addEventListener("submit", async (event) => {
    // Empêche le rechargement pour que JavaScript puisse envoyer les identifiants à l'API.
    event.preventDefault();
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    if (response.ok) {
        localStorage.setItem("token", data.token);
        window.location.href = "./index.html";
    } else {
        loginError.textContent = "E-mail ou mot de passe incorrect.";
    }
});
