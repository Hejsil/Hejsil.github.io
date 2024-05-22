const anime_list_link =
    "https://raw.githubusercontent.com/Hejsil/dotfiles/master/local/share/aniz/list";
const anime_database_link =
    "https://raw.githubusercontent.com/manami-project/anime-offline-database/master/anime-offline-database-minified.json";

async function fetchAnimeList() {
    const response = await fetch(anime_list_link);
    const text = await response.text();
    const lines = text.trim().split("\n");
    return lines.map((line) => {
        const entries = line.split("\t");
        return {
            lastUpdated: entries[0],
            status: entries[1],
            episodes: entries[2],
            watched: entries[3],
            name: entries[4],
            source: entries[5],
        };
    });
}

function statusToString(status) {
    switch (status) {
        case "d":
            return "Dropped";
        case "c":
            return "Completed";
        case "w":
            return "Watching";
        case "o":
            return "On Hold";
        case "p":
            return "Planning to Watch";
        default:
            return "???";
    }
}

function animeListToHtmlTable(anime_list) {
    const header = `<thead><tr>
        <th>Anime</th>
        <th>Status</th>
        <th>Episodes Watched</th>
        <th>Watch Count</th>
        <th>Last Updated</th>
    </tr></thead><tbody>`;

    return header + anime_list
        .map((entry) => {
            const status = statusToString(entry.status);
            return `<tr>
                <td><a href="${entry.source}">${entry.name}</a></td>
                <td>${status}</td>
                <td>${entry.episodes}</td>
                <td>${entry.watched}</td>
                <td>${entry.lastUpdated}</td>
            </tr>`;
        })
        .join("") +
        "</tbody>";
}

function drawAnimeList(anime_list) {
    const list = document.getElementById("animeList");
    list.innerHTML = animeListToHtmlTable(anime_list);
}

async function fetchAnimeDatabase() {
    const response = await fetch(anime_database_link);
    return await response.json();
}

function animeDatabaseBySource(database) {
    const result = {};
    database.data.forEach((item) => {
        item.sources.forEach((source) => {
            result[source] = item;
        });
    });

    return result;
}

function datasetByStatus(entries, status) {
    return {
        label: statusToString(status),
        data: entries.map((entry) =>
            entry[1].filter((item) => item.status == status).length
        ),
    };
}

function animeListByYear(anime_list, anime_database_by_src) {
    return Object.groupBy(
        anime_list,
        (item) => {
            const entry = anime_database_by_src[item.source];
            return entry.animeSeason.year;
        },
    );
}

function drawByReleaseYearChart(anime_list_by_release_year) {
    const by_release_year_entries = Object.entries(anime_list_by_release_year);
    by_release_year_entries.sort((a, b) => a[0] - b[0]);

    const chart_element = document.getElementById("byReleaseYearChart");
    new Chart(chart_element, {
        type: "bar",
        data: {
            labels: by_release_year_entries.map((item) => item[0]),
            datasets: [
                datasetByStatus(by_release_year_entries, "c"),
                datasetByStatus(by_release_year_entries, "d"),
            ],
        },
        options: {
            plugins: {
                title: { display: true, text: "Anime by Release Year" },
            },
        },
    });
}

function animeListByType(anime_list, anime_database_by_src) {
    return Object.groupBy(
        anime_list,
        (item) => {
            const entry = anime_database_by_src[item.source];
            return entry.type;
        },
    );
}

function drawByTypeChart(anime_list_by_type) {
    const by_type_entries = Object.entries(anime_list_by_type);
    const chart_element = document.getElementById("byTypeChart");
    new Chart(chart_element, {
        type: "bar",
        data: {
            labels: by_type_entries.map((item) => item[0]),
            datasets: [
                datasetByStatus(by_type_entries, "c"),
                datasetByStatus(by_type_entries, "d"),
            ],
        },
        options: {
            plugins: {
                title: { display: true, text: "Anime by Type" },
            },
        },
    });
}

async function asyncMain() {
    const anime_list_promise = fetchAnimeList();
    const anime_database_promise = fetchAnimeDatabase();
    const anime_list = await anime_list_promise;
    const anime_database = await anime_database_promise;

    const anime_database_by_src = animeDatabaseBySource(anime_database);
    const anime_list_by_release_year = animeListByYear(
        anime_list,
        anime_database_by_src,
    );
    const anime_list_by_type = animeListByType(
        anime_list,
        anime_database_by_src,
    );

    drawByReleaseYearChart(anime_list_by_release_year);
    drawByTypeChart(anime_list_by_type);
    drawAnimeList(anime_list);
}

asyncMain();
