// https://www.reddit.com/account/register/
module.exports = `
<form>

    <input type="email" name="fakeemailremembered" data-empty="true" data-manual-scoring="unknown">
    <input style="display:none" type="text" name="fakeusernameremembered" data-empty="true" data-manual-scoring="unknown">
    <input style="display:none" type="password" name="fakepasswordremembered" data-empty="true" data-manual-scoring="unknown">
    <div style="overflow: hidden; height: 0px;background: transparent;" data-description="dummyPanel for Chrome auto-fill issue">
        <input type="email" data-description="dummyEmail" data-empty="true" data-manual-scoring="unknown">
        <input type="text" style="height:0;background: transparent; color: transparent;border: none;" data-description="dummyUsername" data-empty="true" data-manual-scoring="unknown">
        <input type="password" style="height:0;background: transparent; color: transparent;border: none;" data-description="dummyPassword" data-empty="true" data-manual-scoring="unknown">
    </div>

    <fieldset class="AnimatedForm__field m-required">

        <input id="regUsername-prevent" style="display: none;" data-hidden="" type="text" name="username-prevent" placeholder="choose_username" data-empty="true" data-manual-scoring="unknown">
        <input id="regUsername" class="AnimatedForm__textInput" type="text" name="username" placeholder="Choose a Username" data-empty="true" data-manual-scoring="username">
        <label class="AnimatedForm__textInputLabel" for="regUsername">
                
                  
                Choose a Username
              
                
              </label>

        <div class="AnimatedForm__errorMessage" data-for="username"></div>
    </fieldset>

    <fieldset class="AnimatedForm__field m-required">
        <input id="regPassword-prevent" style="display: none;" data-hidden="" type="password" name="password-prevent" placeholder="Password" data-empty="true" data-manual-scoring="unknown">
        <input id="regPassword" class="AnimatedForm__textInput" type="password" name="password" placeholder="Password" autocomplete="new-password" data-empty="true" data-manual-scoring="password">
        <label class="AnimatedForm__textInputLabel" for="regPassword">Password</label>
        <div class="PasswordMeter">
            <div class="PasswordMeter__Strength"></div>
            <div class="PasswordMeter__Strength"></div>
            <div class="PasswordMeter__Strength"></div>
            <div class="PasswordMeter__Strength"></div>
            <div class="PasswordMeter__Strength"></div>
        </div>
        <div class="AnimatedForm__errorMessage" data-for="password"></div>
    </fieldset>

</form>
`