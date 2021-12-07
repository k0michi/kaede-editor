export class MenuBar {
  constructor() {
    this.menus = [];

    const menuBar = document.createElement('div');
    menuBar.classList.add('menu-bar');
    this.view = {menuBar};
  }

  addMenu(menu) {
    this.menus.push(menu);
    this.view.menuBar.appendChild(menu.view.menu);
  }
}

export class Menu {
  constructor(text) {
    this.text = text;
    this.menuItems = [];

    const menu = document.createElement('div');
    menu.classList.add('menu');
    const menuButton = document.createElement('button');
    menuButton.classList.add('menu-button');
    menuButton.textContent = this.text;
    menu.appendChild(menuButton);

    menuButton.addEventListener('mousedown', e => {
      if (draggedMenu == menu) {
        draggedMenu = null;
        menu.classList.remove('open');
      } else {
        draggedMenu = menu;
        menu.classList.add('open');
      }
    });

    menuButton.addEventListener('mouseenter', e=>{
      if (draggedMenu != null) {
        draggedMenu.classList.remove('open');
        menu.classList.add('open');
        draggedMenu = menu;
      }
    });

    const menuItems = document.createElement('div');
    menuItems.classList.add('menu-items');
    menu.appendChild(menuItems);
    this.view = {menu,menuButton,menuItems};
  }

  addMenuItem(menuItem) {
    this.menuItems.push(menuItem);
    this.view.menuItems.appendChild(menuItem.view.menuButton);
  }
}

export class MenuItem {
  constructor(text, onSelected) {
    this.text = text;
    this.onSelected = onSelected;

    const menuButton = document.createElement('button');
    menuButton.classList.add('menu-button');
    menuButton.addEventListener('mousedown', this.onSelected);
    menuButton.textContent = text;
    this.view = {menuButton};
  }
}

export class MenuItemGroup extends MenuItem {
}