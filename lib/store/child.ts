import { create } from 'zustand'

interface Child {
  id: string
  name: string
  date_of_birth: string
}

interface ChildState {
  selectedChild: Child | null
  setSelectedChild: (child: Child | null) => void
}

export const useChildStore = create<ChildState>((set) => ({
  selectedChild: null,
  setSelectedChild: (child) => set({ selectedChild: child })
}))