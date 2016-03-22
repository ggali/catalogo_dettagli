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
  

  $scope.searchTags = [];
  $http({
    method: 'GET',
    url: 'trello.json'
  }).then(function successCallback(response) {
    console.log("response" , response);
    $scope.model = response;
    // make some fixes on the model coming from trello
    $($scope.model.data.cards).each(function() {
      var card = this;

      if (card.idList != "56a0dcd62f77fc562720b136")
        return;

      card.tags = card.name.toLowerCase().split("-");

      $(card.tags).each(function(index) {
        card.tags[index] = card.tags[index].trim();
        var desc = card.desc.split("**");
        console.log(desc);
        card.nota = desc[2];
      });
    });

  }, function errorCallback(response) {
  });


  $scope.$watchCollection('filteredCards', function() { 
    setTimeout(function() {

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

      $scope.$apply(function() {
        $scope.additionalTags = tags;
      })
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
    if (card.idList != "56a0dcd62f77fc562720b136")
      return false;

    if (!$scope.searchTags || !card.tags)
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


