import axios from "axios";
import { View } from "native-base";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { apiPath } from "../../services";
import AssetSurmary from "../../components/AssetSurmary";
import { useNavigation } from "@react-navigation/native";

function CoinCrudPage({ parentLoading }) {
  const { token } = useSelector((state) => state.login);
  const [userCoin, setUserCoin] = useState([]);
  const navigation = useNavigation();
  useEffect(() => {
    axios({
      url: apiPath + `/coin/coinCrud`,
      method: "GET",
      params: {
        userId: token,
      },
    }) //id 넘겨줘야됨
      .then((res) => {
        const result = res.data;
        setUserCoin(result);
        parentLoading();
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const updateOnPress = () => navigation.navigate("TempPage");
  const serviceOnPress = () => navigation.navigate("TempPage");

  return (
    <View bgColor={"white"} w={"90%"} borderRadius={20}>
      <AssetSurmary
        data={userCoin}
        //title={`총 수익률 : ${totalAvgRate}`}
        title={`소유중인 코인 종류 : ${userCoin.length}개`}
        textListInfo={[
          { title: "코인명", key: "coinName" },
          { title: "보유수량", key: "quantity", unit: "개" },
          { title: "평단가", key: "avgPrice", unit: "원", isPrice: true },
          { title: "현재가", key: "currentPrice", unit: "원", isPrice: true },
          { title: "수익률", key: "rateOfReturn" },
        ]}
        updateBtn={{ title: "내역수정", onPress: updateOnPress }}
        serviceBtn={{ title: "코인 서비스", onPress: serviceOnPress }}
      />
    </View>
  );
}

export default CoinCrudPage;
