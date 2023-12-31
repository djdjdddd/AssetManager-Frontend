import React, { useCallback } from "react";
import { Box, HStack, Text } from "native-base";
import InputRadioComponent from "@components/InputRadioComponent";
import InputTextComponent from "@components/InputTextComponent";
import InputDateComponent from "@components/InputDateComponent";
import SelectComponent from "@components/SelectComponent";
import { useDispatch } from "react-redux";
import { depositDelete, depositUpdate } from "../action";
import { IconButton } from "react-native-paper";
import { makeDateString } from "../utils";
import { boxStyle } from "../styles";

function DepositAddContainer({ item, isOnlyOne, bankList }) {
  const dispatch = useDispatch();
  const startDate = item["startDate"];
  const endDate = item["endDate"];
  const currentDate = makeDateString(new Date());
  const year = Number(currentDate.substring(0, 4));

  const deleteButton = useCallback(() => {
    dispatch(depositDelete(item.index));
  }, []);

  return (
    <Box {...boxStyle} mt="5" mb="5">
      <Box w="100%">
        <HStack
          justifyContent="space-between"
          alignItems="center"
          mb="5"
          borderRadius="lg"
          bg={"amber.50"}
        >
          <Text pl="4" fontSize="20" color="black">
            상품 정보 추가
          </Text>
          <IconButton
            icon="delete"
            disabled={isOnlyOne}
            iconColor={"red"}
            size={35}
            style={{
              margin: 0,
              padding: 0,
            }}
            onPress={deleteButton}
          />
        </HStack>
        <InputRadioComponent
          name="depositType"
          formControlProps={{ mt: "3", mb: "5", isDisabled: true }}
          formControlLabelProps={{
            text: "상품 선택",
          }}
          radioButtonList={[
            {
              text: "예금",
              value: "deposit",
              liStyle: { alignItems: "center", ml: "5", mr: "10" },
            },
            {
              text: "적금",
              value: "saving",
              liStyle: { alignItems: "center" },
            },
          ]}
          formControlHelperProps={{ text: "상품을 선택하세요." }}
          id={item.index}
          value={item["depositType"]}
          dispatchF={depositUpdate}
        />
        <SelectComponent
          name="bank"
          isVertical={true}
          formControlProps={{ marginBottom: 5 }}
          formControlLabelProps={{
            text: "은행명",
          }}
          formControlHelperProps={{ text: "은행을 선택하세요." }}
          selectItem={bankList}
          id={item.index}
          value={item["bank"]}
          dispatchF={depositUpdate}
        />
        <InputTextComponent
          name="productName"
          formControlProps={{ mb: "5" }}
          formControlLabelProps={{ text: "상품명" }}
          formControlHelperProps={{
            text: "금융상품 이름을 입력하세요.",
          }}
          id={item.index}
          value={item["productName"] || ""}
          dispatchF={depositUpdate}
        />
        <InputDateComponent
          name="startDate"
          formControlProps={{ mb: "5" }}
          formControlLabelProps={{ text: "가입일" }}
          formControlHelperProps={{ text: "상품 가입일을 선택하세요." }}
          textInputProps={{ color: startDate ? "black" : "gray" }}
          id={item.index}
          value={startDate || currentDate}
          dispatchF={depositUpdate}
          datePickerProps={{
            type: "YYYY-MM-DD",
            minDate: `${year - 5}-01-01`,
            maxDate: `${year + 5}-12-31`,
            daySuffix: "일",
            width: 300,
            rowHeight: 60,
            selectedBorderLineWidth: "2",
            toolBarCancelStyle: { color: "black" },
          }}
        />
        <InputDateComponent
          name="endDate"
          formControlProps={{ mb: "5" }}
          formControlLabelProps={{ text: "만기일" }}
          formControlHelperProps={{ text: "상품 만기일을 입력하세요." }}
          textInputProps={{ color: endDate ? "black" : "gray" }}
          id={item.index}
          value={endDate || currentDate}
          dispatchF={depositUpdate}
          datePickerProps={{
            type: "YYYY-MM-DD",
            minDate: `${year - 5}-01-01`,
            maxDate: `${year + 5}-12-31`,
            daySuffix: "일",
            width: 300,
            rowHeight: 60,
            selectedBorderLineWidth: "2",
            toolBarCancelStyle: { color: "black" },
          }}
        />
        <InputTextComponent
          name="price"
          inputType={"number"}
          priceFormat={true}
          formControlProps={{ mb: "5" }}
          formControlLabelProps={{ text: "금액(원)" }}
          formControlHelperProps={{
            text: "예치금액 / 적립금액을 입력하세요.",
          }}
          alertContent={"정확한 금액을 입력해주세요."}
          id={item.index}
          value={item["price"] || ""}
          placeholder="0"
          dispatchF={depositUpdate}
        />
        <InputTextComponent
          name="rate"
          inputType={"double"}
          formControlProps={{ mb: "10" }}
          formControlLabelProps={{ text: "금리(%)" }}
          formControlHelperProps={{
            text: "상품가입 시 적용 금리(이자율)를 입력하세요.",
          }}
          // inputStyle={{ width: "90%" }}
          // title={"금리"}
          // helperText={"상품가입 시 적용 금리(이자율)를 입력하세요."}
          alertContent={"금리를 올바르게 입력해주세요."}
          id={item.index}
          value={item["rate"] || ""}
          placeholder="0"
          dispatchF={depositUpdate}
        />
      </Box>
    </Box>
  );
}

export default React.memo(DepositAddContainer);
