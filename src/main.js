import * as utils from './utils';
import TreeNode from "./tree-node";
import './style.css';

let currentTree;

let textRoot;

window.addEventListener('load', () => {
  textRoot = document.getElementById('text-root');

  constructTree(new TreeNode(null, [new TreeNode('')]));

  const openButton = document.getElementById('open-button');
  openButton.addEventListener('click', async e => {
    const files = await utils.openFile();
    const content = await utils.readAsText(files[0]);
    utils.removeChildNodes(textRoot);
    constructTree(TreeNode.fromObject(JSON.parse(content)))
  });

  const saveButton = document.getElementById('save-button');
  saveButton.addEventListener('click', e => {
    utils.saveFile('Untitled.json', JSON.stringify(currentTree.toObject()));
  });
});

function constructTree(rootNode) {
  currentTree = rootNode;
  rootNode.setElements(null, null, textRoot);
  renderTreeNode(textRoot, rootNode);
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
}

function createCell(node) {
  const cell = document.createElement('div');
  cell.contentEditable = true;
  cell.className = 'cell';
  cell.textContent = node.value;

  cell.addEventListener('input', e => {
    node.value = cell.textContent;
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