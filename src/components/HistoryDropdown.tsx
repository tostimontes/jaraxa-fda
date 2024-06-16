import { Autocomplete, TextField } from '@mui/material';

interface HistoryDropdownProps {
  value: string;
  onChange: (newValue: string) => void;
  label: string;
  onKeyPress: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  options: string[];
}

const HistoryDropdown: React.FC<HistoryDropdownProps> = ({
  value,
  onChange,
  label,
  onKeyPress,
  options,
}) => {
  return (
    <Autocomplete
      freeSolo
      fullWidth
      value={value}
      onChange={(_, newValue) => onChange(newValue as string)}
      onInputChange={(_, newValue) => onChange(newValue as string)}
      options={options}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          variant="outlined"
          onKeyPress={onKeyPress}
          sx={{
            backgroundColor: 'background.paper',
            borderRadius: '4px',
          }}
        />
      )}
    />
  );
};

export default HistoryDropdown;
