console.log("Page chargée")

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
const addWorkForm = document.querySelector("#add-work-form")
const addWorkError = document.querySelector("#add-work-error")

// Etape 8.1 - Ajouter un nouveau projet

addWorkForm.addEventListener("submit", async function (event) {
    event.preventDefault()
    addWorkError.textContent = ""

    const formData = new FormData(addWorkForm)

    try {
        const response = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + token
            },
            body: formData
        })

        if (response.ok) {
            await getWorks()
            displayModalWorks(allWorks)

            addWorkForm.reset()
            imagePreview.style.display = "none"

            uploadPlaceholders.forEach((element) => {
                element.style.display = ""
            })

            checkForm()
            modal.style.display = "none"
        } else {
            addWorkError.textContent = "Erreur lors de l'ajout du projet"
            console.log("Erreur HTTP :", response.status)
        }
    } catch (error) {
        addWorkError.textContent = "Impossible de contacter le serveur"
        console.error("Erreur de connexion :", error)
    }
})

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

// Etape 6 - Modal / Etape 7 - Suppression de travaux

function displayModalWorks(worksToDisplay) {
    modalGallery.innerHTML = ""

    worksToDisplay.forEach((work) => {
        const project = document.createElement("div")
        project.classList.add("modal-project")

        const image = document.createElement("img")
        image.src = work.imageUrl
        image.alt = work.title

        const deleteButton = document.createElement("button")
        deleteButton.type = "button"
        deleteButton.dataset.id = work.id
        deleteButton.classList.add("delete-project")
        deleteButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>'

        project.appendChild(image)
        project.appendChild(deleteButton)

        modalGallery.appendChild(project)

        deleteButton.addEventListener("click", async function (event) {
            event.preventDefault()
            const workId = deleteButton.dataset.id

            const response = await fetch("http://localhost:5678/api/works/" + workId, {
                method: "DELETE",
                headers: {
                    "Authorization": "Bearer " + token
                }
            })

            if (response.ok) {
                project.remove()

                allWorks = allWorks.filter((work) => work.id != workId)

                displayWorks(allWorks)
            } else {
                console.log("Erreur lors de la suppression")
            }

            console.log(response.status)
        })
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

let allWorks = [];
let allCategories = []

function displayWorks(worksToDisplay) {
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
    const response = await fetch("http://localhost:5678/api/works");
    allWorks = await response.json();
    displayWorks(allWorks);
}
getWorks();

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
        displayWorks(allWorks);
    });

    allCategories.forEach((category) => {
        const button = document.createElement("button");
        button.textContent = category.name;
        button.dataset.categoryId = category.id;
        filters.appendChild(button);
        button.addEventListener("click", () => {
            const filteredWorks = allWorks.filter((work) => work.category.id === category.id);
            displayWorks(filteredWorks);
        });
    });
}
getFilters()

