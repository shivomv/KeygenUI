import React from 'react';
import { Form } from 'react-bootstrap';
import PropTypes from 'prop-types';

const FormDataComponent = ({ formData, handleInputChange, disabled }) => {
    return (
        <div>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>SN</th>
                        <th>Page No.</th>
                        <th>Q#</th>
                        <th>Key</th>
                    </tr>
                </thead>
                <tbody>
                    {formData.map((data, index) => (
                        <tr key={index}>
                            <td>{data.sn}</td>
                            <td>
                                <Form.Control
                                    size="sm"
                                    type="text"
                                    value={data.page}
                                    onChange={(e) => handleInputChange(index, 'page', e.target.value)}
                                    disabled={disabled} // Disable the input field if form is submitted and not in editing mode
                                />
                            </td>
                            <td>
                                <Form.Control
                                    size="sm"
                                    type="text"
                                    value={data.qNumber || index + 1} // Auto-fill with index + 1 if qNumber is not provided
                                    onChange={(e) => handleInputChange(index, 'qNumber', e.target.value)}
                                    disabled={disabled} // Disable the input field if form is submitted and not in editing mode
                                />
                            </td>
                            <td>
                                <Form.Control
                                    size="sm"
                                    type="text"
                                    value={data.key}
                                    onChange={(e) => handleInputChange(index, 'key', e.target.value)}
                                    disabled={disabled} // Disable the input field if form is submitted and not in editing mode
                                    style={{ border: data.key.includes('*') ? '1px solid red' : '1px solid #ced4da' }}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

FormDataComponent.propTypes = {
    formData: PropTypes.array.isRequired,
    handleInputChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool.isRequired
};

export default FormDataComponent;
