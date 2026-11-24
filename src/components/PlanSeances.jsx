import { divIcon } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MapContainer, Marker, TileLayer } from 'react-leaflet'
import { MA_POSITION, NOMS_COURTS } from '../utils/constants'
import './plan-seances.css'

// Repère d'une séance : pastille de la couleur du sport avec son nom
const repereSeance = (seance, choisie) =>
  divIcon({
    className: '',
    html: `<span class="repere sport--${seance.sport}${choisie ? ' repere--choisi' : ''}">${NOMS_COURTS[seance.sport]}</span>`,
    iconSize: null,
  })

// Repère « Toi » (point bleu)
const repereMoi = divIcon({ className: '', html: '<span class="repere-moi"></span>', iconSize: null })

// Carte (plan OpenStreetMap) avec les séances.
// `petit` : petite carte fixe (accueil) ; sinon on peut bouger, zoomer et toucher un repère (`onChoisir`).
export default function PlanSeances({ seances, centre = MA_POSITION, zoom = 13, petit, choisie, onChoisir }) {
  return (
    <div className={petit ? 'plan plan--petit' : 'plan'}>
      <MapContainer
        center={centre}
        zoom={zoom}
        className="plan__carte"
        zoomControl={!petit}
        dragging={!petit}
        touchZoom={!petit}
        doubleClickZoom={!petit}
        scrollWheelZoom={false}
        keyboard={!petit}
        attributionControl
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <Marker position={MA_POSITION} icon={repereMoi} interactive={false} />
        {seances
          .filter((s) => s.lat && s.lng)
          .map((s) => (
            <Marker
              key={s.id}
              position={[s.lat, s.lng]}
              icon={repereSeance(s, choisie === s.id)}
              title={s.title}
              interactive={!petit}
              eventHandlers={{ click: () => onChoisir?.(s.id) }}
            />
          ))}
      </MapContainer>
    </div>
  )
}
