let products = []
let arrData = [] 
let cardItem = []
let modalImg, modalTitle, modalNamber, modal_price, modal_fullprice;

async function cartAddedOrder() {  
   await fetch("./data.json")
    .then(async response => await response.json())
    .then(async jsonData => {
        products = await jsonData;
        const cartPositionsContainer = document.querySelector('.container__dessert-options');  
        const cartItem = document.createElement("div");
        cartItem.className = "options-cart__position";
        // cartItem.style.display = "flex";
        for(let i = 0; i < jsonData.length; i++){
            cartItem.innerHTML += `
                <div class="dessert-options__cards-card">
                    <div class="cards-card__img">
                        <img class="cards-card-img__image" src="${jsonData[i].image.tablet}" alt="">
                        <button class="cards-card-img__button"><img src="./assets/images/icon-add-to-cart.svg" alt=""> Add to Cart</button>
                    </div>
                    <div class="cards-card__description">
                        <p class="card-description__category">${jsonData[i].category}</p>
                        <h4 class="card-description__name">${jsonData[i].name}</h4>
                        <p class="card-description__price">$${jsonData[i].price.toFixed(2)}</p>
                    </div>
                </div>
            `;
            }
            cartPositionsContainer.appendChild(cartItem);
        }    
    );

    const buttons = document.querySelectorAll(".cards-card-img__button");

    buttons.forEach((button, idx) => {
        button.addEventListener("click", (e) => addCart(e, idx));
    });

    const spanCount = document.querySelector('.span-count');
    let productsNumbers = 0;

    const totalPrice = document.querySelector('.order-total__sum');

    function addCart(e, idx){
        e.stopPropagation();
        const newButton = e.target.closest(".cards-card-img__button");

        if(e.target.classList.contains("block__button-text")){

        } else if(e.target.classList.contains("block")){

        }else if((!e.target.classList.contains("activ"))){
            activButton(newButton);
            newButton.classList.add('activ');
    
            
            productsNumbers++;
            spanCount.textContent = productsNumbers;
            
            const plus = newButton.querySelector('.plus');
            const minus = newButton.querySelector('.minus');
            const count = newButton.querySelector('.block__button-text');
            
            arrData[idx] = {
                'image':products[idx].image.tablet,
                'category':products[idx].category,
                'name':products[idx].name,
                'price':products[idx].price,
                'count': 1,
                'fullPrice': +count.textContent * products[idx].price 
            }

            plus.addEventListener("click", (e) => {
                e.stopPropagation();
                +count.textContent++;
                productsNumbers++;
                spanCount.textContent = productsNumbers;
                arrData[idx].count = +count.textContent;
                cardItem[idx].count.textContent = arrData[idx].count + "x";
                arrData[idx].fullPrice = arrData[idx].price * arrData[idx].count;
                cardItem[idx].fullPrice.textContent = '$' + arrData[idx].fullPrice.toFixed(2); 
                totalPrice.textContent = '$' + finishPrice();   
            });
            
            minus.addEventListener("click", (e) => {
              e.stopPropagation();
              if (+count.textContent > 1) {
                +count.textContent--;
                productsNumbers--;
                spanCount.textContent = productsNumbers;
                arrData[idx].count = +count.textContent;
                cardItem[idx].count.textContent = arrData[idx].count + "x";
                arrData[idx].fullPrice = arrData[idx].price * arrData[idx].count;
                cardItem[idx].fullPrice.textContent = '$' + arrData[idx].fullPrice.toFixed(2); 
                totalPrice.textContent = '$' + finishPrice(); 
              } else {
                newButton.classList.remove("activ");
                newButton.innerHTML = `<img src="./assets/images/icon-add-to-cart.svg" alt=""> Add to Cart`;
                productsNumbers--;
                spanCount.textContent = productsNumbers;
                arrData[idx] = null;
                deleteCard (idx, totalPrice);
                    if(spanCount.textContent == 0) {
                        empty();
                    }  
                } 
            });
    
            createItem(idx);

            totalPrice.textContent = '$' + finishPrice();
        
            if(count != 0) {
                const dessertsCartAdded = document.querySelector('.desserts-result__cart-added');
                dessertsCartAdded.style.cssText = "display: none";
                const orderList = document.querySelector('.cart-added__order');
                orderList.style.cssText = "display: block"  
            } 
        }
        cardItem[idx].remove.addEventListener('click', () =>{
            newButton.classList.remove("activ");
            newButton.innerHTML = `<img src="./assets/images/icon-add-to-cart.svg" alt=""> Add to Cart`;
            productsNumbers -= arrData[idx].count;
            spanCount.textContent = productsNumbers;
            deleteCard(idx, totalPrice);
            if(spanCount.textContent == 0) {
                empty();
            }                                    
        });
    }
    const orderButton = document.querySelector('.order-delivery__button');

    orderButton.addEventListener ('click', () => {
        document.body.classList.add('noscroll');

        const modal = document.querySelector('.modal');
        modal.classList.remove('modal--hidden');
        
        const cardName = document.querySelectorAll('.cart-order__name');

        for(let i = 0; i < arrData.length; i++){
            if(!arrData[i]) continue;
            for( let m = 0; m < cardName.length; m++){
                if(cardName[m].textContent == arrData[i].name){
                    orderList(i);
                }
            }
        }
        const modalFinalPrice = document.querySelector('.modal-full-price__sum');
        modalFinalPrice.textContent = '$' + finishPrice();
    })    
}

cartAddedOrder();

function activButton (newButton){
    // let quantity = 1;
    
    const minus = document.createElement('img');
    const plus = document.createElement('img');
    const count = document.createElement('p');

    const block = document.createElement('div');

    minus.src = './assets/images/icon-decrement-quantity.svg';
    plus.src = './assets/images/icon-increment-quantity.svg';
    count.textContent = '1';

    minus.className = 'block__activButton minus';
    plus.className = 'block__activButton plus';
    count.className = 'block__button-text';
    block.className = 'block';

    block.appendChild(minus);
    block.appendChild(count);
    block.appendChild(plus);
    newButton.textContent = '';
    newButton.appendChild(block);
    
}


function createItem (idx) {
    const cartList = document.querySelector(".cart-order__list");
    
    
        const cartItem = document.createElement("div");
        cartItem.className = "cart-order__item";
        cartItem.innerHTML = `
          <div class="cart-order__info">
                <h4 class="cart-order__name">${arrData[idx].name}</h4>
                <div class="cart-order__info-items">
                    <p class="cart-order__count count-style">${arrData[idx].count}x</p>
                    <p class="cart-order__price price-style">@$${arrData[idx].price.toFixed(2)}</p>
                    <p class="cart-order__full-price full-price-style">$${(arrData[idx].count * arrData[idx].price).toFixed(2)}</p>
                </div>
          </div>
          <button class="cart-order__remove"><img src="./assets/images/icon-remove-item.svg" alt=""></button>
        `;
    
        cartList.appendChild(cartItem);

        const count = cartItem.querySelector(".cart-order__count");
        const fullPrice = cartItem.querySelector(".cart-order__full-price");
        const remove = cartItem.querySelector(".cart-order__remove");

        cardItem[idx] = {
            "item": cartItem,
            "count": count,
            "fullPrice": fullPrice,
            "remove": remove
        }
      } 

function deleteCard (idx, totalPrice) {
    delete arrData[idx];
    cardItem[idx].item.remove();
    delete cardItem[idx].item;
    totalPrice.textContent = '$' + finishPrice();

}

function finishPrice() {
    let sumAll = 0;
    for (let i = 0; i < arrData.length; i++){
        if(!arrData[i]) continue;
        sumAll += arrData[i].fullPrice;
    }
    return sumAll.toFixed(2);
}

function empty() {
    const dessertsCartAdded = document.querySelector('.desserts-result__cart-added');
    dessertsCartAdded.style.cssText = "display: flex";
    const orderList = document.querySelector('.cart-added__order');
    orderList.style.cssText = "display: none";    
} 

function orderList(idx) {
    const modalList = document.querySelector('.modal-container__order-list');

        const modalListItem = document.createElement("div");
        modalListItem.className = "modal-list__items";
        modalListItem.innerHTML = `
          <div class="modal-items__info">
            <div class="modal-items-info__box">
                <img class="modal-info__image" src="${arrData[idx].image}" alt="">
                <div class="modal-info__items">
                    <h4 class="modal-info__name">${arrData[idx].name}</h4>
                    <div class="modal-info-items__count-price">
                        <p class="modal-info__count count-style">${arrData[idx].count}x</p>
                        <p class="modal-info__price price-style">@$${arrData[idx].price.toFixed(2)}</p>
                    </div>
                </div>
            </div>
            <p class="modal-info__full-price full-price-style">$${(arrData[idx].count * arrData[idx].price).toFixed(2)}</p>
          </div>
        `;

    const modalImage = modalListItem.querySelector('.modal-info__image');
    const modalName = modalListItem.querySelector('.modal-info__name');
    const modalCount = modalListItem.querySelector('.modal-info__count');
    const modalPrice = modalListItem.querySelector('.modal-info__price');
    const modalFullPrice = modalListItem.querySelector('.modal-info__full-price');

    modalImg = modalImage;
    modalTitle = modalName;
    modalNamber = modalCount;
    modal_price = modalPrice;
    modal_fullprice = modalFullPrice;

    modalList.appendChild(modalListItem);
}

const modal = document.querySelector(".modal");
const modalButton = document.querySelector(".modal-container__button");

modalButton.addEventListener("click", () => {
    closeModal();
    location.reload();
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    closeModal();
    location.reload();
  }
});

function closeModal() {
  modal.classList.add("modal--hidden");
  document.body.classList.remove("noscroll");
}
