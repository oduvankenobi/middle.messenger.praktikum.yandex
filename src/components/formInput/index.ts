import Block from '../../utils/block/Block';
import InputType from './InputType';
import tmpl from './index.tmpl';
import './index.scss';
import ObjectLiteral from '../../types/ObjectLiteral';
import deepClone from '../../utils/functions/deepClone';

export default class FormInput extends Block {
    static ERROR_TEXTS = {
        WRONG_SYMBOLS: 'Введены недопустимые символы',
        WRONG_PASS: 'Неправильный пароль',
        WRONG_EMAIL: 'Неправильный формат email',
        WRONG_PHONE: 'Неправильный формат номера телефона',
        EMPTY_FIELD: 'Не заполнено обязательное поле',
    }

    constructor(ctx: InputType, events?: ObjectLiteral) {
        super('div', {
            tmpl,
            ctx,
            events,
        });
        this.addEventListeners();
    }

    addEventListeners() {
        debugger;
        const input = this.getContent().querySelector('input');
        const {validation = null} = this.props.ctx;
        if (!validation) {
            return;
        }

        validation.forEach((method: string) => {
            input.addEventListener('focus', this[method]);
        });
    }

    loginCheck = event => {
        const REGEXP: RegExp = /^[\w\d]*$/ig;
        const {value} = event.target;
        this.checkVal(value, REGEXP, FormInput.ERROR_TEXTS.WRONG_SYMBOLS);
    }

    requiredField = event => {
        const {value} = event.target;
        const REGEXP: RegExp = /^.+$/g;
        this.checkVal(value, REGEXP, FormInput.ERROR_TEXTS.EMPTY_FIELD);
    }

    checkVal(value: string|number, regex: RegExp, error: string) {
        const hasError = !value.match(regex);
        if (hasError) {
            const newProps = {...this.props.ctx, value, error};
            // console.log(this.props.ctx);
            this.setProps(newProps);
        } else {
            this.removeError(value);
        }
    }

    removeError(value?: string|Number) {
        const newProps = {
            ctx: {
                value,
                error: '',
            },
        };
        this.setProps(newProps);
    }

    emitInputError = () => {}
}
