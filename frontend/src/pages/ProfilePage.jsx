import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import ConnectHubLogo from '../components/common/ConnectHubLogo';
import { ArrowLeft, User, Mail, Camera, Check, Loader2 } from 'lucide-react';
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
    <div className="min-h-screen w-full bg-[#11121d] flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/3 w-[450px] h-[450px] bg-[#F20D3A]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Top Back Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#171827] hover:bg-[#202235] text-[#9293A5] hover:text-white border border-[#202235] text-xs font-bold transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Messages</span>
          </button>

          <ConnectHubLogo size="sm" variant="dark" showTagline={false} />
        </div>

        {/* Profile Card */}
        <div className="bg-[#171827] border border-[#202235] rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80">
          <h1 className="text-xl font-extrabold text-white mb-6 text-center tracking-tight">
            Account Profile
          </h1>

          <form onSubmit={handleSave} className="space-y-5">
            {/* Avatar Section */}
            <div className="flex flex-col items-center">
              <div className="relative group cursor-pointer mb-2">
                <img
                  src={avatar || 'https://ui-avatars.com/api/?name=User'}
                  alt={name}
                  className="w-24 h-24 rounded-3xl object-cover border-2 border-[#F20D3A]/60 shadow-xl"
                />
                <label className="absolute inset-0 rounded-3xl bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-xs cursor-pointer transition-opacity backdrop-blur-sm">
                  {uploading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      <Camera className="w-6 h-6 mb-1 text-[#FF8BA2]" />
                      <span className="font-bold">Change</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-[11px] text-[#9293A5]">Hover and click photo to upload new avatar</p>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-[#9293A5] uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9293A5] w-4 h-4" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#131420] text-white border border-[#202235] rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#F20D3A] focus:ring-2 focus:ring-[#F20D3A]/20 transition-all"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold text-[#9293A5] uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9293A5] w-4 h-4" />
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full bg-[#131420]/60 text-[#9293A5] border border-[#202235]/60 rounded-xl pl-10 pr-4 py-2.5 text-sm cursor-not-allowed"
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={saving || uploading}
                className="w-full py-3 rounded-2xl bg-[#F20D3A] hover:bg-[#D90B32] active:bg-[#A80729] text-white font-bold text-sm shadow-lg shadow-[#F20D3A]/25 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving Profile...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
