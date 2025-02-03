import { create } from 'zustand'

interface CaregiverStore {
  caregiverId: string | null
  setCaregiverId: (id: string | null) => void
}

export const useCaregiverStore = create<CaregiverStore>((set) => ({
  caregiverId: null,
  setCaregiverId: (id) => set({ caregiverId: id }),
})) 