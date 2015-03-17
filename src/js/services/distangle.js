'use strict';
module.exports = function (app) {
  app.factory('distangleService', [function () {
    return {
      distangle: function (anchors, sizes, lb, ub) {
        // JS port of Robert Luce's distangle_fast in
        // https://github.com/rluce/interval-distangle/blob/master/src/distangle.py
        if (anchors.length !== sizes.length) {
          throw(new Error('arrays must have same length'));
        }

        var
          n = anchors.length,
          lsum = new Float64Array(n),
          asum = new Float64Array(n),
          span = new Float64Array(n),
          base = new Float64Array(n),
          clen = new Int32Array(n),
          backref = new Int32Array(n),
          ic_beg = new Int32Array(n),
          ic_end = new Int32Array(n),
          pos = 0,
          ic, i;

        asum.set(anchors);
        span.set(sizes);
        base.set(anchors);
        for (i=0; i < n; i++) {
          clen[i] = 1;
          backref[i] = i;
          ic_beg[i] = i;
          ic_end[i] = i+1;
        }

        while (pos < n) {
          ic = backref[pos];

          var did_merge = true;
          while (did_merge) {
            did_merge = false;
            var other_ic;

            if (ic_beg[ic] > 0) {
              // merge with left IC?
              other_ic = backref[ic_beg[ic] - 1];

              if (base[ic] < base[other_ic] + span[other_ic]) {
                asum[ic] += asum[other_ic];
                lsum[ic] += lsum[other_ic] + clen[ic] * span[other_ic];
                clen[ic] += clen[other_ic];
                span[ic] += span[other_ic];
                base[ic] = (asum[ic] - lsum[ic]) / clen[ic];

                ic_beg[ic] = ic_beg[other_ic];
                backref[ic_beg[ic]] = ic;

                did_merge = true;
              }
            }

            if (ic_end[ic] < n) {
              // merge with right IC?
              other_ic = backref[ic_end[ic]];

              if (base[ic] + span[ic] > base[other_ic]) {
                asum[ic] += asum[other_ic];
                lsum[ic] += lsum[other_ic] + clen[other_ic] * span[ic];
                clen[ic] += clen[other_ic];
                span[ic] += span[other_ic];
                base[ic] = (asum[ic] - lsum[ic]) / clen[ic];

                ic_end[ic] = ic_end[other_ic];
                backref[ic_end[ic] - 1] = ic;

                did_merge = true;
              }
            }
          }

          pos = ic_end[ic];
        }

        // compute optimal base points
        var opt_anchors = new Float64Array(n);
        pos = 0;
        var offset;
        while (pos < n) {
          ic = backref[pos];
          offset = 0.0;
          for (i=ic_beg[ic]; i < ic_end[ic]; i++) {
            opt_anchors[i] = base[ic] + offset;
            offset += sizes[i];
          }
          pos = ic_end[ic];
        }

        // shift for lower bound
        if (lb !== undefined) {
          offset = lb;
          for (i = 0; i < n; i++) {
            if (opt_anchors[i] >= offset) break;
            opt_anchors[i] = offset;
            offset += sizes[i];
          }
        }

        // shift for upper bound
        return opt_anchors;
      }
    };
  }]);
};
