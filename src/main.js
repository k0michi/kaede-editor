import * as utils from './utils';
import './style.css';

let currentDocument = {
  children: [
    {
      value: '',
      children: []
    }
  ]
};

window.addEventListener('load', () => {
  const textRoot = document.getElementById('text-root');
  appendTreeNode(textRoot, currentDocument);

  const openButton = document.getElementById('open-button');
  openButton.addEventListener('click', async e => {
    const files = await utils.openFile();
    const content = await utils.readAsText(files[0]);
    currentDocument = JSON.parse(content);
    utils.removeChildNodes(textRoot);
    appendTreeNode(textRoot, currentDocument);
  });

  const saveButton = document.getElementById('save-button');
  saveButton.addEventListener('click', e => {
    utils.saveFile('Untitled.json', JSON.stringify(currentDocument));
  });
});

function highlight(editor) {
  const code = editor.textContent;
  editor.innerHTML = code;
}

function appendTreeNode(container, parent) {
  if (parent.children == null) {
    return;
  }

  for (const child of parent.children) {
    const cell = createCell(child);
    child.parent = parent;
    child.cell = cell;

    const rowContainer = document.createElement('div');
    rowContainer.className = 'row-container';
    rowContainer.appendChild(cell);

    const columnContainer = document.createElement('div');
    columnContainer.className = 'column-container';
    rowContainer.appendChild(columnContainer);
    appendTreeNode(columnContainer, child);

    container.appendChild(rowContainer);
  }
}

function createCellContainer(node) {
  const cell = createCell(node);
  node.cell = cell;

  const rowContainer = document.createElement('div');
  rowContainer.className = 'row-container';
  rowContainer.appendChild(cell);

  const columnContainer = document.createElement('div');
  columnContainer.className = 'column-container';
  rowContainer.appendChild(columnContainer);

  return rowContainer;
}

function createCell(node) {
  const cell = document.createElement('div');
  cell.contentEditable = true;
  cell.className = 'cell';
  cell.textContent = node.value;

  cell.addEventListener('keydown', e => {
    if (e.code == 'Enter') {
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
          const newNode = { value: '', parent: node.parent, children: [] };
          const container = createCellContainer(newNode);
          node.parent.children.push(newNode);
          node.parent.cell.nextSibling.appendChild(container);
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
          const newNode = { value: '', parent: node, children: [] };
          const container = createCellContainer(newNode);
          node.children.push(newNode);
          node.cell.nextSibling.appendChild(container);
          newNode.cell.focus();
        }
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