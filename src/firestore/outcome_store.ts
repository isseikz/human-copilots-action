import {
    DocumentData,
    FirestoreDataConverter,
    QueryDocumentSnapshot,
    SnapshotOptions,
    doc,
    getFirestore,
    setDoc,
    collection,
    getDocs
} from 'firebase/firestore'
import { Outcome } from '../data'
import { sendDebug } from '../github'

const outcomeConverter: FirestoreDataConverter<Outcome> = {
    toFirestore(data: Outcome): DocumentData {
        return {
            task: data.task,
        }
    },
    fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Outcome {
        const data = snapshot.data(options)
        // Book オブジェクトの id プロパティには Firestore ドキュメントの id を入れる。
        return {
            id: snapshot.id,
            task: data.task,
        }
    },
}

export async function addOutcome(data: Outcome) {
    sendDebug("addOutcome")
    const db = getFirestore()
    const docRef = doc(db, 'outcomes', data.id).withConverter(outcomeConverter)
    await setDoc(docRef, data)
}

export async function getOutcome(): Promise<Outcome[]> {
    sendDebug("getOutcome")
    const db = getFirestore()
    const collRef = collection(db, '/outcomes')//.withConverter(outcomeConverter)
    const snapshot = await getDocs(collRef)
    return snapshot.docs.map((doc) => {
        sendDebug(doc.id)
        return {
            id: doc.id,
            task: doc.data().task
        }
    })
}
