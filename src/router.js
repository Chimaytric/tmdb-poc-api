import express from 'express';

import { getGenres, getSearch } from './resolvers';

const router = express.Router();

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
        console.log(`success (${searchresult.length} results)`);

        res.json(searchresult);
    });


export default router;