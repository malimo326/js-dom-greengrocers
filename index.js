const state = {
  items: [
    {
      id: "001-beetroot",
      name: "beetroot",
      type: "vegetable",
      price: 1.35
    },
    {
      id: "002-carrot",
      name: "carrot",
      type: "vegetable",
      price: 2.35
    },
    {
      id: "003-apple",
      name: "apple",
      type: "fruit",
      price: 3.35
    },
    {
      id: "004-apricot",
      name: "apricot",
      type: "fruit",
      price: 4.35
    },
    {
      id: "005-avocado",
      name: "avocado",
      type: "fruit",
      price: 5.35
    },
    {
      id: "006-bananas",
      name: "bananas",
      type: "fruit",
      price: 6.35
    },
    {
      id: "007-bell-pepper",
      name: "bell pepper",
      type: "vegetable",
      price: 0.65
    },
    {
      id: "008-berry",
      name: "berry",
      type: "berry",
      price: 0.25
    },
    {
      id: "009-blueberry",
      name: "blueberry",
      type: "berry",
      price: 0.35
    },
    {
      id: "010-eggplant",
      name: "eggplant",
      type: "fruit",
      price: 0.45
    }
  ],
  cart: []
};


const ulGrocersDisplay = document.querySelector(".store--item-list");
const ulCartList = document.querySelector(".cart--item-list");
const totalNumber = document.querySelector(".total-number");
const filterButtons = document.querySelector(".filter-buttons");
const sortButtons = document.querySelector(".sort-buttons");

var filterState = "All";
var sortState = "None";


function AddToCart(event, item) {


  if (state.cart.filter((e) => e.name === item.name).length > 0) {
    var index = state.cart
      .map(function (e) {
        return e.name;
      })
      .indexOf(item.name);

    state.cart[index].itemCount++;
    renderCartData();
  } else {
    const itemObj = {
      img: `${item.id}.svg`,
      name: item.name,
      price: item.price,
      type: item.type,
      itemCount: 1,
    };
    state.cart.push(itemObj);

    renderCartData();
  }
}


function handleAddToCart(event, item) {
  AddToCart(event, item);
  renderTotal();
}

function handleRemoveOneItem(item) {
  item.itemCount = item.itemCount - 1;

  if (item.itemCount < 1) {
    var index = state.cart.indexOf(item);
    state.cart.splice(index, 1);
  }
  renderCartData();
  renderTotal();
}

function handleAddOneItem(item) {
  item.itemCount = item.itemCount + 1;
  renderCartData();
  renderTotal();
}

function handleFilterItems(type) {
  filterState = type;
  renderGroceryData(state.items, filterState, sortState);
}

function handleSortItems(sort) {
  sortState = sort;
  renderGroceryData([...state.items], filterState, sortState);
}


function createGroceryImage(item) {

  const li = document.createElement("li");
  const img = document.createElement("img");
  img.setAttribute("id", `${item.id}`);
  img.setAttribute("class", "item--img");
  img.setAttribute("alt", "grocery image");

  const button = document.createElement("button");
  button.innerText = "ADD TO CART";
  button.addEventListener("click", (event) => handleAddToCart(event, item));
 
  img.setAttribute("src", `assets/icons/${item.id}.svg`);

  li.appendChild(img);
  li.appendChild(button);

  return li;
}

function renderTotal() {
  totalNumber.innerHTML = "";
  var total = 0;
  state.cart.forEach((item) => {
    total = total + item.price * item.itemCount;
  });

  const p = document.createElement("p");
  var roundTotal = total.toFixed(2);
  p.innerText = `£${roundTotal}`;
  totalNumber.appendChild(p);
}

function renderFilterButtons() {
  filterButtons.innerHTML = "";

  const p = document.createElement("p");
  p.setAttribute("style", "text-align:center");

  var list = [...new Set(state.items.map((item) => item.type))];
  list.push("All");

  list.forEach((type) => {
    const filterButton = document.createElement("button");
    filterButton.innerText = `${type}`;
    filterButton.addEventListener("click", () => handleFilterItems(type));
    p.appendChild(filterButton);
  });

  filterButtons.appendChild(p);
}

function renderSortButtons() {
  sortButtons.innerHTML = "";

  const p = document.createElement("p");
  p.setAttribute("style", "text-align:center");

  var list = ["Alphabetical","Price", "None"];

  list.forEach((sort) => {
    const sortButtons = document.createElement("button");
    sortButtons.innerText = `${sort}`;
    sortButtons.addEventListener("click", () => handleSortItems(sort));
    p.appendChild(sortButtons);
  });

  sortButtons.appendChild(p);
}

function renderCartData() {
  ulCartList.innerHTML = "";

  state.cart.forEach((item) => {
    const li = document.createElement("li");

    // image
    const img = document.createElement("img");
    img.setAttribute("class", "cart--item-icon");
    img.setAttribute("src", `assets/icons/${item.img}`);
    img.setAttribute("alt", `${item.name}`);

    const p = document.createElement("p");
    p.innerText = `${item.name}`;

    const buttonMinus = document.createElement("button");
    buttonMinus.setAttribute("class", "quantity-btn remove-btn center");
    buttonMinus.innerText = "-";
    buttonMinus.addEventListener("click", () => handleRemoveOneItem(item));

    const span = document.createElement("span");
    span.setAttribute("class", "quantity-text center");
    span.innerText = `${item.itemCount}`;

    const buttonPlus = document.createElement("button");
    buttonPlus.setAttribute("class", "quantity-btn add-btn center");
    buttonPlus.innerText = "+";
    buttonPlus.addEventListener("click", () => handleAddOneItem(item));

    li.appendChild(img);
    li.appendChild(p);
    li.appendChild(buttonMinus);
    li.appendChild(span);
    li.appendChild(buttonPlus);

    ulCartList.appendChild(li);
  });
}

function AlphabeticalOrder(data) {
  return data.sort(function (a, b) {
    var textA = a.name;
    var textB = b.name;
    return textA < textB ? -1 : textA > textB ? 1 : 0;
  });
}

function renderGroceryData(data, type, sort) {
  ulGrocersDisplay.innerHTML = "";

  if (type !== "All" && sort !== "None") {
    data = AlphabeticalOrder(data);
    data
      .sort((a, b) => a.name.localeCompare(b.name))
      .filter((e) => e.type === type)
      .forEach((item) => {
        const pel = createGroceryImage(item);
        // add these li for each item in the ul
        ulGrocersDisplay.appendChild(pel);
      });
  } else if (type !== "All" && sort === "None") {
    data
      .filter((e) => e.type === type)
      .forEach((item) => {
        const pel = createGroceryImage(item);
        // add these li for each item in the ul
        ulGrocersDisplay.appendChild(pel);
      });
  } else if (type === "All" && sort !== "None") {
    data = AlphabeticalOrder(data);
    data.forEach((item) => {
      const pel = createGroceryImage(item);
      // add these li for each item in the ul
      ulGrocersDisplay.appendChild(pel);
    });
  } else {
    data.forEach((item) => {
      const pel = createGroceryImage(item);
      // add these li for each item in the ul
      ulGrocersDisplay.appendChild(pel);
    });
  }
}

function sortByPrice(data) {
  return data.sort((a, b) => a.price - b.price);
}

function renderGroceryData(data, type, sort) {
  ulGrocersDisplay.innerHTML = "";

  if (type !== "All") {
    data = data.filter((e) => e.type === type);
  }

  if (sort === "Price") {
    data = sortByPrice(data);
  } else if (sort === "Alphabetical") {
    data = data.sort((a, b) => a.name.localeCompare(b.name));
  }

  data.forEach((item) => {
    const pel = createGroceryImage(item);
    ulGrocersDisplay.appendChild(pel);
  });
}

renderFilterButtons();
renderSortButtons();
renderGroceryData(state.items, filterState, sortState);
