import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
const Storage = require('@google-cloud/storage');

import { tmpdir } from 'os'
import { join, dirname } from 'path' 
import * as sharp from 'sharp';
import * as fs from 'fs-extra';

admin.initializeApp();
const env = functions.config();
const gcs = Storage();

import * as algoliasearch from 'algoliasearch';
import * as firebase from 'firebase';

export const resizeImage = functions.storage
    .object()
    .onFinalize(async object => {
        const bucket = gcs.bucket(object.bucket);
        const filePath = object.name;
        const fileName = filePath.split('/').pop();
        const bucketDir = dirname(filePath);

        const workingDir = join(tmpdir(), 'thumbs');
        const tmpFilePath = join(workingDir, 'source.png');

        if (fileName.includes('thumb@')|| !object.contentType.includes('image')) {
            console.log('exiting function')
            return false;
        }

        await fs.ensureDir(workingDir);

        await bucket.file(filePath).download({
            destination: tmpFilePath
        })

        const sizes = [256, 1080];
        const uploadPromises = sizes.map(async size =>{
            const thumbName = `thumb@${size}_${fileName}`;
            const thumbPath = join(workingDir, thumbName);

            await sharp(tmpFilePath).resize(size*16/9, size).toFile(thumbPath);

            return bucket.upload(thumbPath, {
                destination: join(bucketDir, thumbName)
            })
        })

        await Promise.all(uploadPromises);
        return fs.remove(workingDir)
    })
//Initialize Client
// const client = algoliasearch(env.algolia.appid, env.algolia.apikey);
// const index = client.initIndex('beer_search');

// exports.indexBeer = functions.firestore.document('masterBeerList/{beerId}').onCreate((snap, context) => {
//     const data = snap.data()
//     const objectId = snap.id;

//     return index.addObject({
//         objectId, ...data
//     })
// });

// exports.unindexBeer = functions.firestore.document('masterBeerList/{beerId}').onDelete((snap, context) => {
//     const objectId = snap.id
//     return index.deleteObject(objectId);
// })


// exports.reindexBeer = functions.firestore.document('masterBeerList/{beerId}').onUpdate((change) => {
//     const data = snap.data()
//     const objectId = snap.id;

//     return index.addObject({
//         objectId, ...data
//     })
// })