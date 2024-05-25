const favoriteContainer = document.querySelector('.favorite-container');
const btnMenu = document.querySelector('.menu-btn');
const listMenu = document.querySelector('.menu-listing');

if (!btnMenu.toggled) {
    btnMenu.addEventListener('click', () => {
        listMenu.classList.toggle('active-menu');
    });
    btnMenu.toggled = true;
}

function openDB() {
    return new Promise((resolve, reject) => {
        const request = window.indexedDB.open('restaurants', 1);

        request.onerror = function handleError(event) {
            reject(event.target.error);
        };

        request.onsuccess = function handleSuccess(event) {
            const db = event.target.result;
            resolve(db);
        };

        request.onupgradeneeded = function handleUpgrade(event) {
            const db = event.target.result;
            const objectStore = db.createObjectStore('favorites', { keyPath: 'id' });
            objectStore.createIndex('id', 'id', { unique: true });
        };
    });
}

async function closeDB(db) {
    db.close();
}

async function removeFavorite(restaurantId) {
    const db = await openDB();
    const transaction = db.transaction(['favorites'], 'readwrite');
    const objectStore = transaction.objectStore('favorites');
    objectStore.delete(restaurantId);
    await closeDB(db);
}

async function fetchDataFromDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('restaurants', 1);

        request.onerror = function handleError() {
            reject(request.error);
        };

        request.onsuccess = function handleSuccess() {
            const db = request.result;
            const transaction = db.transaction('favorites', 'readonly');
            const store = transaction.objectStore('favorites');
            const getAllRequest = store.getAll();

            getAllRequest.onerror = function handleGetAllError() {
                reject(getAllRequest.error);
            };

            getAllRequest.onsuccess = function handleGetAllSuccess() {
                resolve(getAllRequest.result);
            };
        };
    });
}

async function createFavoriteCard(restaurant) {
    const card = document.createElement('div');
    card.classList.add('restaurant-card');
    card.setAttribute('tabindex', 0);

    const image = document.createElement('img');
    image.src = restaurant.pictureId;
    image.alt = restaurant.name;

    const name = document.createElement('h3');
    name.textContent = restaurant.name;

    const city = document.createElement('p');
    city.textContent = `City: ${restaurant.city}`;

    const rating = document.createElement('p');
    rating.textContent = `Rating: ${restaurant.rating}`;

    const description = document.createElement('p');
    description.textContent = restaurant.description;

    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove from Favorites';
    removeButton.addEventListener('click', () => {
        removeFavorite(restaurant.id);
        card.remove();
    });

    const detailLink = document.createElement('a');
    detailLink.textContent = 'View Details';
    detailLink.href = `detail.html?id=${restaurant.id}`;
    detailLink.classList.add('detail-link');

    card.appendChild(image);
    card.appendChild(name);
    card.appendChild(city);
    card.appendChild(rating);
    card.appendChild(description);
    card.appendChild(removeButton);
    card.appendChild(detailLink);

    return card;
}

async function renderFavoriteList() {
    try {
        const favoriteRestaurants = await fetchDataFromDB();
        favoriteContainer.innerHTML = '';
        favoriteRestaurants.forEach(async(restaurant) => {
            const updatedRestaurant = {
                ...restaurant,
                pictureId: `https://restaurant-api.dicoding.dev/images/small/${restaurant.pictureId}`,
            };

            try {
                const card = await createFavoriteCard(updatedRestaurant);
                favoriteContainer.appendChild(card);
            } catch (error) {
                console.error('Failed to create favorite restaurant card:', error);
            }
        });
    } catch (error) {
        console.error('Failed to render favorite restaurant list:', error);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    renderFavoriteList().catch((error) => {
        console.error('Failed to render favorite restaurant list:', error);
    });
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            }, error => {
                console.log('ServiceWorker registration failed: ', error);
            });
    });
}