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

        this.constructRepository.bind(this)('Session', 'sessions');
        this.constructRepository.bind(this)('Approved', 'approved');
        this.constructRepository.bind(this)('Chat', 'chat');
    }

    constructRepository = (methodName, tableName) => {
        this[`add${methodName}`] = () => this.store.collection(tableName).add({});

        this[`update${methodName}`] = (id, data) =>
            this.store
                .collection(tableName)
                .doc(id)
                .set(data, { merge: true });

        this[`get${methodName}`] = id =>
            this.store
                .collection(tableName)
                .doc(id)
                .get();

        this[`ref${methodName}`] = id => this.store.collection(tableName).doc(id);
    };

    getSecurityKey = pass =>
        this.store
            .collection('admin')
            .where('key', '==', pass)
            .get();
}
