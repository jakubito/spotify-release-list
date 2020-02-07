import React from 'react';
import PropTypes from 'prop-types';
import { useFormContext } from 'react-hook-form';

function DescriptionField({ name }) {
  const { register, errors } = useFormContext();

  return (
    <div className="field">
      <label className="label has-text-light">Description</label>
      <div className="control">
        <input
          name={name}
          className="input is-rounded"
          type="text"
          placeholder="Optional"
          ref={register({ maxLength: 100 })}
        />
      </div>
      {errors[name] && (
        <p className="help is-danger">Description can&apos;t exceed 300 characters.</p>
      )}
    </div>
  );
}

DescriptionField.propTypes = {
  name: PropTypes.string.isRequired,
};

export default DescriptionField;
