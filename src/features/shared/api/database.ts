import Dexie, { Table } from 'dexie';

export interface CountryRecord {
  id?: number;
  name: string;
  region: string;
  latlng: [number, number];
  population: number;
  code: string;
  flag: string;
  lastUpdated: Date;
}

export interface PollutionRecord {
  id?: number;
  lat: number;
  lon: number;
  aqi: number;
  components: {
    co: number;
    no: number;
    no2: number;
    o3: number;
    so2: number;
    pm2_5: number;
    pm10: number;
    nh3: number;
  };
  timestamp: Date;
}

export interface FarmRecord {
  id?: number;
  name: string;
  location: {
    lat: number;
    lon: number;
  };
  cropType: string;
  plantingDate?: Date;
  harvestDate?: Date;
  soilData?: {
    ph: number;
    moisture: number;
    temperature: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export class ZambiaEnvironmentalDB extends Dexie {
  // Declare implicit table properties
  countries!: Table<CountryRecord>;
  pollution!: Table<PollutionRecord>;
  farms!: Table<FarmRecord>;

  constructor() {
    super('ZambiaEnvironmentalDB');
    
    this.version(1).stores({
      countries: '++id, name, region, code, lastUpdated',
      pollution: '++id, [lat+lon], timestamp',
      farms: '++id, name, cropType, createdAt',
    });
  }

  // Helper methods for offline functionality
  async cachePollutionData(lat: number, lon: number, data: any) {
    await this.pollution.add({
      lat,
      lon,
      aqi: data.list[0]?.main?.aqi || 0,
      components: data.list[0]?.components || {},
      timestamp: new Date(),
    });
  }

  async getCachedPollution(lat: number, lon: number, maxAge = 3600000) { // 1 hour default
    const cutoff = new Date(Date.now() - maxAge);
    return this.pollution
      .where('[lat+lon]')
      .equals([lat, lon])
      .and(record => record.timestamp > cutoff)
      .first();
  }

  async cacheCountries(countries: CountryRecord[]) {
    const records = countries.map(country => ({
      ...country,
      lastUpdated: new Date(),
    }));
    await this.countries.clear();
    await this.countries.bulkAdd(records);
  }

  async getCachedCountries(region?: string, maxAge = 86400000) { // 24 hours default
    const cutoff = new Date(Date.now() - maxAge);
    let query = this.countries.where('lastUpdated').above(cutoff);
    
    if (region) {
      query = query.and(country => country.region === region);
    }
    
    return query.toArray();
  }
}

export const db = new ZambiaEnvironmentalDB();