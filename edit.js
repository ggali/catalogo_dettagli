var tagsType = ["uno", "due"];

var myApp = angular.module('catalogoApp',['ngTagsInput']);

myApp.controller('taggerController', ['$scope', '$http', function($scope, $http) {
  
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAGY4E5salsmIBUmNdd6elKspWr2w_qZuE",
    authDomain: "catalogo-3c65b.firebaseapp.com",
    databaseURL: "https://catalogo-3c65b.firebaseio.com",
    storageBucket: "catalogo-3c65b.appspot.com",
  };
  firebase.initializeApp(config);

  var tagsRef = firebase.database().ref('/tags');

  tagsRef.on('value', function(data) {
    $scope.$apply(function() {
      $scope.tags = data.val();
    })
  });

  $scope.newOne = {};
  $scope.newOne.folder = "";
  $scope.newOne.notaPubblica = "";
  $scope.newOne.notaPrivata = "";
  $scope.newOne.tags = [];


  $scope.addTag = function(tag,e ) {
    $scope.newOne.tag = $scope.newOne.tag + tag;
    e.preventDefault();
  }

  $scope.createTag = function(ref, newVal) {
    setTimeout(function() {
      firebase.database().ref(ref).push(newVal);
    },1);
  }

  $scope.delete = function(ref) {
    setTimeout(function() {
      firebase.database().ref(ref).remove();
    },1);
  }

  $scope.addGroup = function() {
    setTimeout(function() {
      firebase.database().ref("/tags").push({name:"nuovo", tags: []})
    },1);
  }

  $scope.renameGroup = function(ref, newVal) {
    setTimeout(function() {
      firebase.database().ref(ref).set(newVal);
    },1 );
  }

  $scope.save = function() {
    alert("saved");
    $scope.newOne.tags = $scope.newOne.tags.map(function(tag) { return tag.text; });
    firebase.database().ref('/details').push($scope.newOne);
  }

  $scope.toggleEditable = function() {
    $scope.editable = !$scope.editable;
  }
}]);



angular.module('catalogoApp').directive("contenteditable", function() {
  return {
    restrict: "A",
    require: "ngModel",
    link: function(scope, element, attrs, ngModel) {

      function read() {
        ngModel.$setViewValue(element.text());
      }

      ngModel.$render = function() {
        element.html(ngModel.$viewValue || "");
      };

       $(element[0]).keydown(function(e) {
          if(e.which === 13) {
            e.preventDefault();
            setTimeout(function() {
              scope.$apply(function(){
                  scope.$eval(attrs.ngEnter, {'event': e});
              });
            },1);
            return false;
          }
        });

      element.bind("keydown", function() {
        scope.$apply(read);
      });
    }
  };
});




angular.module('catalogoApp').directive('ngEnter', function() {
    return function(scope, element, attrs) {

      $(element[0]).keydown(function(e) {

        if(e.which === 13) {
          e.preventDefault();
          setTimeout(function() {
            scope.$apply(function(){
                scope.$eval(attrs.ngEnter, {'event': e});
            });
          },1);
          return false;
        }
      });
    };
});

