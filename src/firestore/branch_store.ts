import {
    DocumentData,
    FirestoreDataConverter,
    QueryDocumentSnapshot,
    SnapshotOptions,
    doc,
    getFirestore,
    setDoc,
    collection,
    getDocs,
    getDoc
} from 'firebase/firestore'
import { Branch } from '../data'
import { sendDebug, sendError } from '../github'
import { app } from './firebase_app'

const branchConverter: FirestoreDataConverter<Branch> = {
    toFirestore(branch: Branch): DocumentData {
        return {
            name: branch.name,
        }
    },
    fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Branch {
        const data = snapshot.data(options)
        return {
            id: snapshot.id,
            name: data.name,
        }
    },
}

export async function addBranch(data: Branch) {
    const db = getFirestore(app)
    const docRef = doc(db, 'branches', data.id).withConverter(branchConverter)
    await setDoc(docRef, data)
}

export async function getBranchBy(id: string): Promise<Branch | null> {
    sendDebug("getBranchBy")
    const db = getFirestore()
    const collRef = collection(db, "branches")
    const docRef = doc(collRef, id)
    const document = await getDoc(docRef)

    if (!document.exists()) {
        sendError(Error(`Failed to resolve with ${id}`));
        return null
    }
    return {
        id: document.id,
        name: document.data().name
    }
}

export async function getBranch(): Promise<Branch[]> {
    sendDebug("getBranch")
    const db = getFirestore(app)
    const collRef = collection(db, '/branches')//.withConverter(branchConverter)
    const snapshot = await getDocs(collRef)
    return snapshot.docs.map((doc) => { 
        return {
            id: doc.id,
            name: doc.data().name
        }
    })
}
