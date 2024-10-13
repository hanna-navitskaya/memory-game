const MAX_CARDS = 24;
const animals = ['bear', 'cat', 'dog', 'fox', 'lion', 'monkey', 'owl','panda', 'pig', 'rabbit'];
const cards = new Array(MAX_CARDS).fill(null);

let setps = 0;
let openedCard1;
let openedCard2;


function createCard(type) { 
    return {
        id: crypto.randomUUID(),
        type: type,
        matched: false,
    };
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function insertCard() {
    const animal = animals[getRandomInt(0, 9)];
    const card1 = createCard(animal);
    const card2 = createCard(animal);
    cards[getRandomPositionInList()] = card1;
    cards[getRandomPositionInList()] = card2;
}

function getRandomPositionInList() {
    let index = getRandomInt(0, 23);

    if (cards[index] === null) {
        return index;
    }

    for (let i = 0; i < MAX_CARDS; i++) {
        if (cards[i] === null) {
            return i;
        }
    }
}

function createListOfAnimals() {
    for (let i = 0; i < MAX_CARDS/2; i++) {
        insertCard();
    }
}

function createCardElement(animal) {
    const card = document.createElement('div');
    card.setAttribute('id', animal.id);
    card.classList.add('card');
    const front = document.createElement('div');
    front.classList.add('back');
    const back = document.createElement('div');
    back.classList.add('front', animal.type);
    card.append(front);
    card.append(back);

    card.addEventListener('click', (event) => {
        openeCard(event.currentTarget);
    });

    return card;
}

function renderCards() {
    const container = document.querySelector('.cards');
    for (let i = 0; i < cards.length; i++) {
        const card = createCardElement(cards[i]);
        container.append(card);
    }
}

function findCardById(id) {
    return cards.find((card) => card.id === id);
}

function isGameOver() {
    return cards.every((card) => card.matched);
}

function openeCard(element) {
    if (!openedCard1) {
        setps = setps + 1;
        openedCard1 = element;
        element.classList.add('flipped');
    } else if (!openedCard2) {
        setps = setps + 1;
        const card1 = findCardById(openedCard1.id);
        const card2 = findCardById(element.id);
        console.log(card1, card2)
        openedCard2 = element;
        element.classList.add('flipped');

        setTimeout(() => {
            if (card1.type === card2.type) {
                openedCard1.classList.add('matched');
                openedCard2.classList.add('matched');
                card1.matched = true;
                card2.matched = true;
            } else {
                openedCard1.classList.remove('flipped');
                openedCard2.classList.remove('flipped');
            }

            if (isGameOver()) {
                const leaderboard = document.querySelector('.leaderboard');
                const steps = document.querySelector('.steps');
                const container = document.querySelector('.cards');
                saveResult(setps);
                renderLeaderboard();
                steps.innerHTML = setps;
                container.classList.add('hidden');
                leaderboard.classList.add('visible');
            }
    
            openedCard1 = null;
            openedCard2 = null;
        },400);
    }
}

function renderLeaderboard() {
    const leaderboard = localStorage.getItem('leaderboard');
    const games = leaderboard ? JSON.parse(leaderboard) : [];
    const leaderboardEl = document.querySelector('.games');

    for (let i = 0; i < games.length; i++) {
        const game = document.createElement('tr');
        const td1 = document.createElement('td');
        const td2 = document.createElement('td');
        td1.innerHTML = i + 1;
        td2.innerHTML = games[i];
        game.append(td1);
        game.append(td2);
        leaderboardEl.appendChild(game)
    }
}

function saveResult(steps) {
    const leaderboard = localStorage.getItem('leaderboard');
    const result = leaderboard ? JSON.parse(leaderboard) : [];
    result.unshift(steps);
    localStorage.setItem('leaderboard', JSON.stringify(result.slice(0, 10)));
}


createListOfAnimals();
renderCards();