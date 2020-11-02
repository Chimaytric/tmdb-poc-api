import { fetch } from '../utils';
import { API_KEY } from './constants';

const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`;

export default async () => {
    const result = await fetch(url);

    return result.genres;
};