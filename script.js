let ol = document.querySelector('ol.cart__items');

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'),
  );

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  event.target.remove();
  const id = event.target.innerText.split(' ')[1];
  localStorage.removeItem(id);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function fetchElement(url) {
  const array = [];
   await fetch(url)
        .then((bites) => bites.json())
        .then((promise) => promise.results)
        .then((results) =>
          results.forEach((result) => {
            const obj = {
              sku: result.id,
              name: result.title,
              image: result.thumbnail,
            };
            const item = createProductItemElement(obj);
            document.querySelector('section.items').appendChild(item);
            array.push(obj);
          }));
          return array;
}

const createCart = async (url) => {
  const lista = await fetchElement(url);  
  console.log(lista); 
    const buttons = document.querySelectorAll('section.items button.item__add');
    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const id = getSkuFromProductItem(button.parentElement);
        fetch(`https://api.mercadolibre.com/items/${id}`).then((bites) => bites.json())
        .then((results) => {
         const obj = { sku: results.id, 
            name: results.title,
            salePrice: results.price,
          };
          ol.appendChild(createCartItemElement(obj));
          localStorage[obj.sku] = JSON.stringify(obj);
        });
      });
      // console.log(lista[index]);
    });
};

const createListFromLocalStorage = () => {
  Object.keys(localStorage).forEach((key) => {
    const obj = JSON.parse(localStorage[key]);
    ol.appendChild(createCartItemElement(obj));
  });
};

// fetchElement('https://api.mercadolibre.com/sites/MLB/search?q=$computador');
window.onload = () => {
  ol = document.querySelector('ol.cart__items');
  createCart('https://api.mercadolibre.com/sites/MLB/search?q=$computador');
  ol.addEventListener('click', cartItemClickListener);
  createListFromLocalStorage();
};
