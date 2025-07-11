import React, { useState, useMemo } from 'react';
import Section from './Section';
import Grid from './Grid';
import DestinationCard from './DestinationCard';

const SearchableDestinations = ({ destinations, title = "Featured Destinations in Kenya", initialSearchTerm = '' }) => {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Filter destinations based on search term and category
  const filteredDestinations = useMemo(() => {
    return destinations.filter(destination => {
      const matchesSearch = searchTerm === '' || 
        destination.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        destination.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        destination.highlights.some(highlight => 
          highlight.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesCategory = selectedCategory === 'all' || 
        destination.highlights.some(highlight => 
          highlight.toLowerCase().includes(selectedCategory.toLowerCase())
        );

      return matchesSearch && matchesCategory;
    });
  }, [destinations, searchTerm, selectedCategory]);

  const categories = useMemo(() => {
    const allHighlights = destinations.flatMap(dest => dest.highlights);
    const uniqueCategories = [...new Set(allHighlights)];
    return ['all', ...uniqueCategories.slice(0, 8)]; // Limit to 8 categories for UI
  }, [destinations]);

  return (
    <Section title={title}>
      {/* Search and Filter Controls */}
      <div className="destination-controls" style={{ marginBottom: '2rem' }}>
        <div className="search-filter-container" style={{ 
          display: 'flex', 
          gap: '1rem', 
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          <input
            type="text"
            placeholder="Search destinations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '0.75rem 1rem',
              border: '2px solid #e0e0e0',
              borderRadius: '25px',
              minWidth: '250px',
              fontSize: '1rem'
            }}
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: '0.75rem 1rem',
              border: '2px solid #e0e0e0',
              borderRadius: '25px',
              fontSize: '1rem',
              minWidth: '150px'
            }}
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>
        
        {searchTerm && (
          <p style={{ 
            margin: '1rem 0 0 0', 
            color: '#666',
            fontSize: '0.9rem'
          }}>
            {filteredDestinations.length} destination{filteredDestinations.length !== 1 ? 's' : ''} found for "{searchTerm}"
          </p>
        )}
      </div>

      {/* Destinations Grid */}
      <Grid>
        {filteredDestinations.length > 0 ? (
          filteredDestinations.map(destination => (
            <DestinationCard 
              key={destination.id} 
              destination={destination} 
            />
          ))
        ) : (
          <div style={{ 
            gridColumn: '1 / -1', 
            textAlign: 'center', 
            padding: '3rem 1rem',
            color: '#666'
          }}>
            <h3>No destinations found</h3>
            <p>Try adjusting your search terms or filters</p>
          </div>
        )}
      </Grid>
    </Section>
  );
};

export default SearchableDestinations;
