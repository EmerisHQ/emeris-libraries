const { test: base, chromium, webkit } = require('@playwright/test')
const path = require('path')

const extensionPath = path.join(__dirname, '../dist') // make sure this is correct

export const test = base.extend({
    context: async ({ browserName }, use) => {
        const browserTypes = { chromium, webkit }
        const launchOptions = {
            devtools: true,
            headless: false,
            viewport: {
                width: 1920,
                height: 1080
            },
            args: [
                `--disable-extensions-except=${extensionPath}`,
                `--load-extension=${extensionPath}`
            ]
        }
        const context = await browserTypes[browserName].launchPersistentContext(
            '',
            launchOptions
        )
        await use(context)
        await context.close()
    }
})