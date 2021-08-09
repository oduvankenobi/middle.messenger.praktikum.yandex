import ErrorPageLayout from '../../layouts/error/ErrorPageLayout';
import Button from '../../components/button';
import renderPage from '../../utils/renderHelpers/renderPage';

const ctx = {
    errorNumber: '404',
    errorText: 'Не туда попали',
    children: {
        button: new Button({
            label: 'Назад к чатам',
        }),
    },
};

const page404 = new ErrorPageLayout(ctx);
renderPage(page404);
