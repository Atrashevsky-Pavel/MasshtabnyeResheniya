const mainURL1 = 'https://cors-anywhere.herokuapp.com/';
const mainURL2 = 'https://mrsoft.by/tz20/list.json';
let arrayMenu;
let deleteArrayMenu = [];
let basepath;
function getData(url) {
    return fetch(url).then(response => {
        if(response.ok){
            return response.json();
        }
        return response.json().then(error => {
            const err =  new Error('error');
            err.data = error;
            throw err
        })
    });
}
function loadImage(src) {
    return new Promise((resolve, reject) => {
        let image = document.createElement('img');
        image.src = src;
        image.onload = () => resolve(image);
    });
}
function menu () {
    function conclusion(arr, classHTML, button, disabled = null) {
        let buttons = '';
        arr.forEach((item) => {
            buttons += `<div class="buttons">
                    <button class="btn btn-primary" ${disabled}
                    id = "${item.id}_" onclick="select('${item.more}', '${item.name}', '${item.shortInfo}')">
                    ${item.name}
                    </button><button id = "${item.id}_delete" 
                    class="btn btn-danger">${button}</button></div>`;
        });
        document.querySelector(`.${classHTML}`).innerHTML = buttons;
    }
    conclusion(arrayMenu, 'menu', '&#128274;' );
    conclusion(deleteArrayMenu, 'menuDelete', '&#128275;', 'disabled');
}
function sort (string) {
    let sortArray = [];
    if (string && !Number(string)) {
        arrayMenu.forEach((item, idx, array) => {
            if (string.toLowerCase() === item.name.toLowerCase().split('', string.length).join('')) {
                array.splice(idx, 1);
                sortArray.push(item);
            }
        });
        arrayMenu.unshift(...sortArray);
        menu();
    } else if(Number(string)){
        alert('Вводите буквы');
    }
}
let input = document.getElementById('search');
input.oninput = () => {
    sort(input.value);
};

function select(Link, name, shortInfo) {
    getData(mainURL1+basepath+Link).then((data) => {
        document.querySelector('.info').innerHTML = `<h3>${name}</h3><p>${shortInfo}</p><p>${data.bio}</p>`;
        loadImage(basepath + data.pic).then((image) => {
            document.querySelector('.info').appendChild(image);
        },() => { alert('Картинка не загружена')});
    });
}
function findAndDelete(idString, from) {
    let array =  idString.split('_');
    if(array[1]) {
        if(from) {
            let number = arrayMenu.findIndex(item => item.id == array[0]);
            deleteArrayMenu.push(arrayMenu[number]);
            arrayMenu.splice(number, 1);
        } else {
            let number = deleteArrayMenu.findIndex(item => item.id == array[0]);
            arrayMenu.push(deleteArrayMenu[number]);
            deleteArrayMenu.splice(number, 1);
        }
        menu();
    }
}
if(localStorage.getItem('memory') && localStorage.getItem('memoryDelete') && localStorage.getItem('basepath')) {
    arrayMenu = JSON.parse(localStorage.getItem('memory'));
    deleteArrayMenu = JSON.parse(localStorage.getItem('memoryDelete'));
    basepath = localStorage.getItem('basepath');
    menu();
}else {
    getData(mainURL1+mainURL2).then((data) =>{
        arrayMenu = data.data;
        basepath = data.basepath;
        menu();
        document.querySelector('.menuDelete').addEventListener('click', (value) => {
            if(value.isTrusted){
                findAndDelete(value.target.id, false);
            }
        });
        document.querySelector('.menu').addEventListener('click', (value) => {
            if(value.isTrusted){
                findAndDelete(value.target.id, true);
            }
        });
    })
}
document.getElementById('save').addEventListener('click', () => {
localStorage.setItem('memory', JSON.stringify(arrayMenu));
localStorage.setItem('memoryDelete', JSON.stringify(deleteArrayMenu));
localStorage.setItem('basepath', basepath);
});
document.getElementById('clear').addEventListener('click' ,() =>{
   localStorage.clear();
});