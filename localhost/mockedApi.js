const mockedResponse = [
    {
        id: 1,
        name: "Апельсин",
        price: 300,
        imageUrl: "./images/orange.jpg"
    },
    {
        id: 2,
        name: "Яблоко",
        price: 100,
        imageUrl:"./images/apple.jpg"
    },
    {
        id: 3,
        name: "Банан",
        price: 150,
        imageUrl:"./images/banana.jpg"
    },
    {
        id: 4,
        name: "Киви",
        price: 400,
        imageUrl:"./images/kiwi.jpg"
    }
    ,
    {
        id: 5,
        name: "Ананас",
        price: 600,
        imageUrl:"./images/pineapple.jpg"
    }
    ,
    {
        id: 6,
        name: "Груша",
        price: 200,
        imageUrl:"./images/pear.jpg"
    }
]

export const mockedApi = ()=>
{
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(mockedResponse), 2000);
    })
}
