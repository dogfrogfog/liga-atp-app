import React from 'react';
import styles from '../admin/DataForm.module.scss'

type InputType = {
    placeholder: string,
    type: string,
    register?: any,
    name: string,
    errors?: any,
}
const Input = ({placeholder, type, register, name, errors}: InputType) => {
    return (
        <div className={styles.input}>
            <input
                placeholder={placeholder}
                type={type}
                {...register(name)}
            />
            {errors[name] && (<p>Введите корректные данные</p>)}
        </div>
    );
};

export default Input;