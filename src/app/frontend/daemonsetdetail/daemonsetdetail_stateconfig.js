// Copyright 2015 Google Inc. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {actionbarViewName} from 'chrome/chrome_state';
import {breadcrumbsConfig} from 'common/components/breadcrumbs/breadcrumbs_service';
import {stateName as daemonSetList, stateUrl} from 'daemonsetlist/daemonsetlist_state';

import {DaemonSetDetailController} from './daemonsetdetail_controller';
import {stateName} from './daemonsetdetail_state';

/**
 * Configures states for the daemon set details view.
 *
 * @param {!ui.router.$stateProvider} $stateProvider
 * @ngInject
 */
export default function stateConfig($stateProvider) {
  $stateProvider.state(stateName, {
    url: `${stateUrl}/:namespace/:daemonSet`,
    resolve: {
      'daemonSetDetailResource': getDaemonSetDetailResource,
      'daemonSetDetail': getDaemonSetDetail,
    },
    data: {
      [breadcrumbsConfig]: {
        'label': '{{$stateParams.daemonSet}}',
        'parent': daemonSetList,
      },
    },
    views: {
      '': {
        controller: DaemonSetDetailController,
        controllerAs: 'ctrl',
        templateUrl: 'daemonsetdetail/daemonsetdetail.html',
      },
      [actionbarViewName]: {},
    },
  });
}

/**
 * @param {!./daemonsetdetail_state.StateParams} $stateParams
 * @param {!angular.$resource} $resource
 * @return {!angular.Resource<!backendApi.DaemonSetDetail>}
 * @ngInject
 */
export function getDaemonSetDetailResource($resource, $stateParams) {
  return $resource(`api/v1/daemonset/${$stateParams.namespace}/${$stateParams.daemonSet}`);
}

/**
 * @param {!angular.Resource<!backendApi.DaemonSetDetail>} daemonSetDetailResource
 * @return {!angular.$q.Promise}
 * @ngInject
 */
export function getDaemonSetDetail(daemonSetDetailResource) {
  return daemonSetDetailResource.get().$promise;
}
