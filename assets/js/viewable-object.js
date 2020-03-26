export default class ViewableObject {

  #graphics;

  constructor() {
    this.#graphics = [];
  }

  get graphics() {
    return this.#graphics;
  }

  set graphics(value) {
    this.#graphics = value;
  }
}
