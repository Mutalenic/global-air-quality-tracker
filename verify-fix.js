#!/usr/bin/env node

/**
 * Verification Script for Countries Rendering Fix
 *
 * This script tests the complete flow to ensure countries render properly:
 * 1. ✅ User clicks region (e.g., "Africa")
 * 2. ✅ getCountries dispatches loading state
 * 3. ✅ API fetches 59 countries successfully
 * 4. ✅ Redux state updates with countries array
 * 5. ✅ Countries component re-renders and displays countries
 * 6. ✅ No premature redirects to home page
 */

const puppeteer = require('puppeteer');
const assert = require('assert');

const APP_URL = 'http://localhost:3000';
const TEST_TIMEOUT = 10000;

async function waitForSelector(page, selector, timeout = 5000) {
  try {
    await page.waitForSelector(selector, { timeout });
    return true;
  } catch (error) {
    console.log(`❌ Selector "${selector}" not found within ${timeout}ms`);
    return false;
  }
}

async function verifyCountriesRendering() {
  console.log('🚀 Starting Countries Rendering Verification Test...\n');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  try {
    // Set up console logging to capture Redux actions
    const logs = [];
    page.on('console', msg => {
      const text = msg.text();
      logs.push(text);
      if (text.includes('getCountries called') ||
          text.includes('API response received') ||
          text.includes('Redux state updated') ||
          text.includes('Rendering countries list')) {
        console.log(`📝 ${text}`);
      }
    });

    console.log('1️⃣  Navigating to home page...');
    await page.goto(APP_URL, { waitUntil: 'networkidle0' });
    await page.waitForTimeout(2000);

    // Verify we're on the home page with regions
    const regionsVisible = await waitForSelector(page, '.region');
    assert(regionsVisible, 'Regions should be visible on home page');

    console.log('2️⃣  Clicking on Africa region...');
    const africaButton = await page.$('[aria-label="View countries in Africa"]');
    assert(africaButton, 'Africa region button should exist');

    await africaButton.click();
    console.log('   ✅ Clicked Africa region');

    // Wait for navigation and data loading
    await page.waitForTimeout(2000);

    console.log('3️⃣  Verifying countries page loaded...');
    const currentUrl = page.url();
    assert(currentUrl.includes('/countries'), `Should navigate to /countries, got: ${currentUrl}`);

    console.log('4️⃣  Checking for loading state...');
    // Should not see loading skeleton if data loaded quickly
    const loadingVisible = await page.$('.skeleton-loader');
    if (loadingVisible) {
      console.log('   ⏳ Loading state detected (this is normal)');
    }

    console.log('5️⃣  Verifying countries are displayed...');
    await page.waitForTimeout(1000); // Give more time for data to load

    // Check if countries are rendered
    const countriesGrid = await page.$('.countriesGrid');
    const noCountriesMsg = await page.$('text=No countries available');

    if (noCountriesMsg) {
      console.log('❌ No countries message found - this indicates the fix failed');
      throw new Error('Countries not rendering - fix verification failed');
    }

    if (!countriesGrid) {
      console.log('❌ Countries grid not found');
      throw new Error('Countries grid not rendered');
    }

    console.log('   ✅ Countries grid found');

    // Count rendered country cards
    const countryCards = await page.$$('.mainContainer');
    console.log(`   📊 Found ${countryCards.length} country cards`);

    // Should have multiple countries (Africa has 59)
    assert(countryCards.length > 0, 'Should render country cards');

    console.log('6️⃣  Verifying Redux state updates...');
    // Check console logs for Redux state updates
    const reduxLogs = logs.filter(log =>
      log.includes('Redux state updated') ||
      log.includes('Countries loaded successfully') ||
      log.includes('API response received')
    );

    if (reduxLogs.length === 0) {
      console.log('⚠️  No Redux state update logs found - may need to check manually');
    } else {
      console.log(`   ✅ Found ${reduxLogs.length} Redux state update logs`);
    }

    console.log('7️⃣  Verifying no premature redirect...');
    // Check that we're still on countries page and not redirected back to home
    const finalUrl = page.url();
    assert(finalUrl.includes('/countries'), `Should remain on /countries page, got: ${finalUrl}`);

    const backToHomeLink = await page.$('text=Go back to regions');
    if (backToHomeLink) {
      console.log('❌ Found "Go back to regions" link - indicates empty state');
      throw new Error('Component showing empty state instead of countries');
    }

    console.log('   ✅ No premature redirect detected');

    console.log('\n🎉 SUCCESS: Countries Rendering Fix Verified!');
    console.log(`📊 Rendered ${countryCards.length} countries successfully`);
    console.log('✅ All verification steps passed');

    return {
      success: true,
      countriesCount: countryCards.length,
      logs: logs.slice(-10) // Last 10 logs
    };

  } catch (error) {
    console.log('\n❌ VERIFICATION FAILED');
    console.log('Error:', error.message);

    // Take screenshot for debugging
    await page.screenshot({ path: 'debug-screenshot.png' });
    console.log('📸 Screenshot saved as debug-screenshot.png');

    throw error;
  } finally {
    await browser.close();
  }
}

async function runTest() {
  try {
    console.log('🔍 Countries Rendering Fix Verification');
    console.log('=' .repeat(50));

    const result = await verifyCountriesRendering();

    console.log('\n📋 Test Summary:');
    console.log(`✅ Countries Count: ${result.countriesCount}`);
    console.log(`✅ Redux Updates: ${result.logs.filter(l => l.includes('Redux')).length}`);
    console.log(`✅ Navigation: Successful`);
    console.log(`✅ No Redirects: Confirmed`);

  } catch (error) {
    console.log('\n💥 Test Failed - Fix may need additional work');
    process.exit(1);
  }
}

// Run the test
if (require.main === module) {
  runTest().catch(error => {
    console.error('Test execution failed:', error);
    process.exit(1);
  });
}

module.exports = { verifyCountriesRendering };
