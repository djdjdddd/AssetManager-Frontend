import {
  FontAwesome,
  Fontisto,
  Octicons,
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

import { Box, HStack } from "native-base";
import React, { useState } from "react";
import { View, Text } from "react-native";
import Carousel from "../external/Carousel";
import ContentScrollView from "@components/ContentScrollView";
import CarCrudPage from "@views/crudPage/CarCrudPage";
import DepositCrudPage from "@views/crudPage/DepositCrudPage";
import AptCrudPage from "@views/crudPage/AptCrudPage";
import GoldCrudPage from "@views/crudPage/GoldCrudPage";
import CurrencyCrudPage from "@views/crudPage/CurrencyCrudPage";
import Loading from "@components/Loading";
import StockCRUDpageUpdate from "@views/crudPage/StockCRUDpageUpdate";
import CoinCrudPage from "@views/crudPage/CoinCrudPage";
import { footerHeight, windowWidth } from "../styles";

const entries = [
  { key: "1", title: "예/적금", naviPath: "depositCrud" },
  { key: "2", title: "부동산", naviPath: "" },
  { key: "3", title: "자동차", naviPath: "carCrud" },
  { key: "4", title: "주식", naviPath: "stockCrud" },
  { key: "5", title: "코인", naviPath: "" },
  { key: "6", title: "외환", naviPath: "" },
  { key: "7", title: "금", naviPath: "" },
];

const iconStyle = {
  size: 40,
  color: "black",
};
function AssetContainer() {
  const sliderWidth = windowWidth;
  const itemWidth = windowWidth - 60;
  const [loading, setLoading] = useState(true);
  const itemLength = 7; // item이 늘어나면 숫자 높여준다.
  let loadingCount = 0; // 자식에 데이터가 들어왔는지 판단하기 위한 변수

  const parentLoading = () => {
    loadingCount++;
    console.log(loadingCount);
    if (loadingCount === itemLength) setLoading(false);
  };

  const iconSelectFuntion = (key) => {
    switch (key) {
      case "1":
        return <FontAwesome name="money" {...iconStyle} />;
      case "2":
        return <MaterialIcons name="house" {...iconStyle} />;
      case "3":
        return <Ionicons name="car-sport-sharp" {...iconStyle} />;
      case "4":
        return <Octicons name="graph" {...iconStyle} />;
      case "5":
        return <MaterialCommunityIcons name="bitcoin" {...iconStyle} />;
      case "6":
        return <Fontisto name="money-symbol" {...iconStyle} />;
      case "7":
        return <MaterialCommunityIcons name="gold" {...iconStyle} />;

      default:
        break;
    }
  };

  const contentsFunction = (key) => {
    switch (key) {
      case "1":
        return <DepositCrudPage parentLoading={parentLoading} />;
      case "2":
        return <AptCrudPage parentLoading={parentLoading} />;
      case "3":
        return <CarCrudPage parentLoading={parentLoading} />;
      case "4":
        return <StockCRUDpageUpdate parentLoading={parentLoading} />;
      case "5":
        return <CoinCrudPage parentLoading={parentLoading} />;
      case "6":
        return <CurrencyCrudPage parentLoading={parentLoading} />;
      case "7":
        return <GoldCrudPage parentLoading={parentLoading} />;
      default:
        break;
    }
  };

  const renderItem = ({ item }) => (
    <>
      <View
        style={{
          marginTop: 20,
          marginBottom: 20,
          backgroundColor: "#AAA9BC", // #B0A8B9 , #A9AABC
          // 자산 탭 - 가장 바깥 테두리 색
          borderRadius: 20,
        }}
      >
        <Box w={"100%"}>
          <View style={{ marginTop: 10, alignItems: "center" }}>
            <HStack
              w={"70%"}
              h={70}
              alignItems={"center"}
              justifyContent={"center"}
              borderRadius={35}
              bg={"white"}
            >
              {iconSelectFuntion(item.key)}
              <Text style={{ color: "black", marginLeft: 10, fontSize: 20 }}>
                {item.title}
              </Text>
            </HStack>
          </View>
          <View
            style={{
              marginTop: 10,
              marginBottom: 10,
              // height: "100%",
              alignItems: "center",
            }}
          >
            {contentsFunction(item.key)}
          </View>
        </Box>
      </View>
    </>
  );
  return (
    <View style={{ position: "relative" }}>
      {loading && <Loading isMainPage={true} />}
      <ContentScrollView>
        <Carousel
          data={entries}
          renderItem={renderItem}
          sliderWidth={sliderWidth}
          itemWidth={itemWidth}
        />
        <View style={{ height: footerHeight }}></View>
      </ContentScrollView>
    </View>
  );
}

export default AssetContainer;
