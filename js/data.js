// chiamata asincrona per richieste alle API di  GitHub
function callGitHubAPI(url, callback, async = true) {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // in caso di successo esegue le funzione passatagli callback
            callback(this.responseText);
        }
    };

    xhttp.open("GET", url, async);
    xhttp.send();
}

var contents = [];  // insieme di tutte le immegini divise per categoria

const pics_div = "pics";                // id del div che contiene tutte le immagini
const prefix_pictitle_div = "title_";   // id del div che contiene il titolo della singola categoria
const prefix_picpics_div = "pics_";     // prefisso per creare l'id del div dove andranno messe le immagini per ogni categoria


// prende tutte le immagini e le raggruppa in base alla categoria e le aggiunge al DOM
function generateAllPics(risposta) {
    // decodifica il JSON
    var pics = JSON.parse(risposta);
    
    // per ogni cartella (categoria) prepara il DOM e ci aggiunge le immagini
    pics.forEach(element => {
        if (element['type'] == "dir") {
            var tmp = {name: element['name'], pics: []}
            
            preparePicDivs(element);
            
            // chiamata ricorsiva per ogni sottocartella
            callGitHubAPI(
                "https://api.github.com/repos/Typing-Monkeys/MSMC/contents/Data/pics/" + element['name'],
                
                function(risposta) {
                    // per ogni immagine la va ad aggiungere alla corrispettiva categoria
                    var pics = JSON.parse(risposta);

                    pics.forEach(element => {
                        // aggiunge la foto al relativo div
                        if (element['type'] == "file") {
                            printPic(element, tmp.name);
                            tmp.pics.push({name: element['name'], path: element['path']});
                        }
                    });

                    contents.push(tmp);
                }
            );
        }
    });
    
    console.log(contents);
}

// prepara la struttura del DOM per le immagini
function preparePicDivs(element) {
    html = ""
    html += `<div id='${element['name']}' class='row'>`
    html += "<div class='col-md-12'>"
    html += `<div id='${prefix_pictitle_div}${element['name']}'>`
    html += `<h3>${element['name']}</h3>`
    html += "</div>"
    html += `<div id='${prefix_picpics_div}${element['name']}'>`
    html += "</div>"
    html += "</div>"
    html += "</div>"
    
    document.getElementById(pics_div).innerHTML += html;
}

// aggiunge al DOM la singola immagine
function printPic(pic, category) {
    html = ""
    html += `<a href='${pic.path}'>`
    html += `<img src='${pic.path}' class='img-thumbnail'>`
    html += "</a>"

    document.getElementById(`${prefix_picpics_div}${category}`).innerHTML += html;
}

// funzione per avviare tutta la procedura
var populatePics = function() {
    callGitHubAPI(
        "https://api.github.com/repos/Typing-Monkeys/MSMC/contents/Data/pics",
        generateAllPics
    );
};