import { View } from "native-base";
import { apiPath } from "../../services";
import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AssetSurmary from "../../components/AssetSurmary";
import { useNavigation } from "@react-navigation/native";
import { userCarUpdate } from "../../action";

function CarCrudPage({ parentLoading }) {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.login);
  const { userCar } = useSelector((state) => state.userCar);
  const navigation = useNavigation();
  const updateOnPress = () => {
    navigation.navigate("carUpdate");
  };
  const serviceOnPress = () => {
    navigation.navigate("carService");
  };
  useEffect(() => {
    axios({
      url: apiPath + `/car/carCrud`,
      method: "GET",
      params: {
        userId: token,
      },
    }) //id 넘겨줘야됨
      .then((res) => {
        dispatch(userCarUpdate(res.data));
        parentLoading();
      })
      .catch((err) => {});
  }, []);
  return (
    <View bgColor={"white"} w={"90%"} borderRadius={20}>
      <AssetSurmary
        data={userCar}
        title={`소유중인 차량 : ${userCar?.length}대`}
        textListInfo={[
          { title: "제조사", key: "company" },
          { title: "모델명", key: "model" },
          { title: "연식", key: "year", unit: "년식" },
          { title: "현재 예상가격", key: "price", unit: "원", isPrice: true },
        ]}
        updateBtn={{ title: "내역수정", onPress: updateOnPress }}
        serviceBtn={{ title: "차 서비스", onPress: serviceOnPress }}
      />
    </View>
  );
}

export default CarCrudPage;
