let productSelected = null;

//Aggiunge un nuovo prodotto
const addNewProduct = async (name, desc, brand, imgUrl, price) => {
  let data;
  const myProduct = {
    name: name,
    description: desc,
    brand: brand,
    imageUrl: imgUrl,
    price: price,
  };
  try {
    showLoader();
    await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(myProduct),
    })
      .then((response) => response.json())
      .then((result) => (data = result));

    hideLoader();
    return data;
  } catch (error) {
    console.log(error);
  }
};

//Resetta i campi
const resetFields = () => {
  document.getElementById("name").value = "";
  document.getElementById("description").value = "";
  document.getElementById("brand").value = "";
  document.getElementById("imgUrl").value = "";
  document.getElementById("price").value = "";
};

//Creo la tabella dei prodotti
const createTable = (products, tbody) => {
  products.forEach((item) => {
    const tr = document.createElement("tr");
    const nameCol = document.createElement("td");
    nameCol.innerText = item.name;
    const descrCol = document.createElement("td");
    descrCol.innerText = item.description;
    const brandCol = document.createElement("td");
    brandCol.innerText = item.brand;
    const imgCol = document.createElement("td");
    imgCol.innerText = item.imageUrl;
    imgCol.style.overflow = "hidden";
    imgCol.style.textOverflow = "ellipsis";
    imgCol.style.maxWidth = "6rem";
    const priceCol = document.createElement("td");
    priceCol.innerText = item.price;
    const editCol = document.createElement("td");
    const editButton = document.createElement("button");
    editButton.innerText = "Edit";
    editButton.type = "button";
    editButton.setAttribute("data-bs-toggle", "modal");
    editButton.setAttribute("data-bs-target", "#editModal");
    editButton.classList.add("btn", "btn-success");
    editButton.addEventListener("click", () => {
      sendToDialog(item);
    });
    editCol.append(editButton);
    const deleteCol = document.createElement("td");
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("btn", "btn-danger");
    deleteButton.innerText = "Delete";
    deleteButton.addEventListener("click", async () => {
      if (confirm("Vuoi eliminare l'elemento selezionato?")) {
        await deleteProduct(item._id);
        window.location.reload();
      }
    });
    deleteCol.append(deleteButton);
    tr.append(
      nameCol,
      descrCol,
      brandCol,
      imgCol,
      priceCol,
      editCol,
      deleteCol
    );
    tbody.append(tr);
  });
};

//Elimina un prodotto
const deleteProduct = async (id) => {
  try {
    showLoader();
    await fetch(endpoint + id, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((result) => console.log(result));
    hideLoader();
  } catch (error) {
    console.log(err);
  }
};

//Riempio il modal
const sendToDialog = (product) => {
  const inputs = document.querySelectorAll(".modal-body > input");
  console.log(inputs);
  inputs[0].value = product.name;
  inputs[1].value = product.description;
  inputs[2].value = product.brand;
  inputs[3].value = product.imageUrl;
  inputs[4].value = product.price;
  productSelected = product;
};

//Modifica un prodotto
const saveChange = async (inputs) => {
  const id = productSelected._id;
  const myProduct = {
    name: inputs[0].value,
    description: inputs[1].value,
    brand: inputs[2].value,
    imageUrl: inputs[3].value,
    price: parseFloat(inputs[4].value),
  };

  try {
    showLoader();
    await fetch(endpoint + id, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify(myProduct),
    })
      .then((response) => response.json())
      .then((result) => console.log(result));
    productSelected = null;
    hideLoader();
  } catch (error) {
    console.log(error);
  }
};

//Verifico se i campi sono tutti compilati
const checkInputs = (inputs) => {
  for (let input of inputs) {
    if (input.value === "") {
      return false;
    }
  }
  return true;
};

//Validazione del prezzo
const checkPrice = (input) => {
  if (!isNaN(input.value)) {
    //il valore inserito è un numero
    return true;
  }
  return false;
};

//Validazione dei dati
const validate = (inputs) => {
  if (checkInputs(inputs) && checkPrice(inputs[inputs.length - 1])) {
    return true;
  } else {
    if (!checkInputs(inputs)) {
      return "Alcuni campi non sono compilati";
    } else {
      return "Il prezzo inserito non è valido";
    }
  }
};

//Inizializzazione della pagina
const init = async () => {
  const addButton = document.getElementById("add");
  //imposto un listener associato al pulsante di aggiunta del prodotto
  addButton.addEventListener("click", async () => {
    //recupero gli input del form
    const inputs = document.querySelectorAll(".form > input");
    //verifico la consistenza dei dati
    const check = validate(inputs);
    if (check === true) {
      //recupero le informazioni del prodotto inserite dall'utente
      const name = inputs[0].value;
      const description = inputs[1].value;
      const brand = inputs[2].value;
      const imgUrl = inputs[3].value;
      const price = inputs[4].value;
      //aggiungo il nuovo prodotto
      const data = await addNewProduct(
        name,
        description,
        brand,
        imgUrl,
        parseFloat(price)
      );
      //reset dei campi
      resetFields();
      window.location.reload();
    } else {
      //alert che appare in caso di problemi con i dati
      alert(check);
    }
  });
  const saveButton = document.querySelectorAll(".modal-footer > button")[1];
  saveButton.addEventListener("click", async () => {
    const inputs = document.querySelectorAll(".modal-body > input");
    const check = validate(inputs);
    if (check === true) {
      const modal = new bootstrap.Modal("#editModal");
      await saveChange(inputs);
      modal.hide();
      window.location.reload();
    } else {
      //alert che appare in caso di problemi con i dati
      alert(check);
    }
  });
  const products = await getProducts();
  const tbody = document.getElementsByTagName("tbody")[0];
  createTable(products, tbody);
};

init();
