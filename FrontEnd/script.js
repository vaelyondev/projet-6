// Éléments et données utilisés dans plusieurs fonctions

const gallery = document.querySelector(".gallery");
const filters = document.querySelector(".filters");

// Contient tous les projets récupérés depuis l'API.
let allWorks = [];

function displayWorks(worksToDisplay) {
    // Évite d'ajouter une nouvelle liste sous celle déjà affichée.
    gallery.innerHTML = "";
    worksToDisplay.forEach((work) => {
        const figure = document.createElement("figure");

        const image = document.createElement("img");
        image.src = work.imageUrl;
        image.alt = work.title;

        const caption = document.createElement("figcaption");
        caption.textContent = work.title;

        figure.appendChild(image);
        figure.appendChild(caption);
        gallery.appendChild(figure);
    });
}

async function getWorks() {
    // Récupère les projets, les mémorise, puis les affiche tous.
    const response = await fetch("http://localhost:5678/api/works");
    allWorks = await response.json();
    displayWorks(allWorks);
}
getWorks();

// Création dynamique des boutons de filtre

async function getFilters() {
    const response = await fetch("http://localhost:5678/api/categories");
    const categories = await response.json();

    const button = document.createElement("button");
    button.textContent = "Tous";
    filters.appendChild(button);
    button.addEventListener("click", () => {
        // Réaffiche la liste complète.
        displayWorks(allWorks);
    });

    categories.forEach((category) => {
        const button = document.createElement("button");
        button.textContent = category.name;
        // Associe au bouton l'id de la catégorie qu'il représente.
        button.dataset.categoryId = category.id;
        filters.appendChild(button);
        button.addEventListener("click", () => {
            // Garde uniquement les projets de la catégorie cliquée.
            const filteredWorks = allWorks.filter((work) => work.category.id === category.id);
            displayWorks(filteredWorks);
        });
    });
}
getFilters()

