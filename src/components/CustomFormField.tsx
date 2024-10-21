import { SelectItem } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { E164Number } from "libphonenumber-js/core";
import { CalendarIcon } from "lucide-react";
import { ReactElement } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Control } from "react-hook-form";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Checkbox } from "./ui/checkbox";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { MultiSelect, MultiSelectProps } from "./ui/multi-select";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Select, SelectContent, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
export enum FormFieldType {
  INPUT,
  TEXTAREA,
  PHONE_INPUT,
  CHECKBOX,
  DATE_PICKER,
  SELECT,
  MULTI_SELECT,
  SKELETON,
}

type DefaultCustomFormFieldProps = {
  control: Control<any>;
  name: string;
  label?: string;
  disabled?: boolean;
  className?: string;
};

// export type SelectItemType = { key: string; value: string };
type FormFieldSelectType = {
  fieldType: FormFieldType.SELECT;
  children: ReactElement<typeof SelectItem>[] | ReactElement<typeof SelectItem>;
  placeholder?: string;
};
type FormFieldMultiSelectType = {
  fieldType: FormFieldType.MULTI_SELECT;
  placeholder?: string;
  optionList: MultiSelectProps["options"];
  maxCount?: MultiSelectProps["maxCount"];
  animation?: MultiSelectProps["animation"];
  variant?: MultiSelectProps["variant"];
};
type FormFieldInputType = {
  fieldType: FormFieldType.INPUT;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
};
type FormFieldDatePickerType = {
  fieldType: FormFieldType.DATE_PICKER;
  dateFormat?: string;
  showTimeSelect?: boolean;
};
type FormFieldPhoneType = {
  fieldType: FormFieldType.PHONE_INPUT;
  placeholder?: string;
};
type FormFieldCheckboxType = {
  fieldType: FormFieldType.CHECKBOX;
  description?: string;
};
type FormFieldTextAreaType = {
  fieldType: FormFieldType.TEXTAREA;
  placeholder?: string;
};
type FormFieldSkeletonType = {
  fieldType: FormFieldType.SKELETON;
  render?: (field: any) => React.ReactNode;
};

type CustomFormFieldProps = DefaultCustomFormFieldProps &
  (
    | FormFieldSelectType
    | FormFieldMultiSelectType
    | FormFieldInputType
    | FormFieldDatePickerType
    | FormFieldPhoneType
    | FormFieldCheckboxType
    | FormFieldTextAreaType
    | FormFieldSkeletonType
  );

const RenderInput = ({ field, props }: { field: any; props: CustomFormFieldProps }) => {
  switch (props.fieldType) {
    case FormFieldType.INPUT:
      return (
        <div className="border-dark-500 bg-dark-400 flex rounded-md border">
          <FormControl>
            <Input disabled={props.disabled} {...props} {...field} />
          </FormControl>
        </div>
      );
    case FormFieldType.TEXTAREA:
      return (
        <FormControl>
          <Textarea placeholder={props.placeholder} {...field} disabled={props.disabled} />
        </FormControl>
      );
    case FormFieldType.PHONE_INPUT:
      return (
        <FormControl>
          <PhoneInput
            disabled={props.disabled}
            numberInputProps={{ className: "input-phone-input" }}
            defaultCountry="DO"
            countries={["DO"]}
            placeholder={props.placeholder}
            // international
            addInternationalOption={false}
            withCountryCallingCode
            value={field.value as E164Number | undefined}
            onChange={field.onChange}
            className="input-phone"
          />
        </FormControl>
      );
    case FormFieldType.CHECKBOX:
      return (
        <FormControl>
          <div className="flex items-center gap-4">
            <Checkbox id={props.name} checked={field.value} onCheckedChange={field.onChange} />
            <label htmlFor={props.name} className="checkbox-label">
              {props.label}
            </label>
          </div>
        </FormControl>
      );
    case FormFieldType.DATE_PICKER:
      return (
        <div>
          <Popover modal>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant={"outline"}
                className={cn(
                  "w-full max-w-[280px] justify-start text-left font-normal",
                  !field.value && "text-muted-foreground",
                )}
              >
                {field.value ? format(field.value, "PPP") : <span>Selecciona una fecha</span>}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={(date) => {
                  field.onChange(date);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      );
    case FormFieldType.SELECT:
      return (
        <Select onValueChange={field.onChange} defaultValue={field.value}>
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder={props.placeholder} />
            </SelectTrigger>
          </FormControl>
          <SelectContent>{props.children}</SelectContent>
        </Select>
      );
    case FormFieldType.MULTI_SELECT:
      return (
        <FormControl>
          <MultiSelect
            options={props.optionList}
            onValueChange={(value) => field.onChange(value)}
            defaultValue={field.value}
            placeholder={props.placeholder ?? "Selecciona opciones"}
            variant={props.variant ?? "default"}
            animation={props.animation}
            maxCount={props.maxCount ?? 3}
            modalPopover
          />
        </FormControl>
      );
    case FormFieldType.SKELETON:
      return props.render ? props.render(field) : null;
    default:
      return null;
  }
};

export const CustomFormField = (props: CustomFormFieldProps) => {
  const { control, name, label } = props;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex-1">
          {props.fieldType !== FormFieldType.CHECKBOX && label && <FormLabel>{label}</FormLabel>}
          <RenderInput field={field} props={props} />

          <FormMessage />
        </FormItem>
      )}
    />
  );
};
