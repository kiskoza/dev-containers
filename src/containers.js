(async function init () {
  browser.runtime.onMessage.addListener(message => {
    switch (message.action) {
    case 'ping':
      return 'pong';
    case "login":
      let signInForm = document.querySelector('form[action="/sign_in"]');

      signInForm.querySelector('input[type=text]').value = message.email;
      signInForm.querySelector('input[type=password]').value = message.password;

      signInForm.submit();

      return;
    default:
      throw new Error("Unexpected message!");
    }
  });

  if (window.location.pathname === '/sign_in') {
    let signInForm = document.querySelector('form[action="/sign_in"]')
    signInForm.addEventListener('submit', async (event) => {
      let email = event.target.querySelector('input[type=text]').value;
      let password = event.target.querySelector('input[type=password]').value;

      await browser.runtime.sendMessage({
        message: "login",
        email: email,
        password: password
      });

      event.preventDefault();
    })
  }
})();
