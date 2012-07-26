// Generated by CoffeeScript 1.3.3
(function() {
  var authToken, authorizeApp, circle, getToken, mappingTasks, redirectUrl, request, token, tokenCheck;

  circle = '';

  token = '';

  authToken = 0;

  redirectUrl = 'http://localhost/development/happenings/index.html';

  authorizeApp = function(user) {
    var clientId;
    clientId = '5d1ba596dc034a7a8895e309f5f2452f';
    return window.location.href = 'https://instagram.com/oauth/authorize/?client_id=' + clientId + '&redirect_uri=' + redirectUrl + '&response_type=token';
  };

  getToken = function() {
    return window.location.href.split('#access_token=')[1];
  };

  tokenCheck = function() {
    if (window.location.href.indexOf('access_token') > 0) {
      return token = getToken();
    } else {
      return authorizeApp();
    }
  };

  request = function(long, lat, clientId, photoLayer) {
    var uri;
    if (token) {
      uri = 'https://api.instagram.com/v1/media/search?lat=' + lat + '&lng=' + long + '&access_token=' + token;
    } else {
      uri = 'https://api.instagram.com/v1/media/search?lat=' + lat + '&lng=' + long + '&client_id=' + clientId;
    }
    return $.ajax({
      type: "GET",
      dataType: "jsonp",
      cache: false,
      url: uri,
      success: function(photos) {
        photoLayer.clearLayers();
        return _.each(photos.data, function(photo) {
          var object, photoTemplate;
          if (photo.location) {
            object = new L.CircleMarker(new L.LatLng(photo.location.latitude, photo.location.longitude), {
              radius: 7,
              clickable: true,
              stroke: 0,
              fillOpacity: .5,
              color: '#FF9933'
            });
            photoTemplate = _.template($("#popupTemplate").html(), {
              photo: photo
            });
            object.bindPopup(photoTemplate);
            return photoLayer.addLayer(object);
          }
        });
      }
    });
  };

  mappingTasks = function() {
    var clientId, map, onLocationError, onLocationFound, onMapClick, photoLayer, tiles;
    onLocationFound = function(e) {};
    onLocationError = function(e) {
      return map.setView(new L.LatLng(37.76745803822967, -122.45018005371094), 13).addLayer(tiles);
    };
    onMapClick = function(e) {
      if (!circle) {
        circle = new L.Circle(e.latlng, 1700, {
          color: '#919191',
          fill: true,
          fillOpacity: 0.1,
          weight: 1.5,
          clickable: false
        });
        map.addLayer(circle);
      } else {
        circle.setLatLng(e.latlng);
      }
      return request(+e.latlng.lng.toFixed(2), e.latlng.lat.toFixed(2), clientId, photoLayer);
    };
    map = new L.Map('map');
    tiles = new L.TileLayer('http://a.tiles.mapbox.com/v3/bobbysud.map-ez4mk2nl/{z}/{x}/{y}.png', {
      maxZoom: 17
    });
    photoLayer = new L.LayerGroup();
    clientId = 'f62cd3b9e9a54a8fb18f7e122abc52df';
    map.addLayer(tiles);
    map.on('locationfound', onLocationFound);
    map.on('locationerror', onLocationError);
    map.locateAndSetView(13);
    map.on('click', onMapClick);
    map.addLayer(photoLayer);
    map.on("popupopen", function(e) {
      var date;
      date = new Date(parseInt($("#timeago").html()) * 1000);
      $('.leaflet-popup-pane').css('opacity', '0').css('margin-top', '0');
      $('#timeago').text($.timeago(date));
      return $('.leaflet-popup-pane').animate({
        opacity: 1,
        marginTop: '-5'
      }, 500, function() {});
    });
    return $('<div>zoom out</div>').addClass('zoom-out').attr('title', 'See somewhere other than San Francisco, the map demo capital of the world.').click(function() {
      return map.setView(new L.LatLng(40.84706035607122, -94.482421875), 4);
    }).appendTo($('#map'));
  };

  $(document).ready(function() {
    mappingTasks();
    if (authToken === 1) {
      return tokenCheck();
    }
  });

}).call(this);
