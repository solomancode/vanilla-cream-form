function FormValidator(form) {
    this.form = form;
    this.errors = [];
    this.validators = [];
    this.allowEmptyInput = false;
}

FormValidator.prototype.registerValidator = function (querySelector, errorType, errorMessage) {
    this.validators.push({
        querySelector: querySelector,
        errorMessage: errorMessage,
        errorType: errorType
    })
}

FormValidator.prototype.validateForm = function (validator) {
    let errors = [];
    let nodeList = this.form.querySelectorAll(validator.querySelector);
    for (let i = 0; i < nodeList.length; i++) {
        const element = nodeList[i];
        const invalid = element.validity[validator.errorType];
        const empty = !this.allowEmptyInput && !element.value.trim();
        if (invalid || empty) {
            errors.push({
                element: element,
                message: validator.errorMessage(element.name)
            })
        }
    }
    this.errors = this.errors.concat(errors);
}

FormValidator.prototype.validate = function () {
    this.errors = [];
    for (let v = 0; v < this.validators.length; v++) {
        const validator = this.validators[v];
        this.validateForm(validator);
    }
    return this.errors.length ? false : true;
}