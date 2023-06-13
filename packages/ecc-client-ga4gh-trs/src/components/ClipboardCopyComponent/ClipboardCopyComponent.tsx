import React, { useState } from "react";
import styles from "./clipboard-copy-component.module.css";
import { Button, Input, Textarea } from "@nextui-org/react";

interface IClipboardCopyComponentProps {
  label?: string;
  className?: string;
  value?: string;
  disabled?: boolean;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ClipboardCopyComponent: React.FC<IClipboardCopyComponentProps> = ({
  label = "",
  className,
  value,
  disabled = false,
  placeholder,
  onChange,
}) => {
  const [text, setText] = useState<string>(value || "");
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value || text);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className={`${styles.clipboard} ${className}`}>
      <Input
        aria-label="input"
        value={value || text}
        contentRightStyling={false}
        onChange={onChange}
        label={label}
        disabled={disabled}
        className={styles.input}
        placeholder={placeholder}
        readOnly
        style={{
          color: "#ffffff",
        }}
        css={{
          width: "100%",
          $$inputColor: "#32353D",
          $$color: "#ffffff",
        }}
        contentRight={
          <Button auto onPress={handleCopy} className={styles.button}>
            {copied ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 30 30"
                width="30px"
                height="30px"
                className={styles.doneicon}
              >
                <path d="M 26.980469 5.9902344 A 1.0001 1.0001 0 0 0 26.292969 6.2929688 L 11 21.585938 L 4.7070312 15.292969 A 1.0001 1.0001 0 1 0 3.2929688 16.707031 L 10.292969 23.707031 A 1.0001 1.0001 0 0 0 11.707031 23.707031 L 27.707031 7.7070312 A 1.0001 1.0001 0 0 0 26.980469 5.9902344 z" />
              </svg>
            ) : (
              <svg
                width="33"
                height="31"
                viewBox="0 0 33 31"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="33" height="31" rx="6" fill="#4F4F4F" />
                <path
                  d="M25.25 7.625H13.25C13.0511 7.625 12.8603 7.69414 12.7197 7.81721C12.579 7.94028 12.5 8.1072 12.5 8.28125V11.5625H8.75C8.55109 11.5625 8.36032 11.6316 8.21967 11.7547C8.07902 11.8778 8 12.0447 8 12.2188V22.7188C8 22.8928 8.07902 23.0597 8.21967 23.1828C8.36032 23.3059 8.55109 23.375 8.75 23.375H20.75C20.9489 23.375 21.1397 23.3059 21.2803 23.1828C21.421 23.0597 21.5 22.8928 21.5 22.7188V19.4375H25.25C25.4489 19.4375 25.6397 19.3684 25.7803 19.2453C25.921 19.1222 26 18.9553 26 18.7812V8.28125C26 8.1072 25.921 7.94028 25.7803 7.81721C25.6397 7.69414 25.4489 7.625 25.25 7.625ZM20 22.0625H9.5V12.875H20V22.0625ZM24.5 18.125H21.5V12.2188C21.5 12.0447 21.421 11.8778 21.2803 11.7547C21.1397 11.6316 20.9489 11.5625 20.75 11.5625H14V8.9375H24.5V18.125Z"
                  fill="#F8F8F8"
                />
              </svg>
            )}
          </Button>
        }
      />
    </div>
  );
};

export default ClipboardCopyComponent;
