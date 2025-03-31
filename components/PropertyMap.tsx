import { GoogleMap, Marker } from '@react-google-maps/api';

export default function PropertyMap({ properties }: { properties: PropertiesRecord[] }) {
  const mapCenter = useMemo(() => ({
    lat: properties[0]?.latitude || 51.5074,
    lng: properties[0]?.longitude || -0.1278
  }), [properties]);

  return (
    <div className="h-[600px] w-full">
      <GoogleMap
        mapContainerClassName="w-full h-full"
        center={mapCenter}
        zoom={13}
      >
        {properties.map(property => (
          <Marker
            key={property.id}
            position={{
              lat: property.latitude,
              lng: property.longitude
            }}
            onClick={() => {/* Show property details */}}
          />
        ))}
      </GoogleMap>
    </div>
  );
}