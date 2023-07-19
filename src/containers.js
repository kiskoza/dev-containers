SIGN_IN_PATHS = ['/sign_in', '/users/sign_in'];
FORM = SIGN_IN_PATHS.map(el => `form[action="${el}"]`).join(', ');
USERNAME_FIELD = ['text', 'email'].map(el => `input[type=${el}]`).join(', ');
PASSWORD_FIELD = ['password'].map(el => `input[type=${el}]`).join(', ');

(async function init () {
  browser.runtime.onMessage.addListener(message => {
    switch (message.action) {
    case 'ping':
      return 'pong';
    case "login":
      let signInForm = document.querySelector(FORM);

      signInForm.querySelector(USERNAME_FIELD).value = message.email;
      signInForm.querySelector(PASSWORD_FIELD).value = message.password;

      signInForm.submit();

      return;
    default:
      throw new Error("Unexpected message!");
    }
  });

  if (SIGN_IN_PATHS.includes(window.location.pathname)) {
    let signInForm = document.querySelector(FORM)
    signInForm.addEventListener('submit', async (event) => {
      let email = event.target.querySelector(USERNAME_FIELD).value;
      let password = event.target.querySelector(PASSWORD_FIELD).value;

      await browser.runtime.sendMessage({
        message: "login",
        email: email,
        password: password
      });

      event.preventDefault();
    })
  }
})();
