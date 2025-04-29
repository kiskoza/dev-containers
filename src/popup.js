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
    document.getElementById('path_list').appendChild(liNode);
  });

  document.getElementById('add_path_form').addEventListener('submit', async (event) => {
    new FormData(event.srcElement)
    fd = new FormData(event.srcElement)
    let new_path = fd.get('new_path')

    if ( !sign_in_paths.includes(new_path) ) {
      sign_in_paths.push(new_path);
      browser.storage.local.set({sign_in_paths});
    }
  });
})();

document.addEventListener("DOMContentLoaded", () => {
  const accountsTab = document.getElementById("accounts-tab");
  const pathsTab = document.getElementById("paths-tab");
  const accountsContent = document.getElementById("accounts-content");
  const pathsContent = document.getElementById("paths-content");

  // Function to switch tabs
  function switchTab(activeTab, inactiveTab, activeContent, inactiveContent) {
    activeTab.style.background = "#f0f0f0";
    inactiveTab.style.background = "#fff";
    activeContent.style.display = "block";
    inactiveContent.style.display = "none";
  }

  // Set default tab
  switchTab(accountsTab, pathsTab, accountsContent, pathsContent);

  // Event listeners for tab switching
  accountsTab.addEventListener("click", () => {
    switchTab(accountsTab, pathsTab, accountsContent, pathsContent);
  });

  pathsTab.addEventListener("click", () => {
    switchTab(pathsTab, accountsTab, pathsContent, accountsContent);
  });
});
