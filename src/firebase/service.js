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

    refSession = sessionId => this.store.collection('sessions').doc(sessionId);

    addApproved = () => this.store.collection('approved').add({});

    updateApproved = (sessionId, data) =>
        this.store
            .collection('approved')
            .doc(sessionId)
            .set(data, { merge: true });

    getApproved = sessionId =>
        this.store
            .collection('approved')
            .doc(sessionId)
            .get();

    refApproved = sessionId => this.store.collection('approved').doc(sessionId);

    getSecurityKey = pass =>
        this.store
            .collection('admin')
            .where('key', '==', pass)
            .get();
}
