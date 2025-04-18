import { buttonMatchesFormType, getTextShallow, pierceShadowTree, safeRegexTest } from '../autofill-utils.js';
import { extractElementStrings } from '../Form/label-util.js';

/**
 * This is a single place to contain all functionality relating to form submission detection
 *
 * @param {Map<HTMLElement, import("../Form/Form").Form>} forms
 * @param {import("../Form/matching").Matching} matching
 */
export function initFormSubmissionsApi(forms, matching) {
    /**
     * Global submit events
     */
    window.addEventListener(
        'submit',
        (e) => {
            // @ts-ignore
            return forms.get(e.target)?.submitHandler('global submit event');
        },
        true,
    );

    /**
     * Global keydown events
     */
    window.addEventListener(
        'keydown',
        (e) => {
            if (e.key === 'Enter') {
                const focusedForm = [...forms.values()].find((form) => form.hasFocus(e));
                focusedForm?.submitHandler('global keydown + Enter');
            }
        },
        true,
    );

    /**
     * Global pointer down events
     * @param {PointerEvent} event
     */
    window.addEventListener(
        'pointerdown',
        (event) => {
            const realTarget = pierceShadowTree(event);

            const formsArray = [...forms.values()];
            const matchingForm = formsArray.find((form) => {
                const btns = [...form.submitButtons];
                // @ts-ignore
                if (btns.includes(realTarget)) return true;

                // @ts-ignore
                if (btns.find((btn) => btn.contains(realTarget))) return true;
                return false;
            });

            matchingForm?.submitHandler('global pointerdown event + matching form');

            if (!matchingForm) {
                const selector =
                    matching.cssSelector('submitButtonSelector') + ', a[href="#"], a[href^=javascript], *[onclick], [class*=button i]';
                // check if the click happened on a button
                const button = /** @type HTMLElement */ (realTarget)?.closest(selector);
                if (!button) return;

                // If the element we've found includes a form it can't be a button, it's a false match
                const buttonIsAFalsePositive = formsArray.some((form) => button?.contains(form.form));
                if (buttonIsAFalsePositive) return;

                const text = getTextShallow(button) || extractElementStrings(button).join(' ');
                const hasRelevantText = safeRegexTest(matching.getDDGMatcherRegex('submitButtonRegex'), text);
                if (hasRelevantText && text.length < 25) {
                    // check if there's a form with values
                    const filledForm = formsArray.find((form) => form.hasValues());
                    if (filledForm && buttonMatchesFormType(/** @type HTMLElement */ (button), filledForm)) {
                        filledForm?.submitHandler('global pointerdown event + filled form');
                    }
                }

                // TODO: Temporary hack to support Google signin in different languages
                // https://app.asana.com/0/1198964220583541/1201650539303898/f
                if (/** @type HTMLElement */ (realTarget)?.closest('#passwordNext button, #identifierNext button')) {
                    // check if there's a form with values
                    const filledForm = formsArray.find((form) => form.hasValues());
                    filledForm?.submitHandler('global pointerdown event + google escape hatch');
                }
            }
        },
        true,
    );

    /**
     * @type {PerformanceObserver}
     */
    const observer = new PerformanceObserver((list) => {
        const formsArray = [...forms.values()];
        const entries = list.getEntries().filter(
            (entry) =>
                // @ts-ignore why does TS not know about `entry.initiatorType`?
                ['fetch', 'xmlhttprequest'].includes(entry.initiatorType) && safeRegexTest(/login|sign-in|signin/, entry.name),
        );

        if (!entries.length) return;

        const filledForm = formsArray.find((form) => form.hasValues());
        const focusedForm = formsArray.find((form) => form.hasFocus());
        // If a form is still focused the user is still typing: do nothing
        if (focusedForm) return;

        filledForm?.submitHandler('performance observer');
    });
    observer.observe({ entryTypes: ['resource'] });
}
