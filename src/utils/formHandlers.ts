export const formHandlers = event => {
    event.preventDefault();
    const {target} = event;
    const form = target.closest('form');
    const inputs = [...form.querySelectorAll('input')];
    const formJson = inputs
        .reduce((json, {name, value}) => {
            json[name] = value;
            return json;
        },
        {});
    console.log(formJson);
};

export const emitInputsValidation = event => {
    event.preventDefault();
    const validateEvent = new Event('validate');
    const {target} = event;
    const form = target.closest('form');
    const inputs = [...form.querySelectorAll('input')];
    inputs.forEach(input => {
        input.dispatchEvent(validateEvent);
    });
};
