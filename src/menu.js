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
  constructor(text) {
    this.text = text;

    const menuItem = document.createElement('button');
    menuItem.classList.add('menu-item');
    menuItem.addEventListener('mouseup', e => {
      if (this.onSelected != null) {
        this.onSelected(e);
      }
    });
    menuItem.textContent = text;
    this.view = { menuItem };
  }

  setText(text) {
    this.text = text;
    this.view.menuItem.textContent = text;
  }

  on(eventName, listener) {
    if (eventName == 'selected') {
      this.view.menuItem.addEventListener('mouseup', listener);
    }
  }
}

export class MenuItemRadio extends MenuItem {
  constructor(text, checked) {
    super(createMenuText(text, checked));
    this.originalText = text;
    this.checked = checked;
  }

  on(eventName, listener) {
    if (eventName == 'selected') {
      super.on('selected', e => {
        if (this.checked) {
          this.setText(createMenuText(this.originalText, false));
          this.checked = false;
        } else {
          this.setText(createMenuText(this.originalText, true));
          this.checked = true;
        }

        listener(e, this.checked);
      });
    }
  }
}

function createMenuText(text, checked) {
  return checked ? `✓ ${text}` : text;
}

export class MenuItemGroup extends MenuItem {
}