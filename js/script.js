document.addEventListener("DOMContentLoaded", function () {

    // 1. récupérer les données de chaque json et les renvoyer dans 3 fonctions :

    // - displayAuditeursData
    // - createEuropeanMap
    // - createHorizontalBarChart


    // import map.svg depuis le dossier img pour optimiser le index.html
    fetch('img/map.svg')
        .then(response => response.text())
        .then(svg => {
            // Ajouter le contenu du fichier SVG dans la page HTML
            document.getElementById('europeanMap').innerHTML = svg;
        })
        .catch(error => console.error('Erreur lors du chargement du fichier SVG :', error));

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
    // Séparer les dates et les auditeurs pour les utiliser avec Chart.js
    const dates = dataAuditeurs.map(entry => entry.date);
    const auditeurs = dataAuditeurs.map(entry => entry.auditeurs);

    // Configuration du graphique
    const ctx = document.getElementById('auditeursChart').getContext('2d');
    const auditeursChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Nombre d\'auditeurs sur Spotify',
                data: auditeurs,
                borderColor: '#48CAE4',
                borderWidth: 1,
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    onClick: null,
                },
                title: {
                    display: false,
                }
            },
            scales: {
                x: {
                    labels: dates,
                    grid: {
                        display: false
                    },
                    ticks: {
                        autoSkip: true,
                        maxTicksLimit: 20
                    }
                
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#525252',
                    }

                }
            }
        }
    });

}




// carte de l'europe

// Fonction pour configurer les événements de survol après le chargement de la carte
function configureMapEvents(dataMap) {
    let lastSelectedCountry; // Variable pour stocker le dernier pays sélectionné
    const initialColors = {}; // Objet pour stocker les couleurs initiales de chaque pays

    document.querySelectorAll('.country').forEach(country => {
        const countryName = country.id;
        const population = dataMap[countryName];

        // Stockez la couleur initiale du pays
        initialColors[countryName] = country.style.fill;

        country.addEventListener('click', () => {
            // Sélectionnez l'élément h1 où vous souhaitez afficher les informations
            const infoContainer = document.getElementById('infoContainer');
            const infoDescription = document.getElementById('infoDescription');

            // Restaurez la couleur du dernier pays sélectionné (s'il y en a un)
            if (lastSelectedCountry) {
                lastSelectedCountry.style.fill = initialColors[lastSelectedCountry.id];
            }

            // Mettez à jour la couleur du pays actuellement sélectionné
            country.style.fill = '#48CAE4';

            // Affichez le nombre de population dans l'élément h1
            infoContainer.textContent = `${countryName} : ${population}`;
            infoDescription.textContent = `En 2023, la population de ${countryName} était de ${population} habitants.`;

            // Stockez la référence du pays actuellement sélectionné
            lastSelectedCountry = country;
        });

    });
}


// chart js podium

let myChart;
function createHorizontalBarChart(selectedYear) {
    const cities = ['top1', 'top2', 'top3', 'top4'];

    // Configuration du graphique
    const ctx = document.getElementById('myChart').getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: cities.map(city => dataPodium[city].city),
            datasets: [{
                label: `Nombre d'auditeurs en 2023 sur Spotify`,
                data: cities.map(city => dataPodium[city].auditeurs),
                backgroundColor: '#48CAE4',
                borderWidth: 1,
                borderRadius: 10,
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
                    display: false,
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    grid: {
                        display: false
                    }

                },
                y: {
                    stacked: true,
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}