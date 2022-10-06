/**
 * Creates a given or generic form element, overwrites the DOM with it and returns it
 * You can also pass a div or other as the container, but it must have id=form
 * @param {string} [form] - HTML string of a form element
 */
const attachAndReturnGenericForm = (form) => {
    if (form) {
        document.body.innerHTML = form
    } else {
        document.body.innerHTML = `
<form>
    <input type="text" value="testUsername" autocomplete="username" />
    <input type="password" value="testPassword" autocomplete="new-password" />
    <button type="submit">Sign up</button>
</form>`
    }
    const formEl = /** @type {HTMLElement} */ (document.querySelector('form, #form'))
    if (!formEl) throw new Error('unreachable')

    // We're doing this so that isVisible(button) === true. See jest.setup.js for more info
    const button = formEl.querySelector('button')
    // @ts-ignore
    button._jsdomMockClientWidth = 150
    // @ts-ignore
    button._jsdomMockClientHeight = 50

    return formEl
}

export {attachAndReturnGenericForm}
