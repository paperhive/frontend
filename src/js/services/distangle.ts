'use strict';
module.exports = function(app) {
  app.factory('distangleService', [function() {
    return {
      distangle: function(anchors, sizes, lb, ub) {
        // JS port of Robert Luce's distangle_fast in
        // https://github.com/rluce/interval-distangle/blob/master/src/distangle.py
        if (anchors.length !== sizes.length) {
          throw(new Error('arrays must have same length'));
        }

        var n = anchors.length;
        var lsum = new Float64Array(n);
        var asum = new Float64Array(n);
        var span = new Float64Array(n);
        var base = new Float64Array(n);
        var clen = new Int32Array(n);
        var backref = new Int32Array(n);
        var icBeg = new Int32Array(n);
        var icEnd = new Int32Array(n);
        var pos = 0;
        var ic;
        var i;

        asum.set(anchors);
        span.set(sizes);
        base.set(anchors);
        for (i = 0; i < n; i++) {
          clen[i] = 1;
          backref[i] = i;
          icBeg[i] = i;
          icEnd[i] = i + 1;
        }

        while (pos < n) {
          ic = backref[pos];

          var didMerge = true;
          while (didMerge) {
            didMerge = false;
            var otherIc;

            if (icBeg[ic] > 0) {
              // merge with left IC?
              otherIc = backref[icBeg[ic] - 1];

              if (base[ic] < base[otherIc] + span[otherIc]) {
                asum[ic] += asum[otherIc];
                lsum[ic] += lsum[otherIc] + clen[ic] * span[otherIc];
                clen[ic] += clen[otherIc];
                span[ic] += span[otherIc];
                base[ic] = (asum[ic] - lsum[ic]) / clen[ic];

                icBeg[ic] = icBeg[otherIc];
                backref[icBeg[ic]] = ic;

                didMerge = true;
              }
            }

            if (icEnd[ic] < n) {
              // merge with right IC?
              otherIc = backref[icEnd[ic]];

              if (base[ic] + span[ic] > base[otherIc]) {
                asum[ic] += asum[otherIc];
                lsum[ic] += lsum[otherIc] + clen[otherIc] * span[ic];
                clen[ic] += clen[otherIc];
                span[ic] += span[otherIc];
                base[ic] = (asum[ic] - lsum[ic]) / clen[ic];

                icEnd[ic] = icEnd[otherIc];
                backref[icEnd[ic] - 1] = ic;

                didMerge = true;
              }
            }
          }

          pos = icEnd[ic];
        }

        // compute optimal base points
        var optAnchors = new Float64Array(n);
        pos = 0;
        var offset;
        while (pos < n) {
          ic = backref[pos];
          offset = 0.0;
          for (i = icBeg[ic]; i < icEnd[ic]; i++) {
            optAnchors[i] = base[ic] + offset;
            offset += sizes[i];
          }
          pos = icEnd[ic];
        }

        // shift for lower bound
        if (lb !== undefined) {
          offset = lb;
          for (i = 0; i < n; i++) {
            if (optAnchors[i] >= offset) {break;}
            optAnchors[i] = offset;
            offset += sizes[i];
          }
        }

        if (ub !== undefined) {
          offset = ub;
          for (i = n - 1; i >= 0; i--) {
            if (optAnchors[i] + sizes[i] <= offset) {break;}
            optAnchors[i] = offset - sizes[i];
            offset = optAnchors[i];
          }

          if (lb !== undefined && offset < lb) {
            throw(
              new Error('elements do not fit between lower and upper bound')
            );
          }
        }

        // shift for upper bound
        return optAnchors;
      }
    };
  }]);
};
