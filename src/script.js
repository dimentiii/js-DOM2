const API_URL = 'https://picsum.photos/v2/list';
const IMAGES_PER_LOAD = 4;

const gallery = document.getElementById('gallery');
const message = document.getElementById('message');
const loadMoreButton = document.getElementById('load-more');
const clearButton = document.getElementById('clear');
const removeLastButton = document.getElementById('remove-last');
const reverseButton = document.getElementById('reverse');

let currentPage = 1;

function createCard(image) {
  const item = document.createElement('li');
  item.className = 'card';

  const img = document.createElement('img');
  img.className = 'card-image';
  img.src = `https://picsum.photos/id/${image.id}/400/300`;
  img.alt = `Фото автора ${image.author}`;
  img.loading = 'lazy';

  const author = document.createElement('p');
  author.className = 'card-author';
  author.textContent = `Автор: ${image.author}`;

  item.append(img, author);
  return item;
}

function updateMessage() {
  message.textContent = gallery.children.length === 0 ? 'Галерея порожня' : '';
}

async function loadImages() {
  loadMoreButton.disabled = true;
  message.textContent = 'Завантаження...';

  try {
    const response = await fetch(`${API_URL}?page=${currentPage}&limit=${IMAGES_PER_LOAD}`);

    if (!response.ok) {
      throw new Error(`Помилка сервера: ${response.status}`);
    }

    const images = await response.json();
    images.forEach(image => gallery.append(createCard(image)));
    currentPage += 1;
    updateMessage();
  } catch (error) {
    message.textContent = 'Не вдалося завантажити картинки. Спробуйте ще раз.';
  } finally {
    loadMoreButton.disabled = false;
  }
}

function clearGallery() {
  gallery.innerHTML = '';
  updateMessage();
}

function removeLastImage() {
  if (gallery.lastElementChild) {
    gallery.lastElementChild.remove();
  }
  updateMessage();
}

function reverseGallery() {
  const cards = Array.from(gallery.children).reverse();
  cards.forEach(card => gallery.append(card));
}

loadMoreButton.addEventListener('click', loadImages);
clearButton.addEventListener('click', clearGallery);
removeLastButton.addEventListener('click', removeLastImage);
reverseButton.addEventListener('click', reverseGallery);

loadImages();