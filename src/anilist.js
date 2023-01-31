const drawTable = (listToDraw) => {
    const list = document.getElementById("list");
    const header = `<tr>
        <th>Anime</th>
        <th>Status</th>
        <th>Episodes Watched</th>
        <th>Watch Count</th>
        <th>Last Updated</th>
    </tr>`;

    const table = listToDraw
        .map((entry) => {
            const status = (() => {
                switch (entry.status) {
                    case "d":
                        return "Dropped";
                    case "c":
                        return "Completed";
                    case "w":
                        return "Watching";
                    case "o":
                        return "On hold";
                    case "p":
                        return "Planning to watch";
                    default:
                        return "???";
                }
            })();

            return `<tr>
                <td><a href="${entry.link}">${entry.name}</a></td>
                <td>${status}</td>
                <td>${entry.episodes}</td>
                <td>${entry.watched}</td>
                <td>${entry.lastUpdated}</td>
            </tr>`;
        })
        .join("");

    list.innerHTML = header + table;
};

fetch(
    "https://raw.githubusercontent.com/Hejsil/dotfiles/master/local/share/aniz/list",
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
