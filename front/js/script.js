
let productDatas = [];

function fetchProduct() { 
    fetch("http://localhost:3000/api/products")
        .then(function(res) {
            if (res.ok) {
                return res.json();
            }
        })
        .then(function(productDatas) {
            for (let productData of productDatas) {
                const items = document.getElementById('items');
                items.innerHTML += 
                    `<a href="./product.html?id=${productData._id}">
                        <article>
                          <img src="${productData.imageUrl}" alt="${productData.altTxt}">
                          <h3 class="productName">${productData.name}</h3>
                          <p class="productDescription">${productData.description}</p>
                        </article>
                    </a> `;
            };
        })
        .catch(function(err) {
            // Une erreur est survenue
        });
}

fetchProduct();

















