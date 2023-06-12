import { FormControl, Icon, Input, Stack, Text } from "native-base";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { signinStates } from "../../action/signin";
import { useDispatch, useSelector } from "react-redux";

function Email() {
  const { email } = useSelector((state) => state.signin);
  const dispatch = useDispatch();
  const onchange = (text) => {
    dispatch(signinStates("email", text));
  };
  return (
    <Stack
      w="100%"
      mb={5}
      alignItems="center"
      justifyContent="center"
      space={4}
    >
      <FormControl w="90%">
        <Text fontSize="lg" fontWeight="bold" mb={1}>
          {"이메일"}
        </Text>
        <Input
          value={email}
          onChangeText={onchange}
          bg="white"
          size="xl"
          w={{
            base: "100%",
          }}
          mr="1"
          InputLeftElement={
            <Icon
              as={<MaterialIcons name="email" />}
              size={5}
              ml="2"
              color="muted.400"
            />
          }
          placeholder="email"
        />
        {/* 부연설명 text */}
        <FormControl.HelperText>
          {"사용자의 이메일을 입력해주세요."}
        </FormControl.HelperText>
      </FormControl>
    </Stack>
  );
}

export default Email;
