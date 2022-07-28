


const fetch = require('node-fetch');
export default async function putData(url, packet) {
    try {

        const res = await fetch('http://localhost:4000' + url, {
            method: 'put',
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

