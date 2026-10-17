const git = require('isomorphic-git');
const http = require('isomorphic-git/http/node');
const fs = require('fs');

async function pushToGitHub() {
  const token = process.argv[2] || process.env.GITHUB_TOKEN;
  if (!token) {
    console.error('\n❌ Error: GitHub Personal Access Token (PAT) প্রয়োজন!');
    console.log('ব্যবহার করার নিয়ম:');
    console.log('  node scripts/github-push.js <YOUR_GITHUB_TOKEN>');
    console.log('অথবা:');
    console.log('  GITHUB_TOKEN=ghp_xxxx node scripts/github-push.js\n');
    console.log('টোকেন তৈরি করার নিয়ম (১ মিনিট):');
    console.log('  1. GitHub.com -> Settings -> Developer Settings -> Personal access tokens -> Tokens (classic)');
    console.log('  2. "Generate new token (classic)" বাটনে ক্লিক করুন');
    console.log('  3. Note: "portfolio" দিন এবং "repo" চেকবক্সে টিক দিন');
    console.log('  4. Generate এ ক্লিক করে টোকেনটি কপি করুন\n');
    process.exit(1);
  }

  console.log('🚀 Pushing commits to https://github.com/abuhurairaconnects/my-portfolio.git (branch: main)...');
  try {
    const pushResult = await git.push({
      fs,
      http,
      dir: '.',
      remote: 'origin',
      ref: 'main',
      onAuth: () => ({
        username: token
      })
    });
    console.log('✅ Push status:', pushResult.ok ? 'SUCCESS' : pushResult);
    console.log('🎉 আলহামদুলিল্লাহ! কোড সফলভাবে GitHub-এ Push হয়ে গেছে!');
    console.log('🌐 Vercel এখন স্বয়ংক্রিয়ভাবে নতুন সাইট বিল্ড ও লাইভ করবে: https://abuhuraira-portfolio.vercel.app');
  } catch (err) {
    console.error('\n❌ Push failed:', err.message || err);
    if (err.data) console.error('Details:', err.data);
    process.exit(1);
  }
}

pushToGitHub();
