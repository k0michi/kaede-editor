import kaedeIcon from './kaede.png';

export class MenuBar {
  constructor() {
    this.menus = [];
    this.druggedMenu = null;

    const menuBar = document.createElement('div');
    menuBar.id = 'menu-bar';
    const icon = document.createElement('img');
    icon.id = 'icon';
    icon.src = kaedeIcon;
    menuBar.appendChild(icon);
    this.view = { menuBar };
  }

  addMenu(menu) {
    menu.menuBar = this;
    this.menus.push(menu);
    this.view.menuBar.appendChild(menu.view.menu);
  }

  setDraggedMenu(menu) {
    if (this.druggedMenu != null) {
      this.druggedMenu.closeMenu();
    }

    if (menu != null) {
      menu.openMenu();
    }

    this.druggedMenu = menu;
  }
}

export class Menu {
  constructor(text) {
    this.text = text;
    this.menuItems = [];
    this.menuBar = null;
    this.dragged = false;

    const menu = document.createElement('div');
    menu.classList.add('menu');
    const menuButton = document.createElement('button');
    menuButton.classList.add('menu-button');
    menuButton.textContent = this.text;
    menu.appendChild(menuButton);

    menuButton.addEventListener('mousedown', e => {
      if (this.menuBar != null) {
        if (this.dragged) {
          this.menuBar.setDraggedMenu(null);
        } else {
          this.menuBar.setDraggedMenu(this);
        }
      }
    });

    menuButton.addEventListener('mouseenter', e => {
      if (this.menuBar != null) {
        if (this.menuBar.druggedMenu != null && !this.dragged) {
          this.menuBar.setDraggedMenu(this);
        }
      }
    });

    const menuItems = document.createElement('div');
    menuItems.classList.add('menu-items');
    menu.appendChild(menuItems);
    this.view = { menu, menuButton, menuItems };
  }

  addMenuItem(menuItem) {
    this.menuItems.push(menuItem);
    this.view.menuItems.appendChild(menuItem.view.menuItem);
  }

  openMenu() {
    this.view.menu.classList.add('open');
    this.dragged = true;
  }

  closeMenu() {
    this.view.menu.classList.remove('open');
    this.dragged = false;
  }
}

export class MenuItem {
  constructor(text, onSelected) {
    this.text = text;
    this.onSelected = onSelected;

    const menuItem = document.createElement('button');
    menuItem.classList.add('menu-item');
    menuItem.addEventListener('mouseup', this.onSelected);
    menuItem.textContent = text;
    this.view = { menuItem };
  }

  setText(text) {
    this.text = text;
    this.view.menuItem.textContent = text;
  }
}

export class MenuItemRadio extends MenuItem {
  constructor(text, checked, onSelected) {
    super(MenuItemRadio.createMenuText(text, checked), (e => {
      if (this.checked) {
        this.setText(this.createMenuText(this.text, false));
        this.checked = false;
      } else {
        this.setText(this.createMenuText(this.text, true));
        this.checked = true;
      }

      onSelected(e);
    }).bind(this));

    this.checked = checked;
  }

  static createMenuText(text, checked) {
    return checked ? `✓ ${text}` : text;
  }
}

export class MenuItemGroup extends MenuItem {
}