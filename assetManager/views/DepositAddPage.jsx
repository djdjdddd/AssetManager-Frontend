import { Button, Center, VStack } from "native-base";
import { Alert } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import DepositAddContainer from "@pages/DepositAddContainer";
import { useDispatch, useSelector } from "react-redux";
import { depositAdd, depositInitialize } from "../action";
import { IconButton } from "react-native-paper";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { apiPath } from "../services";
import Loading from "@components/Loading";
import ContentScrollView from "@components/ContentScrollView";

function DepositAddPage() {
  console.log("DepoAddPage >>>");

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [isLoading, setIsLoading] = useState(true);
  const [banklist, setBankList] = useState([]);

  useEffect(() => {
    dispatch(depositInitialize());
  }, []); //처음에 초기화

  const { depositStateList } = useSelector((state) => state.deposit);
  const { token } = useSelector((state) => state.login);
  const len = depositStateList.length;
  const nextId = useRef(1);
  const [pass, setPass] = useState(false);

  useEffect(() => {
    axios({
      url: `${apiPath}/deposit/bankList.do`,
      method: "GET",
    })
      .then((res) => {
        setBankList(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    const bool = depositStateList.every(
      (el) =>
        el.endDate !== "" &&
        el.startDate !== "" &&
        !(el.price === 0 || el.price === "") &&
        !(el.rate === 0 || el.rate === "")
    );
    setPass(() => bool);
  }, [depositStateList]);

  const register = useCallback(() => {
    const dateCheck = depositStateList.every((el) => el.startDate < el.endDate);
    console.log("날짜 체크", dateCheck);
    if (dateCheck) {
      console.log("데이터 전송", depositStateList);
      const newDeopsitStateList = depositStateList.map(({ index, ...rest }) => {
        return rest;
      });
      console.log(newDeopsitStateList);
      axios({
        url: `${apiPath}/deposit/add.do/${token}`,
        method: "POST",
        data: newDeopsitStateList, //id도 넘겨줘야됨
      })
        .then((res) => {
          console.log(res);
          Alert.alert(res.data);
          navigation.navigate("Home");
        })
        .catch((err) => {
          console.log(err, "//");
        });
    } else {
      Alert.alert("주의", "가입일이 만기일보다 큰 경우가 있습니다.");
    }
  }, [depositStateList]);

  const addButton = useCallback(() => {
    dispatch(depositAdd(nextId.current));
    nextId.current++;
  }, []);
  console.log("통과여부", pass);
  return (
    <>
      <ContentScrollView>
        <VStack alignItems="center" mt="5" mb="5">
          {depositStateList?.map((item, i) => (
            <DepositAddContainer
              key={item.index}
              item={item}
              nextId={len - 1 === i && nextId}
              isOnlyOne={len === 1 || false}
              bankList={banklist}
            />
          ))}

          <IconButton
            icon="plus-circle" //"note-plus"
            iconColor={pass ? "green" : "gray"}
            size={70}
            disabled={!pass}
            onPress={addButton}
            style={{
              margin: -25,
              padding: 0,
              position: "absolute",
              bottom: 0,
            }}
          />
        </VStack>
        <Center>
          <Button
            w={"40%"}
            colorScheme={pass ? "success" : "gray"}
            disabled={!pass}
            onPress={register}
            m="3"
          >
            등록
          </Button>
        </Center>
      </ContentScrollView>
      {isLoading && <Loading />}
    </>
  );
}
export default DepositAddPage;
