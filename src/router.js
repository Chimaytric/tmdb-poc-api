import express from 'express';

import { getGenres, getMovies, getSearch } from './resolvers';

const router = express.Router();

router.route('/movies')
    .get(async (req, res) => {
        console.log('Request to get movies recieved');
        const movies = await getMovies();
        console.log('success');

        res.json(movies);
    });

router.route('/genres')
    .get(async (req, res) => {
        console.log('Request to get genres recieved');
        const genres = await getGenres();
        console.log('success');

        res.json(genres);
    });

router.route('/search/:searchKey')
    .get(async (req, res) => {
        const searchKey = req.params.searchKey;
        console.log(`Request to get search "${searchKey}" recieved`);
        const searchresult = await getSearch(searchKey);
        console.log('success');

        res.json(searchresult);
    });


export default router;