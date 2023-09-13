import axios from 'axios';
export class PixabayAPI {
  static BASE_URL = 'https://pixabay.com/api/';
  constructor() {
    this.query = null;
    this.page = 0;
    this.total_hits = 0;
  }

  getPhotos() {
    const options = {
      params: {
        key: '39421409-9e9b7072924fda42bb38c6b65',
        q: this.query,
        orientation: 'horizontal',
        image_type: 'photo',
        safeSearch: false,
        page: this.page,
        per_page: 40,
      },
    };
    return axios.get(`${PixabayAPI.BASE_URL}`, options);
  }
}
