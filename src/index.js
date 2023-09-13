import Notiflix from 'notiflix';
import { PixabayAPI } from './api';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
const refs = {
  formEL: document.querySelector('#search-form'),
  btnEl: document.querySelector('.btn'),
  inputEl: document.querySelector('.input'),
  galleryDiv: document.querySelector('.gallery'),
  btnMore: document.querySelector('.btn-more'),
};
const newPixabayAPI = new PixabayAPI();

refs.formEL.addEventListener('submit', onFormElSubmit);
async function onFormElSubmit(event) {
  event.preventDefault();
  newPixabayAPI.page = 1;

  newPixabayAPI.query = refs.inputEl.value.trim();
  if (newPixabayAPI.query === '') {
    Notiflix.Notify.failure('Enter something to search');
    return;
  }

  try {
    const { data } = await newPixabayAPI.getPhotos();
    console.log({ data });

    if (data.totalHits === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      event.target.reset();
      refs.galleryDiv.innerHTML = '';
      refs.btnMore.style.display = 'none';

      return;
    }

    Notiflix.Notify.info(`Hooray! We found ${data.totalHits} images.`);

    newPixabayAPI.total_hits = data.totalHits;

    refs.galleryDiv.innerHTML = getMarkup(data.hits);
    refs.btnMore.style.display = 'block';
    if (data.totalHits <= 40) {
      refs.btnMore.style.display = 'none';
    }
  } catch (er) {
    Notiflix.Notify.failure(er);
  }
}

function getMarkup(data) {
  const markup = data
    .map(el => {
      return `<div class="photo-card">
    

    <a class='gallery__link' href="${el.largeImageURL}"><img class='gallery__image' src="${el.webformatURL}" alt="" title=""/></a>


    <div class="info">
      <p class="info-item">
        <b>Likes: ${el.likes}</b>
      </p>
      <p class="info-item">
        <b>Views:${el.views}</b>
      </p>
      <p class="info-item">
        <b>Comments:${el.comments}</b>
      </p>
      <p class="info-item">
        <b>Downloads:${el.downloads}</b>
      </p>
    </div>
  </div>`;
    })
    .join('');
  return markup;
}

refs.btnMore.addEventListener('click', onbtnMoreClick);
async function onbtnMoreClick() {
  newPixabayAPI.page += 1;
  try {
    const { data } = await newPixabayAPI.getPhotos();
    if (Math.ceil(data.totalHits / 40) < newPixabayAPI.page) {
      refs.btnMore.style.display = 'none';
      Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
      return;
    }
    refs.galleryDiv.insertAdjacentHTML('beforeend', getMarkup(data.hits));
  } catch (err) {
    Notiflix.Notify.failure(err);
  }
}
