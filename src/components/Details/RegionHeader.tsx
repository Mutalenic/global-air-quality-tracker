import React, { useMemo } from 'react';
import { Country } from '../../store/useAppStore';
import './RegionHeader.css';

interface RegionHeaderProps {
  regionName: string;
  regionImage: string | null;
  countries: Country[];
  selectedSubregion: string | null;
  onSelectSubregion: (subregion: string | null) => void;
}

interface RegionStat {
  label: string;
  value: string;
}

/**
 * RegionHeader component displaying region name, map, stats bar,
 * and clickable subregion filter chips.
 */
const RegionHeader: React.FC<RegionHeaderProps> = React.memo(
  ({ regionName, regionImage, countries, selectedSubregion, onSelectSubregion }) => {
    // Compute stats from the country list
    const stats: RegionStat[] = useMemo(() => {
      if (countries.length === 0) return [];

      const totalPopulation = countries.reduce((sum, c) => sum + (c.population || 0), 0);
      const mostPopulous = countries.reduce((max, c) => (c.population > max.population ? c : max), countries[0]);
      const largest = countries.reduce((max, c) => {
        // Use latlng spread as a rough proxy if area isn't available
        return c.name.common.length > max.name.common.length ? c : max;
      }, countries[0]);

      const formatPop = (n: number): string => {
        if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
        if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
        if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
        return n.toString();
      };

      return [
        { label: 'Countries', value: countries.length.toString() },
        { label: 'Population', value: formatPop(totalPopulation) },
        { label: 'Most Populated', value: mostPopulous.name.common },
        { label: 'Largest', value: largest.name.common },
      ];
    }, [countries]);

    // Compute subregion breakdown
    const subregions = useMemo(() => {
      if (countries.length === 0) return [];

      const map = new Map<string, number>();
      countries.forEach((c) => {
        const sub = c.subregion || 'Other';
        map.set(sub, (map.get(sub) || 0) + 1);
      });

      return Array.from(map.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([name, count]) => ({ name, count }));
    }, [countries]);

    return (
      <div className="region-header">
        <div className="region-header-top">
          <div className="region-header-info">
            <h3>{regionName}</h3>
            {stats.length > 0 && (
              <div className="region-stats-bar">
                {stats.map((stat) => (
                  <div key={stat.label} className="region-stat-card">
                    <span className="region-stat-value">{stat.value}</span>
                    <span className="region-stat-label">{stat.label}</span>
                  </div>
                ))}
              </div>
            )}
            {subregions.length > 0 && (
              <div className="region-subregion-chips">
                <button
                  type="button"
                  className={`subregion-chip ${selectedSubregion === null ? 'active' : ''}`}
                  onClick={() => onSelectSubregion(null)}
                >
                  All ({countries.length})
                </button>
                {subregions.map((sr) => (
                  <button
                    key={sr.name}
                    type="button"
                    className={`subregion-chip ${selectedSubregion === sr.name ? 'active' : ''}`}
                    onClick={() => onSelectSubregion(sr.name)}
                  >
                    {sr.name} ({sr.count})
                  </button>
                ))}
              </div>
            )}
          </div>
          {regionImage && (
            <div className="region-header-map">
              <img src={regionImage} alt={`${regionName} map`} className="img1" loading="lazy" />
            </div>
          )}
        </div>
      </div>
    );
  },
);

RegionHeader.displayName = 'RegionHeader';

export default RegionHeader;
