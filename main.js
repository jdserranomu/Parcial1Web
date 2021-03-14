const urlData =
  "https://gist.githubusercontent.com/josejbocanegra/9a28c356416badb8f9173daf3" +
  "6d1460b/raw/5ea84b9d43ff494fcbf5c5186544a18b42812f09/restaurant.json";

const navigationBar = document.getElementById("navigation-bar");
const centralRegion = document.getElementById("central-region");
const centralRegionTitle = document.getElementById("category-name");
let cartElements = {};
const cartLink = document.getElementById("cart-click");
let count = 0;
let selectedCategory = undefined;
const btnCancel = document.getElementById("yes-cancel");
btnCancel.onclick = eraseAll;

cartLink.onclick = onCartClick;

const cardExample =
  "<div class='card'>\n" +
  "                    <img class='card-img-top' src='//image//' alt='//alt//'>\n" +
  "                    <div class='card-body'>\n" +
  "                        <h3 class='card-title'>//name//</h3>\n" +
  "                        <p class='card-text'>//description//</p>\n" +
  "                        <h4>//price//</h4>\n" +
  "                        <a href='#' class='btn' id='//id//'>Add to Cart</a>\n" +
  "                    </div>\n" +
  "                </div>\n";

const tableContent =
  "  <thead>\n" +
  "    <tr>\n" +
  "      <th scope='col'>Item</th>\n" +
  "      <th scope='col'>Qty.</th>\n" +
  "      <th scope='col'>Description</th>\n" +
  "      <th scope='col'>Unit Price</th>\n" +
  "      <th scope='col'>Amount</th>\n" +
  "      <th scope='col'>Modify</th>\n" +
  "    </tr>\n" +
  "  </thead>\n" +
  "  <tbody>\n" +
  "  </tbody>";

const promesaData = new Promise((resolve, reject) => {
  let req = new XMLHttpRequest();
  req.open("GET", urlData);
  req.onload = function () {
    if (req.status === 200) {
      resolve(JSON.parse(req.response));
    } else {
      reject("No se recibió el detalle");
    }
  };
  req.send();
});

promesaData
  .then((categorias) => {
    categorias.forEach((categoria, i) => {
      let listItem = document.createElement("li");
      listItem.setAttribute("class", "nav-item");
      let link = document.createElement("a");
      link.setAttribute("class", "nav-link");
      link.textContent = categoria.name;
      listItem.appendChild(link);
      navigationBar.appendChild(listItem);
      link.onclick = onClickCategory(categoria);
      if (i === 0) {
        onClickCategory(categoria)();
        updateCount();
      }
    });
  })
  .catch((err) => console.log(err));

function onClickCategory(category) {
  return () => {
    selectedCategory = category.name;
    centralRegion.innerHTML = "";
    centralRegionTitle.textContent = selectedCategory;
    category.products.forEach((product, id) => {
      const column = document.createElement("div");
      column.className = "col-3";
      column.innerHTML = createFoodCard(product, id);
      centralRegion.appendChild(column);
      const btn = document.getElementById("btn-" + id);
      btn.onclick = buttonAdd(product);
    });
  };
}

function createFoodCard(product, id) {
  let card = cardExample;
  card = card.replace("//name//", product.name);
  card = card.replace("//description//", product.description);
  card = card.replace("//image//", product.image);
  card = card.replace("//price//", "$ " + product.price);
  card = card.replace("//id//", "btn-" + id);
  card = card.replace("//alt//", "imagen-" + id);
  return card;
}

function buttonAdd(product) {
  return () => {
    if (cartElements[product.name]) {
      cartElements[product.name]["count"]++;
    } else {
      product = Object.assign(product, {});
      product["count"] = 1;
      cartElements[product.name] = product;
    }
    count++;
    updateCount();
    if (!selectedCategory) {
      onCartClick();
    }
  };
}

function buttonRemove(product) {
  return () => {
    if (cartElements[product.name]["count"] > 1) {
      cartElements[product.name]["count"]--;
    } else {
      delete cartElements[product.name];
    }
    count--;
    updateCount();
    onCartClick();
  };
}

function updateCount() {
  const countSpan = document.getElementById("cart-count");
  countSpan.innerHTML = count + "";
}

function onCartClick() {
  selectedCategory = undefined;
  centralRegion.innerHTML = "";
  centralRegionTitle.textContent = "Order Detail";
  const table = document.createElement("table");
  table.className = "table table-striped text-color-blue";
  table.innerHTML = tableContent;
  let body = table.childNodes[3];
  let grandTotal = 0;
  Object.values(cartElements).forEach((product, item) => {
    let totalProduct = product.count * product.price;
    const row = document.createElement("tr");
    row.innerHTML =
      `<th>${item + 1}</th>\n` +
      `      <td>${product.count}</td>\n` +
      `      <td>${product.name}</td>\n` +
      `      <td>${product.price}</td>\n` +
      `      <td>${totalProduct.toFixed(2)}</td>\n`;
    const columnButtons = document.createElement("td");
    let btn = document.createElement("button");
    btn.className =
      "btn btn-light back-ground-color-almost-white text-color-white add-remove-button";
    btn.textContent = "+";
    btn.onclick = buttonAdd(product);
    columnButtons.appendChild(btn);
    btn = document.createElement("button");
    btn.className =
      "btn btn-light back-ground-color-almost-white text-color-white add-remove-button";
    btn.textContent = "-";
    btn.onclick = buttonRemove(product);
    columnButtons.appendChild(btn);
    row.appendChild(columnButtons);
    body.appendChild(row);
    grandTotal += totalProduct;
  });
  centralRegion.appendChild(table);
  appendTotal(grandTotal);
}

function appendTotal(grandTotal) {
  let element = document.createElement("div");
  element.className = "mr-auto p-2 text-color-blue bold-total";
  element.textContent = "Total: $" + grandTotal.toFixed(2);
  centralRegion.appendChild(element);
  element = document.createElement("button");
  element.className = "btn back-ground-color-red btn-order";
  element.textContent = "Cancel";
  element.setAttribute("data-toggle", "modal");
  element.setAttribute("data-target", "#modal-cancel");
  centralRegion.appendChild(element);
  element = document.createElement("button");
  element.className = "btn btn-order";
  element.textContent = "Confirm Order";
  element.onclick = () => {
    let newList = Object.values(cartElements).map((item, i) => {
      let newItem = {};
      newItem.item = i + 1;
      newItem.quantity = item.count;
      newItem.description = item.name;
      newItem.unitPrice = item.price;
      return newItem;
    });
    console.log(newList);
    eraseAll();
  };
  centralRegion.appendChild(element);
}

function eraseAll() {
  cartElements = [];
  count = 0;
  updateCount();
  onCartClick();
}
