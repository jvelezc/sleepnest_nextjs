"use client"

import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex">
      {/* Specialist Column */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex-1 relative cursor-pointer"
        onClick={() => router.push("/login/specialist")}
      >
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: "url('/loginpage/Specialist1.png')"
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-violet-900/90 to-transparent" />
        </div>
        <div className="relative h-full flex flex-col justify-end p-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Sleep Specialist</h2>
          <p className="text-xl text-white/90 mb-6 mx-auto max-w-md">
            Join our network of certified sleep consultants and help families achieve better sleep
          </p>
          <div className="space-y-3 max-w-md mx-auto w-full">
            <button
              onClick={(e) => {
                e.stopPropagation()
                router.push("/login/specialist")
              }}
              className="w-full py-3 px-6 bg-white/90 hover:bg-white text-gray-900 rounded-lg font-medium transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                router.push("/register/specialist")
              }}
              className="w-full py-3 px-6 bg-violet-500/90 hover:bg-violet-500 text-white rounded-lg font-medium transition-colors"
            >
              Register as Specialist
            </button>
          </div>
        </div>
      </motion.div>

      {/* Caregiver Column  */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex-1 relative cursor-pointer"
        onClick={() => router.push("/login/caregiver")}
      >
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: "url('/loginpage/caregiver1.png')" 
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-rose-900/90 to-transparent" />
        </div>
        <div className="relative h-full flex flex-col justify-end p-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Caregiver</h2>
          <p className="text-xl text-white/90 mb-6 mx-auto max-w-md">
            Get personalized guidance from sleep specialists to improve your child's sleep
          </p>
          <div className="space-y-3 max-w-md mx-auto w-full">
            <button
              onClick={(e) => {
                e.stopPropagation()
                router.push("/login/caregiver")
              }}
              className="w-full py-3 px-6 bg-white/90 hover:bg-white text-gray-900 rounded-lg font-medium transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                router.push("/register/caregiver")
              }}
              className="w-full py-3 px-6 bg-rose-500/90 hover:bg-rose-500 text-white rounded-lg font-medium transition-colors"
            >
              Register as Caregiver
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}