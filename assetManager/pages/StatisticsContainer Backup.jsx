import React, { useState, useEffect } from "react";
import { apiPath } from "../services";
import { Box, Button, Divider, HStack, Text, VStack } from "native-base";
import { useDispatch, useSelector } from "react-redux";
import ContentScrollView from "@components/ContentScrollView";
import axios from "axios";
import Loading from "../components/Loading";
import SelectComponent from "../components/SelectComponent";
import InputTextComponent from "../components/InputTextComponent";
import { BarChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import Icon2 from "react-native-vector-icons/AntDesign";
import { List, MD3Colors } from "react-native-paper";
import { StyleSheet } from "react-native";

function StatisticsContainer() {
  const dispatch = useDispatch();

  //////// List 쓰기 위해 필요한 state
  const [expanded, setExpanded] = React.useState(true);
  const handlePress = () => setExpanded(!expanded);
  ///////////////////////////////////
  const { token } = useSelector((state) => state.login);
  const [fiInd, setFiInd] = useState({});
  const [salary, setSalary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tab, setTab] = useState(0);
  const changeTab = (index) => setTab(index);
  // 재무지표 graph data
  const data = {
    labels: [
      "총부채부담",
      "거주주택마련부채부담",
      "금융투자성향",
      "금융투자비중",
    ],
    datasets: [
      {
        data: [
          fiInd.totalDebtBurdenInd, // "총부채부담",
          fiInd.mortgageLoanBurdenInd, // "거주주택마련부채부담"
          fiInd.fiInvestInd, // "금융투자성향",
          fiInd.fiAssetInd, // "금융투자비중",
        ],
      },
    ],
  };

  // ★ 통계 탭 입장시 => 지표 데이터 전부 불러오기
  useEffect(() => {
    setIsLoading(true);
    axios({
      url: `${apiPath}/getFiInd`,
      method: "GET",
      params: {
        userId: token,
      },
    })
      .then((res) => {
        const result = res.data;
        setFiInd(result);
        setSalary(result.salary); // 총소득
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  //
  const getNewFiIndData = () => {
    axios({
      url: `${apiPath}/getNewFiInd`,
      method: "GET",
      params: {
        userId: token,
      },
    })
      .then((res) => {
        const result = res.data;
        console.log("변경 버튼 클릭시 " + result);
        //setFiInd(result);
        //setSalary(result.salary); // 총소득
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  console.log(fiInd);

  if (isLoading) return <Loading />;
  return (
    <ContentScrollView>
      {/* 상단 버튼 */}
      <HStack mt={"5"} space={5} justifyContent="center">
        <Button
          width={"40%"}
          bg={"white"}
          borderRadius={15}
          onPress={() => changeTab(0)}
          _pressed={{ bg: "light.50" }}
        >
          <Text color={"blue.400"} fontSize={18} fontWeight={"semibold"}>
            소비통계
          </Text>
        </Button>
        <Button
          width={"40%"}
          bg={"white"}
          borderRadius={15}
          onPress={() => changeTab(1)}
          _pressed={{ bg: "light.50" }}
        >
          <Text color={"pink.400"} fontSize={18} fontWeight={"semibold"}>
            재무지표
          </Text>
        </Button>
      </HStack>

      {/* 소비통계 */}
      {tab === 0 && (
        <VStack mt="5" alignItems="center">
          <Box
            bg="blue.100"
            w="90%"
            p="5"
            borderRadius="2xl"
            mb="5"
            alignItems={"center"}
          ></Box>
        </VStack>
      )}
      {/* 재무지표 */}
      {tab === 1 && (
        <VStack mt={5} mb={5} ml={5} mr={5}>
          <Box bg="blue.100" alignItems="center" p="5">
            <InputTextComponent
              value={String(salary)}
              parentSetState={setSalary}
              inputType="number"
              priceFormat={true}
              formControlLabelProps={{ text: `${token}님의 연 소득` }}
              formControlHelperProps={{
                text: "연 소득 금액이 달라진 경우 재입력 후 변경해주세요",
              }}
              formControlProps={{
                marginBottom: 5,
              }}
            ></InputTextComponent>
            <Button onPress={getNewFiIndData} width={"30%"}>
              변경
            </Button>
          </Box>
          <List.Section>
            <List.Accordion
              title={`총부채부담지표 : ${fiInd.totalDebtBurdenInd} %`}
            >
              <List.Item
                title="권장 가이드라인 : 40% 이하"
                left={(props) => <List.Icon {...props} icon="equal" />}
              />
              <List.Item
                title="계산방식 = 총부채 / 총자산"
                left={(props) => <List.Icon {...props} icon="equal" />}
              />
            </List.Accordion>
          </List.Section>
          <List.Section>
            <List.Accordion
              title={`거주주택마련부채부담지표  : ${fiInd.mortgageLoanBurdenInd} %`}
            >
              <List.Item
                title="권장 가이드라인 : 30% 이하"
                left={(props) => <List.Icon {...props} icon="equal" />}
              />
              <List.Item
                title="계산방식  = 주택마련부채잔액 / 총자산"
                left={(props) => <List.Icon {...props} icon="equal" />}
              />
            </List.Accordion>
          </List.Section>
          <List.Section>
            <List.Accordion
              title={`금융투자성향지표  : ${fiInd.fiInvestInd} %`}
            >
              <List.Item
                title="권장 가이드라인 : 30% 이상"
                left={(props) => <List.Icon {...props} icon="equal" />}
              />
              <List.Item
                title="20대 50% 이상, 30대 40% 이상, 40대 30% 이상, 50대 20% 이상"
                left={(props) => <List.Icon {...props} icon="equal" />}
              />
              <List.Item
                title="계산방식 = 금융투자 / 저축 및 투자"
                left={(props) => <List.Icon {...props} icon="equal" />}
              />
            </List.Accordion>
          </List.Section>
          <List.Section>
            <List.Accordion title={`금융자산비중지표 : ${fiInd.fiAssetInd} %`}>
              <List.Item
                title="권장 가이드라인 : 40% 이상"
                left={(props) => <List.Icon {...props} icon="equal" />}
              />
              <List.Item
                title="계산방식 = 금융자산 / 총자산"
                left={(props) => <List.Icon {...props} icon="equal" />}
              />
            </List.Accordion>
          </List.Section>
          {/* <List.Accordion
                title="Controlled Accordion"
                left={(props) => <List.Icon {...props} icon="folder" />}
                expanded={expanded}
                onPress={handlePress}
              >
                <List.Item title="First item" />
                <List.Item title="Second item" />
              </List.Accordion> 
            </List.Section>*/}
          <BarChart
            style={(borderRadius = 16)}
            data={data}
            // 차트 전체너비
            width={screenWidth * 0.9}
            // 차트 전체높이
            height={400}
            yAxisSuffix=" %" // y축 라벨 (yAxisLabel은 접두사)
            chartConfig={chartConfig}
            verticalLabelRotation={0} // x축 라벨 회전 관련
          />
        </VStack>
      )}
    </ContentScrollView>
  );
}

const styles = StyleSheet.create({
  custom1: {
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 5,
    marginRight: 5,
    //alignContent={"center"},
    //alignItems="center" },
  },
});

const screenWidth = Dimensions.get("window").width;

const chartConfig = {
  backgroundColor: "white",
  //배경 색
  backgroundGradientFrom: "#0000",
  backgroundGradientTo: "#0000",
  backgroundGradientFromOpacity: 0.4,
  backgroundGradientToOpacity: 0.4,
  //막대 색
  fillShadowGradientOpacity: 1, //투명도
  fillShadowGradientTo: "#f780f4",
  //소수점
  decimalPlaces: 1,
  // 레이블, 전체적인 색
  color: (opacity = 1) => `rgba(255, 255, 255, 1)`,
  style: {
    borderRadius: 16,
  },
};

export default StatisticsContainer;