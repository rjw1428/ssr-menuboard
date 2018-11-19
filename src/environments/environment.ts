// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyB0TIdi4pv4CqRdyhqPP_Lh0BVF_w3XDCY",
    authDomain: "menu-demo.firebaseapp.com",
    databaseURL: "https://menu-demo.firebaseio.com",
    projectId: "menu-demo",
    storageBucket: "menu-demo.appspot.com",
    messagingSenderId: "1032055243209"
  },
  version: "1.0.2",
  barName: "Hilltown Tavern",
  barLogo: "https://firebasestorage.googleapis.com/v0/b/menu-demo.appspot.com/o/logo.png?alt=media&token=f30e4b12-2952-4a51-8b69-1843ce20b821",
  featureRootAddress: 'featuredList/',
  itemIconRootAddress: 'breweries/',
};
