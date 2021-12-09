export default class TreeNode {
  constructor(value, children = []) {
    this.value = value;
    this.children = children;
    this.colorID = 0;
    this.view = {
      cell: null,
      rowContainer: null,
      columnContainer: null
    };

    for (const child of children) {
      child.setParent(this);
    }
  }

  appendChild(child) {
    this.children.push(child);
    child.setParent(this);
    this.view.columnContainer.appendChild(child.view.rowContainer);
  }

  removeChild(child) {
    // Remove child from this.children
    this.children.splice(this.children.indexOf(child), 1);
    child.setParent(null);
    this.view.columnContainer.removeChild(child.view.rowContainer);
  }

  setParent(parent) {
    this.parent = parent;
  }

  setView(view) {
    this.view = view;
  }

  focus() {
    this.view.cell.focus();
  }

  setColor(colorID) {
    this.view.cell.classList.remove(`color-${this.colorID < 0 ? 'm' : ''}${Math.abs(this.colorID)}`);
    this.view.cell.classList.add(`color-${colorID < 0 ? 'm' : ''}${Math.abs(colorID)}`);
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