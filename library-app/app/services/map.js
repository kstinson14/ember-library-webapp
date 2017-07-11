import Ember from 'ember';
import Map from 'esri/Map';
import GraphicsLayer from 'esri/layers/GraphicsLayer';
import VectorTileLayer from 'esri/layers/VectorTileLayer';

export default Ember.Service.extend({
  map: null,

  loadMap()
  {
    let map = this.get('map');
    if (map) {
      return map;
    }
    else
    {
        map = new Map
        ({
          basemap: "streets"
        });
        this.set('map', map);
        return map;
    }
  }
});
