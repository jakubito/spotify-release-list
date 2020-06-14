import React, { useCallback } from 'react';
import classNames from 'classnames';
import { useFormContext } from 'react-hook-form';
import { FieldName } from 'enums';

function NameField() {
  const { register, errors, setValue } = useFormContext();

  const changeHandler = useCallback(() => {
    setValue(FieldName.NAME_CUSTOM, true);
  }, []);

  return (
    <div className="field">
      <label className="label has-text-light">Name</label>
      <div className="control">
        <input
          name={FieldName.NAME}
          className={classNames('input is-rounded', { 'is-danger': errors[FieldName.NAME] })}
          type="text"
          onChange={changeHandler}
          ref={register({ required: true, maxLength: 100 })}
        />
      </div>
      {errors[FieldName.NAME] && (
        <p className="help is-danger">
          {errors[FieldName.NAME].type === 'required' && 'Name is required.'}
          {errors[FieldName.NAME].type === 'maxLength' && "Name can't exceed 100 characters."}
        </p>
      )}
    </div>
  );
}

export default NameField;
