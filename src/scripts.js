(function(){ 'use strict';

  // Objekte mit Funktionen
  var max = {
    firstName: 'Max',
    lastName: 'Mustermann',
    sayHello: function(){
      console.log('Hallo, ich bin ' + this.firstName + ' ' + this.lastName);
    }
  };

  max.sayHello();

})();
