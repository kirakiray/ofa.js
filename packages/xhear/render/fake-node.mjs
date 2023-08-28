export class FakeNode extends Comment {
  constructor(markname) {
    const tagText = `Fake Node${markname ? ": " + markname : ""}`;

    super(` ${tagText} --end `);

    this._mark = markname;
    this._inited = false;

    const startCom = new Comment(` ${tagText} --start `);
    startCom.__fake_end = this;

    Object.defineProperty(this, "_start", {
      value: startCom,
    });
  }

  init() {
    if (this._inited) {
      return;
    }

    this.parentNode.insertBefore(this._start, this);
    this._inited = true;
  }

  querySelector(expr) {
    return this.__searchEl(expr, "find");
  }

  querySelectorAll(expr) {
    return this.__searchEl(expr);
  }

  __searchEl(expr, funcName = "filter") {
    const startParent = this.parentNode;
    if (!startParent) return [];

    const childs = this.children;

    return Array.from(startParent.querySelectorAll(expr))[funcName]((e) => {
      let par = e;
      while (true) {
        if (childs.includes(par)) {
          return true;
        }

        par = par.parentNode;

        if (!par) {
          break;
        }
      }
    });
  }

  insertBefore(newEle, target) {
    const { parentNode } = this;

    if (Array.from(parentNode.children).includes(target)) {
      parentNode.insertBefore(newEle, target);
    } else {
      parentNode.insertBefore(newEle, this);
    }
  }

  appendChild(newEle) {
    this.parentNode.insertBefore(newEle, this);
  }

  get children() {
    const childs = [];

    let prev = this;
    while (true) {
      prev = prev.previousSibling;

      if (prev) {
        if (prev instanceof HTMLElement) {
          childs.unshift(prev);
        } else if (prev === this._start) {
          break;
        }
      } else {
        throw `This is an unclosed FakeNode`;
      }
    }

    return childs;
  }

  get childNodes() {
    const childs = [];

    let prev = this;
    while (true) {
      prev = prev.previousSibling;

      if (prev) {
        if (prev === this._start) {
          break;
        }
        childs.unshift(prev);
      } else {
        throw `This is an unclosed FakeNode`;
      }
    }

    return childs;
  }

  set innerHTML(val) {
    this.childNodes.forEach((e) => {
      e.remove();
    });

    const temp = document.createElement("template");
    temp.innerHTML = val;

    Array.from(temp.content.childNodes).forEach((e) => {
      this.appendChild(e);
    });
  }

  get innerHTML() {
    const { children } = this;
    let content = "";

    children.forEach((e) => {
      content += e.outerHTML + "\n";
    });

    return content;
  }

  get nextElementSibling() {
    let next = this.nextSibling;

    if (!next) {
      return null;
    }

    if (next.__fake_end) {
      return next.__fake_end;
    }

    if (next && !(next instanceof Element)) {
      next = next.nextElementSibling;
    }

    return next;
  }

  get previousElementSibling() {
    const { _start } = this;
    let prev = _start.previousSibling;

    if (prev instanceof FakeNode) {
      return prev;
    }

    return _start.previousElementSibling;
  }
}
