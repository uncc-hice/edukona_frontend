import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';

const LocalizedDatePicker = ({
  label,
  name,
  margin,
  value,
  onChange,
}: {
  label: string;
  name: string;
  margin: 'dense' | 'normal' | 'none' | undefined;
  value: Date | null;
  onChange: (date: Date | null) => void;
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label={label}
        name={name}
        value={value ? dayjs(value) : null}
        onChange={(date: Dayjs | null) => onChange(date ? date.toDate() : null)}
        slotProps={{ textField: { margin: margin } }}
      />
    </LocalizationProvider>
  );
};

export default LocalizedDatePicker;
