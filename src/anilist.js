let drawTable = (list_to_draw) => {
    const list = document.getElementById("list");
    const header = document.getElementById("list-header");
    let list_content = header.outerHTML;

    for (const entry of list_to_draw) {
        list_content += `<tr>
                <td><a href="${entry.link}">${entry.name}</a></td>
                <td>${entry.status}</td>
                <td>${entry.episodes}</td>
                <td>${entry.watched}</td>
                <td>${entry.last_updated}</td>
            </tr>`;
    }

    list.innerHTML = list_content;
};

let animelist = [];
fetch(
    "https://raw.githubusercontent.com/Hejsil/dotfiles/master/local/share/aniz/list",
)
    .then((reponse) => reponse.text())
    .then((text) => {
        let lines = text.split("\n");
        for (const line of lines) {
            const entries = line.split("\t");
            const entry = {
                last_updated: entries[0],
                status: entries[1],
                episodes: entries[2],
                watched: entries[3],
                name: entries[4],
                link: entries[5],
            };
            if (entry.link === undefined) {
                break;
            }

            animelist.push(entry);
        }

        drawTable(animelist);
    });
