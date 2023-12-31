import React, { useState, useMemo } from "react";
import { FormControl, HStack, Text } from "native-base";
import { inputTagCommonStyle } from "../utils";
import { TextInput } from "react-native";
import DatePickerModal from "./DatePickerModal";
import { formControlLableBasicStyle } from "../styles";
import { Button } from "react-native-paper";

function InputDateComponent({
  name = "",
  id = "0",
  dispatchF = undefined,
  parentSetState = undefined,

  value = "",
  formControlProps = {},
  formControlLabelProps = {},
  formControlHelperProps = {},
  textInputStyle = {},
  textInputProps = {},
  buttonProps = {},

  modalProps = {},
  layoutIsScroll = true,
  datePickerProps = {},
}) {
  const { text: formControlLabelText = "", ...formControlLabelStyleProps } =
    useMemo(() => formControlLabelProps);
  const { text: formControlHelperText = "", ...formControlHelperStyleProps } =
    useMemo(() => formControlHelperProps);

  const [show, setShow] = useState(false);
  const modalShow = () => {
    setShow((prev) => !prev);
  };

  return (
    <>
      <FormControl isDisabled {...formControlProps}>
        <Text
          style={{
            ...formControlLableBasicStyle.label,
            ...formControlLabelStyleProps,
          }}
        >
          {formControlLabelText}
        </Text>
        <HStack alignItems="center" justifyContent="center" w="100%" h="50">
          <TextInput
            style={{
              ...inputTagCommonStyle,
              color: "gray",
              width: "58%",
              ...textInputStyle,
            }}
            value={value}
            readOnly={true}
            {...textInputProps}
          />
          <Button
            mode="contained"
            style={{ marginLeft: 20, width: "35%" }}
            h="45"
            ml="2"
            onTouchEnd={modalShow}
            {...buttonProps}
          >
            날짜 선택
          </Button>
        </HStack>
        <FormControl.HelperText {...formControlHelperStyleProps}>
          {formControlHelperText}
        </FormControl.HelperText>
      </FormControl>
      <DatePickerModal
        layoutIsScroll={layoutIsScroll}
        modalControlState={{ state: show, setState: modalShow }}
        datePickerProps={datePickerProps}
        modalProps={modalProps}
        customProps={{
          id: id,
          name: name,
          dispatchF: dispatchF,
          parentSetState: parentSetState,
        }}
      />
    </>
  );
}
export default React.memo(InputDateComponent);
