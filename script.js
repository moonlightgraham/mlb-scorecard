// MLB Stats API base URL
const API_BASE = "https://statsapi.mlb.com/api/v1";

// List of MLB teams (2025 season)
const teams = [
    { id: 109, name: "Arizona Diamondbacks" },
    { id: 144, name: "Atlanta Braves" },
    { id: 110, name: "Baltimore Orioles" },
    { id: 111, name: "Boston Red Sox" },
    { id: 112, name: "Chicago Cubs" },
    { id: 145, name: "Chicago White Sox" },
    { id: 113, name: "Cincinnati Reds" },
    { id: 114, name: "Cleveland Guardians" },
    { id: 115, name: "Colorado Rockies" },
    { id: 116, name: "Detroit Tigers" },
    { id: 117, name: "Houston Astros" },
    { id: 118, name: "Kansas City Royals" },
    { id: 108, name: "Los Angeles Angels" },
    { id: 119, name: "Los Angeles Dodgers" },
    { id: 146, name: "Miami Marlins" },
    { id: 158, name: "Milwaukee Brewers" },
    { id: 142, name: "Minnesota Twins" },
    { id: 121, name: "New York Mets" },
    { id: 147, name: "New York Yankees" },
    { id: 133, name: "Oakland Athletics" },
    { id: 143, name: "Philadelphia Phillies" },
    { id: 134, name: "Pittsburgh Pirates" },
    { id: 135, name: "San Diego Padres" },
    { id: 137, name: "San Francisco Giants" },
    { id: 136, name: "Seattle Mariners" },
    { id: 120, name: "St. Louis Cardinals" },
    { id: 139, name: "Tampa Bay Rays" },
    { id: 140, name: "Texas Rangers" },
    { id: 141, name: "Toronto Blue Jays" },
    { id: 122, name: "Washington Nationals" }
];

let selectedLineup = [];

// Load teams into dropdown on page load
window.onload = function() {
    const teamSelect = document.getElementById("team-select");
    teams.forEach(team => {
        const option = document.createElement("option");
        option.value = team.id;
        option.textContent = team.name;
        teamSelect.appendChild(option);
    });
};

// Fetch and display team roster
async function loadRoster() {
    const teamId = document.getElementById("team-select").value;
    if (!teamId) return;

    selectedLineup = []; // Reset lineup
    document.getElementById("scorecard").classList.add("hidden");

    const response = await fetch(`${API_BASE}/teams/${teamId}/roster?season=2025`);
    const data = await response.json();
    const roster = data.roster;

    // Categorize players by position
    const pitchers = roster.filter(p => p.position.code === "1");
    const infielders = roster.filter(p => ["2", "3", "4", "5", "6"].includes(p.position.code));
    const outfielders = roster.filter(p => ["7", "8", "9"].includes(p.position.code));

    // Display rosters
    displayRoster("pitchers", "Pitchers", pitchers);
    displayRoster("infielders", "Infielders", infielders);
    displayRoster("outfielders", "Outfielders", outfielders);

    document.getElementById("generate-btn").classList.remove("hidden");
}

// Display roster section
function displayRoster(elementId, title, players) {
    const container = document.getElementById(elementId);
    container.innerHTML = `<h4>${title}</h4>`;
    players.forEach(player => {
        const div = document.createElement("div");
        div.innerHTML = `
            <input type="checkbox" value="${player.person.fullName}" data-pos="${player.position.abbreviation}">
            ${player.person.fullName} (${player.position.abbreviation})
        `;
        container.appendChild(div);
    });
}

// Generate scorecard from selected players
function generateScorecard() {
    const checkboxes = document.querySelectorAll("#roster-section input[type='checkbox']:checked");
    selectedLineup = Array.from(checkboxes).map(cb => ({
        player: cb.value,
        position: cb.dataset.pos
    }));

    if (selectedLineup.length === 0) {
        alert("Please select at least one player!");
        return;
    }

    const lineupTable = document.getElementById("lineup");
    lineupTable.innerHTML = "";

    selectedLineup.forEach(player => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${player.position}</td>
            <td>${player.player}</td>
            ${Array(10).fill('<td><div class="diamond"></div></td>').join('')}
        `;
        lineupTable.appendChild(row);
    });

    document.getElementById("scorecard").classList.remove("hidden");
}

// Edit scorecard (make cells editable)
function editScorecard() {
    const lineupTable = document.getElementById("lineup");
    const rows = lineupTable.getElementsByTagName("tr");

    for (let row of rows) {
        const cells = row.getElementsByTagName("td");
        cells[1].contentEditable = true; // Player name
        for (let i = 2; i < cells.length; i++) {
            cells[i].contentEditable = true; // Inning cells
        }
    }
    alert("You can now edit player names and inning cells! Use shorthand like 'K' for strikeout, '1B' for single, etc.");
}
