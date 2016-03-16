function intersect(a, b) {
    var t;
    // if (b.length > a.length) t = b, b = a, a = t; // indexOf to loop over shorter
    return a.filter(function (e) {
      // console.log(e.text);
        if (b.indexOf(e.text) !== -1) return true;
    });
}


// Array.prototype.chunk = function(chunkSize) {
//     var array=this;
//     return [].concat.apply([],
//         array.map(function(elem,i) {
//             return i%chunkSize ? [] : [array.slice(i,i+chunkSize)];
//         })
//     );
// }
function chunk(arr, size) {
  var newArr = [];
  for (var i=0; i<arr.length; i+=size) {
    newArr.push(arr.slice(i, i+size));
  }
  return newArr;
}


var myApp = angular.module('catalogoApp',['ngTagsInput']);

myApp.controller('searchController', ['$scope', '$http', function($scope, $http) {
  

  $scope.searchTags = [];
  $http({
    method: 'GET',
    url: 'trello.json'
  }).then(function successCallback(response) {
    console.log(response);
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


  $scope.$watchCollection('searchTags', function() { 
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



// (function($){

// $(window).on("ready", function() {

//   // optimize background img in header
//   // var w = Math.max(window.screen.width, window.screen.height);
  
//   // load from trello
//   $.getJSON( "./trello.json", function( data ) {
//     console.log(data);
//     var items = [];
    
//     var idList = null;
//     // find the id list
//     var url = window.location.pathname;
//     var filename = url.substring(url.lastIndexOf('/')+1);

//     $.each(data.lists, function( key, list ) {
//       if (list.name == "In corso") {
//         idList = list.id;
//         return false
//       }
//     });

//     if (!idList)
//       return;

//     var $model = $(".trello");
//     var $btnLoadMore = $("#trello-load-more");
    
//     $btnLoadMore.on("click", function() {
//       $btnLoadMore.hide();
//       $(".trello").show();
//     });


//     var cardNumber = 0;
//     // cards
//     $.each(data.cards, function( key, card ) {
//       if (card.idList != idList)
//         return;
      
//       cardNumber++;
      
//       // we have a card
//       // check video
//       if (card.desc.indexOf("player.vimeo.com") > 0) {
//         var $clone = $model.clone();
//         var $embed = $('<div class="embed-responsive embed-responsive-16by9"></div>');
//         var $iframe = $('<iframe class="m-t-1"></iframe>');
//         $iframe.attr("src", card.desc);
//         $embed.append($iframe);
//         $clone.find("img").replaceWith($embed);

//         if (cardNumber > imagesLimit)
//           $clone.hide();

//         $clone.insertBefore($btnLoadMore);
      
//         return;
//       }

//       // check img
//       var $clone = $model.clone();
//       var url = card.attachments[0].url.replace("https://trello-attachments.s3.amazonaws.com", "http://galimberti.imgix.net");
//       url = url + "?w=" + resolution;
//       url = url + "&mark=" + markurl;
//       url = url + "&markscale=" + markscale + "&markpad=" + markpad;
//       $clone.find("img").attr("src", url);
//       $clone.find("img").attr("alt", card.name);

//       if (cardNumber > imagesLimit)
//           $clone.hide();

//       $clone.insertBefore($btnLoadMore);

//       // if two col
//       if (card.attachments.length > 1) {

//         var $col = $clone.find(".col-lg-12");
//         $col.removeClass("col-lg-12").addClass("col-lg-6");
//         var $secondCol = $col.clone();
//         var url = card.attachments[1].url.replace("https://trello-attachments.s3.amazonaws.com", "http://galimberti.imgix.net");
//         url = url + "?w=" + resolution;
//         url = url + "&mark=" + markurl;
//         url = url + "&markscale=" + markscale + "&markpad=" + markpad;
//         $secondCol.find("img").attr("src", url);

//         // var firstUrl = $col.find("img").attr("src");
//         // $col.find("img").attr("src", firstUrl);
//         $secondCol.find("img").attr("alt", card.name);
//         $col.after($secondCol);
//       }
//       // zoom
//     });

//     if (cardNumber <= imagesLimit) 
//       $btnLoadMore.hide();

//     // show load more button if we have more the img/page limit
//     // if (window.screen.width < 940)
//     //   return;


//     var zoomImage = function(img) {
//       // clone, fix width and append
//       var index = $model.parent().find("img").index(img);
//       document.location.hash = "#" + index;

//       // create the wrapper and the full width image
//       var $wrapper = $("<div class='full-screen'>\
//                           <div class='btn-group m-t-1 m-x-1  pull-xs-right'>\
//                             <label class='btn btn-info' style='pointer-events:none'>Immagine " + index + "</label>\
//                             <div class='btn-group'>\
//                               <button class='btn btn-info fa fa-chain' data-toggle='dropdown'></button>\
//                               <div class='dropdown-menu dropdown-menu-right p-a-1'>\
//                                 <input type='text' size='50' value='"+ document.location +"'>\
//                               </div>\
//                             </div>\
//                             <a class='btn btn-info fa fa-envelope' href='mailto:?body=" + document.location + "'></a>\
//                             <a class='btn btn-info fa fa-facebook'></a>\
//                           </div>\
//                         </div>");
      
//       var $img = $("<img>");
//       $img.attr("src", $(img).attr("src"));
//       $img.css("pointer-events", "none");
//       $wrapper.append($img);
      
//       $wrapper.find(".fa-facebook").on("click", function() {
//         FB.ui(
//         {
//           method: 'feed',
//           name: 'Galimberti - Legno e Bioedilizia',
//           link: document.location.href,
//           picture: $(img).attr("src"),
//           caption: 'www.galimberti.eu',
//           description: 'Progettiamo e fabbrichiamo costruzioni, coperture, facciate e pavimenti in legno e materiali naturali.',
//           message: ''
//         }
//       );

//         // var url = "http://www.facebook.com/sharer/sharer.php?p[summary]=Galimberti&p[url]=" + encodeURI($(img).attr("src")) ;
//         // window.open(url, "", "height=500,width=500,top=100px,menubar=no");
//       });

//       $wrapper.find(".fa-chain").on("click", function() {
//           var input = $wrapper.find("input")[0];
//           input.setSelectionRange(0, input.value.length);
//       })
//       // block the body scroll
//       $("body").addClass("noscroll");
//       $("body").append($wrapper);

//       $wrapper.one("click", function() {
//         // body back to scroll
//         $("body").removeClass("noscroll");
//         $wrapper.remove();
//         window.history.pushState(null, "", "#");
//       });
//     }

//     $model.parent().find("img").on("click", function() {
//       zoomImage(this);
//     });


//     try {
//       var index = Number(document.location.hash.replace("#", ""));
//       if (index != 0)
//         zoomImage($model.parent().find("img")[index]);
//     } catch(e) {
//     }
   
//    $model.hide();
    
//   });

// });
