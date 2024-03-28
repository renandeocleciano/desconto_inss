class EventListener {
  constructor(e, t, r) {
    this.eventTarget = e;
    this.eventName = t;
    this.eventOptions = r;
    this.unorderedBindings = new Set();
  }
  connect() {
    this.eventTarget.addEventListener(this.eventName, this, this.eventOptions);
  }
  disconnect() {
    this.eventTarget.removeEventListener(
      this.eventName,
      this,
      this.eventOptions
    );
  }
  bindingConnected(e) {
    this.unorderedBindings.add(e);
  }
  bindingDisconnected(e) {
    this.unorderedBindings.delete(e);
  }
  handleEvent(e) {
    const t = extendEvent(e);
    for (const e of this.bindings) {
      if (t.immediatePropagationStopped) break;
      e.handleEvent(t);
    }
  }
  hasBindings() {
    return this.unorderedBindings.size > 0;
  }
  get bindings() {
    return Array.from(this.unorderedBindings).sort((e, t) => {
      const r = e.index,
        s = t.index;
      return r < s ? -1 : r > s ? 1 : 0;
    });
  }
}
function extendEvent(e) {
  if ("immediatePropagationStopped" in e) return e;
  {
    const { stopImmediatePropagation: t } = e;
    return Object.assign(e, {
      immediatePropagationStopped: false,
      stopImmediatePropagation() {
        this.immediatePropagationStopped = true;
        t.call(this);
      },
    });
  }
}
class Dispatcher {
  constructor(e) {
    this.application = e;
    this.eventListenerMaps = new Map();
    this.started = false;
  }
  start() {
    if (!this.started) {
      this.started = true;
      this.eventListeners.forEach((e) => e.connect());
    }
  }
  stop() {
    if (this.started) {
      this.started = false;
      this.eventListeners.forEach((e) => e.disconnect());
    }
  }
  get eventListeners() {
    return Array.from(this.eventListenerMaps.values()).reduce(
      (e, t) => e.concat(Array.from(t.values())),
      []
    );
  }
  bindingConnected(e) {
    this.fetchEventListenerForBinding(e).bindingConnected(e);
  }
  bindingDisconnected(e, t = false) {
    this.fetchEventListenerForBinding(e).bindingDisconnected(e);
    t && this.clearEventListenersForBinding(e);
  }
  handleError(e, t, r = {}) {
    this.application.handleError(e, `Error ${t}`, r);
  }
  clearEventListenersForBinding(e) {
    const t = this.fetchEventListenerForBinding(e);
    if (!t.hasBindings()) {
      t.disconnect();
      this.removeMappedEventListenerFor(e);
    }
  }
  removeMappedEventListenerFor(e) {
    const { eventTarget: t, eventName: r, eventOptions: s } = e;
    const n = this.fetchEventListenerMapForEventTarget(t);
    const i = this.cacheKey(r, s);
    n.delete(i);
    0 == n.size && this.eventListenerMaps.delete(t);
  }
  fetchEventListenerForBinding(e) {
    const { eventTarget: t, eventName: r, eventOptions: s } = e;
    return this.fetchEventListener(t, r, s);
  }
  fetchEventListener(e, t, r) {
    const s = this.fetchEventListenerMapForEventTarget(e);
    const n = this.cacheKey(t, r);
    let i = s.get(n);
    if (!i) {
      i = this.createEventListener(e, t, r);
      s.set(n, i);
    }
    return i;
  }
  createEventListener(e, t, r) {
    const s = new EventListener(e, t, r);
    this.started && s.connect();
    return s;
  }
  fetchEventListenerMapForEventTarget(e) {
    let t = this.eventListenerMaps.get(e);
    if (!t) {
      t = new Map();
      this.eventListenerMaps.set(e, t);
    }
    return t;
  }
  cacheKey(e, t) {
    const r = [e];
    Object.keys(t)
      .sort()
      .forEach((e) => {
        r.push(`${t[e] ? "" : "!"}${e}`);
      });
    return r.join(":");
  }
}
const e = {
  stop({ event: e, value: t }) {
    t && e.stopPropagation();
    return true;
  },
  prevent({ event: e, value: t }) {
    t && e.preventDefault();
    return true;
  },
  self({ event: e, value: t, element: r }) {
    return !t || r === e.target;
  },
};
const t =
  /^(?:(?:([^.]+?)\+)?(.+?)(?:\.(.+?))?(?:@(window|document))?->)?(.+?)(?:#([^:]+?))(?::(.+))?$/;
function parseActionDescriptorString(e) {
  const r = e.trim();
  const s = r.match(t) || [];
  let n = s[2];
  let i = s[3];
  if (i && !["keydown", "keyup", "keypress"].includes(n)) {
    n += `.${i}`;
    i = "";
  }
  return {
    eventTarget: parseEventTarget(s[4]),
    eventName: n,
    eventOptions: s[7] ? parseEventOptions(s[7]) : {},
    identifier: s[5],
    methodName: s[6],
    keyFilter: s[1] || i,
  };
}
function parseEventTarget(e) {
  return "window" == e ? window : "document" == e ? document : void 0;
}
function parseEventOptions(e) {
  return e
    .split(":")
    .reduce(
      (e, t) => Object.assign(e, { [t.replace(/^!/, "")]: !/^!/.test(t) }),
      {}
    );
}
function stringifyEventTarget(e) {
  return e == window ? "window" : e == document ? "document" : void 0;
}
function camelize(e) {
  return e.replace(/(?:[_-])([a-z0-9])/g, (e, t) => t.toUpperCase());
}
function namespaceCamelize(e) {
  return camelize(e.replace(/--/g, "-").replace(/__/g, "_"));
}
function capitalize(e) {
  return e.charAt(0).toUpperCase() + e.slice(1);
}
function dasherize(e) {
  return e.replace(/([A-Z])/g, (e, t) => `-${t.toLowerCase()}`);
}
function tokenize(e) {
  return e.match(/[^\s]+/g) || [];
}
function isSomething(e) {
  return null !== e && void 0 !== e;
}
function hasProperty(e, t) {
  return Object.prototype.hasOwnProperty.call(e, t);
}
const r = ["meta", "ctrl", "alt", "shift"];
class Action {
  constructor(e, t, r, s) {
    this.element = e;
    this.index = t;
    this.eventTarget = r.eventTarget || e;
    this.eventName =
      r.eventName ||
      getDefaultEventNameForElement(e) ||
      error("missing event name");
    this.eventOptions = r.eventOptions || {};
    this.identifier = r.identifier || error("missing identifier");
    this.methodName = r.methodName || error("missing method name");
    this.keyFilter = r.keyFilter || "";
    this.schema = s;
  }
  static forToken(e, t) {
    return new this(
      e.element,
      e.index,
      parseActionDescriptorString(e.content),
      t
    );
  }
  toString() {
    const e = this.keyFilter ? `.${this.keyFilter}` : "";
    const t = this.eventTargetName ? `@${this.eventTargetName}` : "";
    return `${this.eventName}${e}${t}->${this.identifier}#${this.methodName}`;
  }
  shouldIgnoreKeyboardEvent(e) {
    if (!this.keyFilter) return false;
    const t = this.keyFilter.split("+");
    if (this.keyFilterDissatisfied(e, t)) return true;
    const s = t.filter((e) => !r.includes(e))[0];
    if (!s) return false;
    hasProperty(this.keyMappings, s) ||
      error(`contains unknown key filter: ${this.keyFilter}`);
    return this.keyMappings[s].toLowerCase() !== e.key.toLowerCase();
  }
  shouldIgnoreMouseEvent(e) {
    if (!this.keyFilter) return false;
    const t = [this.keyFilter];
    return !!this.keyFilterDissatisfied(e, t);
  }
  get params() {
    const e = {};
    const t = new RegExp(`^data-${this.identifier}-(.+)-param$`, "i");
    for (const { name: r, value: s } of Array.from(this.element.attributes)) {
      const n = r.match(t);
      const i = n && n[1];
      i && (e[camelize(i)] = typecast(s));
    }
    return e;
  }
  get eventTargetName() {
    return stringifyEventTarget(this.eventTarget);
  }
  get keyMappings() {
    return this.schema.keyMappings;
  }
  keyFilterDissatisfied(e, t) {
    const [s, n, i, o] = r.map((e) => t.includes(e));
    return (
      e.metaKey !== s || e.ctrlKey !== n || e.altKey !== i || e.shiftKey !== o
    );
  }
}
const s = {
  a: () => "click",
  button: () => "click",
  form: () => "submit",
  details: () => "toggle",
  input: (e) => ("submit" == e.getAttribute("type") ? "click" : "input"),
  select: () => "change",
  textarea: () => "input",
};
function getDefaultEventNameForElement(e) {
  const t = e.tagName.toLowerCase();
  if (t in s) return s[t](e);
}
function error(e) {
  throw new Error(e);
}
function typecast(e) {
  try {
    return JSON.parse(e);
  } catch (t) {
    return e;
  }
}
class Binding {
  constructor(e, t) {
    this.context = e;
    this.action = t;
  }
  get index() {
    return this.action.index;
  }
  get eventTarget() {
    return this.action.eventTarget;
  }
  get eventOptions() {
    return this.action.eventOptions;
  }
  get identifier() {
    return this.context.identifier;
  }
  handleEvent(e) {
    const t = this.prepareActionEvent(e);
    this.willBeInvokedByEvent(e) &&
      this.applyEventModifiers(t) &&
      this.invokeWithEvent(t);
  }
  get eventName() {
    return this.action.eventName;
  }
  get method() {
    const e = this.controller[this.methodName];
    if ("function" == typeof e) return e;
    throw new Error(
      `Action "${this.action}" references undefined method "${this.methodName}"`
    );
  }
  applyEventModifiers(e) {
    const { element: t } = this.action;
    const { actionDescriptorFilters: r } = this.context.application;
    const { controller: s } = this.context;
    let n = true;
    for (const [i, o] of Object.entries(this.eventOptions))
      if (i in r) {
        const c = r[i];
        n = n && c({ name: i, value: o, event: e, element: t, controller: s });
      }
    return n;
  }
  prepareActionEvent(e) {
    return Object.assign(e, { params: this.action.params });
  }
  invokeWithEvent(e) {
    const { target: t, currentTarget: r } = e;
    try {
      this.method.call(this.controller, e);
      this.context.logDebugActivity(this.methodName, {
        event: e,
        target: t,
        currentTarget: r,
        action: this.methodName,
      });
    } catch (t) {
      const { identifier: r, controller: s, element: n, index: i } = this;
      const o = {
        identifier: r,
        controller: s,
        element: n,
        index: i,
        event: e,
      };
      this.context.handleError(t, `invoking action "${this.action}"`, o);
    }
  }
  willBeInvokedByEvent(e) {
    const t = e.target;
    return (
      !(
        e instanceof KeyboardEvent && this.action.shouldIgnoreKeyboardEvent(e)
      ) &&
      !(e instanceof MouseEvent && this.action.shouldIgnoreMouseEvent(e)) &&
      (this.element === t ||
        (t instanceof Element && this.element.contains(t)
          ? this.scope.containsElement(t)
          : this.scope.containsElement(this.action.element)))
    );
  }
  get controller() {
    return this.context.controller;
  }
  get methodName() {
    return this.action.methodName;
  }
  get element() {
    return this.scope.element;
  }
  get scope() {
    return this.context.scope;
  }
}
class ElementObserver {
  constructor(e, t) {
    this.mutationObserverInit = {
      attributes: true,
      childList: true,
      subtree: true,
    };
    this.element = e;
    this.started = false;
    this.delegate = t;
    this.elements = new Set();
    this.mutationObserver = new MutationObserver((e) =>
      this.processMutations(e)
    );
  }
  start() {
    if (!this.started) {
      this.started = true;
      this.mutationObserver.observe(this.element, this.mutationObserverInit);
      this.refresh();
    }
  }
  pause(e) {
    if (this.started) {
      this.mutationObserver.disconnect();
      this.started = false;
    }
    e();
    if (!this.started) {
      this.mutationObserver.observe(this.element, this.mutationObserverInit);
      this.started = true;
    }
  }
  stop() {
    if (this.started) {
      this.mutationObserver.takeRecords();
      this.mutationObserver.disconnect();
      this.started = false;
    }
  }
  refresh() {
    if (this.started) {
      const e = new Set(this.matchElementsInTree());
      for (const t of Array.from(this.elements))
        e.has(t) || this.removeElement(t);
      for (const t of Array.from(e)) this.addElement(t);
    }
  }
  processMutations(e) {
    if (this.started) for (const t of e) this.processMutation(t);
  }
  processMutation(e) {
    if ("attributes" == e.type)
      this.processAttributeChange(e.target, e.attributeName);
    else if ("childList" == e.type) {
      this.processRemovedNodes(e.removedNodes);
      this.processAddedNodes(e.addedNodes);
    }
  }
  processAttributeChange(e, t) {
    this.elements.has(e)
      ? this.delegate.elementAttributeChanged && this.matchElement(e)
        ? this.delegate.elementAttributeChanged(e, t)
        : this.removeElement(e)
      : this.matchElement(e) && this.addElement(e);
  }
  processRemovedNodes(e) {
    for (const t of Array.from(e)) {
      const e = this.elementFromNode(t);
      e && this.processTree(e, this.removeElement);
    }
  }
  processAddedNodes(e) {
    for (const t of Array.from(e)) {
      const e = this.elementFromNode(t);
      e && this.elementIsActive(e) && this.processTree(e, this.addElement);
    }
  }
  matchElement(e) {
    return this.delegate.matchElement(e);
  }
  matchElementsInTree(e = this.element) {
    return this.delegate.matchElementsInTree(e);
  }
  processTree(e, t) {
    for (const r of this.matchElementsInTree(e)) t.call(this, r);
  }
  elementFromNode(e) {
    if (e.nodeType == Node.ELEMENT_NODE) return e;
  }
  elementIsActive(e) {
    return (
      e.isConnected == this.element.isConnected && this.element.contains(e)
    );
  }
  addElement(e) {
    if (!this.elements.has(e) && this.elementIsActive(e)) {
      this.elements.add(e);
      this.delegate.elementMatched && this.delegate.elementMatched(e);
    }
  }
  removeElement(e) {
    if (this.elements.has(e)) {
      this.elements.delete(e);
      this.delegate.elementUnmatched && this.delegate.elementUnmatched(e);
    }
  }
}
class AttributeObserver {
  constructor(e, t, r) {
    this.attributeName = t;
    this.delegate = r;
    this.elementObserver = new ElementObserver(e, this);
  }
  get element() {
    return this.elementObserver.element;
  }
  get selector() {
    return `[${this.attributeName}]`;
  }
  start() {
    this.elementObserver.start();
  }
  pause(e) {
    this.elementObserver.pause(e);
  }
  stop() {
    this.elementObserver.stop();
  }
  refresh() {
    this.elementObserver.refresh();
  }
  get started() {
    return this.elementObserver.started;
  }
  matchElement(e) {
    return e.hasAttribute(this.attributeName);
  }
  matchElementsInTree(e) {
    const t = this.matchElement(e) ? [e] : [];
    const r = Array.from(e.querySelectorAll(this.selector));
    return t.concat(r);
  }
  elementMatched(e) {
    this.delegate.elementMatchedAttribute &&
      this.delegate.elementMatchedAttribute(e, this.attributeName);
  }
  elementUnmatched(e) {
    this.delegate.elementUnmatchedAttribute &&
      this.delegate.elementUnmatchedAttribute(e, this.attributeName);
  }
  elementAttributeChanged(e, t) {
    this.delegate.elementAttributeValueChanged &&
      this.attributeName == t &&
      this.delegate.elementAttributeValueChanged(e, t);
  }
}
function add(e, t, r) {
  fetch(e, t).add(r);
}
function del(e, t, r) {
  fetch(e, t).delete(r);
  prune(e, t);
}
function fetch(e, t) {
  let r = e.get(t);
  if (!r) {
    r = new Set();
    e.set(t, r);
  }
  return r;
}
function prune(e, t) {
  const r = e.get(t);
  null != r && 0 == r.size && e.delete(t);
}
class Multimap {
  constructor() {
    this.valuesByKey = new Map();
  }
  get keys() {
    return Array.from(this.valuesByKey.keys());
  }
  get values() {
    const e = Array.from(this.valuesByKey.values());
    return e.reduce((e, t) => e.concat(Array.from(t)), []);
  }
  get size() {
    const e = Array.from(this.valuesByKey.values());
    return e.reduce((e, t) => e + t.size, 0);
  }
  add(e, t) {
    add(this.valuesByKey, e, t);
  }
  delete(e, t) {
    del(this.valuesByKey, e, t);
  }
  has(e, t) {
    const r = this.valuesByKey.get(e);
    return null != r && r.has(t);
  }
  hasKey(e) {
    return this.valuesByKey.has(e);
  }
  hasValue(e) {
    const t = Array.from(this.valuesByKey.values());
    return t.some((t) => t.has(e));
  }
  getValuesForKey(e) {
    const t = this.valuesByKey.get(e);
    return t ? Array.from(t) : [];
  }
  getKeysForValue(e) {
    return Array.from(this.valuesByKey)
      .filter(([t, r]) => r.has(e))
      .map(([e, t]) => e);
  }
}
class IndexedMultimap extends Multimap {
  constructor() {
    super();
    this.keysByValue = new Map();
  }
  get values() {
    return Array.from(this.keysByValue.keys());
  }
  add(e, t) {
    super.add(e, t);
    add(this.keysByValue, t, e);
  }
  delete(e, t) {
    super.delete(e, t);
    del(this.keysByValue, t, e);
  }
  hasValue(e) {
    return this.keysByValue.has(e);
  }
  getKeysForValue(e) {
    const t = this.keysByValue.get(e);
    return t ? Array.from(t) : [];
  }
}
class SelectorObserver {
  constructor(e, t, r, s) {
    this._selector = t;
    this.details = s;
    this.elementObserver = new ElementObserver(e, this);
    this.delegate = r;
    this.matchesByElement = new Multimap();
  }
  get started() {
    return this.elementObserver.started;
  }
  get selector() {
    return this._selector;
  }
  set selector(e) {
    this._selector = e;
    this.refresh();
  }
  start() {
    this.elementObserver.start();
  }
  pause(e) {
    this.elementObserver.pause(e);
  }
  stop() {
    this.elementObserver.stop();
  }
  refresh() {
    this.elementObserver.refresh();
  }
  get element() {
    return this.elementObserver.element;
  }
  matchElement(e) {
    const { selector: t } = this;
    if (t) {
      const r = e.matches(t);
      return this.delegate.selectorMatchElement
        ? r && this.delegate.selectorMatchElement(e, this.details)
        : r;
    }
    return false;
  }
  matchElementsInTree(e) {
    const { selector: t } = this;
    if (t) {
      const r = this.matchElement(e) ? [e] : [];
      const s = Array.from(e.querySelectorAll(t)).filter((e) =>
        this.matchElement(e)
      );
      return r.concat(s);
    }
    return [];
  }
  elementMatched(e) {
    const { selector: t } = this;
    t && this.selectorMatched(e, t);
  }
  elementUnmatched(e) {
    const t = this.matchesByElement.getKeysForValue(e);
    for (const r of t) this.selectorUnmatched(e, r);
  }
  elementAttributeChanged(e, t) {
    const { selector: r } = this;
    if (r) {
      const t = this.matchElement(e);
      const s = this.matchesByElement.has(r, e);
      t && !s
        ? this.selectorMatched(e, r)
        : !t && s && this.selectorUnmatched(e, r);
    }
  }
  selectorMatched(e, t) {
    this.delegate.selectorMatched(e, t, this.details);
    this.matchesByElement.add(t, e);
  }
  selectorUnmatched(e, t) {
    this.delegate.selectorUnmatched(e, t, this.details);
    this.matchesByElement.delete(t, e);
  }
}
class StringMapObserver {
  constructor(e, t) {
    this.element = e;
    this.delegate = t;
    this.started = false;
    this.stringMap = new Map();
    this.mutationObserver = new MutationObserver((e) =>
      this.processMutations(e)
    );
  }
  start() {
    if (!this.started) {
      this.started = true;
      this.mutationObserver.observe(this.element, {
        attributes: true,
        attributeOldValue: true,
      });
      this.refresh();
    }
  }
  stop() {
    if (this.started) {
      this.mutationObserver.takeRecords();
      this.mutationObserver.disconnect();
      this.started = false;
    }
  }
  refresh() {
    if (this.started)
      for (const e of this.knownAttributeNames) this.refreshAttribute(e, null);
  }
  processMutations(e) {
    if (this.started) for (const t of e) this.processMutation(t);
  }
  processMutation(e) {
    const t = e.attributeName;
    t && this.refreshAttribute(t, e.oldValue);
  }
  refreshAttribute(e, t) {
    const r = this.delegate.getStringMapKeyForAttribute(e);
    if (null != r) {
      this.stringMap.has(e) || this.stringMapKeyAdded(r, e);
      const s = this.element.getAttribute(e);
      this.stringMap.get(e) != s && this.stringMapValueChanged(s, r, t);
      if (null == s) {
        const t = this.stringMap.get(e);
        this.stringMap.delete(e);
        t && this.stringMapKeyRemoved(r, e, t);
      } else this.stringMap.set(e, s);
    }
  }
  stringMapKeyAdded(e, t) {
    this.delegate.stringMapKeyAdded && this.delegate.stringMapKeyAdded(e, t);
  }
  stringMapValueChanged(e, t, r) {
    this.delegate.stringMapValueChanged &&
      this.delegate.stringMapValueChanged(e, t, r);
  }
  stringMapKeyRemoved(e, t, r) {
    this.delegate.stringMapKeyRemoved &&
      this.delegate.stringMapKeyRemoved(e, t, r);
  }
  get knownAttributeNames() {
    return Array.from(
      new Set(this.currentAttributeNames.concat(this.recordedAttributeNames))
    );
  }
  get currentAttributeNames() {
    return Array.from(this.element.attributes).map((e) => e.name);
  }
  get recordedAttributeNames() {
    return Array.from(this.stringMap.keys());
  }
}
class TokenListObserver {
  constructor(e, t, r) {
    this.attributeObserver = new AttributeObserver(e, t, this);
    this.delegate = r;
    this.tokensByElement = new Multimap();
  }
  get started() {
    return this.attributeObserver.started;
  }
  start() {
    this.attributeObserver.start();
  }
  pause(e) {
    this.attributeObserver.pause(e);
  }
  stop() {
    this.attributeObserver.stop();
  }
  refresh() {
    this.attributeObserver.refresh();
  }
  get element() {
    return this.attributeObserver.element;
  }
  get attributeName() {
    return this.attributeObserver.attributeName;
  }
  elementMatchedAttribute(e) {
    this.tokensMatched(this.readTokensForElement(e));
  }
  elementAttributeValueChanged(e) {
    const [t, r] = this.refreshTokensForElement(e);
    this.tokensUnmatched(t);
    this.tokensMatched(r);
  }
  elementUnmatchedAttribute(e) {
    this.tokensUnmatched(this.tokensByElement.getValuesForKey(e));
  }
  tokensMatched(e) {
    e.forEach((e) => this.tokenMatched(e));
  }
  tokensUnmatched(e) {
    e.forEach((e) => this.tokenUnmatched(e));
  }
  tokenMatched(e) {
    this.delegate.tokenMatched(e);
    this.tokensByElement.add(e.element, e);
  }
  tokenUnmatched(e) {
    this.delegate.tokenUnmatched(e);
    this.tokensByElement.delete(e.element, e);
  }
  refreshTokensForElement(e) {
    const t = this.tokensByElement.getValuesForKey(e);
    const r = this.readTokensForElement(e);
    const s = zip(t, r).findIndex(([e, t]) => !tokensAreEqual(e, t));
    return -1 == s ? [[], []] : [t.slice(s), r.slice(s)];
  }
  readTokensForElement(e) {
    const t = this.attributeName;
    const r = e.getAttribute(t) || "";
    return parseTokenString(r, e, t);
  }
}
function parseTokenString(e, t, r) {
  return e
    .trim()
    .split(/\s+/)
    .filter((e) => e.length)
    .map((e, s) => ({ element: t, attributeName: r, content: e, index: s }));
}
function zip(e, t) {
  const r = Math.max(e.length, t.length);
  return Array.from({ length: r }, (r, s) => [e[s], t[s]]);
}
function tokensAreEqual(e, t) {
  return e && t && e.index == t.index && e.content == t.content;
}
class ValueListObserver {
  constructor(e, t, r) {
    this.tokenListObserver = new TokenListObserver(e, t, this);
    this.delegate = r;
    this.parseResultsByToken = new WeakMap();
    this.valuesByTokenByElement = new WeakMap();
  }
  get started() {
    return this.tokenListObserver.started;
  }
  start() {
    this.tokenListObserver.start();
  }
  stop() {
    this.tokenListObserver.stop();
  }
  refresh() {
    this.tokenListObserver.refresh();
  }
  get element() {
    return this.tokenListObserver.element;
  }
  get attributeName() {
    return this.tokenListObserver.attributeName;
  }
  tokenMatched(e) {
    const { element: t } = e;
    const { value: r } = this.fetchParseResultForToken(e);
    if (r) {
      this.fetchValuesByTokenForElement(t).set(e, r);
      this.delegate.elementMatchedValue(t, r);
    }
  }
  tokenUnmatched(e) {
    const { element: t } = e;
    const { value: r } = this.fetchParseResultForToken(e);
    if (r) {
      this.fetchValuesByTokenForElement(t).delete(e);
      this.delegate.elementUnmatchedValue(t, r);
    }
  }
  fetchParseResultForToken(e) {
    let t = this.parseResultsByToken.get(e);
    if (!t) {
      t = this.parseToken(e);
      this.parseResultsByToken.set(e, t);
    }
    return t;
  }
  fetchValuesByTokenForElement(e) {
    let t = this.valuesByTokenByElement.get(e);
    if (!t) {
      t = new Map();
      this.valuesByTokenByElement.set(e, t);
    }
    return t;
  }
  parseToken(e) {
    try {
      const t = this.delegate.parseValueForToken(e);
      return { value: t };
    } catch (e) {
      return { error: e };
    }
  }
}
class BindingObserver {
  constructor(e, t) {
    this.context = e;
    this.delegate = t;
    this.bindingsByAction = new Map();
  }
  start() {
    if (!this.valueListObserver) {
      this.valueListObserver = new ValueListObserver(
        this.element,
        this.actionAttribute,
        this
      );
      this.valueListObserver.start();
    }
  }
  stop() {
    if (this.valueListObserver) {
      this.valueListObserver.stop();
      delete this.valueListObserver;
      this.disconnectAllActions();
    }
  }
  get element() {
    return this.context.element;
  }
  get identifier() {
    return this.context.identifier;
  }
  get actionAttribute() {
    return this.schema.actionAttribute;
  }
  get schema() {
    return this.context.schema;
  }
  get bindings() {
    return Array.from(this.bindingsByAction.values());
  }
  connectAction(e) {
    const t = new Binding(this.context, e);
    this.bindingsByAction.set(e, t);
    this.delegate.bindingConnected(t);
  }
  disconnectAction(e) {
    const t = this.bindingsByAction.get(e);
    if (t) {
      this.bindingsByAction.delete(e);
      this.delegate.bindingDisconnected(t);
    }
  }
  disconnectAllActions() {
    this.bindings.forEach((e) => this.delegate.bindingDisconnected(e, true));
    this.bindingsByAction.clear();
  }
  parseValueForToken(e) {
    const t = Action.forToken(e, this.schema);
    if (t.identifier == this.identifier) return t;
  }
  elementMatchedValue(e, t) {
    this.connectAction(t);
  }
  elementUnmatchedValue(e, t) {
    this.disconnectAction(t);
  }
}
class ValueObserver {
  constructor(e, t) {
    this.context = e;
    this.receiver = t;
    this.stringMapObserver = new StringMapObserver(this.element, this);
    this.valueDescriptorMap = this.controller.valueDescriptorMap;
  }
  start() {
    this.stringMapObserver.start();
    this.invokeChangedCallbacksForDefaultValues();
  }
  stop() {
    this.stringMapObserver.stop();
  }
  get element() {
    return this.context.element;
  }
  get controller() {
    return this.context.controller;
  }
  getStringMapKeyForAttribute(e) {
    if (e in this.valueDescriptorMap) return this.valueDescriptorMap[e].name;
  }
  stringMapKeyAdded(e, t) {
    const r = this.valueDescriptorMap[t];
    this.hasValue(e) ||
      this.invokeChangedCallback(
        e,
        r.writer(this.receiver[e]),
        r.writer(r.defaultValue)
      );
  }
  stringMapValueChanged(e, t, r) {
    const s = this.valueDescriptorNameMap[t];
    if (null !== e) {
      null === r && (r = s.writer(s.defaultValue));
      this.invokeChangedCallback(t, e, r);
    }
  }
  stringMapKeyRemoved(e, t, r) {
    const s = this.valueDescriptorNameMap[e];
    this.hasValue(e)
      ? this.invokeChangedCallback(e, s.writer(this.receiver[e]), r)
      : this.invokeChangedCallback(e, s.writer(s.defaultValue), r);
  }
  invokeChangedCallbacksForDefaultValues() {
    for (const { key: e, name: t, defaultValue: r, writer: s } of this
      .valueDescriptors)
      void 0 == r ||
        this.controller.data.has(e) ||
        this.invokeChangedCallback(t, s(r), void 0);
  }
  invokeChangedCallback(e, t, r) {
    const s = `${e}Changed`;
    const n = this.receiver[s];
    if ("function" == typeof n) {
      const s = this.valueDescriptorNameMap[e];
      try {
        const e = s.reader(t);
        let i = r;
        r && (i = s.reader(r));
        n.call(this.receiver, e, i);
      } catch (e) {
        e instanceof TypeError &&
          (e.message = `Stimulus Value "${this.context.identifier}.${s.name}" - ${e.message}`);
        throw e;
      }
    }
  }
  get valueDescriptors() {
    const { valueDescriptorMap: e } = this;
    return Object.keys(e).map((t) => e[t]);
  }
  get valueDescriptorNameMap() {
    const e = {};
    Object.keys(this.valueDescriptorMap).forEach((t) => {
      const r = this.valueDescriptorMap[t];
      e[r.name] = r;
    });
    return e;
  }
  hasValue(e) {
    const t = this.valueDescriptorNameMap[e];
    const r = `has${capitalize(t.name)}`;
    return this.receiver[r];
  }
}
class TargetObserver {
  constructor(e, t) {
    this.context = e;
    this.delegate = t;
    this.targetsByName = new Multimap();
  }
  start() {
    if (!this.tokenListObserver) {
      this.tokenListObserver = new TokenListObserver(
        this.element,
        this.attributeName,
        this
      );
      this.tokenListObserver.start();
    }
  }
  stop() {
    if (this.tokenListObserver) {
      this.disconnectAllTargets();
      this.tokenListObserver.stop();
      delete this.tokenListObserver;
    }
  }
  tokenMatched({ element: e, content: t }) {
    this.scope.containsElement(e) && this.connectTarget(e, t);
  }
  tokenUnmatched({ element: e, content: t }) {
    this.disconnectTarget(e, t);
  }
  connectTarget(e, t) {
    var r;
    if (!this.targetsByName.has(t, e)) {
      this.targetsByName.add(t, e);
      null === (r = this.tokenListObserver) || void 0 === r
        ? void 0
        : r.pause(() => this.delegate.targetConnected(e, t));
    }
  }
  disconnectTarget(e, t) {
    var r;
    if (this.targetsByName.has(t, e)) {
      this.targetsByName.delete(t, e);
      null === (r = this.tokenListObserver) || void 0 === r
        ? void 0
        : r.pause(() => this.delegate.targetDisconnected(e, t));
    }
  }
  disconnectAllTargets() {
    for (const e of this.targetsByName.keys)
      for (const t of this.targetsByName.getValuesForKey(e))
        this.disconnectTarget(t, e);
  }
  get attributeName() {
    return `data-${this.context.identifier}-target`;
  }
  get element() {
    return this.context.element;
  }
  get scope() {
    return this.context.scope;
  }
}
function readInheritableStaticArrayValues(e, t) {
  const r = getAncestorsForConstructor(e);
  return Array.from(
    r.reduce((e, r) => {
      getOwnStaticArrayValues(r, t).forEach((t) => e.add(t));
      return e;
    }, new Set())
  );
}
function readInheritableStaticObjectPairs(e, t) {
  const r = getAncestorsForConstructor(e);
  return r.reduce((e, r) => {
    e.push(...getOwnStaticObjectPairs(r, t));
    return e;
  }, []);
}
function getAncestorsForConstructor(e) {
  const t = [];
  while (e) {
    t.push(e);
    e = Object.getPrototypeOf(e);
  }
  return t.reverse();
}
function getOwnStaticArrayValues(e, t) {
  const r = e[t];
  return Array.isArray(r) ? r : [];
}
function getOwnStaticObjectPairs(e, t) {
  const r = e[t];
  return r ? Object.keys(r).map((e) => [e, r[e]]) : [];
}
class OutletObserver {
  constructor(e, t) {
    this.started = false;
    this.context = e;
    this.delegate = t;
    this.outletsByName = new Multimap();
    this.outletElementsByName = new Multimap();
    this.selectorObserverMap = new Map();
    this.attributeObserverMap = new Map();
  }
  start() {
    if (!this.started) {
      this.outletDefinitions.forEach((e) => {
        this.setupSelectorObserverForOutlet(e);
        this.setupAttributeObserverForOutlet(e);
      });
      this.started = true;
      this.dependentContexts.forEach((e) => e.refresh());
    }
  }
  refresh() {
    this.selectorObserverMap.forEach((e) => e.refresh());
    this.attributeObserverMap.forEach((e) => e.refresh());
  }
  stop() {
    if (this.started) {
      this.started = false;
      this.disconnectAllOutlets();
      this.stopSelectorObservers();
      this.stopAttributeObservers();
    }
  }
  stopSelectorObservers() {
    if (this.selectorObserverMap.size > 0) {
      this.selectorObserverMap.forEach((e) => e.stop());
      this.selectorObserverMap.clear();
    }
  }
  stopAttributeObservers() {
    if (this.attributeObserverMap.size > 0) {
      this.attributeObserverMap.forEach((e) => e.stop());
      this.attributeObserverMap.clear();
    }
  }
  selectorMatched(e, t, { outletName: r }) {
    const s = this.getOutlet(e, r);
    s && this.connectOutlet(s, e, r);
  }
  selectorUnmatched(e, t, { outletName: r }) {
    const s = this.getOutletFromMap(e, r);
    s && this.disconnectOutlet(s, e, r);
  }
  selectorMatchElement(e, { outletName: t }) {
    const r = this.selector(t);
    const s = this.hasOutlet(e, t);
    const n = e.matches(`[${this.schema.controllerAttribute}~=${t}]`);
    return !!r && s && n && e.matches(r);
  }
  elementMatchedAttribute(e, t) {
    const r = this.getOutletNameFromOutletAttributeName(t);
    r && this.updateSelectorObserverForOutlet(r);
  }
  elementAttributeValueChanged(e, t) {
    const r = this.getOutletNameFromOutletAttributeName(t);
    r && this.updateSelectorObserverForOutlet(r);
  }
  elementUnmatchedAttribute(e, t) {
    const r = this.getOutletNameFromOutletAttributeName(t);
    r && this.updateSelectorObserverForOutlet(r);
  }
  connectOutlet(e, t, r) {
    var s;
    if (!this.outletElementsByName.has(r, t)) {
      this.outletsByName.add(r, e);
      this.outletElementsByName.add(r, t);
      null === (s = this.selectorObserverMap.get(r)) || void 0 === s
        ? void 0
        : s.pause(() => this.delegate.outletConnected(e, t, r));
    }
  }
  disconnectOutlet(e, t, r) {
    var s;
    if (this.outletElementsByName.has(r, t)) {
      this.outletsByName.delete(r, e);
      this.outletElementsByName.delete(r, t);
      null === (s = this.selectorObserverMap.get(r)) || void 0 === s
        ? void 0
        : s.pause(() => this.delegate.outletDisconnected(e, t, r));
    }
  }
  disconnectAllOutlets() {
    for (const e of this.outletElementsByName.keys)
      for (const t of this.outletElementsByName.getValuesForKey(e))
        for (const r of this.outletsByName.getValuesForKey(e))
          this.disconnectOutlet(r, t, e);
  }
  updateSelectorObserverForOutlet(e) {
    const t = this.selectorObserverMap.get(e);
    t && (t.selector = this.selector(e));
  }
  setupSelectorObserverForOutlet(e) {
    const t = this.selector(e);
    const r = new SelectorObserver(document.body, t, this, { outletName: e });
    this.selectorObserverMap.set(e, r);
    r.start();
  }
  setupAttributeObserverForOutlet(e) {
    const t = this.attributeNameForOutletName(e);
    const r = new AttributeObserver(this.scope.element, t, this);
    this.attributeObserverMap.set(e, r);
    r.start();
  }
  selector(e) {
    return this.scope.outlets.getSelectorForOutletName(e);
  }
  attributeNameForOutletName(e) {
    return this.scope.schema.outletAttributeForScope(this.identifier, e);
  }
  getOutletNameFromOutletAttributeName(e) {
    return this.outletDefinitions.find(
      (t) => this.attributeNameForOutletName(t) === e
    );
  }
  get outletDependencies() {
    const e = new Multimap();
    this.router.modules.forEach((t) => {
      const r = t.definition.controllerConstructor;
      const s = readInheritableStaticArrayValues(r, "outlets");
      s.forEach((r) => e.add(r, t.identifier));
    });
    return e;
  }
  get outletDefinitions() {
    return this.outletDependencies.getKeysForValue(this.identifier);
  }
  get dependentControllerIdentifiers() {
    return this.outletDependencies.getValuesForKey(this.identifier);
  }
  get dependentContexts() {
    const e = this.dependentControllerIdentifiers;
    return this.router.contexts.filter((t) => e.includes(t.identifier));
  }
  hasOutlet(e, t) {
    return !!this.getOutlet(e, t) || !!this.getOutletFromMap(e, t);
  }
  getOutlet(e, t) {
    return this.application.getControllerForElementAndIdentifier(e, t);
  }
  getOutletFromMap(e, t) {
    return this.outletsByName.getValuesForKey(t).find((t) => t.element === e);
  }
  get scope() {
    return this.context.scope;
  }
  get schema() {
    return this.context.schema;
  }
  get identifier() {
    return this.context.identifier;
  }
  get application() {
    return this.context.application;
  }
  get router() {
    return this.application.router;
  }
}
class Context {
  constructor(e, t) {
    this.logDebugActivity = (e, t = {}) => {
      const { identifier: r, controller: s, element: n } = this;
      t = Object.assign({ identifier: r, controller: s, element: n }, t);
      this.application.logDebugActivity(this.identifier, e, t);
    };
    this.module = e;
    this.scope = t;
    this.controller = new e.controllerConstructor(this);
    this.bindingObserver = new BindingObserver(this, this.dispatcher);
    this.valueObserver = new ValueObserver(this, this.controller);
    this.targetObserver = new TargetObserver(this, this);
    this.outletObserver = new OutletObserver(this, this);
    try {
      this.controller.initialize();
      this.logDebugActivity("initialize");
    } catch (e) {
      this.handleError(e, "initializing controller");
    }
  }
  connect() {
    this.bindingObserver.start();
    this.valueObserver.start();
    this.targetObserver.start();
    this.outletObserver.start();
    try {
      this.controller.connect();
      this.logDebugActivity("connect");
    } catch (e) {
      this.handleError(e, "connecting controller");
    }
  }
  refresh() {
    this.outletObserver.refresh();
  }
  disconnect() {
    try {
      this.controller.disconnect();
      this.logDebugActivity("disconnect");
    } catch (e) {
      this.handleError(e, "disconnecting controller");
    }
    this.outletObserver.stop();
    this.targetObserver.stop();
    this.valueObserver.stop();
    this.bindingObserver.stop();
  }
  get application() {
    return this.module.application;
  }
  get identifier() {
    return this.module.identifier;
  }
  get schema() {
    return this.application.schema;
  }
  get dispatcher() {
    return this.application.dispatcher;
  }
  get element() {
    return this.scope.element;
  }
  get parentElement() {
    return this.element.parentElement;
  }
  handleError(e, t, r = {}) {
    const { identifier: s, controller: n, element: i } = this;
    r = Object.assign({ identifier: s, controller: n, element: i }, r);
    this.application.handleError(e, `Error ${t}`, r);
  }
  targetConnected(e, t) {
    this.invokeControllerMethod(`${t}TargetConnected`, e);
  }
  targetDisconnected(e, t) {
    this.invokeControllerMethod(`${t}TargetDisconnected`, e);
  }
  outletConnected(e, t, r) {
    this.invokeControllerMethod(`${namespaceCamelize(r)}OutletConnected`, e, t);
  }
  outletDisconnected(e, t, r) {
    this.invokeControllerMethod(
      `${namespaceCamelize(r)}OutletDisconnected`,
      e,
      t
    );
  }
  invokeControllerMethod(e, ...t) {
    const r = this.controller;
    "function" == typeof r[e] && r[e](...t);
  }
}
function bless(e) {
  return shadow(e, getBlessedProperties(e));
}
function shadow(e, t) {
  const r = i(e);
  const s = getShadowProperties(e.prototype, t);
  Object.defineProperties(r.prototype, s);
  return r;
}
function getBlessedProperties(e) {
  const t = readInheritableStaticArrayValues(e, "blessings");
  return t.reduce((t, r) => {
    const s = r(e);
    for (const e in s) {
      const r = t[e] || {};
      t[e] = Object.assign(r, s[e]);
    }
    return t;
  }, {});
}
function getShadowProperties(e, t) {
  return n(t).reduce((r, s) => {
    const n = getShadowedDescriptor(e, t, s);
    n && Object.assign(r, { [s]: n });
    return r;
  }, {});
}
function getShadowedDescriptor(e, t, r) {
  const s = Object.getOwnPropertyDescriptor(e, r);
  const n = s && "value" in s;
  if (!n) {
    const e = Object.getOwnPropertyDescriptor(t, r).value;
    if (s) {
      e.get = s.get || e.get;
      e.set = s.set || e.set;
    }
    return e;
  }
}
const n = (() =>
  "function" == typeof Object.getOwnPropertySymbols
    ? (e) => [
        ...Object.getOwnPropertyNames(e),
        ...Object.getOwnPropertySymbols(e),
      ]
    : Object.getOwnPropertyNames)();
const i = (() => {
  function extendWithReflect(e) {
    function extended() {
      return Reflect.construct(e, arguments, new.target);
    }
    extended.prototype = Object.create(e.prototype, {
      constructor: { value: extended },
    });
    Reflect.setPrototypeOf(extended, e);
    return extended;
  }
  function testReflectExtension() {
    const a = function () {
      this.a.call(this);
    };
    const e = extendWithReflect(a);
    e.prototype.a = function () {};
    return new e();
  }
  try {
    testReflectExtension();
    return extendWithReflect;
  } catch (e) {
    return (e) => class extended extends e {};
  }
})();
function blessDefinition(e) {
  return {
    identifier: e.identifier,
    controllerConstructor: bless(e.controllerConstructor),
  };
}
class Module {
  constructor(e, t) {
    this.application = e;
    this.definition = blessDefinition(t);
    this.contextsByScope = new WeakMap();
    this.connectedContexts = new Set();
  }
  get identifier() {
    return this.definition.identifier;
  }
  get controllerConstructor() {
    return this.definition.controllerConstructor;
  }
  get contexts() {
    return Array.from(this.connectedContexts);
  }
  connectContextForScope(e) {
    const t = this.fetchContextForScope(e);
    this.connectedContexts.add(t);
    t.connect();
  }
  disconnectContextForScope(e) {
    const t = this.contextsByScope.get(e);
    if (t) {
      this.connectedContexts.delete(t);
      t.disconnect();
    }
  }
  fetchContextForScope(e) {
    let t = this.contextsByScope.get(e);
    if (!t) {
      t = new Context(this, e);
      this.contextsByScope.set(e, t);
    }
    return t;
  }
}
class ClassMap {
  constructor(e) {
    this.scope = e;
  }
  has(e) {
    return this.data.has(this.getDataKey(e));
  }
  get(e) {
    return this.getAll(e)[0];
  }
  getAll(e) {
    const t = this.data.get(this.getDataKey(e)) || "";
    return tokenize(t);
  }
  getAttributeName(e) {
    return this.data.getAttributeNameForKey(this.getDataKey(e));
  }
  getDataKey(e) {
    return `${e}-class`;
  }
  get data() {
    return this.scope.data;
  }
}
class DataMap {
  constructor(e) {
    this.scope = e;
  }
  get element() {
    return this.scope.element;
  }
  get identifier() {
    return this.scope.identifier;
  }
  get(e) {
    const t = this.getAttributeNameForKey(e);
    return this.element.getAttribute(t);
  }
  set(e, t) {
    const r = this.getAttributeNameForKey(e);
    this.element.setAttribute(r, t);
    return this.get(e);
  }
  has(e) {
    const t = this.getAttributeNameForKey(e);
    return this.element.hasAttribute(t);
  }
  delete(e) {
    if (this.has(e)) {
      const t = this.getAttributeNameForKey(e);
      this.element.removeAttribute(t);
      return true;
    }
    return false;
  }
  getAttributeNameForKey(e) {
    return `data-${this.identifier}-${dasherize(e)}`;
  }
}
class Guide {
  constructor(e) {
    this.warnedKeysByObject = new WeakMap();
    this.logger = e;
  }
  warn(e, t, r) {
    let s = this.warnedKeysByObject.get(e);
    if (!s) {
      s = new Set();
      this.warnedKeysByObject.set(e, s);
    }
    if (!s.has(t)) {
      s.add(t);
      this.logger.warn(r, e);
    }
  }
}
function attributeValueContainsToken(e, t) {
  return `[${e}~="${t}"]`;
}
class TargetSet {
  constructor(e) {
    this.scope = e;
  }
  get element() {
    return this.scope.element;
  }
  get identifier() {
    return this.scope.identifier;
  }
  get schema() {
    return this.scope.schema;
  }
  has(e) {
    return null != this.find(e);
  }
  find(...e) {
    return e.reduce(
      (e, t) => e || this.findTarget(t) || this.findLegacyTarget(t),
      void 0
    );
  }
  findAll(...e) {
    return e.reduce(
      (e, t) => [
        ...e,
        ...this.findAllTargets(t),
        ...this.findAllLegacyTargets(t),
      ],
      []
    );
  }
  findTarget(e) {
    const t = this.getSelectorForTargetName(e);
    return this.scope.findElement(t);
  }
  findAllTargets(e) {
    const t = this.getSelectorForTargetName(e);
    return this.scope.findAllElements(t);
  }
  getSelectorForTargetName(e) {
    const t = this.schema.targetAttributeForScope(this.identifier);
    return attributeValueContainsToken(t, e);
  }
  findLegacyTarget(e) {
    const t = this.getLegacySelectorForTargetName(e);
    return this.deprecate(this.scope.findElement(t), e);
  }
  findAllLegacyTargets(e) {
    const t = this.getLegacySelectorForTargetName(e);
    return this.scope.findAllElements(t).map((t) => this.deprecate(t, e));
  }
  getLegacySelectorForTargetName(e) {
    const t = `${this.identifier}.${e}`;
    return attributeValueContainsToken(this.schema.targetAttribute, t);
  }
  deprecate(e, t) {
    if (e) {
      const { identifier: r } = this;
      const s = this.schema.targetAttribute;
      const n = this.schema.targetAttributeForScope(r);
      this.guide.warn(
        e,
        `target:${t}`,
        `Please replace ${s}="${r}.${t}" with ${n}="${t}". The ${s} attribute is deprecated and will be removed in a future version of Stimulus.`
      );
    }
    return e;
  }
  get guide() {
    return this.scope.guide;
  }
}
class OutletSet {
  constructor(e, t) {
    this.scope = e;
    this.controllerElement = t;
  }
  get element() {
    return this.scope.element;
  }
  get identifier() {
    return this.scope.identifier;
  }
  get schema() {
    return this.scope.schema;
  }
  has(e) {
    return null != this.find(e);
  }
  find(...e) {
    return e.reduce((e, t) => e || this.findOutlet(t), void 0);
  }
  findAll(...e) {
    return e.reduce((e, t) => [...e, ...this.findAllOutlets(t)], []);
  }
  getSelectorForOutletName(e) {
    const t = this.schema.outletAttributeForScope(this.identifier, e);
    return this.controllerElement.getAttribute(t);
  }
  findOutlet(e) {
    const t = this.getSelectorForOutletName(e);
    if (t) return this.findElement(t, e);
  }
  findAllOutlets(e) {
    const t = this.getSelectorForOutletName(e);
    return t ? this.findAllElements(t, e) : [];
  }
  findElement(e, t) {
    const r = this.scope.queryElements(e);
    return r.filter((r) => this.matchesElement(r, e, t))[0];
  }
  findAllElements(e, t) {
    const r = this.scope.queryElements(e);
    return r.filter((r) => this.matchesElement(r, e, t));
  }
  matchesElement(e, t, r) {
    const s = e.getAttribute(this.scope.schema.controllerAttribute) || "";
    return e.matches(t) && s.split(" ").includes(r);
  }
}
class Scope {
  constructor(e, t, r, s) {
    this.targets = new TargetSet(this);
    this.classes = new ClassMap(this);
    this.data = new DataMap(this);
    this.containsElement = (e) =>
      e.closest(this.controllerSelector) === this.element;
    this.schema = e;
    this.element = t;
    this.identifier = r;
    this.guide = new Guide(s);
    this.outlets = new OutletSet(this.documentScope, t);
  }
  findElement(e) {
    return this.element.matches(e)
      ? this.element
      : this.queryElements(e).find(this.containsElement);
  }
  findAllElements(e) {
    return [
      ...(this.element.matches(e) ? [this.element] : []),
      ...this.queryElements(e).filter(this.containsElement),
    ];
  }
  queryElements(e) {
    return Array.from(this.element.querySelectorAll(e));
  }
  get controllerSelector() {
    return attributeValueContainsToken(
      this.schema.controllerAttribute,
      this.identifier
    );
  }
  get isDocumentScope() {
    return this.element === document.documentElement;
  }
  get documentScope() {
    return this.isDocumentScope
      ? this
      : new Scope(
          this.schema,
          document.documentElement,
          this.identifier,
          this.guide.logger
        );
  }
}
class ScopeObserver {
  constructor(e, t, r) {
    this.element = e;
    this.schema = t;
    this.delegate = r;
    this.valueListObserver = new ValueListObserver(
      this.element,
      this.controllerAttribute,
      this
    );
    this.scopesByIdentifierByElement = new WeakMap();
    this.scopeReferenceCounts = new WeakMap();
  }
  start() {
    this.valueListObserver.start();
  }
  stop() {
    this.valueListObserver.stop();
  }
  get controllerAttribute() {
    return this.schema.controllerAttribute;
  }
  parseValueForToken(e) {
    const { element: t, content: r } = e;
    return this.parseValueForElementAndIdentifier(t, r);
  }
  parseValueForElementAndIdentifier(e, t) {
    const r = this.fetchScopesByIdentifierForElement(e);
    let s = r.get(t);
    if (!s) {
      s = this.delegate.createScopeForElementAndIdentifier(e, t);
      r.set(t, s);
    }
    return s;
  }
  elementMatchedValue(e, t) {
    const r = (this.scopeReferenceCounts.get(t) || 0) + 1;
    this.scopeReferenceCounts.set(t, r);
    1 == r && this.delegate.scopeConnected(t);
  }
  elementUnmatchedValue(e, t) {
    const r = this.scopeReferenceCounts.get(t);
    if (r) {
      this.scopeReferenceCounts.set(t, r - 1);
      1 == r && this.delegate.scopeDisconnected(t);
    }
  }
  fetchScopesByIdentifierForElement(e) {
    let t = this.scopesByIdentifierByElement.get(e);
    if (!t) {
      t = new Map();
      this.scopesByIdentifierByElement.set(e, t);
    }
    return t;
  }
}
class Router {
  constructor(e) {
    this.application = e;
    this.scopeObserver = new ScopeObserver(this.element, this.schema, this);
    this.scopesByIdentifier = new Multimap();
    this.modulesByIdentifier = new Map();
  }
  get element() {
    return this.application.element;
  }
  get schema() {
    return this.application.schema;
  }
  get logger() {
    return this.application.logger;
  }
  get controllerAttribute() {
    return this.schema.controllerAttribute;
  }
  get modules() {
    return Array.from(this.modulesByIdentifier.values());
  }
  get contexts() {
    return this.modules.reduce((e, t) => e.concat(t.contexts), []);
  }
  start() {
    this.scopeObserver.start();
  }
  stop() {
    this.scopeObserver.stop();
  }
  loadDefinition(e) {
    this.unloadIdentifier(e.identifier);
    const t = new Module(this.application, e);
    this.connectModule(t);
    const r = e.controllerConstructor.afterLoad;
    r && r.call(e.controllerConstructor, e.identifier, this.application);
  }
  unloadIdentifier(e) {
    const t = this.modulesByIdentifier.get(e);
    t && this.disconnectModule(t);
  }
  getContextForElementAndIdentifier(e, t) {
    const r = this.modulesByIdentifier.get(t);
    if (r) return r.contexts.find((t) => t.element == e);
  }
  proposeToConnectScopeForElementAndIdentifier(e, t) {
    const r = this.scopeObserver.parseValueForElementAndIdentifier(e, t);
    r
      ? this.scopeObserver.elementMatchedValue(r.element, r)
      : console.error(
          `Couldn't find or create scope for identifier: "${t}" and element:`,
          e
        );
  }
  handleError(e, t, r) {
    this.application.handleError(e, t, r);
  }
  createScopeForElementAndIdentifier(e, t) {
    return new Scope(this.schema, e, t, this.logger);
  }
  scopeConnected(e) {
    this.scopesByIdentifier.add(e.identifier, e);
    const t = this.modulesByIdentifier.get(e.identifier);
    t && t.connectContextForScope(e);
  }
  scopeDisconnected(e) {
    this.scopesByIdentifier.delete(e.identifier, e);
    const t = this.modulesByIdentifier.get(e.identifier);
    t && t.disconnectContextForScope(e);
  }
  connectModule(e) {
    this.modulesByIdentifier.set(e.identifier, e);
    const t = this.scopesByIdentifier.getValuesForKey(e.identifier);
    t.forEach((t) => e.connectContextForScope(t));
  }
  disconnectModule(e) {
    this.modulesByIdentifier.delete(e.identifier);
    const t = this.scopesByIdentifier.getValuesForKey(e.identifier);
    t.forEach((t) => e.disconnectContextForScope(t));
  }
}
const o = {
  controllerAttribute: "data-controller",
  actionAttribute: "data-action",
  targetAttribute: "data-target",
  targetAttributeForScope: (e) => `data-${e}-target`,
  outletAttributeForScope: (e, t) => `data-${e}-${t}-outlet`,
  keyMappings: Object.assign(
    Object.assign(
      {
        enter: "Enter",
        tab: "Tab",
        esc: "Escape",
        space: " ",
        up: "ArrowUp",
        down: "ArrowDown",
        left: "ArrowLeft",
        right: "ArrowRight",
        home: "Home",
        end: "End",
        page_up: "PageUp",
        page_down: "PageDown",
      },
      objectFromEntries(
        "abcdefghijklmnopqrstuvwxyz".split("").map((e) => [e, e])
      )
    ),
    objectFromEntries("0123456789".split("").map((e) => [e, e]))
  ),
};
function objectFromEntries(e) {
  return e.reduce(
    (e, [t, r]) => Object.assign(Object.assign({}, e), { [t]: r }),
    {}
  );
}
class Application {
  constructor(t = document.documentElement, r = o) {
    this.logger = console;
    this.debug = false;
    this.logDebugActivity = (e, t, r = {}) => {
      this.debug && this.logFormattedMessage(e, t, r);
    };
    this.element = t;
    this.schema = r;
    this.dispatcher = new Dispatcher(this);
    this.router = new Router(this);
    this.actionDescriptorFilters = Object.assign({}, e);
  }
  static start(e, t) {
    const r = new this(e, t);
    r.start();
    return r;
  }
  async start() {
    await domReady();
    this.logDebugActivity("application", "starting");
    this.dispatcher.start();
    this.router.start();
    this.logDebugActivity("application", "start");
  }
  stop() {
    this.logDebugActivity("application", "stopping");
    this.dispatcher.stop();
    this.router.stop();
    this.logDebugActivity("application", "stop");
  }
  register(e, t) {
    this.load({ identifier: e, controllerConstructor: t });
  }
  registerActionOption(e, t) {
    this.actionDescriptorFilters[e] = t;
  }
  load(e, ...t) {
    const r = Array.isArray(e) ? e : [e, ...t];
    r.forEach((e) => {
      e.controllerConstructor.shouldLoad && this.router.loadDefinition(e);
    });
  }
  unload(e, ...t) {
    const r = Array.isArray(e) ? e : [e, ...t];
    r.forEach((e) => this.router.unloadIdentifier(e));
  }
  get controllers() {
    return this.router.contexts.map((e) => e.controller);
  }
  getControllerForElementAndIdentifier(e, t) {
    const r = this.router.getContextForElementAndIdentifier(e, t);
    return r ? r.controller : null;
  }
  handleError(e, t, r) {
    var s;
    this.logger.error("%s\n\n%o\n\n%o", t, e, r);
    null === (s = window.onerror) || void 0 === s
      ? void 0
      : s.call(window, t, "", 0, 0, e);
  }
  logFormattedMessage(e, t, r = {}) {
    r = Object.assign({ application: this }, r);
    this.logger.groupCollapsed(`${e} #${t}`);
    this.logger.log("details:", Object.assign({}, r));
    this.logger.groupEnd();
  }
}
function domReady() {
  return new Promise((e) => {
    "loading" == document.readyState
      ? document.addEventListener("DOMContentLoaded", () => e())
      : e();
  });
}
function ClassPropertiesBlessing(e) {
  const t = readInheritableStaticArrayValues(e, "classes");
  return t.reduce(
    (e, t) => Object.assign(e, propertiesForClassDefinition(t)),
    {}
  );
}
function propertiesForClassDefinition(e) {
  return {
    [`${e}Class`]: {
      get() {
        const { classes: t } = this;
        if (t.has(e)) return t.get(e);
        {
          const r = t.getAttributeName(e);
          throw new Error(`Missing attribute "${r}"`);
        }
      },
    },
    [`${e}Classes`]: {
      get() {
        return this.classes.getAll(e);
      },
    },
    [`has${capitalize(e)}Class`]: {
      get() {
        return this.classes.has(e);
      },
    },
  };
}
function OutletPropertiesBlessing(e) {
  const t = readInheritableStaticArrayValues(e, "outlets");
  return t.reduce(
    (e, t) => Object.assign(e, propertiesForOutletDefinition(t)),
    {}
  );
}
function getOutletController(e, t, r) {
  return e.application.getControllerForElementAndIdentifier(t, r);
}
function getControllerAndEnsureConnectedScope(e, t, r) {
  let s = getOutletController(e, t, r);
  if (s) return s;
  e.application.router.proposeToConnectScopeForElementAndIdentifier(t, r);
  s = getOutletController(e, t, r);
  return s || void 0;
}
function propertiesForOutletDefinition(e) {
  const t = namespaceCamelize(e);
  return {
    [`${t}Outlet`]: {
      get() {
        const t = this.outlets.find(e);
        const r = this.outlets.getSelectorForOutletName(e);
        if (t) {
          const r = getControllerAndEnsureConnectedScope(this, t, e);
          if (r) return r;
          throw new Error(
            `The provided outlet element is missing an outlet controller "${e}" instance for host controller "${this.identifier}"`
          );
        }
        throw new Error(
          `Missing outlet element "${e}" for host controller "${this.identifier}". Stimulus couldn't find a matching outlet element using selector "${r}".`
        );
      },
    },
    [`${t}Outlets`]: {
      get() {
        const t = this.outlets.findAll(e);
        return t.length > 0
          ? t
              .map((t) => {
                const r = getControllerAndEnsureConnectedScope(this, t, e);
                if (r) return r;
                console.warn(
                  `The provided outlet element is missing an outlet controller "${e}" instance for host controller "${this.identifier}"`,
                  t
                );
              })
              .filter((e) => e)
          : [];
      },
    },
    [`${t}OutletElement`]: {
      get() {
        const t = this.outlets.find(e);
        const r = this.outlets.getSelectorForOutletName(e);
        if (t) return t;
        throw new Error(
          `Missing outlet element "${e}" for host controller "${this.identifier}". Stimulus couldn't find a matching outlet element using selector "${r}".`
        );
      },
    },
    [`${t}OutletElements`]: {
      get() {
        return this.outlets.findAll(e);
      },
    },
    [`has${capitalize(t)}Outlet`]: {
      get() {
        return this.outlets.has(e);
      },
    },
  };
}
function TargetPropertiesBlessing(e) {
  const t = readInheritableStaticArrayValues(e, "targets");
  return t.reduce(
    (e, t) => Object.assign(e, propertiesForTargetDefinition(t)),
    {}
  );
}
function propertiesForTargetDefinition(e) {
  return {
    [`${e}Target`]: {
      get() {
        const t = this.targets.find(e);
        if (t) return t;
        throw new Error(
          `Missing target element "${e}" for "${this.identifier}" controller`
        );
      },
    },
    [`${e}Targets`]: {
      get() {
        return this.targets.findAll(e);
      },
    },
    [`has${capitalize(e)}Target`]: {
      get() {
        return this.targets.has(e);
      },
    },
  };
}
function ValuePropertiesBlessing(e) {
  const t = readInheritableStaticObjectPairs(e, "values");
  const r = {
    valueDescriptorMap: {
      get() {
        return t.reduce((e, t) => {
          const r = parseValueDefinitionPair(t, this.identifier);
          const s = this.data.getAttributeNameForKey(r.key);
          return Object.assign(e, { [s]: r });
        }, {});
      },
    },
  };
  return t.reduce(
    (e, t) => Object.assign(e, propertiesForValueDefinitionPair(t)),
    r
  );
}
function propertiesForValueDefinitionPair(e, t) {
  const r = parseValueDefinitionPair(e, t);
  const { key: s, name: n, reader: i, writer: o } = r;
  return {
    [n]: {
      get() {
        const e = this.data.get(s);
        return null !== e ? i(e) : r.defaultValue;
      },
      set(e) {
        void 0 === e ? this.data.delete(s) : this.data.set(s, o(e));
      },
    },
    [`has${capitalize(n)}`]: {
      get() {
        return this.data.has(s) || r.hasCustomDefaultValue;
      },
    },
  };
}
function parseValueDefinitionPair([e, t], r) {
  return valueDescriptorForTokenAndTypeDefinition({
    controller: r,
    token: e,
    typeDefinition: t,
  });
}
function parseValueTypeConstant(e) {
  switch (e) {
    case Array:
      return "array";
    case Boolean:
      return "boolean";
    case Number:
      return "number";
    case Object:
      return "object";
    case String:
      return "string";
  }
}
function parseValueTypeDefault(e) {
  switch (typeof e) {
    case "boolean":
      return "boolean";
    case "number":
      return "number";
    case "string":
      return "string";
  }
  return Array.isArray(e)
    ? "array"
    : "[object Object]" === Object.prototype.toString.call(e)
    ? "object"
    : void 0;
}
function parseValueTypeObject(e) {
  const { controller: t, token: r, typeObject: s } = e;
  const n = isSomething(s.type);
  const i = isSomething(s.default);
  const o = n && i;
  const c = n && !i;
  const l = !n && i;
  const h = parseValueTypeConstant(s.type);
  const u = parseValueTypeDefault(e.typeObject.default);
  if (c) return h;
  if (l) return u;
  if (h !== u) {
    const e = t ? `${t}.${r}` : r;
    throw new Error(
      `The specified default value for the Stimulus Value "${e}" must match the defined type "${h}". The provided default value of "${s.default}" is of type "${u}".`
    );
  }
  return o ? h : void 0;
}
function parseValueTypeDefinition(e) {
  const { controller: t, token: r, typeDefinition: s } = e;
  const n = { controller: t, token: r, typeObject: s };
  const i = parseValueTypeObject(n);
  const o = parseValueTypeDefault(s);
  const c = parseValueTypeConstant(s);
  const l = i || o || c;
  if (l) return l;
  const h = t ? `${t}.${s}` : r;
  throw new Error(`Unknown value type "${h}" for "${r}" value`);
}
function defaultValueForDefinition(e) {
  const t = parseValueTypeConstant(e);
  if (t) return c[t];
  const r = hasProperty(e, "default");
  const s = hasProperty(e, "type");
  const n = e;
  if (r) return n.default;
  if (s) {
    const { type: e } = n;
    const t = parseValueTypeConstant(e);
    if (t) return c[t];
  }
  return e;
}
function valueDescriptorForTokenAndTypeDefinition(e) {
  const { token: t, typeDefinition: r } = e;
  const s = `${dasherize(t)}-value`;
  const n = parseValueTypeDefinition(e);
  return {
    type: n,
    key: s,
    name: camelize(s),
    get defaultValue() {
      return defaultValueForDefinition(r);
    },
    get hasCustomDefaultValue() {
      return void 0 !== parseValueTypeDefault(r);
    },
    reader: l[n],
    writer: h[n] || h.default,
  };
}
const c = {
  get array() {
    return [];
  },
  boolean: false,
  number: 0,
  get object() {
    return {};
  },
  string: "",
};
const l = {
  array(e) {
    const t = JSON.parse(e);
    if (!Array.isArray(t))
      throw new TypeError(
        `expected value of type "array" but instead got value "${e}" of type "${parseValueTypeDefault(
          t
        )}"`
      );
    return t;
  },
  boolean(e) {
    return !("0" == e || "false" == String(e).toLowerCase());
  },
  number(e) {
    return Number(e.replace(/_/g, ""));
  },
  object(e) {
    const t = JSON.parse(e);
    if (null === t || "object" != typeof t || Array.isArray(t))
      throw new TypeError(
        `expected value of type "object" but instead got value "${e}" of type "${parseValueTypeDefault(
          t
        )}"`
      );
    return t;
  },
  string(e) {
    return e;
  },
};
const h = { default: writeString, array: writeJSON, object: writeJSON };
function writeJSON(e) {
  return JSON.stringify(e);
}
function writeString(e) {
  return `${e}`;
}
class Controller {
  constructor(e) {
    this.context = e;
  }
  static get shouldLoad() {
    return true;
  }
  static afterLoad(e, t) {}
  get application() {
    return this.context.application;
  }
  get scope() {
    return this.context.scope;
  }
  get element() {
    return this.scope.element;
  }
  get identifier() {
    return this.scope.identifier;
  }
  get targets() {
    return this.scope.targets;
  }
  get outlets() {
    return this.scope.outlets;
  }
  get classes() {
    return this.scope.classes;
  }
  get data() {
    return this.scope.data;
  }
  initialize() {}
  connect() {}
  disconnect() {}
  dispatch(
    e,
    {
      target: t = this.element,
      detail: r = {},
      prefix: s = this.identifier,
      bubbles: n = true,
      cancelable: i = true,
    } = {}
  ) {
    const o = s ? `${s}:${e}` : e;
    const c = new CustomEvent(o, { detail: r, bubbles: n, cancelable: i });
    t.dispatchEvent(c);
    return c;
  }
}
Controller.blessings = [
  ClassPropertiesBlessing,
  TargetPropertiesBlessing,
  ValuePropertiesBlessing,
  OutletPropertiesBlessing,
];
Controller.targets = [];
Controller.outlets = [];
Controller.values = {};
export {
  Application,
  AttributeObserver,
  Context,
  Controller,
  ElementObserver,
  IndexedMultimap,
  Multimap,
  SelectorObserver,
  StringMapObserver,
  TokenListObserver,
  ValueListObserver,
  add,
  o as defaultSchema,
  del,
  fetch,
  prune,
};
