const countriesList = [];
const countryChoices = [];
let score = 0;
let turn = 0;
const button = document.querySelectorAll(".box");
const flagButtonPatrent = document.querySelector(".choices");
//Modal Options -
const modal = document.querySelector('.modal');
const customizeButton = document.querySelector('#customizeGame');
const close = document.getElementsByClassName("close")[0];
const numOfPlayersSubmit = document.querySelector(".numOfPlayersSubmit"); 
const turnLimitButton = document.querySelector(".turnLimit");
const turnCountHTML = document.querySelector(".turnCount");
// const playerNameModal = document.querySelector(".playerNameModal");
const playersList = document.querySelector(".playersBox");
var setTurns = 10;
//Player Object Array
let players = [];
//----------------------------------------------------//----------------------------------------------------//----------------------------------------------------//----------------------------------------------------
fetch('https://restcountries.eu/rest/v2/all')
    .then(res => res.json())
    .then(res => {
        // console.log(res); -- logs array of countries and all country info
        filterCountryArray(res);
        // console.log(countriesList[44]); -- Works, data[countryIndex].CountryName or CountryFlag
        pickRandomCountries();
    })
    .catch(err => console.log("something went wrong ;/", err));
//----------------------------------------------------//----------------------------------------------------//----------------------------------------------------//----------------------------------------------------
//Filters rest countries API by name and flag url. -- Take array of countries -- forEach country, take the country name and flag and place into an object array -- return the array containing just the name and flag of each country. 
// For legibility purposes I wouldn't use res here. 
function filterCountryArray(res) {
    res.forEach(country => {
        countriesList.push({name: country.name, flag: country.flag});
    });
    return countriesList;
};

//Picks a random country and displays that in the questions innerText -- Picks an addition 3 random countries from the countriesList and pushes them into a "choices" array -- each choice box innerHtml is replaced with the choices flag urls.
function pickRandomCountries() {
    let targetCountry = countriesList[Math.floor(Math.random()*countriesList.length)];
    countryChoices.push(targetCountry);
    for(let i=0; i<3;i++) {countryChoices.push(countriesList[Math.floor(Math.random()*countriesList.length)])};
    doublicateCheck(countryChoices);
    // console.log(countryChoices);  -- Works, answer is always at 0 index, 1-3 index are random countrys.
    changeQuestion(targetCountry);
    setFlags(countryChoices, targetCountry);
}
//Check if the countryChoices array has doublicates
// So it seems you pull only 4 flags from your pool of choices called countryChoices
// if there's a random it calls pickRandomCountries and pulls again only 4 flags which is where the douplicates could happen
// my first thought was to pull more flags into the countryChoices and then check if the first 4 are douplicates(in the douplicatecheck func), if so then, change indexies with the one that is a duplicate.
// this could be tricky IF theres another duplicate AND it's swapped with the original duplicate. 
//
// OR the randomizer on line 42 and make it its own function, one that creates an array of 4 random numbers, and checks that the array has n duplicates, and also checks the number hasn't been played already by the user. then pushes into country choices, changeQuestion and setFlags

function doublicateCheck(a) {
    let checked = new Set(a);
    const backToArray = [...checked];
    if(backToArray.length > 4) {
        console.log("doublicate removed");
        pickRandomCountries();
    } else {
        console.log("...na...")
    };
};
//Grab question element from doc -- change innerText to match the random countries name. -- return the element.
function changeQuestion(pickedCountry) {
    const questionEle = document.querySelector('.qP');
    questionEle.innerText = `Which is the flag for ${pickedCountry.name}`;
    return questionEle;
}
//Takes array of choices, changes each button background to display that countries flag from its flag:url -- 
function setFlags(countryChoices, targetCountry) {
    const shuffledPicks = shuffle(countryChoices);
    // console.log(shuffledPicks); -- Works
    for (let index = 0; index < shuffledPicks.length; index++) {
        if(shuffledPicks[index] === targetCountry) {
            // console.log('correct country: ', targetCountry, ' at index: '+index);
            button[index].style.backgroundImage = `url(${shuffledPicks[index].flag})`;
            button[index].style.backgroundSize = '100% 100%';
            button[index].style.backgroundRepeat = `no-repeat`;
            button[index].name = 'correct';
        } else {
            // console.log(button[index], shuffledPicks[index].flag);
            button[index].style.backgroundImage = `url(${shuffledPicks[index].flag})`;
            button[index].style.backgroundSize = '100% 100%';
            button[index].style.backgroundRepeat = `no-repeat`;
        }
    }  
}
// https://hacks.mozilla.org/2015/05/es6-in-depth-destructuring/
// https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
//Fisher-Yates Shuffle
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
}
// ES6 now allows for array deconstruction, which means you can rearrange an array using it's indexes to rearrange the items, which is what you're doing here. The function I'm share is ALMOST the same it just looks at cleaner with the deconstruction method. 
// you can also create an array.prototype.random like Cooper did which can be very useful
// but it would look like this: 
// /**
//  * Shuffles array in place. ES6 version
//  * @param {Array} a items An array containing the items.
//  */
// function shuffle(a) {
//     for (let i = a.length - 1; i > 0; i--) {
//         const j = Math.floor(Math.random() * (i + 1));
//         [a[i], a[j]] = [a[j], a[i]]; 
//     }
//     return a;
// }

//Score -- adds 1 point each correct answer - sum starts at 0 - grabs element for score - changes innerText to display current score number -
function addScore() {
    score += 1;

    const scoreEle = document.querySelector(".score");
    scoreEle.innerText = `score: ${score}`;
    return scoreEle;
};
//tracks the games amount of turns -- starts at 0 -- stops game at 10;
function logTurn() {
    turn++;
    turnCountHTML.innerText = `turn: ${turn} /${setTurns}`
    if(turn >= setTurns) {
        stopGame();
    } else {
        clearBoard();
    }
    // ternary operator 
};
//Once game is at 10 turns return alert of users score -- 
function stopGame() {
    alert(`Your final score is ${score}`);
    console.log(players);
    if(players.length > 0) {
        players[0].gone = true;
        players[0].playerscore = score;
        updatePlayerText(players);
        playerCycle(players);

    } else {
        return location.reload();
    }
    // flagButtonPatrent.removeEventListener('click', function(evt) {console.log('over')});
    // return location.reload();
}
//after each turn, board is cleared and setFlag is rerun -- first for loop through flag holding elements, -- if/else to check for element with name = correct, clear it. -- clear background for all elements. -- run setFlag function again after for loop.
function clearBoard() {
    const grabbedFlags = document.querySelectorAll(".box");
    for (let index = 0; index < grabbedFlags.length; index++) {
        countryChoices.pop();
        if(grabbedFlags[index].name === 'correct') {
            grabbedFlags[index].name = "x";
            grabbedFlags[index].style.backgroundImage = 'url(none)';
        } else {
            grabbedFlags[index].style.backgroundImage = 'url(none)';
        }
    }
    pickRandomCountries();
};
//Modual functions
function createPlayers(num) {
    
    for (let index = 0; index < num; index++) {
        let playername = prompt(`Please enter player: ${index} name`);
        players.push({name: playername, playerscore: 0});
        displayPlayer(index);
    }
    // console.log(players) -- Works, logs players.
};
//Player Functions--
//append children to the players list to be displayed - each list element will consist of inner Text being the players name and score.
function displayPlayer(index) { 
    let playerEle = document.createElement("li");
    // console.log(players);
    let plyname = players[index].name;
    let plyscore = players[index].playerscore;
    playerEle.className = `${index}`;
    playerEle.innerText = `${plyname}: ${plyscore}`;
    playersList.appendChild(playerEle);
};
//Updates innerText of Player Element in DOM
function updatePlayerText(players) {
    for (let index = 0; index < players.length; index++) {
        let selectedPlayer = document.getElementsByClassName(index);
        console.log(selectedPlayer);
        let plyname = players[index].name;
        let plyscore = players[index].playerscore;
        selectedPlayer[0].innerText = `${plyname}: ${plyscore}`;
    };
};
//cycle through each player -- 
function playerCycle(players) {
    let shidtedPlayer = players.shift();
    players.push(shidtedPlayer); //lol
    updatePlayerText(players);
    let numberOfPlayersGone = 0;
    players.forEach(player => {
        if(player.gone == true) {
            numberOfPlayersGone++;
        };
        if(numberOfPlayersGone === players.length) {
            selectWinner(players);
        }
    });
    score = 0;
    resetScore();
    turn = 0;
    clearBoard();
}
//This will reseat the score of the game to get ready for the next player;
function resetScore() {
    const scoreEle = document.querySelector(".score");
    scoreEle.innerText = `score: ${score}`;
    return scoreEle;
};
//This will sort the player array of objects and return the players name who had the highest score, if there is a draw - return the name of the players who had the same score.
function selectWinner(players) {
    const sortedList = players.sort(function(a,b) {
        return b.playerscore-a.playerscore;
    })
    if(sortedList[0].playerscore === sortedList[1].playerscore) {
        alert(`Game Finished, ${sortedList[0].name} & ${sortedList[1].name} had a draw!
        The game will now restart.`);
        location.reload();
    } else {
        alert(`Game Finished, ${sortedList[0].name} won!
        The game will now restart.`);
        location.reload();
    }
};

// I would move code that you're not using into a different branch 
// keep your production branch clean

//function to display a red X over the flag chosen if it was the wrong one.
// function WRONG(box) {
//     let wrongX = document.createElement("p");
//     wrongX.className = "wrong";
//     wrongX.innerText = 'X';
//     return box.appendChild(wrongX);
// }
//clears the red X elements
// function clearX() {
//     let child = flagButtonPatrent.lastChild;
//     flagButtonPatrent.removeChild(child);
// }
//EVENTS//----------------------------------------------------//----------------------------------------------------//----------------------------------------------------//----------------------------------------------------
flagButtonPatrent.addEventListener('click', function(event) {
    event.preventDefault();

    if(event.target.name == 'correct') {
        addScore();
        logTurn();
    } else {
        alert('Wrong!');
        // WRONG(flagButtonPatrent);
        // clearX(); 
        logTurn();
    }
})
// I would make all of these ES6 IFFEs
//Modual Events
customizeButton.onclick = function() {
    modal.style.display = "block";
}
close.onclick = function() {
    modal.style.display = "none";
}
//closes when clicked anbywhere outside of modual
window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
}
numOfPlayersSubmit.onclick = function(event) {
    event.preventDefault();
    setPlayerNumber = document.getElementById("playersNum").value;
    console.log(`The number of players has been set to ${setPlayerNumber}`);
    createPlayers(setPlayerNumber);
    // playerCycle(players);
}
turnLimitButton.onclick = function(event) {
    event.preventDefault();
    setTurns = document.getElementById("turns").value;
    alert(`The turns per round have been set to ${setTurns}`);
    turnCountHTML.innerText = `turn: ${turn} /${setTurns}`
    console.log('Turn amount: ',setTurns);
}