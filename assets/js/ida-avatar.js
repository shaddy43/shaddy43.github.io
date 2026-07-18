// Generates a film-grain texture on a canvas and applies it to the avatar's
// grain layer, so no noise.png asset is needed. The shimmer/cycling is done
// in CSS; this just supplies the tile.
(function () {
    var grains = document.querySelectorAll('.ida-avatar .ida-grain');
    if (!grains.length) return;
    var n = 128, c = document.createElement('canvas');
    c.width = c.height = n;
    var ctx = c.getContext('2d'), img = ctx.createImageData(n, n), d = img.data;
    for (var i = 0; i < d.length; i += 4) {
        var v = (Math.random() * 255) | 0;
        d[i] = d[i + 1] = d[i + 2] = v;
        d[i + 3] = 30;
    }
    ctx.putImageData(img, 0, 0);
    var url = 'url(' + c.toDataURL() + ')';
    grains.forEach(function (g) { g.style.backgroundImage = url; });
})();
