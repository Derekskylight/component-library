import React, { PropsWithChildren } from 'react';
import { FormContext, useGenericContext } from './FormContext';
import produce from 'immer';
import set from 'lodash/set';
import { TObjectDriller } from './ObjectDriller';
import { FieldStatusFunc } from './FormStatusFunc';

export type FormFieldProps<TData, TComponentProps, TFieldData> =
  // React.FC<P> assigns the generic P to {} as a default type. That causes a
  // subtype contrainst error. See https://stackoverflow.com/a/59363875. As a
  // work around, we can conditionally check that TComponentProps extends {}.
  TComponentProps extends {}
    ? {
        defaultValue?: TFieldData;
        getValue: (
          _: TObjectDriller<NonNullable<TData>>
        ) => TObjectDriller<TFieldData>;
        preprocessForDisplay?: (
          _: TFieldData | undefined
        ) => TFieldData | JSX.Element | string | undefined;
        parseOnChangeEvent?: (
          event: React.ChangeEvent<any>,
          data: TObjectDriller<TData>
        ) => TFieldData;
        status?: FieldStatusFunc<TData, TComponentProps>;
        inputComponent: React.FC<TComponentProps>;
      } & /* Include TComponentProps props, except onChange, defaultValue, and status */ Pick<
        TComponentProps,
        Exclude<keyof TComponentProps, 'onChange' | 'defaultValue' | 'status'>
      > /*
			If TComponentProps does not extend {}, React will choke on creating
			the component. So don't allow this case.
		*/
    : never;

/**
 * Generic form input field component that handles simple use cases,
 * where the data displayed in the field and updated by the user maps
 * directly to the necessary updates to form data state.
 *
 * For complex use cases (e.g. adding or removing array element),
 * custom form field components should be created
 */
// TData must extend object for lodash set.
// TComponentProps must extend {} for React.
export const FormField = <
  TData extends object,
  TComponentProps extends {},
  TFieldData
>({
  defaultValue,
  getValue,
  preprocessForDisplay,
  parseOnChangeEvent = (e) => e.target.value,
  status = () => undefined,
  inputComponent: InputComponent,
  children,
  ...props
}: PropsWithChildren<FormFieldProps<TData, TComponentProps, TFieldData>>) => {
  const { data, dataDriller, updateData, hideStatus } = useGenericContext<
    TData
  >(FormContext);

  const accessor = getValue(dataDriller);
  let value: TFieldData | undefined = accessor.value;
  if (value === undefined) {
    value = defaultValue;
  }
  const updatePath = accessor.path;

  const onChange = (e: React.ChangeEvent<any>) => {
    const processedData = parseOnChangeEvent(e, dataDriller);
    updateData(
      produce<TData>(data, (draft) => set(draft, updatePath, processedData))
    );
  };

  return (
    <InputComponent
      defaultValue={preprocessForDisplay ? preprocessForDisplay(value) : value}
      onChange={onChange}
      status={hideStatus ? undefined : status(dataDriller, updatePath, props)}
      {...props}
    >
      {children}
    </InputComponent>
  );
};
