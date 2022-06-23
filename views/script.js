const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');
//const newUserSubmit = document.getElementById('userSubmit');
const apiTable = document.getElementById("apiTable");
//const loginUser = document.getElementById("user-submit");
const newPhotoId = document.getElementById("newPhotoId");
const newCaptionSubmit = document.getElementById("newCaptionSubmit");
const newCaption = document.getElementById("newCaption");
const newUuid = document.getElementById("newUuid");
const captionIdToUpdate = document.getElementById("captionIdToUpdate");
const updatedCaption = document.getElementById("updatedCaption");
const deleteCaptionSubmit = document.getElementById("deleteCaptionSubmit");
const updateCaptionSubmit = document.getElementById("updateCaptionSubmit");
const currentId = document.getElementById("currentId");
const currentUuid = document.getElementById("currentUuid");


const onStartUp = async() => {

    const results = await getJsonResponse('/photos');
    const results2 = await getJsonResponse('/users');

    while(apiTable.hasChildNodes()) {
        apiTable.removeChild(apiTable.firstChild);
    }

    results.forEach(photo => {
        console.log(photo.url);
        let captionBodyArray = [];
        let row = apiTable.insertRow();
        let row2 = apiTable.insertRow();
        row.id = photo.id;
        if (row.id % 2 !== 0){
            row = apiTable.rows[0];
            row2 = apiTable.rows[1];
        } else {
            row = apiTable.rows[2]
            row2 = apiTable.rows[3]
        }
        let cell1 = row.insertCell();
        //let cell2 = row.insertCell();
       // let cell3 = row.insertCell();
        let cell5 = row2.insertCell();
        cell1.innerHTML = `<h1 style="color:blue;">${photo.id}. ${photo.name}</h1> <img src="${photo.url}" alt="" height="200" width="200" />`
        //cell2.innerHTML = `<h2 style="color:black;">${photo.name}</h2>`;
        //cell3.innerHTML = `<img src="${photo.url}" alt="" height="200" width="200" />`;
        photo.captions.forEach(caption => {
            results2.forEach(user => {
                if (user.id == caption.userId) {
                    captionBodyArray.push(`${caption.id}` + '. ' + caption.body + `<br/>` + `-${user.name}` + `<br/><br/>`);
                    return;
                }
            })
        })
          
        cell5.innerHTML = `<h4 style="color:rgb(6, 6, 56);font-style:italic;font-weight:200;font-size:20px;font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;">${captionBodyArray.join(' ')}</h4>`;
    })

    while(apiTable2.hasChildNodes()) {
        apiTable2.removeChild(apiTable2.firstChild);
    }
    /*results2.forEach(user => {
        let row = apiTable2.insertRow();
        row.id = user.id;
        console.log(user.id);
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        let cell3 = row.insertCell(2);
        cell1.innerHTML = `${user.name}`;
        cell2.innerHTML = `${user.email}`;
        cell3.innerHTML = `${user.password}`;
    })*/
}

const getJsonResponse = async (url) => {
    console.log(url);
    const response = await fetch(url);
    console.log(response);
    try{
        if (response.ok){
            const jsonResponse = await response.json();
            console.log(jsonResponse);
            return jsonResponse;
        }
    } catch(err){
        console.log(err);
    }
}

const appendUser = function (user) {
    let row = apiTable2.insertRow();
    row.id = user.id;
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    cell1.innerHTML = `${user.name}`;
    cell2.innerHTML = `${user.email}`;
    cell3.innerHTML = `${user.password}`;
}

const postUser = async(name, email, password) => {
    const url = '/users';
    const objToPost = {
        name: name,
        email: email,
        password: password
    }
    try{
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors',
            body: JSON.stringify(objToPost),
        })
        if (response.ok) {
            const jsonResponse = response.json();
            return jsonResponse;
        }
    } catch (err) {
        console.log(error);
    } 
}

const postCaption = async(userUuid, photoId, body) => {
    const url = '/captions';
    const objToPost = {
        userUuid: userUuid,
        photoId: photoId,
        body: body
    }
    try{
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors',
            body: JSON.stringify(objToPost),
        })
        if (response.ok) {
            const jsonResponse = response.json();
            return jsonResponse;
        }
    } catch (err) {
        console.log(err);
    } 
}

const updateCaption = async(userUuid, userId, captionId, body) => {
    const url = '/captions/' + captionId;
    const updatedCaption = {
        uuid: userUuid,
        userId: userId,
        body: body
    }
    try{
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors',
            body: JSON.stringify(updatedCaption),
        })
        if (response.ok) {
            const jsonResponse = response.json();
            return jsonResponse;
        }
    } catch (err) {
        console.log(err);
    } 
}

const deleteCaption = async(userUuid, currentUserId, captionId) => {
    const url = '/captions/' + captionId;
    const deleteInfo = {
        uuid: userUuid,
        userId: currentUserId,
    }
    try{
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors',
            body: JSON.stringify(deleteInfo)
        })
        console.log('you are close, guy.')
        console.log(response);
        if (response.ok) {
            const jsonResponse = response.json();
            return jsonResponse;
        }
    } catch (err) {
        console.log(err);
    }
}

newCaptionSubmit.onclick = async() => {
    let photoId = newPhotoId.value;
    let body = newCaption.value;
    let userUuid = newUuid.value;
    let response = await postCaption(userUuid, photoId, body);
    onStartUp();
    if (response.ok) {
        jsonResponse = response.json();
        return jsonResponse;
    }
}

updateCaptionSubmit.onclick = async() => {
    let userUuid = currentUuid.value;
    let currentUserId = currentId.value;
    let captionId = captionIdToUpdate.value;
    let body = updatedCaption.value;
    let response = await updateCaption(userUuid, currentUserId, captionId, body);
    onStartUp();
    if (response.ok) {
        jsonResponse = response.json();
        return jsonResponse;
    }
}

deleteCaptionSubmit.onclick = async() => {
    let userUuid = currentUuid.value;
    let currentUserId = currentId.value;
    let captionId = captionIdToUpdate.value;
    let response = await deleteCaption(userUuid, currentUserId, captionId);
    console.log(response);
    onStartUp();
    if (response.ok) {
        jsonResponse = response.json();
        return jsonResponse;
    }
}


onStartUp();