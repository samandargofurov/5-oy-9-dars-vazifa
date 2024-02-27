import { createRow, validate } from "./functions.js";

const tbody = document.querySelector("#tbody");
const btn = document.querySelector('#btn');
const form = document.getElementById('form');
const name = document.getElementById('name');
const status = document.getElementById('status');
const description = document.getElementById('description');
const price = document.querySelector('#price');

btn && btn.addEventListener('click', function(e) {
    e.preventDefault();
    const isValid = validate(name, price, status, description);

    if (isValid) {
        btn.setAttribute('disabled', true)
        btn.innerHTML = 'Sending...'

        const phone = {
            name: name.value,
            status: status.value,
            description: description.value,
            price: price.value,
            category_id: 2
        }

        fetch('https://auth-rg69.onrender.com/api/products', {
            method: 'POST',
            headers: {
                "Content-type": 'application/json'
            },
            body: JSON.stringify(phone)
        })
            .then(res => res.json())
            .then(data => {
                btn.removeAttribute('disabled');
                btn.innerHTML = 'Save'
                if (data.id) {
                    let row = createRow(data, tbody.childElementCount + 1);
                    tbody.innerHTML += row
                }
            })
            .catch(err => {
                console.log(err);
            })
    }
})

const API = "https://auth-rg69.onrender.com/api/products"

document.addEventListener('DOMContentLoaded', function() {
    fetch(`${API}/all`, {
        method: 'GET'
    })
        .then(res => {
            if (res.status == 200) {
                return res.json();
            }
        })
        .then(data => {
            if (data.length) {
                data.forEach((phone, index) => {
                    let row = createRow(phone, index + 1)
                    tbody.innerHTML += row;
                });

                const deleteButtons = document.querySelectorAll('i.fa-trash-can');

                if(deleteButtons.length) {
                    deleteButtons.forEach(del => {
                        del.addEventListener('click', function() {
                            let isDelete = confirm('Are you gonna delete this information')
                            if (isDelete) {
                                let id = this.parentNode.getAttribute('data-id');
                                console.log(id);
                                if (id) {
                                    fetch(`${API}/${id}`, {
                                        method: "DELETE"
                                    })
                                    .then(res => res.json())
                                    .then(data => {
                                        console.log(data);
                                        if (data.message == "Mahsulot muvaffaqiyatli o'chirildi") {
                                            window.location.reload();
                                        }
                                    })
                                    .catch(err => {
                                        console.log(err);
                                    })
                                }
                            }
                        })
                    });
                }

            }
        })
        .catch(err => {
            console.log(err);
        })
});