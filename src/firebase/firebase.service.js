import app from 'firebase/app';
import 'firebase/database';
import 'firebase/firestore';

const config = {
    apiKey: 'AIzaSyBA-Y2YXIdVZLYZ-u_DkejK3SjTMKB2uJ4',
    authDomain: 'krauzsoft-controller.firebaseapp.com',
    databaseURL: 'https://krauzsoft-controller.firebaseio.com',
    projectId: 'krauzsoft-controller',
    storageBucket: 'krauzsoft-controller.appspot.com',
    messagingSenderId: '383756445736'
};

export default class Firebase {
    constructor() {
        app.initializeApp(config);

        this.db = app.database();
        this.store = app.firestore();
    }

    addSession = () => this.store.collection('sessions').add({});

    updateSession = (sessionId, data) =>
        this.store
            .collection('sessions')
            .doc(sessionId)
            .set(data, { merge: true });

    getSession = sessionId =>
        this.store
            .collection('sessions')
            .doc(sessionId)
            .get();
}
