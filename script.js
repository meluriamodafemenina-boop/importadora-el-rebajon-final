// IMPORTADORA EL REBAJÓN
// CAMBIA SOLO ESTA VARIABLE por tu número de WhatsApp.
// Formato Colombia: 57 + número, sin +, espacios ni guiones.
const WHATSAPP_NUMBER = "573147636825";

const products = [
  {
    id:"aspiradora", name:"Aspiradora Inalámbrica TOTAL 20V", price:127000,
    images:["images/aspiradora-1.jpg","images/aspiradora-2.jpg","images/aspiradora-3.jpg","images/aspiradora-4.jpg"],
    desc:"Potente, práctica y sin cables. Ideal para carro, hogar, oficina y limpieza diaria.",
    features:["Sistema inalámbrico 20V","Depósito de 0,5 L","Diseño compacto y portátil","Marca TOTAL"]
  },
  {
    id:"linterna", name:"Linterna SOFIRN SD06", price:89999,
    images:["images/linterna-1.jpg","images/linterna-2.jpg"],
    desc:"Linterna de alto rendimiento para exteriores, trabajo, camping y emergencias.",
    features:["Hasta 3200 lúmenes","Alcance de hasta 470 m","Resistencia al agua IPX8","Incluye cargador y accesorios"]
  },
  {
    id:"instax", name:"Fujifilm Instax Mini 12", price:269000,
    images:["images/instax-1.jpg","images/instax-2.jpg","images/instax-3.jpg","images/instax-4.jpg"],
    desc:"Captura momentos y conviértelos en recuerdos físicos al instante. Color pastel blue/lavanda según disponibilidad.",
    features:["Fotos instantáneas","Diseño compacto","Flash automático","Incluye accesorios según el kit mostrado"]
  }
];

let cart = [];
let selectedProduct = null;

const money = n => new Intl.NumberFormat("es-CO",{style:"currency",currency:"COP",maximumFractionDigits:0}).format(n);

function renderProducts(list=products){
  const el=document.querySelector("#products");
  el.innerHTML=list.map(p=>`
    <article class="card">
      <div class="card-img" data-open="${p.id}">
        <span class="badge">OFERTA</span>
        <img src="${p.images[0]}" alt="${p.name}" loading="lazy">
      </div>
      <div class="card-body">
        <h3>${p.name}</h3>
        <div class="desc">${p.desc}</div>
        <div class="price">${money(p.price)}</div>
        <div class="actions">
          <button data-open="${p.id}">VER DETALLES</button>
          <button class="add" data-add="${p.id}">AÑADIR</button>
        </div>
      </div>
    </article>`).join("");
}
function openProduct(id){
  const p=products.find(x=>x.id===id); if(!p)return;
  selectedProduct=p;
  document.querySelector("#modalName").textContent=p.name;
  document.querySelector("#modalPrice").textContent=money(p.price);
  document.querySelector("#modalDesc").textContent=p.desc;
  document.querySelector("#modalFeatures").innerHTML=p.features.map(f=>`<li>${f}</li>`).join("");
  setMain(p.images[0]);
  document.querySelector("#thumbs").innerHTML=p.images.map((src,i)=>`<img class="${i===0?"active":""}" src="${src}" data-img="${src}" alt="${p.name} ${i+1}">`).join("");
  document.querySelector("#productModal").classList.remove("hidden");
}
function setMain(src){
  document.querySelector("#mainImage").src=src;
  document.querySelectorAll("#thumbs img").forEach(x=>x.classList.toggle("active",x.dataset.img===src));
}
function addToCart(id){
  const item=cart.find(x=>x.id===id);
  if(item)item.qty++;
  else {const p=products.find(x=>x.id===id); cart.push({...p,qty:1});}
  renderCart(); openCart();
}
function renderCart(){
  document.querySelector("#cartCount").textContent=cart.reduce((s,x)=>s+x.qty,0);
  const el=document.querySelector("#cartItems");
  if(!cart.length){el.innerHTML='<p style="color:#888;padding:25px 0">Tu carrito está vacío.</p>';document.querySelector("#cartTotal").textContent=money(0);return;}
  el.innerHTML=cart.map(x=>`
    <div class="cart-item">
      <img src="${x.images[0]}" alt="">
      <div><h4>${x.name}</h4><small>${money(x.price)} × ${x.qty}</small></div>
      <div class="qty"><button data-dec="${x.id}">−</button><b>${x.qty}</b><button data-inc="${x.id}">+</button></div>
    </div>`).join("");
  document.querySelector("#cartTotal").textContent=money(cart.reduce((s,x)=>s+x.price*x.qty,0));
}
function openCart(){document.querySelector("#cartPanel").classList.remove("hidden");document.querySelector("#overlay").classList.remove("hidden")}
function closeCart(){document.querySelector("#cartPanel").classList.add("hidden");document.querySelector("#overlay").classList.add("hidden")}
function closeModal(id){document.querySelector("#"+id).classList.add("hidden")}
document.addEventListener("click",e=>{
  const open=e.target.closest("[data-open]"); if(open)openProduct(open.dataset.open);
  const add=e.target.closest("[data-add]"); if(add)addToCart(add.dataset.add);
  const thumb=e.target.closest("[data-img]"); if(thumb)setMain(thumb.dataset.img);
  const inc=e.target.closest("[data-inc]"); if(inc){const i=cart.find(x=>x.id===inc.dataset.inc);i.qty++;renderCart();}
  const dec=e.target.closest("[data-dec]"); if(dec){const i=cart.find(x=>x.id===dec.dataset.dec);i.qty--;if(i.qty<=0)cart=cart.filter(x=>x.id!==dec.dataset.dec);renderCart();}
  const c=e.target.closest("[data-close]"); if(c)closeModal(c.dataset.close);
});
document.querySelector("#modalAdd").onclick=()=>{if(selectedProduct){addToCart(selectedProduct.id);closeModal("productModal")}};
document.querySelector("#openCart").onclick=openCart;
document.querySelector("#closeCart").onclick=closeCart;
document.querySelector("#overlay").onclick=closeCart;
document.querySelector("#checkoutBtn").onclick=()=>{
  if(!cart.length){alert("Agrega al menos un producto al carrito.");return;}
  closeCart();document.querySelector("#checkoutModal").classList.remove("hidden");
};
document.querySelector("#search").addEventListener("input",e=>{
  const q=e.target.value.toLowerCase().trim();
  renderProducts(products.filter(p=>(p.name+" "+p.desc).toLowerCase().includes(q)));
});
document.querySelector("#checkoutForm").addEventListener("submit",e=>{
  e.preventDefault();
  const data=new FormData(e.currentTarget);
  const lines=cart.map(x=>`• ${x.name} | Cantidad: ${x.qty} | ${money(x.price*x.qty)}`).join("\n");
  const total=cart.reduce((s,x)=>s+x.price*x.qty,0);
  const msg=`Hola, Importadora El Rebajón. Quiero realizar este pedido:\n\n${lines}\n\nTOTAL: ${money(total)}\n\nDATOS DE ENTREGA\nNombre: ${data.get("name")}\nCelular: ${data.get("phone")}\nCiudad: ${data.get("city")}\nDirección: ${data.get("address")}\nObservación: ${data.get("note")||"Ninguna"}\n\nPago: Contra entrega`;
  if(WHATSAPP_NUMBER.includes("X")){alert("Primero configura tu número de WhatsApp en script.js.");return;}
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,"_blank");
});
document.querySelector("#waFloat").href=`https://wa.me/${WHATSAPP_NUMBER.includes("X")?"":WHATSAPP_NUMBER}`;
renderProducts();renderCart();
