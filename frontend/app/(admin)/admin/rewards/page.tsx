'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Trash2, Plus, Image, Music, Video, FileText, Heart } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

type MediaType = 'IMAGE' | 'VIDEO' | 'AUDIO' | 'TEXT' | 'COMPLIMENT';

interface Media {
  id: string;
  title: string;
  description?: string;
  type: MediaType;
  url: string;
  requiredGame: string;
  threshold: any;
}

const GAME_IDS = [
  { id: 'scratch', name: 'Scratch Card' },
  { id: 'catch-hearts', name: 'Catch Hearts' },
  { id: 'bouquet', name: 'Bouquet Builder' },
  { id: 'rpg', name: 'Love Story RPG' },
  { id: 'compliment', name: 'Compliment Bot' },
];

export default function AdminPanel() {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'COMPLIMENT' as MediaType,
    requiredGame: 'scratch',
    file: null as File | null,
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/media`);
      const data = await response.json();
      setMedia(data);
    } catch (error) {
      console.error('Failed to fetch media:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      if (formData.type === 'TEXT' || formData.type === 'COMPLIMENT') {
        // Text/Compliment reward (no file)
        await fetch(`${API_URL}/admin/media/text`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: formData.title,
            description: formData.description,
            type: formData.type,
            requiredGame: formData.requiredGame,
            threshold: {},
          }),
        });
      } else {
        // Media upload (IMAGE, VIDEO, AUDIO)
        const data = new FormData();
        if (formData.file) {
          data.append('file', formData.file);
        }
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('type', formData.type);
        data.append('requiredGame', formData.requiredGame);
        data.append('threshold', JSON.stringify({}));

        await fetch(`${API_URL}/admin/media/upload`, {
          method: 'POST',
          body: data,
        });
      }

      // Reset form
      setFormData({
        title: '',
        description: '',
        type: 'COMPLIMENT',
        requiredGame: 'scratch',
        file: null,
      });
      setShowForm(false);
      fetchMedia();
    } catch (error) {
      console.error('Failed to create reward:', error);
      alert('Failed to create reward. Check console for details.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this reward?')) return;

    try {
      await fetch(`${API_URL}/admin/media/${id}`, {
        method: 'DELETE',
      });
      fetchMedia();
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  const getIcon = (type: MediaType) => {
    switch (type) {
      case 'IMAGE':
        return <Image className="text-blue-500" />;
      case 'VIDEO':
        return <Video className="text-purple-500" />;
      case 'AUDIO':
        return <Music className="text-green-500" />;
      case 'TEXT':
        return <FileText className="text-gray-500" />;
      case 'COMPLIMENT':
        return <Heart className="text-pink-500" />;
      default:
        return <FileText className="text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-2xl font-bold text-pink-600 animate-pulse">Loading Admin Panel...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">🎁 Rewards Admin Panel</h1>
            <p className="text-gray-600">Manage your media rewards for all games</p>
          </div>
          <motion.button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold shadow-lg hover:shadow-xl transition-shadow"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus size={20} />
            Add New Reward
          </motion.button>
        </div>

        {/* Create Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-2xl shadow-xl p-8 mb-8"
            >
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New Reward</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Title</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none transition-colors"
                      placeholder="e.g., Our First Date"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as MediaType })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none transition-colors"
                    >
                      <option value="COMPLIMENT">Compliment</option>
                      <option value="TEXT">Text Message</option>
                      <option value="IMAGE">Image</option>
                      <option value="VIDEO">Video</option>
                      <option value="AUDIO">Audio</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Game</label>
                    <select
                      value={formData.requiredGame}
                      onChange={(e) => setFormData({ ...formData, requiredGame: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none transition-colors"
                    >
                      {GAME_IDS.map((game) => (
                        <option key={game.id} value={game.id}>
                          {game.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {(formData.type === 'IMAGE' || formData.type === 'VIDEO' || formData.type === 'AUDIO') && (
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">File</label>
                      <input
                        type="file"
                        required={true}
                        accept={
                          formData.type === 'IMAGE'
                            ? 'image/*'
                            : formData.type === 'VIDEO'
                            ? 'video/*'
                            : 'audio/*'
                        }
                        onChange={(e) =>
                          setFormData({ ...formData, file: e.target.files?.[0] || null })
                        }
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none transition-colors"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Description / Compliment Text
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none transition-colors"
                    placeholder={
                      formData.type === 'COMPLIMENT'
                        ? 'Enter a sweet compliment here...'
                        : 'Optional description or message'
                    }
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={uploading}
                    className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-shadow"
                  >
                    {uploading ? 'Creating...' : 'Create Reward'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-8 py-4 border-2 border-gray-300 rounded-xl font-bold hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Media Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {media.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              {/* Preview */}
              <div className="h-48 bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center p-4">
                {item.type === 'IMAGE' && (
                  <img src={item.url} alt={item.title} className="max-h-full object-contain" />
                )}
                {item.type === 'VIDEO' && (
                  <video src={item.url} className="max-h-full" controls />
                )}
                {item.type === 'AUDIO' && (
                  <div className="text-center">
                    <Music size={64} className="text-green-500 mx-auto mb-4" />
                    <audio src={item.url} controls className="w-full" />
                  </div>
                )}
                {(item.type === 'TEXT' || item.type === 'COMPLIMENT') && (
                  <div className="text-center">
                    {getIcon(item.type)}
                    <p className="mt-4 text-gray-700 font-handwriting text-lg">
                      {item.description || item.title}
                    </p>
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  {getIcon(item.type)}
                  <span className="text-xs font-bold text-gray-500 uppercase">{item.type}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Game: <span className="font-bold">{item.requiredGame}</span>
                </p>

                {/* Actions */}
                <button
                  onClick={() => handleDelete(item.id)}
                  className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 py-3 rounded-xl font-bold hover:bg-red-100 transition-colors"
                >
                  <Trash2 size={18} />
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {media.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No Rewards Yet</h3>
            <p className="text-gray-500">Click "Add New Reward" to create your first reward!</p>
          </div>
        )}
      </div>
    </div>
  );
}
