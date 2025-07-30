#!/usr/bin/env node

/**
 * Setup script for Key Vault subscription cron jobs
 * This script helps you set up automated subscription checking
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Key Vault Subscription Cron Setup');
console.log('=====================================\n');

// Get the absolute path to the project
const projectPath = process.cwd();
const scriptPath = path.join(projectPath, 'scripts', 'check-subscriptions.js');

console.log('📁 Project Path:', projectPath);
console.log('📜 Script Path:', scriptPath);

// Check if the script exists
if (!fs.existsSync(scriptPath)) {
  console.error('❌ Error: check-subscriptions.js not found!');
  process.exit(1);
}

console.log('✅ Subscription check script found\n');

// Create cron job examples
const cronExamples = {
  daily: '0 2 * * *', // Daily at 2 AM
  weekly: '0 2 * * 0', // Weekly on Sunday at 2 AM
  twiceDaily: '0 2,14 * * *', // Twice daily at 2 AM and 2 PM
  hourly: '0 * * * *' // Every hour
};

console.log('📅 Cron Job Examples:');
console.log('=====================');

Object.entries(cronExamples).forEach(([name, schedule]) => {
  console.log(`${name.padEnd(12)}: ${schedule}`);
});

console.log('\n🚀 Setup Instructions:');
console.log('=====================');

console.log('1. Open your crontab:');
console.log('   crontab -e');

console.log('\n2. Add one of these lines (choose your preferred schedule):');
console.log('   # Daily at 2 AM (Recommended)');
console.log(`   ${cronExamples.daily} cd ${projectPath} && node scripts/check-subscriptions.js >> logs/subscription-check.log 2>&1`);

console.log('\n   # Weekly on Sunday at 2 AM');
console.log(`   ${cronExamples.weekly} cd ${projectPath} && node scripts/check-subscriptions.js >> logs/subscription-check.log 2>&1`);

console.log('\n   # Twice daily at 2 AM and 2 PM');
console.log(`   ${cronExamples.twiceDaily} cd ${projectPath} && node scripts/check-subscriptions.js >> logs/subscription-check.log 2>&1`);

console.log('\n3. Create logs directory:');
console.log('   mkdir -p logs');

console.log('\n4. Test the script manually:');
console.log('   node scripts/check-subscriptions.js');

console.log('\n5. Check cron job status:');
console.log('   crontab -l');

console.log('\n📋 What the cron job does:');
console.log('========================');
console.log('• Checks for expired subscriptions');
console.log('• Downgrades expired users to FREE plan');
console.log('• Creates audit logs for all actions');
console.log('• Logs users with subscriptions expiring soon');
console.log('• Sends notifications (if email is configured)');

console.log('\n🔍 Monitoring:');
console.log('=============');
console.log('• Check logs: tail -f logs/subscription-check.log');
console.log('• View cron logs: grep CRON /var/log/syslog');
console.log('• Test manually: npm run check:subscriptions');

console.log('\n✅ Setup complete! Your subscription checks will now run automatically.\n'); 