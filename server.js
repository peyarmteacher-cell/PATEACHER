import { register } from 'node:module';
import { pathToFileURL } from 'node:url';

console.log('🇹🇭 [Plesk Node.js Bootstrapper] Starting application...');

try {
  // Register the TSX loader for modern on-the-fly TypeScript compilation in this process
  register('tsx', pathToFileURL('./'));
  console.log('✅ TSX on-the-fly compiler loaded successfully.');
} catch (error) {
  console.warn('⚠️ Under some conditions module.register() may trigger warnings, continuing...', error.message || error);
}

// Dynamically import and run server.ts
console.log('🚀 Loading and launching server.ts...');
await import('./server.ts');
