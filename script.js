const languageBtn = document.getElementById("languageBtn");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const noResults = document.getElementById("noResults");
let currentLanguage = "ky";
// Тилди которуу
function setLanguage(language) {
    currentLanguage = language;
    document.documentElement.lang = language;
    languageBtn.textContent = language === "ky" ? "KG / EN" : "EN / KG";
    document.querySelectorAll("[data-ky][data-en]").forEach(element => {
        element.innerHTML = element.dataset[language];
    });
    searchInput.placeholder =
        language === "ky" ? "Жерди издөө..." : "Search destinations...";
    document.querySelectorAll(".card").forEach(card => {
        const location = card.querySelector(".location");
        if (location) {
            const locations = {
                ky: card.dataset.locationKy,
                en: card.dataset.locationEn
            };
            if (locations[language]) {
                location.textContent = "📍 " + locations[language];
            }
        }
    });
}
languageBtn.addEventListener("click", () => {
    setLanguage(currentLanguage === "ky" ? "en" : "ky");
});
// Жерлерди издөө
function searchDestinations() {
    const query = searchInput.value.trim().toLocaleLowerCase();
    let found = 0;
    document.querySelectorAll(".card").forEach(card => {
        const searchableText = (
            card.innerText + " " + card.dataset.search
        ).toLocaleLowerCase();
        const matches = searchableText.includes(query);
        card.hidden = !matches;
        if (matches) found++;
    });
    noResults.hidden = found !== 0;
}
searchBtn.addEventListener("click", searchDestinations);
searchInput.addEventListener("input", searchDestinations);
searchInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        searchDestinations();
    }
});
// Сүйүктүүлөрдү сактоо
let favorites = [];
try {
    favorites = JSON.parse(
        localStorage.getItem("travelKGFavorites") || "[]"
    );
    if (!Array.isArray(favorites)) favorites = [];
} catch {
    favorites = [];
}
document.querySelectorAll(".card").forEach((card, index) => {
    const button = card.querySelector(".favorite-btn");
    button.dataset.id = String(index);
    function updateFavoriteButton() {
        const active = favorites.includes(button.dataset.id);
        button.classList.toggle("active", active);
        button.textContent = active ? "♥" : "♡";
        button.setAttribute("aria-pressed", String(active));
    }
    updateFavoriteButton();
    button.addEventListener("click", () => {
        const id = button.dataset.id;
        if (favorites.includes(id)) {
            favorites = favorites.filter(item => item !== id);
        } else {
            favorites.push(id);
        }
        try {
            localStorage.setItem(
                "travelKGFavorites",
                JSON.stringify(favorites)
            );
        } catch (error) {
            console.warn("Сүйүктүүлөрдү сактоо мүмкүн болгон жок.", error);
        }
        updateFavoriteButton();
    });
});
// Толук маалымат терезеси
const modal = document.getElementById("detailsModal");
const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const closeModal = document.getElementById("closeModal");
document.querySelectorAll(".details-btn").forEach(button => {
    button.addEventListener("click", () => {
        modalTitle.textContent = button.dataset[
            currentLanguage === "ky" ? "titleKy" : "titleEn"
        ];
        modalDescription.textContent = button.dataset[
            currentLanguage === "ky" ? "descriptionKy" : "descriptionEn"
        ];
        modal.hidden = false;
        closeModal.focus();
    });
});
function hideModal() {
    modal.hidden = true;
}
closeModal.addEventListener("click", hideModal);
modal.addEventListener("click", event => {
    if (event.target === modal) hideModal();
});
document.addEventListener("keydown", event => {
    if (event.key === "Escape") hideModal();
});
// Алгачкы тил
setLanguage("ky");

function openIssykKul() {
    document.getElementById("issykModal").hidden = false;
}
function closeIssykKul() {
    document.getElementById("issykModal").hidden = true;
}