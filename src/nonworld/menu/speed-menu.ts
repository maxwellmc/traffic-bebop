import Menu from './menu';
import MenuItem from './menu-item';
import Menubar from "./menubar";

export default class SpeedMenu extends Menu {

  // Constants
  public static readonly PAUSED_ITEM = 0;
  public static readonly NORMAL_ITEM = 1;
  public static readonly ITEMS = [
    {
      'id': SpeedMenu.PAUSED_ITEM,
      'label': 'Paused',
    },
    {
      'id': SpeedMenu.NORMAL_ITEM,
      'label': 'Normal',
    },
  ];

  constructor(menubar: Menubar) {
    super(menubar);
    this._label = 'Speed';

    for (let i = 0; i < SpeedMenu.ITEMS.length; i++) {
      const item = SpeedMenu.ITEMS[i];
      const y = Menu.HEIGHT + (i * MenuItem.HEIGHT);
      this._items.push(new MenuItem(this, item.id, item.label, 0, y));
    }
  }

  onMenuItemClick(menuItem: MenuItem): void{
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
