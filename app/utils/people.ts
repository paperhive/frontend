import { cloneDeep } from 'lodash';

export function createPersonUpdate(person) {
  const { displayName, discipline, occupation, account } = cloneDeep(person);
  const { createdAt, featureFlags, ...accountUpdate } = account;
  return {
    displayName,
    discipline,
    occupation,
    account: {...accountUpdate},
  };
}
