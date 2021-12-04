import * as utils from './utils';
import TreeNode from "./tree-node";
import './style.css';
import icon from './kaede.png';

let textRoot;
let draggedMenu;
let tabs;
let files = [];
let currentFile;

window.addEventListener('load', () => {
  document.getElementById('icon').src = icon;
  const menus = document.getElementById('menus');

  for (const menu of menus.getElementsByClassName('menu')) {
    const menuButton = menu.getElementsByClassName('menu-button')[0];

    menuButton.addEventListener('mousedown', e => {
      if (draggedMenu == menu) {
        draggedMenu = null;
        menu.classList.remove('open');
      } else {
        draggedMenu = menu;
        menu.classList.add('open');
      }
    });
  }

  document.body.addEventListener('mouseup', e => {
    if (draggedMenu != null) {
      const menuButton = draggedMenu.getElementsByClassName('menu-button')[0];

      if (e.target != menuButton) {
        draggedMenu.classList.remove('open');
        draggedMenu = null;
      }
    }
  });

  textRoot = document.getElementById('tree');

  const newButton = document.getElementById('new-button');
  newButton.addEventListener('mouseup', e => {
    openTree('Untitled', newBlankTree());
  });

  const openButton = document.getElementById('open-button');
  openButton.addEventListener('mouseup', async e => {
    const files = await utils.openFile();
    const file = files[0];
    const content = await utils.readAsText(file);
    openTree(file.name, TreeNode.fromObject(JSON.parse(content)));
  });

  const saveButton = document.getElementById('save-button');
  saveButton.addEventListener('mouseup', e => {
    utils.saveFile(currentFile.name, JSON.stringify(currentFile.tree.toObject()));
  });

  const closeButton = document.getElementById('close-button');
  closeButton.addEventListener('mouseup', e => {
    closeTab();
  });

  tabs = document.getElementById('tabs');
  openTree('Untitled', newBlankTree());
});

function closeTab() {
  const index = files.indexOf(currentFile);
  const nextFile = files[index + 1] ?? files[index - 1];

  tabs.removeChild(currentFile.tab);
  files.splice(index, 1);

  if (nextFile != null) {
    selectTab(nextFile);
  }

  // All tabs were closed
  if (files == 0) {
    openTree('Untitled', newBlankTree());
  }
}

function newBlankTree() {
  return new TreeNode(null, [new TreeNode('')]);
}

function openTree(filename, tree) {
  const tab = document.createElement('div');
  tab.className = 'tab';
  tab.textContent = filename;
  tabs.appendChild(tab);
  constructTree(tree);
  const file = { name: filename, tree, tab };
  files.push(file);
  selectTab(file);

  tab.addEventListener('mousedown', e => {
    selectTab(file);
  });
}

function selectTab(file) {
  utils.removeChildNodes(textRoot);
  textRoot.appendChild(file.tree.columnContainer);
  currentFile?.tab.classList.remove('active');
  file.tab.classList.add('active');
  currentFile = file;
}

function constructTree(rootNode) {
  const columnContainer = document.createElement('div');
  columnContainer.className = 'column-container';
  textRoot.appendChild(columnContainer);
  rootNode.setElements(null, null, columnContainer);
  renderTreeNode(columnContainer, rootNode);
}

function renderTreeNode(container, parent) {
  if (parent.children == null) {
    return;
  }

  for (const child of parent.children) {
    createCellContainer(child);
    renderTreeNode(child.columnContainer, child);
    container.appendChild(child.rowContainer);
  }
}

function createCellContainer(node) {
  const cell = createCell(node);

  const rowContainer = document.createElement('div');
  rowContainer.className = 'row-container';
  rowContainer.appendChild(cell);

  const columnContainer = document.createElement('div');
  columnContainer.className = 'column-container';
  rowContainer.appendChild(columnContainer);

  node.setElements(cell, rowContainer, columnContainer);
  node.setColor(getLevel(node.value));
}

function getLevel(string) {
  const firstChar = string[0];
  let level = 0;

  if (firstChar == '*' || firstChar == '/') {
    for (let i = 0; i < string.length; i++) {
      if (string[i] == firstChar) {
        level++;
      } else {
        break;
      }
    }

    if (firstChar == '/') {
      level *= -1;
    }
  }

  return level;
}

function createCell(node) {
  const cell = document.createElement('div');
  cell.contentEditable = true;
  cell.className = 'cell';
  cell.textContent = node.value;

  cell.addEventListener('input', e => {
    node.value = cell.textContent;
    node.setColor(getLevel(node.value));
  });

  cell.addEventListener('keydown', e => {
    // Check if the stroke was not for IME conversion
    if (e.code == 'Enter' && e.keyCode == 13) {
      e.preventDefault();

      const index = node.parent.children.indexOf(node);

      if (e.shiftKey) {
        if (node.parent.children[index - 1]?.cell != null) {
          node.parent.children[index - 1].cell.focus();
        }
      } else {
        if (node.parent.children[index + 1]?.cell != null) {
          node.parent.children[index + 1].cell.focus();
        } else {
          const newNode = new TreeNode('');
          createCellContainer(newNode);
          node.parent.appendChild(newNode);
          newNode.cell.focus();
        }
      }
    }

    if (e.code == 'Tab') {
      e.preventDefault();

      if (e.shiftKey) {
        if (node.parent.cell != null) {
          node.parent.cell.focus();
        }
      } else {
        if (node.children[0]?.cell != null) {
          node.children[0].cell.focus();
        } else {
          const newNode = new TreeNode('');
          createCellContainer(newNode);
          node.appendChild(newNode);
          newNode.cell.focus();
        }
      }
    }

    if (e.code == 'Backspace') {
      if (node.value == '' && node.isLeafNode() && !(node.parent.isRootNode() && node.parent.children.length == 1)) {
        const prev = node.parent.previousSibling(node);

        if (prev != null) {
          prev.focus();
        } else {
          node.parent.focus();
        }

        node.parent.removeChild(node);
      }
    }
  });

  cell.addEventListener('focus', e => {
    cell.classList.add('focus');
  });

  cell.addEventListener('blur', e => {
    cell.classList.remove('focus');
  });

  return cell;
}