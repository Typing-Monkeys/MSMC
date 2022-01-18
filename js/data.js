// prende il contenuto della cartella pagine della repo di GitHub
function callGitHubAPI(url, callback, async = true) {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // converte la stringa JSON in array e converte ed effettua il parsing da MD ad HTML
            // per ogni file
            callback(this.responseText);
        }
    };

    xhttp.open("GET", url, async);
    xhttp.send();
}

var contents = [];  // insieme di tutte le immegini


// prende tutte le immagini e le raggruppa in base alla categoria
// poi le stampa
function parseResponse(risposta) {
    // decodifica il JSON
    var pics = JSON.parse(risposta);
    
    pics.forEach(element => {

        if (element['type'] == "dir") {
            var tmp = {name: element['name'], pics: []}
            
            callGitHubAPI(
                "https://api.github.com/repos/Typing-Monkeys/MSMC/contents/Data/pics/" + element['name'],
                function(risposta) {
                    // per ogni immagine la va ad aggiungere alla corrispettiva categoria
                    var pics = JSON.parse(risposta);

                    pics.forEach(element => {
                        if (element['type'] == "file") {
                            tmp.pics.push({name: element['name'], path: element['path']});
                        }
                    });

                    contents.push(tmp);
                },
                false
                
            );
        }
    });
    
    console.log(contents);
    printImages(contents);
    

}

// stampa le immagini
function printImages(contents) {
    var html = "";

    contents.forEach(element => {
        html += "<div class='row'>"
        html += "<div class='col-md-12'>"
        html += "<h3>" + element.name + "</h3>"
        //html += "</div>"
        //html += "</div>"

        console.log(element.name);

        element.pics.forEach(element => {
            //html += "<div class='row'>"
            //html += "<div class='col-md-12'>"
            html += "<a href='" + element.path + "'>"
            html += "<img src='" + element.path + "' class='img-thumbnail'>"
            html += "</a>"
            
        });

        html += "</div>"
        html += "</div>"
    });

    //console.log(html);

    document.getElementById("pics").innerHTML = html;
}

// funzione per avviare tutta la procedura
var populatePics = function() {
    callGitHubAPI(
        "https://api.github.com/repos/Typing-Monkeys/MSMC/contents/Data/pics",
        parseResponse
    );
};