import { prop, pipe, applySpec, concat, always, ifElse, isNil } from 'ramda';

import { fetch } from '../utils';
import { API_KEY } from './constants';

const makeUrl = (searchKey, page) => `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURI(searchKey)}&page=${page}&include_adult=false`;

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
        ifElse(
            isNil,
            always(null),
            concat('https://image.tmdb.org/t/p/w500'),
        ),
    ),
    popularity       : prop('popularity'),
    vote             : prop('vote_average'),
    genres           : prop('genre_ids'),

}))(movie);

export default async (searchKey) => {
    const result = await fetch(makeUrl(searchKey, 1));
    const totalPages = getTotalPagesFromResult(result);
    const pageOne = getListFromResult(result);

    let resultPagesPromises = [];

    for (let page = 2; page <= totalPages; page++) {
        resultPagesPromises.push(fetch(makeUrl(page)));
    }

    const resultPages = await Promise.all(resultPagesPromises);

    const moviesPages = resultPages.reduce((acc, val) => [
        ...acc,
        ...getListFromResult(val),
    ], []);

    return [...pageOne, ...moviesPages].map(movie => formatMovie(movie));
};