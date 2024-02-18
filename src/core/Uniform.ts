class Uniform {

    value: any;

    constructor(...args) {
        let value = args[0];

        if (typeof value === 'string') {
            console.warn('Uniform: Type parameter is no longer needed.');
            value = args[1];
        }

        this.value = value;
    }

    clone() {
        return new Uniform(
            this.value.clone === undefined ? this.value : this.value.clone()
        );
    }

}

export { Uniform };
