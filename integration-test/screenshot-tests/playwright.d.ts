import '@playwright/test';

declare module '@playwright/test' {
    interface PlaywrightTestOptions {
        platform?: 'ios' | 'android' | 'extension' | 'macos' | 'windows';
    }
}
