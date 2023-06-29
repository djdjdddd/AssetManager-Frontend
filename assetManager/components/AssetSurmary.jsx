import { Box, Center, HStack, Text } from "native-base";
import React from "react";
import { inputPriceFormat } from "../utils";
import { Button, Divider } from "react-native-paper";
import {
  leftPaperButton,
  rightPaperButton,
  rightPaperButtonNoWidth,
} from "../styles";

function AssetSurmary({
  data,
  title,
  textListInfo,
  updateBtn = { title: "", onPress: () => {} },
  serviceBtn = { title: "", onPress: () => {} },
}) {
  const { title: updateBtnTitle = "", onPress: updateBtnOnPress = () => {} } =
    updateBtn;
  const { title: serviceBtnTitle = "", onPress: serviceBtnOnPress = () => {} } =
    serviceBtn;

  return (
    <Center borderRadius={20} mt={8} mb={5}>
      <Box>
        <Text fontSize={20} mb={2.5} fontWeight={"bold"}>
          {title}
        </Text>
      </Box>
      <Box
        w={"100%"}
        borderColor="#AAA9BC" // #401CA3 , #845EC2 , #B39CD0
        padding={2.5}
        //bgColor={"#ECEEFF"} // 기존 : amber.50
        //borderWidth={1}
        //borderRadius={20}
      >
        {data?.map((el, index) => (
          <>
            <Box
              key={index}
              ml={45}
              mt={index === 0 ? 1 : 1.5} // 2.5 => 1로 변경
              mb={index === data?.length - 1 ? 1 : 1} // 2.5 => 1로 변경
              padding={2.5}
            >
              {textListInfo?.map((li, idx) => (
                <HStack key={idx}>
                  <Text fontSize={14} fontWeight={"semibold"}>
                    {li?.title + " : "}
                  </Text>
                  <Text fontSize={14}>
                    {li?.isPrice ? inputPriceFormat(el[li?.key]) : el[li?.key]}
                    {li?.unit}
                  </Text>
                </HStack>
              ))}
            </Box>
            <Divider></Divider>
          </>
        ))}
      </Box>
      <HStack marginTop={2.5}>
        <Button
          {...leftPaperButton}
          style={{ marginRight: 5 }}
          //mb="2.5"
          //mx="1"
          onPress={updateBtnOnPress}
        >
          {updateBtnTitle}
        </Button>
        <Button
          {...rightPaperButtonNoWidth}
          //mb="2.5"
          //mx="1"
          onPress={serviceBtnOnPress}
        >
          {serviceBtnTitle}
        </Button>
      </HStack>
    </Center>
  );
}

export default AssetSurmary;
