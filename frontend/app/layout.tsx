import { useEffect } from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';

const MapComponent = () => {
    useEffect(() => {
        // additional logic if needed
    }, []);

    return (
        <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
            <GoogleMap
                // mapContainerStyle, center, zoom, etc.
            />
        </LoadScript>
    );
};

export default MapComponent;