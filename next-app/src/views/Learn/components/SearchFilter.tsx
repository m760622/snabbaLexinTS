import React from 'react';

interface SearchFilterProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    currentFilter: string;
    setCurrentFilter: (filter: string) => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({ 
    searchQuery, 
    setSearchQuery, 
    currentFilter, 
    setCurrentFilter 
}) => {
    const [isExpanded, setIsExpanded] = React.useState(false);

    return (
        <div className="search-filter-section">
            <div className="search-container">
                <input 
                    type="text" 
                    id="lessonSearchInput" 
                    placeholder="Sök lektioner / ابحث عن درس..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button 
                    id="filterToggleBtn" 
                    className={`filter-toggle-btn ${isExpanded ? 'active' : ''}`} 
                    aria-label="Toggle Filters"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                    </svg>
                </button>
            </div>
            <div className={`filter-scroll-container ${isExpanded ? 'expanded' : ''}`}>
                <button 
                    className={`filter-chip ${currentFilter === 'all' ? 'active' : ''}`} 
                    onClick={() => setCurrentFilter('all')}
                >
                    <span className="sv-text">Alla</span>
                    <span className="ar-text">الكل</span>
                </button>
                <button 
                    className={`filter-chip filter-beginner ${currentFilter === 'beginner' ? 'active' : ''}`} 
                    onClick={() => setCurrentFilter('beginner')}
                >
                    <span className="sv-text">Nybörjare</span>
                    <span className="ar-text">مبتدئ</span>
                </button>
                <button 
                    className={`filter-chip filter-intermediate ${currentFilter === 'intermediate' ? 'active' : ''}`} 
                    onClick={() => setCurrentFilter('intermediate')}
                >
                    <span className="sv-text">Medel</span>
                    <span className="ar-text">متوسط</span>
                </button>
                <button 
                    className={`filter-chip filter-advanced ${currentFilter === 'advanced' ? 'active' : ''}`} 
                    onClick={() => setCurrentFilter('advanced')}
                >
                    <span className="sv-text">Avancerad</span>
                    <span className="ar-text">متقدم</span>
                </button>
            </div>
        </div>
    );
};

export default SearchFilter;
