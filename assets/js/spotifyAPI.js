

async function spotifyLogin() {

    console.log("logging into spotify")
    window.location.href = "http://127.0.0.1:8080/login";


}



async function spotifyDisplay() {

    console.log("spotify display smthn")
    try {
        const response = await fetch("http://localhost:8080/spotifydisplay")

        const data = await response.text();
        
        
        console.log(data);
        
        console.log("data should of went through");

    } catch (error) {
        console.log(error);
    }


}

