#!/bin/bash

# Manual Testing Script for Global Air Quality Tracker
# This script guides you through manual testing of the entire application flow

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}==>${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_header() {
    echo ""
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}$1${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
}

# Function to wait for user confirmation
wait_for_user() {
    read -p "Press Enter to continue..."
}

# Function to ask yes/no question
ask_yes_no() {
    while true; do
        read -p "$1 (y/n): " yn
        case $yn in
            [Yy]* ) return 0;;
            [Nn]* ) return 1;;
            * ) echo "Please answer yes or no.";;
        esac
    done
}

# Start script
clear
print_header "Global Air Quality Tracker - Manual Testing Guide"

print_status "This script will guide you through testing the entire application flow."
print_status "You will need to open your browser and follow the instructions."
echo ""
wait_for_user

# Check if npm is installed
print_status "Checking prerequisites..."
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install Node.js and npm first."
    exit 1
fi
print_success "npm is installed"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    print_warning "node_modules not found. Installing dependencies..."
    npm install
    print_success "Dependencies installed"
else
    print_success "Dependencies already installed"
fi

# Run tests first
print_header "Step 1: Running Automated Tests"
print_status "Running all test suites..."
if npm test -- --watchAll=false; then
    print_success "All tests passed!"
else
    print_error "Some tests failed. Please fix them before continuing."
    if ask_yes_no "Do you want to continue anyway?"; then
        print_warning "Continuing with manual testing..."
    else
        exit 1
    fi
fi
wait_for_user

# Start the development server
print_header "Step 2: Starting Development Server"
print_status "Starting the application on http://localhost:3000..."
print_warning "The app will start in a new terminal. Don't close it!"
echo ""

# Start app in background
npm start &
APP_PID=$!

# Wait for server to start
print_status "Waiting for server to start..."
sleep 5

# Check if server is running
if curl -s http://localhost:3000 > /dev/null; then
    print_success "Server is running on http://localhost:3000"
else
    print_error "Server failed to start. Please check for errors."
    kill $APP_PID 2>/dev/null || true
    exit 1
fi

print_status "Opening browser..."
if command -v xdg-open &> /dev/null; then
    xdg-open http://localhost:3000
elif command -v open &> /dev/null; then
    open http://localhost:3000
else
    print_warning "Could not open browser automatically. Please open http://localhost:3000 manually."
fi

wait_for_user

# Test flow guide
print_header "Manual Testing Flow"

# Test 1: Home Page
print_header "Test 1: Home Page / Region Selection"
cat << EOF
Please verify the following on the HOME PAGE:

1. World map is displayed
2. Header text "Find Air Quality Data in your Location" is visible
3. All 6 regions are displayed:
   - Africa (59 Countries)
   - Americas (56 Countries)
   - Europe (53 Countries)
   - Asia (50 Countries)
   - Oceania (27 Countries)
   - Antarctic (5 Countries)
4. Each region has a map image
5. Navigation bar is present with Home and Favorites icons
6. "Skip to main content" link is present (press Tab to see it)

EOF
if ask_yes_no "Did all checks pass?"; then
    print_success "Home Page test passed"
else
    print_error "Home Page test failed"
fi
wait_for_user

# Test 2: Region Selection
print_header "Test 2: Region Selection"
cat << EOF
Please perform the following actions:

1. Click on the "Africa" region
2. You should be redirected to /countries
3. Verify that:
   - Africa region name is displayed
   - Africa map is shown
   - A search bar appears
   - Countries are loading (loading skeleton may flash briefly)
   - Multiple country cards are displayed with:
     * Country flag
     * Country name
     * Capital city
     * Population
   - A "See More" button appears if there are more than 6 countries

EOF
if ask_yes_no "Did the region selection work correctly?"; then
    print_success "Region selection test passed"
else
    print_error "Region selection test failed"
fi
wait_for_user

# Test 3: Search Functionality
print_header "Test 3: Search Functionality"
cat << EOF
Please test the search feature:

1. In the search bar at the top, type "Kenya"
2. Verify that:
   - Only Kenya appears in the results
   - Other countries are filtered out
   - The country card for Kenya is displayed correctly
3. Clear the search and type "South"
4. Verify that countries with "South" in their name appear (e.g., South Africa, South Sudan)
5. Clear the search completely
6. Verify that all countries are displayed again

EOF
if ask_yes_no "Did the search functionality work correctly?"; then
    print_success "Search functionality test passed"
else
    print_error "Search functionality test failed"
fi
wait_for_user

# Test 4: Country Selection
print_header "Test 4: Country Selection & Pollution Data"
cat << EOF
Please test selecting a country:

1. Click on any country card (e.g., Kenya)
2. You should be redirected to /pollution
3. Verify that:
   - Country name is displayed
   - Region name is displayed
   - Population is shown
   - Air Quality Index (AQI) is displayed
   - Pollution components are shown:
     * PM2.5 (Fine Particulate Matter)
     * PM10 (Particulate Matter)
     * O3 (Ozone)
     * NO2 (Nitrogen Dioxide)
     * SO2 (Sulfur Dioxide)
     * CO (Carbon Monoxide)
   - Each component has a numerical value
   - Toast notification appears (top-right corner)

EOF
if ask_yes_no "Did pollution data load and display correctly?"; then
    print_success "Pollution data test passed"
else
    print_error "Pollution data test failed"
fi
wait_for_user

# Test 5: Favorites
print_header "Test 5: Favorites Functionality"
cat << EOF
Please test the favorites feature:

1. While viewing pollution data, click the heart icon (♥) in the navigation
2. The heart should fill/change color
3. A toast notification should appear saying the location was added to favorites
4. Click the Favorites icon in the navigation bar
5. You should be redirected to /favorites
6. Verify that:
   - The location you just favorited is displayed
   - The card shows country name, region, and population
   - There's a "View Pollution" button
   - There's a "Remove" button (trash icon)
7. Click "View Pollution" on a favorite
8. You should be redirected to the pollution page for that location
9. Go back to Favorites
10. Click the "Remove" button (trash icon)
11. Confirm the removal in the dialog
12. Verify the location is removed from favorites
13. If no favorites remain, verify empty state message appears

EOF
if ask_yes_no "Did the favorites functionality work correctly?"; then
    print_success "Favorites functionality test passed"
else
    print_error "Favorites functionality test failed"
fi
wait_for_user

# Test 6: Navigation
print_header "Test 6: Navigation Flow"
cat << EOF
Please test navigation:

1. Click the Home icon in the navigation bar
2. Verify you're back on the home page (world map visible)
3. Click the Favorites icon
4. Verify you're on the favorites page
5. Click the Home icon again
6. Select a different region (e.g., "Asia")
7. Verify countries for that region are displayed
8. Click a country
9. Verify pollution data loads
10. Click the back button in the navigation (if visible)
11. Verify you go back to the countries list

EOF
if ask_yes_no "Did navigation work correctly?"; then
    print_success "Navigation test passed"
else
    print_error "Navigation test failed"
fi
wait_for_user

# Test 7: Error Handling
print_header "Test 7: Error Handling"
cat << EOF
Please test error handling:

1. Open browser DevTools (F12)
2. Go to Network tab
3. Enable "Offline" mode
4. Go to home page and click on a region
5. Verify that:
   - An error message appears
   - A "Try again" or "Go back" button is available
   - The error is user-friendly
6. Disable "Offline" mode
7. Refresh the page
8. Verify the app works normally again

Optional: Test by stopping your internet connection temporarily

EOF
if ask_yes_no "Did error handling work correctly?"; then
    print_success "Error handling test passed"
else
    print_error "Error handling test failed"
fi
wait_for_user

# Test 8: Loading States
print_header "Test 8: Loading States"
cat << EOF
Please test loading states:

1. Open browser DevTools (F12)
2. Go to Network tab
3. Throttle network speed to "Slow 3G" or "Fast 3G"
4. Navigate to home page
5. Click on a region
6. Verify that:
   - Loading skeleton appears while countries are loading
   - Loading state is smooth and doesn't show blank page
7. Click on a country
8. Verify loading skeleton appears while pollution data loads
9. Reset network throttling to "No throttling"

EOF
if ask_yes_no "Did loading states work correctly?"; then
    print_success "Loading states test passed"
else
    print_error "Loading states test failed"
fi
wait_for_user

# Test 9: Accessibility
print_header "Test 9: Accessibility"
cat << EOF
Please test accessibility features:

1. Press Tab key multiple times
2. Verify that:
   - "Skip to main content" link appears at the top
   - Focus indicator is visible on all interactive elements
   - Tab order is logical (top to bottom, left to right)
3. Press Enter on "Skip to main content"
4. Verify focus moves to main content
5. Navigate through the app using only keyboard:
   - Tab to navigate forward
   - Shift+Tab to navigate backward
   - Enter/Space to activate buttons
6. Verify all functionality is accessible via keyboard
7. Test with screen reader if available (optional)

EOF
if ask_yes_no "Did accessibility features work correctly?"; then
    print_success "Accessibility test passed"
else
    print_error "Accessibility test failed"
fi
wait_for_user

# Test 10: Responsive Design
print_header "Test 10: Responsive Design"
cat << EOF
Please test responsive design:

1. Resize browser window to mobile size (320px wide)
2. Verify that:
   - Layout adapts to smaller screen
   - All content is readable
   - No horizontal scrolling
   - Navigation is accessible
3. Resize to tablet size (768px wide)
4. Verify layout still looks good
5. Resize to desktop size (1024px+ wide)
6. Verify layout is optimal
7. Test on actual mobile device if available (optional)

EOF
if ask_yes_no "Did responsive design work correctly?"; then
    print_success "Responsive design test passed"
else
    print_error "Responsive design test failed"
fi
wait_for_user

# Test 11: Browser Compatibility
print_header "Test 11: Browser Compatibility (Optional)"
cat << EOF
If possible, test in multiple browsers:

1. Chrome/Chromium
2. Firefox
3. Safari (if on Mac)
4. Edge

Verify basic functionality works in each browser.

EOF
if ask_yes_no "Did you test browser compatibility (or skip)?"; then
    print_success "Browser compatibility test completed/skipped"
fi
wait_for_user

# Test 12: Direct URL Access
print_header "Test 12: Direct URL Access"
cat << EOF
Please test direct URL navigation:

1. Open a new tab
2. Navigate directly to http://localhost:3000/countries
3. Verify that you're redirected back to home page (/)
   (This is correct behavior since no region was selected)
4. From home, click a region to load countries
5. Copy the URL (should still be /countries)
6. Open a new tab and paste the URL
7. Verify the countries page is displayed correctly

EOF
if ask_yes_no "Did direct URL access work correctly?"; then
    print_success "Direct URL access test passed"
else
    print_error "Direct URL access test failed"
fi
wait_for_user

# Summary
print_header "Testing Summary"

cat << EOF
Congratulations! You've completed the manual testing flow.

Please review the following:

1. All core functionality works correctly
2. Search and filtering work as expected
3. Favorites can be added and removed
4. Navigation flows smoothly
5. Error states are handled gracefully
6. Loading states provide good UX
7. The app is accessible via keyboard
8. Responsive design works on different screen sizes
9. Direct URL access is handled correctly

If all tests passed, the application is ready for production deployment!

EOF

print_status "Stopping development server..."
kill $APP_PID 2>/dev/null || true
print_success "Server stopped"

echo ""
print_header "Testing Complete!"
print_success "Thank you for testing the Global Air Quality Tracker!"
echo ""
print_status "To run automated tests again, use: npm test"
print_status "To start the dev server again, use: npm start"
print_status "To build for production, use: npm run build"
echo ""
