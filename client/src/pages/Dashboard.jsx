import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Loader, AlertCircle, CheckCircle, Search, Filter, Map as MapIcon, List, Zap } from 'lucide-react';

// --- Skeleton Component ---
const CardSkeleton = () => (
    <div className="bg-white dark:bg-slate-800/50 p-4 rounded-3xl border border-gray-100 dark:border-slate-700 flex gap-4 animate-pulse">
        <div className="w-28 h-28 flex-shrink-0 bg-gray-200 dark:bg-slate-700 rounded-2xl"></div>
        <div className="flex-1 flex flex-col py-2">
            <div className="flex justify-between items-start mb-3">
                <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-16"></div>
            </div>
            <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-24 mb-3"></div>
            <div className="space-y-2 mb-4">
                <div className="h-3 bg-gray-100 dark:bg-slate-700/50 rounded w-full"></div>
                <div className="h-3 bg-gray-100 dark:bg-slate-700/50 rounded w-4/5"></div>
            </div>
            <div className="mt-auto h-8 bg-gray-200 dark:bg-slate-700 rounded w-full"></div>
        </div>
    </div>
);

const Dashboard = () => {
    const [lostItems, setLostItems] = useState([]);
    const [foundItems, setFoundItems] = useState([]);
    const [matches, setMatches] = useState({});
    const [loading, setLoading] = useState(true);

    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [viewMode, setViewMode] = useState('list');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Mock delay to show premium skeleton loader
                await new Promise(resolve => setTimeout(resolve, 800));

                const [lostRes, foundRes] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_API_URL}/api/lost`),
                    axios.get(`${import.meta.env.VITE_API_URL}/api/found`)
                ]);
                setLostItems(lostRes.data);
                setFoundItems(foundRes.data);

                const matchPromises = [...lostRes.data, ...foundRes.data].map(item =>
                    axios.get(`${import.meta.env.VITE_API_URL}/api/matches/${item.id}`).catch(() => ({ data: [] }))
                );
                const matchResults = await Promise.all(matchPromises);

                const matchesMap = {};
                [...lostRes.data, ...foundRes.data].forEach((item, index) => {
                    matchesMap[item.id] = matchResults[index].data || [];
                });
                setMatches(matchesMap);

            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filterItems = (items) => {
        return items.filter(item => {
            const matchesSearch = item.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                  item.description?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = filterCategory ? item.category === filterCategory : true;
            return matchesSearch && matchesCategory;
        });
    };

    const filteredLost = filterItems(lostItems);
    const filteredFound = filterItems(foundItems);

    return (
        <div className="min-h-[calc(100vh-80px)] bg-mesh pb-24">
            <div className="container mx-auto px-4 md:px-8 py-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
                    <div>
                        <h1 className="text-4xl font-display font-bold text-slate-900 dark:text-white mb-2">Live Dashboard</h1>
                        <p className="text-slate-500 dark:text-slate-400">Monitor unified real-time reporting metrics</p>
                    </div>
                    
                    <div className="flex glass p-1.5 rounded-xl">
                        <button 
                            onClick={() => setViewMode('list')}
                            className={`flex items-center px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-300 ${viewMode === 'list' ? 'bg-primary text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:text-primary'}`}
                        >
                            <List className="w-4 h-4 mr-2" /> List
                        </button>
                        <button 
                            onClick={() => setViewMode('map')}
                            className={`flex items-center px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-300 ${viewMode === 'map' ? 'bg-primary text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:text-primary'}`}
                        >
                            <MapIcon className="w-4 h-4 mr-2" /> Map View
                        </button>
                    </div>
                </div>

                <div className="glass p-3 rounded-2xl mb-12 flex flex-col md:flex-row gap-3 relative z-20">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-primary transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Search any keyword or item description..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-transparent border-2 border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl focus:ring-0 focus:outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-primary/30 dark:focus:border-primary/50 text-slate-900 dark:text-white transition-all shadow-none focus:shadow-sm"
                        />
                    </div>
                    <div className="w-px bg-slate-200 dark:bg-slate-700 hidden md:block my-2"></div>
                    <div className="relative w-full md:w-64 flex-shrink-0 group">
                        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-primary transition-colors" />
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-transparent border-2 border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl focus:ring-0 focus:outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-primary/30 dark:focus:border-primary/50 text-slate-900 dark:text-white transition-all shadow-none focus:shadow-sm appearance-none cursor-pointer font-medium"
                        >
                            <option value="">All Categories</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Clothing">Clothing</option>
                            <option value="Wallet/Bag">Wallet/Bag</option>
                            <option value="Keys">Keys</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>

                {viewMode === 'map' ? (
                    <div className="w-full h-[650px] glass rounded-3xl flex flex-col items-center justify-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-slate-100 dark:bg-slate-800/50 opacity-50 z-0"></div>
                        <div className="relative z-10 text-center animate-fade-in-up">
                            <div className="bg-white dark:bg-slate-700 p-6 rounded-3xl shadow-premium mb-6 inline-block">
                                <MapIcon className="w-16 h-16 text-primary mb-0" />
                            </div>
                            <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-2">Interactive Maps Alpha</h3>
                            <p className="text-slate-500 dark:text-slate-400 font-medium max-w-sm mx-auto">Visualizing {filteredLost.length} lost and {filteredFound.length} found reports dynamically across the campus area.</p>
                        </div>
                        
                        <div className="absolute top-[20%] left-[25%] animate-bounce shadow-xl rounded-full"><MapPin className="w-10 h-10 text-red-500 relative z-10" /></div>
                        <div className="absolute top-[35%] right-[30%] animate-bounce shadow-xl rounded-full" style={{animationDelay: '0.3s'}}><MapPin className="w-10 h-10 text-emerald-500 relative z-10" /></div>
                        <div className="absolute bottom-[25%] left-[35%] animate-bounce shadow-xl rounded-full" style={{animationDelay: '0.6s'}}><MapPin className="w-10 h-10 text-blue-500 relative z-10" /></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 relative z-10">
                        {/* LOST ITEMS COLUMN */}
                        <div className="flex flex-col">
                            <div className="flex justify-between items-center mb-6 pl-2">
                                <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white flex items-center">
                                    <span className="w-3 h-3 rounded-full bg-red-500 mr-3 animate-pulse"></span>
                                    Lost Reports
                                </h2>
                                <span className="glass px-3 py-1 rounded-full text-sm font-bold text-slate-700 dark:text-slate-300">{filteredLost.length}</span>
                            </div>
                            <div className="space-y-5">
                                {loading ? (
                                    <> <CardSkeleton /> <CardSkeleton /> <CardSkeleton /> </>
                                ) : filteredLost.length === 0 ? (
                                    <div className="p-12 text-center glass rounded-3xl border-dashed border-2">
                                        <p className="text-slate-500">No lost items match your filters.</p>
                                    </div>
                                ) : (
                                    filteredLost.map(item => <ItemCard key={item.id} item={item} matches={matches[item.id]} type="lost" />)
                                )}
                            </div>
                        </div>

                        {/* FOUND ITEMS COLUMN */}
                        <div className="flex flex-col">
                            <div className="flex justify-between items-center mb-6 pl-2">
                                <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white flex items-center">
                                    <span className="w-3 h-3 rounded-full bg-emerald-500 mr-3 animate-pulse"></span>
                                    Found Reports
                                </h2>
                                <span className="glass px-3 py-1 rounded-full text-sm font-bold text-slate-700 dark:text-slate-300">{filteredFound.length}</span>
                            </div>
                            <div className="space-y-5">
                                {loading ? (
                                    <> <CardSkeleton /> <CardSkeleton /> <CardSkeleton /> </>
                                ) : filteredFound.length === 0 ? (
                                    <div className="p-12 text-center glass rounded-3xl border-dashed border-2">
                                        <p className="text-slate-500">No found items match your filters.</p>
                                    </div>
                                ) : (
                                    filteredFound.map(item => <ItemCard key={item.id} item={item} matches={matches[item.id]} type="found" />)
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const ItemCard = ({ item, matches, type }) => {
    const isMatchFound = matches && matches.length > 0;

    return (
        <div className="glass glass-hover p-4 rounded-3xl flex gap-5 group items-stretch cursor-pointer relative overflow-hidden">
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
            
            <div className="w-28 h-28 md:w-32 md:h-32 flex-shrink-0 bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden relative shadow-inner">
                {item.imageUrl ? (
                    <img
                        src={item.imageUrl.startsWith('data:') ? item.imageUrl : `${import.meta.env.VITE_API_URL}${item.imageUrl}`}
                        alt={item.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 text-xs">
                        <Camera className="w-6 h-6 mb-1 opacity-50" />
                        No Photo
                    </div>
                )}
            </div>

            <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                    <div className="flex justify-between items-start mb-1 gap-2">
                        <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white line-clamp-1 group-hover:text-primary transition-colors">{item.title}</h3>
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">{new Date(item.date).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}</span>
                    </div>
                    <div className="inline-block px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-bold mb-2 uppercase tracking-wide">{item.category}</div>
                    <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">{item.description}</p>
                </div>

                <div className="mt-3">
                    {isMatchFound ? (
                        <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl p-2.5 text-sm transition-all">
                            <div className="flex items-center text-emerald-700 dark:text-emerald-400 font-bold mb-1">
                                <Zap className="w-4 h-4 mr-1.5 fill-current" />
                                {matches.length} Match{matches.length > 1 ? 'es' : ''} Found
                            </div>
                            <div className="text-xs text-emerald-600 dark:text-emerald-500/80 font-medium truncate">
                                Best: <span className="font-bold">{matches[0].item.title}</span>
                            </div>
                        </div>
                    ) : (
                        <div className="text-xs text-slate-400 dark:text-slate-500 flex items-center bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-transparent font-medium">
                            <AlertCircle className="w-4 h-4 mr-1.5" />
                            AI is scanning...
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
