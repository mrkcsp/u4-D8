const container = document.querySelector(".container");

//Recupero le informazioni del prodotto
const getProductData = async (id) => {
  let product;
  try {
    showLoader();
    await fetch(endpoint + id, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => (product = data));
    hideLoader();
    return product;
  } catch (error) {
    console.log(error);
  }
};

//Creo la card
const createCard = (product, container) => {
  let card = document.createElement("div");
  card.classList.add("card", "mb-3");
  let row = document.createElement("div");
  row.classList.add("row", "g-0");
  let col = document.createElement("div");
  col.classList.add("col-md-4");
  let img = document.createElement("img");
  img.classList.add("img-fluid", "rounded-start");
  img.src = product.imageUrl;
  let col2 = document.createElement("div");
  col2.classList.add("col-md-8");
  let cBody = document.createElement("div");
  cBody.classList.add("card-body");
  let h = document.createElement("h5");
  h.classList.add("card-title");
  h.innerText = "Nome:  " + product.name;
  let p = document.createElement("p");
  p.classList.add("card-text");
  p.innerText = "Descrizione:  " + product.description;
  let p2 = document.createElement("p");
  p2.classList.add("card-text");
  p2.innerText = "Prezzo:  " + product.price;
  let p3 = document.createElement("p");
  p3.classList.add("card-text");
  let sm = document.createElement("small");
  sm.classList.add("text-body-secondary");
  sm.innerText = "Brand:  " + product.brand;

  container.append(card);
  card.append(row);
  row.append(col, col2);
  col.append(img);
  col2.append(cBody);
  cBody.append(h, p, p2, p3);
  p3.append(sm);
};

//Inizializzazione della pagina
const init = async () => {
  const params = new URLSearchParams(window.location.search);
  const param = params.get("id");
  //recupero i dati dall'API
  let product = await getProductData(param);
  createCard(product, container);
};

init();
