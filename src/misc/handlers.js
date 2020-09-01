import Papa from 'papaparse';
import {useEffect, useRef} from 'react';

export function handleProcessData(file, callback) {
    processData(file, callback);
}

export function calculateAngle(firstPoint, secondPoint) {
  if (firstPoint.length < 2 || secondPoint.length < 2) return 0;
  const dy = secondPoint[1] - firstPoint[1];
  var dx = secondPoint[0] - firstPoint[0];
  var theta = Math.atan2(dy, dx); // range (-PI, PI]
  theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
  if (theta <= 0) theta = 360 + theta; // range [0, 360)
  return theta;
}

const processData = (file, callback) => {
    Papa.parse(
        file,
        {
            skipEmptyLines: true,
            header: true,
            download: true,
            dynamicTyping: true,
            fastMode: true,
            chunk: (data) =>
                filterData(data, callback),
            beforeFirstChunk: (chunk) => {
                if (chunk.startsWith('#'))
                    return chunk.split('\r\n').slice(10).join('\r\n')
                else return chunk
            },
            worker: false
        }
    );
}

export function filterData({data}, callback) {
    if (!data || data.length === 0) {
        callback(null);
        return;
    }
    if (
        (!data[0].hasOwnProperty("LAT") && !data[0].hasOwnProperty('lat')) ||
        (!data[0].hasOwnProperty("LON") && !data[0].hasOwnProperty('lon')) ||
        (!data[0].hasOwnProperty("SEC") && !data[0].hasOwnProperty('sec'))
        ) {
            callback(null);
            return;
        }
    // blank boat obj
    const obj = {
        name: "",
        color: "#000",
        currentBoatSpeed: 0.0,
        currentBoatCoords: [],
        coords: [],
        data: [],
        center: []
    }
    const filteredData = [];
    const coords = [];
    let avgLat = 0;
    let avgLon = 0;
    //filters by speed > 0 and lat or lon > 0 and for each second
    data.forEach((el, index) => {
        if (index + 1 === data.length) return;
        if (el.LAT !== 0 &&
            el.LON !== 0 && 
            el.SEC !== data[index + 1].SEC) {
                filteredData.push(el);
            }
    });
    const length = filteredData.length;
    //parsing data array
    for(let i = 0; i < length; i++) {
        const lat = filteredData[i].LAT;
        const lon = filteredData[i].LON;
        avgLat += lat;
        avgLon += lon;
        coords.push([lat, lon]);
    }
    //average of lat and lon for center
    avgLat /= length;
    avgLon /= length;
    // calculation of speed down to .00 precision
    obj.speed = Math.round(filteredData[0].SOG * 100) / 100;
    obj.coords = coords;
    obj.currentBoatCoords = coords[0];
    obj.currentBoatSpeed = obj.speed;
    obj.center = [avgLat, avgLon];
    obj.data = filteredData;
    const headers = Object.keys(filteredData[0]).slice(4);
    const player = {
        currentTime: 0,
        startTime: 0,
        endTime: length - 1 || 0,
    };
    data = null;
    callback({obj, headers, player});
}

export function useInterval(callback, delay) {
    const savedCallback = useRef();
  
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);
  
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  }

export const options = [
    {
      value: 1000,
      label: 'x1.0'
    },
    {
      value: 800,
      label: 'x1.25'
    },
    {
      value: 666,
      label: 'x1.5'
    },
    {
      value: 571,
      label: 'x1.75'
    },
    {
      value: 500,
      label: 'x2.0'
    },
    {
      value: 250,
      label: 'x4.0'
    }
  ];

export function formatNumberToHHMMSS(number) {
    const sec_num = parseInt(number, 10);
    let hours   = Math.floor(sec_num / 3600);
    let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    let seconds = sec_num - (hours * 3600) - (minutes * 60);
  
    if (hours < 10) {
      hours = "0"+hours;
    }
    if (minutes < 10) {
      minutes = "0"+minutes;
    }
    if (seconds < 10) {
      seconds = "0"+seconds;
    }
    return hours+':'+minutes+':'+seconds;
  }