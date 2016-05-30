var tagsType = ["uno", "due"];


var myApp = angular.module('catalogoApp',['ngTagsInput', 'firebase']);


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

      // element.bind("keydown keypress", function(event) {
      //           if(event.which === 13) {
      //               scope.$apply(function(){
      //                   scope.$eval(attrs.ngEnter, {'event': event});
      //               });
      //               element.val("");
      //               event.preventDefault();
      //           }
      //       }, true);


       // $(element[0]).focus(function(e) {
       //  alert()
       // });
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


myApp.controller('taggerController', ['$scope', '$http' , "$firebaseArray", function($scope, $http, $firebaseArray) {
  
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
    
    // $scope.tagTypes[]
  });


  $scope.renameGroup = function(ref, newVal) {
    setTimeout(function() {

      firebase.database().ref(ref).set(newVal);
    },1 );
  }

  $scope.toggleEditable = function() {
    $scope.editable = !$scope.editable;
  }

  $scope.createTag = function(ref, newVal) {
    setTimeout(function() {
      firebase.database().ref(ref).push(newVal);
    },1);
    
    return;
    setTimeout(function() {

      // for (var x = 0; x < $scope.tags.length; x++) {
      //   var g = $scope.tags[x];
      //   if (g.name == group)
      // }
      if ($scope.tagTypes[group].length) {
        var tags = $scope.tagTypes[group].slice(0);
        if (tags.indexOf(name) == -1) {
          tags.push(name);
          firebase.database().ref("/tags/" + group).set(tags);
        }
      } else {
        var tags = [name];
        firebase.database().ref("/tags/" + group).set(tags);
      }

      
    },1);
  }
  // load tags column
  // $scope.tagTypes = {};
  // $scope.tagTypes.uno = ["a", "b"];
  // $scope.tagTypes.due = ["c", "d"];
  

}]);


