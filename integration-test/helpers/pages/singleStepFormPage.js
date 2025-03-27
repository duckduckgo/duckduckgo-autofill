import { constants } from '../mocks.js';
import { genericPage } from './genericPage.js';

export function singleStepFormPage(page) {
    class SingleStepFormPage {
        async navigate() {
            await page.goto(constants.pages.singleStepForm);
        }

        async assertUsernameFieldHasDaxIcon(selector) {
            await genericPage(page).usernameFieldShowsDaxIcon(selector);
        }

        async assertUsernameFieldHasFillKey(selector) {
            await genericPage(page).usernameFieldShowsFillKey(selector);
        }
    }

    return new SingleStepFormPage();
}
