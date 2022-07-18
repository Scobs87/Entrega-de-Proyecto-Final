let inventarioDiscos = [];

///////////////////////////////////////////////////////////////
//FUNCION DONDE SE MUESTRAN LOS DISCOS
const contenedor = document.querySelector("#contenedor");

const mostrarLosDiscos = () => {
  inventarioDiscos.forEach((disco) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
  
        <img src="${disco.cover}" alt="" />
        <h4 class="cardArtista">${disco.artista} </h4>
        <p class="cardAlbum bold"> ${disco.album} </p>
        <p class="cardGenero"> ${disco.genero} </p>
        <span class="cardPrecio bold">$${disco.precio} </span>
        <button data-id="${disco.artista}" class="botonSelect">Seleccionar disco</button>
     
  `;
    contenedor.append(card);
  });
  eventosEscuchados();
};

let carrito = [];

///////////////////////////////////////////////////////////
// FUNCION PARA AGREGAR DISCOS AL CARRITO

const agregarDisco = (e) => {
  const discoSeleccionado = e.target.getAttribute("data-id");

  const elDisco = inventarioDiscos.find(
    (elDisco) => elDisco.artista == discoSeleccionado
  );

  carrito.push(elDisco);
  totalCost(elDisco);

  Toastify({
    text: "Album seleccionado!",
    duration: 3000,
    newWindow: true,
    close: false,
    gravity: "top",
    position: "left",
    stopOnFocus: false,
    style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)",
    },
    onClick: function () {},
  }).showToast();

  mostrarCarrito();

  localStorage.setItem("carrito", JSON.stringify(carrito));
};

//////////////////////////////////////////////////////////////////////
// FUNCION DE EVENTOS

const eventosEscuchados = () => {
  const boton = document.querySelectorAll(".botonSelect");
  boton.forEach((boton) => {
    boton.addEventListener("click", agregarDisco);
  });
};

/////////////////////////////////////////////////////////////////////
//MOSTRANDO EL CARRITO

const cartContenedor = document.querySelector("#cartContenedor tbody");

const mostrarCarrito = () => {
  cartContenedor.innerHTML = "";
  carrito.forEach((disco) => {
    const tr = document.createElement("tr");
    tr.className = "cartRow";
    tr.innerHTML = `
        <th scope="row">1</th>
              <td class="table__cover">
                <img src="${disco.cover}" alt="" />
              </td>
              <td class="table__album">${disco.album}</td>
              <td class="table__artista">${disco.artista}</td>
              <td class="table__genero"> ${disco.genero}</td>
              <td class="table__precio"><p>$${disco.precio}</p></td>
              <td class="table__cantidad">
            
                <button data-id= "${disco.album}" id="botonX" class="delete btn btn-danger">X</button>
              </td>
        `;
    cartContenedor.append(tr);
  });

  eliminarDisco();
  const totalDiscoRemovido = localStorage.getItem("totalCost");

  const discoCartTotal = document.querySelector(".itemCartTotal");
  discoCartTotal.innerHTML = `Total $${totalDiscoRemovido}`;
};

////////////////////////////////////////////////////////////////////////////////////////
//ELIMINANDO DISCO
const eliminarDisco = () => {
  const botonBorrar = document.querySelectorAll("#botonX");
  botonBorrar.forEach((button) => {
    button.addEventListener("click", (e) => {
      const dataDisco = e.target.getAttribute(`data-id`);
      let precioDisco;
      carrito = carrito.filter((unDisco) => {
        if (unDisco.album == dataDisco && !precioDisco) {
          precioDisco = unDisco.precio;
          return false;
        }
        return true;
      });

      e.target.parentElement.parentElement.remove();

      localStorage.setItem("carrito", JSON.stringify(carrito));
      const cartTotal = localStorage.getItem("totalCost");

      localStorage.setItem("totalCost", cartTotal - precioDisco);
      const totalDiscoRemovido = localStorage.getItem("totalCost");

      const discoCartTotal = document.querySelector(".itemCartTotal");
      discoCartTotal.innerHTML = `Total $${totalDiscoRemovido}`;

      Toastify({
        text: "Album removido!",
        duration: 3000,
        newWindow: true,
        close: false,
        gravity: "top",
        position: "left",
        stopOnFocus: false,
        style: {
          background: "linear-gradient(to right, #5c5c5c, #fd1d1d)",
        },
        onClick: function () {},
      }).showToast();
    });
  });
};

if (localStorage.getItem("carrito")) {
  carrito = JSON.parse(localStorage.getItem("carrito"));

  mostrarCarrito();
}

///////////////////////////////////////////////////////////////////////////////////
//TOTAL DEL CARRITO
const totalCost = (disco) => {
  const discoCartTotal = document.querySelector(".itemCartTotal");
  let cartTotal = localStorage.getItem("totalCost");
  cartTotal = Number(cartTotal);
  if (cartTotal != null) {
    localStorage.setItem("totalCost", cartTotal + disco.precio);
  } else {
    localStorage.setItem("totalCost", disco.precio);
  }
  cartTotal = localStorage.getItem("totalCost");
  discoCartTotal.innerHTML = `Total $${cartTotal}`;
};

////////////////////////////////////////////////////////////////////////////////////////
//EL FETCH

fetch("./discos.json")
  .then((res) => res.json())
  .then((jsonResponse) => {
    inventarioDiscos = jsonResponse.data;
    mostrarLosDiscos(inventarioDiscos);
  });
