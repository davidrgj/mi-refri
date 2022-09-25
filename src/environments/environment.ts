// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiURL: 'https://loncheradavdevco-default-rtdb.firebaseio.com',
  firebaseConfig: {
    // apiKey: "AIzaSyAKFYL98IuWBGKknwCWk-6dQBwfCMjde70",
    // authDomain: "loncheradavdevco.firebaseapp.com",
    // projectId: "loncheradavdevco",
    // storageBucket: "gs://loncheradavdevco.appspot.com",
    // messagingSenderId: "607551235402",
    // appId: "1:607551235402:web:abf0248c31c6ded8b28db3",
    // measurementId: "G-5ETFQEZV7G"

    apiKey: "AIzaSyAKFYL98IuWBGKknwCWk-6dQBwfCMjde70",
    authDomain: "loncheradavdevco.firebaseapp.com",
    databaseURL: "https://loncheradavdevco-default-rtdb.firebaseio.com",
    projectId: "loncheradavdevco",
    storageBucket: "loncheradavdevco.appspot.com",
    messagingSenderId: "607551235402",
    appId: "1:607551235402:web:abf0248c31c6ded8b28db3",
    measurementId: "G-5ETFQEZV7G"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
