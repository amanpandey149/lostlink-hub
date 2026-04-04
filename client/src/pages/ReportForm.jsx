import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Camera, Upload, Loader, X, UploadCloud, MapPin, AlignLeft, Info, CheckCircle, Loader2 } from 'lucide-react';

const ReportForm = () => {
    const { type } = useParams(); // 'lost' or 'found'
    const navigate = useNavigate();
    const isLost = type === 'lost';

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        contact: '',
        location: '',
        date: new Date().toISOString().split('T')[0]
    });
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    
    // Drag & Drop specific state
    const [isDragActive, setIsDragActive] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const processFile = (file) => {
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            alert('Please upload a valid image file.');
            return;
        }

        setIsUploading(true);
        // Simulate premium upload progress
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            setUploadProgress(progress);
            if(progress >= 100) {
                clearInterval(interval);
                setImage(file);
                setPreview(URL.createObjectURL(file));
                setIsUploading(false);
                setUploadProgress(0);
            }
        }, 80);
    };

    const handleImageChange = (e) => {
        processFile(e.target.files[0]);
    };

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(true);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            processFile(e.dataTransfer.files[0]);
        }
    };

    const clearImage = (e) => {
        e.preventDefault(); // Prevent form submission
        setImage(null);
        setPreview(null);
        if(fileInputRef.current) fileInputRef.current.value = '';
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        if (image) data.append('image', image);

        try {
            const endpoint = `${import.meta.env.VITE_API_URL}/api/${type}`;
            await axios.post(endpoint, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            // Brief success state before redirect
            setTimeout(() => navigate('/dashboard'), 600);
        } catch (error) {
            console.error('Error submitting report:', error);
            alert('Failed to submit report.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-80px)] bg-mesh py-12 px-4 flex justify-center items-center overflow-hidden">
            <div className="max-w-3xl w-full glass p-8 md:p-12 rounded-3xl shadow-premium relative animate-fade-in-up">
                
                {/* Decorative background accent */}
                <div className={`absolute top-0 right-0 w-64 h-64 -translate-y-1/2 translate-x-1/2 rounded-full blur-3xl opacity-20 pointer-events-none ${isLost ? 'bg-red-500' : 'bg-emerald-500'}`}></div>

                <div className="text-center mb-10 relative z-10">
                    <div className={`inline-flex items-center justify-center p-4 rounded-2xl mb-4 ${isLost ? 'bg-red-50 dark:bg-red-500/10 text-red-500' : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500'}`}>
                        {isLost ? <Camera className="w-8 h-8" /> : <MapPin className="w-8 h-8" />}
                    </div>
                    <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-2">
                        {isLost ? 'Report a Lost Item' : 'Report a Found Item'}
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">
                        {isLost ? 'Provide details to help our AI match it seamlessly with found items.' : 'Thank you for helping! Provide details to find the owner quickly.'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8 relative z-10">

                    {/* Drag and Drop Image Upload */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 uppercase tracking-wider">Item Photo (Crucial for AI Match)</label>
                        <div 
                            onDragEnter={handleDragEnter}
                            onDragLeave={handleDragLeave}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            onClick={() => !preview && !isUploading && fileInputRef.current?.click()}
                            className={`relative w-full h-64 rounded-3xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center overflow-hidden cursor-pointer
                                ${isDragActive ? 'border-primary bg-primary/5 scale-[1.02]' : 'border-slate-200 dark:border-slate-700 hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 bg-white/50 dark:bg-slate-800/30'}
                                ${preview ? 'border-transparent' : ''}
                            `}
                        >
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                                ref={fileInputRef}
                                required={!image}
                            />
                            
                            {preview ? (
                                <div className="absolute inset-0 group">
                                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3">
                                        <button 
                                            type="button" 
                                            onClick={clearImage}
                                            className="bg-white text-red-500 font-bold px-4 py-2 rounded-xl shadow-lg hover:bg-red-50 flex items-center transition-colors"
                                        >
                                            <X className="w-4 h-4 mr-2" /> Remove Image
                                        </button>
                                    </div>
                                </div>
                            ) : isUploading ? (
                                <div className="flex flex-col items-center text-primary">
                                    <Loader2 className="w-10 h-10 animate-spin mb-4" />
                                    <p className="font-bold mb-2">Analyzing Image...</p>
                                    <div className="w-48 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-primary transition-all duration-100 ease-out" style={{ width: `${uploadProgress}%` }}></div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center p-6 pointer-events-none">
                                    <div className={`mx-auto w-16 h-16 mb-4 rounded-2xl flex items-center justify-center ${isDragActive ? 'bg-primary text-white animate-bounce' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                                        <UploadCloud className="w-8 h-8" />
                                    </div>
                                    <p className="font-bold mb-1 text-slate-700 dark:text-slate-300">Drag and drop your image here</p>
                                    <p className="text-sm text-slate-400">SVG, PNG, JPG or GIF (max. 5MB)</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Title</label>
                            <div className="relative group">
                                <AlignLeft className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors w-5 h-5" />
                                <input 
                                    type="text" 
                                    name="title" 
                                    required 
                                    value={formData.title} 
                                    onChange={handleChange} 
                                    placeholder={`e.g. ${isLost ? 'Black Leather Wallet' : 'Blue Backpack'}`}
                                    className="w-full pl-12 pr-4 py-3.5 bg-white/50 dark:bg-slate-800/50 border-2 border-slate-200/50 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-primary/20 focus:outline-none focus:border-primary focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white transition-all font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Category</label>
                            <div className="relative group">
                                <Info className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors w-5 h-5 pointer-events-none" />
                                <select 
                                    name="category" 
                                    required 
                                    value={formData.category} 
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-3.5 bg-white/50 dark:bg-slate-800/50 border-2 border-slate-200/50 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-primary/20 focus:outline-none focus:border-primary focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white transition-all font-medium appearance-none cursor-pointer"
                                >
                                    <option value="" disabled>Select a category</option>
                                    <option value="Electronics">Electronics</option>
                                    <option value="Clothing">Clothing</option>
                                    <option value="Wallet/Bag">Wallet/Bag</option>
                                    <option value="Keys">Keys</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Location</label>
                            <div className="relative group">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors w-5 h-5" />
                                <input 
                                    type="text" 
                                    name="location" 
                                    required 
                                    value={formData.location} 
                                    onChange={handleChange} 
                                    placeholder="e.g. Main Library, 2nd floor"
                                    className="w-full pl-12 pr-4 py-3.5 bg-white/50 dark:bg-slate-800/50 border-2 border-slate-200/50 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-primary/20 focus:outline-none focus:border-primary focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white transition-all font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Date {isLost ? 'Lost' : 'Found'}</label>
                            <div className="relative group">
                                <input 
                                    type="date" 
                                    name="date" 
                                    required 
                                    value={formData.date} 
                                    onChange={handleChange}
                                    className="w-full px-4 py-3.5 bg-white/50 dark:bg-slate-800/50 border-2 border-slate-200/50 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-primary/20 focus:outline-none focus:border-primary focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white transition-all font-medium"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1 md:col-span-1">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Contact Details</label>
                            <input 
                                type="text" 
                                name="contact" 
                                required 
                                value={formData.contact} 
                                onChange={handleChange} 
                                placeholder="Email or Phone Number"
                                className="w-full p-4 bg-white/50 dark:bg-slate-800/50 border-2 border-slate-200/50 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-primary/20 focus:outline-none focus:border-primary focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white transition-all font-medium"
                            />
                        </div>

                        <div className="space-y-1 md:col-span-1">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Detailed Description</label>
                            <textarea 
                                name="description" 
                                required 
                                value={formData.description} 
                                onChange={handleChange} 
                                rows="3" 
                                placeholder="Any distinguishing marks, specific contents, etc."
                                className="w-full p-4 bg-white/50 dark:bg-slate-800/50 border-2 border-slate-200/50 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-primary/20 focus:outline-none focus:border-primary focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white transition-all font-medium resize-none"
                            ></textarea>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className={`w-full py-4 rounded-2xl font-display font-bold text-lg text-white shadow-lg transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex justify-center items-center ${isLost ? 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700' : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700'} ${loading ? 'opacity-75 cursor-not-allowed transform-none hover:transform-none' : ''}`}
                    >
                        {loading ? (
                            <> <Loader className="w-5 h-5 mr-2 animate-spin" /> Submitting to Database... </>
                        ) : (
                            <> {isLost ? 'Submit Lost Report' : 'Submit Found Report'} <Upload className="w-5 h-5 ml-2" /> </>
                        )}
                    </button>

                    {!loading && (
                        <div className="text-center mt-4">
                            <span className="text-xs font-semibold text-slate-500 flex items-center justify-center"><CheckCircle className="w-3 h-3 mr-1" /> Safe & Secure Submission</span>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default ReportForm;
