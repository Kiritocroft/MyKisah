"use client";

import { useActionState } from "react";
import { login } from "@/app/actions/auth";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-night-bg relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
         <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(219,39,119,0.1),transparent_70%)]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md p-6 sm:p-8 bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl mx-4"
      >
        <div className="text-center mb-8">
            <h1 className="text-3xl font-serif text-white mb-2">Admin Portal</h1>
            <p className="text-slate-400 text-sm">Enter the sacred shrine key.</p>
        </div>

        <form action={formAction} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
            <input 
                type="password" 
                name="password"
                placeholder="••••••••"
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-soft-pink focus:border-transparent outline-none transition-all placeholder:text-slate-600"
                required
            />
          </div>

          {state?.error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
                {state.error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={isPending}
            className="w-full bg-soft-pink hover:bg-white text-slate-900 font-bold py-3 rounded-xl transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Unlocking..." : "Enter Shrine"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
