import React, { useState, useEffect } from "react";
import { Box, FormControl, Input, Stack, Text, VStack } from "native-base";
import { Button } from "react-native-paper";
import axios from "axios";
import { Alert, TouchableOpacity } from "react-native"; // ★ Alert를 native-base가 아니라 react-native껄 쓰면 그나마 뭐라도 좀 되네
import { apiPath } from "../services";
import { useSelector } from "react-redux";
import { makeDateString } from "../utils";
import InputTextComponent from "@components/InputTextComponent";
import ContentScrollView from "@components/ContentScrollView";
import SelectComponent from "../components/SelectComponent";
import { boxStyle, leftPaperButton, rightPaperButton } from "../styles";

function CoinAddPage(props) {
  const [market, setMarket] = useState("");
  const [coinName, setCoinName] = useState("");
  const [quantity, setQuantity] = useState(""); // input에서 0을 입력하면 String이더라고. 그래서 초기값도 그냥 "0"으로 줘버림
  const [price, setPrice] = useState("");
  const [date, setDate] = useState(makeDateString(new Date()));
  const { token } = useSelector((state) => state.login);
  const marketList = ["업비트", "빗썸"];

  const handleReset = () => {
    setSelectedValue(""); // 이게 있어야 초기화시 '거래소를 선택해주세요'가 뜸
    setMarket("");
    setCoinName("");
    setQuantity("");
    setPrice("");
    setSearchKeyword(""); // 코인 검색란도 초기화되게끔 설정
  };

  const handleSubmit = () => {
    // 입력값 유효한지 check
    if (market === "") {
      Alert.alert("Error", "거래소를 선택해주세요");
      return;
    } else if (coinName === "") {
      Alert.alert("Error", "코인 이름을 입력해주세요");
      return;
    } else if (quantity === "" || price === "") {
      // input에서 0을 입력하면 String이더라고. 그래서 초기값도 그냥 "0"으로 줘버림
      Alert.alert("Error", "수량과 가격을 입력해주세요");
      return;
    } else if (quantity === "0" || price === "0") {
      Alert.alert("Error", "0이 아닌 값을 입력해주세요");
      return;
    }
    let formData = {
      market: market,
      coinName: coinName,
      quantity: quantity,
      price: price,
      date: date,
    };
    // console.log(formData);

    // 입력값이 유효한 경우 처리 로직
    axios({
      url: `${apiPath}/coin/add/${token}`,
      method: "POST",
      headers: {
        "Content-Type": `application/json`,
        Authorization: `${token}`,
      },
      data: JSON.stringify(formData),
    })
      .then(function (res) {
        // console.log(formData);
        console.log("데이터 전송 성공!!");

        // 스프링에서 제대로 Insert 됐는지 check
        console.log(res.data); // ★ res.data : 스프링에서 보낸 데이터를 읽는 것!
        if (res.data === "성공") {
          Alert.alert("Success", "자산 입력에 성공하였습니다");
        } else {
          Alert.alert("Error", "코인명을 제대로 입력해주세요");
        }
      })
      .catch(function (err) {
        console.log(`Error Msg : ${err}`);
      });
    // 입력값 초기화 (★ 한꺼번에 하는 방법은 없나??)
    // setMarket(""); // 여러번 입력하는 경우를 생각하면 얘는 굳이 초기화해줄 필요가 없네
    setCoinName("");
    setQuantity("");
    setPrice("");
    setSearchKeyword(""); // 코인 검색란도 초기화되게끔 설정
    //setFormData({});
  };
  // 이 useState는 없어도 될 듯?
  const [selectedValue, setSelectedValue] = useState("");
  // 일단 임시방편으로 Component가 아니라, 여기에 다 때려박아서 useState 이용하는 방식으로..
  const handleValueChange = (market) => {
    setSelectedValue(market);
    setMarket(market);
    console.log("Selected Market:", market);
  };
  const insertCoinName = (value) => {
    console.log("Text pressed!", value); // value => BTC
    // key가 아니라 value값을 바로 받으므로 필요 없어졌음. const realCoinName = value.key; // value.key => BTC
    console.log(value);
    setCoinName(value);
  };

  // ★★★★★ 검색 기능을 위한 코드 시작
  const [dataMap, setDataMap] = useState(new Map());
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filteredData, setFilteredData] = useState(new Map());

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    let data = { market: market };
    console.log(market);
    try {
      const response = await axios.post(
        `${apiPath}/coin/getCoinList`,
        JSON.stringify(data),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const responseData = response.data;
      const dataMap = new Map(Object.entries(responseData));
      setDataMap(dataMap);
      //console.log(response.data); // response.data : 스프링에서 넘긴 데이터(여기선 Map)를 얻는 법
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = (searchKeyword) => {
    // 검색 로직 및 결과 설정
    setSearchKeyword(searchKeyword);
    const filteredMap = new Map(
      Array.from(dataMap.entries()).filter(
        ([key, value]) =>
          value.toLowerCase().includes(searchKeyword.toLowerCase())
        // key.toLowerCase().includes(searchKeyword.toLowerCase())
      )
    );
    setFilteredData(filteredMap);
    if (searchKeyword === "") {
    }
  };
  // ★★★★★ 검색 기능을 위한 코드 끝

  return (
    <ContentScrollView>
      <VStack mt="10" mb="10" alignItems="center">
        <Box {...boxStyle}>
          <FormControl>
            <Box mt="2.5">
              <SelectComponent
                selectItem={marketList}
                value={selectedValue}
                parentSetState={handleValueChange}
                formControlLabelProps={{
                  text: "거래소",
                }}
              ></SelectComponent>
            </Box>
            {/*  ★★★★★ 검색기능 시작 */}
            <Box mb="5">
              <FormControl.Label>코인 검색하기</FormControl.Label>
              <Input
                value={searchKeyword} // value는 내가 주고 싶은 거 줘도 되는 듯??
                onChangeText={handleSearch}
                bg={"white"}
              />
              {searchKeyword !== "" &&
                Array.from(filteredData.keys()).map((key) => (
                  <TouchableOpacity
                    key={key}
                    onPress={() => {
                      insertCoinName(`${filteredData.get(key)}`); // ★ key값 대신 value값을 보내주면 되는 거 아닌가??
                    }}
                  >
                    {/* ★ 선택한 market의 코인만 Text화 */}
                    {key.includes(market) && (
                      <Text fontSize="xs" key={key}>
                        {key}
                      </Text>
                    )}
                  </TouchableOpacity>
                  // <Text key={key}>{`${key}: ${filteredData.get(key)}`}</Text>
                ))}
              {/*  ★★★★★ 검색기능 끝 */}
            </Box>
            <Box mb="5">
              <FormControl.Label>코인 이름</FormControl.Label>
              <Input
                placeholder="코인 검색 후 터치해주세요"
                value={coinName}
                onChangeText={(coinName) => setCoinName(coinName)}
                isReadOnly={true}
              />
            </Box>
            {/* <FormControl.Label>매수 수량</FormControl.Label> */}
            <InputTextComponent
              formControlLabelProps={{ text: "매수 수량" }}
              inputType="double"
              value={quantity}
              parentSetState={setQuantity}
              //value={String(quantity)}
              //onChangeText={(quantity) => setQuantity(quantity)}
            ></InputTextComponent>
            {/* <FormControl.Label>매수 가격 (원)</FormControl.Label> */}
            <InputTextComponent
              formControlLabelProps={{ text: "매수 가격 (원)" }}
              value={price}
              parentSetState={setPrice}
              inputType="double" // 소수까지 입력가능한 키타입 (made by 진이형)
              //priceFormat={true} // 금액 표시 기능 (★ double과 prcieFormat 같이 쓰면 입력할 때 에러나네)
            ></InputTextComponent>

            {/* SendAndResetButton 컴포넌트로 대체하고 싶은 부분 */}
            <Box>
              <Stack
                mb="2.5"
                mt="1.5"
                direction="row" // direction="row" => "column"으로 바꾸면 수직으로 쌓이게 됨
                space={2}
                // mx 이거 적용하면 버튼 너비가 줄어듦.
                mx={{
                  base: "auto",
                  md: "0",
                }}
              >
                <Button
                  //size="lg"
                  //variant="subtle"
                  //colorScheme="secondary"
                  {...leftPaperButton}
                  onPress={handleReset}
                >
                  초기화
                </Button>
                <Button
                  //size="lg"
                  //variant="subtle"
                  {...rightPaperButton}
                  onPress={handleSubmit}
                >
                  추가
                </Button>
              </Stack>
            </Box>
          </FormControl>
        </Box>
      </VStack>
    </ContentScrollView>
  );
}

export default CoinAddPage;
