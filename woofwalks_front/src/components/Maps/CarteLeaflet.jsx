
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef } from 'react';
import './CarteLeaflet.css';
// Corriger les icônes Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const CarteLeaflet = ({ walks = [] }) => {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);

    useEffect(() => {
        if (!mapRef.current || mapInstanceRef.current) return;

        // Initialiser la carte centrée sur la France
        const map = L.map(mapRef.current).setView([46.603354, 1.888334], 6);
        mapInstanceRef.current = map;

        // Ajouter la couche de tuiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Limiter la zone à la France
        const franceBounds = L.latLngBounds(
            L.latLng(41.0, -5.0), // Sud-Ouest
            L.latLng(51.0, 10.0)  // Nord-Est
        );
        map.setMaxBounds(franceBounds);
        map.setMinZoom(5);
        map.setMaxZoom(15);

        // Filtre les walks qui ont des coordonnées
        const walksWithCoordinates = walks.filter(walk =>
            walk.location &&
            walk.location.latitude &&
            walk.location.longitude
        );

        // Ajout des marqueurs
        walksWithCoordinates.forEach((walk) => {
            const marker = L.marker([walk.location.latitude, walk.location.longitude])
                .addTo(map);

            marker.bindPopup(`
                <div>
                    <h4>${walk.title}</h4>
                    <p><strong>Lieu:</strong> ${walk.location.name}</p>
                    <p><strong>Adresse:</strong> ${walk.location.street}</p>
                    <p><strong>Date:</strong> ${new Date(walk.date).toLocaleDateString('fr-FR')}</p>
                    <p><strong>Participants:</strong> ${walk.participants?.length || 0}/${walk.maxParticipants}</p>
                    <a href="/walks/${walk.id}" class="btn btn-sm btn-more-details"">Voir détails</a>
                </div>
            `);
        });

        // Ajustement de la vue pour inclure tous les marqueurs (si il y en a)
        if (walksWithCoordinates.length > 0) {
            const group = new L.featureGroup();
            walksWithCoordinates.forEach(walk => {
                group.addLayer(L.marker([walk.location.latitude, walk.location.longitude]));
            });
            map.fitBounds(group.getBounds().pad(0.1));
        } else {
            // Si pas de coordonnées, centrer sur la France
            map.setView([46.603354, 1.888334], 6);
        }

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [walks]);

    return (
        <div className="mt-4">
            <h3 className="mb-3">Carte des balades</h3>
            <div
                ref={mapRef}
                style={{ height: '400px', width: '100%' }}
                className="border rounded"
            />
            {walks.filter(walk => !walk.location?.latitude || !walk.location?.longitude).length > 0 && (
                <div className="alert alert-info mt-2">
                    <small>
                        {walks.filter(walk => !walk.location?.latitude || !walk.location?.longitude).length} balade(s)
                        sans coordonnées GPS ne sont pas affichées sur la carte.
                    </small>
                </div>
            )}
        </div>
    );
};

export default CarteLeaflet;