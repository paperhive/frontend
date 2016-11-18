import { reverse } from 'lodash';
import srch from 'srch';

export class SearchIndex {
  mappings = [];
  transformedStr: String;

  transformations = [srch.transformSpaces];

  constructor(str) {
    this.transformedStr = str;
    this.transformations.forEach(transformation => {
      const {str, mapping} = transformation(this.transformedStr);
      this.transformedStr = str;
      this.mappings.push(mapping);
    });
  }

  search(str) {
    let positions = srch.findPositions(this.transformedStr, str);
    reverse(this.mappings).forEach(mapping => {
      positions = srch.backTransformPositions(positions, mapping);
    });
    return positions;
  }
}
