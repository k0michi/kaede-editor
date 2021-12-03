export default class TreeNode {
  constructor(value, children = []) {
    this.value = value;
    this.children = children;
    this.colorID = 0;

    for (const child of children) {
      child.setParent(this);
    }
  }

  appendChild(child) {
    this.children.push(child);
    child.setParent(this);
    this.columnContainer.appendChild(child.rowContainer);
  }

  removeChild(child) {
    // Remove child from this.children
    this.children.splice(this.children.indexOf(child), 1);
    child.setParent(null);
    this.columnContainer.removeChild(child.rowContainer);
  }

  setParent(parent) {
    this.parent = parent;
  }

  setElements(cell, rowContainer, columnContainer) {
    this.cell = cell;
    this.rowContainer = rowContainer;
    this.columnContainer = columnContainer;
  }

  focus() {
    this.cell.focus();
  }

  setColor(colorID) {
    this.cell.classList.remove(`color-${this.colorID < 0 ? 'm' : ''}${Math.abs(this.colorID)}`);
    this.cell.classList.add(`color-${colorID < 0 ? 'm' : ''}${Math.abs(colorID)}`);
    this.colorID = colorID;
  }

  nextSibling(node) {
    return this.children[this.children.indexOf(node) + 1];
  }

  previousSibling(node) {
    return this.children[this.children.indexOf(node) - 1];
  }

  isLeafNode() {
    return this.children.length == 0;
  }

  isRootNode() {
    return this.value == null;
  }

  toObject() {
    const children = [];

    for (const child of this.children) {
      children.push(child.toObject());
    }

    return {
      value: this.value,
      children
    };
  }

  static fromObject(object) {
    const value = object.value;
    const children = [];

    for (const child of object.children) {
      children.push(this.fromObject(child));
    }

    return new TreeNode(value, children);
  }
}