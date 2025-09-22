import styled from 'styled-components';

{
  /*extract from TextInputWithLabel.jsx*/
}

const StyledLabel = styled.label`
  margin-right: 0.5rem;
`;

const StyledInput = styled.input`
  padding: 0.25rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

function TextInputWithLabel({ elementId, labelText, onChange, ref, value }) {
  return (
    <>
      <StyledLabel htmlFor={elementId}>{labelText}</StyledLabel>
      <StyledInput
        type="text"
        id={elementId}
        ref={ref}
        value={value}
        onChange={onChange}
      />
    </>
  );
}

export default TextInputWithLabel;
