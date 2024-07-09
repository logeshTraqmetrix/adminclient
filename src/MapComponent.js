import React, { useEffect, useRef } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { OSM } from 'ol/source';
import { fromLonLat } from 'ol/proj';
import VectorSource from 'ol/source/Vector';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import { Icon, Style } from 'ol/style';

const MapComponent = ({ locations }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const vectorSourceRef = useRef(new VectorSource());

  useEffect(() => {
    if (!mapRef.current) {
      const vectorLayer = new VectorLayer({
        source: vectorSourceRef.current,
      });

      mapRef.current = new Map({
        target: mapContainerRef.current,
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
          vectorLayer,
        ],
        view: new View({
          center: fromLonLat([0, 0]),
          zoom: 2,
        }),
      });
    } else {
      mapRef.current.setTarget(mapContainerRef.current);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.setTarget(null);
      }
    };
  }, []);

  useEffect(() => {
    const vectorSource = vectorSourceRef.current;
    vectorSource.clear(); // Clear the existing features

    locations.forEach((location) => {
      const iconFeature = new Feature({
        geometry: new Point(fromLonLat([location.lng, location.lat])),
      });
      iconFeature.setStyle(new Style({
        image: new Icon({
          anchor: [0.5, 1],
          src: 'https://openlayers.org/en/v4.6.5/examples/data/icon.png',
        }),
      }));
      vectorSource.addFeature(iconFeature);
    });
  }, [locations]);

  return <div ref={mapContainerRef} style={{ width: '100%', height: '500px' }} />;
};

export default MapComponent;
