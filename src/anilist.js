const drawTable = (listToDraw) => {
    const list = document.getElementById("list");
    const header = document.getElementById("list-header");
    const string = listToDraw
        .map(
            (entry) => `<tr>
                <td><a href="${entry.link}">${entry.name}</a></td>
                <td>${entry.status}</td>
                <td>${entry.episodes}</td>
                <td>${entry.watched}</td>
                <td>${entry.lastUpdated}</td>
            </tr>`
        )
        .join("");

    list.innerHTML = header.outerHTML + string;
};

fetch(
    "https://raw.githubusercontent.com/Hejsil/dotfiles/master/local/share/aniz/list"
)
    .then((reponse) => reponse.text())
    .then((text) => {
        const lines = text.trim().split("\n");
        const animelist = lines.map((line) => {
            const entries = line.split("\t");
            return {
                lastUpdated: entries[0],
                status: entries[1],
                episodes: entries[2],
                watched: entries[3],
                name: entries[4],
                link: entries[5],
            };
        });
        drawTable(animelist);
    });
