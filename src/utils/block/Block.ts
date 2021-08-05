import EventBus from '../eventBus/EventBus';
import * as Handlebars from 'handlebars';
import deepClone from '../functions/deepClone';

export default class Block {
    static EVENTS = {
        INIT: 'init',
        FLOW_CDM: 'flow:component-did-mount',
        FLOW_CDU: 'flow:component-did-update',
        FLOW_RENDER: 'flow:render',
    };

    _element: HTMLElement | null = null;
    _meta: {tagName: string, props: Object} = null;
    props;
    eventBus: any;
    children: {[key: string]: any};

    constructor(tagName = 'div', props = {}) {

        this._meta = {
            tagName,
            props,
        };

        this.props = this._makePropsProxy(props);

        this.eventBus = new EventBus();

        this._registerEvents(this.eventBus);
        this.eventBus.emit(Block.EVENTS.INIT);
    }

    _registerEvents(eventBus: EventBus) {
        eventBus.on(Block.EVENTS.INIT, this.init.bind(this));
        eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
        eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
        eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
    }

    _createResources() {
        const {tagName} = this._meta;
        this._element = this._createDocumentElement(tagName);
    }

    init() {
        this._createResources();
        this.eventBus().emit(Block.EVENTS.FLOW_CDM);
    }

    _componentDidMount() {
        this.componentDidMount();
        this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
    }

    componentDidMount() {}

    _componentDidUpdate(oldProps: Object, newProps: Object) {
        const response = this.componentDidUpdate(oldProps, newProps);
        if (!response) {
            return;
        }

        this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
    }

    componentDidUpdate(oldProps: Object, newProps: Object) {
        return JSON.stringify(newProps) !== JSON.stringify(oldProps);
    }

    setProps = (nextProps: {[key: string]: any}) => {
        if (!nextProps) {
            return;
        }

        Object.assign(this.props, nextProps);
    };

    get element() {
        return this._element;
    }

    _render() {
        const {className = ''} = this.props.ctx;
        this._element.className = className;
        const block = this.render();
        this._element.appendChild(block);
        this._renderChildren();
        this._addEventListeners();
    }

    render() {
        const element = document.createElement('div');
        element.innerHTML = this._template;
        return element.firstElementChild;
    }

    get _template() {
        const {
            tmpl = '',
            ctx = {},
        } = this.props;
        const _template = Handlebars.compile(tmpl);
        return _template(ctx);
    }

    _renderChildren() {
        this.children = {};
        const {children = {}} = this.props.ctx;
        const components: NodeList = this.getContent().querySelectorAll('[data-component]');

        const noChildren = Object.keys(children).length === 0
            || components.length === 0;
        if (noChildren) {
            return;
        }

        components.forEach((component: HTMLElement) => {
            const componentName = component.dataset.component;
            const child = children[componentName];
            const isArray = child instanceof Array;

            if (isArray) {
                if (!this.children[componentName]) {
                    this.children[componentName] = [];
                }

                const componentKey = component.dataset.key;
                const childTemplate = child[componentKey].getContent();
                this.children[componentName][componentKey] = childTemplate;
                component.replaceWith(childTemplate);
            } else {
                const childTemplate = child.getContent();
                this.children[componentName] = childTemplate;
                component.replaceWith(childTemplate);
            }
        });
    }

    _addEventListeners() {
        const {events = {}} = this.props.ctx;

        Object.keys(events).forEach(event => {
            this._element.addEventListener(event, events[event]);
        });

        this.addEventListeners();
    }

    addEventListeners() {}

    getContent() {
        return this.element;
    }

    _makePropsProxy(props: any) {
        const self = this;

        return new Proxy(props, {
            get(target, prop) {
                const value = target[prop];
                return typeof value === 'function' ? value.bind(target) : value;
            },
            set(target, prop, value) {
                const oldTarget = deepClone(target);
                target[prop] = value;

                self.eventBus().emit(Block.EVENTS.FLOW_CDU, oldTarget, target);
                return true;
            },
            deleteProperty() {
                throw new Error('Нет доступа');
            },
        });
    }

    _createDocumentElement(tagName: string) {
        // Можно сделать метод, который через фрагменты в цикле создает сразу несколько блоков
        return document.createElement(tagName);
    }

    show() {
        this.getContent().style.display = 'block';
    }

    hide() {
        this.getContent().style.display = 'none';
    }
}
