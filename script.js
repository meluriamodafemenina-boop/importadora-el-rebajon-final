// IMPORTADORA EL REBAJÓN
const WHATSAPP_NUMBER = "573147636825";

const products = [
  {
    id: "aspiradora",
    name: "Aspiradora Inalámbrica TOTAL 20V",
    price: 127000,
    oldPrice: 175000,
    images: [
      "aspiradora-1.jpg",
      "aspiradora-2.jpg",
      "aspiradora-3.jpg",
      "aspiradora-4.jpg"
    ],
    desc: "Potente, práctica y sin cables. Ideal para carro, hogar, oficina y limpieza diaria.",
    features: [
      "Sistema inalámbrico 20V",
      "Depósito de 0,5 L",
      "Diseño compacto y portátil",
      "Marca TOTAL"
    ]
  },

  {
    id: "linterna",
    name: "Linterna SOFIRN SD06",
    price: 89999,
    oldPrice: 119999,
    images: [
      "linterna-1.jpg",
      "linterna-2.jpg"
    ],
    desc: "Linterna de alto rendimiento para exteriores, trabajo, camping y emergencias.",
    features: [
      "Hasta 3200 lúmenes",
      "Alcance de hasta 470 m",
      "Resistencia al agua IPX8",
      "Incluye cargador y accesorios"
    ]
  },

  {
    id: "instax",
    name: "Fujifilm Instax Mini 12",
    price: 269000,
    oldPrice: 389000,
    images: [
      "Instax-rosa-1.jpg",
      "Instax-rosa-2.jpg",
      "Instax-rosa-3.jpg",
      "Instax-rosa-4.jpg"
    ],
    desc: "Captura momentos y conviértelos en recuerdos físicos al instante. Color pastel según disponibilidad.",
    features: [
      "Fotos instantáneas",
      "Diseño compacto",
      "Flash automático",
      "Incluye accesorios según el kit mostrado"
    ]
  }
];

let cart = [];
let selectedProduct = null;


/* =========================
   DINERO
========================= */

const money = n =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0
  }).format(n);


/* =========================
   DESCUENTOS
========================= */

function getDiscount(price, oldPrice) {
  if (!oldPrice || oldPrice <= price) return 0;

  return Math.round(
    ((oldPrice - price) / oldPrice) * 100
  );
}

function getSaving(price, oldPrice) {
  if (!oldPrice || oldPrice <= price) return 0;

  return oldPrice - price;
}


/* =========================
   PRODUCTOS
========================= */

function renderProducts(list = products) {

  const el = document.querySelector("#products");

  if (!el) return;

  el.innerHTML = list.map(p => {

    const discount = getDiscount(
      p.price,
      p.oldPrice
    );

    const saving = getSaving(
      p.price,
      p.oldPrice
    );

    return `
      <article class="card">

        <div class="card-img" data-open="${p.id}">

          <span class="badge">
            ${discount ? `${discount}% OFF` : "OFERTA"}
          </span>

          <img
            src="${p.images[0]}"
            alt="${p.name}"
            loading="lazy"
          >

        </div>

        <div class="card-body">

          <h3>${p.name}</h3>

          <div class="product-rating">

            <span class="stars">
              ★★★★★
            </span>

            <b>4.9</b>

            <span class="rating-text">
              Producto seleccionado
            </span>

          </div>

          <div class="desc">
            ${p.desc}
          </div>

          <div class="price-box">

            ${
              p.oldPrice
                ? `
                  <div class="old-price">
                    ${money(p.oldPrice)}
                  </div>
                `
                : ""
            }

            <div class="price">
              ${money(p.price)}
            </div>

            ${
              saving
                ? `
                  <div class="saving">
                    AHORRAS ${money(saving)}
                  </div>
                `
                : ""
            }

          </div>

          <div class="actions">

            <button data-open="${p.id}">
              VER DETALLES
            </button>

            <button
              class="add"
              data-add="${p.id}"
            >
              AÑADIR
            </button>

          </div>

        </div>

      </article>
    `;

  }).join("");
}


/* =========================
   MODAL PRODUCTO
========================= */

function openProduct(id) {

  const p = products.find(
    x => x.id === id
  );

  if (!p) return;

  selectedProduct = p;

  const discount = getDiscount(
    p.price,
    p.oldPrice
  );

  const saving = getSaving(
    p.price,
    p.oldPrice
  );

  document.querySelector("#modalName").innerHTML = `

    ${p.name}

    <div class="product-rating modal-rating">

      <span class="stars">
        ★★★★★
      </span>

      <b>4.9</b>

      <span class="rating-text">
        Producto seleccionado
      </span>

    </div>

  `;

  document.querySelector("#modalPrice").innerHTML = `

    ${
      p.oldPrice
        ? `
          <div class="old-price">
            ${money(p.oldPrice)}
          </div>
        `
        : ""
    }

    <div class="price">
      ${money(p.price)}
    </div>

    ${
      discount
        ? `
          <div class="saving">
            ${discount}% OFF • AHORRAS ${money(saving)}
          </div>
        `
        : ""
    }

  `;

  document.querySelector("#modalDesc").textContent =
    p.desc;

  document.querySelector("#modalFeatures").innerHTML =
    p.features
      .map(f => `<li>${f}</li>`)
      .join("");

  setMain(p.images[0]);

  document.querySelector("#thumbs").innerHTML =
    p.images
      .map((src, i) => `
        <img
          class="${i === 0 ? "active" : ""}"
          src="${src}"
          data-img="${src}"
          alt="${p.name} ${i + 1}"
        >
      `)
      .join("");

  document
    .querySelector("#productModal")
    .classList
    .remove("hidden");
}


/* =========================
   IMAGEN PRINCIPAL
========================= */

function setMain(src) {

  const mainImage =
    document.querySelector("#mainImage");

  if (!mainImage) return;

  mainImage.src = src;

  document
    .querySelectorAll("#thumbs img")
    .forEach(x =>
      x.classList.toggle(
        "active",
        x.dataset.img === src
      )
    );
}


/* =========================
   CARRITO
========================= */

function addToCart(id) {

  const item = cart.find(
    x => x.id === id
  );

  if (item) {

    item.qty++;

  } else {

    const p = products.find(
      x => x.id === id
    );

    if (!p) return;

    cart.push({
      ...p,
      qty: 1
    });
  }

  renderCart();
  openCart();
}


function renderCart() {

  const cartCount =
    document.querySelector("#cartCount");

  const el =
    document.querySelector("#cartItems");

  const totalEl =
    document.querySelector("#cartTotal");

  if (!cartCount || !el || !totalEl)
    return;

  cartCount.textContent =
    cart.reduce(
      (s, x) => s + x.qty,
      0
    );

  if (!cart.length) {

    el.innerHTML =
      '<p style="color:#888;padding:25px 0">Tu carrito está vacío.</p>';

    totalEl.textContent =
      money(0);

    return;
  }

  el.innerHTML =
    cart.map(x => `

      <div class="cart-item">

        <img
          src="${x.images[0]}"
          alt="${x.name}"
        >

        <div>

          <h4>${x.name}</h4>

          <small>
            ${money(x.price)} × ${x.qty}
          </small>

        </div>

        <div class="qty">

          <button data-dec="${x.id}">
            −
          </button>

          <b>
            ${x.qty}
          </b>

          <button data-inc="${x.id}">
            +
          </button>

        </div>

      </div>

    `).join("");

  const total =
    cart.reduce(
      (s, x) =>
        s + x.price * x.qty,
      0
    );

  totalEl.textContent =
    money(total);
}


/* =========================
   CARRITO ABRIR / CERRAR
========================= */

function openCart() {

  document
    .querySelector("#cartPanel")
    .classList
    .remove("hidden");

  document
    .querySelector("#overlay")
    .classList
    .remove("hidden");
}


function closeCart() {

  document
    .querySelector("#cartPanel")
    .classList
    .add("hidden");

  document
    .querySelector("#overlay")
    .classList
    .add("hidden");
}


/* =========================
   MODALES
========================= */

function closeModal(id) {

  const modal =
    document.querySelector("#" + id);

  if (!modal) return;

  modal.classList.add("hidden");
}


/* =========================
   EVENTOS
========================= */

document.addEventListener(
  "click",
  e => {

    const open =
      e.target.closest("[data-open]");

    if (open) {
      openProduct(open.dataset.open);
    }


    const add =
      e.target.closest("[data-add]");

    if (add) {
      addToCart(add.dataset.add);
    }


    const thumb =
      e.target.closest("[data-img]");

    if (thumb) {
      setMain(thumb.dataset.img);
    }


    const inc =
      e.target.closest("[data-inc]");

    if (inc) {

      const item =
        cart.find(
          x => x.id === inc.dataset.inc
        );

      if (item) {
        item.qty++;
      }

      renderCart();
    }


    const dec =
      e.target.closest("[data-dec]");

    if (dec) {

      const item =
        cart.find(
          x => x.id === dec.dataset.dec
        );

      if (item) {
        item.qty--;
      }

      if (
        item &&
        item.qty <= 0
      ) {

        cart =
          cart.filter(
            x =>
              x.id !== dec.dataset.dec
          );
      }

      renderCart();
    }


    const close =
      e.target.closest("[data-close]");

    if (close) {
      closeModal(
        close.dataset.close
      );
    }

  }
);


/* =========================
   BOTÓN DEL MODAL
========================= */

document.querySelector(
  "#modalAdd"
).onclick = () => {

  if (!selectedProduct)
    return;

  addToCart(
    selectedProduct.id
  );

  closeModal(
    "productModal"
  );
};


/* =========================
   BOTONES DEL CARRITO
========================= */

document.querySelector(
  "#openCart"
).onclick =
  openCart;

document.querySelector(
  "#closeCart"
).onclick =
  closeCart;

document.querySelector(
  "#overlay"
).onclick =
  closeCart;


/* =========================
   CHECKOUT
========================= */

document.querySelector(
  "#checkoutBtn"
).onclick = () => {

  if (!cart.length) {

    alert(
      "Agrega al menos un producto al carrito."
    );

    return;
  }

  closeCart();

  document
    .querySelector("#checkoutModal")
    .classList
    .remove("hidden");
};


/* =========================
   BUSCADOR
========================= */

document.querySelector(
  "#search"
).addEventListener(
  "input",
  e => {

    const q =
      e.target.value
        .toLowerCase()
        .trim();

    renderProducts(
      products.filter(p =>
        (
          p.name +
          " " +
          p.desc
        )
          .toLowerCase()
          .includes(q)
      )
    );

  }
);


/* =========================
   PEDIDO WHATSAPP
========================= */

document.querySelector(
  "#checkoutForm"
).addEventListener(
  "submit",
  e => {

    e.preventDefault();

    const data =
      new FormData(
        e.currentTarget
      );


    const lines =
      cart.map(x =>
        `• ${x.name} | Cantidad: ${x.qty} | ${money(x.price * x.qty)}`
      ).join("\n");


    const total =
      cart.reduce(
        (s, x) =>
          s + x.price * x.qty,
        0
      );


    const msg =
`Hola, Importadora El Rebajón. Quiero realizar este pedido:

${lines}

TOTAL: ${money(total)}

DATOS DE ENTREGA
Nombre: ${data.get("name")}
Celular: ${data.get("phone")}
Ciudad: ${data.get("city")}
Dirección: ${data.get("address")}
Observación: ${data.get("note") || "Ninguna"}

Pago: Contra entrega`;


    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,
      "_blank"
    );

  }
);


/* =========================
   WHATSAPP FLOTANTE
========================= */

document.querySelector(
  "#waFloat"
).href =
  `https://wa.me/${WHATSAPP_NUMBER}`;


/* =========================
   INICIAR
========================= */

renderProducts();
renderCart();
