/**
 * Creates a given or generic form element, overwrites the DOM with it and returns it
 * You can also pass a div or other as the container, but it must have id=form
 * @param {string} [form] - HTML string of a form element
 */
const attachAndReturnGenericForm = (form) => {
    if (form) {
        document.body.innerHTML = `<div>${form}</div>`
    } else {
        document.body.innerHTML = `
<div>
    <form>
        <input type="text" value="testUsername" autocomplete="username" />
        <input type="password" value="testPassword" autocomplete="new-password" />
        <button type="submit">Sign up</button>
    </form>
</div>`
    }
    const formEl = /** @type {HTMLElement} */ (document.querySelector('form, #form'))
    if (!formEl) throw new Error('unreachable')

    const buttons = formEl.querySelectorAll('button, [role=button]')
    buttons.forEach((button) => {
        // We're doing this so that isPotentiallyViewable(button) === true. See jest.setup.js for more info
        // @ts-ignore
        button._jsdomMockClientWidth = 150
        // @ts-ignore
        button._jsdomMockClientHeight = 50
        // @ts-ignore
        button._jsdomMockOffsetWidth = 150
        // @ts-ignore
        button._jsdomMockOffsetHeight = 50
    })

    return formEl
}

const attachAndReturnGenericLoginForm = () => {
    const loginForm = `
<form>
    <input type="text" value="testUsername" autocomplete="username" />
    <input type="password" value="testPassword" autocomplete="current-password" />
    <button type="submit">Login</button>
</form>`
    return attachAndReturnGenericForm(loginForm)
}

export { attachAndReturnGenericForm, attachAndReturnGenericLoginForm }
