#!/usr/bin/env node

/**
 * API Testing Script
 * Tests all country data APIs to ensure they work correctly
 */

const https = require('https');
const http = require('http');

// Test different country APIs
const testAPIs = [
  {
    name: 'REST Countries',
    url: (region) => `https://restcountries.com/v3.1/region/${region}`,
    test: async (region) => {
      return new Promise((resolve, reject) => {
        const url = `https://restcountries.com/v3.1/region/${region.toLowerCase()}`;
        console.log(`Testing ${url}...`);

        https.get(url, (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => {
            try {
              const json = JSON.parse(data);
              console.log(`  ✅ ${json.length} countries returned`);
              resolve(json.length > 0);
            } catch (e) {
              console.log(`  ❌ Invalid JSON response`);
              resolve(false);
            }
          });
        }).on('error', (err) => {
          console.log(`  ❌ Request failed: ${err.message}`);
          resolve(false);
        });
      });
    }
  },
  {
    name: 'CountryAPI',
    url: (region) => `https://countryapi.io/api/${region}`,
    test: async (region) => {
      return new Promise((resolve) => {
        const url = `https://countryapi.io/api/${region.toLowerCase()}`;
        console.log(`Testing ${url}...`);

        https.get(url, (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => {
            try {
              const json = JSON.parse(data);
              const count = Array.isArray(json) ? json.length : (json.countries ? json.countries.length : 0);
              console.log(`  ✅ ${count} countries returned`);
              resolve(count > 0);
            } catch (e) {
              console.log(`  ❌ Invalid JSON response`);
              resolve(false);
            }
          });
        }).on('error', (err) => {
          console.log(`  ❌ Request failed: ${err.message}`);
          resolve(false);
        });
      });
    }
  },
  {
    name: 'FIRST.org',
    url: (region) => `https://api.first.org/v1/countries?region=${region}`,
    test: async (region) => {
      return new Promise((resolve) => {
        const url = `https://api.first.org/v1/countries?region=${region.toLowerCase()}`;
        console.log(`Testing ${url}...`);

        https.get(url, (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => {
            try {
              const json = JSON.parse(data);
              const count = Array.isArray(json) ? json.length : 0;
              console.log(`  ✅ ${count} countries returned`);
              resolve(count > 0);
            } catch (e) {
              console.log(`  ❌ Invalid JSON response`);
              resolve(false);
            }
          });
        }).on('error', (err) => {
          console.log(`  ❌ Request failed: ${err.message}`);
          resolve(false);
        });
      });
    }
  }
];

async function testAllAPIs() {
  const regions = ['africa', 'asia', 'europe', 'americas'];

  console.log('🌍 Testing Country Data APIs\n');
  console.log('=' .repeat(50));

  const results = {};

  for (const region of regions) {
    console.log(`\n📍 Testing ${region.toUpperCase()} region:`);
    console.log('-'.repeat(30));

    results[region] = {};

    for (const api of testAPIs) {
      try {
        const success = await api.test(region);
        results[region][api.name] = success;

        if (success) {
          console.log(`  🎉 ${api.name}: WORKING`);
        } else {
          console.log(`  ❌ ${api.name}: FAILED`);
        }
      } catch (error) {
        console.log(`  💥 ${api.name}: ERROR - ${error.message}`);
        results[region][api.name] = false;
      }
    }
  }

  // Summary
  console.log('\n📊 SUMMARY:');
  console.log('=' .repeat(50));

  for (const api of testAPIs) {
    const workingRegions = Object.entries(results)
      .filter(([region, apiResults]) => apiResults[api.name])
      .map(([region]) => region.toUpperCase());

    console.log(`${api.name}: ${workingRegions.length}/4 regions working`);
    if (workingRegions.length > 0) {
      console.log(`  ✅ Working: ${workingRegions.join(', ')}`);
    }
  }

  // Check if we have at least one working API per region
  const regionsWithWorkingAPIs = Object.values(results)
    .map(regionResults => Object.values(regionResults).some(result => result))
    .filter(Boolean).length;

  console.log(`\n🎯 Overall: ${regionsWithWorkingAPIs}/4 regions have at least one working API`);

  if (regionsWithWorkingAPIs === 4) {
    console.log('✅ All regions have working APIs - fallback system is robust!');
  } else {
    console.log('⚠️  Some regions lack working APIs - may need additional fallbacks');
  }

  return results;
}

// Run the tests
if (require.main === module) {
  testAllAPIs().catch(console.error);
}

module.exports = { testAllAPIs };
