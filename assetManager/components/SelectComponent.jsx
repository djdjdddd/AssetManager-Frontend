import { FormControl, HStack, Select, VStack } from "native-base";
import React, { useCallback, useMemo } from "react";
import { Text, View } from "react-native";
import { formControlLableBasicStyle } from "../styles";
import { useDispatch } from "react-redux";

function SelectComponent({
  name = "",
  id = "0",
  value = "",
  dispatchF = undefined,
  parentSetState = undefined,

  isVertical = true,
  formControlProps = {}, //{FormControl 속성}
  formControlLabelProps = {}, // {Text 속성}
  formControlHelperProps = {}, // {FormControl.HelperText 속성}
  selectProps = {}, //placeholder = "", color,placeholderTextColor,defaultValue = "",isDisabled = false, isHovered = false,isFocused = false,isFocusVisible = false,dropdownIcon = undefined,dropdownOpenIcon = undefined,dropdownCloseIcon = undefined,variant = "outline", onOpen = () => {}, onClose = () => {},
  selectItem = [], // 선택 item
  selectItemStyle = {}, // 선택 item들의 공통스타일
}) {
  const dispatch = useDispatch();
  const { text: formControlLabelText = "", ...formControlLabelStyleProps } =
    useMemo(() => formControlLabelProps);
  const { text: formControlHelperText = "", ...formControlHelperStyleProps } =
    useMemo(() => formControlHelperProps);

  const onChange = (text) => {
    if (parentSetState) parentSetState(text, id, name);
    if (dispatchF) dispatch(dispatchF(text, id, name));
  };

  const titleLable = useCallback(() => {
    return (
      <Text
        style={{
          ...formControlLableBasicStyle.label,
          ...formControlLabelStyleProps,
        }}
      >
        {formControlLabelText}
      </Text>
    );
  }, []);

  const selector = () => {
    return (
      <Select
        readOnly={true}
        selectedValue={value}
        onValueChange={onChange}
        placeholder="선택해주세요."
        backgroundColor="white"
        {...selectProps}
      >
        {selectItem.map((el, index) => (
          <Select.Item
            key={index}
            label={el}
            value={el}
            style={{ ...selectItemStyle }}
          />
        ))}
      </Select>
    );
  };

  return (
    <FormControl maxW="100%" style={{ width: "100%" }} {...formControlProps}>
      {isVertical ? (
        <VStack
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              flex: 1,
              width: "100%",
            }}
          >
            {titleLable()}
            {selector()}
          </View>
        </VStack>
      ) : (
        <View style={{ width: "100%" }}>
          <HStack>
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                width: "30%",
              }}
            >
              {titleLable()}
            </View>
            <View
              style={{
                width: "70%",
              }}
            >
              {selector()}
            </View>
          </HStack>
        </View>
      )}
      <FormControl.HelperText {...formControlHelperStyleProps}>
        {formControlHelperText}
      </FormControl.HelperText>
    </FormControl>
  );
}

export default SelectComponent;
