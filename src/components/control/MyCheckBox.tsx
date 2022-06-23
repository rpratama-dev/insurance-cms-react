import { Checkbox, FormControlLabel } from '@mui/material';

interface IProps {
  label: string;
  name: string;
  value?: string | number | null;
  checked: boolean;
  disabled?: boolean;
  handleChange: (value: { value: React.Key | null; checked: boolean }, name: string) => void;
}

const MyCheckBox = (props: IProps): React.ReactElement => {
  const { ...prop } = props;

  const handleCheked = (checked: boolean) => {
    prop.handleChange({ value: prop.value || '', checked }, prop.name);
  };

  return (
    <FormControlLabel
      control={
        <Checkbox
          value={prop.value}
          checked={prop.checked}
          onChange={(_, checked) => handleCheked(checked)}
          disabled={prop.disabled || false}
        />
      }
      label={prop.label}
      disabled={prop.disabled || false}
    />
  );
};

export default MyCheckBox;
