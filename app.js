(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com")
.directive('foundItems', FoundItemsDirective);

function FoundItemsDirective() {
  var ddo = {
    templateUrl: 'foundItems.html',
    restrict: 'AE',
    scope: {
      items: '<',
      onRemove: '&'
    },
    controller: FoundItemsDirectiveController,
    controllerAs: 'nid_ctrl',
    bindToController: true
  };

  return ddo;
}

FoundItemsDirectiveController.$inject = ['MenuSearchService'];
function FoundItemsDirectiveController(MenuSearchService){
  var nid_ctrl = this;

  nid_ctrl.onRemove = function (itemIndex) {
    MenuSearchService.onRemove(itemIndex);
  };
}

NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
  var nid_ctrl = this;

  nid_ctrl.searchTerm = '';

  nid_ctrl.items = [];


  nid_ctrl.narrowItDown = function (searchTerm) {
    var promise = MenuSearchService.getMatchedMenuItems(searchTerm);

    promise.then(function (response) {
      nid_ctrl.items = response;
      nid_ctrl.b = true;
    })
    .catch(function (error) {
      console.log("Something went terribly wrong.");
    });
  };
}

MenuSearchService.$inject = ['$http', 'ApiBasePath']
function MenuSearchService($http, ApiBasePath) {
  var service = this;
  var items = [];

  service.getMatchedMenuItems = function (searchTerm) {
    return $http({
      method: "GET",
      url: (ApiBasePath + "/menu_items.json")
    }).then(function(response){
      searchTerm = searchTerm.toLowerCase();
      for(var i = 0; i < response.data.menu_items.length; i++){
        if(i===0){
          items = [];
        }
        if (response.data.menu_items[i].description.toLowerCase().indexOf(searchTerm) !== -1){
         items.push(response.data.menu_items[i]);
        }
      }
      return items;
    });      
  };

  service.onRemove = function (itemIndex) {
    items.splice(itemIndex, 1);
  };

}
})();