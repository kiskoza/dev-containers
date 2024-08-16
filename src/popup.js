(async function() {
  let { accounts } = await browser.storage.local.get('accounts');
  let { sign_in_paths } = await browser.storage.local.get('sign_in_paths');
  accounts ||= [];
  sign_in_paths ||= ['/sign_in', '/users/sign_in'];

  accounts.sort().forEach((account) => {
    let textNode = document.createTextNode(account);
    let liNode = document.createElement('li');
    liNode.appendChild(textNode);
    document.getElementById('account_list').appendChild(liNode);
  });

  sign_in_paths.sort().forEach((account) => {
    let textNode = document.createTextNode(account);
    let liNode = document.createElement('li');
    liNode.appendChild(textNode);
    document.getElementById('login_list').appendChild(liNode);
  });

  document.getElementById('new-path-form').addEventListener('submit', async (event) => {
    new FormData(event.srcElement)
    fd = new FormData(event.srcElement)
    let new_path = fd.get('new_path')

    if ( !sign_in_paths.includes(new_path) ) {
      sign_in_paths.push(new_path);
      browser.storage.local.set({sign_in_paths});
    }
  });
})();
