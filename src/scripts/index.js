import 'regenerator-runtime';

const restoContainer = document.querySelector('.restaurant-container');
const btnMenu = document.querySelector('.menu-btn');
const listMenu = document.querySelector('.menu-listing');

if (!btnMenu.toggled) {
    btnMenu.addEventListener('click', () => {
        listMenu.classList.toggle('active-menu');
    });
    btnMenu.toggled = true;
}

async function fetchData() {
    try {
        const response = await fetch('https://restaurant-api.dicoding.dev/list');
        const data = await response.json();
        return data.restaurants;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

function createRestoCard(restaurant) {
    const card = document.createElement('div');
    card.classList.add('resto-card');
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

    const detailLink = document.createElement('a');
    detailLink.textContent = 'View Details';
    detailLink.href = `detail.html?id=${restaurant.id}`;
    detailLink.classList.add('detail-link');

    card.appendChild(image);
    card.appendChild(name);
    card.appendChild(city);
    card.appendChild(rating);
    card.appendChild(description);
    card.appendChild(detailLink);

    return card;
}

async function renderRestoList() {
    const restaurants = await fetchData();
    restoContainer.innerHTML = '';
    restaurants.forEach((restaurant) => {
        const updatedRestaurant = {
            ...restaurant,
            pictureId: `https://restaurant-api.dicoding.dev/images/small/${restaurant.pictureId}`,
        };

        const card = createRestoCard(updatedRestaurant);
        restoContainer.appendChild(card);
    });
}

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

window.addEventListener('DOMContentLoaded', renderRestoList);