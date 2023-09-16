// //INSERE DATE HEURE ACTUELLE
// document.addEventListener('DOMContentLoaded', function () {
//     const inputDate = document.getElementById('input-date');
//     const currentDate = new Date();
//     const year = currentDate.getFullYear();
//     const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
//     const day = currentDate.getDate().toString().padStart(2, '0');
//     const hours = currentDate.getHours().toString().padStart(2, '0');
//     const minutes = currentDate.getMinutes().toString().padStart(2, '0');
//     const currentDateString = year + '-' + month + '-' + day + 'T' + hours + ':' + minutes;
//     inputDate.value = currentDateString;
// });

// Vérifiez si le navigateur prend en charge la géolocalisation
if ("geolocation" in navigator) {
    // Obtenir la position de l'utilisateur
    navigator.geolocation.getCurrentPosition(function (position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        const apiKey = 'AIzaSyDygOsg5oSCG-QQwKzxJFGD6krdESvfVRY'; // Remplacez par votre clé d'API Google Maps
        const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

        // Utilisation de l'API Fetch pour obtenir les données
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.results && data.results.length > 0) {
                    const addressComponents = data.results[0].address_components;
                    const cityComponent = addressComponents.find(component =>
                        component.types.includes('locality') || component.types.includes('administrative_area_level_1')
                    );

                    if (cityComponent) {
                        const cityName = cityComponent.long_name;
                        console.log("Ville:", cityName);
                        document.getElementById('location').innerHTML += `<b>${cityName}</b>`;
                        document.getElementById('cityName').innerHTML += cityName;
                        showMeteo(latitude, longitude);
                    } else {
                        console.log("Aucune ville trouvée à ces coordonnées.");
                    }
                } else {
                    console.log("Aucune donnée trouvée pour ces coordonnées.");
                }
            })
            .catch(error => {
                console.error('Une erreur s\'est produite :', error);
            });
    }, function (error) {
        console.error("Une erreur s'est produite :", error);
    });
} else {
    console.log("La géolocalisation n'est pas prise en charge par ce navigateur.");
}



document.addEventListener('DOMContentLoaded', function () {
    var cityInput = document.getElementById('city-input');

    var autocomplete = new google.maps.places.Autocomplete(cityInput, {
        types: ['(cities)']
    });

    autocomplete.addListener('place_changed', function () {
        var place = autocomplete.getPlace();

        if (!place.geometry) {
            console.error('No location data available for the selected place.');
            return;
        }

        const latitude = place.geometry.location.lat();
        const longitude = place.geometry.location.lng();

        document.getElementById('cityName').innerHTML = document.getElementById("city-input").value;
        
        showMeteo(latitude, longitude);

    });
});



function showMeteo(latitude, longitude) {

    console.log(latitude);
    console.log(longitude);

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,precipitation&forecast_days=1`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // Traitez les données ici (affichage, manipulation, etc.)

            //RECUPERES LES TABLEAUX DES PARAMETRES
            let times = data['hourly']['time'];
            let temperatures = data['hourly']['temperature_2m'];
            let precipitation = data['hourly']['precipitation'];

            const now = new Date();
            const heure = now.getHours();


            document.getElementById('heure').innerHTML = `${times[heure]} heures`;
            document.getElementById('temperature').innerHTML = `${temperatures[heure]} °C`;
            document.getElementById('precipitation').innerHTML = `${precipitation[heure]} mm de pluie`;

            console.log("type de la precipitation : " + typeof precipitation[heure] + precipitation[heure]);

            if(precipitation[heure] === 0){
                document.getElementById("parapluie").setAttribute('hidden', true);
                console.log("caché");
            }
            else{
                document.getElementById("parapluie").removeAttribute('hidden');
                console.log("pas caché");
            }

        })
        .catch(error => {
            console.error('Une erreur s\'est produite :', error);
        });



};

