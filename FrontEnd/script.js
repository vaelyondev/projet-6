const gallery = document.querySelector(".gallery");
const filters = document.querySelector(".filters");

const loginLink = document.querySelector("#login-link")
const editMode = document.querySelector("#edit-mode")
const editProjects = document.querySelector("#edit-projects")

const modal = document.querySelector("#modal")
const modalClose = document.querySelector(".modal-close")
const modalGallery = document.querySelector(".modal-gallery")
const modalGalleryView = document.querySelector(".modal-gallery-view")
const modalAddView = document.querySelector(".modal-add-view")
const addPhotoButton = document.querySelector("#add-photo-button")
const backToGallery = document.querySelector("#back-to-gallery")
const imageInput = document.querySelector("#image")
const imagePreview = document.querySelector("#image-preview")
const uploadPlaceholders = document.querySelectorAll(".upload-placeholder")
const categorySelect = document.querySelector("#category")
const titleInput = document.querySelector("#title")
const validateButton = document.querySelector('#add-work-form button[type="submit"]')

// Etape 5.3 - Gestion du token

const token = localStorage.getItem("token")

if (token) {
    console.log("User connecté")
    loginLink.textContent = "logout"
    filters.style.display = "none"
    editMode.style.display = "flex"
    editProjects.style.display = "flex"
    loginLink.addEventListener("click", function () {
        localStorage.removeItem("token")
    })
}
else {
    console.log("User non connecté")
}
console.log(token)

// Etape 6 - Modal

function displayModalWorks(worksToDisplay) {
    modalGallery.innerHTML = ""

    worksToDisplay.forEach((work) => {
        const project = document.createElement("div")
        project.classList.add("modal-project")

        const image = document.createElement("img")
        image.src = work.imageUrl
        image.alt = work.title

        const deleteButton = document.createElement("button")
        deleteButton.classList.add("delete-project")
        deleteButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>'

        project.appendChild(image)
        project.appendChild(deleteButton)

        modalGallery.appendChild(project)
    })
}

function checkForm() {
    const imageSelected = imageInput.files.length > 0
    const titleFilled = titleInput.value !== ""
    const categorySelected = categorySelect.value !== ""

    if (imageSelected && titleFilled && categorySelected) {
        validateButton.style.backgroundColor = "#1d6154"
        validateButton.disabled = false
    } else {
        validateButton.style.backgroundColor = "#a7a7a7"
        validateButton.disabled = true
    }
}

imageInput.addEventListener("change", checkForm)
titleInput.addEventListener("input", checkForm)
categorySelect.addEventListener("change", checkForm)

checkForm()

editProjects.addEventListener("click", function () {
    displayModalWorks(allWorks)
    modal.style.display = "flex"
})

modalClose.addEventListener("click", function () {
    modal.style.display = "none"
})

modal.addEventListener("click", function (event) {
    if (event.target === modal) {
        modal.style.display = "none"
    }
})

addPhotoButton.addEventListener("click", function () {
    modalGalleryView.style.display = "none"
    modalAddView.style.display = "block"
})

backToGallery.addEventListener("click", function () {
    modalAddView.style.display = "none"
    modalGalleryView.style.display = "block"
})

imageInput.addEventListener("change", function () {
    const file = imageInput.files[0]

    if (file) {
        imagePreview.src = URL.createObjectURL(file)
        imagePreview.style.display = "block"

        uploadPlaceholders.forEach(function (element) {
            element.style.display = "none"
        })
    }
})

// Etape 3 - Gestion des projets

// Contient tous les projets récupérés depuis l'API.
let allWorks = [];
let allCategories = []

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
    allCategories = await response.json();

    allCategories.forEach(function (category) {
        const option = document.createElement("option")
        option.value = category.id
        option.textContent = category.name
        categorySelect.appendChild(option)
    })

    const button = document.createElement("button");
    button.textContent = "Tous";
    filters.appendChild(button);
    button.addEventListener("click", () => {
        // Réaffiche la liste complète.
        displayWorks(allWorks);
    });

    allCategories.forEach((category) => {
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

