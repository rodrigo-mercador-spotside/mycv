import { rm } from 'fs/promises';
import { join } from 'path';

// Removes the "test.sqlite" file
global.beforeEach(async () => {
  try {
    await rm(join(__dirname, '..', 'test.sqlite'));
  } catch (err) {}
});
