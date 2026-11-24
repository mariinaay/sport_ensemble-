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

const repereMoi = divIcon({ className: '', html: '<span class="repere-moi"></span>', iconSize: null })

// Plan OpenStreetMap des séances (page Séances) : toucher un repère choisit la séance
export default function PlanSeances({ seances, centre, zoom, choisie, onChoisir }) {
  return (
    <div className="plan">
      {/* touchZoom écrit en dur : par défaut, Leaflet ne l'active que sur les écrans tactiles */}
      <MapContainer center={centre} zoom={zoom} className="plan__carte" touchZoom scrollWheelZoom={false}>
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
              eventHandlers={{ click: () => onChoisir(s.id) }}
            />
          ))}
      </MapContainer>
    </div>
  )
}
