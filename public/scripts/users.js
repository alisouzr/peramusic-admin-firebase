import { collection, deleteDoc, doc, getFirestore, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

const database = getFirestore();

let singers = [];

const tableUsers = document.querySelector("table#table-users tbody");

const modalCreate = document.getElementById('exampleModal');
let modalSingersCreate;
if (modalCreate) modalSingersCreate = new bootstrap.Modal(modalCreate, {});
const formSingersCreate = document.querySelector("#exampleModal #form-singers-create");

const modalUpdate = document.getElementById("exampleModal-update");
let modalSingerUpdate;
if (modalUpdate) modalSingerUpdate = new bootstrap.Modal(modalUpdate, {});
const formSingersUpdate = document.querySelector("#form-singers-update");

function renderSingers() {

    if (tableUsers) {

        tableUsers.innerHTML = '';

        singers.forEach(async function (item) {

            const tableRow = document.createElement("tr");

            tableRow.innerHTML = `
                <td>
                    <div class="d-flex px-2 py-1">
                        <div>
                            <img src="${item.photo ? "../assets/img/" + item.photo : "../assets/img/tesla-model-s.png"}" class="avatar avatar-sm me-3 border-radius-lg"
                                alt="${item.name}">
                        </div>
                        <div class="d-flex flex-column justify-content-center">
                            <h6 class="mb-0 text-sm">${item.name}</h6>
                            <p class="text-xs text-secondary mb-0">${item.album}</p>
                        </div>
                    </div>
                </td>
                <td>
                    <p class="text-xs font-weight-bold mb-0">${item.typeSong}</p>
                </td>
                <td class="align-middle text-center text-sm">
                    <span class="badge badge-sm ${(item.status === "1") ? "bg-gradient-success" : "bg-gradient-secondary"}">${item.status === "1" ? "Up" : "Down"}</span>
                </td>
                <td class="align-middle text-center">
                    <span class="text-secondary text-xs font-weight-bold">${await item.register.toDate().toLocaleDateString("pt-BR")}</span>
                </td>
                <td class="flex-td">
                <a class="nav-link text-secondary button-edit" href="#">
                <div class="text-center me-2 d-flex align-items-center justify-content-center" title="Editar">
                <i class="material-icons opacity-10">edit</i>
                </div>
            </a>
                    <a class="nav-link button-delete" href="#">
                        <div class="text-center me-2 d-flex align-items-center justify-content-center" title="Deletar">
                        <i class="material-icons opacity-10">delete</i>
                        </div>
                    </a>
                </td>
            `;



            tableRow.querySelector(".button-edit").addEventListener("click", (e) => {

                e.preventDefault();

                for (let prop in item) {
                    const input = formSingersUpdate.querySelector(`[name=${prop}]`);

                    if (input) {

                        if (input.type === "radio") {
                            formSingersUpdate.querySelector(`[name=${prop}][value="${item[prop]}"]`).click();
                        } else {
                            input.value = item[prop];
                        }

                    }

                };

                modalSingerUpdate.show();
            })

            tableRow.querySelector(".button-delete").addEventListener("click", async (event) => {

                event.preventDefault();

                if (confirm(`Deseja realmente excluir cantor ${item.name}?`)) {

                    await deleteDoc(doc(database, "cantores", item.id));

                    tableRow.remove();
                };

            });

            tableUsers.appendChild(tableRow);


        });
    }


};


onSnapshot(collection(database, "cantores"), (data) => {

    singers = [];

    data.forEach(document => {

        const obj = {
            ...document.data(),
            id: document.id,
        };
        singers.push(obj);
    });

    renderSingers();
});

if (formSingersCreate) {

    formSingersCreate.addEventListener("submit", async (event) => {


        event.preventDefault();

        const formData = new FormData(formSingersCreate);

        await setDoc(doc(database, "cantores", uuidv4()), {
            name: formData.get("name"),
            album: formData.get("album"),
            typeSong: formData.get("typeSong"),
            status: formData.get("status"),
            photo: formData.get("photo"),
            register: new Date(),
        });

        modalSingersCreate.hide();



    });
}

if (formSingersUpdate) {
    formSingersUpdate.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(formSingersUpdate);

        await updateDoc(doc(database, "cantores", formData.get("id")), {
            name: formData.get("name"),
            album: formData.get("album"),
            typeSong: formData.get("typeSong"),
            status: formData.get("status"),
            photo: formData.get("photo"),
        });

        modalSingerUpdate.hide();

    });
}
