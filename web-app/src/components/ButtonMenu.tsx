import Radio, { RadioChangeEvent } from "antd/lib/radio";
import React, { ReactElement } from "react";
import { DownCircleFilled } from "@ant-design/icons";
import { Button, Popover } from "antd";

type Props = {
  onChange: (item: RadioChangeEvent) => void;
  options: Array<{ label: string | ReactElement; value: string }>;
  value: string | number;
  className?: string;
  disabled?: boolean;
  collapsable?: boolean;
};

function MenuContent({ className, onChange, options, value, disabled }: Props) {
  return (
    <div className="!flex justify-center font-medium">
      <Radio.Group
        className={`${className ?? ""}`}
        options={options}
        onChange={onChange}
        value={value}
        buttonStyle="solid"
        optionType="button"
        disabled={disabled}
      />
    </div>
  );
}
const ButtonMenu = ({
  className,
  onChange,
  options,
  value,
  disabled,
  collapsable,
}: Props) => {
  const menuButton = (
    <Button>
      <DownCircleFilled />
      <span className="ml-2">{value}</span>
    </Button>
  );
  return (
    <>
      {collapsable ? (
        <Popover
          content={
            <MenuContent
              onChange={onChange}
              options={options}
              value={value}
              disabled={disabled}
            />
          }
        >
          {menuButton}
        </Popover>
      ) : (
        <MenuContent
          className={className}
          onChange={onChange}
          options={options}
          value={value}
          disabled={disabled}
        />
      )}
    </>
  );
};

export default ButtonMenu;
