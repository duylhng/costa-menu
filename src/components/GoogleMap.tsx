import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

interface GoogleMapProps {
  apiKey: string;
  center: { lat: number; lng: number };
  zoom?: number;
  markerTitle?: string;
}

const GoogleMap = ({ apiKey, center, zoom = 15, markerTitle }: GoogleMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const { theme, resolvedTheme } = useTheme();

  // Light mode style
  const lightStyle: google.maps.MapTypeStyle[] = [];

  // Dark mode style
  const darkStyle: google.maps.MapTypeStyle[] = [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    {
      featureType: "administrative.locality",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [{ color: "#263c3f" }],
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.fill",
      stylers: [{ color: "#6b9a76" }],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#38414e" }],
    },
    {
      featureType: "road",
      elementType: "geometry.stroke",
      stylers: [{ color: "#212a37" }],
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [{ color: "#9ca5b3" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [{ color: "#746855" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [{ color: "#1f2835" }],
    },
    {
      featureType: "road.highway",
      elementType: "labels.text.fill",
      stylers: [{ color: "#f3d19c" }],
    },
    {
      featureType: "transit",
      elementType: "geometry",
      stylers: [{ color: "#2f3948" }],
    },
    {
      featureType: "transit.station",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#17263c" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [{ color: "#515c6d" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.stroke",
      stylers: [{ color: "#17263c" }],
    },
  ];

  useEffect(() => {
    if (!mapRef.current || !apiKey) return;

    // Load Google Maps script
    const loadGoogleMapsScript = () => {
      if (window.google?.maps) {
        initMap();
        return;
      }

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
      script.async = true;
      script.defer = true;
      script.onload = () => initMap();
      document.head.appendChild(script);
    };

    const initMap = () => {
      if (!mapRef.current) return;

      const currentTheme = resolvedTheme || theme;
      const isDark = currentTheme === "dark";

      const map = new google.maps.Map(mapRef.current, {
        center,
        zoom,
        styles: isDark ? darkStyle : lightStyle,
      });

      new google.maps.Marker({
        position: center,
        map,
        title: markerTitle || "Location",
      });

      mapInstanceRef.current = map;
    };

    loadGoogleMapsScript();
  }, [apiKey, center.lat, center.lng, zoom, markerTitle]);

  // Update map style when theme changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const currentTheme = resolvedTheme || theme;
    const isDark = currentTheme === "dark";

    mapInstanceRef.current.setOptions({
      styles: isDark ? darkStyle : lightStyle,
    });
  }, [theme, resolvedTheme]);

  return <div ref={mapRef} className="w-full h-full" />;
};

export default GoogleMap;
