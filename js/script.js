document.addEventListener("DOMContentLoaded", function () {
    // 1. récupérer les données de chaque json et les renvoyer dans 3 fonctions :
    // - displayAuditeursData
    // - createEuropeanMap
    // - createHorizontalBarChart


    // auditeurs charts
    fetch('data/auditeurs_charts.json')
        .then(response => response.json())
        .then(dataAuditeurs => {
            // Appel de la fonction pour afficher les données dans la page HTML
            displayAuditeursData(dataAuditeurs);
        })
        .catch(error => console.error('Erreur lors du chargement des données :', error));


    // map europe
    fetch('data/map_europe.json')
        .then(response => response.json())
        .then(dataMap => configureMapEvents(dataMap))
        .catch(error => console.error('Erreur lors du chargement des données :', error));

    // podium auditeurs
    fetch('data/podium_auditeurs.json')
        .then(response => response.json())
        .then(dataPodium => {
            // Stocker les données globalement
            window.dataPodium = dataPodium;

            // Créer le graphique initial
            createHorizontalBarChart(2016);
        })
        .catch(error => console.error('Erreur lors du chargement des données :', error));
}
);



// Fonctions pour afficher les données dans la page HTML

// auditeurs charts
function displayAuditeursData(dataAuditeurs) {
    const auditeursDataContainer = document.getElementById('auditeursData');

    // Création d'une table pour afficher les données de manière tabulaire
    const table = document.createElement('table');
    table.border = '1';

    // Création de l'en-tête de la table
    const headerRow = table.insertRow(0);
    for (const key in dataAuditeurs[0]) {
        const headerCell = document.createElement('th');
        headerCell.textContent = key.charAt(0).toUpperCase() + key.slice(1); // Mettre la première lettre en majuscule
        headerRow.appendChild(headerCell);
    }

    // Remplissage de la table avec les données
    dataAuditeurs.forEach(entry => {
        const row = table.insertRow();
        for (const key in entry) {
            const cell = row.insertCell();
            cell.textContent = entry[key];
        }
    });

    // Ajout de la table au conteneur
    auditeursDataContainer.appendChild(table);
}




// carte de l'europe

// Fonction pour configurer les événements de survol après le chargement de la carte
function configureMapEvents(dataMap) {
    document.querySelectorAll('.country').forEach(country => {
        const countryName = country.id;
        const population = dataMap[countryName];

        country.addEventListener('mouseover', (event) => {
            showTooltip(event, countryName, population);
        });

        country.addEventListener('mouseout', () => {
            hideTooltip();
        });
    });
}


// Fonction pour afficher le tooltip
function showTooltip(event, countryName, population) {
    const tooltip = document.getElementById('tooltip');
    tooltip.innerHTML = `${countryName}: ${population}`;
    tooltip.style.display = 'block';
    tooltip.style.left = event.pageX + 'px';
    tooltip.style.top = event.pageY + 'px';
}

// Fonction pour masquer le tooltip
function hideTooltip() {
    const tooltip = document.getElementById('tooltip');
    tooltip.style.display = 'none';
}




// chart js podium

let myChart;
// let years = [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023];

function createHorizontalBarChart(selectedYear) {
    // Récupérer les données pour l'année sélectionnée
    const selectedYearData = 2023;
    const cities = Object.keys(selectedYearData).filter(key => key.startsWith('top'));

    // Configuration du graphique
    const ctx = document.getElementById('myChart').getContext('2d');
    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: cities.map(city => selectedYearData[city].city),
            datasets: [{
                label: `Top 4 des Villes en ${selectedYear}`,
                data: cities.map(city => selectedYearData[city].auditeurs),
                backgroundColor: 'blue',
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            plugins: {
                legend: {
                    display: false,
                },
                title: {
                    display: true,
                    text: `Top 4 des Villes en ${selectedYear} avec le Nombre de Voyageurs`
                }
            },
            scales: {
                x: {
                    ticks: {
                        beginAtZero: true,
                    }
                },
                y: {
                    stacked: true,
                }
            }
        }
    });
}

// mettre a jour la vue du graphique au clic d'une nouvelle année
// function updateChart(selectedYear) {
//     // Vérifier si le graphique existe déjà
//     if (myChart) {
//         // Détruire le graphique existant
//         myChart.destroy();
//     }

//     // Créer le graphique pour l'année sélectionnée
//     createHorizontalBarChart(selectedYear);
// }