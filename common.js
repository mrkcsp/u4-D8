//endpoint da contattare e token da utilizzare per la fetch
const endpoint = "https://striveschool-api.herokuapp.com/api/product/";
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDJkYWY1Y2IxNGE1MTAwMTQ2NjQwMDkiLCJpYXQiOjE2ODExNTI2NDQsImV4cCI6MTY4MjM2MjI0NH0.Pl3hsHVUy7F7dDrgRIO_OB15mi46x0QPeTrNYOyJ1gk";

//funzione che recupera i prodotti dall'endpoint
const getProducts = async () => {
  let products;
  try {
    showLoader();
    await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => (products = data));
    hideLoader();
    return products;
  } catch (error) {
    console.log(error);
  }
};

//funzione che mostra il loader
const showLoader = () => {
  const loader = document.querySelector("div.lds-ring");
  loader.classList.remove("d-none");
};

//funzione che nasconde il loader
const hideLoader = () => {
  const loader = document.querySelector("div.lds-ring");
  loader.classList.add("d-none");
};
