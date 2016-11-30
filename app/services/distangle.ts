export default function(app) {
  app.factory('distangleService', [function() {
    return {
      distangle: function(anchors, sizes, lb, ub) {
        // JS port of Robert Luce's distangle_fast in
        // https://github.com/rluce/interval-distangle/blob/master/src/distangle.py
        if (anchors.length !== sizes.length) {
          throw(new Error('arrays must have same length'));
        }

        const n = anchors.length;
        const lsum = new Float64Array(n);
        const asum = new Float64Array(n);
        const span = new Float64Array(n);
        const base = new Float64Array(n);
        const clen = new Int32Array(n);
        const backref = new Int32Array(n);
        const icBeg = new Int32Array(n);
        const icEnd = new Int32Array(n);
        let pos = 0;
        let ic;
        let i;

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

          let didMerge = true;
          while (didMerge) {
            didMerge = false;
            let otherIc;

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
        const optAnchors = new Float64Array(n);
        pos = 0;
        let offset;
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
            if (optAnchors[i] >= offset) { break; }
            optAnchors[i] = offset;
            offset += sizes[i];
          }
        }

        if (ub !== undefined) {
          offset = ub;
          for (i = n - 1; i >= 0; i--) {
            if (optAnchors[i] + sizes[i] <= offset) { break; }
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
