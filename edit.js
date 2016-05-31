/*
    Function to carry out the actual PUT request to S3 using the signed request from the app.
  */
  function uploadFile(file, signedRequest, url, callback){
    const xhr = new XMLHttpRequest();
    console.log("SIGNED", signed);
    xhr.open('PUT', signedRequest);
    xhr.onreadystatechange = () => {
      if(xhr.readyState === 4){
        if(xhr.status === 200){
          callback(null);
        }
        else{
          callback(xhr.status);
        }
      }
    };
    xhr.send(file);
  }

/*
  Function to get the temporary signed request from the app.
  If request successful, continue to upload the file using this signed
  request.
*/
function getSignedRequest(file, callback){
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `https://secure-tundra-77504.herokuapp.com/sign-s3?file-name=${file.name}&file-type=${file.type}`);
  xhr.onreadystatechange = () => {
    if(xhr.readyState === 4){
      if(xhr.status === 200){
        const response = JSON.parse(xhr.responseText);
        uploadFile(file, response.signedRequest, response.url, callback);
      }
      else{
        alert('Could not get signed URL.');
      }
    }
  };
  xhr.send();
}


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
  $scope.newOne.id = "";
  $scope.newOne.folder = "";
  $scope.newOne.notaPubblica = "";
  $scope.newOne.notaPrivata = "";
  $scope.newOne.tags = [];
  // $scope.newOne.dwg = null;
  $scope.newOne.pdf = null;

  $scope.tempFiles = [];

  // handle upload
  $(document).find("#pdf").on("change", function(e) {
    $scope.$apply(function() {
      console.log(e.target.files);
      $scope.newOne.pdf = e.target.files;
    })
  })

  $scope.addTag = function(tag,e) {
    $scope.newOne.tags.push({text: tag});
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
    $scope.busy = true;


    
    var storageRef = firebase.storage().ref();
    
    if ($scope.newOne.pdf instanceof FileList) {
      // var filename = $scope.newOne.id + ".pdf";
      // var fileRef = storageRef.child(filename);
      // File or Blob, assume the file is called rivers.jpg
      var file = $scope.newOne.pdf[0];
      getSignedRequest(file, function(err) {
        if (!err) {
          $scope.newOne.pdf = uploadTask.snapshot.downloadURL;
          $scope.save();
        }
      });
    } else {
      setTimeout(function() {
        $scope.newOne.tags = $scope.newOne.tags.map(function(tag) { return tag.text; });
        firebase.database().ref('/details').push($scope.newOne, function() {
          $scope.$apply(function() {
            $scope.busy = false;
          });  
        });  
        
      })      
    }


    
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

