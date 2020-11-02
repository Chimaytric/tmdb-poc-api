import fetch from 'node-fetch';

export default async url => {
    const result = await fetch(url);

    return await result.json();
}