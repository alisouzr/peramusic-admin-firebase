import { collection, deleteDoc, doc, getFirestore, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

const dadosSong = getFirestore();

let songs = [];

const tableSongs = document.querySelector("table#table-songs tbody");

const modalCreateSong = document.getElementById("modal-songs-create");
let modalSongsCreate;
if (modalCreateSong) modalSongsCreate = new bootstrap.Modal(modalCreateSong, {});
const formSongsCreate = document.querySelector("#form-songs-create");

const modalUpdateSong = document.getElementById("modal-songs-update");
let modalSongsUpdate;
if (modalUpdateSong) modalSongsUpdate = new bootstrap.Modal(modalUpdateSong, {});
const formSongsUpdate = document.querySelector("#form-songs-update");

function renderSongs() {

    if (tableSongs) {

        tableSongs.innerHTML = '';

        songs.forEach(async function (item) {

            const tableRow = document.createElement("tr");

            tableRow.innerHTML = `
            <td>
                    <div class="d-flex px-2 py-1">
                        <div>
                            <img src="${item.picture ? "../assets/img/" + item.picture : "../assets/img/tesla-model-s.png"}" class="avatar avatar-sm me-3 border-radius-lg"
                                alt="${item.name}">
                        </div>
                    <div class="d-flex px-2 py-1 center-flex">
                        <div class="d-flex flex-column justify-content-center">
                            <h6 class="mb-0 text-sm">${item.music}</h6>
                            <p class="text-xs text-secondary mb-0">${item.name}</p>
                        </div>
                    </div>
            </td>
            <td>
                <p class="text-xs font-weight-bold mb-0">${item.typeSong}</p>
            </td>
            <td class="align-middle text-center text-sm">
                <span class="badge badge-sm ${(item.status === "1") ? "bg-gradient-success" : "bg-gradient-secondary"}">${item.status === "1" ? "Like" : "Dislike"}</span>
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
                    const input = formSongsUpdate.querySelector(`[name=${prop}]`);

                    if (input) {

                        if (input.type === "radio") {
                            formSongsUpdate.querySelector(`[name=${prop}][value="${item[prop]}"]`).click();


                        } else {
                            input.value = item[prop];
                        }

                    }

                };


                modalSongsUpdate.show();


            })

            tableRow.querySelector(".button-delete").addEventListener("click", async (event) => {

                event.preventDefault();

                if (confirm(`Deseja realmente excluir a música ${item.music}?`)) {

                    await deleteDoc(doc(dadosSong, "songs", item.id));

                    tableRow.remove();
                };

            });

            tableSongs.appendChild(tableRow);


        });

    }
};


onSnapshot(collection(dadosSong, "songs"), (dados) => {

    songs = [];

    dados.forEach(document => {

        const object = {
            ...document.data(),
            id: document.id,
        };
        songs.push(object);
    });

    renderSongs();
});

if (formSongsCreate) {
    formSongsCreate.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = new FormData(formSongsCreate);

        await setDoc(doc(dadosSong, "songs", uuidv4()), {
            music: formData.get("music"),
            name: formData.get("name"),
            typeSong: formData.get("typeSong"),
            status: formData.get("status"),
            picture: formData.get("picture"),
            register: new Date(),
        });

        modalSongsCreate.hide();

    });

}


if (formSongsUpdate) {
    formSongsUpdate.addEventListener("submit", async (e) => {

        e.preventDefault();

        const formData = new FormData(formSongsUpdate);

        await updateDoc(doc(dadosSong, "songs", formData.get("id")), {
            music: formData.get("music"),
            name: formData.get("name"),
            typeSong: formData.get("typeSong"),
            status: formData.get("status"),
            picture: formData.get("picture"),
        });

        modalSongsUpdate.hide();

    });
}
