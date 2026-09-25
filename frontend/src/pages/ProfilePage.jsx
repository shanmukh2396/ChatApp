import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import ConnectHubLogo from '../components/common/ConnectHubLogo';
import PrismaticBurst from '../components/backgrounds/PrismaticBurst';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  Camera,
  Check,
  Loader2,
  ShieldCheck,
} from 'lucide-react';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
  const [address, setAddress] = useState(user?.address || '');
  const [bio, setBio] = useState(user?.bio || '');

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

    if (phoneNumber && phoneNumber.trim().length > 25) {
      return toast.error('Phone number cannot exceed 25 characters');
    }
    if (address && address.length > 200) {
      return toast.error('Address cannot exceed 200 characters');
    }
    if (bio && bio.length > 300) {
      return toast.error('Bio cannot exceed 300 characters');
    }

    setSaving(true);
    try {
      const { data } = await api.put('/users/profile', {
        name: name.trim(),
        avatar,
        phoneNumber: phoneNumber.trim(),
        address: address.trim(),
        bio: bio.trim(),
      });
      if (data.success) {
        updateUser(data.data);
        toast.success('Profile updated successfully!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#071a0f] flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* ─── Animated PrismaticBurst Ambient Background Effect ───────────── */}
      <PrismaticBurst
        color1="#042f1a"
        color2="#064e3b"
        color3="#059669"
        color4="#10b981"
        speed={0.25}
        intensity={0.5}
        rays={16.0}
        grain={0.03}
        mouseInfluence={0.25}
        opacity={0.4}
      />

      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/3 w-[450px] h-[450px] bg-[#10B981]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-xl relative z-10 my-8">
        {/* Top Back Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0c2417]/80 hover:bg-[#18422b] text-[#9bb8a8] hover:text-white border border-[#18422b] text-xs font-bold transition-all shadow-md"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Messages</span>
          </button>

          <ConnectHubLogo size="sm" variant="dark" showTagline={false} showCHMark={true} />
        </div>

        {/* Profile Card */}
        <div className="bg-[#0c2417]/90 backdrop-blur-xl border border-[#18422b] rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              User Profile & Settings
            </h1>
            <p className="text-xs text-[#9bb8a8] mt-1">
              Manage your personal information and profile appearance
            </p>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            {/* Avatar Section */}
            <div className="flex flex-col items-center">
              <div className="relative group cursor-pointer mb-2">
                <img
                  src={avatar || 'https://ui-avatars.com/api/?name=User'}
                  alt={name}
                  className="w-24 h-24 rounded-3xl object-cover border-2 border-[#10B981]/60 shadow-xl"
                />
                <label className="absolute inset-0 rounded-3xl bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-xs cursor-pointer transition-opacity backdrop-blur-sm">
                  {uploading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      <Camera className="w-6 h-6 mb-1 text-[#6ee7b7]" />
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
              <p className="text-[11px] text-[#9bb8a8]">Hover and click photo to upload new avatar</p>
            </div>

            {/* Grid: Full Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-[#9bb8a8] uppercase tracking-wider mb-1.5">
                  Full Name <span className="text-[#10B981]">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9bb8a8] w-4 h-4" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#071a0f] text-white border border-[#18422b] rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/20 transition-all"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-[#9bb8a8] uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9bb8a8] w-4 h-4" />
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="w-full bg-[#071a0f]/60 text-[#9bb8a8] border border-[#18422b]/60 rounded-xl pl-10 pr-4 py-2.5 text-xs cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Grid: Phone Number & Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Phone Number */}
              <div>
                <label className="block text-xs font-bold text-[#9bb8a8] uppercase tracking-wider mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9bb8a8] w-4 h-4" />
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={phoneNumber}
                    maxLength={25}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full bg-[#071a0f] text-white placeholder-[#9bb8a8]/50 border border-[#18422b] rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/20 transition-all"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-[#9bb8a8] uppercase tracking-wider">
                    Address
                  </label>
                  <span className="text-[10px] text-[#9bb8a8]">{address.length}/200</span>
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9bb8a8] w-4 h-4" />
                  <input
                    type="text"
                    placeholder="City, Country"
                    maxLength={200}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-[#071a0f] text-white placeholder-[#9bb8a8]/50 border border-[#18422b] rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/20 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Description / About Bio */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-[#9bb8a8] uppercase tracking-wider">
                  About / Bio
                </label>
                <span className="text-[10px] text-[#9bb8a8]">{bio.length}/300</span>
              </div>
              <div className="relative">
                <textarea
                  rows={3}
                  maxLength={300}
                  placeholder="Share a short bio or status message..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-[#071a0f] text-white placeholder-[#9bb8a8]/50 border border-[#18422b] rounded-xl p-3 text-xs focus:outline-none focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/20 transition-all resize-none"
                />
              </div>
            </div>

            {/* Privacy note */}
            <div className="flex items-center gap-2 p-3 rounded-xl bg-[#18422b]/40 border border-[#18422b] text-[11px] text-[#9bb8a8]">
              <ShieldCheck className="w-4 h-4 text-[#10B981] shrink-0" />
              <span>Your address is only visible on your private profile. Phone number & bio are shared with contacts.</span>
            </div>

            {/* Save Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={saving || uploading}
                className="w-full py-3 rounded-2xl bg-[#10B981] hover:bg-[#059669] active:bg-[#047857] text-white font-bold text-sm shadow-lg shadow-[#10B981]/25 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
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

