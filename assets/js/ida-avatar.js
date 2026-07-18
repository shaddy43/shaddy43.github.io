/* generate the 128px film-grain tile once and feed every .ida-grain */
(function () {
  var c = document.createElement('canvas'); c.width = c.height = 128;
  var x = c.getContext('2d'), d = x.createImageData(128, 128), i, v;
  for (i = 0; i < d.data.length; i += 4) {
    v = (Math.random() * 255) | 0;
    d.data[i] = d.data[i+1] = d.data[i+2] = v;
    d.data[i+3] = 90 + Math.random() * 110;
  }
  x.putImageData(d, 0, 0);
  var url = 'url(' + c.toDataURL() + ')';
  document.querySelectorAll('.ida-grain').forEach(function (e) { e.style.backgroundImage = url; });
})();
