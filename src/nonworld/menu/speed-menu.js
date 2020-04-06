import Menu from './menu';
import MenuItem from './menu-item';

export default class SpeedMenu extends Menu {

  // Constants
  static PAUSED_ITEM = 0;
  static NORMAL_ITEM = 1;
  static ITEMS = [
    {
      'id': SpeedMenu.PAUSED_ITEM,
      'label': 'Paused',
    },
    {
      'id': SpeedMenu.NORMAL_ITEM,
      'label': 'Normal',
    },
  ];

  constructor(menubar) {
    super(menubar);
    this._label = 'Speed';

    for (let i = 0; i < SpeedMenu.ITEMS.length; i++) {
      const item = SpeedMenu.ITEMS[i];
      const y = Menu.HEIGHT + (i * MenuItem.HEIGHT);
      this._items.push(new MenuItem(this, item.id, item.label, 0, y));
    }
  }

  /**
   *
   * @param {MenuItem} menuItem
   */
  onMenuItemClick(menuItem){
    console.log('onMenuItemClick');
    switch(menuItem.id){
      case SpeedMenu.NORMAL_ITEM:
        console.log('onMenuItemClick: normal');
        break;
      case SpeedMenu.PAUSED_ITEM:
        console.log('onMenuItemClick: paused');
        break;
    }
  }
}
