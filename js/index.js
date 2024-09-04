const totalSum = document.querySelector('.total-sum');
const totalQnty = document.querySelector('.total-qnty');

const mainContent = document.querySelector('.content');
const cartBtn = document.querySelector('.header__cart.button.button--cart');
const headerLogo = document.querySelector('.header__logo');

const localStorageCart = JSON.parse(localStorage.getItem('cart'));

let url = "http://localhost:3000/pizzas"
let sortCondition = "?_sort="
let categoryCondition = "category="

let filteredPizzas = [];
let cart = localStorageCart ? localStorageCart : [];
const types = ['традиционное', 'тонкое'];
const sizes = [26, 30, 40];

const renderPizzas = () => {
  const contentItems = document.querySelector('.content__items');
  totalSum.innerText = cart.reduce((a, b) => a + b.price * b.quantity, 0) + ' c';
  totalQnty.innerText = cart.reduce((a, b) => a + b.quantity, 0);

  contentItems.innerHTML = '';

  filteredPizzas.forEach((item) => {
    contentItems.innerHTML += `
    <div class="pizza-block">
        <img class="pizza-block__image"
            src="${item.imgUrl}"
            alt="Pizza" />
        <h4 class="pizza-block__title">${item.name}</h4>
        <div class="pizza-block__selector">
            <ul class="pizza-block__selector--types"></ul>
            <ul class="pizza-block__selector--sizes"></ul>
        </div>
        <div class="pizza-block__bottom">
            <div class="pizza-block__price">от ${item.price} c</div>
            <div class="button button--outline button--add">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                  d="M10.8 4.8H7.2V1.2C7.2 0.5373 6.6627 0 6 0C5.3373 0 4.8 0.5373 4.8 1.2V4.8H1.2C0.5373 4.8 0 5.3373 0 6C0 6.6627 0.5373 7.2 1.2 7.2H4.8V10.8C4.8 11.4627 5.3373 12 6 12C6.6627 12 7.2 11.4627 7.2 10.8V7.2H10.8C11.4627 7.2 12 6.6627 12 6C12 5.3373 11.4627 4.8 10.8 4.8Z"
                  fill="white" />
              </svg>
              <span>Добавить</span>
            </div>
        </div>
    </div>
    `;
  });

  const pizzaBlock = contentItems.querySelectorAll('.pizza-block');

  pizzaBlock.forEach((item) => {
    const typesList = item.querySelector('.pizza-block__selector--types');
    const sizesList = item.querySelector('.pizza-block__selector--sizes');
    const addBtn = item.querySelector('.button.button--outline.button--add');

    types.forEach((type) => (typesList.innerHTML += `<li>${type}</li>`));
    sizes.forEach((size) => (sizesList.innerHTML += `<li>${size} см.</li>`));

    typesList.querySelector('li').className = 'active';
    sizesList.querySelector('li').className = 'active';

    typesList.querySelectorAll('li').forEach((el) => {
      el.addEventListener('click', () => {
        typesList
          .querySelectorAll('li')
          .forEach((element) => (element.className = ''));

        el.className = 'active';
      });
    });

    sizesList.querySelectorAll('li').forEach((el) => {
      el.addEventListener('click', () => {
        sizesList
          .querySelectorAll('li')
          .forEach((element) => (element.className = ''));

        el.className = 'active';
      });
    });

    addBtn.addEventListener('click', () => {
      const newItem = {
        id:
          item.querySelector('h4').innerText +
          sizesList.querySelector('.active').innerText +
          typesList.querySelector('.active').innerText,
        name: item.querySelector('h4').innerText,
        price: +item
          .querySelector('.pizza-block__price')
          .innerText.replace('от ', '')
          .replace(' c', ''),
        imgUrl: item.querySelector('.pizza-block__image').src,
        size: sizesList.querySelector('.active').innerText,
        type: typesList.querySelector('.active').innerText,
        quantity: 1,
      };

      const foundedPizza = cart.find((item) => newItem.id === item.id);

      if (foundedPizza) {
        cart = cart.map((item) => {
          if (item.id === foundedPizza.id) {
            return {
              ...item,
              quantity: item.quantity + 1,
            };
          } else {
            return item;
          }
        });
      } else {
        cart.push(newItem);
      }

      localStorage.setItem('cart', JSON.stringify(cart));

      const totalSumValue = cart.reduce(
        (a, b) => a + b.price * b.quantity,
        0
      );
      const totalQntyValue = cart.reduce((a, b) => a + b.quantity, 0);

      totalSum.innerText = totalSumValue + ' c';
      totalQnty.innerText = totalQntyValue;

      console.log(JSON.parse(localStorage.getItem('cart')));
    });
  });
};

const renderMainPage = () => {
  mainContent.innerHTML = `
    <div class="container">
        <div class="content__top">
          <div class="categories">
            <ul></ul>
          </div>
          <div class="sort">
            <div class="sort__label">
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M10 5C10 5.16927 9.93815 5.31576 9.81445 5.43945C9.69075 5.56315 9.54427 5.625 9.375 5.625H0.625C0.455729 5.625 0.309245 5.56315 0.185547 5.43945C0.061849 5.31576 0 5.16927 0 5C0 4.83073 0.061849 4.68424 0.185547 4.56055L4.56055 0.185547C4.68424 0.061849 4.83073 0 5 0C5.16927 0 5.31576 0.061849 5.43945 0.185547L9.81445 4.56055C9.93815 4.68424 10 4.83073 10 5Z"
                  fill="#2C2C2C" />
              </svg>
              <b>Сортировка по:</b>
              <span>популярности</span>
            </div>
            <div class="sort__popup">
              <ul>
                <li class="active">популярности</li>
                <li>цене</li>
                <li>алфавиту</li>
              </ul>
            </div>
          </div>
        </div>
        <h2 class="content__title">Все пиццы</h2>
        <div class="content__items">
          
        </div>
      </div>
  `;

  document.querySelector('.sort__label').addEventListener('click', () => {
    document.querySelector('.sort').classList.toggle('active');
  });

  const sortListLi = document.querySelectorAll('.sort__popup li');

  sortListLi.forEach((li) => {
    li.addEventListener('click', () => {
      sortListLi.forEach((item) => item.classList.remove('active'));

      li.classList.add('active');

      if(li.innerText === 'цене') {
        sortCondition = "?_sort=price"
        getAllPizzas(url + sortCondition + '&' + categoryCondition)
      } else if (li.innerText === 'алфавиту') {
        sortCondition = "?_sort=name"
        getAllPizzas(url + sortCondition + '&' + categoryCondition)
      } else {
        getAllPizzas(url)
      }

      document.querySelector('.sort__label span').textContent = li.textContent;

      document.querySelector('.sort').classList.remove('active');
    });
  });

  // =======

  const categories = document.querySelector('.categories ul');
  const categoriesList = [
    'Все',
    'Мясные',
    'Вегетарианская',
    'Гриль',
    'Острые',
    'Закрытые',
  ];

  categoriesList.forEach((item, i) => {
    categories.innerHTML += `<li>${item}</li>`;
  });

  categories.querySelectorAll('li')[0].className = 'active';

  categories.querySelectorAll('li').forEach((item) => {
    item.addEventListener('click', () => {
      categories.querySelectorAll('li').forEach((element) => {
        element.className = '';
      });

      item.className = 'active';

      if (item.innerText !== 'Все') {
        categoryCondition = "category=";
        categoryCondition += item.innerText;
        console.log(url + sortCondition + '&' + categoryCondition);
        getAllPizzas(url + sortCondition + '&' + categoryCondition)
      } else {
        getAllPizzas(url)
      }

      renderPizzas();
    });
  });
};

const getAllPizzas = async (URL) => {
  const response = await fetch(URL);
  const data = await response.json();

  filteredPizzas = [...data];
  renderPizzas();
}

renderMainPage();
getAllPizzas(url);

headerLogo.addEventListener('click', () => {
  renderMainPage();
  renderPizzas();
});

cartBtn.addEventListener('click', () => {
  mainContent.innerHTML = `
    <div class="container container--cart">
        <div class="cart">
          <div class="cart__top">
            <h2 class="content__title"><svg width="18" height="18" viewBox="0 0 18 18" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M6.33333 16.3333C7.06971 16.3333 7.66667 15.7364 7.66667 15C7.66667 14.2636 7.06971 13.6667 6.33333 13.6667C5.59695 13.6667 5 14.2636 5 15C5 15.7364 5.59695 16.3333 6.33333 16.3333Z"
                  stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                <path
                  d="M14.3333 16.3333C15.0697 16.3333 15.6667 15.7364 15.6667 15C15.6667 14.2636 15.0697 13.6667 14.3333 13.6667C13.597 13.6667 13 14.2636 13 15C13 15.7364 13.597 16.3333 14.3333 16.3333Z"
                  stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                <path
                  d="M4.78002 4.99999H16.3334L15.2134 10.5933C15.1524 10.9003 14.9854 11.176 14.7417 11.3722C14.4979 11.5684 14.1929 11.6727 13.88 11.6667H6.83335C6.50781 11.6694 6.1925 11.553 5.94689 11.3393C5.70128 11.1256 5.54233 10.8295 5.50002 10.5067L4.48669 2.82666C4.44466 2.50615 4.28764 2.21182 4.04482 1.99844C3.80201 1.78505 3.48994 1.66715 3.16669 1.66666H1.66669"
                  stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              Корзина</h2>
            <div class="cart__clear">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.5 5H4.16667H17.5" stroke="#B6B6B6" stroke-width="1.2" stroke-linecap="round"
                  stroke-linejoin="round" />
                <path
                  d="M6.66663 5.00001V3.33334C6.66663 2.89131 6.84222 2.46739 7.15478 2.15483C7.46734 1.84227 7.89127 1.66667 8.33329 1.66667H11.6666C12.1087 1.66667 12.5326 1.84227 12.8451 2.15483C13.1577 2.46739 13.3333 2.89131 13.3333 3.33334V5.00001M15.8333 5.00001V16.6667C15.8333 17.1087 15.6577 17.5326 15.3451 17.8452C15.0326 18.1577 14.6087 18.3333 14.1666 18.3333H5.83329C5.39127 18.3333 4.96734 18.1577 4.65478 17.8452C4.34222 17.5326 4.16663 17.1087 4.16663 16.6667V5.00001H15.8333Z"
                  stroke="#B6B6B6" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M8.33337 9.16667V14.1667" stroke="#B6B6B6" stroke-width="1.2" stroke-linecap="round"
                  stroke-linejoin="round" />
                <path d="M11.6666 9.16667V14.1667" stroke="#B6B6B6" stroke-width="1.2" stroke-linecap="round"
                  stroke-linejoin="round" />
              </svg>

              <span>Очистить корзину</span>
            </div>
          </div>
          <div class="content__items"></div>
          <div class="cart__bottom">
            <div class="cart__bottom-details">
              <span class="cartTotalQnty"> Всего пицц: <b>${cart.reduce((a, b) => a + b.quantity, 0)} шт.</b> </span>
              <span class="cartTotalSum"> Сумма заказа: <b>${cart.reduce((a, b) => a + b.price * b.quantity, 0)} c.</b> </span>
            </div>
            <div class="cart__bottom-buttons">
              <div class="button button--outline button--add go-back-btn">
                <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 13L1 6.93015L6.86175 1" stroke="#D3D3D3" stroke-width="1.5" stroke-linecap="round"
                    stroke-linejoin="round" />
                </svg>
                <span>Вернуться назад</span>
              </div>
              <div class="button pay-btn">
                <span>Оплатить сейчас</span>
              </div>
            </div>
          </div>
        </div>
      </div>
  `;

  const cartClear = document.querySelector(".cart__clear")

  const contentItems = document.querySelector('.content__items');

  const renderCartPizzas = () => {
    document.querySelector('.cartTotalQnty').innerHTML = `Всего пицц: <b>${cart.reduce((a, b) => a + b.quantity, 0)} шт.</b>`
    document.querySelector('.cartTotalSum').innerHTML = `Сумма заказа: <b>${cart.reduce((a, b) => a + b.price * b.quantity, 0)} c.</b>`
    contentItems.innerHTML = '';

    cart.forEach((item) => {
      contentItems.innerHTML += `
      <div class="cart__item">
                <div class="cart__item-img">
                  <img class="pizza-block__image"
                    src="${item.imgUrl}"
                    alt="Pizza" />
                </div>
                <div class="cart__item-info">
                  <h3>${item.name}</h3>
                  <p>${item.type} тесто, ${item.size}</p>
                </div>
                <div class="cart__item-count">
                  <div class="button button--outline button--circle cart__item-count-minus" data-id="${
                    item.id
                  }">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M5.92001 3.84V5.76V8.64C5.92001 9.17016 5.49017 9.6 4.96001 9.6C4.42985 9.6 4.00001 9.17016 4.00001 8.64L4 5.76L4.00001 3.84V0.96C4.00001 0.42984 4.42985 0 4.96001 0C5.49017 0 5.92001 0.42984 5.92001 0.96V3.84Z"
                        fill="#EB5A1E" />
                      <path
                        d="M5.75998 5.92001L3.83998 5.92001L0.959977 5.92001C0.429817 5.92001 -2.29533e-05 5.49017 -2.29301e-05 4.96001C-2.2907e-05 4.42985 0.429817 4.00001 0.959977 4.00001L3.83998 4L5.75998 4.00001L8.63998 4.00001C9.17014 4.00001 9.59998 4.42985 9.59998 4.96001C9.59998 5.49017 9.17014 5.92001 8.63998 5.92001L5.75998 5.92001Z"
                        fill="#EB5A1E" />
                    </svg>
  
                  </div>
                  <b>${item.quantity}</b>
                  <div class="button button--outline button--circle cart__item-count-plus" data-id="${
                    item.id
                  }">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M5.92001 3.84V5.76V8.64C5.92001 9.17016 5.49017 9.6 4.96001 9.6C4.42985 9.6 4.00001 9.17016 4.00001 8.64L4 5.76L4.00001 3.84V0.96C4.00001 0.42984 4.42985 0 4.96001 0C5.49017 0 5.92001 0.42984 5.92001 0.96V3.84Z"
                        fill="#EB5A1E" />
                      <path
                        d="M5.75998 5.92001L3.83998 5.92001L0.959977 5.92001C0.429817 5.92001 -2.29533e-05 5.49017 -2.29301e-05 4.96001C-2.2907e-05 4.42985 0.429817 4.00001 0.959977 4.00001L3.83998 4L5.75998 4.00001L8.63998 4.00001C9.17014 4.00001 9.59998 4.42985 9.59998 4.96001C9.59998 5.49017 9.17014 5.92001 8.63998 5.92001L5.75998 5.92001Z"
                        fill="#EB5A1E" />
                    </svg>
  
                  </div>
                </div>
                <div class="cart__item-price">
                  <b>${item.price * item.quantity} ₽</b>
                </div>
                <div class="cart__item-remove">
                  <div class="button button--outline button--circle">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M5.92001 3.84V5.76V8.64C5.92001 9.17016 5.49017 9.6 4.96001 9.6C4.42985 9.6 4.00001 9.17016 4.00001 8.64L4 5.76L4.00001 3.84V0.96C4.00001 0.42984 4.42985 0 4.96001 0C5.49017 0 5.92001 0.42984 5.92001 0.96V3.84Z"
                        fill="#EB5A1E" />
                      <path
                        d="M5.75998 5.92001L3.83998 5.92001L0.959977 5.92001C0.429817 5.92001 -2.29533e-05 5.49017 -2.29301e-05 4.96001C-2.2907e-05 4.42985 0.429817 4.00001 0.959977 4.00001L3.83998 4L5.75998 4.00001L8.63998 4.00001C9.17014 4.00001 9.59998 4.42985 9.59998 4.96001C9.59998 5.49017 9.17014 5.92001 8.63998 5.92001L5.75998 5.92001Z"
                        fill="#EB5A1E" />
                    </svg>
                  </div>
                </div>
              </div>
      `;
    });

    const plusBtn = contentItems.querySelectorAll(
      '.button.button--outline.button--circle.cart__item-count-plus'
    );
    const minusBtn = contentItems.querySelectorAll(
      '.button.button--outline.button--circle.cart__item-count-minus'
    );

    plusBtn.forEach((btn) => {
      btn.addEventListener('click', () => {
        cart = cart.map((pizza) => {
          if (pizza.id === btn.dataset.id) {
            const newPizza = {
              ...pizza,
              quantity: pizza.quantity + 1,
            };
            return newPizza;
          } else {
            return pizza;
          }
        });
        renderCartPizzas();
      });
    });

    minusBtn.forEach((btn) => {
      btn.addEventListener('click', () => {
        cart = cart.map((pizza) => {
          if (pizza.id === btn.dataset.id) {
            const newPizza = {
              ...pizza,
              quantity:
                pizza.quantity === 1 ? pizza.quantity : pizza.quantity - 1,
            };
            return newPizza;
          } else {
            return pizza;
          }
        });
        renderCartPizzas();
      });
    });
  };

  renderCartPizzas();

  cartClear.addEventListener('click', () => {
    localStorage.setItem('cart', null)
    cart = [];

    totalSum.innerText = 0 + ' c';
    totalQnty.innerText = 0;

    renderCartPizzas();
  });

  document.querySelector(".go-back-btn").addEventListener('click', () => {
    renderMainPage();
  })
});
