'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/stores/useGameStore';
import api from '@/lib/api';
import Link from 'next/link';
import { ArrowLeft, Lock, Play, Pause, Image as ImageIcon, Video, Mic, Heart } from 'lucide-react';
import Image from 'next/image';

// Media Item Interface
interface MediaItem {
  id: string;
  type: 'IMAGE' | 'VIDEO' | 'AUDIO';
  title: string;
  thumbnail?: string; // For images/videos
  duration?: string; // For audio/video
  isUnlocked: boolean;
  unlockRequirement?: string;
  src?: string; // The specific image/video file
}

const MOCK_MEDIA: MediaItem[] = [
  // Images
  { 
    id: 'img1', 
    type: 'IMAGE', 
    title: 'Our First Date 💖', 
    thumbnail: '/images/first_date.jpg', 
    isUnlocked: true,
    src: '/images/first_date.jpg'
  },
  { 
    id: 'img2', 
    type: 'IMAGE', 
    title: 'Beach Sunsets 🌅', 
    thumbnail: '/images/sunset.jpg', 
    isUnlocked: true,
    src: '/images/sunset.jpg'
  },
  { 
    id: 'img3', 
    type: 'IMAGE', 
    title: 'Locked Moment', 
    isUnlocked: false, 
    unlockRequirement: "Unlock: Beat 'Catch Hearts' high score (150)" 
  },
   { 
    id: 'img4', 
    type: 'IMAGE', 
    title: 'Locked Moment', 
    isUnlocked: false, 
    unlockRequirement: "Unlock: Complete 'Love Story' Chapter 1" 
  },

  // Voice Notes
  { 
    id: 'vn1', 
    type: 'AUDIO', 
    title: 'Sweet Message #1', 
    duration: '0:45', 
    isUnlocked: true,
    src: '/audio/sweet_message.mp3'
  },
  { 
    id: 'vn2', 
    type: 'AUDIO', 
    title: "Morning Voice Note", 
    duration: '1:12', 
    isUnlocked: true,
    src: '/audio/morning_vn.mp3'
  },
  { 
    id: 'vn3', 
    type: 'AUDIO', 
    title: 'Locked', 
    isUnlocked: false, 
    unlockRequirement: "Unlock: Score 1000 Total" 
  },

  // Videos
  { 
    id: 'vid1', 
    type: 'VIDEO', 
    title: 'Our Summer Vlog 🍦', 
    thumbnail: '/images/vlog_thumb.jpg', 
    isUnlocked: true,
    src: '/video/summer_vlog.mp4'
  },
  { 
    id: 'vid2', 
    type: 'VIDEO', 
    title: 'Mystery Video', 
    isUnlocked: false, 
    unlockRequirement: "Keep playing! This final surprise unlocks when you've reached 2000 total points in the Valenverse." 
  }
];

export default function MediaVault() {
  const { progress } = useGameStore(); // Use this for real unlock logic later
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(MOCK_MEDIA);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch uploaded media on mount
  useEffect(() => {
    const fetchUserMedia = async () => {
      try {
        const { data } = await api.get('/media/vault');
        // Map backend media to frontend MediaItem interface
        const userUploads = data.map((item: any) => ({
          id: item.id,
          type: item.type,
          title: item.title,
          isUnlocked: true, // Uploads are always unlocked
          src: `${process.env.NEXT_PUBLIC_API_URL}${item.url}`, // Correctly prepend API URL
          thumbnail: item.type === 'IMAGE' || item.type === 'VIDEO' ? `${process.env.NEXT_PUBLIC_API_URL}${item.url}` : undefined,
        }));
        setMediaItems([...userUploads, ...MOCK_MEDIA]);
      } catch (error) {
        console.error('Failed to fetch user media', error);
      }
    };

    fetchUserMedia();
  }, []);

  // Group media by type
  const images = mediaItems.filter(m => m.type === 'IMAGE');
  const audio = mediaItems.filter(m => m.type === 'AUDIO');
  const videos = mediaItems.filter(m => m.type === 'VIDEO');

  const toggleAudio = (id: string) => {
    if (playingAudio === id) {
      setPlayingAudio(null);
      // Logic to actually pause audio
    } else {
      setPlayingAudio(id);
      // Logic to play audio
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Create FormData
    const formData = new FormData();
    formData.append('file', file);

    try {
      const { data } = await api.post('/media/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Add to state immediately
      const newItem: MediaItem = {
        id: data.id,
        type: data.type,
        title: data.title,
        isUnlocked: true,
        src: `${process.env.NEXT_PUBLIC_API_URL}${data.url}`,
        thumbnail: data.type === 'IMAGE' || data.type === 'VIDEO' ? `${process.env.NEXT_PUBLIC_API_URL}${data.url}` : undefined,
      };

      setMediaItems(prev => [newItem, ...prev]);
    } catch (error) {
      console.error('Upload failed', error);
      alert('Failed to upload media. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#fff5f5] w-full font-outfit p-6 md:p-12 pb-24 relative">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        className="hidden" 
        accept="image/*,video/*,audio/*"
      />
      
      {/* Floating Upload Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => fileInputRef.current?.click()}
        className="fixed bottom-8 right-8 w-14 h-14 bg-pink-500 text-white rounded-full shadow-lg flex items-center justify-center z-50 hover:bg-pink-600 transition-colors"
        title="Upload Memory"
      >
        <span className="text-2xl font-bold">+</span>
      </motion.button>

      {/* Header */}
      <div className="max-w-6xl mx-auto mb-12 relative flex flex-col items-center justify-center">
        <Link 
          href="/hub" 
          className="absolute left-0 top-0 flex items-center gap-2 text-pink-500 hover:text-pink-600 font-medium transition-colors"
        >
          <ArrowLeft size={20} /> Back to Hub
        </Link>
        <div className="text-center">
           <h1 className="text-4xl md:text-5xl font-bold text-[#ff4d6d] drop-shadow-sm mb-3 font-[family-name:var(--font-great-vibes)]">
            Media Vault Gallery
           </h1>
           <p className="text-gray-500 text-sm md:text-base">Relive our precious moments & unlock more love!</p>
        </div>
        <div className="mt-6 bg-pink-100 text-pink-600 px-6 py-2 rounded-full font-bold text-sm shadow-sm">
             Current Score: 450 Points
        </div>
      </div>

      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Pictures Section */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <span className="bg-pink-100 p-1.5 rounded-md text-pink-500"><ImageIcon size={18} /></span>
            <h2 className="text-xl font-bold text-gray-800">Our Pictures</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {images.map((item) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={item.isUnlocked ? { y: -5, rotate: Math.random() < 0.5 ? 1 : -1 } : {}}
                className={`bg-white p-3 pb-8 rounded-sm shadow-md hover:shadow-xl transition-all duration-300 relative ${!item.isUnlocked ? 'bg-gray-50' : ''}`}
                style={{ borderRadius: '4px' }} // Polaroid sharp corners? OR keep it slightly rounded as per screenshot which looks soft
              >
                  {/* Image Container */}
                  <div className={`aspect-square w-full bg-gray-100 mb-4 overflow-hidden relative ${!item.isUnlocked ? 'flex flex-col items-center justify-center border-dashed border-2 border-gray-200' : ''}`}>
                    {item.isUnlocked ? (
                         // Placeholder for real image
                        <div className="w-full h-full bg-pink-50 flex items-center justify-center text-pink-200">
                             {/* <Image ... /> */}
                             <ImageIcon size={48} />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center text-center p-4">
                            <Lock className="text-pink-500 mb-2" size={24} />
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Locked Moment</p>
                        </div>
                    )}
                  </div>

                  {/* Caption / Lock Requirement */}
                  <div className="text-center px-1">
                      {item.isUnlocked ? (
                          <h3 className="font-[family-name:var(--font-great-vibes)] text-xl text-[#ff4d6d]">
                              {item.title}
                          </h3>
                      ) : (
                          <div className="bg-white border border-gray-100 rounded-lg p-2 shadow-sm">
                              <p className="text-[10px] text-gray-500 font-medium leading-tight">
                                {item.unlockRequirement}
                              </p>
                          </div>
                      )}
                  </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Voice Notes Section */}
        <section>
          <h2 className="flex items-center gap-3 text-2xl font-bold text-gray-800 mb-8">
            <span className="bg-purple-100 p-2 rounded-lg text-purple-500"><Mic size={24} /></span>
            Voice Notes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {audio.map((item) => (
               <motion.div
                 key={item.id}
                 whileHover={item.isUnlocked ? { scale: 1.02 } : {}}
                 className={`relative rounded-2xl p-4 flex items-center gap-4 shadow-sm border ${
                    item.isUnlocked 
                    ? 'bg-white border-pink-100' 
                    : 'bg-gray-50 border-gray-100'
                 }`}
               >
                  <button 
                    disabled={!item.isUnlocked}
                    onClick={() => toggleAudio(item.id)}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-white transition-colors ${
                        item.isUnlocked 
                        ? 'bg-gradient-to-br from-pink-500 to-rose-500 shadow-md shadow-pink-200' 
                        : 'bg-gray-300'
                    }`}
                  >
                     {item.isUnlocked && playingAudio === item.id ? <Pause size={20} /> : (item.isUnlocked ? <Play size={20} /> : <Lock size={20} />)}
                  </button>
                  <div className="flex-1 overflow-hidden">
                     <h3 className={`font-bold text-sm truncate ${item.isUnlocked ? 'text-gray-800' : 'text-gray-400'}`}>{item.title}</h3>
                     <p className="text-xs text-gray-400 font-medium">{item.isUnlocked ? `Duration: ${item.duration}` : 'Locked'}</p>
                  </div>
                  {item.isUnlocked && (
                     <div className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-pink-400">
                        <Heart size={14} fill="currentColor" />
                     </div>
                  )}
               </motion.div>
            ))}
          </div>
        </section>

        {/* Videos Section */}
        <section>
          <h2 className="flex items-center gap-3 text-2xl font-bold text-gray-800 mb-8">
            <span className="bg-red-100 p-2 rounded-lg text-red-500"><Video size={24} /></span>
            Videos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {videos.map((item) => (
                <div key={item.id} className="w-full">
                     <div className={`relative aspect-video rounded-3xl overflow-hidden shadow-lg mb-4 ${!item.isUnlocked ? 'border-2 border-dashed border-pink-200 bg-pink-50' : ''}`}>
                         {item.isUnlocked ? (
                            <div className="w-full h-full bg-gray-900 group relative cursor-pointer">
                               {/* Placeholder for video thumbnail */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white border-2 border-white/50">
                                        <Play size={32} fill="currentColor" />
                                    </div>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                                    <h3 className="text-white font-bold text-lg">{item.title}</h3>
                                    <div className="flex items-center gap-2 text-white/80 text-xs mt-1">
                                        <span className="bg-white/20 px-2 py-1 rounded">Unlocked via Scratch Card</span>
                                    </div>
                                </div>
                            </div>
                         ) : (
                             <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
                                 <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                                     <Lock className="text-pink-400" size={24} />
                                 </div>
                                 <h3 className="text-pink-500 font-bold mb-2">Mystery Video</h3>
                                 <p className="text-gray-500 text-xs max-w-md mx-auto leading-relaxed">{item.unlockRequirement}</p>
                             </div>
                         )}
                     </div>
                </div>
             ))}
          </div>
        </section>

      </div>
    </div>
  );
}
