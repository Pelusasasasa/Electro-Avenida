import { useEffect, useMemo, useState } from 'react';

export const useForm = ( initialForm = {}, formValidations = {} ) => {
  
    const [ formState, setFormState ] = useState( initialForm );
    const [formValidation, setFormValidation] = useState({});

    useEffect(() => {
      createValidators();
    }, [formState]);

    useEffect(() => {
        setFormState(initialForm);
    }, [initialForm]);

    const isFormValid = useMemo( () => {

        for ( const formValue of Object.keys( formValidation )){
            if ( formValidation[formValue] !== null ) return false;
        }

        return true;

    }, [formValidation]);

    const onInputChange = ({ target }) => {
        const { name, value, files } = target;
        setFormState({
            ...formState,
            [ name ]: target.type === 'file' ? {files, value} : value
        });
    };
    
    const onChanges = ( value ) => {
        console.log(value)
        setFormState({
            ...formState,
            ...value
        });
    }

    const onResetForm = () => {
        setFormState( initialForm );
    };

    const createValidators = () => {

        const formCheckedValue = {};

        for (const formField of Object.keys( formValidations )){
            const [fn, errorMessage ] = formValidations[formField];
            formCheckedValue[`${ formField }Valid`] = fn( formState[formField ]) ? null : errorMessage;
            setFormValidation(formCheckedValue);
        }

    };

    return {
        ...formState,
        formState,
        onChanges,
        onInputChange,
        onResetForm,
        setFormState,

        ...formValidation,
        isFormValid
    }
}