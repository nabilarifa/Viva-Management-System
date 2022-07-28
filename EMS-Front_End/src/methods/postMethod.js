


const fetch = require('node-fetch');
export default async function postData(url, packet) {
    try {

        const res = await fetch('http://localhost:4000' + url, {
            method: 'post',
            body: JSON.stringify(packet),
            headers: { 'Content-Type': 'application/json' },
        });
        const data = await res.json();
        console.log('here', data);
        return { status: res.status, body: data };
    }
    catch (err) {
        console.log(err);
        return err;
    }
}

