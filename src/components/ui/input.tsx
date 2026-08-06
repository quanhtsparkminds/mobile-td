import { cn } from "@/lib/utils";
import { LucideIcon, LucideProps } from "lucide-react-native";
import { Icon } from "./icon";
import { Platform, TextInput, View, type TextInputProps } from "react-native";

export type InputProps = {
  /**
   * The icon to render before the input.
   */
  leadingIcon?: LucideIcon;
  renderLeadingIcon?: (props: LucideProps) => React.ReactNode;

  /**
   * The icon to render after the input.
   */
  trailingIcon?: LucideIcon;
  renderTrailingIcon?: (props: LucideProps) => React.ReactNode;

  /**
   * The class name to apply to the container.
   */
  containerClassName?: string;
} & TextInputProps &
  React.RefAttributes<TextInput>;

function Input({
  className,
  placeholderClassName,
  containerClassName,
  leadingIcon,
  trailingIcon,
  renderLeadingIcon,
  renderTrailingIcon,
  ...props
}: InputProps) {
  return (
    <View
      className={cn(
        "w-full flex-row items-center gap-2 rounded-md border border-input px-3 dark:bg-input/30",
        containerClassName
      )}
    >
      {renderLeadingIcon
        ? renderLeadingIcon({ className: "text-muted-foreground" })
        : leadingIcon && (
            <Icon as={leadingIcon} className="mr-1 text-muted-foreground" />
          )}
      <TextInput
        className={cn(
          "flex h-10 min-w-0 flex-1 flex-row items-center py-1 text-base font-normal leading-5 text-foreground sm:h-9",
          props.editable === false &&
            cn(
              "opacity-50",
              Platform.select({
                web: "disabled:pointer-events-none disabled:cursor-not-allowed",
              })
            ),
          Platform.select({
            web: cn(
              "outline-none transition-[color,box-shadow] selection:bg-primary placeholder:text-muted-foreground md:text-sm",
              "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
              "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
            ),
            native: "placeholder:text-muted-foreground/50",
          }),
          className
        )}
        {...props}
      />
      {renderTrailingIcon
        ? renderTrailingIcon({ className: "text-muted-foreground" })
        : trailingIcon && (
            <Icon as={trailingIcon} className="ml-1 text-muted-foreground" />
          )}
    </View>
  );
}

export { Input };
