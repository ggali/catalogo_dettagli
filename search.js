// var tagsType = ["uno", "due"];


// var myApp = angular.module('catalogoApp',['ngTagsInput', 'firebase']);





// myApp.controller('taggerController', ['$scope', '$http' , "$firebaseArray", function($scope, $http, $firebaseArray) {
  
//   // Initialize Firebase
//   var config = {
//     apiKey: "AIzaSyAGY4E5salsmIBUmNdd6elKspWr2w_qZuE",
//     authDomain: "catalogo-3c65b.firebaseapp.com",
//     databaseURL: "https://catalogo-3c65b.firebaseio.com",
//     storageBucket: "catalogo-3c65b.appspot.com",
//   };
//   firebase.initializeApp(config);

//   var tagsRef = firebase.database().ref('/tags');

  
  
  

// }]);






function intersect(a, b) {
    var t;
    // if (b.length > a.length) t = b, b = a, a = t; // indexOf to loop over shorter
    return a.filter(function (e) {
      // console.log(e.text);
        if (b.indexOf(e.text) !== -1) return true;
    });
}

var myApp = angular.module('catalogoApp',['ngTagsInput']);

myApp.controller('searchController', ['$scope', '$http', function($scope, $http) {
  
  var config = {
    apiKey: "AIzaSyAGY4E5salsmIBUmNdd6elKspWr2w_qZuE",
    authDomain: "catalogo-3c65b.firebaseapp.com",
    databaseURL: "https://catalogo-3c65b.firebaseio.com",
    storageBucket: "catalogo-3c65b.appspot.com",
  };
  firebase.initializeApp(config);

  $scope.cards = [];

  var tagsRef = firebase.database().ref('/details').once("value", function(val) {
    $scope.$apply(function() {
      var v = val.val();
      for (var k in v) {
        $scope.cards.push(v[k]);
      }
    });
  });

  var tagsRef = firebase.database().ref('/tags').once("value", function(val) {
    $scope.$apply(function() {
      $scope.allTags = val.val();
      $scope.tags = val.val();
      console.log($scope.tags);
    });
  });


  $scope.searchTags = [];

  $scope.$watchCollection('searchTags', function() { 
    
    setTimeout(function() {

      if ($scope.searchTags.length == 0) {
        $scope.$apply(function() {
          $scope.tags = $scope.allTags;
        });
        return;
      }

      var tags = [];
      $($scope.filteredCards).each(function() {
        var card = this;
        if (card.tags) {
          $(card.tags).each(function() {
          if (tags.indexOf(String(this)) == -1)
            tags.push(String(this));
          })
        }
      });

      $scope.tags = [];
      for (var k in $scope.allTags) {
        var g = $scope.allTags[k];
        var group = {};
        group.tags = [];
        group.name = g.name;
        $scope.tags[k] = group;
        
       
        for (var x in g.tags) {
          if (tags.indexOf(g.tags[x]) > -1) {
            group.tags.push(g.tags[x]);
          }
        }
      }
      $scope.$digest();
     
    },1);
  })


  $scope.loadItems = function(q) {
    var ret = [];
    $($scope.additionalTags).each(function() {
      console.log(this.indexOf(q), this, q);
      if (this.indexOf(q) != -1)
        ret.push({text: this.toString()});
    });
    return ret;
  }

  $scope.addTag = function(tag) {
    $scope.searchTags.push({text: tag});
  }


  $scope.filterCards = function (card) {
    // return true;
    // if (card.idList != "56a0dcd62f77fc562720b136")
    //   return false;

    // if (!$scope.searchTags || !card.tags)
    //   return true;
    if (!card.tags)
      return true;

    return (intersect( $scope.searchTags, card.tags).length == $scope.searchTags.length );
  };

}]);


/* **************************************************************************************** 
  CONTROLLER PRODOTTO 
****************************************************************************************  */
myApp.controller('productController', ['$scope', '$http', function($scope, $http) {
  
  $scope.searchTags = [];
  $http({
    method: 'GET',
    url: 'trello.json'
  }).then(function successCallback(response) {
    
    // extract param from url
    var id = document.location.search.replace("?id=", "");
    // make some fixes on the model coming from trello
    $(response.data.cards).each(function() {
      if (this.id != id)
        return;

      $scope.card = this;
       card.tags = card.name.toLowerCase().split("-");

      $(card.tags).each(function(index) {
        card.tags[index] = card.tags[index].trim();
        var desc = card.desc.split("**");
        console.log(desc);
        card.nota = desc[2];
      });

      return false;
      
    });

  }, function errorCallback(response) {
  });


  

}]);


