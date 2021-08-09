import Block from '../../utils/block/Block';
import ErrorPageType from './errorPageType';
import tmpl from './index.tmpl';
import './index.scss';

export default class ErrorPageLayout extends Block {
    constructor(ctx: ErrorPageType) {
        super('div', {
            ctx: {
                ...ctx,
                className: 'error-page',
            },
            tmpl,
        });
    }
}
