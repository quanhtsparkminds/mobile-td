#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

/**
 * Make CLI executable and install dependencies
 */
function setupCodegen() {
  console.log(chalk.cyan('🚀 Setting up BaroPlate Codegen...\n'));

  try {
    // Make CLI executable
    const cliPath = path.join(__dirname, '../codegen/cli/generate.js');
    if (fs.existsSync(cliPath)) {
      try {
        fs.chmodSync(cliPath, '755');
        console.log(chalk.green('✅ Made CLI executable'));
      } catch (error) {
        console.log(chalk.yellow('⚠️ Could not make CLI executable (this is normal on Windows)'));
      }
    }

    // Install dependencies
    console.log(chalk.blue('📦 Installing codegen dependencies...'));
    execSync('npm install', { stdio: 'inherit' });

    console.log(chalk.green.bold('\n🎉 BaroPlate Codegen setup completed!\n'));
    console.log(chalk.yellow('🚀 Try it out:'));
    console.log(chalk.gray('  npm run generate:init MyModel'));
    console.log(chalk.gray('  npm run generate:api MyModel'));
    console.log(chalk.gray(''));
    console.log(chalk.yellow('📚 Example usage:'));
    console.log(chalk.gray('  npm run generate:api User'));
    console.log(chalk.gray('  npm run generate:api Product'));
    
  } catch (error) {
    console.error(chalk.red('❌ Setup failed:', error.message));
    process.exit(1);
  }
}

if (require.main === module) {
  setupCodegen();
}

module.exports = setupCodegen;