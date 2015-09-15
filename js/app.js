if(!Math.log10) {
  Math.log10 = function(t){return(Math.log(t)/Math.LN10);};
}

Number.prototype.numberFormat = function(decimals, dec_point, thousands_sep) {
    dec_point = typeof dec_point !== 'undefined' ? dec_point : '.';
    thousands_sep = typeof thousands_sep !== 'undefined' ? thousands_sep : ',';

    var parts = this.toFixed(decimals).toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousands_sep);

    return parts.join(dec_point);
};

Number.prototype.padZero = function(length) {
  var s = this.toString();
  return('0'.repeat(length - s.length) + s);
}

String.prototype.contains = function(expression)  {
  if(typeof expression == "string") {
    return(this.indexOf(expression) != -1);
  }
  else if(typeof expression.test == "function") {
    return(expression.test(this));
  }
  return(undefined);
};

String.prototype.repeat = function(count) {
    if (count < 1) return '';
    var result = '', pattern = this.valueOf();
    while (count > 1) {
        if (count & 1) result += pattern;
        count >>= 1, pattern += pattern;
    }
    return result + pattern;
};

// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
}).controller('app', ['$scope', '$ionicModal', function($scope, $ionicModal){

  $scope.version = '1.0.1'

  $scope.includeSoulAfterAscension = false
  $scope.ignoreIris = true
  $scope.startingZone = 0
  $scope.ezSolomon = false
  $scope.listPlaystyle = ['idle', 'hybrid', 'active']
  $scope.playstyle = 'idle'
  $scope.anc = {};
  $scope.anc[0] = {
    'Name':'Soul bank',
    'clicking':false,
    'levelOld':0,
    'levelNew':0,
    'maxLevel':0,
    'getBonus':function(lvl){return("+" + this.bonusLevel(lvl).numberFormat() + this.bonusDesc);},
    'bonusLevel':function(lvl){return(10*lvl);},
    'bonusDesc':'% DPS (additive)',
    'upgradeCost':function(lvl){return(0);},
    'desiredLevel':function(s){return($scope.hasMorgulis ? 0 : $scope.calcMorgulis(s)-(10/11));}
  }
  $scope.anc[3] = {
    'Name':'Solomon',
    'clicking':false,
    'levelOld':0,
    'levelNew':0,
    'maxLevel':0,
    'getBonus':function(lvl){return("+" + this.bonusLevel(lvl).numberFormat() + this.bonusDesc);},
    'bonusLevel':function(lvl){return(solomonBonus(lvl));},
    'bonusDesc':'% Primal Hero Souls',
    'upgradeCost':function(lvl){return(Math.round(Math.pow(lvl, 1.5)));},

    'desiredLevel':function(s){return(laxSolomon ? s < 234 ? 0.75*s : 1.15*Math.pow(Math.log10(3.25*Math.pow(s,2)),0.4)*Math.pow(s,0.8) : s < 328 ? s : 1.15*Math.pow(Math.log(3.25*Math.pow(s,2)),0.4)*Math.pow(s,0.8));}
  };
  $scope.anc[4] = {
    'Name':'Libertas',
    'clicking':false,
    'levelOld':0,
    'levelNew':0,
    'maxLevel':0,
    'getBonus':function(lvl){return("+" + this.bonusLevel(lvl).numberFormat() + this.bonusDesc);},
    'bonusLevel':function(lvl){return(idleBonus(lvl));},
    'bonusDesc':'% Gold when Idle',
    'upgradeCost':function(lvl){return(lvl);},
    'desiredLevel':function(s){return($scope.playstyle=='active' ? 0 : 0.927*s);}
  };
  $scope.anc[5] = {
    'Name':'Siyalatas',
    'clicking':false,
    'levelOld':0,
    'levelNew':0,
    'maxLevel':0,
    'getBonus':function(lvl){return("+" + this.bonusLevel(lvl).numberFormat() + this.bonusDesc);},
    'bonusLevel':function(lvl){return(idleBonus(lvl));},
    'bonusDesc':'% DPS when Idle',
    'upgradeCost':function(lvl){return(lvl);},
    'desiredLevel':function(s){return($scope.playstyle=='active' ? 0 : s+1);}
  };
  $scope.anc[8] = {
    'Name':'Mammon',
    'clicking':false,
    'levelOld':0,
    'levelNew':0,
    'maxLevel':0,
    'getBonus':function(lvl){return("+" + this.bonusLevel(lvl).numberFormat() + this.bonusDesc);},
    'bonusLevel':function(lvl){return(5*lvl);},
    'bonusDesc':'% Gold Dropped',
    'upgradeCost':function(lvl){return(lvl);},
    'desiredLevel':function(s){return(0.927*s);}
  };
  $scope.anc[9] = {
    'Name':'Mimzee',
    'clicking':false,
    'levelOld':0,
    'levelNew':0,
    'maxLevel':0,
    'getBonus':function(lvl){return("+" + this.bonusLevel(lvl).numberFormat() + this.bonusDesc);},
    'bonusLevel':function(lvl){return(50*lvl);},
    'bonusDesc':'% Treasure Chest Gold',
    'upgradeCost':function(lvl){return(lvl);},
    'desiredLevel':function(s){return(0.927*s);}
  };
  $scope.anc[10] = {
    'Name':'Pluto',
    'clicking':true,
    'levelOld':0,
    'levelNew':0,
    'maxLevel':0,
    'getBonus':function(lvl){return("+" + this.bonusLevel(lvl).numberFormat() + this.bonusDesc);},
    'bonusLevel':function(lvl){return(30*lvl);},
    'bonusDesc':'% Golden Clicks Gold',
    'upgradeCost':function(lvl){return(lvl);},
    'desiredLevel':function(s){return($scope.playstyle=='idle' ? 0 : 0.5*s);}
  };
  $scope.anc[11] = {
    'Name':'Dogcog',
    'clicking':false,
    'levelOld':0,
    'levelNew':0,
    'maxLevel':25,
    'getBonus':function(lvl){return(this.bonusLevel(lvl).numberFormat() + this.bonusDesc);},
    'bonusLevel':function(lvl){return(-2*lvl);},
    'bonusDesc':'% Hero Upgrade Cost',
    'upgradeCost':function(lvl){return(lvl);},
    'desiredLevel':function(s){return(Math.min(this.maxLevel, s));}
  };
  $scope.anc[12] = {
    'Name':'Fortuna',
    'clicking':false,
    'levelOld':0,
    'levelNew':0,
    'maxLevel':40,
    'getBonus':function(lvl){return("+" + this.bonusLevel(lvl).numberFormat(2) + this.bonusDesc);},
    'bonusLevel':function(lvl){return(0.25*lvl);},
    'bonusDesc':'% 10x Gold Ch$scope.ance',
    'upgradeCost':function(lvl){return(lvl);},
    'desiredLevel':function(s){return(Math.min(this.maxLevel, (s*this.maxLevel)/58));}
  };
  $scope.anc[13] = {
    'Name':'Atman',
    'clicking':false,
    'levelOld':0,
    'levelNew':0,
    'maxLevel':25,
    'getBonus':function(lvl){return("+" + this.bonusLevel(lvl).numberFormat() + this.bonusDesc);},
    'bonusLevel':function(lvl){return(lvl);},
    'bonusDesc':'% Primal Bosses',
    'upgradeCost':function(lvl){return(Math.round(Math.pow(lvl, 1.5)));},
    'desiredLevel':function(s){return(Math.min(this.maxLevel, s));}
  };
  $scope.anc[14] = {
    'Name':'Dora',
    'clicking':false,
    'levelOld':0,
    'levelNew':0,
    'maxLevel':50,
    'getBonus':function(lvl){return("+" + this.bonusLevel(lvl).numberFormat() + this.bonusDesc);},
    'bonusLevel':function(lvl){return(20*lvl);},
    'bonusDesc':'% Treasure Chests',
    'upgradeCost':function(lvl){return(lvl);},
    'desiredLevel':function(s){return(Math.min(this.maxLevel, (s*this.maxLevel)/72));}
  };
  $scope.anc[15] = {
    'Name':'Bhaal',
    'clicking':true,
    'levelOld':0,
    'levelNew':0,
    'maxLevel':0,
    'getBonus':function(lvl){return("+" + this.bonusLevel(lvl).numberFormat() + this.bonusDesc);},
    'bonusLevel':function(lvl){return(15*lvl);},
    'bonusDesc':'% Critical Damage',
    'upgradeCost':function(lvl){return(lvl);},
    'desiredLevel':function(s){return($scope.playstyle=='idle' ? 0 : $scope.playstyle=='active' ? s-90 : 0.5*s);}
  };
  $scope.anc[16] = {
    'Name':'Morgulis',
    'clicking':false,
    'levelOld':0,
    'levelNew':0,
    'maxLevel':0,
    'getBonus':function(lvl){return("+" + this.bonusLevel(lvl).numberFormat() + this.bonusDesc);},
    'bonusLevel':function(lvl){return(11*lvl);},
    'bonusDesc':'% DPS (additive)',
    'upgradeCost':function(lvl){return(1);},
    'desiredLevel':function(s){return($scope.hasMorgulis ? $scope.calcMorgulis(s) : 0);}
  };
  $scope.anc[18] = {
    'Name':'Bubos',
    'clicking':false,
    'levelOld':0,
    'levelNew':0,
    'maxLevel':25,
    'getBonus':function(lvl){return(this.bonusLevel(lvl).numberFormat() + this.bonusDesc);},
    'bonusLevel':function(lvl){return(-2*lvl);},
    'bonusDesc':'% Boss Life',
    'upgradeCost':function(lvl){return(lvl);},
    'desiredLevel':function(s){return(Math.min(this.maxLevel, (s*this.maxLevel)/60));}
  };
  $scope.anc[19] = {
    'Name':'Fragsworth',
    'clicking':true,
    'levelOld':0,
    'levelNew':0,
    'maxLevel':0,
    'getBonus':function(lvl){return("+" + this.bonusLevel(lvl).numberFormat() + this.bonusDesc);},
    'bonusLevel':function(lvl){return(20*lvl);},
    'bonusDesc':'% Click Damage',
    'upgradeCost':function(lvl){return(lvl);},
    'desiredLevel':function(s){return($scope.playstyle=='idle' ? 0 : $scope.playstyle=='active' ? s : 0.5*s);}
  };
  $scope.anc[21] = {
    'Name':'Kumawakamaru',
    'clicking':false,
    'levelOld':0,
    'levelNew':0,
    'maxLevel':5,
    'getBonus':function(lvl){return(this.bonusLevel(lvl).numberFormat() + this.bonusDesc);},
    'bonusLevel':function(lvl){return(-1*lvl);},
    'bonusDesc':' Monsters per Zone',
    'upgradeCost':function(lvl){return(10*lvl);},
    'desiredLevel':function(s){return(Math.min(this.maxLevel, s/3));}
  };
  $scope.anc[28] = {
    'Name':'Argaiv',
    'clicking':false,
    'levelOld':0,
    'levelNew':0,
    'maxLevel':0,
    'getBonus':function(lvl){return("+" + this.bonusLevel(lvl).numberFormat() + this.bonusDesc);},
    'bonusLevel':function(lvl){return(2*lvl);},
    'bonusDesc':'% DPS per Gild',
    'upgradeCost':function(lvl){return(lvl);},
    'desiredLevel':function(s){return($scope.playstyle=='active' ? s+1 : s+9);}
  };
  $scope.anc[29] = {
    'Name':'Juggernaut',
    'clicking':true,
    'levelOld':0,
    'levelNew':0,
    'maxLevel':0,
    'getBonus':function(lvl){return("+" + this.bonusLevel(lvl).numberFormat(2) + this.bonusDesc);},
    'bonusLevel':function(lvl){return(0.01*lvl);},
    'bonusDesc':'% Click Damage/DPS<br>(each Combo)',
    'upgradeCost':function(lvl){return(Math.round(Math.pow(lvl, 1.5)));},
    'desiredLevel':function(s){return($scope.playstyle=='idle' ? 0 : $scope.playstyle=='active' ? Math.pow(s,0.8) : Math.pow(0.5*s, 0.8));}
  };
  $scope.anc[30] = {
    'Name':'Iris',
    'clicking':false,
    'levelOld':0,
    'levelNew':0,
    'maxLevel':0,
    'getBonus':function(lvl){return("+" + this.bonusLevel(lvl).numberFormat() + this.bonusDesc);},
    'bonusLevel':function(lvl){return(lvl);},
    'bonusDesc':' Starting Zone after Ascension',
    'upgradeCost':function(lvl){return(Math.round(Math.pow(lvl, 1.5)));},
    'desiredLevel':function(s){var t=($scope.irisMax == 0 ? Math.floor((371*Math.log(s)-2080)/5)*5-1-irisBonus : $scope.irisMax);return(t<(104-irisBonus)?0:t);}
  };

  $scope.calcMorgulis = function calcMorgulis(s)  {
    var tier = Math.min(Math.floor(s/10), 10);
    var percent = 25-tier;
    var correction = tier*(5*tier+4);
    var b = (100+percent+correction)/percent;
    var c = (correction+100)/percent - 100/11;
    return(s*(s+b)+c);
  }

  $scope.getOptimal = function getOptimal(ancient, level) {
    var optimalLevel = ancient.desiredLevel(level);
    return(optimalLevel > 0 ? Math.round(optimalLevel) : 0);
  }

  $scope.toggleHideAncient = function (ancient){
    ancient.hide = true
  }

  $scope.hideAncient = function (anc){

    if($scope.playstyle.toLowerCase() == 'idle') {

      if(anc.clicking) {

        return true
      }
    }

    if(anc.hide) {

      return true
    }

    if(anc.maxLevel > 0) {

      if(anc.levelOld == anc.maxLevel) {

        return true
      } else {

        return false
      }
    }
  }

  $scope.$watch('anc', function (){
    console.log($scope.playstyle);
  }, true)

  $scope.about = function (){
    $ionicModal.fromTemplateUrl('aboutModal.html', {
      scope : $scope,
      animation : 'slide-in-up'
    }).then(function (modal){
        $scope.modal = modal

        $scope.modal.show()
    })
  }

  $scope.closeModal = function (){
      $scope.modal.hide()
  }

  $scope.optimize = function (){
    var Bank = $scope.anc[0];
    var Siya = $scope.anc[5];  
    var Argaiv = $scope.anc[28];
    var Iris = $scope.anc[30]; 

    playstyle = $scope.playstyle
    var clicking = playstyle != 'idle';
    var ignoreIris = $scope.ignoreIris
    laxSolomon = $scope.ezSolomon
    irisBonus = $scope.startingZone

    // TODO, enable this to next version
    // if($('#noBossLanding').is(':checked'))  {
    //   irisBonus++;
    // }

    // reset cost and get the user input values to work with
    for(key in $scope.anc) {
      var ancient = $scope.anc[key];

      ancient.totalCost = 0;
      // ancient.levelOld = parseInt($('#old'+key).val());
      ancient.levelNew = ancient.levelOld;
    }

    $scope.hasMorgulis = $scope.anc[16].levelOld > 0;

    var upgradeNext;
    var referenceLevel;

    while(upgradeNext != 0) {
      // optimize loop ends when the best investment is the HS bank
      upgradeNext = 0;
      var highestIncrease = 0;
      var nextCost = 0;
      var nextBestIncrease = 0;
      referenceLevel = Math.max(playstyle=='active' ? Argaiv.levelNew : Siya.levelNew, 1);
      var desiredBank = Math.ceil(Bank.levelNew-Bank.desiredLevel(referenceLevel));
      var nextBank = Math.ceil(Bank.levelNew-Bank.desiredLevel(referenceLevel+1));

      for(key in $scope.anc) {
        var ancient = $scope.anc[key];
        var optimal = $scope.getOptimal(ancient, referenceLevel);
        if(ancient.levelNew > 0 && optimal > ancient.levelNew && (clicking == true || ancient.clicking == false) && (ignoreIris == false || key != 30)) {
          // Do not process ancients the user doesn't have.
          // Do not process clicking ancients when clicking checkbox is off.
          // Do not process Iris if disabled.

          var upgradeCost = ancient.upgradeCost(ancient.levelNew+1);

          if(upgradeCost <= (key==5 || key==28 ? nextBank : desiredBank)) { // always keep the desired soulbank, do not spend below this
            // determine the ancient that is lagging behind the most (biggest relative increase from current to optimal)
            var increase = (optimal-ancient.levelNew) / ancient.levelNew;
            
            // assign less weight to Siya/Arga to let other ancients catch up first, only upgrade when no other ancients to upgrade
            if(playstyle == 'active' && key == 28)  {
              increase *= 0.1;
            }
            else if(playstyle != 'active' && key == 5)  {
              increase *= 0.1;
            }

            if(increase > highestIncrease)  {
              upgradeNext = key;
              nextBestIncrease = highestIncrease;
              highestIncrease = increase;
              nextCost = upgradeCost;
            }
          }
        }
      }
      if(upgradeNext != 0)  {
        var ancient = $scope.anc[upgradeNext];
        if(upgradeNext == 16) {
          // Morg batch upgrade!
          var morgPlus = Math.min(Math.ceil((highestIncrease - nextBestIncrease)*ancient.levelNew), Bank.levelNew);
          ancient.totalCost += morgPlus;
          ancient.levelNew += morgPlus;
          Bank.levelNew -= morgPlus;
        }
        else  {
          ancient.totalCost += nextCost;
          ancient.levelNew++;
          Bank.levelNew -= nextCost;
        }
      }
    }

    // correct for Iris not landing on the desired zone
    if(Iris.levelNew > Iris.levelOld && Iris.levelNew != Iris.desiredLevel(referenceLevel)) {
      $scope.irisMax = Math.floor((Iris.levelNew)/5)*5-1-irisBonus;
      $scope.optimize();
      return;
    }
    else  {
      $scope.irisMax = 0;
    }

    console.log($scope.anc);
  }

  $scope.toggleIncludeSoulAfterAscension = function (){
    $scope.includeSoulAfterAscension = !$scope.includeSoulAfterAscension
  }

  $scope.toggleIgnoreIris = function (){
    $scope.ignoreIris = !$scope.ignoreIris
  }

  $scope.toggleEzSolomon = function (){
    $scope.ezSolomon = !$scope.ezSolomon
  }

  $scope.playstyleChanged = function (value){
    
    var playstyle = R.replace(/string:/g, '', angular.element(document.getElementById('playstyle')).val())

    $scope.playstyle = playstyle
  }

}])
