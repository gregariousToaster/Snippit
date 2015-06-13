'use strict';

// var isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
// var isChrome = !!window.chrome && !isOpera;              // Chrome 1+

angular.module('snippit', ['snippit.main',
  'snippit.services',
  'snippit.snips',
  'snippit.three',
  'snippit.auth',
  'snippit.mobile',
  'snippit.profile',
  'ui.router'
  ])
  // This run block checks whether the user is authenticated or not by making
  // a get request to the '/auth/isAuthenticated' route and upon a successful
  // request, checks the response to see if the user is authenticated and
  // redirects them to the 'signin' state if they're not authenticated. This
  // happens on any state change.
  .run(['$rootScope', '$location', '$http', '$window', function($rootScope, $location, $http, $window) {

    $rootScope.bool = {};



    
    $rootScope.$on('$stateChangeStart', function(e, toState) {
    var check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})($window.navigator.userAgent||$window.navigator.vendor||$window.opera);
      if (toState && toState.authenticate) {
        $http.get('/auth/isAuthenticated').success(function(resp) {
          if (!resp.auth) {
            $location.path('/signin');
          } else if (check) {
            setTimeout(function() {
              $location.path('/mobile');
            });
          }else if(!window.chrome){
            setTimeout(function() {
              $location.path('/chrome');
            });
          }
        });
      }
    });
  }])
  // Configures the various states for the application.
  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('app', {
        url: '/app',
        templateUrl: 'templates/main.html',
        controller: 'MainController',
        authenticate: true
      })
      .state('three', {
        url: '/three/{snipId}',
        templateUrl: 'templates/three.html',
        controller: 'ThreeController',
      })
      .state('mobile', {
        url: '/mobile',
        templateUrl: 'templates/mobile.html',
        controller: 'MobileController',
        authenticate: true
      })
      .state('app.three', {
        url: '/three',
        views: {
          'content': {
            templateUrl: 'templates/three.html',
            controller: 'ThreeController'
          }
        },
        authenticate: true
      })
      .state('app.profile', {
        url: '/profile',
        views: {
          'content': {
            templateUrl: 'templates/profile.html',
            controller: 'ProfileController'
          },
          'snips': {
            templateUrl: 'templates/snips.html',
            controller: 'SnipsController'
          }
        },
        authenticate: true
      })
      .state('signin', {
        url: '/signin',
        templateUrl: 'templates/signin.html',
        controller: 'AuthController',
      })
      .state('chrome', {
        url: '/chrome',
        templateUrl: 'templates/getchrome.html',
        controller: 'AuthController',
      })
      .state('privacy', {
        url: '/privacy',
        templateUrl: 'templates/privacy.html',
        controller: 'MainController',
      })
      .state('terms', {
        url: '/terms',
        templateUrl: 'templates/terms.html',
        controller: 'MainController',
      });
    // If a requested state is invalid, it will redirect to the three state
    $urlRouterProvider.otherwise('/app/three');
  }]);


'use strict';

angular.module('snippit.albums', ['snippit'])
  .controller('AlbumsController', ['$rootScope', '$scope', 'Facebook', '$window', 'Snips', '$http', function($rootScope, $scope, Facebook, $window, Snips, $http) {

    $rootScope.bool.profile = true;

    // Invoke Facebook getFacebook user method, on success, assign
    // $scope.facebookUser to that response (Facebook name and id).
    $scope.fetchUser = function() {
      Snips.getSnips($rootScope.facebookUser.snips).success(function(resp) {
        $scope.snips = resp;
      });
    };

    // Check if there any items in $scope.snipPhotos to determine
    // whether or not we should show the snip sidebar on the right.
    // If there are no photos in that object, it means that we haven't
    // selected any images to add to our snip or there are no existing
    // photos in an existing snip.
    $scope.snipCheck = function(){
      return !!Object.keys($scope.snipPhotos).length;
    };

    // Call Snips' getSnips method, upon success, responds with
    // a resp object that's an array, which we loop over and set
    // as values on the $scope.snips object. This allows the user
    // to see the snips that they've created.
    $scope.fetchSnips = function(){
      Snips.getSnips().success(function(resp) {
        for (var i = 0; i < resp.length; i++) {
          $scope.snips[resp[i]._id] = {
            name: resp[i].name,
            img: resp[i].img
          }
        }
      })
    }

    // Adds a clicked photo to the snipPhotos object, which consists of
    // the picture ID as the key, the link, thumbnail, and position of
    // the photo (within the snippit) for the values.
    $scope.addPhoto = function(id, pic) {

      var pos = Object.keys($rootScope.snipPhotos).length;
      $rootScope.snipPhotos[id] = {
        src: pic.src,
        thumb: pic.thumb,
        position: pos
      };

      $rootScope.snipOpen = true;

    };
  }]);

'use strict';

angular.module('snippit.auth', ['snippit'])
  .controller('AuthController', ['$scope', '$window', 'ThreeFactory', function($scope, $window, ThreeFactory) {
    //This page is a modified version of the ThreeJS we are using for the main page
    var scene, renderer, camera;
    //this is the t-value used to rotate the camera about the pictosphere
    var timer = 0;

    var picData = [ 'https://scontent.xx.fbcdn.net/hphotos-xat1/v/t1.0-9/s130x130/11401564_10154130458277699_6291014796371703568_n.jpg?oh=639b4c986482b9268b3410228b0e604b&oe=5601134F','https://scontent.xx.fbcdn.net/hphotos-xft1/v/t1.0-9/s130x130/11406441_10100137109994284_6568979517347833907_n.jpg?oh=89ab67a9ba159e256e8e5f4bef04f619&oe=56334DA6','https://scontent.xx.fbcdn.net/hphotos-xfa1/v/t1.0-9/p130x130/17094_10100130211434054_7522953371122654541_n.jpg?oh=632803872ed186ede6abce3c24d20871&oe=5634A28E','https://scontent.xx.fbcdn.net/hphotos-xat1/v/t1.0-9/s130x130/1526696_10100110933157874_6495217828427679151_n.jpg?oh=cad6830dc77acccc2190ae21ad7d8328&oe=55FC1D74','https://scontent.xx.fbcdn.net/hphotos-xpf1/v/t1.0-9/s130x130/11070772_10100109531876054_6233025863672254424_n.jpg?oh=00e9e36d0d8c9013066489acc8ba752a&oe=55F5C1FB','https://scontent.xx.fbcdn.net/hphotos-xtp1/v/t1.0-9/q84/s130x130/11072054_10100109531846114_4730711812291324474_n.jpg?oh=93f22cc9ce6bee336e231fe6e93b5f6a&oe=5607B969','https://scontent.xx.fbcdn.net/hphotos-xpa1/v/t1.0-9/s130x130/11088392_10100109531836134_2588135265112061142_n.jpg?oh=08327d2c53b53d3ddd69b72d2a0f6602&oe=55F89795','https://scontent.xx.fbcdn.net/hphotos-xfp1/v/t1.0-9/s130x130/10989180_10100109531796214_8870754626184990843_n.jpg?oh=cbcfed4f8634c3e8100c9b229762bd97&oe=55FCEBD7','https://scontent.xx.fbcdn.net/hphotos-xpt1/v/t1.0-9/p130x130/10429843_10155276701370548_118642705501501062_n.jpg?oh=404c398a547c1b1be61a89ca208c5388&oe=55EE7101','https://scontent.xx.fbcdn.net/hphotos-xpa1/v/t1.0-9/s130x130/11050159_10155270933075548_1580365873096218574_n.jpg?oh=634a1e6b32c88dcd0364f8631719697b&oe=56034FD8','https://scontent.xx.fbcdn.net/hphotos-xaf1/v/t1.0-9/p130x130/11043024_10100102466924274_6347309651814937960_n.jpg?oh=1054aa5e67a3343fd177640d3d59aa10&oe=5604E117','https://scontent.xx.fbcdn.net/hphotos-xpf1/v/t1.0-9/q83/s130x130/984280_10100102466430264_2835255831581538953_n.jpg?oh=5bacbb737fd053c3190c4cbcee5dc30a&oe=55FA397F','https://scontent.xx.fbcdn.net/hphotos-xfp1/v/t1.0-9/s130x130/10929912_10100102466365394_7807849188340959483_n.jpg?oh=f9c8fa1be19ea9f598f999cc3e0e0ba4&oe=55E9E276','https://scontent.xx.fbcdn.net/hphotos-xfp1/v/t1.0-9/s130x130/10451696_10100102466350424_3574730155440154285_n.jpg?oh=fff618784f6c26472edf91b323eb208c&oe=55FC71D8','https://scontent.xx.fbcdn.net/hphotos-xat1/v/t1.0-9/q81/s130x130/11051990_10100102466320484_2040102741965745731_n.jpg?oh=21c8a1c5b3bd960311edd88e620be223&oe=560715FA','https://scontent.xx.fbcdn.net/hphotos-xfp1/v/t1.0-9/s130x130/11014682_10100102466155814_6647163493268779482_n.jpg?oh=2c32037682b7eac054ae69c9573697fe&oe=55EA1543','https://scontent.xx.fbcdn.net/hphotos-xta1/v/t1.0-9/s130x130/65081_10100102466135854_2323018283512936_n.jpg?oh=b5beac78ff140684902a9091d796f23b&oe=55EE92A7','https://scontent.xx.fbcdn.net/hphotos-xpa1/v/t1.0-9/s130x130/11030845_10100102465242644_7300578202020165387_n.jpg?oh=43542ae2bcfa5e600182f7a33256d9d8&oe=55FF741B','https://scontent.xx.fbcdn.net/hphotos-xta1/v/t1.0-9/s130x130/10480218_10100102465147834_150391231580322642_n.jpg?oh=b997ea1d6daaacfe484bbc7b852b8a39&oe=55F4C935','https://scontent.xx.fbcdn.net/hphotos-xfa1/v/t1.0-9/s130x130/988891_10100102464793544_533807487995580799_n.jpg?oh=83cae68d7c8bca3fe9118eacc57210d4&oe=55EC3319','https://scontent.xx.fbcdn.net/hphotos-xfp1/v/t1.0-9/s130x130/11045025_10100102464673784_1063017909182729261_n.jpg?oh=e9d7a1c5489b47c655044f0b24ff07dd&oe=55FDC911','https://scontent.xx.fbcdn.net/hphotos-xfp1/v/t1.0-9/s130x130/11046912_10100102464583964_841156809927587164_n.jpg?oh=e748a6f4f86390925a2c0da3a0742507&oe=55ED4B25','https://scontent.xx.fbcdn.net/hphotos-xpf1/v/t1.0-9/s130x130/11014814_10100102464199734_8864180505231770208_n.jpg?oh=74a9a6871367ec61102630d1c887a19d&oe=560A3A05','https://scontent.xx.fbcdn.net/hphotos-xtp1/v/t1.0-9/s130x130/11050828_10100102464065004_6830515980688871782_n.jpg?oh=ae945f92fde00c421785d5a7f4646a17&oe=55ECDA09','https://scontent.xx.fbcdn.net/hphotos-xpf1/v/t1.0-9/s130x130/11000197_10100102464040054_3539373083836250019_n.jpg?oh=62904417fd538a36ebca7adc8f68b717&oe=56334195','https://scontent.xx.fbcdn.net/hphotos-xap1/v/t1.0-9/s130x130/11046667_10100102447488224_3219125397633764721_n.jpg?oh=6768b8ee5760606956f2fb540b780a58&oe=55EF4C86','https://scontent.xx.fbcdn.net/hphotos-xpa1/v/t1.0-9/s130x130/11021062_10100102447483234_2586135459587165025_n.jpg?oh=3442c2709a5ddd503e9f6c4f0444b5b7&oe=55F736CB','https://scontent.xx.fbcdn.net/hphotos-xfp1/v/t1.0-9/s130x130/11035460_10100102440147934_9007811342969521889_n.jpg?oh=b70ca7957639943757b4ce4d54d80578&oe=55F8444E','https://scontent.xx.fbcdn.net/hphotos-xap1/v/t1.0-9/s130x130/11056566_10100102440078074_3136732092269891526_n.jpg?oh=f903ee301a696c6c160670334e8b192f&oe=55F324F6','https://scontent.xx.fbcdn.net/hphotos-xpf1/v/t1.0-9/s130x130/10391410_10100102440073084_5616611337927755917_n.jpg?oh=c8e77e905b6a011f2fa546acf5ff2067&oe=56091D93','https://scontent.xx.fbcdn.net/hphotos-xfp1/v/t1.0-9/s130x130/10429446_10100102437233774_2137687365196212842_n.jpg?oh=c4f30e49e2251c9495fae6d8188840bc&oe=55F8ABCF','https://scontent.xx.fbcdn.net/hphotos-xfp1/v/t1.0-9/s130x130/11046336_10100102437193854_2605798891078856154_n.jpg?oh=e0ead2210162e1c54b3ca982df333fdd&oe=5607392A','https://scontent.xx.fbcdn.net/hphotos-xat1/v/t1.0-9/s130x130/11038866_10100102437178884_3748424588188468608_n.jpg?oh=39704c2459e89d7d763082dcadb80140&oe=56049ED1','https://scontent.xx.fbcdn.net/hphotos-xpf1/v/t1.0-9/s130x130/11036073_10100102437099044_1131027299017214835_n.jpg?oh=60b033a51ca97bad62e6fa08cb80a1c8&oe=55F56ECA','https://scontent.xx.fbcdn.net/hphotos-xpa1/v/t1.0-9/s130x130/11043170_10100102437049144_5525606662286676689_n.jpg?oh=4c8088abac70c40cb51cce8181f14545&oe=5600CDBD','https://scontent.xx.fbcdn.net/hphotos-xpf1/v/t1.0-9/s130x130/988944_10100102436814614_422100719413871982_n.jpg?oh=53f740e8f35a5fec6b7568eb180a824c&oe=55FC32F1','https://scontent.xx.fbcdn.net/hphotos-xpf1/v/t1.0-9/s130x130/10390888_10100102436684874_1741737700716854255_n.jpg?oh=0b58b3c3e6c6f6fc36255d741e038a55&oe=56335D50','https://scontent.xx.fbcdn.net/hphotos-xfp1/v/t1.0-9/s130x130/11034912_10100102436664914_4372919989578233634_n.jpg?oh=9c95520b57f2e11b9e5b564d58efe8d1&oe=55EDEC49','https://scontent.xx.fbcdn.net/hphotos-xpf1/v/t1.0-9/s130x130/11053129_10100102436540164_6029543602355410554_n.jpg?oh=76511eb9d194e9b4e381d8f108c0575a&oe=55FEAE8A','https://scontent.xx.fbcdn.net/hphotos-xfp1/v/t1.0-9/s130x130/11057459_10100102436525194_6104062443090110290_n.jpg?oh=9acedfd7977e7f38b6b09aad40289adb&oe=56333E67','https://scontent.xx.fbcdn.net/hphotos-xfa1/v/t1.0-9/s130x130/10368191_10100102436405434_1983498337930045099_n.jpg?oh=84f06c35c5c2a67253d597f049e6558e&oe=55F589B6','https://scontent.xx.fbcdn.net/hphotos-xaf1/v/t1.0-9/s130x130/1907454_10100102436395454_3796584843808201005_n.jpg?oh=b7d14cda9e61fe3cc369661566068193&oe=56000D0B','https://scontent.xx.fbcdn.net/hphotos-xpa1/v/t1.0-9/s130x130/10384930_10100102436375494_1482798762812153438_n.jpg?oh=80402969963ba9405970a3f91783d85a&oe=55FEF3D4','https://scontent.xx.fbcdn.net/hphotos-xtp1/v/t1.0-9/s130x130/10425127_10100102436260724_822525530263642129_n.jpg?oh=2ae655ce4537cefed43cd27d2395353f&oe=55ED67CA','https://scontent.xx.fbcdn.net/hphotos-xaf1/v/t1.0-9/s130x130/11024622_10100102436255734_4535545406319420985_n.jpg?oh=5d8169ed14c6a57cc04918e8cab47e09&oe=55F7D4C7','https://scontent.xx.fbcdn.net/hphotos-xta1/v/t1.0-9/s130x130/17890_10100102436185874_9058044526901435870_n.jpg?oh=feb19bd3c8572a256afed40652362156&oe=5609369C','https://scontent.xx.fbcdn.net/hphotos-xfp1/v/t1.0-9/s130x130/10403100_10100102436106034_8069463497457066358_n.jpg?oh=df71e1f2e0ac5845f16f3dc88388541b&oe=55E69C90','https://scontent.xx.fbcdn.net/hphotos-xfp1/v/t1.0-9/q81/s130x130/11046894_10100102436091064_1320869208976564328_n.jpg?oh=1412f79368e6771dfda8e924bb29f616&oe=55F777C1','https://scontent.xx.fbcdn.net/hphotos-xpa1/v/t1.0-9/s130x130/984279_10100102434778694_7026418720781178914_n.jpg?oh=4e537a0f4886cbf67e3296ab169de6f9&oe=5603C3A6','https://scontent.xx.fbcdn.net/hphotos-xap1/v/t1.0-9/s130x130/11053429_10100102434758734_6923951579301743642_n.jpg?oh=929e2575b7122cca0db9ffeef72683b3&oe=5633CD35','https://scontent.xx.fbcdn.net/hphotos-xpf1/v/t1.0-9/s130x130/10996511_10100102434713824_5594204633570969157_n.jpg?oh=1638769bc6ac2f8e45fcebe4f1bbe2b6&oe=55F65545','https://scontent.xx.fbcdn.net/hphotos-xat1/v/t1.0-9/s130x130/17890_10100102434638974_5540366797377374269_n.jpg?oh=9cc2bd41d8bcbb8aa265b4eeab858262&oe=55E8D584','https://scontent.xx.fbcdn.net/hphotos-xfp1/v/t1.0-9/s130x130/10471235_10100102434244764_5370910842818552167_n.jpg?oh=b15f76f29f15fdf362f2ef26a94233f2&oe=55F1F09B','https://scontent.xx.fbcdn.net/hphotos-xfp1/v/t1.0-9/q83/s130x130/11025222_10100102434199854_6199413082631353151_n.jpg?oh=fd56daf994f802496315a10d4f73d584&oe=55ECABB5','https://scontent.xx.fbcdn.net/hphotos-xfp1/v/t1.0-9/s130x130/8984_984482673684_1930134400343939761_n.jpg?oh=5fd73c4637207977333d4b4a08ebaa8e&oe=55F2BF31','https://scontent.xx.fbcdn.net/hphotos-xap1/v/t1.0-9/s130x130/10846407_977080258184_857181441979341297_n.jpg?oh=3ed60c4ac5792f600f967eeba6919802&oe=55EE8D3E','https://scontent.xx.fbcdn.net/hphotos-xfa1/v/t1.0-9/s130x130/10354958_10101393304513678_4796627751119406526_n.jpg?oh=b569431cf9b99005dc31fc3d039437eb&oe=55EF26C0','https://scontent.xx.fbcdn.net/hphotos-xft1/v/t1.0-9/s130x130/10357179_10152769104209885_2340204445901437910_n.jpg?oh=db8270cb441d570086f7421e9439e111&oe=56348A6C','https://scontent.xx.fbcdn.net/hphotos-xpa1/v/t1.0-9/s130x130/10649703_952110941894_520116242542042213_n.jpg?oh=a1ed8e2c42fed01a00338f740e399707&oe=55ED352E','https://scontent.xx.fbcdn.net/hphotos-xat1/v/t1.0-9/s130x130/15771_10204724486769048_7097466286149190138_n.jpg?oh=dbbe5e8fd0196e1191ecd12ee12a944b&oe=56088BEA','https://scontent.xx.fbcdn.net/hphotos-xfp1/v/t1.0-9/s130x130/10606421_950640324024_215562949003464945_n.jpg?oh=8904a8ca9e577b454359275382135c4a&oe=560821DD','https://scontent.xx.fbcdn.net/hphotos-xap1/v/t1.0-9/q81/s130x130/10347713_950640314044_187909776637109523_n.jpg?oh=1f6ae182df4736684154e78e2bb33cfe&oe=55EEE698','https://scontent.xx.fbcdn.net/hphotos-xpa1/v/t1.0-9/s130x130/10678839_950639106464_6651948656536613950_n.jpg?oh=cc3a48ec899a42f663893466d1e5d42f&oe=55EBDCAD','https://scontent.xx.fbcdn.net/hphotos-xta1/,.0-9/s130x130/10710788_950639066544_639476634036950647_n.jpg?oh=48a53134efcaba55b33ca1293d5f1228&oe=55EB4ED3','https://scontent.xx.fbcdn.net/hphotos-xfa1/v/t1.0-9/s130x130/10672240_950639041594_2610656442619809234_n.jpg?oh=daadec3192e8e78506fd361522b29f94&oe=5605AB91','https://scontent.xx.fbcdn.net/hphotos-xfa1/v/t1.0-9/s130x130/10653706_947494932414_12070718868216396_n.jpg?oh=b23e5b6bf66e7778103322a4d83f9cf6&oe=56094427','https://scontent.xx.fbcdn.net/hphotos-xpa1/v/t1.0-9/q85/s130x130/10614099_10103372081932678_3877292901713866395_n.jpg?oh=65ddd06bdabbfe738af3559a01e50650&oe=5633A248','https://scontent.xx.fbcdn.net/hphotos-xfa1/v/t1.0-9/p130x130/10665700_10153162923298136_7647136477153466125_n.jpg?oh=3b6c92d7ebd5348fbdb794948f38af05&oe=55EF1FF4','https://scontent.xx.fbcdn.net/hphotos-xpf1/v/t1.0-9/q82/s130x130/10397817_943035045064_1317206357559938672_n.jpg?oh=ba1f595bc65a443ffbebfb0a3f6d951d&oe=563338EC','https://scontent.xx.fbcdn.net/hphotos-xfa1/v/t1.0-9/s130x130/10653378_943035000154_7014530606347678326_n.jpg?oh=cb98512da433fd5635501392a4a5bc6a&oe=560328D1','https://scontent.xx.fbcdn.net/hphotos-xft1/v/t1.0-9/s130x130/10583838_943034920314_1367185597142507432_n.jpg?oh=861cd81dd845599151a478ddecac3693&oe=55FA3BA1','https://scontent.xx.fbcdn.net/hphotos-xfa1/v/t1.0-9/s130x130/10409657_943033892374_1550126412657556637_n.jpg?oh=34b96ee5cc1ae00bcc6e9da6d898d1bf&oe=55E9C68A','https://scontent.xx.fbcdn.net/hphotos-xpa1/v/t1.0-9/s130x130/1609959_943033802554_8518935623389539937_n.jpg?oh=403df3a93bbafcf841aaff61073960d2&oe=5608D91D','https://scontent.xx.fbcdn.net/hphotos-xpf1/v/t1.0-9/s130x130/10612971_943033727704_8333699391650007396_n.jpg?oh=b5de317527694582987da30c6fb420d0&oe=56009D29','https://scontent.xx.fbcdn.net/hphotos-xfp1/v/t1.0-9/s130x130/10171210_943033672814_842265849479643592_n.jpg?oh=31b12d73c161a59e5de25006f13295f7&oe=5608D783','https://scontent.xx.fbcdn.net/hphotos-xap1/v/t1.0-9/s130x130/10474669_943033622914_2102232003542384015_n.jpg?oh=6b4b16ed3031b9d31e5f855c9d90164f&oe=56344BD0','https://scontent.xx.fbcdn.net/hphotos-xfa1/v/t1.0-9/s130x130/10592839_10152564397861609_2502089971608771118_n.jpg?oh=4f3088b7bb5f8476689280f447e5e223&oe=56030F43','https://scontent.xx.fbcdn.net/hphotos-xat1/v/t1.0-9/s130x130/10590544_10153083615168136_6097687612997085477_n.jpg?oh=e17788401ee0191184d97d48ea9337e0&oe=55E78703','https://scontent.xx.fbcdn.net/hphotos-xfa1/v/t1.0-9/s130x130/10469392_10202769463217056_1300745213486905955_n.jpg?oh=9967700cc5d20496ac79f1a9540ee62b&oe=560A7F34','https://scontent.xx.fbcdn.net/hphotos-xpa1/v/t1.0-9/s130x130/10514588_10100954005956339_3107454238890409876_n.jpg?oh=e41f12b9ed1852d6ee01bb3d50c52820&oe=55FF9289','https://scontent.xx.fbcdn.net/hphotos-xaf1/v/t1.0-9/s130x130/10494708_10100954005796659_3300549213879036629_n.jpg?oh=a58fb51e7a887becaf16a6f8441b1b68&oe=55F821FC','https://scontent.xx.fbcdn.net/hphotos-xfa1/v/t1.0-9/s130x130/10569058_10100954005751749_6329567579227798593_n.jpg?oh=3c990881c0c54dbb4cf034f6a9240d9f&oe=55F214E4','https://scontent.xx.fbcdn.net/hphotos-xpa1/v/t1.0-9/s130x130/10458550_10100954005542169_5074863389028515055_n.jpg?oh=7d0ed46f99e9eb746034ea1f96bd926a&oe=55F8B33C','https://scontent.xx.fbcdn.net/hphotos-xap1/v/t1.0-9/s130x130/10505523_10100954005447359_7999282866920858789_n.jpg?oh=0dfb5f72d6efac265c5cb42e8317b726&oe=56018880','https://scontent.xx.fbcdn.net/hphotos-xpt1/v/t34.0-12/s130x130/10524794_10204335980583797_539684836_n.jpg?oh=7c25014ded87309667c1815e0b5118fd&oe=5574CFAD','https://scontent.xx.fbcdn.net/hphotos-xpa1/v/t1.0-9/s130x130/1977225_10154330428800203_7967838402647053302_n.jpg?oh=db6ff49dbf798360682c649bdba3e093&oe=55E97174','https://scontent.xx.fbcdn.net/hphotos-xft1/v/t34.0-12/s130x130/10537739_10204337709867028_1348429231_n.jpg?oh=8fe6fc3c6b2f76b0456792c8c5618297&oe=5574A9C3','https://scontent.xx.fbcdn.net/hphotos-xpa1/v/t1.0-9/s130x130/10391002_10204343493171607_6615089876237581307_n.jpg?oh=88b7c32b3e398fc7e3b4f5954bb35cac&oe=55EEB218','https://scontent.xx.fbcdn.net/hphotos-xpf1/v/t34.0-12/s130x130/10544851_10204337676746200_256858444_n.jpg?oh=bd049df1f4994b939405872fd534c4d8&oe=5574D9CF','https://scontent.xx.fbcdn.net/hphotos-xpf1/v/t34.0-12/s130x130/10522393_10204337367418467_2003754140_n.jpg?oh=e2e6cf79e40d57630789175e9c40a9a1&oe=55748941','https://scontent.xx.fbcdn.net/hphotos-xpf1/v/t34.0-12/s130x130/10534142_10204337368178486_1017269358_n.jpg?oh=4607e0acf3e074dc82798c5bb6668ce2&oe=5574BF0A','https://scontent.xx.fbcdn.net/hphotos-xpf1/v/t34.0-12/s130x130/10536852_10204337375578671_1724422594_n.jpg?oh=21f579aafb93290103865c72bec07f88&oe=55745F65','https://scontent.xx.fbcdn.net/hphotos-xpf1/v/t34.0-12/s130x130/10518891_10204329543462873_212052999_n.jpg?oh=69d0b62f4bad788f265131d1ce67f5e5&oe=5574805B','https://scontent.xx.fbcdn.net/hphotos-xpf1/v/t34.0-12/s130x130/10529489_10204337266335940_2517131_n.jpg?oh=4a7e440a42cf07d863ca1f645acff941&oe=5574C9FA','https://scontent.xx.fbcdn.net/hphotos-xtf1/v/t1.0-9/s130x130/1937440_10153020675573136_8890801464318195407_n.jpg?oh=2549554b463cfd619e1fc9178714943d&oe=56069A22','https://scontent.xx.fbcdn.net/hphotos-xtf1/v/t1.0-9/s130x130/10433944_10204332222209840_4029362237681334259_n.jpg?oh=1b439d39ff4252999897da45928998c0&oe=5600A6C5','https://scontent.xx.fbcdn.net/hphotos-xfp1/v/t1.0-9/s130x130/10524674_10153004839468136_4050488587212283855_n.jpg?oh=908d47d464155c4591917c7d3bf7020b&oe=5604986A','https://scontent.xx.fbcdn.net/hphotos-xpt1/v/t1.0-9/s130x130/10411951_10152979247903136_7048468561325323248_n.jpg?oh=b3b5c5cfba7e75538145d840d9c6fa76&oe=56016278','https://scontent.xx.fbcdn.net/hphotos-xfa1/v/t1.0-9/s130x130/10397829_720941721300632_5444006857557624624_n.jpg?oh=0892a89b1a84ed7c469214828db8de6a&oe=55FE60BE','https://scontent.xx.fbcdn.net/hphotos-xfp1/v/t1.0-9/p130x130/10441261_10152922780933136_2475041029046876870_n.jpg?oh=adac5d6f5098602c46ed91271b3e882a&oe=55FF6D45' ]

    $scope.objects = [];
    $scope.targets = {sphere: []};

    var init = function() {
      camera = new THREE.PerspectiveCamera(30, $window.innerWidth / $window.innerHeight, 1, 10000);
      camera.position.z = 3000;
      scene = new THREE.Scene();

      var vector = new THREE.Vector3();
      var len = 60;

      for (var i = 0; i < len; i++) {
        ThreeFactory.createObject(i, picData, scene, $scope.objects);
        ThreeFactory.sphere(i, vector, $scope.targets.sphere, 800, len);
      }


      renderer = new THREE.CSS3DRenderer();
      renderer.setSize($window.innerWidth, $window.innerHeight);
      renderer.domElement.style.position = 'absolute';
      renderer.domElement.classList.add('authRender');

      $scope.transform($scope.targets.sphere, 2000);

      document.getElementById('signin').appendChild(renderer.domElement);
      window.addEventListener('resize', onWindowResize, false);
    };

    $scope.transform = function(targets, duration) {
      //On every transform, begin by cancelling all tweens currently in progress
      TWEEN.removeAll();

      for (var i = 0; i < $scope.objects.length; i++) {
        var object = $scope.objects[i];
        var target = targets[i];

        new TWEEN.Tween(object.position)
          .to({x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration * 10 + duration + 3000)
          .easing(TWEEN.Easing.Exponential.InOut)
          .start();

        new TWEEN.Tween(object.rotation)
          .to({x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration * 10 + duration + 3000)
          .easing(TWEEN.Easing.Exponential.InOut)
          .start();
      }

      new TWEEN.Tween(this)
        .to({}, duration * 5)
        .onUpdate($scope.render)
        .start();
    };


    var onWindowResize = function() {

      camera.aspect = window.innerWidth / $window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(window.innerWidth, $window.innerHeight);

      $scope.render();
    };


    var animate = function() {
      requestAnimationFrame(animate);
      TWEEN.update();
      //Slowly increment the timer, and use its value to move the
      //camera around the pictosphere in a circle 3000px from the
      //center at (0,0,0)
      timer += 0.001;
      camera.position.x = 3000 * Math.sin(timer);
      camera.position.z = 3000 * Math.cos(timer);

      /* camera.position.y = 3000 * Math.cos(timer * 3); */

      camera.up = new THREE.Vector3(0, 1, 0);
      //and every frame, point the camera at the center of the sphere again
      camera.lookAt(new THREE.Vector3(0, 0, 0));
      $scope.render();
    };

    angular.element(document).ready(function() {
      init();
      animate();
    });

    $scope.render = function() {
      renderer.render(scene, camera);
    };
  }]);
'use strict';

angular.module('snippit.main', ['snippit', 'snippit.services'])
  .controller('MainController', ['$rootScope', '$scope', 'Facebook', 'Snips', '$state', function($rootScope, $scope, Facebook, Snips, $state) {

    $rootScope.bool.info = false;

    $rootScope.facebookUser = {};

    $rootScope.loading = false;

    $rootScope.newSnip = true;

    $scope.tab = 1;

    $rootScope.snips = {};

    $scope.albumNames = [];

    $rootScope.snipPhotos = {};

    $scope.showTab = function(n) {
      $scope.tab = n;
    };

    $scope.fetchUser = function() {
      Facebook.getFacebookUser().success(function(resp) {
        $rootScope.facebookUser = resp;
        $scope.instaAuth = !!resp.hasToken;
        Snips.getSnips(resp.snips).success(function(resp) {
          $rootScope.snips = JSON.parse(resp);
        })
      });
    };

    $scope.albumClick = function(name, id) {
      $rootScope.albumName = name;
      $rootScope.loading = true;
      $rootScope.albumPhotos = {};
      if(!id){
        Facebook.refreshWallData().success(function(resp){
          var pics = JSON.parse(resp).wallPhotos;
          for (var i = 0; i < pics.picture.length;i++){
            $rootScope.loading = false;
            $rootScope.albumPhotos[pics.id[i]] = {src: pics.picture[i], thumb: pics.thumbnail[i]}
          }
        });
      } else {
        Facebook.getAlbumPhotos(name, id).success(function(resp) {
          var parse = JSON.parse(resp);
            for(var key in parse) {
              $rootScope.loading = false;
              $rootScope.albumPhotos = parse[key];
            }
        });
      }
      if($state.current.name !== 'app.profile') {
        $rootScope.newSnip = true;
        $rootScope.snipPhotos = {};
        $state.go('^.profile');
      }
    };

    $scope.getInstagram = function(){
      $rootScope.loading = true;
      $rootScope.albumPhotos = {};
      Facebook.getInstagram().success(function(resp) {
        $rootScope.albumPhotos = JSON.parse(resp);
        $rootScope.loading = false;
      }).error(function(data){
        console.log('Please re-authorize your Instagram', data);
        $rootScope.instaAuth = false;
      });
      if($state.current.name !== 'app.profile') {
        $rootScope.snipPhotos = {};
        $state.go('^.profile');
      }
    }

    $scope.view2D = function(key, value) {
      $rootScope.snipId = key;
      $rootScope.snipPhotos = value.img;
      $rootScope.newSnip = false;
      $rootScope.snipName = value.name;
      $rootScope.snipOpen = true;
      if($state.current.name !== 'app.profile') {
        $state.go('^.profile');
      }
    };

    $scope.view3D = function(key, value) {
      $rootScope.snipPhotos = value.img;
      $rootScope.snipId = key;
      $rootScope.newSnip = true;
      $scope.snipName = value.name;
      $rootScope.snipOpen = false;
      if($state.current.name !== 'app.three') {
        $state.go('^.three');
      } else {
        $rootScope.rerender();
      }
    };

    $scope.deleteSnip = function(key) {
      delete $rootScope.snips[key];
      Snips.deleteSnip(key);
    };


    $scope.init = function() {

      Facebook.getAlbumData().success(function(resp) {
        var parse = JSON.parse(resp);
        $scope.albumNames.push({name:'Facebook Wall Photos'});
        for (var key in parse) {
          $scope.albumNames.push(parse[key]);
        }
      });

      $scope.fetchUser();
      // setTimeout($scope.fetchUser, 4000)
    }();

  }]);


'use strict';

angular.module('snippit.mobile', ['snippit'])
  .controller('MobileController', ['$scope', 'ThreeFactory', '$window', '$document', 'Facebook', 'Snips', '$stateParams', '$rootScope', function($scope, ThreeFactory, $window, $document, Facebook, Snips, $stateParams, $rootScope) {

    // These instantiate the THREE.js scene, renderer, camera, controls, and data.
    var scene, renderer, camera, controls;

    //Setup is a boolean that lets us know not to render the scene until we have
    //the facebook data.
    var setup = false;
    $scope.hiddenMenu = true;


    $scope.showMobileMenu = function() {
      $scope.hiddenMenu = !$scope.hiddenMenu;
    };

    $scope.fetchUser = function() {
      Facebook.getFacebookUser().success(function(resp) {
        $rootScope.facebookUser = resp;
        Snips.getSnips(resp.snips).success(function(resp) {
          $rootScope.snips = JSON.parse(resp);
        });
      });
    };

    $scope.view3D = function(key, value) {
      $rootScope.snipPhotos = value.img;
      $rootScope.snipId = key;
      $scope.hiddenMenu = true;
      $scope.snipName = value.name;
      $scope.rerender();
    };


    $scope.objects = [];
    $scope.targets = {table: [], sphere: [], helix: [], doubleHelix: [], tripleHelix: [], grid: []};
    $scope.targetNames = [['table', 'Table'], ['sphere', 'Sphere'], ['helix', 'Helix'], ['doubleHelix', 'Double Helix'], ['tripleHelix', 'Triple Helix'], ['grid', 'Grid']];

    var prepFb = function(resp) {
      var parsed = JSON.parse(resp.data);

      data = {
        pictures: parsed.wallPhotos.picture,
        thumbnails: parsed.wallPhotos.thumbnail
      };

      return data;
    };

    var prepSnip = function(resp) {
      data = {
        pictures: [],
        thumbnails: []
      }

      for(var key in resp) {
        data.pictures.push(resp[key].src);
        data.thumbnails.push(resp[key].thumb);
      }

      return data;
    };

    var threeJS = function(data) {

      //start the camera zoomed out 1500 from the origin
      camera = new THREE.PerspectiveCamera(30, $window.innerWidth / $window.innerHeight, 1, 10000);
      camera.position.z = 2000;
      scene = new THREE.Scene();

      setup = true;

      var vector = new THREE.Vector3();

      var len = data.thumbnails.length;


      for (var i = 0; i < len; i++) {
        ThreeFactory.createObject(i, data.thumbnails, scene, $scope.objects, $scope.hit);
        ThreeFactory.table(10, i, $scope.targets.table);
        ThreeFactory.sphere(i, vector, $scope.targets.sphere, 800, len);
        ThreeFactory.helix(1, i, vector, $scope.targets.helix, 0.175, 450, 900, 900, 8);
        ThreeFactory.helix(2, i, vector, $scope.targets.doubleHelix, 0.175, 450, 500, 500, 50);
        ThreeFactory.helix(3, i, vector, $scope.targets.tripleHelix, 0.1, 450, 500, 500, 50);
        ThreeFactory.grid(5, i, $scope.targets.grid);
      }

      renderer = new THREE.CSS3DRenderer();
      renderer.setSize($window.innerWidth, $window.innerHeight);
      renderer.domElement.style.position = 'absolute';
      renderer.domElement.classList.add('render');

      $scope.transform($scope.targets.table, 2000);

      document.getElementById('container').appendChild(renderer.domElement);

      window.addEventListener('resize', onWindowResize, false);

      controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.damping = 0.2;
      controls.addEventListener('change', $scope.render);
    };

    // Now checks to see if photos currently exist in the database for
    // this user. If not, it'll fetch them from Facebook, if it does, it'll
    // fetch from MongoDB.
    var init = function(){
      if ($rootScope.snipId) {
        threeJS(prepSnip($rootScope.snipPhotos));
      } else {
        Facebook.getWallData()
          .then(function(resp){
          if (resp.data.bool === 'false') {
            Facebook.refreshWallData()
            .then(function(resp) {
              threeJS(prepFb(resp));
            });
          } else {
            threeJS(prepFb(resp));
          }
        });
      }
    };

    //open a modal fram with a version of the picture when clicked
    $scope.hit = function(){
      Modal.open({
         content: "<div class='imageResize'><img src='" + data.pictures[this] + "' /></div>",
         draggable: false,
         width: 'auto',
         context: this
       });
    };

    //when a new transformatoion begins, move the camera back to its initial position
    $scope.clicked = function(targets){
      $scope.transform(targets, 2000);

      new TWEEN.Tween(camera.position)
        .to({x: 0, y: 0, z: 3000}, 2000)
        .start();

      new TWEEN.Tween(camera.rotation)
        .to({_x: -0, _y: 0, _z: -0}, 2000)
        .start();

      new TWEEN.Tween(controls.center)
        .to({x: 0, y: 0, z: 0}, 2000)
        .start();

    $scope.hiddenMenu = true;

    };

    //This is to make the card movement from position to position more interesting
    $scope.transform = function(targets, duration) {

      TWEEN.removeAll();

      for (var i = 0; i < $scope.objects.length; i++) {
        var object = $scope.objects[i];
        var target = targets[i];

        new TWEEN.Tween(object.position)
          .to({x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration)
          .easing(TWEEN.Easing.Exponential.InOut)
          .start();

        new TWEEN.Tween(object.rotation)
          .to({x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration)
          .easing(TWEEN.Easing.Exponential.InOut)
          .start();
      }

      new TWEEN.Tween(this)
        .to({}, duration * 2)
        .onUpdate($scope.render)
        .start();
    };

    //when the window is resized
    var onWindowResize = function() {

      camera.aspect = $window.innerWidth / $window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize($window.innerWidth, $window.innerHeight);

      $scope.render();
    };

    var animate = function() {
      requestAnimationFrame(animate);
      if (setup) {
        TWEEN.update();
        controls.update();
      }
    };

    angular.element(document).ready(function () {
      init();
      animate();
      $scope.fetchUser();
    });

    $scope.render = function(){
      renderer.render(scene, camera);
    };

    $scope.rerender = function() {
      document.getElementById('container').removeChild(document.getElementsByClassName('render')[0]);
      $scope.objects = [];
      $scope.targets = {table: [], sphere: [], helix: [], doubleHelix: [], tripleHelix: [], grid: []};
      init();
      animate();
    };
  }]);
'use strict';

angular.module('snippit.profile', ['snippit'])
  .controller('ProfileController', ['$rootScope', '$scope', 'Facebook', '$window', 'Snips', '$http', function($rootScope, $scope, Facebook, $window, Snips, $http) {

    $rootScope.bool.profile = true;

    $scope.viewSnip = function(id){
      console.log(id);
    }


    // Invoke Facebook getFacebook user method, on success, assign
    // $scope.facebookUser to that response (Facebook name and id).
    $scope.fetchUser = function() {
      Snips.getSnips($rootScope.facebookUser.snips).success(function(resp) {
        $scope.snips = resp;
        $rootScope.snips = resp;
      });
    };

    // Check if there any items in $scope.snipPhotos to determine
    // whether or not we should show the snip sidebar on the right.
    // If there are no photos in that object, it means that we haven't
    // selected any images to add to our snip or there are no existing
    // photos in an existing snip.
    $scope.snipCheck = function(){
      return !!Object.keys($scope.snipPhotos).length;
    };

    // Call Snips' getSnips method, upon success, responds with
    // a resp object that's an array, which we loop over and set
    // as values on the $scope.snips object. This allows the user
    // to see the snips that they've created.
    $scope.fetchSnips = function(){

      Snips.getSnips().success(function(resp) {
        for (var i = 0; i < resp.length; i++) {
          $scope.snips[resp[i]._id] = {
            name: resp[i].name,
            img: resp[i].img
          }
        }
      })
    }

    // Adds a clicked photo to the snipPhotos object, which consists of
    // the picture ID as the key, the link, thumbnail, and position of
    // the photo (within the snippit) for the values.
    $scope.checkOn = function(id, pic) {
      var pos = Object.keys($rootScope.snipPhotos).length;
      $rootScope.snipPhotos[id] = {
        src: pic.src,
        thumb: pic.thumb,
        position: pos
      };

      $rootScope.snipOpen = true;

    };
  }]);

'use strict';

angular.module('snippit.services', ['snippit'])
  .factory('Facebook', ['$http', function($http) {

    // This is a helper function to get the Wall Photos of the current user.
    var getWallData = function() {
      return $http.get('/getData');
    };

    var refreshWallData = function() {
      return $http.get('/getFacebookWall');
    };

    // This is a helper function to get an Album List of the current user.
    var getAlbumData = function() {
      return $http.get('/getFacebookAlbums');
    };

    // This is a helper function to get the Album Photos of the current user,
    // it takes an Album Name and Album ID.
    var getAlbumPhotos = function(name, id) {
      var obj = {name: name, id: id};
      return $http.post('/getFacebookAlbumPhotos', obj);
    };

    // Makes a get request and fetches Facebook user's name and ID.
    var getFacebookUser = function() {
      return $http.get('/facebookUser');
    };
    var fetchInstagram = function(){
      return $http.get('/getInstagram');
    }

    return {
      getWallData: getWallData,
      getAlbumData: getAlbumData,
      getAlbumPhotos: getAlbumPhotos,
      getFacebookUser: getFacebookUser,
      refreshWallData: refreshWallData,
      fetchInstagram: fetchInstagram
    };
  }])
;

'use strict';

angular.module('snippit.services', ['snippit'])
  .factory('ThreeFactory', function() {

    // This is a helper function that creates a CSS3D object
    // to be added to  a THREE.js. It takes an iteration count,
    // a collection of image sources, a THREE.js scene,
    // an array to save the object in, and a function to be called on each click.
    var createObject = function(i, collection, scene, objects, click) {
      var el = document.createElement('div');
      el.className = 'element';
      el.setAttribute('ng-show', 'picData[-1]');


      var image = document.createElement('img');
      image.className = 'picImg';
      image.src = collection[i];
      el.appendChild(image);


      var object = new THREE.CSS3DObject(el);
      object.position.x = Math.random() * 4000 - 2000;
      object.position.y = Math.random() * 4000 - 2000;
      object.position.z = Math.random() * 4000 - 2000;
      scene.add(object);

      if (click) {
        var bound = click.bind(i);
        el.addEventListener('click', bound);
      }

      objects.push(object);
    };

    // This is a helper function to create the position necessary for the table shape.
    // It takes a number denoting the columns, an iterator, and a target array to push the object positions into.
    var table = function(n, i, target) {
      var object = new THREE.Object3D();
      object.position.x = ((i % n) * 140) - 640;
      object.position.y = -((Math.floor(i / n) + 1) * 180) + 540;
      target.push(object);
    };

    // This is a helper function to create the position necessary for the sphere shape.
    // It takes an iterator, a vector to lookat, a target array to push the object positions into,
    // a radius, and the number of nodes to be in the sphere.
    var sphere = function(i, vector, target, r, n) {
      var phi = Math.acos(-1 + (2 * i) / n);
      var theta = Math.sqrt(n * Math.PI) * phi;

      var object = new THREE.Object3D();

      object.position.x = r * Math.cos(theta) * Math.sin(phi);
      object.position.y = r * Math.sin(theta) * Math.sin(phi);
      object.position.z = r * Math.cos(phi);

      vector.copy(object.position).multiplyScalar(2);

      object.lookAt(vector);

      target.push(object);
    };

    // This is a helper function to create the position necessary for the helix shapes.
    // It takes a number denoting the strings, an iterator, a vector to lookat,
    // a target array to push the object positions into, a spacing variable, the offset
    // of the entire helix off of the y axis, an X radius, a Z radius, and the step height.
    var helix = function(n, i, vector, target, spacing, offset, xRad, zRad, step) {
      var object = new THREE.Object3D();
      var phi = i * spacing + (i % n) / n * (Math.PI * 2);

      object.position.x = xRad * Math.sin(phi);
      object.position.y = -(i * step) + offset;
      object.position.z = zRad * Math.cos(phi);

      vector.x = object.position.x * 2;
      vector.y = object.position.y;
      vector.z = object.position.z * 2;

      object.lookAt(vector);
      target.push(object);
    };

    // This is a helper function to create the position necessary for the grid shapes.
    // It takes a number denoting the columns and rows, an iterator,
    // and a target array to push the object positions into.
    var grid = function(n, i, target) {
      var object = new THREE.Object3D();

      object.position.x = ((i % n) * 400) - 800;
      object.position.y = (-(Math.floor(i / n) % n) * 400) + 800;
      object.position.z = (Math.floor(i / (n * n))) * 800;

      target.push(object);
    };

    return {
      createObject: createObject,
      table: table,
      sphere: sphere,
      helix: helix,
      grid: grid
    };
  })
  .factory('Facebook', ['$http', function($http) {

    // This is a helper function to get the Wall Photos of the current user.
    var getWallData = function() {
      return $http.get('/getData');
    };

    var refreshWallData = function() {
      return $http.get('/getFacebookWall');
    };

    // This is a helper function to get an Album List of the current user.
    var getAlbumData = function() {
      return $http.get('/getFacebookAlbums');
    };

    // This is a helper function to get the Album Photos of the current user,
    // it takes an Album Name and Album ID.
    var getAlbumPhotos = function(name, id) {
      var obj = {name: name, id: id};
      return $http.post('/getFacebookAlbumPhotos', obj);
    };

    // Makes a get request and fetches Facebook user's name and ID.
    var getFacebookUser = function() {
      return $http.get('/facebookUser');
    };
    var getInstagram = function(){
      return $http.get('/getInstagram');
    }

    return {
      getWallData: getWallData,
      getAlbumData: getAlbumData,
      getAlbumPhotos: getAlbumPhotos,
      getFacebookUser: getFacebookUser,
      refreshWallData: refreshWallData,
      getInstagram: getInstagram
    };
  }])
  .factory('Snips', ['$http', function($http){

    // Makes a request and fetches a user's snips.
    var getSnips = function(snips) {
      return $http.post('/getSnips', {snips: snips});
    };

    // Makes a request and posts a snip to the database.
    // It takes a snip object with a name and img property.
    var addSnip = function(snip) {
      return $http.post('/addSnip', snip);
    };

    // Makes a request and updates a given snip with new info.
    // It takes a snip object with an _id and img property.
    var saveSnip = function(snip) {
      return $http.post('/saveSnip', snip);
    };

    var deleteSnip = function(id) {
      console.log('DELETING', id);
      var snipID = {_id: id};
      return $http.post('/deleteSnip', snipID);
    };

    return {
      getSnips: getSnips,
      addSnip: addSnip,
      saveSnip: saveSnip,
      deleteSnip: deleteSnip
    };
  }])
;


'use strict';

angular.module('snippit.snips', ['snippit'])
  .controller('SnipsController', ['$rootScope', '$scope', 'ThreeFactory', '$window', '$document', 'Facebook', 'Snips', '$stateParams', function($rootScope, $scope, ThreeFactory, $window, $document, Facebook, Snips, $stateParams) {

  $scope.snipAdd = function() {
      $rootScope.snipOpen = false;  
      Snips.addSnip({img: $rootScope.snipPhotos, name: $rootScope.snipName, userId: $rootScope.facebookUser.id})
        .success(function(resp){
          $rootScope.snips[resp] = {
            name: $rootScope.snipName,
            img: $rootScope.snipPhotos
          };
          $rootScope.snipName = '';
          $rootScope.snipPhotos = {};
        });
    };

    $scope.snipClose = function() {
      $rootScope.snipOpen = false;  
      $rootScope.newSnip = true;
      if (Object.keys($rootScope.snipPhotos).length === 0) {
        delete $rootScope.snips[$rootScope.snipId];
        $rootScope.snipPhotos = {};
        $rootScope.snipId = null;
        $rootScope.snipName = '';
      } else {
        $rootScope.snips[$scope.snipId].img = $scope.snipPhotos;
        Snips.saveSnip({img: $scope.snipPhotos, name: $scope.snipName, _id: $scope.snipId})
          .success(function(resp){
            $rootScope.snipName = '';
            $rootScope.snipPhotos = {};
            $rootScope.snipId = null;
          });
      }
    };

    $scope.showInfo = function() {
      $rootScope.bool.info = !$rootScope.bool.info
    }
    
    $scope.checkOff = function(pic) {
      delete $rootScope.snipPhotos[pic];
      if(Object.keys($rootScope.snipPhotos).length === 0){
        $rootScope.snipOpen = false;
      }
    };
  }]);

'use strict';

angular.module('snippit.three', ['snippit'])
  .controller('ThreeController', ['$scope', 'ThreeFactory', '$window', '$document', 'Facebook', 'Snips', '$stateParams', '$rootScope', function($scope, ThreeFactory, $window, $document, Facebook, Snips, $stateParams, $rootScope) {

    $rootScope.bool.profile = false;
    $scope.info = false;


    // These instantiate the THREE.js scene, renderer, camera, controls, and data.
    var scene, renderer, camera, controls;

    //Setup is a boolean that lets us know not to render the scene until we have
    //the facebook data.
    var setup = false;

    $scope.signedIn = !!document.getElementsByClassName('side')[0];

    $scope.hideProfile = function() {
      $rootScope.hiddenProfile = !$rootScope.hiddenProfile;
      onWindowResize();
    };

    // This is a helper function that returns the total height of the THREE.js scene.
    var sceneWidth = function() {
      if ($rootScope.hiddenProfile || !$scope.signedIn) {
        return $window.innerWidth;
      } else {
        return $window.innerWidth * .8;
      }
    };

    var sceneHeight = function() {
      return $window.innerHeight;
    };

    $scope.objects = [];
    $scope.targets = {table: [], sphere: [], helix: [], doubleHelix: [], tripleHelix: [], grid: []};
    $scope.targetNames = [['table', 'Table'], ['sphere', 'Sphere'], ['helix', 'Helix'], ['doubleHelix', 'Double Helix'], ['tripleHelix', 'Triple Helix'], ['grid', 'Grid']];

    var prepFb = function(resp) {
      var parsed = JSON.parse(resp.data);

      data = {
        pictures: parsed.wallPhotos.picture,
        thumbnails: parsed.wallPhotos.thumbnail
      };

      return data;
    };

    var prepSnip = function(resp) {
      data = {
        pictures: [],
        thumbnails: []
      }

      for(var key in resp) {
        data.pictures.push(resp[key].src);
        data.thumbnails.push(resp[key].thumb);
      }

      return data;
    };

    var threeJS = function(data) {

      //start the camera zoomed out 1500 from the origin
      camera = new THREE.PerspectiveCamera(30, sceneWidth() / sceneHeight(), 1, 10000);
      camera.position.z = 2000;
      scene = new THREE.Scene();

      setup = true;

      var vector = new THREE.Vector3();

      var len = data.thumbnails.length;


      for (var i = 0; i < len; i++) {
        ThreeFactory.createObject(i, data.thumbnails, scene, $scope.objects, $scope.hit);
        ThreeFactory.table(10, i, $scope.targets.table);
        ThreeFactory.sphere(i, vector, $scope.targets.sphere, 800, len);
        ThreeFactory.helix(1, i, vector, $scope.targets.helix, 0.175, 450, 900, 900, 8);
        ThreeFactory.helix(2, i, vector, $scope.targets.doubleHelix, 0.175, 450, 500, 500, 50);
        ThreeFactory.helix(3, i, vector, $scope.targets.tripleHelix, 0.1, 450, 500, 500, 50);
        ThreeFactory.grid(5, i, $scope.targets.grid);
      }

      renderer = new THREE.CSS3DRenderer();
      renderer.setSize(sceneWidth(), sceneHeight());
      renderer.domElement.style.position = 'absolute';
      renderer.domElement.classList.add('render');

      $scope.transform($scope.targets.table, 2000);

      document.getElementById('container').appendChild(renderer.domElement);

      window.addEventListener('resize', onWindowResize, false);

      controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.damping = 0.2;
      controls.addEventListener('change', $scope.render);
    };

    // Now checks to see if photos currently exist in the database for
    // this user. If not, it'll fetch them from Facebook, if it does, it'll
    // fetch from MongoDB.
    var init = function(){
      if ($scope.signedIn) {
        if ($rootScope.snipId) {
          threeJS(prepSnip($rootScope.snipPhotos));
        } else {
          Facebook.getWallData()
            .then(function(resp){
            if (resp.data.bool === 'false') {
              Facebook.refreshWallData()
              .then(function(resp) {
                threeJS(prepFb(resp));
              });
            } else {
              threeJS(prepFb(resp));
            }
          });
        }
      } else {
        if ($stateParams.snipId) {
          Snips.getSnips([$stateParams.snipId])
            .then(function(resp) {
              var parseData = JSON.parse(resp.data);
              threeJS(prepSnip(parseData[$stateParams.snipId].img));
            });
        }
      }
    };

    //open a modal fram with a version of the picture when clicked
    $scope.hit = function(){
      Modal.open({
         content: "<div class='imageResize'><img src='" + data.pictures[this] + "' /></div>",
         draggable: false,
         width: 'auto',
         context: this
       });
    };

    //when a new transformatoion begins, move the camera back to its initial position
    $scope.clicked = function(targets){
      $scope.transform(targets, 2000);

      new TWEEN.Tween(camera.position)
        .to({x: 0, y: 0, z: 3000}, 2000)
        .start();

      new TWEEN.Tween(camera.rotation)
        .to({_x: -0, _y: 0, _z: -0}, 2000)
        .start();

      new TWEEN.Tween(controls.center)
        .to({x: 0, y: 0, z: 0}, 2000)
        .start();
    };

    //This is to make the card movement from position to position more interesting
    $scope.transform = function(targets, duration) {

      TWEEN.removeAll();

      for (var i = 0; i < $scope.objects.length; i++) {
        var object = $scope.objects[i];
        var target = targets[i];

        new TWEEN.Tween(object.position)
          .to({x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration)
          .easing(TWEEN.Easing.Exponential.InOut)
          .start();

        new TWEEN.Tween(object.rotation)
          .to({x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration)
          .easing(TWEEN.Easing.Exponential.InOut)
          .start();
      }

      new TWEEN.Tween(this)
        .to({}, duration * 2)
        .onUpdate($scope.render)
        .start();
    };

    //when the window is resized
    var onWindowResize = function() {

      camera.aspect = sceneWidth() / sceneHeight();
      camera.updateProjectionMatrix();

      renderer.setSize(sceneWidth(), sceneHeight());

      $scope.render();
    };

    var animate = function() {
      requestAnimationFrame(animate);
      if (setup) {
        TWEEN.update();
        controls.update();
      }
    };

    angular.element(document).ready(function () {
      init();
      animate();
    });

    $scope.render = function(){
      renderer.render(scene, camera);
    };

    $rootScope.rerender = function() {
      document.getElementById('container').removeChild(document.getElementsByClassName('render')[0]);

      $scope.objects = [];
      $scope.targets = {table: [], sphere: [], helix: [], doubleHelix: [], tripleHelix: [], grid: []};
      init();
      animate();
    };

    $scope.showInfo = function() {
      console.log('clicked');
      $scope.info = !$scope.info;
    };
  }]);
