import React, { useCallback, useMemo } from "react";
import { FormControl, HStack, Text } from "native-base";
import { RadioButton } from "react-native-paper";
import { useDispatch } from "react-redux";
import { formControlLableBasicStyle } from "../styles";
function InputRadioComponent({
  name = "",
  id = "0",
  value = "",
  dispatchF = undefined,
  parentSetState = undefined,
  title = "",
  radioButtonList = [], // 구조 -> [{text : "", value:"", liStyle:{ HStack 속성적용 }, RadioButtonLabelProps:{ Text 속성적용 }, RadioButtonItemProps:{ RadioButton 속성적용}}]
  formControlProps = {}, // FormControl 속성적용
  formControlLabelProps = {}, //FormControl.Label 속성적용
  formControlHelperProps = {},
  // labelStyle = {}, // style 속성적용
  radioButtonGroupProps = {}, //RadioButton.Group 속성적용
  inputStyle = {}, //HStack 속성적용
}) {
  console.log("InputRadioComponent >>>");
  const dispatch = useDispatch();
  const { text: formControlLabelText = "", ...formControlLabelStyleProps } =
    useMemo(() => formControlLabelProps);
  const { text: formControlHelperText = "", ...formControlHelperStyleProps } =
    useMemo(() => formControlHelperProps);

  const onChange = useCallback((newValue) => {
    if (parentSetState) parentSetState(newValue, id, name);
    if (dispatchF) dispatch(dispatchF(newValue, id, name));
  }, []);

  return (
    <FormControl style={{ width: "100%" }} isDisabled {...formControlProps}>
      <Text
        style={{
          ...formControlLableBasicStyle.label,
          ...formControlLabelStyleProps,
        }}
      >
        {formControlLabelText}
      </Text>
      <RadioButton.Group
        onValueChange={onChange}
        value={value}
        {...radioButtonGroupProps}
      >
        <HStack {...inputStyle}>
          {radioButtonList.map((el, index) => (
            <HStack key={index} {...el.liStyle}>
              <Text {...el.RadioButtonLabelProps}>{el.text}</Text>
              <RadioButton value={el.value} {...el.RadioButtonItemProps} />
            </HStack>
          ))}
        </HStack>
      </RadioButton.Group>
      <FormControl.HelperText {...formControlHelperStyleProps}>
        {formControlHelperText}
      </FormControl.HelperText>
    </FormControl>
  );
}
export default React.memo(InputRadioComponent);
