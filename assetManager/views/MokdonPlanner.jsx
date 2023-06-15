import React, { useState, useEffect } from "react";
import {
  Box,
  FormControl,
  HStack,
  Input,
  ScrollView,
  Stack,
  Text,
  VStack,
  Select,
  Button,
  Icon,
  Ionicons,
} from "native-base";
import axios from "axios";
import {
  TextInput,
  FlatList,
  Alert,
  TouchableOpacity,
  View,
} from "react-native"; // ★ Alert를 native-base가 아니라 react-native껄 쓰면 그나마 뭐라도 좀 되네
import { apiPath } from "../services";
import { useDispatch, useSelector } from "react-redux";
import { makeDateString } from "../utils";
import InputTextComponent from "@components/InputTextComponent";
import SelectComponent from "../components/SelectComponent";
import { getAvgRate } from "../action/avgRate";

function MokdonPlanner(props) {
  const dispatch = useDispatch();
  const { deposit, savings } = useSelector((state) => state.avgRate);
  const [targetAmount, setTargetAmount] = useState("");
  const [targetPeriod, setTargetPeriod] = useState("");
  const saveType = ["자유롭게", "예금", "적금"];
  // ★ 여기 뱅크타입을 이제 Back에서 데이터 받아서 사용?
  // 총 17개 은행
  const bankType = [
    "신한은행",
    "국민은행",
    "하나은행",
    "우리은행",
    "농협은행",
    "IBK은행",
    "수협은행",
    "부산은행",
    "광주은행",
    "제주은행",
    "전북은행",
    "경남은행",
    "한국스탠다드차타드은행",
    "카카오뱅크",
    "토스뱅크",
    "케이뱅크",
    "한국산업은행",
  ];
  const [type, setType] = useState("");
  const [bank, setBank] = useState("");
  const [result, setResult] = useState({});
  const [list, setList] = useState([]);

  console.log("내가 고른 저축 유형 : " + type);
  console.log("내가 고른 은행 종류 : " + bank);

  // 은행-평균금리 정보 받아오기
  useEffect(() => {
    // 데이터 로딩 작업 수행
    console.log("예금 " + deposit); // redux에 의해 다시 페이지 들가도 남아있음 (로그아웃하면 초기화시키게끔 형이 설정할 듯?)
    console.log("적금 " + savings);

    if (deposit.length === 0) {
      axios({
        url: `${apiPath}/mokdon/getAvgRatePlz`,
        method: "GET",
      }).then((res) => {
        console.log("평균금리 몇임?? : " + res.data);
        const { deposit, savings } = res.data;
        dispatch(getAvgRate(deposit, savings));
      });
    }
  }, []); // [] : 렌더링 될때 처음 1번만 실행한다는 뜻.
  console.log("예금 평균금리 : " + deposit);
  console.log("적금 평균금리 : " + savings);

  // 계산하기 버튼 눌렀을 때
  const calculateBtn = () => {
    let mokdonDto = {
      targetAmount: targetAmount,
      targetPeriod: targetPeriod,
      type: type,
      bank: bank,
    };
    if (targetAmount === "" || targetPeriod === "") {
      Alert.alert("", "목표금액과 목표기간 모두 입력해주세요");
      return;
    }
    console.log(mokdonDto);
    //
    axios({
      url: `${apiPath}/mokdon/calculate`,
      method: "POST",
      data: JSON.stringify(mokdonDto),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        console.log("계산한 결과 : " + res.data);
        // ★ 왜 여기선 바로 반영이 안되고 이전 값이 나오는 거지??
        setResult(res.data);
      })
      .catch((err) => {
        console.log("계산에러 : " + err);
      });
  };

  // 은행-평균금리 정보 받아오기
  useEffect(() => {
    // 데이터 로딩 작업 수행
    axios({
      url: `${apiPath}/mokdon/getAvgRate`,
      method: "GET",
    }).then((res) => {
      const aa = res.data;
      console.log("Map 데이터가 옴 " + aa);
      console.log(aa["광주은행"]); // key: 각 은행 이름
      console.log(aa["신한은행"]);
    });
  }, []); // [] : 렌더링 될때 처음 1번만 실행한다는 뜻.

  // ★ 진이형한테 질문 - 왜 여기선 setter로 변경된 값이 바로 반영되고

  return (
    <ScrollView>
      <VStack mt="10" mb="10" alignItems="center">
        <Box bg="blue.100" w="90%" p="5" borderRadius="2xl" mb="5">
          <SelectComponent
            selectItem={saveType}
            value={type}
            parentSetState={setType}
            // CSS
            formControlLabelProps={{
              text: "저축 유형",
              // fontSize: 15,
              // fontWeight: "normal",
              // color: "black",
            }}
            formControlHelperProps={{
              text: "목돈을 모으는 방법을 선택해주세요",
            }}
            formControlProps={{ marginBottom: 5 }}
          ></SelectComponent>
          {(type === "예금" || type === "적금") && (
            <SelectComponent
              selectItem={bankType}
              value={bank}
              parentSetState={setBank}
              // CSS
              formControlLabelProps={{
                text: "은행 선택",
                // fontSize: 15,
                // fontWeight: "normal",
                // color: "black",
              }}
              formControlHelperProps={{
                text: "예금/적금 선택시 은행 골라주세요",
              }}
              formControlProps={{ marginBottom: 5 }}
            ></SelectComponent>
            //<InputTextComponent></InputTextComponent> 진이형한테 질문
          )}
          <InputTextComponent
            title="목표금액 (만원)"
            inputType="number"
            value={targetAmount}
            parentSetState={setTargetAmount}
            //inputStyle={{ width: "85%" }}
            helperText={"모으고 싶은 목표금액을 입력해주세요"}
            formControlLabelProps={{ text: "목표금액 (만원)" }}
            priceFormat={true}
          ></InputTextComponent>
          <InputTextComponent
            formControlLabelProps={{
              text: "목표기간 (개월)",
            }}
            inputType="number"
            value={targetPeriod}
            parentSetState={setTargetPeriod}
            //inputStyle={{ width: "85%" }}
            helperText={"목돈을 모을 기간을 입력해주세요"}
          ></InputTextComponent>
          <Button onPress={calculateBtn}>계산하기</Button>
        </Box>

        {/* ★ 저축 유형별 보이는 결과창이 다르게 설정하였음! */}
        {result.type === "자유롭게" && (
          <Box bg="orange.100" w="90%" p="5" borderRadius="2xl" mb="5">
            <InputTextComponent
              formControlLabelProps={{
                text: "자유롭게 이 부분을 어케 할지가 고민이구만...",
              }}
              //value={"약 " + result.roundedPrincipal+" 만원"}
            ></InputTextComponent>
          </Box>
        )}
        {result.type === "예금" && (
          <Box bg="violet.100" w="90%" p="5" borderRadius="2xl" mb="5">
            <InputTextComponent
              formControlLabelProps={{
                text: `${result.type} 가입 시 필요한 원금`,
              }}
              value={"약 " + result.roundedPrincipal + " 만원"}
            ></InputTextComponent>
          </Box>
        )}
        {result.type === "적금" && (
          <Box bg="red.100" w="90%" p="5" borderRadius="2xl" mb="5">
            <InputTextComponent
              formControlLabelProps={{
                text: `${result.type} 가입 시 필요한 월납입액`,
              }}
              value={"약 " + result.roundedPrincipal + " 만원"}
            ></InputTextComponent>
          </Box>
        )}
      </VStack>
    </ScrollView>
  );
}

export default MokdonPlanner;
