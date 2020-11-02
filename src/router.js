import express from 'express';

import { getGenres, getMovies } from './resolvers';

const router = express.Router();

router.route('/movies')
    .get(async (req, res) => {
        const movies = await getMovies();
        res.json(movies);
    });

router.route('/genres')
    .get(async (req, res) => {
        const genres = await getGenres();
        res.json(genres);
    })

export default router;