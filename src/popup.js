(async function() {
  let { sign_in_paths } = await browser.storage.local.get('sign_in_paths');
  sign_in_paths ||= ['/sign_in', '/users/sign_in'];

  await renderAccountList(); // Call renderAccountList to display accounts

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

// Function to remove an account and its associated container
async function removeAccountAndContainer(email) {
  // Find the contextual identity associated with the email
  const containerName = `[DEV] ${email}`;
  const identities = await browser.contextualIdentities.query({ name: containerName });

  if (identities.length > 0) {
    const contextualIdentity = identities[0];
    const cookieStoreId = contextualIdentity.cookieStoreId;

    // Get all currently open tabs
    const allTabs = await browser.tabs.query({});

    // Get all tabs belonging to the container
    const tabsToRemove = await browser.tabs.query({ cookieStoreId });

    // Check if all open tabs belong to the container
    if (tabsToRemove.length === allTabs.length) {
      // Open a new, empty tab
      await browser.tabs.create({});
    }

    // Close all tabs within the container
    for (const tab of tabsToRemove) {
      await browser.tabs.remove(tab.id);
    }

    // Remove the container
    await browser.contextualIdentities.remove(cookieStoreId);
  }

  // Remove the account information from storage
  const accountsData = await browser.storage.local.get('accounts');
  let accounts = accountsData.accounts || [];
  accounts = accounts.filter(account => account.email !== email);
  await browser.storage.local.set({ accounts });

  // Refresh the account list in the popup
  await renderAccountList();
}

// Function to render the account list
async function renderAccountList() {
  // Clear the existing content of the #account_list element
  const accountList = document.getElementById('account_list');
  accountList.innerHTML = '';

  // Fetch the accounts array from browser.storage.local
  const { accounts } = await browser.storage.local.get('accounts');
  const sortedAccounts = (accounts || []).sort((a, b) => b.lastAccessed.localeCompare(a.lastAccessed));

  // Iterate through the sorted accounts array
  sortedAccounts.forEach((account) => {
    // Create the <li> element for the account
    const liNode = document.createElement('li');
    liNode.style.listStyleType = 'none';

    // Add the email address
    const emailTextNode = document.createTextNode(account.email);
    liNode.appendChild(emailTextNode);

    // Create the remove <a> element
    const removeLink = document.createElement('a');
    removeLink.textContent = '🗑️';
    removeLink.classList = 'remove-account';
    removeLink.title = 'Remove Account';
    removeLink.addEventListener('click', () => {
      removeAccountAndContainer(account.email);
    });
    liNode.appendChild(removeLink);

    // Create the nested <ul> for usedPaths
    if (account.usedPaths && account.usedPaths.length > 0) {
      const nestedUl = document.createElement('ul');
      nestedUl.classList = 'used-paths';

      account.usedPaths.forEach((path) => {
        const pathLi = document.createElement('li');

        const pathLink = document.createElement('a');
        pathLink.href = path.startsWith('/') ? `${window.location.origin}${path}` : path;
        pathLink.textContent = path;
        pathLink.classList = 'path-link';

        pathLi.appendChild(pathLink);
        nestedUl.appendChild(pathLi);
      });

      liNode.appendChild(nestedUl);
    }

    // Append the <li> to the #account_list element
    accountList.appendChild(liNode);
  });
}

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
