import { db } from "@/config/firebaseConfig";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

export interface GymLeader {
  id: string;
  name: string;
  city: string;
  type: string;
  imageUrl: string;
  team: { id: number; level: number }[];
  order: number;
}

//  busca os líderes diretamente do Firestore
export async function fetchKantoLeaders(): Promise<GymLeader[]> {
  try {
    const leaders: GymLeader[] = [];
    const q = query(collection(db, "gymLeaders"), orderBy("order"));
    
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      leaders.push({ id: doc.id, ...doc.data() } as GymLeader);
    });
    return leaders;
  } catch (error) {
    console.error("Erro ao buscar líderes de ginásio do Firestore:", error);
    return [];
  }
}