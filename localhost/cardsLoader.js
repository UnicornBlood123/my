import {mockedApi} from "./mockedApi.js";
import {card} from "./card.js";

const loadCardData = () =>{
    mockedApi().then(cardsData =>{
        card(cardsData);
    })
}
window.onload = loadCardData()