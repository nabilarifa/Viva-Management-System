const fetch = require('node-fetch');
export default async function getData(url) {
    try {
        const res = await fetch('http://localhost:4000' + url);
        const data = await res.json();
        return { status: res.status, body: data };
    }
    catch (err) {
        console.log(err);
        return err;
    }
}
