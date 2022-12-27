let animelist = [];
fetch(
    "https://raw.githubusercontent.com/Hejsil/dotfiles/master/local/share/aniz/list",
)
    .then((reponse) => reponse.text())
    .then((text) => {
        let lines = text.split("\n");
        for (line of lines) {
            let entries = line.split("\t");
            let entry = {
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

        let list = document.getElementById("list");
        let header = document.getElementById("list-header");
        let list_content = header.outerHTML;

        for (entry of animelist) {
            list_content += `<tr>
                <td><a href="${entry.link}">${entry.name}</a></td>
                <td>${entry.status}</td>
                <td>${entry.episodes}</td>
                <td>${entry.watched}</td>
                <td>${entry.last_updated}</td>
            </tr>`;
        }

        list.innerHTML = list_content;
    });
