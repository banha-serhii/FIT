angular.module('starter.controllers', [])

.controller('PlaylistsCtrl', function( $scope, $state, $http, $stateParams, $ionicPopup, $ionicLoading) {
    $scope.data = [];
  $scope.id = $stateParams.id;
  $scope.caption = $stateParams.caption;
  $scope.showAlert = function (title, text) {
    $ionicPopup.alert({
      title: title,
      template: text
    });
  };
  $scope.refresh = function () {
    $ionicLoading.show({
      template: 'Loading...'
    });
    $http.get('http://www.uzhnu.edu.ua/uk/infocentre/openApi/48')
      .success(function (data) {
        $scope.data = data;
        $ionicLoading.hide();
        $scope.$broadcast('scroll.refreshComplete');
      })
      .error(function (data, status, headers, config) {
        $ionicLoading.hide();
        $scope.$broadcast('scroll.refreshComplete');
        $ionicPopup.alert({
            title: 'No Internet',
            content: 'Sorry'
          })
          .then(function (result) {
            if (!result) {
              ionic.Platform.exitApp();
            }
          });

      });
  };
  $scope.refresh();
})

.controller('PlaylistCtrl', function ($scope, $http, $stateParams, $ionicPopup, $ionicLoading, $cordovaFileTransfer) {

  $scope.data = [];
  $scope.id = $stateParams.id;
  $scope.caption = $stateParams.caption;
  $scope.showAlert = function (title, text) {
    $ionicPopup.alert({
        title: 'No Internet',
        content: 'Sorry'
      })
      .then(function (result) {
        if (!result) {
          ionic.Platform.exitApp();
        }
      });
  };
  $scope.refresh = function () {
    $ionicLoading.show({
      template: 'Loading...'
    });

    $http.get('http://www.uzhnu.edu.ua/uk/infocentre/openApi/' + $scope.id)
      .success(function (data, caption, status, headers, config) {
        $scope.data = data;
        $ionicLoading.hide();
        $scope.$broadcast('scroll.refreshComplete');
      })
      .error(function (data, status, headers, config) {
        $ionicLoading.hide();
        $scope.showAlert(status, data );
        $scope.$broadcast('scroll.refreshComplete');
      });
  };

  //accordion list
  $scope.toggleGroup = function(data) {
    if ($scope.isGroupShown(data)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = data;
    }
  };
  $scope.isGroupShown = function(data) {
    return $scope.shownGroup === data;
  };
  $scope.toggleGroup = function(group) {
    if ($scope.isGroupShown(group)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = group;
    }
  };
  $scope.isGroupShown = function(group) {
    return $scope.shownGroup === group;
  };

  $scope.downloadFile = function() {
    $ionicLoading.show({template: 'Download file...'});
    var url = "http://www.uzhnu.edu.ua/uk/infocentre/get/"+$scope.id;
    var filename = $scope.id+".doc";
    alert(filename);
    var targetPath = "/storage/sdcard0/documents/" + filename;
    var trustHosts = true
    var options = {};
    $cordovaFileTransfer.download(url, targetPath, options, trustHosts)
      .then(function() {
        // Success!
        $ionicLoading.hide();
        alert('File download ' + targetPath);
      }, function(error) {
        $ionicLoading.hide();
        // An error occured. Show a message to the user
        alert('Sorry');
        alert(JSON.stringify(error));
      });
  };
  $scope.refresh();
});
