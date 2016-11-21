import { reverse } from 'lodash';
// import diacritics from 'diacritics';
import srch from 'srch';

function transformLowercase(str) {
  return {str: str.toLowerCase(), mapping: [
    {transformed: str.length, original: str.length}],
  };
}

// function transformDiacritics(str) {
//   return {str: diacritics.remove(str), mapping: [
//     {transformed: str.length, original: str.length}],
//   };
// }

function transform(transformations, str) {
  let transformedStr = str;
  let mappings = [];
  transformations.forEach(transformation => {
    const {str, mapping} = transformation(transformedStr);
    transformedStr = str;
    mappings.push(mapping);
  });
  return {transformedStr: transformedStr, mapping: mappings};
}

export class SearchIndex {
  mappings = [];
  transformedStr: String;

  transformations = [srch.transformSpaces, transformLowercase];

  constructor(str) {
    const {transformedStr, mapping} = transform(this.transformations, str);
    this.transformedStr = transformedStr;
    this.mappings = mapping;
  }

  search(searchStr) {
    const {transformedStr, mapping} = transform(this.transformations, searchStr);
    let positions = srch.findPositions(this.transformedStr, transformedStr);
    reverse(this.mappings).forEach(mapping => {
      positions = srch.backTransformPositions(positions, mapping);
    });
    return positions;
  }
}
