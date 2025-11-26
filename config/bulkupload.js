// import { collection, doc, setDoc } from "firebase/firestore";
// import { slots } from "../store/restaurants";
// import { db } from "./firebaseConfig";


// //const restaurant_Data = slots;


// const uploadData = async () => {
//     try{
//         for(let i = 0; i < restaurant_Data.length; i++){
//             const restaurant = restaurant_Data[i];
//             const docRef = doc(collection(db,"slots"), `slot_${i + 1}`);
//             await setDoc(docRef , restaurant);
//             console.log("data uploaded");
//         }
//     }
//     catch(e){
//         console.log("Error uploading data" , e);
//     }
// }

// export default uploadData;


