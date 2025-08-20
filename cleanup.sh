#!/bin/bash

# Clean up duplicate App files
cd frontend/src
rm -f App-backend.tsx App-clean.tsx App-complete.tsx App-simple.tsx
rm -f AppSimple.tsx App_backup.tsx App_full.tsx App_progressive.tsx
rm -f App_simple.tsx App_test_dashboard.tsx App_test_login.tsx
rm -f App_test_only_login.tsx App_with_auth.tsx TestApp.tsx
rm -f counter.ts main.ts main_clean.tsx

# Clean up duplicate page files
cd pages
rm -f DashboardNew_backup.tsx DashboardNew_fixed.tsx
rm -f LoginCorrected.tsx LoginFixed.tsx LoginSimple.tsx

echo "Cleanup completed!"
