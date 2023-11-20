document.addEventListener("DOMContentLoaded", function () {

    // récupérer les données de chaque json et les renvoyer dans 3 fonctions :

    // - displayAuditeursData
    // - createEuropeanMap
    // - createHorizontalBarChart


    // on importe le map.svg pour optimiser le index.html
    fetch('img/map.svg')
        .then(response => response.text())
        .then(svg => {
            // add le contenu du map.svg dans le index.html
            document.getElementById('europeanMap').innerHTML = svg;
        })
        .catch(error => console.error('Erreur lors du chargement du fichier SVG :', error));

    // auditeurs charts
    fetch('data/auditeurs_charts.json')
        .then(response => response.json())
        .then(dataAuditeurs => {
            // fonction d'appel des données dans l'index.html
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
            window.dataPodium = dataPodium;

            // création du graphique
            createHorizontalBarChart(2016);
        })
        .catch(error => console.error('Erreur lors du chargement des données :', error));
}
);



// fonctions pour afficher les données dans le index.html

// auditeurs charts
function displayAuditeursData(dataAuditeurs) {
    // séparer les dates des auditeurs pour les utiliser avec chart.hs
    const dates = dataAuditeurs.map(entry => entry.date);
    const auditeurs = dataAuditeurs.map(entry => entry.auditeurs);

    // config du graphique
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

// fonction pour configurer les événements de survol après le chargement de la carte
function configureMapEvents(dataMap) {
    let lastSelectedCountry; // variable pour stocker le dernier pays sélectionné
    const initialColors = {}; // objet pour stocker les couleurs initiales de chaque pays

    document.querySelectorAll('.country').forEach(country => {
        const countryName = country.id;
        const auditeursmensuel = dataMap[countryName];

        // stockez la couleur initiale du pays
        initialColors[countryName] = country.style.fill;

        country.addEventListener('click', () => {
            // sélection du h1 où va s'insérer les données
            const infoContainer = document.getElementById('infoContainer');
            const infoDescription = document.getElementById('infoDescription');

            // restaurez la couleur du dernier pays sélectionné (s'il y en a un)
            if (lastSelectedCountry) {
                lastSelectedCountry.style.fill = initialColors[lastSelectedCountry.id];
            }

            // mise a jour du pays sélectionner actuellement
            country.style.fill = '#48CAE4';

            // afficher le nombre d'auditeurs moyens en 2023 dans l'élément h1
            infoContainer.textContent = `${countryName} : ${auditeursmensuel}`;
            infoDescription.textContent = `En 2023, le nombres d'auditeurs moyens par mois sur Spotify pour le rappeur Belge Damso en ${countryName} était de ${auditeursmensuel} auditeurs mensuels moyens.`;

            // stockage du pays actuellement sélectionné
            lastSelectedCountry = country;
        });

    });
}


// chart js podium

let myChart;
function createHorizontalBarChart(selectedYear) {
    const cities = ['top1', 'top2', 'top3', 'top4'];

    // config du graphique
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