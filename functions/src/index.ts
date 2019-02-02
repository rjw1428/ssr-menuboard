import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();
const env = functions.config();

import * as algoliasearch from 'algoliasearch';

//Initialize Client
const client = algoliasearch(env.algolia.appid, env.algolia.apikey);
const index = client.initIndex('beer_search');

exports.indexBeer = functions.firestore.document('masterBeerList/{beerId}').onCreate((snap, context) => {
    const data = snap.data()
    const objectId = snap.id;

    return index.addObject({
        objectId, ...data
    })
});

exports.unindexBeer = functions.firestore.document('masterBeerList/{beerId}').onDelete((snap, context) => {
    const objectId = snap.id
    return index.deleteObject(objectId);
})

// exports.reindexBeer = functions.firestore.document('masterBeerList/{beerId}').onUpdate((change) => {
//     const data = snap.data()
//     const objectId = snap.id;

//     return index.addObject({
//         objectId, ...data
//     })
// })