(async function() {
  let { accounts } = await browser.storage.local.get('accounts');
  let { sign_in_paths } = await browser.storage.local.get('sign_in_paths');
  accounts ||= [];
  sign_in_paths ||= ['/sign_in', '/users/sign_in'];

  accounts.sort((a, b) => {
    return b.lastAccessed.localeCompare(a.lastAccessed);
  }).forEach((account) => {
    let liNode = document.createElement('li');
    liNode.style.listStyleType = 'none'; // Remove default bullet points

    // Email address
    let emailTextNode = document.createTextNode(account.email);
    liNode.appendChild(emailTextNode);

    // Used paths as clickable links in a nested list
    if (account.usedPaths && account.usedPaths.length > 0) {
      let nestedUl = document.createElement('ul');
      nestedUl.style.listStyleType = 'none';
      nestedUl.style.paddingLeft = '1em'; // Indent nested list

      account.usedPaths.forEach((path) => {
        let pathLi = document.createElement('li');

        let pathLink = document.createElement('a');
        pathLink.href = path.startsWith('/') ? `${window.location.origin}${path}` : path;
        pathLink.textContent = path;
        pathLink.style.color = 'gray';
        pathLink.style.fontSize = '0.8em';
        pathLink.style.textDecoration = 'none';

        pathLi.appendChild(pathLink);
        nestedUl.appendChild(pathLi);
      });

      liNode.appendChild(nestedUl);
    }

    document.getElementById('account_list').appendChild(liNode);
  });

  sign_in_paths.sort().forEach((path) => {
    let textNode = document.createTextNode(path);
    let liNode = document.createElement('li');
    liNode.appendChild(textNode);
    document.getElementById('path_list').appendChild(liNode);
  });

  document.getElementById('add_path_form').addEventListener('submit', async (event) => {
    event.preventDefault();
    let fd = new FormData(event.target);
    let new_path = fd.get('new_path');

    if (!sign_in_paths.includes(new_path)) {
      sign_in_paths.push(new_path);
      await browser.storage.local.set({ sign_in_paths });
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
