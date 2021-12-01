export const card = (cardData) =>{
    const cardTamplate = cardData.map(el=>`<div><img src="${el.imageUrl}"width='40' align="center">${el.name}, цена ${el.price}</div>`);
   document.write(...cardTamplate);
}
