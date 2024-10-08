import React, { useMemo } from 'react';
import useAnimEnabled from '../../hooks/useAnimEnabled';

export interface CheckableProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  classNameLabel?: string;
}

/**
 * Alias для checkable с указанным типом radio.
 */
export const Radio = (props: CheckableProps) => (
  <Checkable type="radio" {...props} />
);
/**
 * Alias для checkable с указанным типом checkbox.
 */
export const Checkbox = (props: CheckableProps) => (
  <Checkable type="checkbox" {...props} />
);

/**
 * Компонент, имеющий два возможных состояния. Может функционировать как radio или как checkbox.
 *
 * @param {string} [props.name] - Атрибут name для элемента input.
 * @param {string} [props.type="radio"] - Тип.
 * @param {string} [props.id] - Атрибут id для элемента input. Если не указан, будет сгенерирован на основе типа и имени.
 * @param {string} [props.label] - Текст метки для элемента input.
 * @param {string} [props.classNameLabel="c3"] - Стили для элемента label.
 * @param {React.InputHTMLAttributes<HTMLInputElement>} [props...] - Дополнительные параметры, которые будут распространены на элемент input.
 */
const Checkable = (props: CheckableProps) => {
  const { data: animEnabled } = useAnimEnabled();
  const {
    name,
    type = 'radio',
    id,
    label,
    classNameLabel = 'c3',
    ...rest
  } = props;

  const inputId = useMemo(
    () => id || `${type}_${name}_${(Math.random() * 100).toFixed(0)}`,
    [name, type, id],
  );

  return (
    <div className="flex flex-row items-center gap-4">
      <div className="relative size-3.5">
        <input
          type={type}
          name={name}
          id={inputId}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[2] appearance-none size-5 p-0 focus:outline-none peer"
          {...rest}
        />
        <div
          className={`z-[1] rounded-full border-solid border border-c_accent absolute inset-0 bg-transparent peer-checked:after:scale-100 after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:size-2/3 after:rounded-full after:scale-0 ${animEnabled && 'after:transition-transform after:duration-200 after:ease-in-out'} after:bg-c_accent`}
        />
      </div>
      {label && (
        <label htmlFor={id} className={classNameLabel}>
          {label}
        </label>
      )}
    </div>
  );
};

export default Checkable;
