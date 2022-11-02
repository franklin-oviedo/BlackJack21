const blackJackModule = (() => {
    'use strict';

    let deck = [];
    const specialsLetters = ['C', 'D', 'H', 'S'],
        specialsNumbers = ['A', 'J', 'Q', 'K'];

    let pointsPlayers = [];

    // Referencias del HTML
    const btnCards = document.querySelector('#btnCards'),
        btnStop = document.querySelector('#btnStop'),
        btnNew = document.querySelector('#btnNew');

    const divCardsPlayers = document.querySelectorAll('.divCards'),
        pointsHTML = document.querySelectorAll('small');


    // Esta función inicializa el juego 
    const startGame = (numPlayers = 2) => {
        deck = createDeck();

        pointsPlayers = [];
        for (let i = 0; i < numPlayers; i++) {
            pointsPlayers.push(0);
        }

        pointsHTML.forEach(elem => elem.innerText = 0);
        divCardsPlayers.forEach(elem => elem.innerHTML = '');

        btnCards.disabled = false;
        btnStop.disabled = false;

    }

    // Esta función crea un nuevo deck
    const createDeck = () => {

        deck = [];
        for (let i = 2; i <= 10; i++) {
            for (let specialsLetter of specialsLetters) {
                deck.push(i + specialsLetter);
            }
        }

        for (let specialsLetter of specialsLetters) {
            for (let specialsNumber of specialsNumbers) {
                deck.push(specialsNumber + specialsLetter);
            }
        }
        return _.shuffle(deck);;
    }

    // Esta función me permite tomar una carta
    const getCards = () => {
        if (deck.length === 0) {
            throw 'No hay cartas en el deck';
        }
        return deck.pop();
    }

    const valueCards = (cardParameter) => {
        const cardsValue = cardParameter.substring(0, cardParameter.length - 1);
        return (isNaN(cardsValue)) ?
            (cardsValue === 'A') ? 11 : 10
            : cardsValue * 1;
    }

    // Turno: 0 = primer jugador y el último será la computadora
    const accumulatePoints = (cardParameter, turnParameter) => {
        pointsPlayers[turnParameter] = pointsPlayers[turnParameter] + valueCards(cardParameter);
        pointsHTML[turnParameter].innerText = pointsPlayers[turnParameter];
        return pointsPlayers[turnParameter];
    }

    const createCards = (cardParameter, turnParameter) => {

        const imgCards = document.createElement('img');
        imgCards.src = `assets/cartas/${cardParameter}.png`; //3H, JD
        imgCards.classList.add('cards');
        divCardsPlayers[turnParameter].append(imgCards);

    }

    const determineWiner = () => {

        const [pointsMin, pointsComputer] = pointsPlayers;

        setTimeout(() => {
            if (pointsComputer === pointsMin) {
                alertMessage('TIE!', 'warning');
            } else if (pointsMin > 21) {
                alertMessage('Your rival win', 'warning')
            } else if (pointsComputer > 21) {
                alertMessage('You WIN!', 'success');
            } else {
                alertMessage('Your rival win', 'success')
            }
        }, 100);

    }

    // turno de la computadora
    const turnComputer = (pointsMin) => {

        let pointsComputer = 0;

        do {
            const obtainCards = getCards();
            pointsComputer = accumulatePoints(obtainCards, pointsPlayers.length - 1);
            createCards(obtainCards, pointsPlayers.length - 1);

        } while ((pointsComputer < pointsMin) && (pointsMin <= 21));

        determineWiner();
    }



    // Eventos
    btnCards.addEventListener('click', () => {

        const obtainCards = getCards();
        const pointsPlayer = accumulatePoints(obtainCards, 0);

        createCards(obtainCards, 0);


        if (pointsPlayer > 21) {
            console.warn('Your rival win');
            btnCards.disabled = true;
            btnStop.disabled = true;
            turnComputer(pointsPlayer);

        } else if (pointsPlayer === 21) {
            console.warn('21, Amazing, You WIN!');
            btnCards.disabled = true;
            btnStop.disabled = true;
            turnComputer(pointsPlayer);
        }

    });


    btnStop.addEventListener('click', () => {
        btnCards.disabled = true;
        btnStop.disabled = true;

        turnComputer(pointsPlayers[0]);
    }); 

    return {
        newGame: startGame
    };

})();