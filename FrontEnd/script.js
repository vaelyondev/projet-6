// Partie 1 : Récupération des travaux depuis l'API et affichage dans la galerie

const gallery = document.querySelector(".gallery");
console.log(gallery);

async function getWorks() {
    const response = await fetch("http://localhost:5678/api/works");
    const works = await response.json();

    works.forEach((work) => {
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
getWorks();

// Partie 2 : Gestion de l'affichage des catégories et filtrage des travaux

const filters = document.querySelector(".filters");

async function getFilters() {
    const response = await fetch("http://localhost:5678/api/categories");
    const categories = await response.json();

    console.log(categories);

    const button = document.createElement("button");
    button.textContent = "Tous";
    filters.appendChild(button);

    categories.forEach((category) => {
        const button = document.createElement("button");
        button.textContent = category.name;
        filters.appendChild(button);
    });
}
getFilters()
