const axios = require('axios');

// export async function postData(url, packet) {
//     try {
//         // const res = axios.post(url,packet)
//         let res = await fetch('http://localhost:4000' + url, {
//             method: 'post',
//             body: JSON.stringify(packet),
//             headers: { 'Content-Type': 'application/json' }
//         });
//         return { statusCode: res.status, body: await res.json() };
//     } catch (err) {
//          console.log('error: ' +  err);
//     }
// }

// export async function getData(url) {

//     // let res = axios.get(url);
//     let res = await fetch('http://localhost:4000' + url);
//     return { statusCode: res.status, body: await res.json() };
    // let dummyData = {
    //     firstName: 'KIRITI',
    //     lastName: "MUKHERJEE",
    //     registrationNo: 2017331063,
    //     email: 'kimuapon@gmail.com',
    //     isTeacher: false,
    //     about: `Hi! I'm magic-kiri!`
    // }
    // return { statusCode: 200 , body: dummyData  };
// }


async function postData(url, packet) {
    let res;
    try {
        res = await axios.post('http://localhost:4000' + url, packet )
        return res.data;
    } catch (err) {
        console.log('error');
        return {statusCode: 404};
        // return {statusCode:res.status, body: res.data}
         console.log('error: ' +  err);
    }
}


async function getData(url) {
    console.log("ashiteseee!");
    let res = axios.get('http://localhost:4000' + url);

    return res.data;
}

// export default postData;
export default  {postData,getData}