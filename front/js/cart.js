// recuperation produit localStorage
let getProducts = JSON.parse(localStorage.getItem("products"));

// ---- creation contenu HTML ---- //

//variable HTML
const getSection = document.getElementById('cart__items');

// Boucle de création
for (let i in getProducts) {
    getSection.innerHTML +=
            `<article class="cart__item" data-id="${getProducts[i].id}" data-color="${getProducts[i].color}">
                <div class="cart__item__img">
                  <img src="${getProducts[i].image}" alt="${getProducts[i].alt}">
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>${getProducts[i].name}</h2>
                    <p>${getProducts[i].color}</p>
                    <p>${getProducts[i].price}€</p>
                  </div>
                  <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>Qté : </p>
                      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${getProducts[i].quantity}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem">Supprimer</p>
                    </div>
                  </div>
                </div>
            </article>`;
};



// ---- calcul total quantité ---- //

// variables HTML
let totalQuantity = document.getElementById("totalQuantity")
let totalPrice = document.getElementById("totalPrice")


// obtenir prix total
function getPrice() {
    let number = 0;
    for (let product of getProducts) {
        number += product.price*product.quantity
    }
    return number
    
}
// obtenir quantité totale
function getQuantity() {
    let number = 0;
    for(let product of getProducts) {
        number += product.quantity
    }
    return number
}
// resultat final


function calcTotal(){
    totalPrice.innerText = getPrice();
    totalQuantity.innerText = getQuantity();
};
calcTotal();



// changer la quantité de l'event
let sendProduct = localStorage.setItem("products",JSON.stringify(getProducts));

let itemQuantity = document.getElementsByName("itemQuantity");

itemQuantity.forEach((element, i) => element.addEventListener('change', function(event) {
    getProducts[i].quantity = parseInt(event.target.value);
    localStorage.setItem("products", JSON.stringify(getProducts));
    calcTotal();
}));



//supprimer un produit du localStorage;

function initDeleteItemEvent() {
    let deleteItem = document.querySelectorAll('.deleteItem');

    for (let i = 0; i < deleteItem.length; i++) {
        deleteItem[i].addEventListener('click', function(event) {
            event.preventDefault();

            let idDelete = getProducts[i].id;
            let colorDelete = getProducts[i].color;

            getProducts = getProducts.filter(element => element.id !== idDelete || element.color !== colorDelete);

            localStorage.setItem("products", JSON.stringify(getProducts));
            window.location.href = "cart.html";
        });
    };
}

initDeleteItemEvent();




    
// ---- Validation du formulmaire ---- //
// Selecteur du formulaire par la classe
let form = document.querySelector(".cart__order__form");

// RegExp
let regularRegExp = new RegExp("^[a-zA-Z ,.'-]+$");
let emailRegExp = new RegExp('^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$', 'g');
let addressRegExp = new RegExp("^[0-9]{1,3}(?:(?:[,. ]){1}[-a-zA-Zàâäéèêëïîôöùûüç]+)+");

// 1 - Ecouter la modification de FIRSTNAME
form.firstName.addEventListener('change', function() {
    validFirstName(this)
});

const validFirstName = function(inputFirstName) {
    let errorFirstName = document.getElementById('firstNameErrorMsg')

    if(regularRegExp.test(inputFirstName.value)) {
        errorFirstName.innerHTML = '';
    } else {
        errorFirstName.innerHTML = 'Veuillez entrez un prénom valide';
    };
};

// 2 - Ecouter la modification de LASTNAME
form.lastName.addEventListener('change', function() {
    validLastName(this)
});

const validLastName = function(inputLastName) {
    let errorLastName = document.getElementById('lastNameErrorMsg')

    if(regularRegExp.test(inputLastName.value)) {
        errorLastName.innerHTML = '';
    } else {
        errorLastName.innerHTML = 'Veuillez entrez un nom valide';
    };
};

// 3 - Ecouter la modification de ADRESS
form.address.addEventListener('change', function() {
    validAdress(this)
});

const validAdress = function(inputAddress) {
    let errorAddress = document.getElementById('addressErrorMsg')

    if(addressRegExp.test(inputAddress.value)) {
        errorAddress.innerHTML = '';
    } else {
        errorAddress.innerHTML = 'Veuillez entrez une adresse valide';
    };
};
// 4 - Ecouter la modification de CITY
form.city.addEventListener('change', function() {
    validCity(this)
});

const validCity = function(inputCity) {
    let errorCity = document.getElementById('cityErrorMsg')

    if(regularRegExp.test(inputCity.value)) {
        errorCity.innerHTML = '';
    } else {
        errorCity.innerHTML = 'Veuillez entrez un champ valide';
    };
};

// 5 - Ecouter la modification de EMAIL
form.email.addEventListener('change', function() {
    validEmail(this)
});

const validEmail = function(inputEmail) {
    let errorMail = document.getElementById('emailErrorMsg')

    if(emailRegExp.test(inputEmail.value)) {
        errorMail.innerHTML = '';
    } else {
        errorMail.innerHTML = 'Adresse Non Valide';
    };
};





///// ----- Post Request ----- /////

// recuperation du formulaire


function initCommanderButtonEvent () {
    //API
    let url = "http://localhost:3000/api/products/order";
    
    //Ecoute de l'event sur le bouton
    let btnOrder = document.getElementById('order');

    btnOrder.addEventListener('click', function(event) {
        //recuperation du formulaire
        let formFirstName = document.getElementById('firstName');
        let formLastName = document.getElementById('lastName');
        let formAddress = document.getElementById('address');
        let formCity = document.getElementById('city');
        let formEmail = document.getElementById('email');

        // construction array localStorage
        let orderProducts = [];
        for (let i = 0; i<getProducts.length;i++) {
            orderProducts.push(getProducts[i].id);
        }

        // objet de commande
        let order = {
            contact : {
                firstName: formFirstName.value,
                lastName: formLastName.value,
                address: formAddress.value,
                city: formCity.value,
                email: formEmail.value,
            },
            products: orderProducts,
        };

        // method POST
        const options = {
            method: 'POST',
            body: JSON.stringify(order),
            headers: {
                'Accept': 'application/json',
                "Content-Type": "application/json" 
            },
        };

        // requête API
        fetch(url, options)
        .then((response) => response.json())
        .then((data) => {
            localStorage.clear();
            localStorage.setItem("orderId", data.orderId);

            document.location.href = "confirmation.html";
        })
        .catch((err) => {
            alert ("Problème avec fetch : " + err.message);
        });
    });
};
initCommanderButtonEvent();




