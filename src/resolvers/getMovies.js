import { prop, pipe, applySpec, concat } from 'ramda';

import { fetch } from '../utils';
import { API_KEY } from './constants';

const makeUrl = (page) => `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-GB&page=${page}`;

const getListFromResult = result => prop('results', result);
const getTotalPagesFromResult = result => prop('total_pages', result);

const formatMovie = movie => pipe(applySpec({
    id               : prop('id'),
    title            : prop('title'),
    synopsis         : prop('overview'),
    originalLanguage : prop('original_language'),
    originalTitle    : prop('original_title'),
    poster           : pipe(
        prop('poster_path'),
        concat('https://image.tmdb.org/t/p/w500'),
    ),
    popularity       : prop('popularity'),
    vote             : prop('vote_average'),
    genres           : prop('genre_ids'),

}))(movie);

export default async () => {
    const result = await fetch(makeUrl(1));
    const totalPages = getTotalPagesFromResult(result);
    const pageOne = getListFromResult(result).map(movie => formatMovie(movie));

    let resultPagesPromises = [];

    for (let page = 2; page <= totalPages; page++) {
        resultPagesPromises.push(fetch(makeUrl(page)));
    }

    const resultPages = await Promise.all(resultPagesPromises);

    const moviesPages = resultPages.map(result => getListFromResult(result));

    return [...pageOne, ...moviesPages];
};
