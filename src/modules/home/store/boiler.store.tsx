import { create } from "zustand";
import { db, Query, functions, realtime, } from "../../../../appwriteConfig";
import type { UserData } from "../../auth/store/auth.store";

export type BoilerStatus = {
  $id: string;
  boiler: string;
  state: "ENCENDIDO" | "APAGADO" | "PILOTO";
  ownerData: UserData | null;
  activeUsers: UserData[];
  $createdAt: string;
  $updatedAt: string;
};

export type Boiler = {
  $id: string;
  name: string;
  rooms: string[];
  zone: string;
  boilerStatus: BoilerStatus;
  $createdAt: string;
  $updatedAt: string;
};

interface BoilerStore {
  boilers: Boiler[];
  loading: boolean;
  error: string | null;

  fetchBoilers: () => Promise<void>;
  subscribeToBoilers: () => () => void;
  joinBoiler: (boilerId: string, user: UserData) => Promise<void>;
  leaveBoiler: (boilerId: string, user: UserData) => Promise<void>;
  turnOffBoiler: (boilerId: string, user: UserData) => Promise<void>;
}

export const useBoilerStore = create<BoilerStore>((set, get) => ({
  boilers: [],
  loading: false,
  error: null,

  fetchBoilers: async () => {
    set({ loading: true, error: null });
    try {
      const response = await db.listRows({
        databaseId: import.meta.env.VITE_APPWRITE_DB_ID!,
        tableId: import.meta.env.VITE_APPWRITE_TABLE_BOILERS!,
        queries: [
          Query.select([
            "name", "rooms", "zone", "$id",
            "boilerStatus.$id",
            "boilerStatus.state",
            "boilerStatus.ownerData.$id",
            "boilerStatus.ownerData.userId",
            "boilerStatus.ownerData.userRoom",
            "boilerStatus.activeUsers.$id",
            "boilerStatus.activeUsers.userId",
            "boilerStatus.activeUsers.userRoom"
          ]),
        ],
      });

      set({
        boilers: response.rows as unknown as Boiler[],
        loading: false,
      });
      //console.log("se actualizaron los datos en el store")
    } catch (err: any) {
      set({ error: err.message ?? "Error fetching boilers", loading: false });
    }
  },

subscribeToBoilers: () => {
  const dbId = import.meta.env.VITE_APPWRITE_DB_ID!;
  const statusTableId = import.meta.env.VITE_APPWRITE_TABLE_BOILER_STATUS!;
  const channel = `databases.${dbId}.collections.${statusTableId}.documents`;

  const subscriptionPromise = realtime.subscribe([channel],
    () => {
      //console.log("Evento detectado:", response.events?.[0]);
      get().fetchBoilers();
    }
  );

  return async () => {
    const subscription = await subscriptionPromise;
    subscription.close();
    //console.log("Suscripción cerrada");
  };
},

  joinBoiler: async (boilerId, user) => {
    set({ loading: true });
    try {
      const { boilers } = get();
      const boiler = boilers.find(b => b.$id === boilerId);
      if (!boiler || !boiler.boilerStatus) throw new Error("Caldera no encontrada");

      await functions.createExecution({
        functionId: import.meta.env.VITE_APPWRITE_FUNCTION_ID!,
        body: JSON.stringify({
          action: 'join',
          boilerStatusRowId: boiler.boilerStatus.$id,
          UserRowId: user.$id,
          boilerRowId: boilerId
        }),
      });

      // Ya no es estrictamente necesario fetchBoilers() si subscribeToBoilers() está activo
      set({ loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  leaveBoiler: async (boilerId, user) => {
    set({ loading: true });
    try {
      const { boilers } = get();
      const boiler = boilers.find(b => b.$id === boilerId);
      if (!boiler || !boiler.boilerStatus) throw new Error("Caldera no encontrada");

      await functions.createExecution({
        functionId: import.meta.env.VITE_APPWRITE_FUNCTION_ID!,
        body: JSON.stringify({
          action: 'leave',
          boilerStatusRowId: boiler.boilerStatus.$id,
          UserRowId: user.$id,
          boilerRowId: boilerId
        })
      });

      set({ loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  turnOffBoiler: async (boilerId, user) => {
    set({ loading: true });
    try {
      const { boilers } = get();
      const boiler = boilers.find(b => b.$id === boilerId);
      if (!boiler || !boiler.boilerStatus) throw new Error("Caldera no encontrada");

       await functions.createExecution({
        functionId: import.meta.env.VITE_APPWRITE_FUNCTION_ID!,
        body: JSON.stringify({
          action: 'turnOff',
          boilerStatusRowId: boiler.boilerStatus.$id,
          UserRowId: user.$id,
          boilerRowId: boilerId
        })
      });

      set({ loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },
}));