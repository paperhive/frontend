'use strict';

import { includes, remove } from 'lodash';

import template from './channel-members.html!text';

export default function(app) {
  app.component('channelMembers', {
    bindings: {
      channel: '<',
      isOwner: '<',
      onInvitationCreate: '&',
      onInvitationDelete: '&',
      onMemberUpdate: '&',
      onMemberDelete: '&',
    },
    controller: class ChannelMembers {
      static $inject = ['$uibModal', 'authService'];
      constructor(public $uibModal, public authService) {}

      invitationDelete(invitationId) {
        this.invitationDeleting = invitationId;
        this.onInvitationDelete({invitationId})
          .then(() => this.invitationDeleting = false);
      }

      memberDelete(memberId) {
        this.memberDeleting = memberId;
        this.onMemberDelete({memberId})
          .then(() => this.memberDeleting = false);
      }
    },
    template,
  });
}
/*
      $onChanges() {
          this.authService.loginPromise.then(() => {

            $http.get(
              config.apiUrl + `/channels/${$routeParams.channelId}`
            )
            .success(ret => {
              ctrl.channel = ret;
              function findUser(member) {
                return member.person.id === authService.user.id;
              }
              const user = ret.members.find(findUser);
              ctrl.self = user;
              ctrl.owner = includes(user.roles, 'owner');
            })
            .error(data => {
              notificationService.notifications.push({
                type: 'error',
                message: data.message ? data.message :
                  'could not fetch channel (unknown reason)'
              });
            });
          });
        };

        ctrl.open = () => {
          const modalInstance = $uibModal.open({
            animation: ctrl.animationsEnabled,
            component: 'channelInvitation',
          });
        };

        ctrl.toggleAnimation = () => {
          ctrl.animationsEnabled = !ctrl.animationsEnabled;
        };

        ctrl.removeChannelMember = (channelId, memberId) => {
          $http.delete(
            config.apiUrl + `/channels/${channelId}/members/${memberId}`
          )
          .success(ret => {
            console.log(ret);
            // remove(ctrl.channel.members, {id: memberId});
          })
          .error(data => {
            notificationService.notifications.push({
              type: 'error',
              message: data.message ? data.message :
                'could not delete channel invitation (unknown reason)'
            });
          });
        };

        ctrl.removeChannelInvitation = (channelId, invitationId) => {
          $http.delete(
            config.apiUrl + `/channels/${channelId}/invitations/${invitationId}`
          )
          .success(ret => {
            remove(ctrl.channel.invitations, {id: invitationId});
          })
          .error(data => {
            notificationService.notifications.push({
              type: 'error',
              message: data.message ? data.message :
                'could not delete channel invitation (unknown reason)'
            });
          });
        };

      }
    ],

    template,
  });
};
*/
