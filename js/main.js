const API = "http://localhost:8000/products";
let addProd = document.querySelector(".addProd");
let inpProducts = document.querySelector(".inpProducts");
let closeBtn = document.querySelector(".closeBtn");
let inpImg = document.querySelector(".inpImg");
let select = document.querySelector(".select");
let inpName = document.querySelector(".inpName");
let inpPrice = document.querySelector(".inpPrice");
let prodSection = document.querySelector(".prodSection");
let addBtn = document.querySelector(".addBtn");
let editBtn = document.querySelector(".editBtn");
let viewProd = document.querySelector(".viewProd");
let viewCardProducts = document.querySelector(".viewCardProducts");
let currentPage = 1;
let countPage = 1;
let prevBtn = document.querySelector(".prevBtn");
let nextBtn = document.querySelector(".nextBtn");
let inpSearch = document.querySelector(".inpSearch");
let searchValue = "";

addProd.addEventListener("click", () => {
  inpProducts.style.display = "block";
});

closeBtn.addEventListener("click", () => {
  inpProducts.style.display = "none";
});

addBtn.addEventListener("click", () => {
  if (!inpImg.value.trim() || !inpName.value.trim() || !inpPrice.value.trim())
    return;
  let newProd = {
    prodImg: inpImg.value,
    prodCateg: select.value,
    prodName: inpName.value,
    prodPrice: inpPrice.value,
  };
  createProd(newProd);
  readProd();
});

function createProd(prod) {
  fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(prod),
  });
  inpImg.value = "";
  inpName.value = "";
  inpPrice.value = "";
}

async function readProd() {
  const res = await fetch(
    `${API}?q=${searchValue}&_page=${currentPage}&_limit=5`
  );
  const data = await res.json();
  prodSection.innerHTML = "";
  data.forEach((elem) => {
    prodSection.innerHTML += `
    <div class="cardProducts">
    <img src="${elem.prodImg}" alt="image" class="imgProd" id="${elem.id}"/>
    <hr />
    <span>Категория: ${elem.prodCateg}</span>
    <p>Имя: ${elem.prodName}</p>
    <span>Цена: ${elem.prodPrice} KGS</span>
    <div class="ActBtns">
      <button class="actBtn viewBtn" type="button" id="${elem.id}">
        <img src="./images/view.png" alt="image" id="${elem.id}" class="viewBtn"/>
      </button>
      <button class="actBtn editBtn" type="button" id="${elem.id}">
       <img src="./images/edit.png" alt="image" id="${elem.id}" class="editBtn"/>
      </button>
      <button class="actBtn delBtn" type="button" id="${elem.id}">
        <img src="./images/bin (1).png" alt="image" id="${elem.id}" class="delBtn" />
      </button>
      </div>
      <div class="bucketBtns">
      <button type="button" id="${elem.id}" class="bucketBtn">В корзину</button>
      </div>
  </div>`;
  });
  pageFunc();
}

readProd();

document.addEventListener("click", (e) => {
  let del_class = [...e.target.classList];
  if (del_class.includes("delBtn")) {
    let del_id = e.target.id;
    fetch(`${API}/${del_id}`, {
      method: "DELETE",
    }).then(() => readProd());
  }
});

let editInpImg = document.querySelector(".editInpImg");
let editSelect = document.querySelector(".editSelect");
let editInpName = document.querySelector(".editInpName");
let editInpPrice = document.querySelector(".editInpPrice");
let editInpProducts = document.querySelector(".editInpProducts");
let editCloseBtn = document.querySelector(".editCloseBtn");
let editAddBtn = document.querySelector(".editAddBtn");

editCloseBtn.addEventListener("click", () => {
  editInpProducts.style.display = "none";
});

document.addEventListener("click", (e) => {
  let arr = [...e.target.classList];
  if (arr.includes("editBtn")) {
    editInpProducts.style.display = "block";
    let id = e.target.id;
    fetch(`${API}/${id}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        editInpImg.value = data.prodImg;
        // editSelect.value = data.prodSelect;
        editInpName.value = data.prodName;
        editInpPrice.value = data.prodPrice;
        editAddBtn.setAttribute("id", data.id);
      });
  }
});

editAddBtn.addEventListener("click", () => {
  let editedProd = {
    prodImg: editInpImg.value,
    prodCateg: editSelect.value,
    prodName: editInpName.value,
    prodPrice: editInpPrice.value,
  };
  editProd(editedProd, editAddBtn.id);
});

function editProd(editProd, id) {
  fetch(`${API}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(editProd),
  }).then(() => readProd());
}
readProd();

function pageFunc() {
  fetch(`${API}?q=${searchValue}`)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      countPage = Math.ceil(data.length / 5);
    });
}

currentPage = 1;
inpSearch.addEventListener("input", (e) => {
  searchValue = e.target.value.trim();
  readProd();
});

prevBtn.addEventListener("click", () => {
  if (currentPage <= 1) return;
  currentPage--;
  readProd();
});

nextBtn.addEventListener("click", () => {
  if (currentPage >= countPage) return;
  currentPage++;
  readProd();
});

document.addEventListener("click", (e) => {
  let classImg = [...e.target.classList];
  if (classImg.includes("viewBtn")) {
    details(e.target.id);
    prodSection.style.display = "none";
    viewProd.style.display = "block";
  }
});
details();

async function details(id) {
  const res = await fetch(`${API}/${id}`);
  const data = await res.json();
  displayDetails(data);
}

function displayDetails(data) {
  viewProd.innerHTML = ` <div class="cardProducts">
  <img src="${data.prodImg}" alt="image" class="imgProd" id="${data.id}"/>
  <hr />
  <span>Категория: ${data.prodCateg}</span>
  <p>Имя: ${data.prodName}</p>
  <span>Цена: ${data.prodPrice} KGS</span>
  <div class="exitBtns">
  <button type="button" class="exitBtn">Назад</button>
  </div>
</div>
`;
}

document.addEventListener("click", (e) => {
  let classBtn = [...e.target.classList];
  if (classBtn.includes("exitBtn")) {
    viewProd.style.display = "none";
    prodSection.style.display = "flex";
  }
});
