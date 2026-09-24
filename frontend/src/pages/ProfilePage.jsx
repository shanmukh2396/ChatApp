import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { FiArrowLeft, FiUser, FiMail, FiCamera, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      return toast.error('Please select a valid image file');
    }

    if (file.size > 5 * 1024 * 1024) {
      return toast.error('Image size must be under 5 MB');
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const { data } = await api.post('/uploads', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (data.success) {
        setAvatar(data.data.url);
        toast.success('Avatar uploaded! Click Save Changes to apply.');
      }
    } catch (err) {
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error('Name cannot be empty');

    setSaving(true);
    try {
      const { data } = await api.put('/users/profile', {
        name: name.trim(),
        avatar,
      });
      if (data.success) {
        updateUser(data.data);
        toast.success('Profile updated successfully!');
        navigate('/');
      }
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-surface flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Top Back Button */}
        <button
          onClick={() => navigate('/')}
          className="btn-ghost mb-4 text-slate-300 hover:text-white"
        >
          <FiArrowLeft className="w-5 h-5" /> Back to Chats
        </button>

        <div className="card p-6 sm:p-8 bg-surface-card border-surface-border shadow-2xl">
          <h1 className="text-xl font-bold text-white mb-6 text-center">
            Your Profile
          </h1>

          <form onSubmit={handleSave} className="space-y-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center">
              <div className="relative group cursor-pointer mb-2">
                <img
                  src={avatar || 'https://ui-avatars.com/api/?name=User'}
                  alt={name}
                  className="w-24 h-24 avatar border-2 border-primary-500/40 shadow-xl"
                />
                <label className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-xs cursor-pointer transition-opacity">
                  <FiCamera className="w-6 h-6 mb-1" />
                  <span>{uploading ? 'Uploading...' : 'Change'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-[11px] text-slate-400">Click image to change avatar</p>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Full Name
              </label>
              <div className="relative">
                <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input pl-11"
                />
              </div>
            </div>

            {/* Email (read only) */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Email Address (read-only)
              </label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="input pl-11 text-slate-400 cursor-not-allowed bg-surface/60"
                />
              </div>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              disabled={saving || uploading}
              className="btn-primary w-full py-3 text-base shadow-lg shadow-primary-600/30"
            >
              {saving ? 'Saving changes...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
