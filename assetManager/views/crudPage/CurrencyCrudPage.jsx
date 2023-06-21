import React, { useEffect, useState } from "react";
import {
  Box,
  VStack,
  Button,
  Text,
  HStack,
  Avatar,
  Spacer,
  Center,
} from "native-base";
import { Alert } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { apiPath } from "../../services";

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

function CurrencyCrudPage() {
  const { token } = useSelector((state) => state.login);
  const [currency, setCurrency] = useState(null);
  const [avergeGain, setAvergeGain] = useState(0);

  useEffect(() => {
    const fetchCurrency = async () => {
      try {
        const response = await axios.get(`${apiPath}/currency/currencyCrud`, {
          params: { id: token },
        });
        if (response === null) throw Error("빈값이 들어왔음");
        setCurrency(response.data);

        let totalInvestedAmount = 0;
        let gainMutipleByInvestedAmount = 0;
        for (let i = 0; i < response?.data.length; i++) {
          totalInvestedAmount += response.data[i]["investedAmount"];
          gainMutipleByInvestedAmount +=
            response.data[i]["investedAmount"] * response.data[i]["gain"];
        }
        setAvergeGain(gainMutipleByInvestedAmount / totalInvestedAmount);
      } catch (e) {
        console.log(e);
      }
    };
    fetchCurrency();
    console.log(currency);
  }, []);

  return (
    <Box mt="3">
      <Center _text={{ fontSize: "lg", fontWeight: "bold" }}>
        평균수익률:{avergeGain}
      </Center>
      {currency?.map((item, index) => (
        <Box
          key={index}
          borderBottomWidth="1"
          _dark={{ borderColor: "muted.50" }}
          borderColor="muted.800"
          pl={["0", "4"]}
          pr={["0", "5"]}
          py="2"
        >
          <HStack space={[2, 3]} justifyContent="space-between">
            <Avatar
              size="50px"
              source={require("@assets/currency.png")}
              ml="1"
            />
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
            <VStack>
              <Text
                fontSize="xs"
                pr="5"
                _dark={{ color: "warmGray.50" }}
                color="coolGray.800"
                alignSelf="center"
              >
                현재환율:{item.marketPrice}
              </Text>
              <Text
                fontSize="xs"
                pr="5"
                _dark={{ color: "warmGray.50" }}
                color="coolGray.800"
                alignSelf="center"
              >
                매입환율:{item.buyPrice}
              </Text>
              <Text
                fontSize="xs"
                pr="5"
                _dark={{ color: "warmGray.50" }}
                color="coolGray.800"
                alignSelf="center"
              >
                수익률:{item.gain}
              </Text>
            </VStack>
          </HStack>
        </Box>
      ))}
      <HStack alignSelf="center">
        <Button mt="5" mx="1">
          잔고수정
        </Button>
        <Button mt="5" mx="1">
          외화 서비스
        </Button>
      </HStack>
    </Box>
  );
}

export default CurrencyCrudPage;