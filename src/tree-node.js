export default class TreeNode {
  constructor(value, children = []) {
    this.value = value;
    this.children = children;

    for (const child of children) {
      child.setParent(this);
    }
  }

  appendChild(child) {
    this.children.push(child);
    child.setParent(this);
    this.columnContainer.append(child.rowContainer);
  }

  setParent(parent) {
    this.parent = parent;
  }

  setElements(cell, rowContainer, columnContainer) {
    this.cell = cell;
    this.rowContainer = rowContainer;
    this.columnContainer = columnContainer;
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