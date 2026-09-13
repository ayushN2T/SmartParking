import { test, expect } from '@playwright/test';

test.describe('Bhavnagar Smart Parking - Frontend E2E Tests', () => {

  const selectStartingLocation = async (page) => {
    await page.goto('/');
    const option = page.getByTestId('location-option-Bhavnagar Central Market');
    if (await option.isVisible({ timeout: 5000 }).catch(() => false)) {
      await option.click();
      await page.waitForTimeout(500);
    }
  };

  test('1. Starting Location Prompt & Destination Selection', async ({ page }) => {
    await page.goto('/');

    // Check modal visibility
    const modalHeading = page.locator('text=Where are you right now in Bhavnagar?');
    await expect(modalHeading).toBeVisible({ timeout: 10000 });

    // Hub button should be present in modal
    const marketOption = page.getByTestId('location-option-Bhavnagar Central Market');
    await expect(marketOption).toBeVisible();

    // Select Bhavnagar Central Market
    await marketOption.click();

    // Modal should close
    await expect(modalHeading).not.toBeVisible();

    // Toast notification should announce GPS location pin
    const toast = page.locator('text=GPS Location Pin Active');
    await expect(toast).toBeVisible({ timeout: 5000 });

    // Active location bar should show Verified Starting Point
    await expect(page.locator('text=Verified Starting Point')).toBeVisible();
    await expect(page.locator('text=Bhavnagar Central Market').first()).toBeVisible();
  });

  test('2. Public vs Private Parking Categorization & Filtering', async ({ page }) => {
    await selectStartingLocation(page);

    // Check ownership filters
    const allBtn = page.getByRole('button', { name: /All Parking/i });
    const publicBtn = page.getByRole('button', { name: /Public Parking \(BMC\)/i });
    const privateBtn = page.getByRole('button', { name: /Private Parking/i });

    await expect(allBtn).toBeVisible();
    await expect(publicBtn).toBeVisible();
    await expect(privateBtn).toBeVisible();

    // Click Public Parking (BMC)
    await publicBtn.click();
    await expect(page.locator('text=Showing BMC municipal lots')).toBeVisible();

    // Public cards should have BMC Public badge
    const publicBadges = page.locator('text=BMC Public');
    await expect(publicBadges.first()).toBeVisible();

    // Click Private Parking
    await privateBtn.click();
    await expect(page.locator('text=Showing private commercial arcades')).toBeVisible();
    const privateBadges = page.locator('text=Private').first();
    await expect(privateBadges).toBeVisible();

    // Click All Parking
    await allBtn.click();
    await expect(page.locator('text=Showing both Public (BMC) & Private bays')).toBeVisible();
  });

  test('3. Vehicle Type Filter & Dynamic Tariff Adjustment', async ({ page }) => {
    await selectStartingLocation(page);

    const vehicleSelect = page.getByTestId('vehicle-type-select');
    await expect(vehicleSelect).toBeVisible();

    // Select 2-Wheeler
    await vehicleSelect.selectOption('2w');

    // Verify rate updates to 2W rates (₹10/hr on Market Multilevel Hub)
    await expect(page.locator('text=₹10').first()).toBeVisible();

    // Select EV Charging
    await vehicleSelect.selectOption('ev');

    // Filtered cards should have EV amenities
    await expect(page.locator('text=EV Fast Charger').or(page.locator('text=EV Charging')).first()).toBeVisible();

    // Switch back to 4-Wheeler
    await vehicleSelect.selectOption('4w');
    await expect(page.locator('text=₹20').first()).toBeVisible();
  });

  test('4. AI Smart Recommendation Engine & Rationale', async ({ page }) => {
    await selectStartingLocation(page);

    // AI Recommendation card should be visible
    const aiSection = page.locator('text=Smart Recommendation');
    await expect(aiSection).toBeVisible();

    // Rationale text should mention Market Multilevel Hub
    const rationale = page.locator('text=Market Multilevel Hub').first();
    await expect(rationale).toBeVisible();

    // Reserve Pass button should be visible
    const reserveBtn = page.getByTestId('reserve-ai-btn');
    await expect(reserveBtn).toBeVisible();
  });

  test('5. Live GPS Map View with User Coordinates & Trajectory', async ({ page }) => {
    await selectStartingLocation(page);

    // Switch to Live GPS Map View
    const mapToggleBtn = page.getByTestId('toggle-view-map');
    await mapToggleBtn.click();

    // SVG Map should be visible
    const svgMap = page.locator('svg[viewBox="0 0 500 320"]').first();
    await expect(svgMap).toBeVisible();

    // GPS radar pulse marker should be present
    const gpsRadar = page.locator('text=YOU ARE HERE (GPS)').first();
    await expect(gpsRadar).toBeVisible();

    // Destination Pin should be present
    const destPin = page.locator('text=Bhavnagar Central Market').first();
    await expect(destPin).toBeVisible();

    // Switch back to Cards View
    await page.getByTestId('toggle-view-cards').click();
    await expect(page.locator('.parking-card').first()).toBeVisible();
  });

  test('6. Digital E-Pass Modal & FASTag Boom Barrier Simulator', async ({ page }) => {
    await selectStartingLocation(page);

    // Open booking modal via AI pass button
    const passBtn = page.getByTestId('reserve-ai-btn');
    await passBtn.click();

    // Modal should appear
    const passTitle = page.locator('text=Bhavnagar Smart Parking Digital Pass');
    await expect(passTitle).toBeVisible({ timeout: 5000 });

    // Pass code should be formatted with #BMC-PK-
    await expect(page.locator('text=#BMC-PK-').first()).toBeVisible();

    // Bay code should be displayed
    await expect(page.locator('text=Bay #').first()).toBeVisible();

    // Vehicle plate should be displayed
    await expect(page.locator('text=GJ-04-AB-1892').first()).toBeVisible();

    // Boom barrier simulator should be present
    const barrierStatus = page.locator('text=BARRIER OPEN / AUTO-LIFTED');
    await expect(barrierStatus).toBeVisible();

    // Test lift toggle button
    const testLiftBtn = page.getByRole('button', { name: /Test Lift/i });
    await testLiftBtn.click();
    await expect(page.locator('text=BARRIER DOWN / CLOSED')).toBeVisible();

    // Toggle back open
    await testLiftBtn.click();
    await expect(page.locator('text=BARRIER OPEN / AUTO-LIFTED')).toBeVisible();

    // Close modal
    await page.getByRole('button', { name: 'Done / Close' }).click();
    await expect(passTitle).not.toBeVisible();
  });

  test('7. Parking Locations Directory & Search Filter', async ({ page }) => {
    await selectStartingLocation(page);

    // Navigate via top navbar
    const directoryNav = page.getByRole('button', { name: 'Parking Locations' });
    await directoryNav.click();

    // Directory header
    await expect(page.locator('text=All Bhavnagar Parking Locations')).toBeVisible();
    await expect(page.locator('text=Complete directory of 12 BMC managed parking facilities')).toBeVisible();

    // Search for a specific zone
    const searchInput = page.getByPlaceholder('Search facilities, areas...');
    await searchInput.fill('Takhteshwar');

    // Should only show Takhteshwar facilities
    await expect(page.getByRole('heading', { name: /Takhteshwar/i }).first()).toBeVisible();
    await expect(page.locator('text=Market Multilevel Hub')).not.toBeVisible();

    // Clear search
    await searchInput.fill('');
    await expect(page.locator('text=Market Multilevel Hub')).toBeVisible();
  });

  test('8. Control Dashboard & Real-Time Sensor Telemetry Simulation', async ({ page }) => {
    await selectStartingLocation(page);

    // Navigate to Dashboard
    const dashboardNav = page.getByRole('button', { name: 'Dashboard' });
    await dashboardNav.click();

    // Heading
    await expect(page.locator('text=Bhavnagar Municipal Smart Parking Control Dashboard')).toBeVisible();

    // KPI Cards
    await expect(page.locator('text=Total Parking Locations')).toBeVisible();
    await expect(page.locator('text=12 Locations')).toBeVisible();

    // Click Simulate Sensor Tick
    const tickBtn = page.getByRole('button', { name: /Simulate Sensor Tick/i });
    await expect(tickBtn).toBeVisible();
    await tickBtn.click();

    // Verify toast notification
    const syncToast = page.locator('text=Sensor Network Synced');
    await expect(syncToast).toBeVisible({ timeout: 5000 });

    // Table of crowded facilities
    await expect(page.locator('text=Most Crowded Parking Areas')).toBeVisible();
  });

});
