import React, { useCallback, useMemo } from "react";
import { HStack, Text, FormControl } from "native-base";
import { TextInput, Alert } from "react-native";
import {
  alertText,
  inputPriceFormat,
  inputTagCommonStyle,
  keyBoardType,
} from "../utils";
import { useDispatch } from "react-redux";
import { formControlLableBasicStyle } from "../styles";

function InputTextComponent({
  name = "",
  id = "0",
  value = "",
  priceFormat = false,
  placeholder = "",
  dispatchF = undefined,
  parentSetState = undefined,
  inputType = "text",
  formControlProps = {},
  formControlLabelProps = {},
  formControlHelperProps = {},
  textInputPropsForFront = {},
  textInputStyle = {},
  textInputProps = {},
  textLabel = {}, // frontText, endText, frontTextSize, endTextSize
  alertTitle = alertText.basic.title,
  alertContent = alertText.basic.content,
}) {
  const dispatch = useDispatch();
  const { text: formControlLabelText = "", ...formControlLabelStyleProps } =
    useMemo(() => formControlLabelProps);
  const { text: formControlHelperText = "", ...formControlHelperStyleProps } =
    useMemo(() => formControlHelperProps);

  const isNumType = inputType === "number" || inputType === "double" || false;
  const keyboardType = keyBoardType(inputType);

  const onChangeText = useCallback((text) => {
    if (inputType === "number") {
      //입력했다가 지울 때, 유효성검사에 걸리므로 코드 수정!
      text = text.replace(/[-.,\s]/g, "");
      if (text[0] === "0") text = text.substring(1, text.length);
    } else if (inputType === "double") {
      const commaLen = text.replaceAll(/[0-9]/gi, "").length;
      const format = /^[.]{1}|^.*-.*|^.*,.*/;
      if (commaLen > 1 || (text.length > 0 && format.test(text))) {
        Alert.alert(alertTitle, alertContent);
        return;
      }
    }
    if (parentSetState) parentSetState(text, id, name);
    if (dispatchF) dispatch(dispatchF(text, id, name));
  }, []);

  return (
    <FormControl style={{ width: "100%" }} {...formControlProps}>
      <Text
        style={{
          ...formControlLableBasicStyle.label,
          ...formControlLabelStyleProps,
        }}
        {...formControlLabelProps}
      >
        {formControlLabelText}
      </Text>

      <HStack alignItems="center" w="100%">
        {/* input 앞에 텍스트 삽입 */}
        {textLabel?.frontText && (
          <Text
            fontSize={textLabel?.frontTextSize || "md"}
            {...textInputPropsForFront}
          >
            {textLabel?.frontText}
          </Text>
        )}

        <TextInput
          keyboardType={keyboardType}
          style={{
            ...inputTagCommonStyle,
            marginLeft: textLabel?.frontText ? 10 : 0,
            marginRight: textLabel?.endText ? 10 : 0,
            textAlign: isNumType ? "right" : "left",
            paddingLeft: isNumType ? 0 : 10,
            paddingRight: isNumType ? 10 : 0,
            ...textInputStyle,
          }}
          placeholder={placeholder}
          placeholderTextColor="lightgray"
          value={priceFormat ? inputPriceFormat(value) : value}
          onChangeText={onChangeText}
          on
          {...textInputProps}
        />

        {/* input 뒤에 텍스트 삽입 */}
        {textLabel?.endText && (
          <Text fontSize={textLabel?.endTextSize || "md"}>
            {textLabel?.endText}
          </Text>
        )}
      </HStack>

      {/* 부연설명 text */}
      <FormControl.HelperText {...formControlHelperStyleProps}>
        {formControlHelperText}
      </FormControl.HelperText>
    </FormControl>
  );
}
export default React.memo(InputTextComponent);
