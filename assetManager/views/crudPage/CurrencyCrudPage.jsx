import React, { useEffect, useState } from "react";
import { Box, VStack, Text, HStack, Spacer, Center, View } from "native-base";
// import { Alert } from "react-native";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { apiPath } from "../../services";
// import { inputPriceFormat } from "../../utils";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { leftPaperButton, rightPaperButtonNoWidth } from "../../styles";
import { Button } from "react-native-paper";
import { Feather } from "@expo/vector-icons";

const showCurrencyName = (currency) => {
  switch (currency) {
    case "jpy":
      return "엔화";
    case "usd":
      return "달러";
    case "eur":
      return "유로";
    case "gbp":
      return "파운드";
    case "cnh":
      return "위안";
    default:
      break;
  }
};

const showCurrencyImg = (currency) => {
  switch (currency) {
    case "jpy":
      return "currency-jpy";
    case "usd":
      return "currency-usd";
    case "eur":
      return "currency-eur";
    case "gbp":
      return "currency-gbp";
    case "cnh":
      return "currency-cny";
    default:
      break;
  }
};

function CurrencyCrudPage({ parentLoading }) {
  const navigation = useNavigation();
  const { token } = useSelector((state) => state.login);
  const [currency, setCurrency] = useState(null);
  const [avergeGain, setAvergeGain] = useState(0);

  const goTOcurrencyUpdate = () => navigation.navigate("TempPage");
  const goTOcurrencyService = () => navigation.navigate("currencyGraphPage");

  useEffect(() => {
    const fetchCurrency = async () => {
      try {
        const response = await axios.get(`${apiPath}/currency/currencyCrud`, {
          params: { id: token },
        });
        setCurrency(response.data);
        parentLoading();
        let totalInvestedAmount = 0;
        let gainMutipleByInvestedAmount = 0;
        for (let i = 0; i < response.data.length; i++) {
          totalInvestedAmount += response.data[i]["investedAmount"];
          gainMutipleByInvestedAmount +=
            response.data[i]["investedAmount"] * response.data[i]["gain"];
        }
        setAvergeGain(gainMutipleByInvestedAmount / (totalInvestedAmount || 1));
      } catch (e) {
        console.log(e);
      }
    };
    fetchCurrency();
    console.log(currency);
  }, []);

  return (
    <View bgColor={"white"} w={"90%"} borderRadius={20}>
      <Box mt="3">
        <Center mt="5" mb="5">
          <HStack justifyContent={"center"} alignItems={"center"}>
            <Text fontSize={20} bold>
              평균수익률 :
            </Text>
            <Text
              fontSize={20}
              bold
              color={avergeGain > 0 ? "danger.600" : "info.600"}
            >
              {" " + Math.round(avergeGain.toFixed(4) * 1000) / 10}%
            </Text>
          </HStack>
        </Center>
        {currency?.map((item, index) => (
          <Box
            key={index}
            borderBottomWidth="0.5"
            _dark={{ borderColor: "muted.50" }}
            borderColor="gray.200"
            pl={["0", "4"]}
            pr={["0", "5"]}
            py="2"
          >
            <HStack>
              <HStack ml={5} space={[3, 3]} w={"45%"}>
                <Box
                  w={50}
                  h={50}
                  bg={"white"}
                  //borderWidth={1}
                  borderRadius={"full"}
                  justifyContent={"center"}
                  alignItems={"center"}
                >
                  {item.gain > 0 ? (
                    <Feather name="trending-up" size={20} color="red"></Feather>
                  ) : (
                    <Feather
                      name="trending-down"
                      size={20}
                      color="blue"
                    ></Feather>
                  )}
                  {/* ★외환 아이콘 (통일성을 위해 외환 아이콘 대신 up, down 그래프 사용해봤음)
                   <Icon
                    name={showCurrencyImg(item.currency)}
                    size={20}
                    color="black"
                  /> */}
                </Box>

                <VStack>
                  <Text
                    _dark={{ color: "warmGray.50" }}
                    color="coolGray.800"
                    bold
                    fontSize="lg"
                  >
                    {item.currency.toUpperCase()}
                  </Text>
                  <Text
                    color="coolGray.600"
                    _dark={{ color: "warmGray.200" }}
                    fontSize="md"
                  >
                    {showCurrencyName(item.currency)}
                  </Text>
                </VStack>
                <Spacer />
              </HStack>
              <VStack w={"50%"}>
                <Box>
                  <Text
                    fontSize="xs"
                    pr="5"
                    _dark={{ color: "warmGray.50" }}
                    color={item.gain > 0 ? "danger.600" : "info.600"}
                    // alignSelf="center"
                    // bold
                  >
                    수익률 : {(item.gain * 100).toFixed(2)}%
                  </Text>
                </Box>
                <Box>
                  <Text
                    fontSize="xs"
                    pr="5"
                    _dark={{ color: "warmGray.50" }}
                    color="coolGray.800"
                    // alignSelf="center"
                  >
                    현재환율 : {item.marketPrice.toFixed(2)}원
                  </Text>
                </Box>
                <Box>
                  <Text
                    fontSize="xs"
                    pr="5"
                    _dark={{ color: "warmGray.50" }}
                    color="coolGray.800"
                    // alignSelf="center"
                  >
                    매입환율 : {item.buyPrice.toFixed(2)}원
                  </Text>
                </Box>
              </VStack>
            </HStack>
          </Box>
        ))}
        <HStack alignSelf="center" mt="5" mb="5">
          <Button
            {...leftPaperButton}
            style={{ marginRight: 5 }}
            // mt="5" mx="1"
            onPress={goTOcurrencyUpdate}
          >
            잔고수정
          </Button>
          <Button
            {...rightPaperButtonNoWidth}
            // mt="5" mx="1"
            onPress={goTOcurrencyService}
          >
            시세조회
          </Button>
        </HStack>
      </Box>
    </View>
  );
}

export default CurrencyCrudPage;
