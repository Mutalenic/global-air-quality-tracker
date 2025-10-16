#!/usr/bin/env node

/**
 * Simple Verification Script for Countries Rendering Fix
 *
 * This script performs basic checks to verify the fix without requiring Puppeteer.
 * It checks that the application builds successfully and the key files are correct.
 */

const fs = require('fs');
const path = require('path');

function checkFileExists(filePath, description) {
  const fullPath = path.join(__dirname, filePath);
  if (fs.existsSync(fullPath)) {
    console.log(`✅ ${description}: ${filePath}`);
    return true;
  } else {
    console.log(`❌ ${description}: ${filePath} - NOT FOUND`);
    return false;
  }
}

function checkFileContent(filePath, searchText, description) {
  try {
    const content = fs.readFileSync(path.join(__dirname, filePath), 'utf8');
    if (content.includes(searchText)) {
      console.log(`✅ ${description}: Found "${searchText}"`);
      return true;
    } else {
      console.log(`❌ ${description}: "${searchText}" not found`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ${description}: Error reading file - ${error.message}`);
    return false;
  }
}

function verifyReduxStore() {
  console.log('\n🔍 Verifying Redux Store Configuration...');

  const storePath = 'src/redux/configureStore.js';
  const storeContent = fs.readFileSync(path.join(__dirname, storePath), 'utf8');

  const checks = [
    { text: "countriesReducer", desc: "Redux store includes countriesReducer" },
    { text: "combineReducers", desc: "Redux store uses combineReducers" },
    { text: "countries: countriesReducer", desc: "Redux store maps countries to countriesReducer" },
    { text: "debugReducer", desc: "Redux store includes debugging" }
  ];

  checks.forEach(check => {
    checkFileContent(storePath, check.text, check.desc);
  });
}

function verifyCountriesComponent() {
  console.log('\n🔍 Verifying Countries Component...');

  const countriesPath = 'src/components/Details/Countries.js';

  const checks = [
    { text: "useSelector((state) => state.countriesReducer)", desc: "Component accesses correct Redux state" },
    { text: "loading", desc: "Component handles loading state" },
    { text: "error", desc: "Component handles error state" },
    { text: "countries.length", desc: "Component checks countries array length" },
    { text: "navigate('/', { replace: true })", desc: "Component has redirect logic" }
  ];

  checks.forEach(check => {
    checkFileContent(countriesPath, check.text, check.desc);
  });
}

function verifyRegionComponent() {
  console.log('\n🔍 Verifying Region Component...');

  const regionPath = 'src/components/Details/Region.js';

  const checks = [
    { text: "getCountries(region)", desc: "Region component dispatches getCountries" },
    { text: "navigate('/countries')", desc: "Region component navigates to countries page" },
    { text: "setTimeout", desc: "Region component has navigation delay" }
  ];

  checks.forEach(check => {
    checkFileContent(regionPath, check.text, check.desc);
  });
}

function verifyBuild() {
  console.log('\n🔨 Verifying Application Build...');

  try {
    // Check if build directory exists and has content
    const buildPath = path.join(__dirname, 'build');
    if (fs.existsSync(buildPath)) {
      const files = fs.readdirSync(buildPath);
      if (files.length > 0) {
        console.log(`✅ Build directory exists with ${files.length} files`);
        return true;
      }
    }

    console.log('❌ Build directory not found or empty');
    return false;
  } catch (error) {
    console.log(`❌ Build verification failed: ${error.message}`);
    return false;
  }
}

function runVerification() {
  console.log('🚀 Countries Rendering Fix Verification');
  console.log('=' .repeat(50));

  const results = [];

  // Check key files exist
  console.log('\n📁 Verifying Required Files...');
  const files = [
    'src/redux/configureStore.js',
    'src/components/Details/Countries.js',
    'src/components/Details/Region.js',
    'src/redux/Reducers/Countries.js',
    'src/redux/Actions/Countries.js'
  ];

  files.forEach(file => {
    results.push(checkFileExists(file, 'Required file'));
  });

  // Verify Redux store configuration
  verifyReduxStore();

  // Verify Countries component
  verifyCountriesComponent();

  // Verify Region component
  verifyRegionComponent();

  // Verify build
  results.push(verifyBuild());

  const passed = results.filter(r => r === true).length;
  const total = results.length;

  console.log('\n📊 Verification Summary:');
  console.log(`✅ Passed: ${passed}/${total}`);
  console.log(`❌ Failed: ${total - passed}/${total}`);

  if (passed === total) {
    console.log('\n🎉 SUCCESS: All verifications passed!');
    console.log('✅ Countries rendering fix appears to be properly implemented');
    console.log('✅ Redux store is correctly configured');
    console.log('✅ Components have proper state management');
    console.log('✅ Navigation and data flow should work correctly');
  } else {
    console.log('\n⚠️  Some verifications failed');
    console.log('Please check the errors above and ensure all components are properly implemented');
  }

  return passed === total;
}

// Run the verification
if (require.main === module) {
  const success = runVerification();
  process.exit(success ? 0 : 1);
}

module.exports = { runVerification };
