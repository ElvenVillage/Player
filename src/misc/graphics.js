import React from 'react';
import L from 'leaflet';
import pin from './room.svg';
import { Marker } from 'react-leaflet';

const boat = `
    <svg
      width="50mm"
      height="87.234mm"
      version="1.1"
      viewBox="0 0 50 87.234"
      xmlns="http://www.w3.org/2000/svg"
      style="
        width: 100%;
        height: 100%;
        transition: all 330ms ease-in-out;
      "
    >
    <path
        id="boat"
        d="m10.602 86.225c-17.54-11.739-9.9666-65.554 12.346-85.052 23.685 17.54 35.967 71.091 16.462 84.595-0.7569 0.24285-28.644 0.76448-28.808 0.45726z"
        fill="#fafafa"
        stroke="#595959"
        stroke-width="2px"
    />
    <polygon
        id="boat-color"
        transform="matrix(.91454 0 0 .91454 -228.55 -237.98)"
        points="268.48 349.28 261.98 343.28 260.98 317.28 275.98 297.28 291.98 316.28 292.48 342.78 285.48 349.28"
        fill="#f00"
        stroke-opacity="0"
    />
    </svg>
  `;

const icon = L.divIcon({
  html: boat,
  iconSize: [15, 27],
  iconAnchor: [7.5, 13.5],
  className: `boat-div`
});

const CustomMarker = ({position, draggable, i, color}) => {
  return <Marker position={position} icon={icon} draggable={draggable}/>
}

const PinIcon = new L.Icon({
  iconUrl: pin,
  iconRetinaUrl: pin,
  iconSize: [24, 24],
  iconAnchor: [12, 22],
});

export {
    CustomMarker,
    PinIcon
}