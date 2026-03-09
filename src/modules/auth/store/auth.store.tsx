import { create } from "zustand";
import { account, db, Query, ID } from "../../../../appwriteConfig";


export type User = {
  $id: string;
  name?: string;
  email?: string;
};

export type UserData = {
  $id: string;
  userId: string;     
  userRoom: string;
  boilers: string
};


interface AuthStore {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<void>;
  fetchUserData: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  userData: null,
  loading: true,
  error: null,

  register: async (email, password, name) => {
    set({ loading: true, error: null });
    try {
      await account.create({
      userId: ID.unique(), 
      email,
      password,
      name,
    });
      await get().login(email, password);
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      await account.createEmailPasswordSession({ 
        email, 
        password 
      });

      const user = await account.get();
      set({ user, loading: false });
      await get().fetchUserData();
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  logout: async () => {
    set({ loading: true, error: null });
    try {
      await account.deleteSession({ sessionId: "current" });
      set({ user: null, userData: null, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  getCurrentUser: async () => {
    set({ loading: true, error: null });
    try {
      const user = await account.get();
      set({ user, loading: false });
      await get().fetchUserData();
    } catch {
      set({ user: null, userData: null, loading: false });
    }
  },

  fetchUserData: async () => {
    const user = get().user;
    if (!user) return;

    try {
      const response = await db.listRows({
        databaseId: import.meta.env.VITE_APPWRITE_DB_ID!,
        tableId: import.meta.env.VITE_APPWRITE_TABLE_USER_DATA!,
        queries: [Query.equal("userId", user.$id)],
      });

      const row = response.rows[0];
      const userData: UserData | undefined = row
        ? {
          $id: row.$id,
          userId: row.userId,
          userRoom: row.userRoom,
          boilers:row.boilers
        }
        : undefined;

      set({ userData: userData ?? null });

      set({ userData: userData ?? null });
    } catch (err: any) {
      set({ error: err.message });
    }
  },
}));