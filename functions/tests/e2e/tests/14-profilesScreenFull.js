const { getDriver } = require('../driver/driverFactory')
const { elementByIdAndClickAndTest, elementByIdClick, goBackKey, noTestLabel } = require('../driver/helpers/elements')
const { sendKeysToElementById } = require('../driver/helpers/sendKeys')


const test14_profilesScreenFull = async () => {
  console.log('14_profilesScreenFull')
  const driver = getDriver()
  
    // Log In Premium

  await elementByIdAndClickAndTest('tab_more_screen', 'more_screen_view')
  await elementByIdAndClickAndTest('more_screen_login_cell', 'auth_screen_sign_up_button')
  await sendKeysToElementById('login_email_text_input', 'premium@stage.podverse.fm', 'Valid Login Email Input')
  await sendKeysToElementById('login_password_text_input', 'Aa!1asdf', 'Valid Login Password Input')
  await elementByIdClick('login_submit_button')
  await driver.sleep(4000)

    // My Library Screen
  await elementByIdAndClickAndTest('tab_my_library_screen', 'my_library_screen_view')

    // Profiles Screen
  await elementByIdAndClickAndTest('my_library_screen_profiles_cell', 'profiles_screen_view')
  await elementByIdAndClickAndTest('profiles_screen_profile_0', 'profile_screen_view')
  await elementByIdAndClickAndTest('profile_screen_subscribe_button', 'profile_screen_is_not_subscribed')
  await elementByIdAndClickAndTest('profile_screen_subscribe_button', 'profile_screen_is_subscribed')
  await driver.back()
  await driver.back()


    // Log Out

  await elementByIdAndClickAndTest('tab_more_screen', 'more_screen_view')
  await elementByIdAndClickAndTest('more_screen_log_out_cell', 'more_screen_view')
  await elementByIdAndClickAndTest('tab_podcasts_screen', 'podcasts_screen_view')
}

module.exports = {
  test14_profilesScreenFull
}
