app.config(function($stateProvider, $urlRouterProvider, $ocLazyLoadProvider) {

    $urlRouterProvider.otherwise("/index/main");

    $ocLazyLoadProvider.config({
        // Set to true if you want to see what and when is dynamically loaded
        debug: false
    });

    $stateProvider.state('index', {
        abstract: true,
        url: "/index",
        templateUrl: "views/common/content.html",
    });
    $stateProvider.state('index.main', {
        url: "/main",
        templateUrl: "views/main.html",
        data: { pageTitle: 'Example view' }
    });
    $stateProvider.state('index.minor', {
        url: "/minor",
        templateUrl: "views/minor.html",
        data: { pageTitle: 'Example view' }
    });
});

app.run(function($rootScope, $state) {
    $rootScope.$state = $state;
});
