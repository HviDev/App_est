import { create } from "zustand"
import { db } from "../../../../appwriteConfig"

export type UserRoom = {
  $id: string
  userId: string
  userName: string
  roomNumber: string
  $createdAt: string
  $updatedAt: string
}

type State = {
  userRooms: Record<string, UserRoom> // userId → room
  loading: boolean
  error: string | null

  fetchUserRooms: () => Promise<void>
  getRoomByUserId: (userId: string) => string | null
}

export const useUserRoomStore = create<State>((set, get) => ({
  userRooms: {},
  loading: false,
  error: null,

  fetchUserRooms: async () => {
    set({ loading: true, error: null })
    try {
      const res = await db.listRows({
        databaseId: import.meta.env.VITE_APPWRITE_DB_ID!,
        tableId: import.meta.env.VITE_APPWRITE_TABLE_USER_ROOM!,
      })

      const map = res.rows.reduce((acc: Record<string, UserRoom>, row: any) => {
        acc[row.userId] = row
        return acc
      }, {})

      set({ userRooms: map, loading: false })
    } catch (err: any) {
      set({ error: err.message, loading: false })
    }
  },

  getRoomByUserId: (userId) => {
    return get().userRooms[userId]?.roomNumber ?? null
  },
}))
