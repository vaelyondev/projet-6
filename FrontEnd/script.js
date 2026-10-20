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
const modalError = document.querySelector("#modal-error")
const galleryError = document.querySelector("#gallery-error")
let previewUrl = null
let isSubmitting = false

// Etape 8.1 - Ajouter un nouveau projet

addWorkForm.addEventListener("submit", async function (event) {
    event.preventDefault()
    addWorkError.textContent = ""
    if (isSubmitting) return
    if (!checkForm()) {
        addWorkError.textContent = getImageError() || "Renseignez une photo, un titre et une catégorie."
        return
    }

    const formData = new FormData(addWorkForm)
    formData.set("title", titleInput.value.trim())
    isSubmitting = true
    validateButton.disabled = true

    try {
        const response = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + token
            },
            body: formData
        })

        if (response.ok) {
            // La réponse contient le nouveau projet : pas besoin de recharger la page.
            const newWork = await response.json()
            allWorks.push(newWork)
            displayWorks(allWorks)
            displayModalWorks(allWorks)
            resetAddForm()
            closeModal()
        } else {
            addWorkError.textContent = response.status === 401
                ? "Votre session a expiré. Reconnectez-vous."
                : "Erreur lors de l'ajout du projet."
        }
    } catch (error) {
        addWorkError.textContent = "Impossible de contacter le serveur"
    } finally {
        isSubmitting = false
        checkForm()
    }
})

// Etape 5.3 - Gestion du token

const token = localStorage.getItem("token")

if (token) {
    loginLink.textContent = "logout"
    filters.style.display = "none"
    editMode.style.display = "flex"
    editProjects.style.display = "flex"
    loginLink.addEventListener("click", function () {
        localStorage.removeItem("token")
    })
}

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
        deleteButton.setAttribute("aria-label", "Supprimer " + work.title)
        deleteButton.dataset.id = work.id
        deleteButton.classList.add("delete-project")
        deleteButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>'

        project.appendChild(image)
        project.appendChild(deleteButton)

        modalGallery.appendChild(project)

        deleteButton.addEventListener("click", async function (event) {
            event.preventDefault()
            const workId = deleteButton.dataset.id

            modalError.textContent = ""
            deleteButton.disabled = true
            try {
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
                    modalError.textContent = response.status === 401
                        ? "Votre session a expiré. Reconnectez-vous."
                        : "Impossible de supprimer ce projet."
                }
            } catch (error) {
                modalError.textContent = "Impossible de contacter le serveur."
            } finally {
                deleteButton.disabled = false
            }
        })
    })
}

// Vérifie la taille et le format, en plus du filtre proposé par le sélecteur de fichiers.
function getImageError() {
    const file = imageInput.files[0]
    if (!file) return ""
    if (!["image/jpeg", "image/png"].includes(file.type)) return "Choisissez une image JPG ou PNG."
    if (file.size > 4 * 1024 * 1024) return "L'image ne doit pas dépasser 4 Mo."
    return ""
}

function checkForm() {
    const imageSelected = imageInput.files.length > 0 && !getImageError()
    const titleFilled = titleInput.value.trim() !== ""
    const categorySelected = categorySelect.value !== ""

    if (imageSelected && titleFilled && categorySelected) {
        validateButton.style.backgroundColor = "#1d6154"
        validateButton.disabled = isSubmitting
    } else {
        validateButton.style.backgroundColor = "#a7a7a7"
        validateButton.disabled = true
    }
    return Boolean(imageSelected && titleFilled && categorySelected)
}

imageInput.addEventListener("change", checkForm)
titleInput.addEventListener("input", checkForm)
categorySelect.addEventListener("change", checkForm)

checkForm()

editProjects.addEventListener("click", function () {
    resetAddForm()
    modalError.textContent = ""
    modalGalleryView.style.display = "block"
    modalAddView.style.display = "none"
    displayModalWorks(allWorks)
    modal.style.display = "flex"
    modalClose.focus()
})

function closeModal() {
    modal.style.display = "none"
    editProjects.focus()
}

modalClose.addEventListener("click", closeModal)

modal.addEventListener("click", function (event) {
    if (event.target === modal) {
        closeModal()
    }
})

addPhotoButton.addEventListener("click", function () {
    modalGalleryView.style.display = "none"
    modalAddView.style.display = "block"
    backToGallery.focus()
})

backToGallery.addEventListener("click", function () {
    modalAddView.style.display = "none"
    modalGalleryView.style.display = "block"
    addPhotoButton.focus()
})

// Libère l'ancienne image et restaure la zone de sélection.
function clearPreview() {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    previewUrl = null
    imagePreview.removeAttribute("src")
    imagePreview.style.display = "none"
    uploadPlaceholders.forEach((element) => { element.style.display = "" })
}

function resetAddForm() {
    addWorkForm.reset()
    addWorkError.textContent = ""
    clearPreview()
    checkForm()
}

modal.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeModal()
    if (event.key !== "Tab") return
    const focusable = Array.from(modal.querySelectorAll("button, input, select, a[href]"))
        .filter((element) => !element.disabled && element.getClientRects().length > 0)
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
    }
})

imageInput.addEventListener("change", function () {
    const file = imageInput.files[0]
    clearPreview()
    addWorkError.textContent = getImageError()
    if (addWorkError.textContent) {
        imageInput.value = ""
        checkForm()
        return
    }
    if (file) {
        previewUrl = URL.createObjectURL(file)
        imagePreview.src = previewUrl
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
    if (!response.ok) throw new Error("Chargement des projets impossible")
    allWorks = await response.json();
    displayWorks(allWorks);
}
getWorks().catch(() => {
    galleryError.textContent = "Impossible de charger les projets. Réessayez en rechargeant la page."
});

function selectFilter(selectedButton) {
    filters.querySelectorAll("button").forEach((button) => {
        const selected = button === selectedButton
        button.classList.toggle("is-active", selected)
        button.setAttribute("aria-pressed", String(selected))
    })
}

async function getFilters() {
    const response = await fetch("http://localhost:5678/api/categories");
    if (!response.ok) throw new Error("Chargement des catégories impossible")
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
    selectFilter(button)
    button.addEventListener("click", () => {
        selectFilter(button)
        displayWorks(allWorks);
    });

    allCategories.forEach((category) => {
        const button = document.createElement("button");
        button.textContent = category.name;
        button.dataset.categoryId = category.id;
        button.setAttribute("aria-pressed", "false")
        filters.appendChild(button);
        button.addEventListener("click", () => {
            selectFilter(button)
            const filteredWorks = allWorks.filter((work) => work.category.id === category.id);
            displayWorks(filteredWorks);
        });
    });
}
getFilters().catch(() => {
    galleryError.textContent = "Impossible de charger les catégories. Réessayez en rechargeant la page."
})

