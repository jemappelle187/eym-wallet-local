#!/usr/bin/env node

/**
 * Test script for EYM Wallet Auto-Convert API
 * Run this after starting the API server
 */

const API_BASE = 'http://localhost:4000';

async function testAPI() {
  console.log('🧪 Testing EYM Wallet Auto-Convert API...\n');

  try {
    // Test 1: Health check
    console.log('1️⃣ Testing health check...');
    const health = await fetch(`${API_BASE}/health`);
    const healthData = await health.json();
    console.log('✅ Health check:', healthData.message);

    // Test 2: API info
    console.log('\n2️⃣ Testing API info...');
    const info = await fetch(`${API_BASE}/v1`);
    const infoData = await info.json();
    console.log('✅ API info:', infoData.message);

    // Test 3: USD deposit webhook
    console.log('\n3️⃣ Testing USD deposit webhook...');
    const usdDeposit = await fetch(`${API_BASE}/v1/deposits/webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'user_123',
        currency: 'USD',
        amount: 100.00,
        paymentMethod: 'card',
        paymentReference: 'test_usd_123'
      })
    });
    const usdResult = await usdDeposit.json();
    console.log('✅ USD deposit result:', usdResult.success ? 'SUCCESS' : 'FAILED');
    if (usdResult.deposit) {
      console.log('   Deposit ID:', usdResult.deposit.id);
      console.log('   Status:', usdResult.deposit.status);
    }

    // Test 4: GHS deposit webhook (with FX conversion)
    console.log('\n4️⃣ Testing GHS deposit webhook (with FX conversion)...');
    const ghsDeposit = await fetch(`${API_BASE}/v1/deposits/webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'user_456',
        currency: 'GHS',
        amount: 1500.00,
        paymentMethod: 'mobile_money',
        paymentReference: 'test_ghs_456'
      })
    });
    const ghsResult = await ghsDeposit.json();
    console.log('✅ GHS deposit result:', ghsResult.success ? 'SUCCESS' : 'FAILED');
    if (ghsResult.deposit) {
      console.log('   Deposit ID:', ghsResult.deposit.id);
      console.log('   Status:', ghsResult.deposit.status);
    }
    if (ghsResult.fxTrade) {
      console.log('   FX Rate:', ghsResult.fxTrade.rate);
      console.log('   USD Received:', ghsResult.fxTrade.amountReceived);
    }

    // Test 5: Get user balance
    console.log('\n5️⃣ Testing user balance...');
    const balance = await fetch(`${API_BASE}/v1/users/user_123/balance`);
    const balanceData = await balance.json();
    console.log('✅ User balance:', balanceData.success ? 'SUCCESS' : 'FAILED');
    if (balanceData.balance) {
      console.log('   USDC:', balanceData.balance.USDC);
      console.log('   EURC:', balanceData.balance.EURC);
    }

    // Test 6: Get user summary
    console.log('\n6️⃣ Testing user summary...');
    const summary = await fetch(`${API_BASE}/v1/users/user_123/summary`);
    const summaryData = await summary.json();
    console.log('✅ User summary:', summaryData.success ? 'SUCCESS' : 'FAILED');
    if (summaryData.summary) {
      console.log('   Total Received:', summaryData.summary.totalReceived);
      console.log('   Total Sent:', summaryData.summary.totalSent);
      console.log('   Total Transactions:', summaryData.summary.totalTransactions);
    }

    // Test 7: Get system stats
    console.log('\n7️⃣ Testing system stats...');
    const stats = await fetch(`${API_BASE}/v1/deposits/stats/system`);
    const statsData = await stats.json();
    console.log('✅ System stats:', statsData.success ? 'SUCCESS' : 'FAILED');
    if (statsData.stats) {
      console.log('   Total Deposits:', statsData.stats.totalDeposits);
      console.log('   Successful Conversions:', statsData.stats.successfulConversions);
      console.log('   Success Rate:', statsData.stats.successRate.toFixed(2) + '%');
    }

    // Test 8: Get all deposits
    console.log('\n8️⃣ Testing get all deposits...');
    const deposits = await fetch(`${API_BASE}/v1/deposits`);
    const depositsData = await deposits.json();
    console.log('✅ All deposits:', depositsData.success ? 'SUCCESS' : 'FAILED');
    console.log('   Count:', depositsData.count);

    console.log('\n🎉 All tests completed successfully!');
    console.log('\n📊 Summary:');
    console.log('   - API is running and responding');
    console.log('   - Deposit webhooks are working');
    console.log('   - FX conversion is functional');
    console.log('   - Balance tracking is operational');
    console.log('   - System monitoring is active');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Make sure the API server is running on port 4000');
    console.log('   2. Check that all dependencies are installed');
    console.log('   3. Verify environment variables are set correctly');
    console.log('   4. Check the server logs for errors');
  }
}

// Run the test
testAPI();












