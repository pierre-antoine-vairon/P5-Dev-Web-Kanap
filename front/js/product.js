// On recupère l'id de l'URL
let url = new URL(window.location.href);
let productId = url.searchParams.get("id");

// Variable de creation de noeud
const productImg = document.querySelector('.item__img');
const productAlt = document.querySelector('alt');
const productTitle = document.getElementById('title');
const productPrice = document.getElementById('price');
const productDescription = document.getElementById('description');
const productColors = document.getElementById('colors');




// On appel l'API pour obtenir un  produit specifique
function fetchProductById(productId) {
    fetch(`http://localhost:3000/api/products/${productId}`)
    .then(function(res) {
        if (res.ok) {
            return res.json();
        }
    })
    // on affiche le produit en question
    .then(function(value) {
        productImg.innerHTML = `<img src="${value.imageUrl}" alt="${value.altTxt}">`
        productTitle.innerText = `${value.name}`
        productPrice.innerText = ` ${value.price} `
        productDescription.innerText = `${value.description}`
        for (let i in value.colors) {
            productColors.innerHTML += `<option value="${value.colors[i]}">${value.colors[i]}</option>`
        };
    })
    .catch(function(err) {
        // Une erreur est survenue
    });
};

fetchProductById(productId);


// récupération de l'evenement clic sur le bouton
const addToCartBtn = document.getElementById('addToCart')
const productQuantity = document.getElementById('quantity')


addToCartBtn.addEventListener('click', function() {
    // parseInt analyse une chaine de caractère pour renvoyer un entier
    if (productColors.value === "" || parseInt(productQuantity.value) < 1 || parseInt(productQuantity.value) > 100  ) {
        alert ('Selectionnez une couleur et une quantité comprise entre 1 et 100')
        return
    };

    const productImgSrc = document.querySelector(`.item__img > img`).src;
    const productImgAlt = document.querySelector(`.item__img > img`).alt;
    let newProduct = {
        id: productId,
        name: productTitle.innerText,
        quantity: parseInt(productQuantity.value),
        price: parseInt(productPrice.innerText),
        color: productColors.value,
        image: productImgSrc,
        alt: productImgAlt
    };  
    
    
    //JSON.parse : reforme une chaine de caractère json en objet JS utilisable
    let getProducts = JSON.parse(localStorage.getItem("products"));


    if (getProducts === null) {
        getProducts = [];
        
    };
    for ( let product of getProducts) {
        if (product.id === newProduct.id && 
            product.color === newProduct.color ) {
            product.quantity += newProduct.quantity
            newProduct = null
        }
    };

    if (newProduct !== null) {
        // push() ajoute l'element au tableau
        getProducts.push(newProduct)
    };
    // JSON.stringify transforme l'objet en chaine de caractère
    localStorage.setItem("products", JSON.stringify(getProducts))
}); 



// JSON.stringify() => sotckage / localStorage.setItem
// JSON.parse => Lecture / localStorage.getItem
