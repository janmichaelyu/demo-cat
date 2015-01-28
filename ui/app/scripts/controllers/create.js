(function () {
  'use strict';

  angular.module('demoCat')
    .controller('CreateCtrl', CreateCtrl);

  CreateCtrl.$inject = ['$scope', 'Domains', 'demoService', 'User', '$location', '$routeParams', 'edit', 'demo', 'features'];
  function CreateCtrl($scope, domains, demoService, user, $location, $routeParams, edit, demo, features) {
      var model = {
        demo: demo || {
          name: '',
          description: '',
          host: '',
          hostType: 'internal',
          browsers: [],
          features: [],
          domains: [],
          languages: [],
          bugs: [],
          comments: [],
          credentials: []
        },
        edit: edit,
        featureChoices: features,
        domainChoices: domains.list(),
        browserChoices: ['Firefox', 'Chrome', 'IE'],
        user: user // GJo: a bit blunt way to insert the User service, but seems to work
      };

      angular.extend($scope, {
        model: model,
        editorOptions: {
          height: '100px',
          toolbarGroups: [
            { name: 'clipboard',   groups: [ 'clipboard', 'undo' ] },
            { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
            { name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi' ] },
            { name: 'links' }
          ],
          //override default options
          toolbar: '',
          /* jshint camelcase: false */
          toolbar_full: ''
        },
        updateBrowsers: function(browser) {
          var index = $scope.model.demo.browsers.indexOf(browser);
          if (index > -1) {
            $scope.model.demo.browsers.splice(index, 1);
          } else {
            $scope.model.demo.browsers.push(browser);
          }
        },
        addCredentials: function() {
          model.demo.credentials.push({username: null, password: null});
        },
        removeCredentials: function(index) {
          model.demo.credentials.splice(index, 1);
        },
        addFeature: function() {
          if (model.demo.features.indexOf(model.featureToAdd) < 0) {
            model.demo.features.push(model.featureToAdd);
          }
          delete model.featureToAdd;
        },
        removeFeature: function(index) {
          model.demo.features.splice(index, 1);
        },
        submit: function() {
          var promise;
          if (edit) {
            promise = demoService.save(model.demo, $routeParams.uri);
          }
          else {
            promise = demoService.create(model.demo);
          }

          promise.then(function(response) {
            // var uri = response.data.href.replace(/(.*\?uri=)/, '');
            var uri = response.uri;//$routeParams.uri;
            $location.path('/detail' + uri);
          });
        },
        cancel: function() {
          if (edit) {
            $location.path('/detail' + $routeParams.uri);
          }
          else {
            $location.path('/');
          }
        }
      });
    }
}());
