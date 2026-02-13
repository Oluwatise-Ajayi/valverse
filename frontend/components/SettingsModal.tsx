"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Music, Phone, Mail, Instagram, MessageCircle } from "lucide-react";
import { useMusicStore, TRACKS } from "@/stores/useMusicStore";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { currentTrack, setTrack, isPlaying, togglePlay } = useMusicStore();
  const [showContactDetails, setShowContactDetails] = useState(false);

  const contactOptions = [
    { label: "WhatsApp", value: "0912691707", href: "https://wa.me/234912691707", icon: MessageCircle, color: "text-green-500" },
    { label: "Call Line", value: "09134935983", href: "tel:09134935983", icon: Phone, color: "text-blue-500" },
    { label: "Email", value: "oluwatiseajayi393@gmail.com", href: "mailto:oluwatiseajayi393@gmail.com", icon: Mail, color: "text-red-500" },
  ];

  const handleContactBF = () => {
    // Attempt to open dialer directly first
    window.location.href = "tel:09134935983";
    
    // Show details as fallback (or always show them for better UX)
    setShowContactDetails(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[100] backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] sm:w-[90%] max-w-md max-h-[85vh] overflow-y-auto bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md rounded-3xl shadow-2xl z-[101] p-6 border border-white/20"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold font-outfit text-pink-600 dark:text-pink-400">Settings</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-black/5 rounded-full transition-colors"
                aria-label="Close Settings"
              >
                <X className="w-6 h-6 text-zinc-600 dark:text-zinc-300" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Music Selection Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-lg font-semibold text-zinc-800 dark:text-zinc-100">
                  <Music className="w-5 h-5 text-pink-500" />
                  <span>Background Music</span>
                </div>
                <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden max-h-40 overflow-y-auto">
                  {TRACKS.map((track) => (
                    <button
                      key={track.id}
                      onClick={() => setTrack(track.id)}
                      className={`w-full text-left p-3 hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-colors flex items-center justify-between group ${
                        currentTrack === track.id
                          ? "bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 font-medium"
                          : "text-zinc-600 dark:text-zinc-300"
                      }`}
                    >
                      <span className="truncate pr-2 text-sm">{track.title}</span>
                      {currentTrack === track.id && (
                        <div className="flex gap-1">
                          <span className="w-1 h-3 bg-pink-500 animate-pulse delay-75 rounded-full" />
                          <span className="w-1 h-3 bg-pink-500 animate-pulse delay-150 rounded-full" />
                          <span className="w-1 h-3 bg-pink-500 animate-pulse delay-300 rounded-full" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Contact BF Section */}
              <div className="space-y-3 pt-4 border-t border-zinc-200 dark:border-zinc-700">
                <div className="flex items-center gap-2 text-lg font-semibold text-zinc-800 dark:text-zinc-100">
                  <Phone className="w-5 h-5 text-pink-500" />
                  <span>Contact Hub</span>
                </div>
                
                {!showContactDetails ? (
                  <button
                    onClick={handleContactBF}
                    className="w-full py-3 px-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-medium shadow-lg shadow-pink-500/30 hover:shadow-pink-500/40 transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                  >
                    <Phone className="w-5 h-5" />
                    Call Your BF
                  </button>
                ) : (
                  <div className="space-y-3 animate-in fade-in slide-in-from-top-4 duration-300">
                    {contactOptions.map((option) => (
                      <a
                        key={option.label}
                        href={option.href}
                        target={option.label !== "Call Line" ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors border border-transparent hover:border-pink-200 dark:hover:border-pink-900/30"
                      >
                        <div className={`p-2 bg-white dark:bg-zinc-700 rounded-full shadow-sm ${option.color}`}>
                          <option.icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium uppercase tracking-wider">{option.label}</p>
                          <p className="text-zinc-800 dark:text-zinc-200 font-medium text-sm sm:text-base break-all">{option.value}</p>
                        </div>
                      </a>
                    ))}
                    <button 
                        onClick={() => setShowContactDetails(false)}
                        className="w-full text-xs text-zinc-400 hover:text-pink-500 mt-2 underline"
                    >
                        Hide Contact Details
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
