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
