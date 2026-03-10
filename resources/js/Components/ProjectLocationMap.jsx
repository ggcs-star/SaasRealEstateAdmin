import { useEffect, useRef } from "react";

export default function ProjectLocationMap({ setData }) {

    const mapRef = useRef(null);
    const markerRef = useRef(null);

    useEffect(() => {

        if (!window.google) return;

        const map = new window.google.maps.Map(mapRef.current, {
            center: { lat: 20.5937, lng: 78.9629 },
            zoom: 5,
        });

        const marker = new window.google.maps.Marker({
            map,
            draggable: true,
        });

        markerRef.current = marker;

        const autocomplete = new window.google.maps.places.Autocomplete(
            document.getElementById("autocomplete")
        );

        autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();
            if (!place.geometry) return;

            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();

            map.setCenter({ lat, lng });
            map.setZoom(15);
            marker.setPosition({ lat, lng });

            fillAddress(place);
        });

        marker.addListener("dragend", () => {
            const position = marker.getPosition();
            reverseGeocode(position.lat(), position.lng());
        });

    }, []);

    const fillAddress = (place) => {

        let state = "";
        let city = "";
        let area = "";
        let pincode = "";

        place.address_components.forEach(component => {

            if (component.types.includes("administrative_area_level_1")) {
                state = component.long_name;
            }

            if (component.types.includes("locality")) {
                city = component.long_name;
            }

            if (component.types.includes("sublocality_level_1")) {
                area = component.long_name;
            }

            if (component.types.includes("postal_code")) {
                pincode = component.long_name;
            }
        });

        setData("latitude", place.geometry.location.lat());
        setData("longitude", place.geometry.location.lng());
        setData("address", place.formatted_address);
        setData("pincode", pincode);

        // ⚠ yaha state/city matching logic call karo
        matchStateCity(state, city, area);
    };

    const reverseGeocode = (lat, lng) => {

        const geocoder = new window.google.maps.Geocoder();

        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            if (status === "OK" && results[0]) {
                fillAddress(results[0]);
            }
        });
    };

    const matchStateCity = (stateName, cityName, areaName) => {
        // yaha aap Inertia page props se states pass kar sakte ho
        console.log(stateName, cityName, areaName);
    };

    return (
        <div className="lg:col-span-2">
            <input
                id="autocomplete"
                type="text"
                placeholder="Search location..."
                className="w-full px-4 py-3 border rounded-lg mb-3"
            />

            <div
                ref={mapRef}
                className="w-full h-80 rounded-lg"
            ></div>
        </div>
    );
}