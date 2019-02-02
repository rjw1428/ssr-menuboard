// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyDWucZhVx0NiZpkiHiw31Do7i23jm_QphM",
    authDomain: "ssrwebsite-1428.firebaseapp.com",
    databaseURL: "https://ssrwebsite-1428.firebaseio.com",
    projectId: "ssrwebsite-1428",
    storageBucket: "ssrwebsite-1428.appspot.com",
    messagingSenderId: "397185718304"
  },
  algolia: {
    appId: "2B8AHSKLCB",
    apiKey: "d710b3e239465e1dffc1404f9c4b3abe"
  },
  version: "1.0.2",
  barName: "Hilltown Tavern",
  barLogo: "https://firebasestorage.googleapis.com/v0/b/menu-demo.appspot.com/o/logo.png?alt=media&token=f30e4b12-2952-4a51-8b69-1843ce20b821",
  featureRootAddress: 'featuredList/',
  itemIconRootAddress: 'breweries/',
};
