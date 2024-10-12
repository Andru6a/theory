window.addEventListener('DOMContentLoaded', () => {
  // Modal
  // Modal
  // Modal
  // ImageValue
  const imageLoader = document.getElementById('upload');
  const imagePreview = document.querySelector('.modal__header-content-preview');
  const clearPreviewBtn = document.querySelector('.modal__header-clearBtn');

  const reader = new FileReader();
  function handleImage(input) {
    if (input.target.files && input.target.files[0]) {
      reader.onload = function (e) {
        imagePreview.src = e.target.result;
      };
      reader.readAsDataURL(input.target.files[0]);
    }
  }

  function clearImage(e) {
    imageLoader.value = null;
    imagePreview.src = '';
  }

  imageLoader.addEventListener('change', handleImage);
  clearPreviewBtn.addEventListener('click', clearImage);

  // submit form
  const formModal = document.querySelector('.modal__form');
  formModal.addEventListener('submit', onSubmit);

  function onSubmit() {
    const formData = new FormData(formModal);
    const jsonData = JSON.stringify(Object.fromEntries(formData));

    alert(jsonData);
  }

  // open modal
  const modal = document.querySelector('.modal');
  const openModalBtn = document.querySelector('.modal__open');
  const closeModalBtn = modal.querySelector('.modal__close');

  function openModal(e) {
    modal.classList.add('show');
    document.body.classList.add('modal--open');
  }

  function closeModal() {
    modal.classList.remove('show');
    document.body.classList.remove('modal--open');
  }

  openModalBtn.addEventListener('click', openModal);

  modal.addEventListener('click', (e) => {
    if (
      e.target.classList.contains('modal__close') ||
      e.target.classList.contains('modal')
    ) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  });

  // FetchPosts
  // FetchPosts
  // FetchPosts

  // function renderSpinner() {
  //   const table = document.querySelector('.table__content');
  //   table.innerHTML = '';

  //   const element = document.createElement('div');
  //   element.classList.add('spinner');
  //   element.innerHTML = `
  //   <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z"><animateTransform attributeName="transform" dur="0.75s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/></path></svg>`;
  //   table.append(element);
  // }

  const getResource = async (subUrl) => {
    const _baseUrl = 'https://jsonplaceholder.typicode.com';

    const res = await fetch(_baseUrl + subUrl);

    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, status ${res.status}`);
    }

    return await res.json();
  };

  class Post {
    constructor(userId, id, title, body, parrentSelector) {
      this.userId = userId;
      this.id = id;
      this.title = title;
      this.body = body;
      this.parrentSelector = parrentSelector;
    }

    render() {
      const element = document.createElement('tr');

      this.element = 'table__item';
      element.classList.add(this.element);

      element.innerHTML = `
          <td class="table__item-cell">${this.id}</td>
          <td class="table__item-cell">${this.title}</td>
          <td class="table__item-cell">${this.body}</td>
      `;
      this.parrentSelector.append(element);
    }
  }

  // let postList = await getResource('/posts');
  getResource('/posts').then((data) => renderPosts(data));

  function renderPosts(list) {
    const table = document.querySelector('.table__content');
    table.innerHTML = '';

    list.forEach(({ userId, id, title, body }) => {
      new Post(userId, id, title, body, table).render();
    });
  }

  // filters
  const postBtns = document.querySelectorAll('.table__item-header');

  async function filterList(compare, item) {
    const sortList = await getResource('/posts');
    const copyData = [...sortList];

    switch (item) {
      case 'id':
        if (compare) {
          return copyData.sort((a, b) => {
            return b[item] - a[item];
          });
        } else {
          return copyData.sort((a, b) => {
            return a[item] - b[item];
          });
        }
      case 'title':
        if (compare) {
          return copyData.sort((a, b) => {
            if (b[item] > a[item]) {
              return -1;
            }
            if (b[item] < a[item]) {
              return 1;
            }
            return 0;
          });
        } else {
          return copyData.sort((a, b) => {
            if (b[item] > a[item]) {
              return 1;
            }
            if (b[item] < a[item]) {
              return -1;
            }
            return 0;
          });
        }
      case 'body':
        if (compare) {
          return copyData.sort((a, b) => {
            if (b[item] > a[item]) {
              return -1;
            }
            if (b[item] < a[item]) {
              return 1;
            }
            return 0;
          });
        } else {
          return copyData.sort((a, b) => {
            if (b[item] > a[item]) {
              return 1;
            }
            if (b[item] < a[item]) {
              return -1;
            }
            return 0;
          });
        }
    }

    return copyData;
  }

  let compare = true;
  postBtns.forEach((item) => {
    item.addEventListener('click', (e) => {
      filterList(compare, e.target.getAttribute('data-value')).then((data) => {
        renderPosts(data);
      });
      compare = !compare;
    });
  });

  // search table

  const searchInput = document.querySelector('.table__search-input');

  async function searchList(value) {
    const sortList = await getResource('/posts');
    const copyData = [...sortList];

    return copyData.filter((item) => item.title.indexOf(value) > -1);
  }

  searchInput.addEventListener('input', (e) => {
    const value = e.target.value;
    if (value.length > 3) {
      searchList(value).then((data) => renderPosts(data));
    } else {
      getResource('/posts').then((data) => renderPosts(data));
    }
  });
});
