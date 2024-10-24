import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MultiSelect, MultiSelectProps } from "@/components/ui/multi-select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn, formatDate } from "@/lib/utils";
import { E164Number } from "libphonenumber-js/core";
import { CalendarIcon } from "lucide-react";
import React, { ReactElement } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Control } from "react-hook-form";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

export enum FormFieldType {
  INPUT,
  TEXTAREA,
  PHONE_INPUT,
  CHECKBOX,
  DATE_PICKER,
  SELECT,
  MULTI_SELECT,
  SKELETON,
  TIME_PICKER,
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
  max?: React.InputHTMLAttributes<HTMLInputElement>["max"];
  min?: React.InputHTMLAttributes<HTMLInputElement>["min"];
  readonly?: React.InputHTMLAttributes<HTMLInputElement>["readOnly"];
};
type FormFieldDatePickerType = {
  fieldType: FormFieldType.DATE_PICKER;
  dateFormat?: string;
  showTimeSelect?: boolean;
};
type FormFieldTimePickerType = {
  fieldType: FormFieldType.TIME_PICKER;
  interval?: number;
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
    | FormFieldTimePickerType
  );

const RenderInput = ({ field, props }: { field: any; props: CustomFormFieldProps }) => {
  switch (props.fieldType) {
    case FormFieldType.INPUT:
      return (
        <div className="border-dark-500 bg-dark-400 flex rounded-md border">
          <FormControl>
            <Input
              type={props.type}
              placeholder={props.placeholder}
              disabled={props.disabled}
              max={props.max}
              min={props.min}
              readOnly={props.readonly}
              {...field}
            />
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
                {field.value ? formatDate(field.value) : <span>Selecciona una fecha</span>}
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
    case FormFieldType.TIME_PICKER:
      return (
        <div className="border-dark-500 bg-dark-400 flex rounded-md border">
          <FormControl>
            <ReactDatePicker
              className="w-full p-2"
              wrapperClassName="w-full"
              selected={field.value}
              onChange={(date) => {
                field.onChange(date);
              }}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={props.interval ?? 45}
              timeCaption="Time"
              dateFormat="h:mm aa"
            />
          </FormControl>
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
