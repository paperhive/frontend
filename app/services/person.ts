import angular from 'angular';
import { cloneDeep } from 'lodash';

export default function(app) {
  app.service('personService', class personService {

    static $inject = ['authService', 'peopleApi'];
    constructor(public authService, public peopleApi) {}

    update(person) {
      const id = person.id;
      const _person = cloneDeep(person);
      ['id', 'gravatarMd5', 'firstSignin', 'createdAt', 'updatedAt', 'externalIds']
        .forEach(key => delete _person[key]);
      delete _person.account.createdAt;

      return this.peopleApi.update(id, _person).then(newPerson => {
        this.authService.user = newPerson;
      });
    }
  });
}
