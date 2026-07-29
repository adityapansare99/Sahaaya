import React, { useEffect, useRef, useState } from "react";
import loadGoogleMaps from "../utils/loadGoogleMaps";
import { MapPin, Loader2 } from "lucide-react";


const LocationInput = ({
  value,
  onChange,
  onSelect,
  placeholder = "Enter address",
  required = false,
  className = "",
}) => {
  const inputRef = useRef(null);
  const [apiReady, setApiReady] = useState(false);
  const [apiFailed, setApiFailed] = useState(false);

  useEffect(() => {
    loadGoogleMaps()
      .then(() => setApiReady(true))
      .catch(() => setApiFailed(true));
  }, []);


  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    if (!apiReady || !inputRef.current || typeof window.google === "undefined") return;

    const ac = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ["geocode", "establishment"],
      componentRestrictions: { country: "in" },
      fields: ["geometry", "formatted_address", "place_id"],
    });

    ac.addListener("place_changed", () => {
      const place = ac.getPlace();
      if (!place) return;

      const selectedAddress = place.formatted_address || inputRef.current?.value || "";
      if (selectedAddress && onChangeRef.current) onChangeRef.current(selectedAddress);
      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        if (onSelectRef.current) onSelectRef.current({ lat, lng });
      }
    });
  }, [apiReady]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = value || "";
    }
  }, [value]);

  return (
    <div className={`relative ${className}`}>
      <input
        ref={inputRef}
        type="text"
        defaultValue={value || ""}
        onChange={(e) => {
          if (onChange) onChange(e.target.value);
        }}
        placeholder={placeholder}
        required={required}
        className="flow-input has-icon"
        autoComplete="on"
      />
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        {apiFailed ? (
          <MapPin className="w-5 h-5 text-mute-2" />
        ) : apiReady ? (
          <MapPin className="w-5 h-5 text-ngo" />
        ) : (
          <Loader2 className="w-5 h-5 text-mute animate-spin" />
        )}
      </div>
      {apiFailed && (
        <p className="mt-1 text-xs text-mute">
          Google Maps not available. Type your address manually.
        </p>
      )}
    </div>
  );
};

export default LocationInput;
