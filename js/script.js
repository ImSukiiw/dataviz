// animations
AOS.init();

// importation des svg du fichier svg.js
import { loadingplanesvg } from './svg.js';
import { blanksvg } from './svg.js';
import { holidayssvg } from './svg.js';
import { businesssvg } from './svg.js';
import { familysvg } from './svg.js';
import { othersvg } from './svg.js';
import { mapsvg } from './svg.js';


// lancement des fonctions au chargement de la page
window.onload = function () {
    getDataDeparture();
    getDataMap();
    getDataPodium();
    getDataReasons();
};

// animations générales
document.querySelector('#loader').innerHTML += loadingplanesvg;

function linkHover() {
    $('footer a').css('opacity', '0.7');
    $(this).css("opacity", "1")
}
function linkHoverRemove() {
    $('footer a').css('opacity', '1');
    $(this).css("opacity", "1")
}

$('footer a').on('mouseenter', linkHover).on('mouseleave', linkHoverRemove).css('transition', '0.2s');



// scripts des données
// 1. departure board
// 2. covid19 map
// 3. top 3 cities podium
// 4. reasons to travel





// 1. injection des données des fichiers json : tableau de départs


function getDataDeparture() {
    fetch('./json/data_departure.json')
        .then(res => res.json())
        .then(data => {

            // injection (push) des données dans deux tableaux
            let positions = [];
            let countries = [];
            let visitors = [];


            data.forEach(function viewDataDeparture(departure) {
                positions.push(departure.n1.position, departure.n2.position, departure.n3.position, departure.n4.position, departure.n5.position, departure.n6.position, departure.n7.position, departure.n8.position, departure.n9.position, departure.n10.position);

                countries.push(departure.n1.country, departure.n2.country, departure.n3.country, departure.n4.country, departure.n5.country, departure.n6.country, departure.n7.country, departure.n8.country, departure.n9.country, departure.n10.country);

                visitors.push(departure.n1.visitors, departure.n2.visitors, departure.n3.visitors, departure.n4.visitors, departure.n5.visitors, departure.n6.visitors, departure.n7.visitors, departure.n8.visitors, departure.n9.visitors, departure.n10.visitors);

            });

            // injection des données des tableaux dans les 5 balises correspondant aux 5 régions dans index.html
            for (let i = 0; i < 10; i++) {
                document.querySelector(`tbody`).innerHTML += `<tr data-aos="flip-down" data-aos-delay="2000" data-aos-duration="1000"><td class="position${i}"></td><td class="country${i}"></td><td class="visitors${i}"></td></tr>`;
                document.querySelector(`.position${i}`).innerHTML += positions[i];
                document.querySelector(`.country${i}`).innerHTML += countries[i];
                document.querySelector(`.visitors${i}`).innerHTML += visitors[i] + ' Million';

            };
        });
}





// 2. injection des données des fichiers json : carte


function getDataMap() {
    fetch('./json/data_map.json')
        .then(res => res.json())
        .then(data => {

            // injection (push) des données dans deux tableaux
            let data2019 = [];
            let data2020 = [];

            data.forEach(function viewDataMap(map) {
                data2019.push(map.africa.year2019.number, map.northafrica.year2019.number, map.southasia.year2019.number, map.europe.year2019.number, map.america.year2019.number);
                data2020.push(map.africa.year2020.number, map.northafrica.year2020.number, map.southasia.year2020.number, map.europe.year2020.number, map.america.year2020.number);
            });

            // injection des données des tableaux dans les 5 balises correspondant aux 5 régions dans index.html
            for (let i = 0; i < 5; i++) {
                // M = millions
                document.querySelector(`.n${i} p`).innerHTML += data2019[i] + 'M';
            };

            // au clic du bouton "avant", injecter les données de 2019
            document.querySelector('#before').addEventListener("click", () => {
                for (let i = 0; i < 5; i++) {
                    document.querySelector(`.n${i} p`).innerHTML = data2019[i] + 'M';
                }
            });

            // au clic du bouton "après", injecter les données de 2020
            document.querySelector('#after').addEventListener("click", () => {
                for (let i = 0; i < 5; i++) {
                    // calcul du taux de variation entre 2019 et 2020, arrondi au dixième
                    function numVariation(a, b) {
                        return ((b / a) - 1) * 100;
                    }
                    document.querySelector(`.n${i} p`).innerHTML = data2020[i] + 'M<br><span class="red"><b>' + Math.round(numVariation(data2019[i], data2020[i])) + '%</b></span>';
                }
            });
        });
}


// injection de la carte en svg
document.querySelector('.map').innerHTML += mapsvg;

// interactions des regions au hover et au clic des boutons "before" et "after"

// apparition de la bulle, suivant la position du curseur
function showTooltip(event) {
    var el = event.currentTarget.id,
        selector = "#" + el + "-tooltip",
        tooltip = $(selector);

    var top = event.pageY,
        left = event.pageX,
        tooltipWidth = tooltip.outerWidth(),
        tooltipHeight = tooltip.outerHeight();

    var positionX = (left - (tooltipWidth / 2)) + "px",
        positionY = (top - (tooltipHeight + 22)) + "px";

    tooltip.css({
        "left": positionX,
        "top": positionY,
        "display": "block"
    });
};

// animations au hover

function hideTooltip() {
    $('.world-tooltip').hide();
};

function opacityOnHover() {
    $(".continent").css("opacity", "0.5");
    $(this).css("opacity", "1")
};

function opacityRemove() {
    $(".continent").css("opacity", "1");
};

// changement de mode : post-pandémie
function switchRed() {
    $('#after').attr("class", "white").css('transition', '0.5s').css('cursor', "default");
    $('#before').attr("class", "red").css('transition', '0.5s').css('cursor', "pointer");
    $('.data-map article').attr("class", "red").css('transition', '0.5s');
    $('#america g').attr("class", "red").css('transition', '0.5s');
    $('#africa g').attr("class", "red").css('transition', '0.5s');
    $('#europe g').attr("class", "red").css('transition', '0.5s');
    $('#south-asia g').attr("class", "red").css('transition', '0.5s');
    $('#north-africa g').attr("class", "red").css('transition', '0.5s');
}

// changement de mode : pré-pandémie
function switchGreen() {
    $('#after').attr("class", "green").css('transition', '0.5s').css('cursor', "pointer");
    $('#before').attr("class", "white").css('transition', '0.5s').css('cursor', "default");
    $('.data-map article').attr("class", "green").css('transition', '0.5s');
    $('#america g').attr("class", "green").css('transition', '0.5s');
    $('#africa g').attr("class", "green").css('transition', '0.5s');
    $('#europe g').attr("class", "green").css('transition', '0.5s');
    $('#south-asia g').attr("class", "green").css('transition', '0.5s');
    $('#north-africa g').attr("class", "green").css('transition', '0.5s');
}

let $after = $('#after');
$after.on('click', switchRed);

let $before = $('#before');
$before.on('click', switchGreen);

let $continent = $('.continent');
$continent.on('mouseenter', opacityOnHover).on('mouseleave', opacityRemove);

let $America = $('#america');
$America.on('mousemove', showTooltip).on('mouseleave', hideTooltip);

let $europe = $('#europe');
$europe.on('mousemove', showTooltip).on('mouseleave', hideTooltip);

let $northAfrica = $('#north-africa');
$northAfrica.on('mousemove', showTooltip).on('mouseleave', hideTooltip);

let $Africa = $('#africa');
$Africa.on('mousemove', showTooltip).on('mouseleave', hideTooltip);

var $southAsia = $('#south-asia');
$southAsia.on('mousemove', showTooltip).on('mouseleave', hideTooltip);






// 3. injection des données des fichiers json : podium




// remplissage de la grille

function getDataPodium() {
    fetch('./json/data_podium.json')
        .then(res => res.json())
        .then(data => {

            // injection (push) des données dans cinq tableaux
            let idtrv = [];
            let idcit = [];
            let cit = [];
            let trv = [];
            let years = [];

            data.forEach(function viewData(podium) {
                idtrv.push(podium.top.top1.travellers, podium.top.top2.travellers, podium.top.top3.travellers);
                idcit.push(podium.top.top1.city, podium.top.top2.city, podium.top.top3.city);
                years.push(podium.year);
            });


            trv.push(idtrv[0], idtrv[1], idtrv[2]);
            cit.push(idcit[0], idcit[1], idcit[2]);

            // changement de taille et labels en fonction des données
            changeHeight(trv);
            changeLabel(cit);

            // boucle et interactions au hover du podium
            for (let i = 1; i < 4; i++) {
                $(`.rect${i}`).hover(function () {
                    hoverPodium(trv[i - 1], i);
                    evidencePodium(`rect${i}`);
                }).mouseleave(function () {
                    removePodium(i);
                    evidenceRemovePodium(`rect${i}`);
                }).css("cursor", "pointer");
            };

            // script et interactions du slider d'années
            const range = document.querySelector("input[type=\"range\"]");
            range.addEventListener("input", () => {
                let valR = -(range.value - 2018) + 1;
                let trvR = [];
                let citR = [];
                let yearsR = [];
                citR.push(idcit[valR * 3], idcit[valR * 3 + 1], idcit[valR * 3 + 2]);
                trvR.push(idtrv[valR * 3], idtrv[valR * 3 + 1], idtrv[valR * 3 + 2]);
                yearsR = years[valR];
                changeHeight(trvR);
                changeLabel(citR);

                // boucle
                for (let i = 0; i < 3; i++) {
                    $(`.rect${i + 1}`).hover(function () {
                        hoverPodium(trvR[i], i + 1);
                        evidencePodium(`rect${i + 1}`);
                    }).mouseleave(function () {
                        removePodium(i + 1);
                        evidenceRemovePodium(`rect${i + 1}`);
                    }).css("cursor", "pointer");
                }
            });
        });
};

// creation de fonctions d'animations

function hoverPodium(trav, i) {
    $(`.nbtourists${i}`).html(`${trav} million`);
};

function removePodium(i) {
    $(".desc").html(" ");
    $(`.nbtourists${i}`).html(" ");
};

function evidencePodium(rect) {
    $(".podium").css("opacity", "60%");
    $(`.${rect}`).css("opacity", "100%");
};

function evidenceRemovePodium(rect) {
    $(".podium").css("opacity", "100%");
};

function changeLabel(tab) {
    // changer la hauteur du .top
    // boucle for
    for (let i = 1; i < 4; i++) {
        $(`.rect${i} .labelpays`).html(tab[i - 1])
    }
};

function changeHeight(tab) {
    // changer la hauteur du .top
    // boucle for
    for (let i = 1; i < 4; i++) {
        $(`.rect${i} .top`).css({
            "height": (tab[(i - 1)]) * 2.5 + "%",
        });
    }
};





// 4. injection des données des fichiers json : motifs de voyage

function getDataReasons() {
    fetch('./json/data_reasons.json')
        .then(res => res.json())
        .then(data => {

            // injections des données : svg dans le container et chiffres dans un tableau

            let wrapperBlock = document.querySelector(".container");
            let per = [];
            let desc = [];
            let tab = [];


            data.forEach(function viewData(reason) {
                per.push(reason.percentage);
                desc.push(reason.desc);
                for (var i = 0; i < reason.percentage; i++) {
                    tab.push(reason.reason);
                }
                // shuffleArray(tab);
                // repartition au hasard des svg
                tab.sort(function (a, b) { return Math.random() - 0.5 })
            });

            // ajout des svg correspondant dans chaque case du container
            tab.forEach(function (reason) {
                var square = document.createElement("div");
                square.classList.add("" + reason + "");
                wrapperBlock.appendChild(square).innerHTML += '<svg id="blanksvg' + reason + '" width="50" height="50" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M40 55.3199C44.577 55.3199 48.8126 53.8583 52.2656 51.3765C54.2195 49.9721 57.0585 50.0213 58.2664 52.1023C61.4644 57.6118 63.3766 64.5997 63.3766 72.203C56.8831 76.2729 52.9106 80 40 80C27.0894 80 21.7336 75.5951 16.6234 72.203C16.6234 64.5997 18.5356 57.6118 21.7336 52.1023C22.9415 50.0213 25.7805 49.9721 27.7344 51.3765C31.1874 53.8583 35.423 55.3199 40 55.3199Z" fill="#F1F7ED"/><path d="M58.1818 33.7662C58.1818 43.8078 50.0415 51.9481 40 51.9481C29.9585 51.9481 21.8182 43.8078 21.8182 33.7662C21.8182 23.7247 29.9585 15.5844 40 15.5844C50.0415 15.5844 58.1818 23.7247 58.1818 33.7662Z" fill="#F1F7ED"/></svg>';
            });

            // descriptions des données

            // animations et affichages de descriptions au hover : au mouseover puis mouseleave
            let $holidays = $('.bouton.divholidays');
            let $business = $('.bouton.divbusiness');
            let $family = $('.bouton.divfamily');
            let $other = $('.bouton.divother');
            let perdesc = "";

            // au mouseover

            function secPerDesc(i) {
                perdesc = `<h3 class="h3Per black">${per[i]}%</h3><p>${desc[i]}<p>`;
                return perdesc;
            };

            function holidaysHover() {
                $(".holidays").html(holidayssvg);
                $(".percentage").html(secPerDesc(0));
            };

            function familyHover() {
                $(".family").html(familysvg);
                $(".percentage").html(secPerDesc(1));
            };

            function businessHover() {
                $(".business").html(businesssvg);
                $(".percentage").html(secPerDesc(2));
            };

            function otherHover() {
                $(".other").html(othersvg);
                $(".percentage").html(secPerDesc(3));
            };

            function cssHover() {
                $(this).css("cursor","default").css("color", "#0a061d").css("transition", "0.2s ease");
            };

            // au mouseleave

            function hoverRemoveFamily() {
                $(".family").html(blanksvg);
            };

            function hoverRemoveBusiness() {
                $(".business").html(blanksvg);
            };

            function hoverRemoveHolidays() {
                $(".holidays").html(blanksvg);
            };

            function hoverRemoveOther() {
                $(".other").html(blanksvg);
            };

            function evidenceRemove() {
                $(".percentage").html(" ");
                $(this).css("cursor", null).css("color", "#f1f7ed");
            };


            $business.on('mouseover', businessHover).on('mouseover', cssHover).on('mouseleave', hoverRemoveBusiness);
            $business.on('mouseleave', evidenceRemove);

            $holidays.on('mouseover', holidaysHover).on('mouseover', cssHover).on('mouseleave', hoverRemoveHolidays);
            $holidays.on('mouseleave', evidenceRemove);

            $family.on('mouseover', familyHover).on('mouseover', cssHover).on('mouseleave', hoverRemoveFamily);
            $family.on('mouseleave', evidenceRemove);

            $other.on('mouseover', otherHover).on('mouseover', cssHover).on('mouseleave', hoverRemoveOther);
            $other.on('mouseleave', evidenceRemove);
        });
};


